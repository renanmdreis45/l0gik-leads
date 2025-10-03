import { prisma } from '../../../lib/prisma';

export default defineEventHandler(async (event) => {
  if (getMethod(event) !== 'POST') {
    return { success: false, error: 'Método não permitido' };
  }

  try {
    const body = await readBody(event);
    const { 
      nome, 
      email, 
      telefone, 
      cargo, 
      dataNascimento, 
      mensagem,
      utmSource,
      utmMedium,
      utmCampaign,
      utmTerm,
      utmContent,
      gclid,
      fbclid,
      ip
    } = body;

    if (!nome || !email || !telefone || !cargo) {
      setResponseStatus(event, 400);
      return { success: false, error: 'Todos os campos obrigatórios devem ser preenchidos' };
    }

    const headers = getHeaders(event);
    const query = getQuery(event);

    const lead = await prisma.lead.create({
      data: {
        nome,
        email,
        telefone,
        cargo,
        dataNascimento: dataNascimento || '',
        mensagem: mensagem || '',
        utmSource: utmSource || query.utm_source as string || null,
        utmMedium: utmMedium || query.utm_medium as string || null,
        utmCampaign: utmCampaign || query.utm_campaign as string || null,
        utmTerm: utmTerm || query.utm_term as string || null,
        utmContent: utmContent || query.utm_content as string || null,
        gclid: gclid || query.gclid as string || null,
        fbclid: fbclid || query.fbclid as string || null,
        ip: ip || headers['x-forwarded-for'] || headers['x-real-ip'] || null,
        userAgent: headers['user-agent'] || null
      }
    });

    return { 
      success: true, 
      message: 'Lead cadastrado com sucesso!',
      data: { id: lead.id }
    };
  } catch (error: any) {
    console.error('Create lead error:', error);
    return { success: false, error: 'Erro interno do servidor' };
  }
});
