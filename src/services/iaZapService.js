import axios from 'axios';

const IA_ZAP_BASE_URL = 'https://app.ia-zap.app.br';
const IA_ZAP_TOKEN = '1XmdXDf2v2RrYPVLFuqy8zD5JEauyw';

const api = axios.create({
  baseURL: IA_ZAP_BASE_URL,
  headers: {
    'Authorization': `Bearer ${IA_ZAP_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

export const iaZapService = {
  /**
   * Enviar mensagem para IA-Zap
   * @param {object} data - {username, conversationId, message, attachments?}
   */
  sendMessage: async (data) => {
    try {
      const response = await api.post('/messages/send', {
        username: data.username,
        conversationId: data.conversationId || null,
        message: data.message,
        attachments: data.attachments || [],
        timestamp: new Date().toISOString(),
        appName: 'darinfo-app',
        version: '1.0.0',
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao enviar mensagem para IA-Zap:', error);
      throw error;
    }
  },

  /**
   * Buscar conversações do cliente
   * @param {string} username - Nome de usuário
   */
  getConversations: async (username) => {
    try {
      const response = await api.get(`/conversations/${username}`);
      return response.data?.conversations || [];
    } catch (error) {
      console.error('Erro ao buscar conversações:', error);
      return [];
    }
  },

  /**
   * Buscar mensagens de uma conversa
   * @param {string} conversationId - ID da conversação
   */
  getMessages: async (conversationId) => {
    try {
      const response = await api.get(`/conversations/${conversationId}/messages`);
      return response.data?.messages || [];
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error);
      return [];
    }
  },

  /**
   * Enviar arquivo/comprovante de pagamento
   * @param {object} data - {username, file, fileName, fileType}
   */
  uploadFile: async (data) => {
    try {
      const formData = new FormData();
      formData.append('username', data.username);
      formData.append('file', data.file);
      formData.append('fileName', data.fileName);
      formData.append('fileType', data.fileType);
      formData.append('conversationId', data.conversationId || null);

      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao enviar arquivo:', error);
      throw error;
    }
  },

  /**
   * Webhook para receber mensagens de IA-Zap
   * Esta função será chamada quando uma mensagem é recebida
   * @param {object} data - Dados da mensagem recebida
   */
  handleWebhookMessage: (data) => {
    try {
      console.log('Mensagem recebida de IA-Zap:', data);
      return {
        status: 'received',
        username: data.username,
        message: data.message,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Erro ao processar webhook:', error);
      throw error;
    }
  },

  /**
   * Registrar webhook no IA-Zap para receber mensagens
   * @param {string} webhookUrl - URL do webhook
   */
  registerWebhook: async (webhookUrl) => {
    try {
      const response = await api.post('/webhooks', {
        url: webhookUrl,
        events: ['message.received', 'message.sent'],
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao registrar webhook:', error);
      throw error;
    }
  },

  /**
   * Enviar lembrete de renovação para cliente
   * @param {object} data - {username, message, scheduledFor}
   */
  sendReminder: async (data) => {
    try {
      const response = await api.post('/reminders/send', {
        username: data.username,
        message: data.message,
        scheduledFor: data.scheduledFor,
        reminderType: 'renewal',
        appName: 'darinfo-app',
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao enviar lembrete:', error);
      throw error;
    }
  },

  /**
   * Atualizar status de pagamento
   * @param {object} data - {username, paymentProofId, status, amount}
   */
  updatePaymentStatus: async (data) => {
    try {
      const response = await api.put('/payments/status', {
        username: data.username,
        paymentProofId: data.paymentProofId,
        status: data.status, // 'pending', 'verified', 'rejected'
        amount: data.amount,
        systemType: data.systemType, // 'IPTV', 'P2P'
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar status de pagamento:', error);
      throw error;
    }
  },
};

export default iaZapService;
