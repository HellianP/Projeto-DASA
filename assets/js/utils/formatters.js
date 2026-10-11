/**
 * Utilitários de Formatação
 */

export function formatCurrency(value) {
  const num = Number(value) || 0;
  return num.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

export function formatNumber(value) {
  const num = Number(value) || 0;
  return num.toLocaleString('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });
}

export function formatPhone(phone) {
  if (!phone) return '';
  const digits = String(phone).replace(/\D/g, '');
  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) 9 ${digits.slice(3, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return phone;
}

export function sanitizePhone(phone) {
  return String(phone || '').replace(/\D/g, '');
}

export function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    const [year, month, day] = dateStr.split('-');
    if (year && month && day) {
      return `${day}/${month}/${year}`;
    }
    return dateStr;
  } catch (e) {
    return dateStr;
  }
}
