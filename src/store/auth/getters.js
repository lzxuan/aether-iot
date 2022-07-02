export function isAuthenticated(state) {
  return state.user !== null;
}

export function user(state) {
  return state.user;
}
