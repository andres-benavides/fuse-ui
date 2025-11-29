<template>
  <div
    v-if="visible"
    class="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-40 overflow-y-auto"
  >
    <div class="w-full flex justify-center px-4 py-8">
      <div
        class="bg-white rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <div class="flex justify-between items-center px-6 pt-6 pb-4 border-b">
          <h3 class="text-lg font-semibold">Nuevo ticket</h3>
          <button
            @click="$emit('close')"
            class="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4 px-6 pb-6 pt-2">
          <!-- Proyecto -->
          <div>
            <label class="block text-sm font-medium mb-1">Proyecto</label>
            <select
              v-model="form.projectId"
              @change="onProjectChange"
              class="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            >
              <option value="" disabled>Selecciona un proyecto</option>
              <option
                v-for="project in projects"
                :key="project.id"
                :value="project.id"
              >
                {{ project.name }}
              </option>
            </select>
          </div>

          <!-- Historia de usuario -->
          <div>
            <label class="block text-sm font-medium mb-1">
              Historia de usuario
            </label>
            <select
              v-model="form.userStoryId"
              class="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              :disabled="userStories.length === 0"
              required
            >
              <option value="" disabled>
                {{
                  userStories.length
                    ? "Selecciona una historia"
                    : "Primero selecciona un proyecto"
                }}
              </option>
              <option
                v-for="story in userStories"
                :key="story.id"
                :value="story.id"
              >
                {{ story.title }}
              </option>
            </select>
          </div>

          <!-- Datos del ticket -->
          <div class="grid grid-cols-1 gap-3">
            <div>
              <label class="block text-sm font-medium mb-1">
                Título del ticket
              </label>
              <input
                v-model="form.title"
                type="text"
                class="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">
                Descripción del ticket
              </label>
              <textarea
                v-model="form.description"
                rows="2"
                class="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              ></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Comentarios</label>
              <textarea
                v-model="form.comments"
                rows="2"
                class="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              ></textarea>
            </div>
          </div>

          <p v-if="error" class="text-sm text-red-600">
            {{ error }}
          </p>

          <div class="flex justify-end gap-2 pt-2">
            <button
              type="button"
              @click="$emit('close')"
              class="px-3 py-2 text-sm border rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="px-3 py-2 text-sm bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
              :disabled="loading"
            >
              <span v-if="!loading">Guardar</span>
              <span v-else>Guardando...</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  visible: { type: Boolean, required: true },
  projects: { type: Array, required: true },
  userStories: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  error: { type: String, default: "" },
});

const emit = defineEmits(["close", "submit", "project-change"]);

const form = ref({
  projectId: "",
  userStoryId: "",
  title: "",
  description: "",
  comments: "",
});

watch(
  () => props.visible,
  (visible) => {
    if (visible) {
      form.value = {
        projectId: "",
        userStoryId: "",
        title: "",
        description: "",
        comments: "",
      };
    }
  }
);

const onProjectChange = () => {
  emit("project-change", form.value.projectId);
  form.value.userStoryId = "";
};

const handleSubmit = () => {
  emit("submit", { ...form.value });
};
</script>
