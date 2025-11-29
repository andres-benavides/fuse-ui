<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="w-full max-w-md bg-white shadow-md rounded-lg p-8">
      <h1 class="text-2xl font-bold mb-6 text-center">Login</h1>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1">Email</label>
          <input
            v-model="form.email"
            type="email"
            class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Password</label>
          <input
            v-model="form.password"
            type="password"
            class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <p v-if="error" class="text-red-600 text-sm">
          {{ error }}
        </p>

        <button
          type="submit"
          class="w-full bg-indigo-600 text-white py-2 rounded-md font-semibold hover:bg-indigo-700 transition cursor-pointer disabled:opacity-50"
          :disabled="loading"
        >
          <span v-if="!loading">Login</span>
          <span v-else>Ingresando...</span>
        </button>
      </form>

      <div class="mt-4 text-xs text-gray-500 text-center">
        (Usuario de prueba: user1@demo.com / password)
      </div>
      <div class="mt-4 text-center text-sm">
        <span class="text-gray-600">¿No tienes cuenta?</span>
        <button
          type="button"
          class="ml-1 text-indigo-600 hover:underline cursor-pointer"
          @click="goToRegister"
        >
          Crear cuenta
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { login } from "../api/auth";

const router = useRouter();

const form = reactive({
  email: "user1@demo.com",
  password: "password",
});
const goToRegister = () => {
  console.log("Navigating to register");
  router.push("/register");
};

const loading = ref(false);
const error = ref("");

const handleSubmit = async () => {
  loading.value = true;
  error.value = "";

  try {
    const { data } = await login({
      email: form.email,
      password: form.password,
    });

    localStorage.setItem("user", JSON.stringify(data.user));

    router.push("/tickets");
  } catch (err) {
    error.value = err.response?.data?.error || "Error en el login";
  } finally {
    loading.value = false;
  }
};
</script>
