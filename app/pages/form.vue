<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md mx-auto">
      <!-- Back Button -->
      <div class="mb-6">
        <button 
          @click="$router.push('/')" 
          class="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Voltar à página inicial</span>
        </button>
      </div>

      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Entre em Contato</h1>
        <p class="text-gray-600">Preencha o formulário e nossa equipe entrará em contato</p>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6">
        <form @submit.prevent="submitForm" class="space-y-4">
          <div>
            <label for="nome" class="block text-sm font-medium text-gray-700 mb-1">
              Nome completo *
            </label>
            <input
              id="nome"
              v-model="form.nome"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
              style="background-color: white !important; color: black !important; -webkit-box-shadow: 0 0 0px 1000px white inset !important; -webkit-text-fill-color: black !important;"
              placeholder="Seu nome completo"
            />
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
              style="background-color: white !important; color: black !important; -webkit-box-shadow: 0 0 0px 1000px white inset !important; -webkit-text-fill-color: black !important;"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label for="telefone" class="block text-sm font-medium text-gray-700 mb-1">
              Telefone
            </label>
            <input
              id="telefone"
              v-model="form.telefone"
              type="tel"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
              style="background-color: white !important; color: black !important; -webkit-box-shadow: 0 0 0px 1000px white inset !important; -webkit-text-fill-color: black !important;"
              placeholder="(11) 99999-9999"
            />
          </div>

          <div>
            <label for="cargo" class="block text-sm font-medium text-gray-700 mb-1">
              Cargo
            </label>
            <input
              id="cargo"
              v-model="form.cargo"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
              style="background-color: white !important; color: black !important; -webkit-box-shadow: 0 0 0px 1000px white inset !important; -webkit-text-fill-color: black !important;"
              placeholder="Seu cargo"
            />
          </div>

          <div>
            <label for="empresa" class="block text-sm font-medium text-gray-700 mb-1">
              Empresa
            </label>
            <input
              id="empresa"
              v-model="form.empresa"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
              style="background-color: white !important; color: black !important; -webkit-box-shadow: 0 0 0px 1000px white inset !important; -webkit-text-fill-color: black !important;"
              placeholder="Nome da sua empresa"
            />
          </div>

          <div>
            <label for="mensagem" class="block text-sm font-medium text-gray-700 mb-1">
              Mensagem
            </label>
            <textarea
              id="mensagem"
              v-model="form.mensagem"
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
              style="background-color: white !important; color: black !important;"
              placeholder="Como podemos ajudar você?"
            ></textarea>
          </div>

          <div v-if="error" class="text-red-600 text-sm">
            {{ error }}
          </div>

          <div v-if="success" class="text-green-600 text-sm">
            {{ success }}
          </div>

          <button
            type="submit"
            :disabled="isSubmitting"
            class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isSubmitting ? 'Enviando...' : 'Enviar Mensagem' }}
          </button>
        </form>

        <div class="mt-6 text-center text-sm text-gray-500">
          Ao enviar este formulário, você concorda com nossos termos de uso e política de privacidade.
        </div>
      </div>

      <div class="mt-8 text-center">
        <div class="text-sm text-gray-600">
          <p class="mb-1">📧 contato@l0gik.com</p>
          <p class="mb-1">📱 (11) 99999-9999</p>
          <p>🏢 São Paulo, SP</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: 'Contato - L0gik Leads',
  meta: [
    { name: 'description', content: 'Entre em contato conosco através do nosso formulário' }
  ]
});

const form = ref({
  nome: '',
  email: '',
  telefone: '',
  cargo: '',
  empresa: '',
  mensagem: ''
});

const isSubmitting = ref(false);
const error = ref('');
const success = ref('');

const submitForm = async () => {
  if (!form.value.nome || !form.value.email) {
    error.value = 'Nome e email são obrigatórios';
    return;
  }

  isSubmitting.value = true;
  error.value = '';
  success.value = '';

  try {
    const urlParams = new URLSearchParams(window.location.search);
    const utmData = {
      utmSource: urlParams.get('utm_source') || null,
      utmMedium: urlParams.get('utm_medium') || null,
      utmCampaign: urlParams.get('utm_campaign') || null,
      utmTerm: urlParams.get('utm_term') || null,
      utmContent: urlParams.get('utm_content') || null,
      gclid: urlParams.get('gclid') || null,
      fbclid: urlParams.get('fbclid') || null
    };

    const payload = {
      ...form.value,
      ...utmData,
      ip: '127.0.0.1',
      userAgent: navigator.userAgent,
      referrer: document.referrer || null
    };    const response = await fetch('http://127.0.0.1:3000/api/leads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (data.success) {
      success.value = 'Mensagem enviada com sucesso! Em breve entraremos em contato.';
      form.value = {
        nome: '',
        email: '',
        telefone: '',
        cargo: '',
        empresa: '',
        mensagem: ''
      };
      
      if (typeof gtag !== 'undefined') {
        gtag('event', 'conversion', {
          'send_to': 'AW-CONVERSION_ID/CONVERSION_LABEL',
          'value': 1.0,
          'currency': 'BRL'
        });
      }
      
      setTimeout(() => {
        document.querySelector('.text-green-600')?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }, 100);
      
    } else {
      error.value = data.error || 'Erro ao enviar mensagem. Tente novamente.';
    }
  } catch (err) {
    console.error('Erro:', err);
    error.value = 'Erro de conexão. Verifique sua internet e tente novamente.';
  } finally {
    isSubmitting.value = false;
  }
};

watch(() => form.value.nome, () => {
  if (error.value) error.value = '';
});

watch(() => form.value.email, () => {
  if (error.value) error.value = '';
});
</script>