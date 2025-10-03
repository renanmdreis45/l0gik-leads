<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div class="flex items-center space-x-4">
            <button @click="$router.push('/admin')" class="text-gray-600 hover:text-gray-900">
              ← Voltar
            </button>
            <h1 class="text-2xl font-bold text-gray-900">Detalhes do Lead</h1>
          </div>
          <div class="flex items-center space-x-4">
            <button 
              @click="editLead"
              class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              ✏️ Editar
            </button>
            <button 
              @click="deleteLead"
              class="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            >
              🗑️ Excluir
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div v-if="isLoading" class="flex justify-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>

      <div v-else-if="lead" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Lead Information -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Basic Info -->
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Informações Básicas</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-500">Nome</label>
                <p class="mt-1 text-sm text-gray-900">{{ lead.nome }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500">Email</label>
                <p class="mt-1 text-sm text-gray-900">{{ lead.email }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500">Telefone</label>
                <p class="mt-1 text-sm text-gray-900">{{ lead.telefone || 'Não informado' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500">Cargo</label>
                <p class="mt-1 text-sm text-gray-900">{{ lead.cargo || 'Não informado' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500">Empresa</label>
                <p class="mt-1 text-sm text-gray-900">{{ lead.empresa || 'Não informada' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500">Data de Cadastro</label>
                <p class="mt-1 text-sm text-gray-900">{{ formatDate(lead.createdAt) }}</p>
              </div>
            </div>
          </div>

          <!-- Message -->
          <div v-if="lead.mensagem" class="bg-white rounded-lg shadow p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Mensagem</h2>
            <div class="bg-gray-50 rounded-lg p-4">
              <p class="text-sm text-gray-700 whitespace-pre-wrap">{{ lead.mensagem }}</p>
            </div>
          </div>

          <!-- Tracking Data -->
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Dados de Tracking</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-500">UTM Source</label>
                <p class="mt-1 text-sm text-gray-900">{{ lead.utmSource || 'Não disponível' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500">UTM Medium</label>
                <p class="mt-1 text-sm text-gray-900">{{ lead.utmMedium || 'Não disponível' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500">UTM Campaign</label>
                <p class="mt-1 text-sm text-gray-900">{{ lead.utmCampaign || 'Não disponível' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500">UTM Term</label>
                <p class="mt-1 text-sm text-gray-900">{{ lead.utmTerm || 'Não disponível' }}</p>
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-500">UTM Content</label>
                <p class="mt-1 text-sm text-gray-900">{{ lead.utmContent || 'Não disponível' }}</p>
              </div>
            </div>
          </div>

          <!-- Technical Data -->
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Dados Técnicos</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-500">IP</label>
                <p class="mt-1 text-sm text-gray-900 font-mono">{{ lead.ip || 'Não disponível' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500">User Agent</label>
                <p class="mt-1 text-sm text-gray-900 break-all">{{ lead.userAgent || 'Não disponível' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500">Referrer</label>
                <p class="mt-1 text-sm text-gray-900 break-all">{{ lead.referrer || 'Não disponível' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500">ID</label>
                <p class="mt-1 text-sm text-gray-900 font-mono">{{ lead.id }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Quick Actions -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
            <div class="space-y-3">
              <button 
                @click="sendEmail"
                class="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center justify-center space-x-2"
              >
                <span>📧</span>
                <span>Enviar Email</span>
              </button>
              <button 
                @click="callPhone"
                class="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center justify-center space-x-2"
                :disabled="!lead.telefone"
              >
                <span>📞</span>
                <span>Ligar</span>
              </button>
              <button 
                @click="copyInfo"
                class="w-full bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 flex items-center justify-center space-x-2"
              >
                <span>📋</span>
                <span>Copiar Dados</span>
              </button>
            </div>
          </div>

          <!-- Summary -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Resumo</h3>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-sm text-gray-500">Status:</span>
                <span class="text-sm font-medium text-green-600">Ativo</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-500">Origem:</span>
                <span class="text-sm font-medium">{{ getLeadSource() }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-500">Tempo:</span>
                <span class="text-sm font-medium">{{ getTimeAgo() }}</span>
              </div>
            </div>
          </div>

          <!-- Navigation -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Navegação</h3>
            <div class="space-y-2">
              <button 
                @click="$router.push('/admin')"
                class="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
              >
                📊 Painel Principal
              </button>
              <button 
                @click="$router.push('/admin/leads')"
                class="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
              >
                👥 Todos os Leads
              </button>
              <button 
                @click="$router.push('/admin/leads/new')"
                class="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
              >
                ➕ Novo Lead
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-12">
        <p class="text-gray-500">Lead não encontrado.</p>
        <button @click="$router.push('/admin')" class="mt-4 text-blue-600 hover:text-blue-900">
          ← Voltar ao painel
        </button>
      </div>
    </main>
  </div>
</template>

<script setup>
const route = useRoute();
const router = useRouter();

// Auth check
onMounted(() => {
  const hasToken = document.cookie.includes('auth-token=') || 
                  localStorage.getItem('auth-token') || 
                  sessionStorage.getItem('auth-token');
  
  if (!hasToken) {
    window.location.href = '/admin/login';
    return;
  }
  
  loadLead();
});

// Data
const lead = ref(null);
const isLoading = ref(true);

// Methods
const loadLead = async () => {
  try {
    const response = await $fetch(`http://127.0.0.1:3000/api/leads/${route.params.id}`);
    if (response.success) {
      lead.value = response.lead;
    }
  } catch (error) {
    console.error('Erro ao carregar lead:', error);
  } finally {
    isLoading.value = false;
  }
};

const editLead = () => {
  router.push(`/admin/leads/edit/${route.params.id}`);
};

const deleteLead = async () => {
  if (confirm(`Tem certeza que deseja excluir o lead "${lead.value.nome}"?`)) {
    try {
      // Implementation for delete
      router.push('/admin');
    } catch (error) {
      console.error('Erro ao deletar lead:', error);
    }
  }
};

const sendEmail = () => {
  window.open(`mailto:${lead.value.email}`, '_blank');
};

const callPhone = () => {
  if (lead.value.telefone) {
    window.open(`tel:${lead.value.telefone}`, '_blank');
  }
};

const copyInfo = async () => {
  const info = `
Nome: ${lead.value.nome}
Email: ${lead.value.email}
Telefone: ${lead.value.telefone || 'Não informado'}
Cargo: ${lead.value.cargo || 'Não informado'}
Empresa: ${lead.value.empresa || 'Não informada'}
Data: ${formatDate(lead.value.createdAt)}
${lead.value.mensagem ? `\nMensagem:\n${lead.value.mensagem}` : ''}
  `.trim();
  
  try {
    await navigator.clipboard.writeText(info);
    alert('Dados copiados para a área de transferência!');
  } catch (err) {
    console.error('Erro ao copiar:', err);
  }
};

const getLeadSource = () => {
  if (lead.value.utmSource) {
    return lead.value.utmSource;
  }
  if (lead.value.referrer) {
    try {
      return new URL(lead.value.referrer).hostname;
    } catch {
      return 'Referrer';
    }
  }
  return 'Direto';
};

const getTimeAgo = () => {
  const now = new Date();
  const created = new Date(lead.value.createdAt);
  const diffMs = now - created;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Hoje';
  if (diffDays === 1) return 'Ontem';
  if (diffDays < 7) return `${diffDays} dias atrás`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} semanas atrás`;
  return `${Math.floor(diffDays / 30)} meses atrás`;
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