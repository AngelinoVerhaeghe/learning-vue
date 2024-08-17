import { defineStore } from "pinia";
import type { User } from "@/types/User";
import { computed, onMounted, ref } from "vue";
import api from "@/api/axios";
import { transformUser } from "@/utils/transformUser";

export const useUserStore = defineStore("user", () => {
  const users = ref<User[]>();
  const user = ref<User | null>(null);

  // Function to initialize the user from localStorage
  const initializeUser = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        user.value = JSON.parse(storedUser) as User;
      } catch (error) {
        console.error("Failed to parse user from localStorage", error);
      }
    }
  };

  // Call initializeUser when the store is created
  onMounted(() => {
    initializeUser();
  });

  const registerUser = async (
    UserName: string,
    email: string,
    password: string,
  ) => {
    if (!UserName || UserName.trim() === "") {
      throw new Error("Username is required");
    }

    if (!email || email.trim() === "") {
      throw new Error("Email is required");
    }

    if (!password || password.trim() === "") {
      throw new Error("Password is required");
    }

    try {
      const response = await api.post("/api/register", {
        first_name: "",
        last_name: "",
        user_name: UserName,
        email: email,
        password: password,
        is_active: true,
      });

      // Convert the user object to the frontend format
      const apiUser = response.data.user;
      const formattedUser = {
        id: apiUser.id,
        userName: apiUser.user_name,
        email: apiUser.email,
      };

      // Save the token in local storage
      localStorage.setItem("token", response.data.token);
      // Save the formattedUser object in local storage
      localStorage.setItem("user", JSON.stringify(formattedUser));

      // Change the user state here in the store
      // Assertions are used to convert the object to the correct type, set as User
      user.value = formattedUser as User;
    } catch (error) {
      console.error("Failed to register user:", error);
    }
  };

  const loginUser = async (email: string, password: string) => {
    if (!email || email.trim() === "") {
      throw new Error("Email is required");
    }

    if (!password || password.trim() === "") {
      throw new Error("Password is required");
    }

    try {
      const response = await api.post("/api/login", {
        email: email,
        password: password,
      });

      // Convert the user object to the frontend format
      const apiUser = response.data.user;
      const formattedUser = {
        id: apiUser.id,
        userName: apiUser.user_name,
        email: apiUser.email,
      };

      // Save the token in local storage
      localStorage.setItem("token", response.data.token);
      // Save the formattedUser object in local storage
      localStorage.setItem("user", JSON.stringify(formattedUser));

      // Change the user state here in the store
      // Assertions are used to convert the object to the correct type, set as User
      user.value = formattedUser as User;
    } catch (error: any) {
      console.error("Failed to login user:", error);
      // Return specific error message based on the server response
      if (error.response && error.response.data && error.response.data.error) {
        throw new Error(error.response.data.error);
      } else {
        throw new Error("An unexpected error occurred");
      }
    }
  };

  const logoutUser = () => {
    user.value = null;
  };

  const getUsers = async () => {
    try {
      const response = await api.get("/api/users");
      // Convert the user objects to the frontend format with the transformUser utility function
      users.value = response.data.users.map(transformUser);
    } catch (error) {
      console.error("Failed to get users:", error);
    }
  };

  const getUser = computed(() => user.value);

  return {
    users,
    registerUser,
    loginUser,
    initializeUser,
    logoutUser,
    getUser,
    getUsers,
  };
});
