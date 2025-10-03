<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="max-w-md w-full bg-white rounded-lg shadow p-6">
      <h1 class="text-2xl font-bold text-center mb-6">Admin Login</h1>
      
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700 mb-1">Usuário</label>
          <input 
            id="username"
            v-model="form.username" 
            type="text" 
            required
            class="w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Senha</label>
          <input 
            id="password"
            v-model="form.password" 
            type="password" 
            required
            class="w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>        <div v-if="error" class="text-red-600 text-sm">{{ error }}</div>

        <button 
          type="submit" 
          :disabled="isLoading"
          class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {{ isLoading ? 'Entrando...' : 'Entrar' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
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
    const response = await $fetch('http://127.0.0.1:3000/api/auth/login', {
      method: 'POST',
      body: form.value
    });

    if (response.success) {
      const token = response.token;
      
      const expires = new Date();
      expires.setTime(expires.getTime() + (24 * 60 * 60 * 1000));
      document.cookie = `auth-token=${token}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
      
      localStorage.setItem('auth-token', token);
      
      window.location.href = '/admin';
    } else {
      error.value = response.error || 'Erro ao fazer login';
    }
  } catch (err) {
    console.error('Login error:', err);
    error.value = 'Erro ao fazer login';
  } finally {
    isLoading.value = false;
  }
};
</script>