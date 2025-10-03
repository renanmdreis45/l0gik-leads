import jwt from 'jsonwebtoken';
import { prisma } from '../../../lib/prisma';
import ExcelJS from 'exceljs';

export default defineEventHandler(async (event) => {
  try {
    const token = getCookie(event, 'auth-token') || getHeader(event, 'authorization')?.replace('Bearer ', '');
    
    if (!token) {
      setResponseStatus(event, 401);
      return { success: false, error: 'Token de acesso requerido' };
    }

    const config = useRuntimeConfig();
    const decoded = jwt.verify(token, config.jwtSecret) as any;
    
    if (!decoded.userId) {
      setResponseStatus(event, 401);
      return { success: false, error: 'Token inválido' };
    }

    const query = getQuery(event);
    const format = query.format as string || 'excel';
    const search = query.search as string || '';

    const where = search ? {
      OR: [
        { nome: { contains: search, mode: 'insensitive' as any } },
        { email: { contains: search, mode: 'insensitive' as any } },
        { telefone: { contains: search } },
        { cargo: { contains: search, mode: 'insensitive' as any } }
      ]
    } : {};

    const leads = await prisma.lead.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    if (format === 'csv') {
      const csv = [
        [
          'ID', 'Nome', 'Email', 'Telefone', 'Cargo', 'Data Nascimento', 'Mensagem',
          'UTM Source', 'UTM Medium', 'UTM Campaign', 'UTM Term', 'UTM Content',
          'GCLID', 'FBCLID', 'IP', 'User Agent', 'Data Criação'
        ].join(','),
        ...leads.map(lead => [
          lead.id,
          `"${lead.nome.replace(/"/g, '""')}"`,
          `"${lead.email.replace(/"/g, '""')}"`,
          `"${lead.telefone.replace(/"/g, '""')}"`,
          `"${lead.cargo.replace(/"/g, '""')}"`,
          `"${lead.dataNascimento}"`,
          `"${(lead.mensagem || '').replace(/"/g, '""')}"`,
          `"${lead.utmSource || ''}"`,
          `"${lead.utmMedium || ''}"`,
          `"${lead.utmCampaign || ''}"`,
          `"${lead.utmTerm || ''}"`,
          `"${lead.utmContent || ''}"`,
          `"${lead.gclid || ''}"`,
          `"${lead.fbclid || ''}"`,
          `"${lead.ip || ''}"`,
          `"${(lead.userAgent || '').replace(/"/g, '""')}"`,
          `"${lead.createdAt.toISOString()}"`
        ].join(','))
      ].join('\n');

      setHeader(event, 'Content-Type', 'text/csv');
      setHeader(event, 'Content-Disposition', `attachment; filename="leads_${new Date().toISOString().split('T')[0]}.csv"`);
      
      return csv;
    } else {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Leads');

      worksheet.columns = [
        { header: 'ID', key: 'id', width: 10 },
        { header: 'Nome', key: 'nome', width: 25 },
        { header: 'Email', key: 'email', width: 30 },
        { header: 'Telefone', key: 'telefone', width: 15 },
        { header: 'Cargo', key: 'cargo', width: 20 },
        { header: 'Data Nascimento', key: 'dataNascimento', width: 15 },
        { header: 'Mensagem', key: 'mensagem', width: 40 },
        { header: 'UTM Source', key: 'utmSource', width: 15 },
        { header: 'UTM Medium', key: 'utmMedium', width: 15 },
        { header: 'UTM Campaign', key: 'utmCampaign', width: 20 },
        { header: 'UTM Term', key: 'utmTerm', width: 15 },
        { header: 'UTM Content', key: 'utmContent', width: 15 },
        { header: 'GCLID', key: 'gclid', width: 20 },
        { header: 'FBCLID', key: 'fbclid', width: 20 },
        { header: 'IP', key: 'ip', width: 15 },
        { header: 'User Agent', key: 'userAgent', width: 50 },
        { header: 'Data Criação', key: 'createdAt', width: 20 }
      ];

      worksheet.addRows(leads.map(lead => ({
        ...lead,
        createdAt: lead.createdAt.toISOString()
      })));

      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFD9D9D9' }
      };

      const buffer = await workbook.xlsx.writeBuffer();

      setHeader(event, 'Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      setHeader(event, 'Content-Disposition', `attachment; filename="leads_${new Date().toISOString().split('T')[0]}.xlsx"`);
      
      return buffer;
    }

  } catch (error: any) {
    console.error('Export leads error:', error);
    if (error.name === 'JsonWebTokenError') {
      setResponseStatus(event, 401);
      return { success: false, error: 'Token inválido' };
    }
    return { success: false, error: 'Erro interno do servidor' };
  }
});
