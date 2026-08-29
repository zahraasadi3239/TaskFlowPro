import { save, load, remove } from "../utils/storage.js";

const AUTH_KEY = "auth-user";

export function getCurrentUser() {
  return load(AUTH_KEY);
}

export function login(user) {
  save(AUTH_KEY, user);
}

export function logout() {
  remove(AUTH_KEY);
}

export function isAuthenticated() {
  return Boolean(getCurrentUser());
}
