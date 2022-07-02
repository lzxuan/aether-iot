<template>
  <q-card>
    <q-card-section :class="Background">
      <div class="row items-center justify-center q-py-md">
        <q-icon name="wb_sunny" class="text-white" size="128px" v-if="Sun" />
        <q-icon name="cloud" class="text-white" size="128px" v-if="Cloud" />
        <q-img
          src="~assets/rain.png"
          style="height: 128px; width: 128px;"
          v-if="Rain"
        />
        <span class="text-h1 q-pl-xl">{{ Temperature }}°C</span>
      </div>
    </q-card-section>
    <q-separator />
    <q-card-section>
      <q-list>
        <q-item tag="label" v-ripple>
          <q-item-section>
            <q-item-label>Power</q-item-label>
            <q-item-label caption>Power of the fan</q-item-label>
          </q-item-section>
          <q-item-section avatar>
            <q-toggle
              :label="PowerLabel"
              color="red"
              v-model="Power"
              style="width: 120px;"
              :disable="AutoMode"
              @input="togglePower"
            />
          </q-item-section>
        </q-item>

        <q-item tag="label" v-ripple>
          <q-item-section>
            <q-item-label>Mode</q-item-label>
            <q-item-label caption
              >Auto or manually control the fan</q-item-label
            >
          </q-item-section>
          <q-item-section avatar>
            <q-toggle
              :label="ManualLabel"
              color="blue"
              v-model="Manual"
              style="width: 120px;"
              @input="toggleMode"
            />
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>

    <q-separator />

    <q-card-section>
      <q-btn-toggle
        v-model="FanSpeed"
        spread
        no-caps
        toggle-color="red-3"
        color="white"
        text-color="black"
        :options="[
          { value: 1, slot: 'one' },
          { value: 2, slot: 'two' },
          { value: 3, slot: 'three' }
        ]"
        :disable="AutoMode"
        @input="updateFirebase('/FanSpeed', FanSpeed)"
      >
        <template v-slot:one>
          <q-icon name="toys" size="32px" class="q-my-sm text-cyan-11" />
        </template>

        <template v-slot:two>
          <q-icon name="toys" size="32px" class="q-my-sm text-cyan-13" />
          <q-icon name="toys" size="32px" class="q-my-sm text-cyan-13" />
        </template>

        <template v-slot:three>
          <q-icon name="toys" size="32px" class="q-my-sm text-light-blue-13" />
          <q-icon name="toys" size="32px" class="q-my-sm text-light-blue-13" />
          <q-icon name="toys" size="32px" class="q-my-sm text-light-blue-13" />
        </template>
      </q-btn-toggle>
    </q-card-section>
  </q-card>
</template>

<script>
const DEVICE_TEMPERATURE =
  process.env.DEVICE_DB + "/" + process.env.TEMPERATURE_DB;

export default {
  name: "Controls",
  data() {
    return {
      TEMPERATURE_REF:
        this.$store.getters["auth/user"].uid + "/" + DEVICE_TEMPERATURE,
      Power: true,
      PowerLabel: "Power On",
      AutoMode: true,
      Manual: true,
      ManualLabel: "Manual",
      FanSpeed: 0,
      Sun: false,
      Cloud: false,
      Rain: false,
      Background: "bg-light-blue-11",
      Temperature: "-"
    };
  },
  methods: {
    togglePower() {
      this.updateFirebase("/Power", this.Power, this.setPowerUI);
    },
    setPowerUI(power) {
      this.PowerLabel = power ? "Power On" : "Power Off";
    },
    toggleMode() {
      if (!this.Manual && !this.Power) {
        this.Power = true;
        this.updateFirebase("/Power", this.Power, this.setPowerUI);
      }
      this.updateFirebase("/Manual", this.Manual, this.setModeUI);
    },
    setModeUI(manual) {
      if (manual) {
        this.AutoMode = false;
        this.ManualLabel = "Manual";
      } else {
        this.AutoMode = true;
        this.ManualLabel = "Auto";
      }
    },
    setWeatherUI(temperature) {
      if (temperature > 30) {
        this.Sun = true;
        this.Cloud = false;
        this.Rain = false;
        this.Background = "bg-orange-4";
      } else if (temperature > 20) {
        this.Sun = false;
        this.Cloud = true;
        this.Rain = false;
        this.Background = "bg-deep-purple-3";
      } else {
        this.Sun = false;
        this.Cloud = false;
        this.Rain = true;
        this.Background = "bg-light-blue-11";
      }
      this.Temperature = temperature;
    },
    setFanSpeed(speed) {
      this.FanSpeed = speed;
    },
    updateFirebase(ref, data, setUI = null) {
      this.$firebase
        .database()
        .ref(this.TEMPERATURE_REF + ref)
        .set(data, function(error) {
          if (error) {
            console.log(error);
          } else {
            if (setUI) {
              setUI(data);
            }
          }
        });
    }
  },
  mounted() {
    this.$firebase
      .database()
      .ref(this.TEMPERATURE_REF)
      .once("value")
      .then(snapshot => {
        if (snapshot.val()) {
          if (typeof snapshot.val().Manual !== "undefined") {
            this.Manual = snapshot.val().Manual;
            this.setModeUI(snapshot.val().Manual);
          }
          if (typeof snapshot.val().Power !== "undefined") {
            this.Power = snapshot.val().Power;
            this.setPowerUI(snapshot.val().Power);
          }

          const setWeatherUI = this.setWeatherUI;

          this.$firebase
            .database()
            .ref(this.WEATHER_REF + "/Temperature")
            .on("value", function(snapshot) {
              if (typeof snapshot.val() !== undefined) {
                setWeatherUI(snapshot.val());
              }
            });

          const setFanSpeed = this.setFanSpeed;

          this.$firebase
            .database()
            .ref(this.WEATHER_REF + "/FanSpeed")
            .on("value", function(snapshot) {
              if (typeof snapshot.val() !== undefined) {
                setFanSpeed(snapshot.val());
              }
            });
        }
      });
  }
};
</script>
