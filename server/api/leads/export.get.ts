import { Database } from '../../utils/database';
import ExcelJS from 'exceljs';

export default defineEventHandler(async (event) => {
  try {
    const leads = await Database.getLeads();
    
    
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Leads');
    
    
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 25 },
      { header: 'Nome', key: 'nome', width: 30 },
      { header: 'Email', key: 'email', width: 35 },
      { header: 'Telefone', key: 'telefone', width: 20 },
      { header: 'Cargo', key: 'cargo', width: 25 },
      { header: 'Data de Nascimento', key: 'dataNascimento', width: 20 },
      { header: 'Mensagem', key: 'mensagem', width: 50 },
      { header: 'UTM Source', key: 'utmSource', width: 20 },
      { header: 'UTM Medium', key: 'utmMedium', width: 20 },
      { header: 'UTM Campaign', key: 'utmCampaign', width: 25 },
      { header: 'UTM Term', key: 'utmTerm', width: 20 },
      { header: 'UTM Content', key: 'utmContent', width: 25 },
      { header: 'GCLID', key: 'gclid', width: 25 },
      { header: 'FBCLID', key: 'fbclid', width: 25 },
      { header: 'IP', key: 'ip', width: 15 },
      { header: 'User Agent', key: 'userAgent', width: 50 },
      { header: 'Criado em', key: 'createdAt', width: 20 },
      { header: 'Atualizado em', key: 'updatedAt', width: 20 }
    ];
    
    
    leads.forEach(lead => {
      worksheet.addRow(lead);
    });
    
    
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };
    
    
    const buffer = await workbook.xlsx.writeBuffer();
    
    
    setHeader(event, 'Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    setHeader(event, 'Content-Disposition', `attachment; filename="leads-${new Date().toISOString().split('T')[0]}.xlsx"`);
    
    return buffer;
  } catch (error) {
    setResponseStatus(event, 500);
    return { success: false, error: 'Erro ao exportar leads' };
  }
});