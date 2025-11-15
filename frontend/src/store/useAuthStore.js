import { fa, is } from "zod/v4/locales";
import { create } from "zustand";

export const useAuthStore = create((set) => ({
  authUser: { name: "jhon doe", _id: 123, age: 25 },
  isLoading: false,
  isLoggedIn: false,

  login: () => {
    console.log("login called");
    set({ isLoggedIn: true });
  },
}));
