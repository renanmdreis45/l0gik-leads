<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </div>
</template>

<script setup>

useHead({
  title: 'L0gik Leads - Sistema de Gestão de Leads',
  meta: [
    { name: 'description', content: 'Sistema completo de cadastro e gestão de leads com tracking avançado' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ]
});
</script>
