/**
 * Painel Administrativo (/admin) - admin.js
 * Gerencia visualmente o CRUD de Obras, Serviços, Depoimentos, Configurações e Agendamentos
 * Salva no LocalStorage via DataService (pronto para sincronizar com Supabase)
 */
import { dataService } from './services/dataService.js';
import { formatCurrency, formatPhone } from './utils/formatters.js';
import { getWhatsAppUrl } from './utils/whatsapp.js';

class AdminApp {
  constructor() {
    this.currentTab = 'dashboard';
    this.init();
  }

  async init() {
    this.bindNavigation();
    this.bindModals();
    await this.renderCurrentTab();
  }

  bindNavigation() {
    const navButtons = document.querySelectorAll('.admin-nav-item');
    navButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        navButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentTab = btn.dataset.tab;
        
        // Atualiza título da topbar
        const titleEl = document.getElementById('admin-page-title');
        if (titleEl) titleEl.textContent = btn.textContent.trim();

        this.renderCurrentTab();
      });
    });

    // Mobile sidebar toggle
    const toggleBtn = document.getElementById('admin-sidebar-toggle');
    const sidebar = document.querySelector('.admin-sidebar');
    if (toggleBtn && sidebar) {
      toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('mobile-open');
      });
    }
  }

  async renderCurrentTab() {
    const contentBody = document.getElementById('admin-tab-content');
    if (!contentBody) return;

    switch (this.currentTab) {
      case 'dashboard':
        await this.renderDashboard(contentBody);
        break;
      case 'obras':
        await this.renderProjectsTab(contentBody);
        break;
      case 'servicos':
        await this.renderServicesTab(contentBody);
        break;
      case 'depoimentos':
        await this.renderTestimonialsTab(contentBody);
        break;
      case 'informacoes':
        await this.renderSettingsTab(contentBody);
        break;
      case 'agendamentos':
        await this.renderQuotesTab(contentBody);
        break;
      default:
        await this.renderDashboard(contentBody);
    }
  }

  showToast(message) {
    let toast = document.getElementById('admin-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'admin-toast';
      toast.className = 'toast-notice';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  }

  // ====================================================================
  // 1. DASHBOARD
  // ====================================================================
  async renderDashboard(container) {
    const [projects, services, testimonials, quotes] = await Promise.all([
      dataService.getProjects(),
      dataService.getServices(),
      dataService.getTestimonials(),
      dataService.getQuotes()
    ]);

    container.innerHTML = `
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon stat-icon-blue">🏗️</div>
          <div>
            <div class="stat-val">${projects.length}</div>
            <div class="stat-label">Obras Publicadas</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon stat-icon-orange">🔨</div>
          <div>
            <div class="stat-val">${services.length}</div>
            <div class="stat-label">Serviços no Catálogo</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon stat-icon-purple">⭐</div>
          <div>
            <div class="stat-val">${testimonials.length}</div>
            <div class="stat-label">Depoimentos de Clientes</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon stat-icon-green">💬</div>
          <div>
            <div class="stat-val">${quotes.length}</div>
            <div class="stat-label">Solicitações Registradas</div>
          </div>
        </div>
      </div>

      <div class="admin-card">
        <div class="admin-card-header">
          <h2 class="admin-card-title">Solicitações Recentes de Orçamento</h2>
          <span class="badge badge-accent">Novos contatos</span>
        </div>
        <div class="table-responsive">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Telefone</th>
                <th>Serviço(s)</th>
                <th>Valor Estimado</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              ${quotes.length === 0 ? `
                <tr><td colspan="6" style="text-align:center; padding: 2rem;">Nenhuma solicitação ainda.</td></tr>
              ` : quotes.slice(0, 5).map(q => `
                <tr>
                  <td><strong>${q.clientName}</strong></td>
                  <td>${q.clientPhone}</td>
                  <td>${q.serviceName}</td>
                  <td><strong>${q.estimatedTotal ? formatCurrency(q.estimatedTotal) : 'A combinar'}</strong></td>
                  <td><span class="badge ${q.status === 'Concluído' ? 'badge-whatsapp' : 'badge-accent'}">${q.status}</span></td>
                  <td>
                    <button class="btn btn-outline btn-sm js-view-quote-btn" data-id="${q.id}">Ver detalhes</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <div class="card" style="background-color: #EFF6FF; border-color: #BFDBFE;">
        <h4 style="color: #1E40AF; margin-bottom: 0.5rem;">ℹ️ Pronto para Conectar com Supabase</h4>
        <p style="font-size: 0.875rem; color: #1E3A8A; margin-bottom: 0;">
          Os dados estão sendo gerenciados e persistidos localmente de forma modular através do <code>dataService.js</code>. 
          O arquivo com o script SQL completo do banco está disponível em <code>assets/js/data/supabaseSchema.sql</code>.
        </p>
      </div>
    `;

    // Bind view quote buttons
    container.querySelectorAll('.js-view-quote-btn').forEach(b => {
      b.addEventListener('click', () => {
        const quote = quotes.find(q => q.id === b.dataset.id);
        if (quote) {
          alert(`Detalhes da Solicitação:\nCliente: ${quote.clientName}\nTelefone: ${quote.clientPhone}\nServiço: ${quote.serviceName}\nEstimativa: ${quote.estimatedTotal ? formatCurrency(quote.estimatedTotal) : 'N/A'}\nObservações: ${quote.notes || 'Nenhuma'}`);
        }
      });
    });
  }

  // ====================================================================
  // 2. OBRAS (PROJETOS)
  // ====================================================================
  async renderProjectsTab(container) {
    const projects = await dataService.getProjects();

    container.innerHTML = `
      <div class="admin-card">
        <div class="admin-card-header">
          <div>
            <h2 class="admin-card-title">Gerenciar Serviços e Portfólio Automotivo</h2>
            <p class="form-text">Adicione ou edite fotos de Antes & Depois das suas reformas</p>
          </div>
          <button type="button" class="btn btn-primary btn-sm" id="btn-new-project">
            + Adicionar Novo Serviço
          </button>
        </div>
        <div class="table-responsive">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Antes / Depois</th>
                <th>Título</th>
                <th>Categoria</th>
                <th>Descrição</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              ${projects.map(p => `
                <tr>
                  <td style="width: 140px;">
                    <div style="display: flex; gap: 4px;">
                      <img src="${p.beforeImage}" alt="Antes" style="width: 50px; height: 40px; object-fit: cover; border-radius: 4px;" title="Antes">
                      <img src="${p.afterImage}" alt="Depois" style="width: 50px; height: 40px; object-fit: cover; border-radius: 4px;" title="Depois">
                    </div>
                  </td>
                  <td><strong>${p.title}</strong></td>
                  <td><span class="badge badge-accent">${p.category}</span></td>
                  <td style="max-width: 250px; font-size: 0.8125rem;">${p.description}</td>
                  <td>
                    <div class="admin-table-actions">
                      <button type="button" class="btn btn-outline btn-sm js-edit-project" data-id="${p.id}">Editar</button>
                      <button type="button" class="btn btn-outline btn-sm js-del-project" data-id="${p.id}" style="color:#DC2626; border-color:#FCA5A5;">Excluir</button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    document.getElementById('btn-new-project').addEventListener('click', () => {
      this.openProjectModal();
    });

    container.querySelectorAll('.js-edit-project').forEach(b => {
      b.addEventListener('click', () => {
        const p = projects.find(item => item.id === b.dataset.id);
        this.openProjectModal(p);
      });
    });

    container.querySelectorAll('.js-del-project').forEach(b => {
      b.addEventListener('click', async () => {
        if (confirm('Tem certeza que deseja excluir esta obra?')) {
          await dataService.deleteProject(b.dataset.id);
          this.showToast('Obra excluída com sucesso!');
          this.renderProjectsTab(container);
        }
      });
    });
  }

  // ====================================================================
  // 3. SERVIÇOS
  // ====================================================================
  async renderServicesTab(container) {
    const services = await dataService.getServices();

    container.innerHTML = `
      <div class="admin-card">
        <div class="admin-card-header">
          <div>
            <h2 class="admin-card-title">Catálogo de Serviços</h2>
            <p class="form-text">Configure os preços de referência por m² utilizados na calculadora</p>
          </div>
          <button type="button" class="btn btn-primary btn-sm" id="btn-new-service">
            + Adicionar Novo Serviço
          </button>
        </div>
        <div class="table-responsive">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Nome do Serviço</th>
                <th>Preço</th>
                <th>Unidade</th>
                <th>Descrição</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              ${services.map(s => `
                <tr>
                  <td><strong>${s.name}</strong></td>
                  <td style="color: var(--color-primary); font-weight: 700;">${formatCurrency(s.price)}</td>
                  <td>${s.unit || 'm²'}</td>
                  <td style="max-width: 280px; font-size: 0.8125rem;">${s.description}</td>
                  <td>
                    <div class="admin-table-actions">
                      <button type="button" class="btn btn-outline btn-sm js-edit-service" data-id="${s.id}">Editar</button>
                      <button type="button" class="btn btn-outline btn-sm js-del-service" data-id="${s.id}" style="color:#DC2626; border-color:#FCA5A5;">Excluir</button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    document.getElementById('btn-new-service').addEventListener('click', () => {
      this.openServiceModal();
    });

    container.querySelectorAll('.js-edit-service').forEach(b => {
      b.addEventListener('click', () => {
        const s = services.find(item => item.id === b.dataset.id);
        this.openServiceModal(s);
      });
    });

    container.querySelectorAll('.js-del-service').forEach(b => {
      b.addEventListener('click', async () => {
        if (confirm('Tem certeza que deseja remover este serviço?')) {
          await dataService.deleteService(b.dataset.id);
          this.showToast('Serviço removido com sucesso!');
          this.renderServicesTab(container);
        }
      });
    });
  }

  // ====================================================================
  // 4. DEPOIMENTOS
  // ====================================================================
  async renderTestimonialsTab(container) {
    const testimonials = await dataService.getTestimonials();

    container.innerHTML = `
      <div class="admin-card">
        <div class="admin-card-header">
          <div>
            <h2 class="admin-card-title">Depoimentos e Avaliações</h2>
            <p class="form-text">Cadastre avaliações de clientes para gerar prova social</p>
          </div>
          <button type="button" class="btn btn-primary btn-sm" id="btn-new-testimonial">
            + Adicionar Depoimento
          </button>
        </div>
        <div class="table-responsive">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Local / Serviço</th>
                <th>Estrelas</th>
                <th>Depoimento</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              ${testimonials.map(t => `
                <tr>
                  <td><strong>${t.name}</strong></td>
                  <td>${t.location || ''} • ${t.serviceDone || ''}</td>
                  <td style="color:#F59E0B;">${'★'.repeat(t.rating)}</td>
                  <td style="max-width: 300px; font-size: 0.8125rem;">"${t.text}"</td>
                  <td>
                    <div class="admin-table-actions">
                      <button type="button" class="btn btn-outline btn-sm js-edit-test" data-id="${t.id}">Editar</button>
                      <button type="button" class="btn btn-outline btn-sm js-del-test" data-id="${t.id}" style="color:#DC2626; border-color:#FCA5A5;">Excluir</button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    document.getElementById('btn-new-testimonial').addEventListener('click', () => {
      this.openTestimonialModal();
    });

    container.querySelectorAll('.js-edit-test').forEach(b => {
      b.addEventListener('click', () => {
        const t = testimonials.find(item => item.id === b.dataset.id);
        this.openTestimonialModal(t);
      });
    });

    container.querySelectorAll('.js-del-test').forEach(b => {
      b.addEventListener('click', async () => {
        if (confirm('Tem certeza que deseja excluir este depoimento?')) {
          await dataService.deleteTestimonial(b.dataset.id);
          this.showToast('Depoimento removido!');
          this.renderTestimonialsTab(container);
        }
      });
    });
  }

  // ====================================================================
  // 5. INFORMAÇÕES DA EMPRESA
  // ====================================================================
  async renderSettingsTab(container) {
    const settings = await dataService.getSettings();

    container.innerHTML = `
      <div class="admin-card" style="max-width: 780px;">
        <div class="admin-card-header">
          <div>
            <h2 class="admin-card-title">Informações do Profissional & Atendimento</h2>
            <p class="form-text">Estes dados atualizam automaticamente os botões de WhatsApp e textos do site</p>
          </div>
        </div>
        <div style="padding: 1.5rem;">
          <form id="admin-settings-form">
            <div class="form-group">
              <label class="form-label">Nome da Empresa / Fantasia:</label>
              <input type="text" id="set-businessName" class="form-control" value="${settings.businessName || ''}" required>
            </div>

            <div class="form-group">
              <label class="form-label">Nome do Profissional:</label>
              <input type="text" id="set-professionalName" class="form-control" value="${settings.professionalName || ''}" required>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="form-group">
                <label class="form-label">Número de WhatsApp (DDD + Número):</label>
                <input type="text" id="set-whatsappRaw" class="form-control" value="${settings.whatsappRaw || ''}" placeholder="Ex: 87991965954" required>
                <span class="form-text">Usado em todos os links de conversão direta.</span>
              </div>
              <div class="form-group">
                <label class="form-label">Telefone para Chamadas:</label>
                <input type="text" id="set-phoneRaw" class="form-control" value="${settings.phoneRaw || ''}" placeholder="Ex: (87) 99999-8888">
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Região de Atendimento:</label>
              <input type="text" id="set-serviceArea" class="form-control" value="${settings.serviceArea || ''}">
            </div>

            <div class="form-group">
              <label class="form-label">Horário de Atendimento:</label>
              <input type="text" id="set-workingHours" class="form-control" value="${settings.workingHours || ''}">
            </div>

            <div class="form-group">
              <label class="form-label">Instagram do Profissional:</label>
              <input type="text" id="set-instagram" class="form-control" value="${settings.instagram || ''}">
            </div>

            <div style="display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1.5rem;">
              <button type="submit" class="btn btn-primary">Salvar Informações</button>
            </div>
          </form>
        </div>
      </div>
    `;

    document.getElementById('admin-settings-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const updated = {
        businessName: document.getElementById('set-businessName').value.trim(),
        professionalName: document.getElementById('set-professionalName').value.trim(),
        whatsappRaw: document.getElementById('set-whatsappRaw').value.trim(),
        phoneRaw: document.getElementById('set-phoneRaw').value.trim(),
        serviceArea: document.getElementById('set-serviceArea').value.trim(),
        workingHours: document.getElementById('set-workingHours').value.trim(),
        instagram: document.getElementById('set-instagram').value.trim()
      };

      await dataService.updateSettings(updated);
      this.showToast('Informações salvas com sucesso!');
    });
  }

  // ====================================================================
  // 6. AGENDAMENTOS E SOLICITAÇÕES
  // ====================================================================
  async renderQuotesTab(container) {
    const quotes = await dataService.getQuotes();

    container.innerHTML = `
      <div class="admin-card">
        <div class="admin-card-header">
          <div>
            <h2 class="admin-card-title">Agendamentos e Estimativas Recebidas</h2>
            <p class="form-text">Contatos recebidos através da calculadora e do formulário de visita técnica</p>
          </div>
        </div>
        <div class="table-responsive">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Data / Hora</th>
                <th>Cliente</th>
                <th>Telefone</th>
                <th>Serviço Solicitado</th>
                <th>Valor Estimado</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              ${quotes.length === 0 ? `
                <tr><td colspan="7" style="text-align: center; padding: 2.5rem;">Nenhum agendamento recebido ainda.</td></tr>
              ` : quotes.map(q => `
                <tr>
                  <td style="font-size: 0.78rem; color: var(--color-text-muted);">${q.createdAt || 'Recentemente'}</td>
                  <td><strong>${q.clientName}</strong></td>
                  <td>${q.clientPhone}</td>
                  <td>${q.serviceName}</td>
                  <td><strong>${q.estimatedTotal ? formatCurrency(q.estimatedTotal) : 'A combinar'}</strong></td>
                  <td>
                    <select class="form-select js-status-change" data-id="${q.id}" style="padding: 0.25rem 0.5rem; min-height: 32px; font-size: 0.8125rem;">
                      <option value="Pendente" ${q.status === 'Pendente' ? 'selected' : ''}>Pendente</option>
                      <option value="Visita Agendada" ${q.status === 'Visita Agendada' ? 'selected' : ''}>Visita Agendada</option>
                      <option value="Concluído" ${q.status === 'Concluído' ? 'selected' : ''}>Concluído</option>
                    </select>
                  </td>
                  <td>
                    <button type="button" class="btn btn-whatsapp btn-sm js-wa-contact-client" data-phone="${q.clientPhone}" data-name="${q.clientName}">
                      Falar no WhatsApp
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    // Atualização de status
    container.querySelectorAll('.js-status-change').forEach(select => {
      select.addEventListener('change', async (e) => {
        await dataService.updateQuoteStatus(select.dataset.id, e.target.value);
        this.showToast('Status atualizado!');
      });
    });

    // Abertura de conversa direta com o cliente no WhatsApp
    container.querySelectorAll('.js-wa-contact-client').forEach(btn => {
      btn.addEventListener('click', () => {
        const phone = btn.dataset.phone;
        const name = btn.dataset.name;
        const msg = `Olá, ${name}! Sou o Clebson da construção civil. Recebi sua solicitação de orçamento pelo meu site e estou à disposição para combinarmos a visita técnica!`;
        const url = getWhatsAppUrl(phone, msg);
        window.open(url, '_blank');
      });
    });
  }

  // ====================================================================
  // MODAIS (SERVIÇOS, OBRAS, DEPOIMENTOS)
  // ====================================================================
  bindModals() {
    const backdrop = document.getElementById('admin-modal-backdrop');
    const closeBtn = document.getElementById('admin-modal-close');
    const cancelBtn = document.getElementById('admin-modal-cancel');

    const closeModal = () => {
      if (backdrop) backdrop.classList.remove('is-open');
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
    if (backdrop) {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) closeModal();
      });
    }
  }

  openServiceModal(service = null) {
    const backdrop = document.getElementById('admin-modal-backdrop');
    const title = document.getElementById('admin-modal-title');
    const body = document.getElementById('admin-modal-body');
    const saveBtn = document.getElementById('admin-modal-save');

    title.textContent = service ? 'Editar Serviço' : 'Novo Serviço';
    body.innerHTML = `
      <div class="form-group">
        <label class="form-label">Nome do Serviço:</label>
        <input type="text" id="modal-srv-name" class="form-control" value="${service ? service.name : ''}" placeholder="Ex: Assentamento de Porcelanato" required>
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
        <div class="form-group">
          <label class="form-label">Preço Inicial (R$):</label>
          <input type="number" step="0.5" id="modal-srv-price" class="form-control" value="${service ? service.price : '45.00'}" required>
        </div>
        <div class="form-group">
          <label class="form-label">Unidade de Medida:</label>
          <input type="text" id="modal-srv-unit" class="form-control" value="${service ? (service.unit || 'm²') : 'm²'}" placeholder="Ex: m²">
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Descrição Curta:</label>
        <textarea id="modal-srv-desc" class="form-control" rows="3" placeholder="Detalhes técnicos, nivelamento, ferramentas...">${service ? service.description : ''}</textarea>
      </div>
    `;

    backdrop.classList.add('is-open');

    saveBtn.onclick = async () => {
      const name = document.getElementById('modal-srv-name').value.trim();
      const price = parseFloat(document.getElementById('modal-srv-price').value);
      const unit = document.getElementById('modal-srv-unit').value.trim();
      const description = document.getElementById('modal-srv-desc').value.trim();

      if (!name || isNaN(price)) {
        alert('Por favor, preencha o nome e o preço corretamente.');
        return;
      }

      await dataService.saveService({
        id: service ? service.id : null,
        name,
        price,
        unit: unit || 'm²',
        description,
        icon: service ? service.icon : 'grid'
      });

      backdrop.classList.remove('is-open');
      this.showToast('Serviço salvo com sucesso!');
      this.renderServicesTab(document.getElementById('admin-tab-content'));
    };
  }

  openProjectModal(project = null) {
    const backdrop = document.getElementById('admin-modal-backdrop');
    const title = document.getElementById('admin-modal-title');
    const body = document.getElementById('admin-modal-body');
    const saveBtn = document.getElementById('admin-modal-save');

    title.textContent = project ? 'Editar Obra' : 'Adicionar Novo Serviço';
    body.innerHTML = `
      <div class="form-group">
        <label class="form-label">Título da Obra:</label>
        <input type="text" id="modal-proj-title" class="form-control" value="${project ? project.title : ''}" placeholder="Ex: Reforma de Cozinha em Porcelanato" required>
      </div>
      <div class="form-group">
        <label class="form-label">Categoria:</label>
        <select id="modal-proj-cat" class="form-control">
          <option value="Porcelanato" ${project && project.category === 'Estética & Faróis' ? 'selected' : ''}>Porcelanato</option>
          <option value="Banheiros" ${project && project.category === 'Motor & Injeção' ? 'selected' : ''}>Banheiros</option>
          <option value="Áreas Externas" ${project && project.category === 'Freios' ? 'selected' : ''}>Áreas Externas</option>
          <option value="Fachadas" ${project && project.category === 'Suspensão' ? 'selected' : ''}>Fachadas</option>
          <option value="Reformas Gerais" ${project && project.category === 'Reformas Gerais' ? 'selected' : ''}>Reformas Gerais</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">URL da Foto "Antes":</label>
        <input type="url" id="modal-proj-before" class="form-control" value="${project ? project.beforeImage : 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'}" placeholder="https://...">
        <span class="form-text">No futuro com Supabase Storage, haverá botão de upload direto da galeria do celular.</span>
      </div>
      <div class="form-group">
        <label class="form-label">URL da Foto "Depois":</label>
        <input type="url" id="modal-proj-after" class="form-control" value="${project ? project.afterImage : 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'}" placeholder="https://...">
      </div>
      <div class="form-group">
        <label class="form-label">Descrição dos Serviços Feitos:</label>
        <textarea id="modal-proj-desc" class="form-control" rows="3">${project ? project.description : ''}</textarea>
      </div>
    `;

    backdrop.classList.add('is-open');

    saveBtn.onclick = async () => {
      const projTitle = document.getElementById('modal-proj-title').value.trim();
      const category = document.getElementById('modal-proj-cat').value;
      const beforeImage = document.getElementById('modal-proj-before').value.trim();
      const afterImage = document.getElementById('modal-proj-after').value.trim();
      const description = document.getElementById('modal-proj-desc').value.trim();

      if (!projTitle) {
        alert('Por favor, informe o título da obra.');
        return;
      }

      await dataService.saveProject({
        id: project ? project.id : null,
        title: projTitle,
        category,
        beforeImage,
        afterImage,
        description,
        tags: project ? project.tags : ['Acabamento de primeira', 'Nivelamento a laser']
      });

      backdrop.classList.remove('is-open');
      this.showToast('Obra salva com sucesso!');
      this.renderProjectsTab(document.getElementById('admin-tab-content'));
    };
  }

  openTestimonialModal(testimonial = null) {
    const backdrop = document.getElementById('admin-modal-backdrop');
    const title = document.getElementById('admin-modal-title');
    const body = document.getElementById('admin-modal-body');
    const saveBtn = document.getElementById('admin-modal-save');

    title.textContent = testimonial ? 'Editar Depoimento' : 'Novo Depoimento';
    body.innerHTML = `
      <div class="form-group">
        <label class="form-label">Nome do Cliente:</label>
        <input type="text" id="modal-test-name" class="form-control" value="${testimonial ? testimonial.name : ''}" placeholder="Ex: João da Silva" required>
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
        <div class="form-group">
          <label class="form-label">Bairro / Cidade:</label>
          <input type="text" id="modal-test-loc" class="form-control" value="${testimonial ? (testimonial.location || '') : 'Bairro Centro'}">
        </div>
        <div class="form-group">
          <label class="form-label">Avaliação em Estrelas:</label>
          <select id="modal-test-rating" class="form-control">
            <option value="5" ${testimonial && testimonial.rating === 5 ? 'selected' : ''}>5 Estrelas (Excelente)</option>
            <option value="4" ${testimonial && testimonial.rating === 4 ? 'selected' : ''}>4 Estrelas (Muito Bom)</option>
          </select>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Serviço Realizado:</label>
        <input type="text" id="modal-test-srv" class="form-control" value="${testimonial ? (testimonial.serviceDone || '') : 'Assentamento de Porcelanato'}">
      </div>
      <div class="form-group">
        <label class="form-label">Texto da Avaliação:</label>
        <textarea id="modal-test-text" class="form-control" rows="3" placeholder="Depoimento sincero sobre a qualidade e pontualidade...">${testimonial ? testimonial.text : ''}</textarea>
      </div>
    `;

    backdrop.classList.add('is-open');

    saveBtn.onclick = async () => {
      const name = document.getElementById('modal-test-name').value.trim();
      const location = document.getElementById('modal-test-loc').value.trim();
      const rating = parseInt(document.getElementById('modal-test-rating').value, 10);
      const serviceDone = document.getElementById('modal-test-srv').value.trim();
      const text = document.getElementById('modal-test-text').value.trim();

      if (!name || !text) {
        alert('Por favor, informe o nome do cliente e o texto do depoimento.');
        return;
      }

      await dataService.saveTestimonial({
        id: testimonial ? testimonial.id : null,
        name,
        location,
        rating,
        serviceDone,
        text
      });

      backdrop.classList.remove('is-open');
      this.showToast('Depoimento salvo com sucesso!');
      this.renderTestimonialsTab(document.getElementById('admin-tab-content'));
    };
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new AdminApp();
});
