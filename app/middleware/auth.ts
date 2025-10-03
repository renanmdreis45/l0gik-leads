export default defineNuxtRouteMiddleware((to, from) => {
  // Check if user is authenticated
  const token = useCookie('auth-token');
  
  if (!token.value) {
    return navigateTo('/admin/login');
  }
  
  // TODO: Validate token with server if needed
});