<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="max-w-md w-full bg-white rounded-lg shadow p-6 text-center">
      <h1 class="text-2xl font-bold mb-4">L0gik Leads</h1>
      <p class="text-gray-600 mb-6">Sistema de captura de leads</p>
      
      <div class="space-y-3">
        <NuxtLink 
          to="/form" 
          class="block w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Formulário de Lead
        </NuxtLink>
        
        <NuxtLink 
          to="/admin/login" 
          class="block w-full bg-gray-600 text-white py-2 rounded-md hover:bg-gray-700 transition-colors"
        >
          Área Administrativa
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: 'L0gik Leads - Sistema de Captura de Leads'
})
</script>