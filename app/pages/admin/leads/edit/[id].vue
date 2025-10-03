<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div class="flex items-center space-x-4">
            <button @click="goBack" class="text-gray-600 hover:text-gray-900">
              ← Voltar
            </button>
            <h1 class="text-2xl font-bold text-gray-900">
              {{ isEditMode ? 'Editar Lead' : 'Novo Lead' }}
            </h1>
          </div>
          <div class="flex items-center space-x-4">
            <button 
              @click="saveLead"
              :disabled="isSaving || !isFormValid"
              class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isSaving ? 'Salvando...' : 'Salvar' }}
            </button>
            <button 
              v-if="isEditMode"
              @click="viewLead"
              class="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
            >
              👁️ Visualizar
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div v-if="isLoading" class="flex justify-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>

      <form v-else @submit.prevent="saveLead" class="space-y-6">
        <!-- Basic Information -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Informações Básicas</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="nome" class="block text-sm font-medium text-gray-700">
                Nome *
              </label>
              <input
                id="nome"
                v-model="form.nome"
                type="text"
                required
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2 bg-white text-gray-900"
                placeholder="Nome completo"
              />
            </div>
            
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">
                Email *
              </label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2 bg-white text-gray-900"
                placeholder="email@exemplo.com"
              />
            </div>

            <div>
              <label for="telefone" class="block text-sm font-medium text-gray-700">
                Telefone
              </label>
              <input
                id="telefone"
                v-model="form.telefone"
                type="tel"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2 bg-white text-gray-900"
                placeholder="(11) 99999-9999"
              />
            </div>

            <div>
              <label for="cargo" class="block text-sm font-medium text-gray-700">
                Cargo
              </label>
              <input
                id="cargo"
                v-model="form.cargo"
                type="text"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2 bg-white text-gray-900"
                placeholder="Cargo na empresa"
              />
            </div>

            <div class="md:col-span-2">
              <label for="empresa" class="block text-sm font-medium text-gray-700">
                Empresa
              </label>
              <input
                id="empresa"
                v-model="form.empresa"
                type="text"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2 bg-white text-gray-900"
                placeholder="Nome da empresa"
              />
            </div>
          </div>
        </div>

        <!-- Message -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Mensagem</h2>
          <div>
            <label for="mensagem" class="block text-sm font-medium text-gray-700">
              Mensagem do Lead
            </label>
            <textarea
              id="mensagem"
              v-model="form.mensagem"
              rows="4"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2 bg-white text-gray-900"
              placeholder="Mensagem enviada pelo lead..."
            ></textarea>
          </div>
        </div>

        <!-- UTM Parameters -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Parâmetros UTM</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="utmSource" class="block text-sm font-medium text-gray-700">
                UTM Source
              </label>
              <input
                id="utmSource"
                v-model="form.utmSource"
                type="text"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2 bg-white text-gray-900"
                placeholder="google, facebook, email"
              />
            </div>

            <div>
              <label for="utmMedium" class="block text-sm font-medium text-gray-700">
                UTM Medium
              </label>
              <input
                id="utmMedium"
                v-model="form.utmMedium"
                type="text"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2 bg-white text-gray-900"
                placeholder="cpc, organic, email"
              />
            </div>

            <div>
              <label for="utmCampaign" class="block text-sm font-medium text-gray-700">
                UTM Campaign
              </label>
              <input
                id="utmCampaign"
                v-model="form.utmCampaign"
                type="text"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2 bg-white text-gray-900"
                placeholder="nome-da-campanha"
              />
            </div>

            <div>
              <label for="utmTerm" class="block text-sm font-medium text-gray-700">
                UTM Term
              </label>
              <input
                id="utmTerm"
                v-model="form.utmTerm"
                type="text"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2 bg-white text-gray-900"
                placeholder="palavra-chave"
              />
            </div>

            <div class="md:col-span-2">
              <label for="utmContent" class="block text-sm font-medium text-gray-700">
                UTM Content
              </label>
              <input
                id="utmContent"
                v-model="form.utmContent"
                type="text"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2 bg-white text-gray-900"
                placeholder="conteudo-especifico"
              />
            </div>
          </div>
        </div>

        <!-- Technical Data -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Dados Técnicos</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="ip" class="block text-sm font-medium text-gray-700">
                IP
              </label>
              <input
                id="ip"
                v-model="form.ip"
                type="text"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2 bg-gray-50"
                placeholder="192.168.1.1"
                readonly
              />
            </div>

            <div class="md:col-span-1">
              <label for="referrer" class="block text-sm font-medium text-gray-700">
                Referrer
              </label>
              <input
                id="referrer"
                v-model="form.referrer"
                type="url"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2 bg-white text-gray-900"
                placeholder="https://exemplo.com"
              />
            </div>

            <div class="md:col-span-2">
              <label for="userAgent" class="block text-sm font-medium text-gray-700">
                User Agent
              </label>
              <textarea
                id="userAgent"
                v-model="form.userAgent"
                rows="2"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2 bg-gray-50"
                placeholder="Informações do navegador..."
                readonly
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex justify-between items-center">
            <div class="text-sm text-gray-500">
              * Campos obrigatórios
            </div>
            <div class="flex space-x-3">
              <button
                type="button"
                @click="resetForm"
                class="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Limpar
              </button>
              <button
                type="button"
                @click="goBack"
                class="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
              >
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="isSaving || !isFormValid"
                class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ isSaving ? 'Salvando...' : (isEditMode ? 'Atualizar' : 'Criar') }}
              </button>
            </div>
          </div>
        </div>
      </form>
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
  
  if (isEditMode.value) {
    loadLead();
  } else {
    isLoading.value = false;
  }
});

// Data
const isLoading = ref(true);
const isSaving = ref(false);
const isEditMode = computed(() => !!route.params.id);

const form = ref({
  nome: '',
  email: '',
  telefone: '',
  cargo: '',
  empresa: '',
  mensagem: '',
  utmSource: '',
  utmMedium: '',
  utmCampaign: '',
  utmTerm: '',
  utmContent: '',
  ip: '',
  userAgent: '',
  referrer: ''
});

// Computed
const isFormValid = computed(() => {
  return form.value.nome.trim() && form.value.email.trim();
});

// Methods
const loadLead = async () => {
  try {
    const response = await $fetch(`http://127.0.0.1:3000/api/leads/${route.params.id}`);
    if (response.success) {
      const lead = response.lead;
      form.value = {
        nome: lead.nome || '',
        email: lead.email || '',
        telefone: lead.telefone || '',
        cargo: lead.cargo || '',
        empresa: lead.empresa || '',
        mensagem: lead.mensagem || '',
        utmSource: lead.utmSource || '',
        utmMedium: lead.utmMedium || '',
        utmCampaign: lead.utmCampaign || '',
        utmTerm: lead.utmTerm || '',
        utmContent: lead.utmContent || '',
        ip: lead.ip || '',
        userAgent: lead.userAgent || '',
        referrer: lead.referrer || ''
      };
    }
  } catch (error) {
    console.error('Erro ao carregar lead:', error);
    alert('Erro ao carregar dados do lead');
  } finally {
    isLoading.value = false;
  }
};

const saveLead = async () => {
  if (!isFormValid.value) return;
  
  isSaving.value = true;
  try {
    const method = isEditMode.value ? 'PUT' : 'POST';
    const url = isEditMode.value 
      ? `http://127.0.0.1:3000/api/leads/${route.params.id}` 
      : 'http://127.0.0.1:3000/api/leads';
    
    const response = await $fetch(url, {
      method,
      body: JSON.stringify(form.value),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.success) {
      alert(isEditMode.value ? 'Lead atualizado com sucesso!' : 'Lead criado com sucesso!');
      if (isEditMode.value) {
        router.push(`/admin/leads/${route.params.id}`);
      } else {
        router.push('/admin');
      }
    }
  } catch (error) {
    console.error('Erro ao salvar lead:', error);
    alert('Erro ao salvar lead. Tenta novamente.');
  } finally {
    isSaving.value = false;
  }
};

const resetForm = () => {
  if (confirm('Tem certeza que deseja limpar todos os campos?')) {
    form.value = {
      nome: '',
      email: '',
      telefone: '',
      cargo: '',
      empresa: '',
      mensagem: '',
      utmSource: '',
      utmMedium: '',
      utmCampaign: '',
      utmTerm: '',
      utmContent: '',
      ip: '',
      userAgent: '',
      referrer: ''
    };
  }
};

const goBack = () => {
  if (isEditMode.value) {
    router.push(`/admin/leads/${route.params.id}`);
  } else {
    router.push('/admin');
  }
};

const viewLead = () => {
  router.push(`/admin/leads/${route.params.id}`);
};
</script>