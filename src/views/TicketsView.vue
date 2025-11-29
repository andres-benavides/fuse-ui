<template>
  <div class="min-h-screen bg-gray-100">
    <header class="bg-white shadow">
      <div
        class="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center"
      >
        <h1 class="text-xl font-bold">Mis Tickets</h1>
        <div class="flex items-center gap-3">
          <span class="text-sm text-gray-600">
            {{ user?.name }} ({{ user?.email }})
          </span>
          <button @click="logout" class="text-sm text-red-600 hover:underline">
            Logout
          </button>
        </div>
      </div>
    </header>

    <main class="max-w-5xl mx-auto px-4 py-6">
      <!-- Barra de acciones -->
      <div class="mb-4 flex justify-between items-start gap-4">
        <div>
          <h2 class="text-lg font-semibold text-gray-800">
            Listado de tickets
          </h2>
          <!-- Resumen de estados -->
          <div class="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">
            <div class="bg-white shadow rounded-lg p-3">
              <p class="text-xs text-gray-500 uppercase">Activos</p>
              <p class="text-xl font-bold text-gray-800">
                {{ statusCounts.active }}
              </p>
            </div>
            <div class="bg-white shadow rounded-lg p-3">
              <p class="text-xs text-gray-500 uppercase">En Proceso</p>
              <p class="text-xl font-bold text-gray-800">
                {{ statusCounts.in_process }}
              </p>
            </div>
            <div class="bg-white shadow rounded-lg p-3">
              <p class="text-xs text-gray-500 uppercase">Finalizados</p>
              <p class="text-xl font-bold text-gray-800">
                {{ statusCounts.finished }}
              </p>
            </div>
            <div class="bg-white shadow rounded-lg p-3">
              <p class="text-xs text-gray-500 uppercase">Cancelados</p>
              <p class="text-xl font-bold text-gray-800">
                {{ statusCounts.canceled }}
              </p>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <button
            @click="showCreateStoryModal = true"
            class="px-3 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Nueva historia + primer ticket
          </button>
          <button
            @click="showNewTicketModal = true"
            class="px-3 py-2 text-sm bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
          >
            Nuevo ticket
          </button>
        </div>
      </div>

      <!-- Filtros por estado -->
      <div class="mb-4 flex flex-wrap gap-2 text-sm">
        <button
          class="px-3 py-1 rounded-full border"
          :class="
            statusFilter === 'all'
              ? 'bg-indigo-600 text-white border-indigo-600'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          "
          @click="statusFilter = 'all'"
        >
          Todos
        </button>

        <button
          class="px-3 py-1 rounded-full border"
          :class="
            statusFilter === 'active'
              ? 'bg-yellow-500 text-white border-yellow-500'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          "
          @click="statusFilter = 'active'"
        >
          Activos
        </button>

        <button
          class="px-3 py-1 rounded-full border"
          :class="
            statusFilter === 'in_process'
              ? 'bg-blue-500 text-white border-blue-500'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          "
          @click="statusFilter = 'in_process'"
        >
          En Proceso
        </button>

        <button
          class="px-3 py-1 rounded-full border"
          :class="
            statusFilter === 'finished'
              ? 'bg-green-500 text-white border-green-500'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          "
          @click="statusFilter = 'finished'"
        >
          Finalizados
        </button>

        <button
          class="px-3 py-1 rounded-full border"
          :class="
            statusFilter === 'canceled'
              ? 'bg-red-500 text-white border-red-500'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          "
          @click="statusFilter = 'canceled'"
        >
          Cancelados
        </button>
      </div>

      <div v-if="loading" class="text-gray-600">Cargando tickets...</div>

      <div v-else-if="filteredTickets.length === 0" class="text-gray-600">
        No hay tickets para este filtro.
      </div>

      <div v-else class="bg-white shadow rounded-lg overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Proyecto
              </th>
              <th
                class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Historia
              </th>
              <th
                class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Título
              </th>
              <th
                class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Estado
              </th>
              <th
                class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Creado
              </th>
              <th
                class="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="ticket in filteredTickets" :key="ticket.id">
              <td class="px-4 py-2 text-sm text-gray-700">
                {{ ticket.user_story?.project?.name }}
              </td>
              <td class="px-4 py-2 text-sm text-gray-700">
                {{ ticket.user_story?.title }}
              </td>
              <td class="px-4 py-2 text-sm text-gray-700">
                {{ ticket.title }}
              </td>
              <td class="px-4 py-2 text-sm">
                <span :class="statusBadgeClass(ticket.status)">
                  {{ humanStatus(ticket.status) }}
                </span>
              </td>
              <td class="px-4 py-2 text-sm text-gray-500">
                {{ formatDate(ticket.created_at) }}
              </td>
              <td class="px-4 py-2 text-sm text-right space-x-2">
                <button
                  v-if="ticket.status !== 'canceled'"
                  @click="openEditTicketModal(ticket)"
                  class="inline-flex items-center px-2 py-1 text-xs border rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Editar
                </button>
                <button
                  v-if="ticket.status === 'active'"
                  @click="handleCancelTicket(ticket)"
                  class="inline-flex items-center px-2 py-1 text-xs border rounded-md text-red-600 border-red-300 hover:bg-red-50"
                >
                  Cancelar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modales -->
      <CreateStoryModal
        :visible="showCreateStoryModal"
        :projects="projects"
        :loading="createStoryLoading"
        :error="createStoryError"
        @close="showCreateStoryModal = false"
        @submit="handleCreateStorySubmit"
      />

      <NewTicketModal
        :visible="showNewTicketModal"
        :projects="projects"
        :user-stories="userStoriesForNewTicket"
        :loading="newTicketLoading"
        :error="newTicketError"
        @close="showNewTicketModal = false"
        @project-change="loadUserStoriesForNewTicket"
        @submit="handleCreateNewTicketSubmit"
      />

      <EditTicketModal
        :visible="showEditTicketModal"
        :ticket="currentEditingTicket"
        :loading="editTicketLoading"
        :error="editTicketError"
        @close="closeEditTicketModal"
        @submit="handleUpdateTicketSubmit"
      />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import {
  fetchMyTickets,
  createTicketForStory,
  updateTicket,
  cancelTicket,
} from "../api/tickets";
import { fetchProjects } from "../api/projects";
import {
  createUserStoryWithTicket,
  fetchUserStories,
} from "../api/userStories";

import CreateStoryModal from "../components/modals/CreateStoryModal.vue";
import NewTicketModal from "../components/modals/NewTicketModal.vue";
import EditTicketModal from "../components/modals/EditTicketModal.vue";

const router = useRouter();

const user = ref(null);
const allTickets = ref([]);
const loading = ref(false);
const statusFilter = ref("all");

const projects = ref([]);

const userStoriesForNewTicket = ref([]);

const showCreateStoryModal = ref(false);
const createStoryLoading = ref(false);
const createStoryError = ref("");

const showNewTicketModal = ref(false);
const newTicketLoading = ref(false);
const newTicketError = ref("");

const showEditTicketModal = ref(false);
const editTicketLoading = ref(false);
const editTicketError = ref("");
const currentEditingTicket = ref(null);

const filteredTickets = computed(() => {
  if (statusFilter.value === "all") return allTickets.value;
  return allTickets.value.filter((t) => t.status === statusFilter.value);
});

const statusCounts = computed(() => {
  const counts = {
    active: 0,
    in_process: 0,
    finished: 0,
    canceled: 0,
  };

  for (const t of allTickets.value) {
    if (counts[t.status] !== undefined) {
      counts[t.status] += 1;
    }
  }

  return counts;
});

const loadTickets = async () => {
  if (!user.value) return;

  loading.value = true;
  try {
    const { data: ticketsData } = await fetchMyTickets(user.value.id);
    allTickets.value = ticketsData;
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const handleCancelTicket = async (ticket) => {
  const confirmed = window.confirm(
    "¿Seguro que quieres cancelar este ticket? Esta acción no se puede deshacer."
  );

  if (!confirmed) return;

  try {
    await cancelTicket(ticket.id);
    await loadTickets();
  } catch (e) {
    console.error(e);
    alert(
      e.response?.data?.error ||
        "No se pudo cancelar el ticket. Intenta de nuevo."
    );
  }
};

onMounted(async () => {
  const storedUser = localStorage.getItem("user");
  if (!storedUser) {
    return router.push("/login");
  }

  user.value = JSON.parse(storedUser);

  loading.value = true;
  try {
    const [{ data: ticketsData }, { data: projectsData }] = await Promise.all([
      fetchMyTickets(user.value.id),
      fetchProjects(user.value.company_id),
    ]);

    allTickets.value = ticketsData;
    projects.value = projectsData;
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
});

const logout = () => {
  localStorage.removeItem("user");
  router.push("/login");
};

// ---- handlers para las modales ----

// Crear historia + primer ticket
const handleCreateStorySubmit = async (form) => {
  if (!user.value) return;

  createStoryLoading.value = true;
  createStoryError.value = "";

  try {
    const payload = {
      user_story: {
        title: form.storyTitle,
        description: form.storyDescription,
      },
      ticket: {
        title: form.ticketTitle,
        description: form.ticketDescription,
        comments: form.ticketComments,
      },
      user_id: user.value.id,
    };

    await createUserStoryWithTicket(form.projectId, payload);
    await loadTickets();
    showCreateStoryModal.value = false;
  } catch (e) {
    console.error(e);
    createStoryError.value =
      e.response?.data?.errors?.join(", ") || "Error al crear la historia";
  } finally {
    createStoryLoading.value = false;
  }
};

// Nuevo ticket: cargar historias al cambiar proyecto
const loadUserStoriesForNewTicket = async (projectId) => {
  if (!projectId) {
    userStoriesForNewTicket.value = [];
    return;
  }

  try {
    const { data } = await fetchUserStories(projectId);
    userStoriesForNewTicket.value = data;
  } catch (e) {
    console.error(e);
    userStoriesForNewTicket.value = [];
  }
};

// Nuevo ticket: submit
const handleCreateNewTicketSubmit = async (form) => {
  if (!user.value) return;

  if (!form.userStoryId) {
    newTicketError.value = "Selecciona una historia de usuario.";
    return;
  }

  newTicketLoading.value = true;
  newTicketError.value = "";

  try {
    const payload = {
      ticket: {
        title: form.title,
        description: form.description,
        comments: form.comments,
      },
      user_id: user.value.id,
    };

    await createTicketForStory(form.userStoryId, payload);
    await loadTickets();
    showNewTicketModal.value = false;
  } catch (e) {
    console.error(e);
    newTicketError.value =
      e.response?.data?.errors?.join(", ") || "Error al crear el ticket";
  } finally {
    newTicketLoading.value = false;
  }
};

// Editar ticket
const openEditTicketModal = (ticket) => {
  currentEditingTicket.value = ticket;
  editTicketError.value = "";
  showEditTicketModal.value = true;
};

const closeEditTicketModal = () => {
  showEditTicketModal.value = false;
  currentEditingTicket.value = null;
};

const handleUpdateTicketSubmit = async (form) => {
  if (!currentEditingTicket.value) return;

  editTicketLoading.value = true;
  editTicketError.value = "";

  try {
    const payload = {
      ticket: {
        title: form.title,
        description: form.description,
        comments: form.comments,
        status: form.status,
      },
    };

    const userStoryId = currentEditingTicket.value.user_story?.id;
    const ticketId = currentEditingTicket.value.id;

    await updateTicket(userStoryId, ticketId, payload);
    await loadTickets();

    showEditTicketModal.value = false;
    currentEditingTicket.value = null;
  } catch (e) {
    console.error(e);
    editTicketError.value =
      e.response?.data?.errors?.join(", ") || "Error al actualizar el ticket";
  } finally {
    editTicketLoading.value = false;
  }
};

const statusBadgeClass = (status) => {
  const base = "inline-flex px-2 py-1 rounded-full text-xs font-semibold";
  switch (status) {
    case "active":
      return `${base} bg-yellow-100 text-yellow-800`;
    case "in_process":
      return `${base} bg-blue-100 text-blue-800`;
    case "finished":
      return `${base} bg-green-100 text-green-800`;
    case "canceled":
      return `${base} bg-red-100 text-red-800`;
    default:
      return `${base} bg-gray-100 text-gray-800`;
  }
};

const humanStatus = (status) => {
  switch (status) {
    case "active":
      return "Activo";
    case "in_process":
      return "En Proceso";
    case "finished":
      return "Finalizado";
    case "canceled":
      return "Cancelado";
    default:
      return status;
  }
};

const formatDate = (iso) => {
  if (!iso) return "";
  return new Date(iso).toLocaleString();
};
</script>
