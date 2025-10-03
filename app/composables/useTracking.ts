export const useTracking = () => {
  const trackEvent = (eventName: string, eventData: Record<string, any> = {}) => {
    if (process.client) {
      
      if (window.gtag) {
        window.gtag('event', eventName, eventData);
      }

      
      if (window.dataLayer) {
        window.dataLayer.push({
          event: eventName,
          ...eventData
        });
      }

      
      if (window.fbq) {
        
        const metaEventMap: Record<string, string> = {
          'page_view': 'PageView',
          'generate_lead': 'Lead'
        };
        
        const metaEvent = metaEventMap[eventName] || eventName;
        window.fbq('track', metaEvent, eventData);
      }

      console.log('Event tracked:', eventName, eventData);
    }
  };

  const trackPageView = (pageData: Record<string, any> = {}) => {
    trackEvent('page_view', {
      page_title: document?.title || '',
      page_location: window?.location?.href || '',
      ...pageData
    });
  };

  const trackLead = (leadData: Record<string, any> = {}) => {
    
    if (process.client) {
      (window as any).leadEmail = leadData.email || '';
      (window as any).leadPhone = leadData.phone_number || leadData.telefone || '';
    }

    trackEvent('generate_lead', {
      event_category: 'Lead',
      event_label: 'Form Submission',
      value: 1,
      currency: 'BRL',
      ...leadData
    });

    
    trackEvent('conversion', {
      send_to: 'AW-CONVERSION_ID/CONVERSION_LABEL', 
      value: 1.0,
      currency: 'BRL',
      email: leadData.email,
      phone_number: leadData.phone_number || leadData.telefone,
      ...leadData
    });
  };

  const getTrackingParams = (): Record<string, string | undefined> => {
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

  return {
    trackEvent,
    trackPageView,
    trackLead,
    getTrackingParams
  };
};