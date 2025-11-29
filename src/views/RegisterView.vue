<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="w-full max-w-md bg-white shadow-md rounded-lg p-8">
      <h1 class="text-2xl font-bold mb-6 text-center">Crear cuenta</h1>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1">Nombre completo</label>
          <input
            v-model="form.name"
            type="text"
            class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1"
            >Correo electrónico</label
          >
          <input
            v-model="form.email"
            type="email"
            class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Compañía</label>
          <select
            v-model="form.companyId"
            class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            required
          >
            <option value="" disabled>Selecciona una compañía</option>
            <option
              v-for="company in companies"
              :key="company.id"
              :value="company.id"
            >
              {{ company.name }}
            </option>
          </select>
        </div>

        <div class="grid grid-cols-1 gap-3">
          <div>
            <label class="block text-sm font-medium mb-1">Contraseña</label>
            <input
              v-model="form.password"
              type="password"
              class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1"
              >Confirmar contraseña</label
            >
            <input
              v-model="form.passwordConfirmation"
              type="password"
              class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              required
            />
          </div>
        </div>

        <p v-if="error" class="text-sm text-red-600">
          {{ error }}
        </p>

        <button
          type="submit"
          class="w-full bg-indigo-600 text-white py-2 rounded-md font-semibold hover:bg-indigo-700 transition text-sm"
          :disabled="loading"
        >
          <span v-if="!loading">Crear cuenta</span>
          <span v-else>Creando cuenta...</span>
        </button>
      </form>

      <div class="mt-4 text-center text-sm">
        <button
          type="button"
          class="text-gray-600 hover:underline"
          @click="goToLogin"
        >
          Volver al login
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { fetchCompanies } from "../api/companies";
import { registerUser } from "../api/users";

const router = useRouter();

const companies = ref([]);
const loading = ref(false);
const error = ref("");

const form = ref({
  name: "",
  email: "",
  companyId: "",
  password: "",
  passwordConfirmation: "",
});

onMounted(async () => {
  try {
    const { data } = await fetchCompanies();
    companies.value = data;
  } catch (e) {
    console.error(e);
  }
});

const handleSubmit = async () => {
  error.value = "";
  loading.value = true;

  try {
    await registerUser({
      user: {
        name: form.value.name,
        email: form.value.email,
        company_id: form.value.companyId,
        password: form.value.password,
        password_confirmation: form.value.passwordConfirmation,
      },
    });

    router.push("/login");
  } catch (e) {
    console.error(e);
    error.value =
      e.response?.data?.errors?.join(", ") || "Error al crear la cuenta";
  } finally {
    loading.value = false;
  }
};

const goToLogin = () => {
  router.push("/login");
};
</script>
