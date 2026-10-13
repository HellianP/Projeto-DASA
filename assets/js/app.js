/**
 * Aplicação Principal do Site Institucional - DASA Centro Automotivo
 * Conecta dados centralizados, componentes interativos, simulador e WhatsApp
 */
import { dataService } from './services/dataService.js';
import { APP_CONFIG } from './config/settings.js';
import { formatCurrency, formatPhone } from './utils/formatters.js';
import { getWhatsAppUrl, buildAppointmentWhatsAppMessage, buildGeneralContactMessage } from './utils/whatsapp.js';
import { renderProjectsGallery } from './components/beforeAfter.js';
import { BudgetCalculator } from './components/calculator.js';
import { initMobileNav } from './components/mobileNav.js';
import { initScrollReveal } from './components/scrollReveal.js';

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Carrega dados do DataService (preparado para Supabase/LocalStorage)
  const [settings, services, projects, testimonials] = await Promise.all([
    dataService.getSettings(),
    dataService.getServices(),
    dataService.getProjects(),
    dataService.getTestimonials()
  ]);

  // 2. Aplica configurações dinâmicas de contato no DOM
  applySettings(settings);

  // 3. Renderiza a lista de serviços dinamicamente com fotos reais e badges
  renderServices(services);

  // 4. Renderiza a galeria de obras com Antes & Depois interativo
  initProjectsGallery(projects);

  // 5. Renderiza a seção de depoimentos
  renderTestimonials(testimonials);

  // 6. Inicializa a Calculadora de Orçamento
  const calculator = new BudgetCalculator({
    containerId: 'calculator-container',
    services: services
  });

  // Conecta botões "Simular este serviço" dos cards de serviços à calculadora
  setupServiceCardCalculatorTriggers(calculator);

  // 7. Inicializa formulário de Agendamento de Check-up
  setupAppointmentForm();

  // 8. Inicializa navegação mobile (hamburger e scroll suave)
  initMobileNav();

  // 9. Inicializa animações sutis de scroll nas fotos e cards
  initScrollReveal();
});

/**
 * Aplica configurações centralizadas (nome, telefone, WhatsApp, horários)
 */
function applySettings(settings) {
  document.querySelectorAll('[data-bind="businessName"]').forEach(el => {
    el.textContent = settings.businessName || APP_CONFIG.businessName;
  });

  document.querySelectorAll('[data-bind="professionalName"]').forEach(el => {
    el.textContent = settings.professionalName || APP_CONFIG.professionalName;
  });

  document.querySelectorAll('[data-bind="phoneDisplay"]').forEach(el => {
    el.textContent = formatPhone(settings.phoneRaw || APP_CONFIG.phoneDisplay);
  });

  document.querySelectorAll('[data-bind="serviceArea"]').forEach(el => {
    el.textContent = settings.serviceArea || APP_CONFIG.serviceArea;
  });

  document.querySelectorAll('[data-bind="workingHours"]').forEach(el => {
    el.textContent = settings.workingHours || APP_CONFIG.workingHours;
  });

  const waUrl = getWhatsAppUrl(settings.whatsappRaw || APP_CONFIG.whatsappRaw, APP_CONFIG.defaultWhatsAppGreeting);
  
  document.querySelectorAll('.js-whatsapp-link').forEach(link => {
    link.href = waUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  });
}

/**
 * Renderiza os cards de serviços com fotos reais de alta qualidade e tags
 */
function renderServices(services) {
  const container = document.getElementById('services-grid');
  if (!container) return;

  container.innerHTML = services.map(service => `
    <article class="service-card reveal-on-scroll" data-service-id="${service.id}">
      <div class="service-img-wrap">
        <img 
          src="${service.image || 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=600&q=80'}" 
          alt="${service.name}" 
          class="service-img" 
          loading="lazy"
        >
        <span class="service-category-badge">${service.category || 'Serviço'}</span>
      </div>
      <div class="service-body">
        <h3 class="service-name">${service.name}</h3>
        <p class="service-description">${service.description}</p>
        
        <div class="service-price-tag">
          <span class="service-price-prefix">A partir de</span>
          <span class="service-price-val">${formatCurrency(service.price)}</span>
          <span class="service-price-unit">/${service.unit || 'serviço'}</span>
        </div>

        <button type="button" class="btn btn-outline btn-sm js-simulate-service-btn" data-service-id="${service.id}" data-service-name="${service.name}" data-price="${service.price}">
          Simular no Orçamento →
        </button>
      </div>
    </article>
  `).join('');
}

/**
 * Conecta o botão dos cards de serviços à calculadora
 */
function setupServiceCardCalculatorTriggers(calculator) {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.js-simulate-service-btn');
    if (btn) {
      const serviceId = btn.dataset.serviceId;
      const calcSection = document.getElementById('calculadora');
      if (calcSection) {
        calcSection.scrollIntoView({ behavior: 'smooth' });
        if (calculator && typeof calculator.addServiceRow === 'function') {
          calculator.addServiceRow(serviceId);
        }
      }
    }
  });
}

/**
 * Inicializa a galeria com filtros de categoria
 */
function initProjectsGallery(projects) {
  const containerId = 'projects-grid';
  renderProjectsGallery(containerId, projects, 'Todos');

  const filterBtns = document.querySelectorAll('.js-gallery-filter');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const category = btn.dataset.category || 'Todos';
      renderProjectsGallery(containerId, projects, category);
      initScrollReveal();
    });
  });
}

/**
 * Renderiza depoimentos de clientes
 */
function renderTestimonials(testimonials) {
  const container = document.getElementById('testimonials-grid');
  if (!container) return;

  container.innerHTML = testimonials.map(item => `
    <article class="testimonial-card reveal-on-scroll">
      <div class="testimonial-top">
        <div class="google-badge-strip">
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          <span class="google-label">Google Review</span>
        </div>
        <span class="testimonial-date">Avaliação Verificada</span>
      </div>

      <div class="rating-stars" aria-label="Avaliação: ${item.rating} de 5 estrelas">
        ${'★'.repeat(item.rating)}${'☆'.repeat(5 - item.rating)}
      </div>

      <blockquote class="testimonial-text">
        "${item.text}"
      </blockquote>

      <div class="testimonial-author">
        <div class="author-avatar">
          ${item.avatar || item.author.charAt(0)}
        </div>
        <div class="author-info">
          <div class="author-name">${item.author}</div>
          <div class="author-guide">
            ${item.location.includes('Local Guide') ? `
              <svg width="13" height="13" viewBox="0 0 24 24" fill="#EA8600">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
            ` : ''}
            <span>${item.location}</span>
          </div>
        </div>
      </div>
    </article>
  `).join('');
}

/**
 * Formulário de agendamento de check-up via WhatsApp
 */
function setupAppointmentForm() {
  const form = document.getElementById('appointment-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('app-name')?.value || '';
    const phone = document.getElementById('app-phone')?.value || '';
    const brand = document.getElementById('app-car-brand')?.value || '';
    const model = document.getElementById('app-car-model')?.value || '';
    const year = document.getElementById('app-car-year')?.value || '';
    const service = document.getElementById('app-service')?.value || '';
    const date = document.getElementById('app-date')?.value || '';
    const period = document.getElementById('app-period')?.value || '';
    const notes = document.getElementById('app-notes')?.value || '';

    const text = `Olá, DASA Centro Automotivo! Gostaria de agendar um check-up para o meu veículo:

🚗 *Veículo:* ${brand} ${model} (${year})
🔧 *Serviço Pretendido:* ${service}
📅 *Data Preferida:* ${date || 'A combinar'} (${period})
👤 *Cliente:* ${name}
📞 *Contato:* ${phone}
${notes ? '📝 *Observações:* ' + notes : ''}

Poderiam confirmar a disponibilidade de horário?`;

    const url = `https://api.whatsapp.com/send?phone=558738623648&text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  });
}
