/**
 * Calculadora Automotiva com Seleção FIPE de Veículo - DASA Centro Automotivo
 * Permite selecionar Marca, Modelo, Ano do carro e os serviços automotivos.
 * Gera mensagem estruturada direto para o WhatsApp da DASA.
 */
import { formatCurrency } from '../utils/formatters.js';
import { getWhatsAppUrl, buildCalculatorWhatsAppMessage } from '../utils/whatsapp.js';
import { APP_CONFIG } from '../config/settings.js';
import { carApiService } from '../services/carApiService.js';

export class BudgetCalculator {
  constructor({ containerId, services = [] }) {
    this.container = document.getElementById(containerId);
    this.services = services;
    this.rows = []; // [{ id, serviceId, qty }]
    this.vehicle = {
      brandCode: '23',
      brandName: 'Chevrolet',
      modelName: 'Onix',
      year: new Date().getFullYear().toString(),
      plate: ''
    };
    this.brands = [];
    this.models = [];
    this.init();
  }

  async init() {
    if (!this.container) return;

    // Carrega marcas
    this.brands = await carApiService.getBrands();
    this.models = await carApiService.getModels(this.vehicle.brandCode);

    // Inicia com 2 serviços padrão da mecânica
    if (this.services.length > 0) {
      this.rows.push({
        id: 'row-1',
        serviceId: this.services[0].id,
        qty: 1
      });
      if (this.services[1]) {
        this.rows.push({
          id: 'row-2',
          serviceId: this.services[1].id,
          qty: 1
        });
      }
    }

    this.render();
  }

  setServices(services) {
    this.services = services;
    if (this.rows.length === 0 && services.length > 0) {
      this.rows.push({
        id: 'row-' + Date.now(),
        serviceId: services[0].id,
        qty: 1
      });
    }
    this.render();
  }

  addServiceRow(preSelectedServiceId = null) {
    // Escolhe um serviço que ainda não esteja na lista, se possível
    const usedIds = this.rows.map(r => r.serviceId);
    const available = this.services.find(s => !usedIds.includes(s.id)) || this.services[0];
    const serviceId = preSelectedServiceId || (available ? available.id : '');

    this.rows.push({
      id: 'row-' + Date.now() + Math.random().toString(36).substr(2, 4),
      serviceId,
      qty: 1
    });
    this.render();
  }

  removeServiceRow(rowId) {
    if (this.rows.length <= 1) {
      return;
    }
    this.rows = this.rows.filter(r => r.id !== rowId);
    this.render();
  }

  updateRow(rowId, field, value) {
    const row = this.rows.find(r => r.id === rowId);
    if (!row) return;

    if (field === 'serviceId') {
      row.serviceId = value;
    } else if (field === 'qty') {
      const num = parseInt(value, 10);
      row.qty = isNaN(num) || num < 1 ? 1 : num;
    }
    this.updateTotals();
  }

  calculateBreakdown() {
    let total = 0;
    const items = [];

    this.rows.forEach(row => {
      const srv = this.services.find(s => s.id === row.serviceId);
      if (srv) {
        const qty = Number(row.qty) || 1;
        const subtotal = qty * (Number(srv.price) || 0);
        total += subtotal;
        items.push({
          name: srv.name,
          qty: qty,
          unit: srv.unit || 'serviço',
          price: srv.price,
          subtotal: subtotal
        });
      }
    });

    return { items, total };
  }

  render() {
    if (!this.container) return;

    const { items, total } = this.calculateBreakdown();
    const years = carApiService.getRecentYears();

    this.container.innerHTML = `
      <div class="calculator-card" style="box-shadow: 0 10px 30px rgba(16, 50, 92, 0.08); border: 1px solid var(--color-border); border-radius: var(--radius-lg); overflow: hidden; background: #fff;">
        <div class="calculator-header" style="background: linear-gradient(135deg, var(--color-azul-escuro) 0%, #174275 100%); color: #fff; padding: 1.75rem 2rem; display: flex; align-items: center; gap: 1.25rem;">
          <div class="calculator-header-icon" style="background: var(--color-vermelho); color: #fff; width: 52px; height: 52px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 4px 12px rgba(204, 27, 39, 0.35);">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C2.1 10.7 2 10.8 2 11v5c0 .6.4 1 1 1h2"></path>
              <circle cx="7" cy="17" r="2"></circle>
              <circle cx="17" cy="17" r="2"></circle>
            </svg>
          </div>
          <div>
            <h3 class="calculator-title" style="margin: 0; font-size: 1.35rem; font-weight: 800; color: #fff;">Simulador de Serviços por Veículo</h3>
            <p class="calculator-subtitle" style="margin: 0.25rem 0 0; font-size: 0.9rem; color: #e2e8f0; opacity: 0.95;">Escolha seu veículo e os serviços desejados para uma estimativa imediata em Petrolina.</p>
          </div>
        </div>

        <div style="padding: 1.75rem 2rem;">
          <!-- 1. IDENTIFICAÇÃO DO VEÍCULO (FIPE API) -->
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: var(--radius-md); padding: 1.25rem; margin-bottom: 1.5rem;">
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
              <span style="display: inline-block; width: 8px; height: 8px; background: var(--color-vermelho); border-radius: 50%;"></span>
              <strong style="color: var(--color-azul-escuro); font-size: 0.95rem; text-transform: uppercase; letter-spacing: 0.5px;">1. Selecione o seu Veículo</strong>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
              <div>
                <label class="calc-label" style="display: block; font-size: 0.825rem; font-weight: 600; color: #475569; margin-bottom: 0.35rem;">Montadora / Marca:</label>
                <select id="calc-car-brand" class="form-select" style="width: 100%; height: 42px; border-radius: 8px; border: 1px solid #cbd5e1; font-weight: 500;">
                  ${this.brands.map(b => `
                    <option value="${b.codigo}" data-name="${b.nome}" ${b.codigo === this.vehicle.brandCode ? 'selected' : ''}>
                      ${b.nome}
                    </option>
                  `).join('')}
                </select>
              </div>

              <div>
                <label class="calc-label" style="display: block; font-size: 0.825rem; font-weight: 600; color: #475569; margin-bottom: 0.35rem;">Modelo:</label>
                <select id="calc-car-model" class="form-select" style="width: 100%; height: 42px; border-radius: 8px; border: 1px solid #cbd5e1; font-weight: 500;">
                  ${this.models.map(m => `
                    <option value="${m.nome}" ${m.nome === this.vehicle.modelName ? 'selected' : ''}>
                      ${m.nome}
                    </option>
                  `).join('')}
                </select>
              </div>

              <div>
                <label class="calc-label" style="display: block; font-size: 0.825rem; font-weight: 600; color: #475569; margin-bottom: 0.35rem;">Ano de Fabricação:</label>
                <select id="calc-car-year" class="form-select" style="width: 100%; height: 42px; border-radius: 8px; border: 1px solid #cbd5e1; font-weight: 500;">
                  ${years.map(y => `
                    <option value="${y}" ${String(y) === this.vehicle.year ? 'selected' : ''}>${y}</option>
                  `).join('')}
                </select>
              </div>

              <div>
                <label class="calc-label" style="display: block; font-size: 0.825rem; font-weight: 600; color: #475569; margin-bottom: 0.35rem;">Placa (Opcional):</label>
                <input type="text" id="calc-car-plate" class="form-control" placeholder="Ex: ABC1D23" maxlength="8" value="${this.vehicle.plate}" style="width: 100%; height: 42px; border-radius: 8px; border: 1px solid #cbd5e1; text-transform: uppercase;">
              </div>
            </div>
          </div>

          <!-- 2. SERVIÇOS DESEJADOS -->
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <span style="display: inline-block; width: 8px; height: 8px; background: var(--color-azul-medio); border-radius: 50%;"></span>
              <strong style="color: var(--color-azul-escuro); font-size: 0.95rem; text-transform: uppercase; letter-spacing: 0.5px;">2. Serviços e Itens Desejados</strong>
            </div>
          </div>

          <div class="calc-rows-container" id="calc-rows-list">
            ${this.rows.map((row, index) => {
              const currentSrv = this.services.find(s => s.id === row.serviceId) || this.services[0];
              const subtotal = (Number(row.qty) || 1) * (currentSrv ? currentSrv.price : 0);

              return `
                <div class="calc-row" data-row-id="${row.id}">
                  <div class="calc-col-service">
                    <label class="calc-label" style="font-size: 0.75rem; color: #64748b; font-weight: 600; display: block; margin-bottom: 0.25rem;">Serviço #${index + 1}:</label>
                    <select class="calc-select form-select" data-field="serviceId" style="width: 100%; height: 40px; border-radius: 6px;">
                      ${this.services.map(s => `
                        <option value="${s.id}" ${s.id === row.serviceId ? 'selected' : ''}>
                          ${s.name} (${formatCurrency(s.price)})
                        </option>
                      `).join('')}
                    </select>
                  </div>

                  <div class="calc-col-area">
                    <label class="calc-label" style="font-size: 0.75rem; color: #64748b; font-weight: 600; display: block; margin-bottom: 0.25rem;">Qtd:</label>
                    <input type="number" min="1" max="10" step="1" class="calc-input-area form-control" value="${row.qty}" data-field="qty" style="height: 40px; border-radius: 6px; text-align: center;">
                  </div>

                  <div class="calc-col-subtotal" style="text-align: right;">
                    <label class="calc-label" style="font-size: 0.75rem; color: #64748b; font-weight: 600; display: block; margin-bottom: 0.25rem;">Subtotal Ref.:</label>
                    <div class="calc-subtotal-val" style="font-size: 1.05rem; font-weight: 700; color: var(--color-azul-escuro);">${formatCurrency(subtotal)}</div>
                  </div>

                  <div class="calc-col-action" style="text-align: center;">
                    <button type="button" class="btn-remove-row" title="Remover serviço" data-remove-id="${row.id}" style="background: none; border: none; color: #94a3b8; cursor: pointer; padding: 8px; border-radius: 6px; transition: color 0.2s;" onmouseover="this.style.color='#cc1b27'" onmouseout="this.style.color='#94a3b8'">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              `;
            }).join('')}
          </div>

          <!-- Botão Adicionar Mais Serviços -->
          <div style="margin: 1rem 0 1.5rem;">
            <button type="button" id="btn-add-calc-row" class="btn btn-sm" style="background: #e2e8f0; color: #1e293b; font-weight: 600; border-radius: 8px; border: none; padding: 0.6rem 1rem; display: inline-flex; align-items: center; gap: 0.5rem; cursor: pointer;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Adicionar Outro Serviço
            </button>
          </div>

          <!-- Seção de Totalização -->
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: var(--radius-md); padding: 1.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid #e2e8f0;">
              <div>
                <span style="font-size: 0.8rem; font-weight: 700; color: #64748b; letter-spacing: 0.5px;">ESTIMATIVA DE REFERÊNCIA</span>
                <div class="calc-total-display" id="calc-total-display" style="font-size: 2rem; font-weight: 800; color: var(--color-azul-escuro); line-height: 1.1;">
                  ${formatCurrency(total)}
                </div>
              </div>
              <div style="background: #e0f2fe; color: var(--color-azul-medio); font-weight: 700; font-size: 0.85rem; padding: 0.4rem 0.85rem; border-radius: 999px;">
                ✓ Veículo: <span id="summary-car-text">${this.vehicle.brandName} ${this.vehicle.modelName} (${this.vehicle.year})</span>
              </div>
            </div>

            <!-- Disclaimer -->
            <div style="display: flex; gap: 0.75rem; font-size: 0.825rem; color: #64748b; margin-bottom: 1.25rem;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#cc1b27" stroke-width="2" style="flex-shrink: 0; margin-top: 2px;">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <p style="margin: 0;"><strong>Atenção:</strong> ${APP_CONFIG.calculatorDisclaimer}</p>
            </div>

            <!-- Identificação do Cliente -->
            <div style="display: grid; grid-template-columns: 1fr; gap: 1rem; margin-bottom: 1.25rem;">
              <div>
                <label for="calc-client-name" style="font-size: 0.825rem; font-weight: 600; color: #475569; display: block; margin-bottom: 0.35rem;">Seu Nome (opcional):</label>
                <input type="text" id="calc-client-name" class="form-control" placeholder="Ex: Rodrigo Alencar" style="height: 42px; border-radius: 8px;">
              </div>
            </div>

            <!-- Botão WhatsApp de Alta Conversão com Vermelho DASA -->
            <div>
              <button type="button" id="btn-calc-whatsapp" class="btn btn-lg btn-block" style="background: var(--color-vermelho); color: #fff; font-weight: 700; font-size: 1.1rem; height: 54px; border-radius: 10px; border: none; width: 100%; display: flex; align-items: center; justify-content: center; gap: 0.6rem; cursor: pointer; box-shadow: 0 4px 14px rgba(204, 27, 39, 0.35); transition: background 0.2s;" onmouseover="this.style.background='#b0141f'" onmouseout="this.style.background='#cc1b27'">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.031 2C6.511 2 2.018 6.49 2.018 12.01c0 1.83.493 3.55 1.353 5.04L2 22l5.12-1.34c1.44.79 3.09 1.23 4.91 1.23 5.52 0 10.01-4.49 10.01-10.01 0-5.52-4.49-10.01-10.01-10.01zm0 18.28c-1.57 0-3.04-.42-4.32-1.16l-.31-.18-3.21.84.86-3.13-.2-.32a8.23 8.23 0 0 1-1.27-4.48c0-4.57 3.72-8.28 8.28-8.28 4.56 0 8.28 3.71 8.28 8.28 0 4.56-3.72 8.28-8.28 8.28zm4.54-6.2c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.07-.39-2.03-1.25-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.12-.14.17-.25.25-.41.08-.17.04-.32-.02-.45-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.32-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.71 4.31 3.8 2.53 1.09 2.53.73 2.99.69.45-.04 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.06-.1-.23-.17-.48-.29z"/>
                </svg>
                Agendar e Confirmar Orçamento no WhatsApp
              </button>
              <p style="text-align: center; margin: 0.5rem 0 0; font-size: 0.8rem; color: #64748b;">
                Você será direcionado com os serviços e seu veículo detalhados para atendimento imediato na DASA.
              </p>
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  updateTotals() {
    const { total } = this.calculateBreakdown();

    this.rows.forEach(row => {
      const rowEl = this.container.querySelector(`[data-row-id="${row.id}"]`);
      if (rowEl) {
        const srv = this.services.find(s => s.id === row.serviceId);
        const subtotal = (Number(row.qty) || 1) * (srv ? srv.price : 0);
        const subtotalEl = rowEl.querySelector('.calc-subtotal-val');
        if (subtotalEl) {
          subtotalEl.textContent = formatCurrency(subtotal);
        }
      }
    });

    const totalEl = this.container.querySelector('#calc-total-display');
    if (totalEl) {
      totalEl.textContent = formatCurrency(total);
    }
  }

  bindEvents() {
    // Eventos do seletor de veículo FIPE
    const brandSelect = this.container.querySelector('#calc-car-brand');
    const modelSelect = this.container.querySelector('#calc-car-model');
    const yearSelect = this.container.querySelector('#calc-car-year');
    const plateInput = this.container.querySelector('#calc-car-plate');
    const summaryCarText = this.container.querySelector('#summary-car-text');

    if (brandSelect && modelSelect) {
      brandSelect.addEventListener('change', async (e) => {
        const code = e.target.value;
        const brandObj = this.brands.find(b => b.codigo === code);
        this.vehicle.brandCode = code;
        this.vehicle.brandName = brandObj ? brandObj.nome : '';

        // Carrega modelos dinâmicos da API FIPE
        modelSelect.innerHTML = `<option>Carregando modelos...</option>`;
        this.models = await carApiService.getModels(code);
        modelSelect.innerHTML = this.models.map(m => `
          <option value="${m.nome}">${m.nome}</option>
        `).join('');

        this.vehicle.modelName = this.models[0] ? this.models[0].nome : '';
        if (summaryCarText) {
          summaryCarText.textContent = `${this.vehicle.brandName} ${this.vehicle.modelName} (${this.vehicle.year})`;
        }
      });

      modelSelect.addEventListener('change', (e) => {
        this.vehicle.modelName = e.target.value;
        if (summaryCarText) {
          summaryCarText.textContent = `${this.vehicle.brandName} ${this.vehicle.modelName} (${this.vehicle.year})`;
        }
      });
    }

    if (yearSelect) {
      yearSelect.addEventListener('change', (e) => {
        this.vehicle.year = e.target.value;
        if (summaryCarText) {
          summaryCarText.textContent = `${this.vehicle.brandName} ${this.vehicle.modelName} (${this.vehicle.year})`;
        }
      });
    }

    if (plateInput) {
      plateInput.addEventListener('input', (e) => {
        this.vehicle.plate = e.target.value;
      });
    }

    // Linhas de serviços
    this.container.querySelectorAll('.calc-row').forEach(rowEl => {
      const rowId = rowEl.getAttribute('data-row-id');

      const serviceSelect = rowEl.querySelector('[data-field="serviceId"]');
      if (serviceSelect) {
        serviceSelect.addEventListener('change', (e) => {
          this.updateRow(rowId, 'serviceId', e.target.value);
        });
      }

      const qtyInput = rowEl.querySelector('[data-field="qty"]');
      if (qtyInput) {
        qtyInput.addEventListener('input', (e) => {
          this.updateRow(rowId, 'qty', e.target.value);
        });
      }

      const removeBtn = rowEl.querySelector('[data-remove-id]');
      if (removeBtn) {
        removeBtn.addEventListener('click', () => {
          this.removeServiceRow(rowId);
        });
      }
    });

    // Botão de adicionar linha
    const addBtn = this.container.querySelector('#btn-add-calc-row');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        this.addServiceRow();
      });
    }

    // Botão de envio para WhatsApp
    const waBtn = this.container.querySelector('#btn-calc-whatsapp');
    if (waBtn) {
      waBtn.addEventListener('click', () => {
        const { items, total } = this.calculateBreakdown();
        const clientNameInput = this.container.querySelector('#calc-client-name');
        const clientName = clientNameInput ? clientNameInput.value.trim() : '';

        const carInfo = {
          brand: this.vehicle.brandName,
          model: this.vehicle.modelName,
          year: this.vehicle.year,
          plate: this.vehicle.plate
        };

        const message = buildCalculatorWhatsAppMessage(items, total, carInfo, clientName);
        const url = getWhatsAppUrl(APP_CONFIG.whatsappRaw, message);
        window.open(url, '_blank', 'noopener,noreferrer');
      });
    }
  }
}
