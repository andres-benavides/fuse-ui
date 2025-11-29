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
          <h3 class="text-lg font-semibold">Editar ticket</h3>
          <button
            @click="$emit('close')"
            class="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4 px-6 pb-6 pt-2">
          <div>
            <label class="block text-sm font-medium mb-1">Proyecto</label>
            <p class="text-sm text-gray-800">
              {{ ticket?.user_story?.project?.name }}
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">
              Historia de usuario
            </label>
            <p class="text-sm text-gray-800">
              {{ ticket?.user_story?.title }}
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">
              Título del ticket
            </label>
            <input
              v-model="form.title"
              type="text"
              class="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Descripción</label>
            <textarea
              v-model="form.description"
              rows="2"
              class="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Comentarios</label>
            <textarea
              v-model="form.comments"
              rows="2"
              class="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Estado</label>
            <select
              v-model="form.status"
              class="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="active">Activo</option>
              <option value="in_process">En Proceso</option>
              <option value="finished">Finalizado</option>
              <option value="canceled">Cancelado</option>
            </select>
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
              class="px-3 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              :disabled="loading"
            >
              <span v-if="!loading">Guardar cambios</span>
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
  ticket: { type: Object, default: null },
  loading: { type: Boolean, default: false },
  error: { type: String, default: "" },
});

const emit = defineEmits(["close", "submit"]);

const form = ref({
  title: "",
  description: "",
  comments: "",
  status: "active",
});

watch(
  () => props.ticket,
  (ticket) => {
    if (ticket) {
      form.value = {
        title: ticket.title || "",
        description: ticket.description || "",
        comments: ticket.comments || "",
        status: ticket.status || "active",
      };
    }
  },
  { immediate: true }
);

watch(
  () => props.visible,
  (visible) => {
    if (!visible) {
      // opcional: limpiar
    }
  }
);

const handleSubmit = () => {
  emit("submit", { ...form.value });
};
</script>
