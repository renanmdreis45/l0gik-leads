<template>
  <div class="min-h-screen bg-gray-50">
    
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div class="flex justify-start">
            <h1 class="text-2xl font-bold text-gray-900">Painel Administrativo - L0gik Leads</h1>
          </div>
          <div class="flex items-center space-x-4">
            <button
              @click="exportLeads"
              class="btn-secondary"
              :disabled="isExporting"
            >
              {{ isExporting ? 'Exportando...' : 'Exportar Excel' }}
            </button>
            <button @click="handleLogout" class="btn-danger">
              Sair
            </button>
          </div>
        </div>
      </div>
    </header>

    
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      
      <div class="px-4 py-6 sm:px-0">
        <div class="flex flex-col sm:flex-row justify-between items-center mb-6">
          <div class="mb-4 sm:mb-0">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Buscar por nome, email, telefone ou cargo..."
              class="form-input w-full sm:w-96"
              @input="searchLeads"
            />
          </div>
          <div class="text-sm text-gray-500">
            Total: {{ filteredLeads.length }} leads
          </div>
        </div>

        
        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
          <div v-if="isLoading" class="p-8 text-center">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p class="mt-2 text-gray-600">Carregando leads...</p>
          </div>

          <div v-else-if="filteredLeads.length === 0" class="p-8 text-center">
            <p class="text-gray-500">
              {{ searchQuery ? 'Nenhum lead encontrado com os critérios de busca.' : 'Nenhum lead cadastrado ainda.' }}
            </p>
          </div>

          <div v-else class="overflow-x-auto">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Telefone</th>
                  <th>Cargo</th>
                  <th>Data Criação</th>
                  <th>Tracking</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="lead in paginatedLeads" :key="lead.id" class="hover:bg-gray-50">
                  <td class="font-medium">{{ lead.nome }}</td>
                  <td>{{ lead.email }}</td>
                  <td>{{ lead.telefone }}</td>
                  <td>{{ lead.cargo }}</td>
                  <td>{{ formatDate(lead.createdAt) }}</td>
                  <td>
                    <div class="flex flex-wrap gap-1">
                      <span v-if="lead.utmSource" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {{ lead.utmSource }}
                      </span>
                      <span v-if="lead.gclid" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Google Ads
                      </span>
                      <span v-if="lead.fbclid" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Facebook
                      </span>
                    </div>
                  </td>
                  <td>
                    <div class="flex items-center space-x-2">
                      <button
                        @click="viewLead(lead)"
                        class="text-indigo-600 hover:text-indigo-900 text-sm"
                      >
                        Ver
                      </button>
                      <button
                        @click="editLead(lead)"
                        class="text-green-600 hover:text-green-900 text-sm"
                      >
                        Editar
                      </button>
                      <button
                        @click="deleteLead(lead)"
                        class="text-red-600 hover:text-red-900 text-sm"
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          
          <div v-if="totalPages > 1" class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
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
                  Mostrando
                  <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span>
                  até
                  <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, filteredLeads.length) }}</span>
                  de
                  <span class="font-medium">{{ filteredLeads.length }}</span>
                  resultados
                </p>
              </div>
              <div>
                <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    v-for="page in visiblePages"
                    :key="page"
                    @click="currentPage = page"
                    :class="[
                      'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                      page === currentPage
                        ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    ]"
                  >
                    {{ page }}
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    
    <div v-if="selectedLead" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" @click="closeModal">
      <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white" @click.stop>
        <div class="mt-3">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">Detalhes do Lead</h3>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <div class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Nome</label>
                <p class="mt-1 text-sm text-gray-900">{{ selectedLead.nome }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Email</label>
                <p class="mt-1 text-sm text-gray-900">{{ selectedLead.email }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Telefone</label>
                <p class="mt-1 text-sm text-gray-900">{{ selectedLead.telefone }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Cargo</label>
                <p class="mt-1 text-sm text-gray-900">{{ selectedLead.cargo }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Data de Nascimento</label>
                <p class="mt-1 text-sm text-gray-900">{{ formatDate(selectedLead.dataNascimento) }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Data de Criação</label>
                <p class="mt-1 text-sm text-gray-900">{{ formatDate(selectedLead.createdAt) }}</p>
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700">Mensagem</label>
              <p class="mt-1 text-sm text-gray-900">{{ selectedLead.mensagem }}</p>
            </div>
            
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Informações de Tracking</label>
              <div class="bg-gray-50 p-3 rounded-md">
                <div class="grid grid-cols-2 gap-2 text-sm">
                  <div v-if="selectedLead.utmSource">
                    <span class="font-medium">UTM Source:</span> {{ selectedLead.utmSource }}
                  </div>
                  <div v-if="selectedLead.utmMedium">
                    <span class="font-medium">UTM Medium:</span> {{ selectedLead.utmMedium }}
                  </div>
                  <div v-if="selectedLead.utmCampaign">
                    <span class="font-medium">UTM Campaign:</span> {{ selectedLead.utmCampaign }}
                  </div>
                  <div v-if="selectedLead.utmTerm">
                    <span class="font-medium">UTM Term:</span> {{ selectedLead.utmTerm }}
                  </div>
                  <div v-if="selectedLead.utmContent">
                    <span class="font-medium">UTM Content:</span> {{ selectedLead.utmContent }}
                  </div>
                  <div v-if="selectedLead.gclid">
                    <span class="font-medium">GCLID:</span> {{ selectedLead.gclid }}
                  </div>
                  <div v-if="selectedLead.fbclid">
                    <span class="font-medium">FBCLID:</span> {{ selectedLead.fbclid }}
                  </div>
                  <div v-if="selectedLead.ip">
                    <span class="font-medium">IP:</span> {{ selectedLead.ip }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
});


const leads = ref([]);
const filteredLeads = ref([]);
const selectedLead = ref(null);
const searchQuery = ref('');
const isLoading = ref(true);
const isExporting = ref(false);


const currentPage = ref(1);
const itemsPerPage = 10;


const totalPages = computed(() => Math.ceil(filteredLeads.value.length / itemsPerPage));
const paginatedLeads = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredLeads.value.slice(start, end);
});

const visiblePages = computed(() => {
  const pages = [];
  const start = Math.max(1, currentPage.value - 2);
  const end = Math.min(totalPages.value, start + 4);
  
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
});


const loadLeads = async () => {
  try {
    const response = await $fetch('/api/admin/leads');
    if (response.success) {
      leads.value = response.data;
      filteredLeads.value = response.data;
    }
  } catch (error) {
    console.error('Error loading leads:', error);
  } finally {
    isLoading.value = false;
  }
};

const searchLeads = useDebounceFn(() => {
  const query = searchQuery.value.toLowerCase();
  if (!query) {
    filteredLeads.value = leads.value;
  } else {
    filteredLeads.value = leads.value.filter(lead =>
      lead.nome.toLowerCase().includes(query) ||
      lead.email.toLowerCase().includes(query) ||
      lead.telefone.includes(query) ||
      lead.cargo.toLowerCase().includes(query)
    );
  }
  currentPage.value = 1;
}, 300);

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const viewLead = (lead) => {
  selectedLead.value = lead;
};

const editLead = (lead) => {
  
  console.log('Edit lead:', lead);
};

const deleteLead = async (lead) => {
  if (confirm(`Tem certeza que deseja excluir o lead "${lead.nome}"?`)) {
    try {
      const response = await $fetch(`/api/leads/${lead.id}`, {
        method: 'DELETE'
      });
      
      if (response.success) {
        await loadLeads();
      } else {
        alert('Erro ao excluir lead');
      }
    } catch (error) {
      console.error('Error deleting lead:', error);
      alert('Erro ao excluir lead');
    }
  }
};

const exportLeads = async () => {
  isExporting.value = true;
  try {
    const response = await fetch('/api/leads/export');
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `leads-${new Date().toISOString().split('T')[0]}.xlsx`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting leads:', error);
    alert('Erro ao exportar leads');
  } finally {
    isExporting.value = false;
  }
};

const closeModal = () => {
  selectedLead.value = null;
};

const handleLogout = async () => {
  try {
    await $fetch('/api/auth/logout', { method: 'POST' });
    await navigateTo('/admin/login');
  } catch (error) {
    console.error('Logout error:', error);
  }
};


onMounted(() => {
  loadLeads();
});
</script>