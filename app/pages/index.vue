<template>
  <div class="min-h-screen bg-gray-50">
    
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div class="flex justify-start">
            <h1 class="text-2xl font-bold text-gray-900">L0gik Leads</h1>
          </div>
          <div class="flex items-center space-x-4">
            <NuxtLink to="/admin/login" class="text-sm text-gray-500 hover:text-gray-700">
              Área Administrativa
            </NuxtLink>
          </div>
        </div>
      </div>
    </header>

    
    <main class="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Entre em Contato Conosco
        </h2>
        <p class="mt-4 text-xl text-gray-600">
          Preencha o formulário abaixo e nossa equipe entrará em contato com você
        </p>
      </div>

      
      <div class="form-container">
        <form @submit.prevent="submitForm" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div class="form-field">
              <label for="nome" class="form-label">Nome Completo *</label>
              <input
                id="nome"
                v-model="form.nome"
                type="text"
                required
                class="form-input"
                :class="{ 'border-red-500': errors.nome }"
                placeholder="Seu nome completo"
              />
              <p v-if="errors.nome" class="error-message">{{ errors.nome }}</p>
            </div>

            
            <div class="form-field">
              <label for="email" class="form-label">Email *</label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                class="form-input"
                :class="{ 'border-red-500': errors.email }"
                placeholder="seu@email.com"
              />
              <p v-if="errors.email" class="error-message">{{ errors.email }}</p>
            </div>

            
            <div class="form-field">
              <label for="telefone" class="form-label">Telefone *</label>
              <input
                id="telefone"
                v-model="form.telefone"
                type="tel"
                required
                class="form-input"
                :class="{ 'border-red-500': errors.telefone }"
                placeholder="(11) 99999-9999"
                @input="formatPhone"
              />
              <p v-if="errors.telefone" class="error-message">{{ errors.telefone }}</p>
            </div>

            
            <div class="form-field">
              <label for="cargo" class="form-label">Cargo *</label>
              <input
                id="cargo"
                v-model="form.cargo"
                type="text"
                required
                class="form-input"
                :class="{ 'border-red-500': errors.cargo }"
                placeholder="Seu cargo atual"
              />
              <p v-if="errors.cargo" class="error-message">{{ errors.cargo }}</p>
            </div>

            
            <div class="form-field md:col-span-2">
              <label for="dataNascimento" class="form-label">Data de Nascimento *</label>
              <input
                id="dataNascimento"
                v-model="form.dataNascimento"
                type="date"
                required
                class="form-input"
                :class="{ 'border-red-500': errors.dataNascimento }"
                :max="maxDate"
              />
              <p v-if="errors.dataNascimento" class="error-message">{{ errors.dataNascimento }}</p>
            </div>
          </div>

          
          <div class="form-field">
            <label for="mensagem" class="form-label">Mensagem *</label>
            <textarea
              id="mensagem"
              v-model="form.mensagem"
              required
              rows="4"
              class="form-textarea"
              :class="{ 'border-red-500': errors.mensagem }"
              placeholder="Conte-nos sobre seu interesse..."
            ></textarea>
            <p v-if="errors.mensagem" class="error-message">{{ errors.mensagem }}</p>
          </div>

          
          <div class="flex justify-end">
            <button
              type="submit"
              :disabled="isSubmitting"
              class="btn-primary"
              :class="{ 'opacity-50 cursor-not-allowed': isSubmitting }"
            >
              {{ isSubmitting ? 'Enviando...' : 'Enviar Mensagem' }}
            </button>
          </div>

          
          <div v-if="successMessage" class="bg-green-50 border border-green-200 rounded-md p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-green-800">{{ successMessage }}</p>
              </div>
            </div>
          </div>

          
          <div v-if="generalError" class="bg-red-50 border border-red-200 rounded-md p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-red-800">{{ generalError }}</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  </div>
</template>

<script setup>

useHead({
  title: 'Formulário de Contato - L0gik Leads',
  meta: [
    { name: 'description', content: 'Entre em contato conosco através do nosso formulário seguro com tracking avançado.' }
  ]
});


const form = ref({
  nome: '',
  email: '',
  telefone: '',
  cargo: '',
  dataNascimento: '',
  mensagem: ''
});


const errors = ref({});
const isSubmitting = ref(false);
const successMessage = ref('');
const generalError = ref('');


const maxDate = computed(() => {
  const date = new Date();
  date.setFullYear(date.getFullYear() - 16);
  return date.toISOString().split('T')[0];
});


const formatPhone = (event) => {
  let value = event.target.value.replace(/\D/g, '');
  
  if (value.length <= 10) {
    value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  } else {
    value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  
  form.value.telefone = value;
};

const getTrackingParams = () => {
  if (process.client) {
    const urlParams = new URLSearchParams(window.location.search);
    return {
      utmSource: urlParams.get('utm_source') || undefined,
      utmMedium: urlParams.get('utm_medium') || undefined,
      utmCampaign: urlParams.get('utm_campaign') || undefined,
      utmTerm: urlParams.get('utm_term') || undefined,
      utmContent: urlParams.get('utm_content') || undefined,
      gclid: urlParams.get('gclid') || undefined,
      fbclid: urlParams.get('fbclid') || undefined
    };
  }
  return {};
};

const trackEvent = (eventName, eventData = {}) => {
  if (process.client && window.gtag) {
    window.gtag('event', eventName, eventData);
  }
  
  if (process.client && window.dataLayer) {
    window.dataLayer.push({
      event: eventName,
      ...eventData
    });
  }

  
  if (process.client && window.fbq) {
    window.fbq('track', eventName, eventData);
  }
};

const submitForm = async () => {
  errors.value = {};
  generalError.value = '';
  successMessage.value = '';
  isSubmitting.value = true;

  try {
    
    const formData = {
      ...form.value,
      ...getTrackingParams()
    };

    
    const { data } = await $fetch('/api/leads', {
      method: 'POST',
      body: formData
    });

    if (data.success) {
      successMessage.value = 'Mensagem enviada com sucesso! Entraremos em contato em breve.';
      
      
      trackEvent('generate_lead', {
        event_category: 'Lead',
        event_label: 'Form Submission',
        value: 1,
        email: formData.email,
        phone_number: formData.telefone
      });

      
      form.value = {
        nome: '',
        email: '',
        telefone: '',
        cargo: '',
        dataNascimento: '',
        mensagem: ''
      };
    } else {
      throw new Error(data.error || 'Erro ao enviar formulário');
    }
  } catch (error) {
    console.error('Erro ao enviar formulário:', error);
    
    if (error.data?.details) {
      
      error.data.details.forEach(detail => {
        errors.value[detail.path[0]] = detail.message;
      });
    } else {
      generalError.value = error.data?.error || 'Erro ao enviar formulário. Tente novamente.';
    }
  } finally {
    isSubmitting.value = false;
  }
};


onMounted(() => {
  trackEvent('page_view', {
    page_title: 'Formulário de Contato',
    page_location: window.location.href
  });
});
</script>