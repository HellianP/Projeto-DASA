/**
 * Utilitário Centralizado de Integração com WhatsApp - DASA Centro Automotivo
 * Gera links universais e mensagens formatadas para conversão automotiva
 */
import { APP_CONFIG } from '../config/settings.js';
import { formatCurrency } from './formatters.js';

/**
 * Cria a URL universal do WhatsApp
 */
export function getWhatsAppUrl(rawPhone, message) {
  let phone = String(rawPhone || APP_CONFIG.whatsappRaw).replace(/\D/g, '');
  if (phone.length === 10 || phone.length === 11) {
    phone = '55' + phone;
  }
  const encodedText = encodeURIComponent(message.trim());
  return `https://api.whatsapp.com/send?phone=${phone}&text=${encodedText}`;
}

/**
 * Monta mensagem para a Calculadora de Orçamento com Veículo Selecionado
 */
export function buildCalculatorWhatsAppMessage(items, totalEstimated, carInfo = {}, clientName = '') {
  let msg = `Olá, equipe da *DASA Centro Automotivo*! Tudo bem?\n\n`;
  if (clientName) {
    msg += `Meu nome é *${clientName}*.\n`;
  }

  if (carInfo.brand || carInfo.model) {
    msg += `🚗 *MEU VEÍCULO:*\n`;
    msg += `   └ Marca/Modelo: *${carInfo.brand || ''} ${carInfo.model || ''}*\n`;
    if (carInfo.year) msg += `   └ Ano: *${carInfo.year}*\n`;
    if (carInfo.plate) msg += `   └ Placa: *${carInfo.plate.toUpperCase()}*\n`;
    msg += `\n`;
  }

  msg += `Fiz uma simulação de serviços pelo site e gostaria de agendar uma avaliação:\n\n`;
  msg += `📋 *SERVIÇOS SELECIONADOS:*\n`;

  items.forEach((item, index) => {
    msg += `${index + 1}. *${item.name}*\n`;
    msg += `   └ Valor de referência: *${formatCurrency(item.subtotal)}*\n`;
  });

  msg += `\n💰 *ESTIMATIVA TOTAL DE MÃO DE OBRA: ${formatCurrency(totalEstimated)}*\n\n`;
  msg += `Qual o melhor dia e horário para eu levar o carro para um check-up na oficina?`;

  return msg;
}

/**
 * Monta mensagem para agendamento de revisão / check-up
 */
export function buildAppointmentWhatsAppMessage({ name, phone, carBrand, carModel, carYear, service, date, period, notes }) {
  let msg = `Olá, *DASA Centro Automotivo*! Gostaria de agendar um atendimento na oficina:\n\n`;
  msg += `👤 *Cliente:* ${name}\n`;
  if (phone) msg += `📱 *Telefone:* ${phone}\n`;
  if (carBrand || carModel) {
    msg += `🚗 *Veículo:* ${carBrand || ''} ${carModel || ''} ${carYear ? '(' + carYear + ')' : ''}\n`;
  }
  if (service) msg += `🔧 *Serviço / Sintoma:* ${service}\n`;
  if (date) msg += `📅 *Data desejada:* ${date}\n`;
  if (period) msg += `⏰ *Período preferido:* ${period}\n`;
  if (notes) msg += `📝 *Observações / Barulho relatado:* ${notes}\n\n`;
  msg += `Vocês têm disponibilidade para confirmar esse horário?`;
  return msg;
}

/**
 * Monta mensagem para contato geral
 */
export function buildGeneralContactMessage({ name, service, message }) {
  let msg = `Olá, *DASA Centro Automotivo*! Gostaria de tirar dúvidas sobre peças e serviços.\n\n`;
  if (name) msg += `👤 *Nome:* ${name}\n`;
  if (service) msg += `🔧 *Assunto / Peça:* ${service}\n`;
  if (message) msg += `💬 *Mensagem:* ${message}\n`;
  return msg;
}
