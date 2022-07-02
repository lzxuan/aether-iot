const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/Index.vue")
      },
      {
        path: "lighting",
        name: "Lighting",
        component: () => import("pages/Lighting.vue"),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: "temperature",
        name: "Temperature",
        component: () => import("pages/Temperature.vue"),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: "security",
        name: "Security",
        component: () => import("pages/Security.vue"),
        meta: {
          requiresAuth: true
        }
      }
    ]
  },
  {
    path: "/signin",
    component: () => import("layouts/GuestLayout.vue"),
    children: [
      {
        path: "",
        name: "Sign In",
        component: () => import("pages/SignIn.vue")
      }
    ]
  },
  {
    path: "/m/:id",
    component: () => import("layouts/GuestLayout.vue"),
    children: [
      {
        path: "",
        name: "Message",
        component: () => import("pages/Message.vue")
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "*",
    component: () => import("pages/Error404.vue")
  }
];

export default routes;
