/**
 * Camada de Abstração de Dados (Data Service)
 * Gerencia persistência local (LocalStorage) e espelha exatamente a API futura do Supabase.
 * Para plugar o Supabase no futuro, basta alterar a implementação das funções deste módulo.
 */
import { APP_CONFIG } from '../config/settings.js';
import { 
  INITIAL_SERVICES, 
  INITIAL_PROJECTS, 
  INITIAL_TESTIMONIALS, 
  INITIAL_QUOTES 
} from '../data/mockData.js';

class DataService {
  constructor() {
    this.initStorage();
  }

  /**
   * Inicializa o armazenamento local com os dados mockados se ainda não existirem
   */
  initStorage() {
    // Limpeza de chaves legadas se existirem
    if (localStorage.getItem('pedreiro_settings_v1')) {
      localStorage.removeItem('pedreiro_settings_v1');
    }
    
    // Inicialização da versão atual
    if (!localStorage.getItem(APP_CONFIG.storageKeys.services)) {
      localStorage.setItem(APP_CONFIG.storageKeys.services, JSON.stringify(INITIAL_SERVICES));
    }
    if (!localStorage.getItem(APP_CONFIG.storageKeys.projects)) {
      localStorage.setItem(APP_CONFIG.storageKeys.projects, JSON.stringify(INITIAL_PROJECTS));
    }
    if (!localStorage.getItem(APP_CONFIG.storageKeys.testimonials)) {
      localStorage.setItem(APP_CONFIG.storageKeys.testimonials, JSON.stringify(INITIAL_TESTIMONIALS));
    }
    if (!localStorage.getItem(APP_CONFIG.storageKeys.quotes)) {
      localStorage.setItem(APP_CONFIG.storageKeys.quotes, JSON.stringify(INITIAL_QUOTES));
    }
    if (!localStorage.getItem(APP_CONFIG.storageKeys.settings)) {
      localStorage.setItem(APP_CONFIG.storageKeys.settings, JSON.stringify(APP_CONFIG));
    } else {
      // Se houver dados antigos salvos com nome diferente, atualiza para Clebson Gomes
      try {
        const current = JSON.parse(localStorage.getItem(APP_CONFIG.storageKeys.settings));
        if (current.professionalName !== APP_CONFIG.professionalName || current.phoneRaw !== APP_CONFIG.phoneRaw) {
          localStorage.setItem(APP_CONFIG.storageKeys.settings, JSON.stringify({ ...current, ...APP_CONFIG }));
        }
      } catch (e) {
        localStorage.setItem(APP_CONFIG.storageKeys.settings, JSON.stringify(APP_CONFIG));
      }
    }
  }

  // --- SERVIÇOS ---
  async getServices() {
    try {
      const data = localStorage.getItem(APP_CONFIG.storageKeys.services);
      return data ? JSON.parse(data) : [...INITIAL_SERVICES];
    } catch (e) {
      console.error('Erro ao buscar serviços:', e);
      return [...INITIAL_SERVICES];
    }
  }

  async getServiceById(id) {
    const services = await this.getServices();
    return services.find(s => s.id === id) || null;
  }

  async saveService(service) {
    const services = await this.getServices();
    if (service.id) {
      const index = services.findIndex(s => s.id === service.id);
      if (index !== -1) {
        services[index] = { ...services[index], ...service };
      } else {
        services.push(service);
      }
    } else {
      const newService = {
        ...service,
        id: 'srv-' + Date.now()
      };
      services.push(newService);
    }
    localStorage.setItem(APP_CONFIG.storageKeys.services, JSON.stringify(services));
    return service;
  }

  async deleteService(id) {
    const services = await this.getServices();
    const filtered = services.filter(s => s.id !== id);
    localStorage.setItem(APP_CONFIG.storageKeys.services, JSON.stringify(filtered));
    return true;
  }

  // --- PROJETOS (OBRAS) ---
  async getProjects() {
    try {
      const data = localStorage.getItem(APP_CONFIG.storageKeys.projects);
      return data ? JSON.parse(data) : [...INITIAL_PROJECTS];
    } catch (e) {
      console.error('Erro ao buscar projetos:', e);
      return [...INITIAL_PROJECTS];
    }
  }

  async saveProject(project) {
    const projects = await this.getProjects();
    if (project.id) {
      const index = projects.findIndex(p => p.id === project.id);
      if (index !== -1) {
        projects[index] = { ...projects[index], ...project };
      } else {
        projects.push(project);
      }
    } else {
      const newProject = {
        ...project,
        id: 'proj-' + Date.now(),
        date: new Date().toISOString().split('T')[0]
      };
      projects.unshift(newProject);
    }
    localStorage.setItem(APP_CONFIG.storageKeys.projects, JSON.stringify(projects));
    return project;
  }

  async deleteProject(id) {
    const projects = await this.getProjects();
    const filtered = projects.filter(p => p.id !== id);
    localStorage.setItem(APP_CONFIG.storageKeys.projects, JSON.stringify(filtered));
    return true;
  }

  // --- DEPOIMENTOS ---
  async getTestimonials() {
    try {
      const data = localStorage.getItem(APP_CONFIG.storageKeys.testimonials);
      return data ? JSON.parse(data) : [...INITIAL_TESTIMONIALS];
    } catch (e) {
      console.error('Erro ao buscar depoimentos:', e);
      return [...INITIAL_TESTIMONIALS];
    }
  }

  async saveTestimonial(testimonial) {
    const testimonials = await this.getTestimonials();
    if (testimonial.id) {
      const index = testimonials.findIndex(t => t.id === testimonial.id);
      if (index !== -1) {
        testimonials[index] = { ...testimonials[index], ...testimonial };
      } else {
        testimonials.push(testimonial);
      }
    } else {
      const newTestimonial = {
        ...testimonial,
        id: 'test-' + Date.now(),
        date: 'Recente'
      };
      testimonials.unshift(newTestimonial);
    }
    localStorage.setItem(APP_CONFIG.storageKeys.testimonials, JSON.stringify(testimonials));
    return testimonial;
  }

  async deleteTestimonial(id) {
    const testimonials = await this.getTestimonials();
    const filtered = testimonials.filter(t => t.id !== id);
    localStorage.setItem(APP_CONFIG.storageKeys.testimonials, JSON.stringify(filtered));
    return true;
  }

  // --- CONFIGURAÇÕES DO PROFISSIONAL ---
  async getSettings() {
    try {
      const data = localStorage.getItem(APP_CONFIG.storageKeys.settings);
      return data ? { ...APP_CONFIG, ...JSON.parse(data) } : { ...APP_CONFIG };
    } catch (e) {
      console.error('Erro ao buscar configurações:', e);
      return { ...APP_CONFIG };
    }
  }

  async updateSettings(newSettings) {
    const current = await this.getSettings();
    const merged = { ...current, ...newSettings };
    localStorage.setItem(APP_CONFIG.storageKeys.settings, JSON.stringify(merged));
    return merged;
  }

  // --- AGENDAMENTOS E SOLICITAÇÕES ---
  async getQuotes() {
    try {
      const data = localStorage.getItem(APP_CONFIG.storageKeys.quotes);
      return data ? JSON.parse(data) : [...INITIAL_QUOTES];
    } catch (e) {
      console.error('Erro ao buscar orçamentos:', e);
      return [...INITIAL_QUOTES];
    }
  }

  async addQuote(quote) {
    const quotes = await this.getQuotes();
    const newQuote = {
      ...quote,
      id: 'quote-' + Date.now(),
      status: quote.status || 'Pendente',
      createdAt: new Date().toLocaleString('pt-BR')
    };
    quotes.unshift(newQuote);
    localStorage.setItem(APP_CONFIG.storageKeys.quotes, JSON.stringify(quotes));
    return newQuote;
  }

  async updateQuoteStatus(id, newStatus) {
    const quotes = await this.getQuotes();
    const item = quotes.find(q => q.id === id);
    if (item) {
      item.status = newStatus;
      localStorage.setItem(APP_CONFIG.storageKeys.quotes, JSON.stringify(quotes));
    }
    return item;
  }

  // --- RESTAURAR DADOS PADRÃO ---
  resetAll() {
    localStorage.setItem(APP_CONFIG.storageKeys.services, JSON.stringify(INITIAL_SERVICES));
    localStorage.setItem(APP_CONFIG.storageKeys.projects, JSON.stringify(INITIAL_PROJECTS));
    localStorage.setItem(APP_CONFIG.storageKeys.testimonials, JSON.stringify(INITIAL_TESTIMONIALS));
    localStorage.setItem(APP_CONFIG.storageKeys.quotes, JSON.stringify(INITIAL_QUOTES));
    localStorage.setItem(APP_CONFIG.storageKeys.settings, JSON.stringify(APP_CONFIG));
    return true;
  }
}

export const dataService = new DataService();
