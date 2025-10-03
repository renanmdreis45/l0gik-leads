export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const gtmId = config.public.gtmId;

  if (process.client && gtmId) {
    // Initialize dataLayer
    window.dataLayer = window.dataLayer || [];
    
    // Load GTM script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtm.js?id=${gtmId}`;
    document.head.appendChild(script);

    // Initialize GTM
    window.dataLayer.push({
      'gtm.start': new Date().getTime(),
      event: 'gtm.js'
    });

    // Helper function for tracking events
    window.trackEvent = (eventName, eventData = {}) => {
      // Google Analytics 4 via GTM
      if (window.gtag) {
        window.gtag('event', eventName, eventData);
      }

      // Push to dataLayer for GTM
      window.dataLayer.push({
        event: eventName,
        ...eventData
      });

      // Meta Pixel (Facebook)
      if (window.fbq) {
        // Map GA4 events to Meta events
        const metaEventMap = {
          'page_view': 'PageView',
          'generate_lead': 'Lead'
        };
        
        const metaEvent = metaEventMap[eventName] || eventName;
        window.fbq('track', metaEvent, eventData);
      }

      console.log('Event tracked:', eventName, eventData);
    };

    // Enhanced Conversions data
    window.getEnhancedConversionsData = () => {
      return {
        email: window.leadEmail || '',
        phone_number: window.leadPhone || ''
      };
    };
  }
});