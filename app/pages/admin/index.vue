<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div class="flex items-center space-x-4">
            <h1 class="text-2xl font-bold text-gray-900">Painel Administrativo</h1>
            <span class="text-sm text-gray-500">L0gik Leads</span>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-600">Total: {{ totalLeads }} leads</span>
            <button 
              @click="exportLeads" 
              class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center space-x-2"
              :disabled="isExporting"
            >
              <span v-if="isExporting">Exportando...</span>
              <span v-else>📊 Exportar CSV</span>
            </button>
            <button @click="logout" class="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">
              Sair
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span class="text-white text-sm font-bold">👥</span>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Total Leads</p>
              <p class="text-2xl font-semibold text-gray-900">{{ totalLeads }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span class="text-white text-sm font-bold">📈</span>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Hoje</p>
              <p class="text-2xl font-semibold text-gray-900">{{ todayLeads }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                <span class="text-white text-sm font-bold">📅</span>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Esta Semana</p>
              <p class="text-2xl font-semibold text-gray-900">{{ weekLeads }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <span class="text-white text-sm font-bold">📊</span>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Este Mês</p>
              <p class="text-2xl font-semibold text-gray-900">{{ monthLeads }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow mb-6 p-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div class="flex-1 max-w-lg">
            <div class="relative">
              <input
                v-model="searchQuery"
                @input="searchLeads"
                type="text"
                placeholder="Buscar por nome ou email..."
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
              />
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center">
                <span class="text-gray-400">🔍</span>
              </div>
            </div>
          </div>
          <div class="flex space-x-3">
            <button 
              @click="showNewLeadModal = true"
              class="bg-white text-blue-600 border border-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 flex items-center space-x-2"
            >
              <span>➕</span>
              <span>Novo Lead</span>
            </button>
            <button 
              @click="loadLeads"
              class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
              :disabled="isLoading"
            >
              {{ isLoading ? '🔄' : '🔄' }} Atualizar
            </button>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div v-if="isLoading" class="p-8 text-center">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p class="mt-2 text-gray-600">Carregando leads...</p>
        </div>

        <div v-else-if="filteredLeads.length === 0" class="p-8 text-center">
          <p class="text-gray-500">
            {{ searchQuery ? 'Nenhum lead encontrado para a busca.' : 'Nenhum lead cadastrado ainda.' }}
          </p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telefone</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cargo</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="lead in filteredLeads" :key="lead.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ lead.nome }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500">{{ lead.email }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500">{{ lead.telefone }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500">{{ lead.cargo }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500">{{ formatDate(lead.createdAt) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button 
                    @click="viewLead(lead)"
                    class="text-blue-600 hover:text-blue-900"
                    title="Ver detalhes"
                  >
                    👁️
                  </button>
                  <button 
                    @click="editLead(lead)"
                    class="text-yellow-600 hover:text-yellow-900"
                    title="Editar"
                  >
                    ✏️
                  </button>
                  <button 
                    @click="deleteLead(lead)"
                    class="text-red-600 hover:text-red-900"
                    title="Excluir"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="bg-gray-50 px-6 py-3 flex items-center justify-between">
          <div class="flex-1 flex justify-between sm:hidden">
            <button
              @click="currentPage--"
              :disabled="currentPage === 1"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Anterior
            </button>
            <button
              @click="currentPage++"
              :disabled="currentPage === totalPages"
              class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Próximo
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Mostrando {{ ((currentPage - 1) * pageSize) + 1 }} até {{ Math.min(currentPage * pageSize, totalLeads) }} de {{ totalLeads }} resultados
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  @click="currentPage--"
                  :disabled="currentPage === 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  ← Anterior
                </button>
                <button
                  @click="currentPage++"
                  :disabled="currentPage === totalPages"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  Próximo →
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </main>

    <div v-if="showNewLeadModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-bold text-gray-900">Ação Rápida</h3>
            <button @click="showNewLeadModal = false" class="text-gray-400 hover:text-gray-600">
              ✕
            </button>
          </div>
          <div class="space-y-3">
            <button 
              @click="createNewLead"
              class="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2"
            >
              <span>📝</span>
              <span>Formulário Completo</span>
            </button>
            <button 
              @click="quickCreateLead"
              class="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 flex items-center justify-center space-x-2"
            >
              <span>⚡</span>
              <span>Criação Rápida</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showQuickCreateModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-bold text-gray-900">Criar Lead Rápido</h3>
            <button @click="closeQuickCreate" class="text-gray-400 hover:text-gray-600">
              ✕
            </button>
          </div>
          <form @submit.prevent="saveQuickLead" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Nome *</label>
              <input
                v-model="quickForm.nome"
                type="text"
                required
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2 bg-white text-gray-900"
                placeholder="Nome completo"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Email *</label>
              <input
                v-model="quickForm.email"
                type="email"
                required
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2 bg-white text-gray-900"
                placeholder="email@exemplo.com"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Telefone</label>
              <input
                v-model="quickForm.telefone"
                type="tel"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2 bg-white text-gray-900"
                placeholder="(11) 99999-9999"
              />
            </div>
            <div class="flex space-x-3 pt-4">
              <button
                type="button"
                @click="closeQuickCreate"
                class="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="isQuickSaving"
                class="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {{ isQuickSaving ? 'Salvando...' : 'Criar' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
onMounted(() => {
  const hasToken = document.cookie.includes('auth-token=') || 
                  localStorage.getItem('auth-token') || 
                  sessionStorage.getItem('auth-token');
  
  if (!hasToken) {
    window.location.href = '/admin/login';
    return;
  }
  
  loadLeads();
});

const leads = ref([]);
const filteredLeads = ref([]);
const isLoading = ref(true);
const isExporting = ref(false);
const searchQuery = ref('');
const currentPage = ref(1);
const pageSize = ref(10);
const totalLeads = ref(0);
const todayLeads = ref(0);
const weekLeads = ref(0);
const monthLeads = ref(0);
const showNewLeadModal = ref(false);
const showQuickCreateModal = ref(false);
const isQuickSaving = ref(false);

const quickForm = ref({
  nome: '',
  email: '',
  telefone: ''
});

const totalPages = computed(() => Math.ceil(filteredLeads.value.length / pageSize.value));

const loadLeads = async () => {
  isLoading.value = true;
  try {
    const response = await $fetch('http://127.0.0.1:3000/api/admin/leads');
    if (response.success) {
      leads.value = response.leads;
      filteredLeads.value = leads.value;
      totalLeads.value = leads.value.length;
      
      const today = new Date();
      const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);
      
      todayLeads.value = leads.value.filter(lead => 
        new Date(lead.createdAt) >= startOfToday
      ).length;
      
      weekLeads.value = leads.value.filter(lead => 
        new Date(lead.createdAt) >= startOfWeek
      ).length;
      
      monthLeads.value = leads.value.filter(lead => 
        new Date(lead.createdAt) >= startOfMonth
      ).length;
    }
  } catch (error) {
    console.error('Erro ao carregar leads:', error);
  } finally {
    isLoading.value = false;
  }
};

const searchLeads = () => {
  if (!searchQuery.value) {
    filteredLeads.value = leads.value;
  } else {
    const query = searchQuery.value.toLowerCase();
    filteredLeads.value = leads.value.filter(lead =>
      lead.nome.toLowerCase().includes(query) ||
      lead.email.toLowerCase().includes(query)
    );
  }
  currentPage.value = 1;
};

const viewLead = (lead) => {
  navigateTo(`/admin/leads/${lead.id}`);
};

const editLead = (lead) => {
  navigateTo(`/admin/leads/edit/${lead.id}`);
};

const deleteLead = async (lead) => {
  if (confirm(`Tem certeza que deseja excluir o lead "${lead.nome}"?`)) {
    try {
      const response = await $fetch(`http://127.0.0.1:3000/api/leads/${lead.id}`, {
        method: 'DELETE'
      });
      
      if (response.success) {
        alert('Lead deletado com sucesso!');
        await loadLeads();
      }
    } catch (error) {
      console.error('Erro ao deletar lead:', error);
      alert('Erro ao deletar lead. Tente novamente.');
    }
  }
};

const createNewLead = () => {
  showNewLeadModal.value = false;
  navigateTo('/admin/leads/new');
};

const quickCreateLead = () => {
  showNewLeadModal.value = false;
  showQuickCreateModal.value = true;
};

const closeQuickCreate = () => {
  showQuickCreateModal.value = false;
  quickForm.value = {
    nome: '',
    email: '',
    telefone: ''
  };
};

const saveQuickLead = async () => {
  isQuickSaving.value = true;
  try {
    const response = await $fetch('http://127.0.0.1:3000/api/leads', {
      method: 'POST',
      body: JSON.stringify({
        ...quickForm.value,
        ip: '127.0.0.1',
        userAgent: 'Admin Panel - Quick Create'
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.success) {
      alert('Lead criado com sucesso!');
      closeQuickCreate();
      await loadLeads();
    }
  } catch (error) {
    console.error('Erro ao criar lead:', error);
    alert('Erro ao criar lead. Tente novamente.');
  } finally {
    isQuickSaving.value = false;
  }
};

const exportLeads = async () => {
  isExporting.value = true;
  try {
    const response = await fetch('http://127.0.0.1:3000/api/leads/export');
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error('Erro ao exportar leads:', error);
  } finally {
    isExporting.value = false;
  }
};

const logout = () => {
  document.cookie = 'auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  localStorage.removeItem('auth-token');
  sessionStorage.removeItem('auth-token');
  window.location.href = '/admin/login';
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
</script>