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
          Área Administrativa
        </h2>
        <p class="mt-4 text-xl text-gray-600">
          Faça login para acessar o painel de gestão de leads
        </p>
      </div>

      <div class="form-container">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div class="form-field">
            <label for="username" class="form-label">Usuário</label>
            <input
              id="username"
              v-model="form.username"
              type="text"
              required
              class="form-input"
              placeholder="Digite seu usuário"
            />
          </div>

          <div class="form-field">
            <label for="password" class="form-label">Senha</label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              class="form-input"
              placeholder="Digite sua senha"
            />
          </div>

          <div v-if="error" class="bg-red-50 border border-red-200 rounded-md p-4">
            <p class="text-red-800">{{ error }}</p>
          </div>

          <div>
            <button
              type="submit"
              :disabled="isLoading"
              class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isLoading ? 'Entrando...' : 'Entrar' }}
            </button>
          </div>

          <div class="text-center">
            <NuxtLink to="/" class="text-sm text-blue-600 hover:text-blue-700">
              ← Voltar ao formulário
            </NuxtLink>
          </div>
        </form>
      </div>
    </main>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false
});

const form = ref({
  username: '',
  password: ''
});

const isLoading = ref(false);
const error = ref('');

const handleLogin = async () => {
  error.value = '';
  isLoading.value = true;

  try {
    const response = await $fetch('/api/auth/login', {
      method: 'POST',
      body: form.value
    });

    if (response.success) {
      await navigateTo('/admin');
    } else {
      error.value = response.error || 'Erro ao fazer login';
    }
  } catch (err) {
    console.error('Login error:', err);
    error.value = err.data?.error || 'Erro ao fazer login';
  } finally {
    isLoading.value = false;
  }
};
</script>