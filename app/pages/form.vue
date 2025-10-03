<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div class="flex justify-start">
            <h1 class="text-2xl font-bold text-gray-900">L0gik Leads</h1>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Entre em Contato
        </h2>
        <p class="mt-4 text-xl text-gray-600">
          Preencha o formulário abaixo
        </p>
      </div>

      <div class="bg-white shadow-lg rounded-lg p-6">
        <form @submit.prevent="submitForm" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="nome" class="block text-sm font-medium text-gray-700 mb-2">
                Nome Completo *
              </label>
              <input
                id="nome"
                v-model="form.nome"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Seu nome completo"
              />
            </div>

            
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="seu@email.com"
              />
            </div>

            
            <div>
              <label for="telefone" class="block text-sm font-medium text-gray-700 mb-2">
                Telefone *
              </label>
              <input
                id="telefone"
                v-model="form.telefone"
                type="tel"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="(11) 99999-9999"
              />
            </div>

            
            <div>
              <label for="cargo" class="block text-sm font-medium text-gray-700 mb-2">
                Cargo *
              </label>
              <input
                id="cargo"
                v-model="form.cargo"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Seu cargo atual"
              />
            </div>

            
            <div class="md:col-span-2">
              <label for="dataNascimento" class="block text-sm font-medium text-gray-700 mb-2">
                Data de Nascimento *
              </label>
              <input
                id="dataNascimento"
                v-model="form.dataNascimento"
                type="date"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          
          <div>
            <label for="mensagem" class="block text-sm font-medium text-gray-700 mb-2">
              Mensagem *
            </label>
            <textarea
              id="mensagem"
              v-model="form.mensagem"
              required
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Conte-nos sobre seu interesse..."
            ></textarea>
          </div>

          
          <div>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isSubmitting ? 'Enviando...' : 'Enviar Mensagem' }}
            </button>
          </div>

          
          <div v-if="successMessage" class="bg-green-50 border border-green-200 rounded-md p-4">
            <p class="text-green-800">{{ successMessage }}</p>
          </div>

          <div v-if="errorMessage" class="bg-red-50 border border-red-200 rounded-md p-4">
            <p class="text-red-800">{{ errorMessage }}</p>
          </div>
        </form>
      </div>
    </main>
  </div>
</template>

<script setup>
useHead({
  title: 'Formulário de Contato - L0gik Leads'
});

const form = ref({
  nome: '',
  email: '',
  telefone: '',
  cargo: '',
  dataNascimento: '',
  mensagem: ''
});

const isSubmitting = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

const submitForm = async () => {
  isSubmitting.value = true;
  successMessage.value = '';
  errorMessage.value = '';

  try {
    const trackingParams = {};
    if (process.client) {
      const urlParams = new URLSearchParams(window.location.search);
      trackingParams.utmSource = urlParams.get('utm_source') || undefined;
      trackingParams.utmMedium = urlParams.get('utm_medium') || undefined;
      trackingParams.utmCampaign = urlParams.get('utm_campaign') || undefined;
      trackingParams.gclid = urlParams.get('gclid') || undefined;
      trackingParams.fbclid = urlParams.get('fbclid') || undefined;
    }

    const response = await $fetch('/api/leads', {
      method: 'POST',
      body: {
        ...form.value,
        ...trackingParams
      }
    });

    if (response.success) {
      successMessage.value = 'Mensagem enviada com sucesso! Entraremos em contato em breve.';
      
      Object.keys(form.value).forEach(key => {
        form.value[key] = '';
      });
    } else {
      errorMessage.value = response.error || 'Erro ao enviar formulário';
    }
  } catch (error) {
    console.error('Erro:', error);
    errorMessage.value = 'Erro ao enviar formulário. Tente novamente.';
  } finally {
    isSubmitting.value = false;
  }
};
</script>