/**
 * Serviço de Integração com API FIPE de Veículos
 * Fornece Marcas, Modelos e Anos para seleção em orçamentos e agendamentos.
 * Possui fallback instantâneo com as marcas e modelos mais vendidos do Brasil.
 */

const POPULAR_BRANDS = [
  { codigo: '23', nome: 'Chevrolet' },
  { codigo: '21', nome: 'Fiat' },
  { codigo: '59', nome: 'Volkswagen' },
  { codigo: '56', nome: 'Toyota' },
  { codigo: '26', nome: 'Hyundai' },
  { codigo: '25', nome: 'Honda' },
  { codigo: '29', nome: 'Jeep' },
  { codigo: '48', nome: 'Renault' },
  { codigo: '22', nome: 'Ford' },
  { codigo: '43', nome: 'Nissan' },
  { codigo: '13', nome: 'Citroën' },
  { codigo: '44', nome: 'Peugeot' },
  { codigo: '161', nome: 'Caoa Chery' },
  { codigo: '41', nome: 'Mitsubishi' },
  { codigo: '7', nome: 'BMW' },
  { codigo: '39', nome: 'Mercedes-Benz' }
];

const POPULAR_MODELS_FALLBACK = {
  '23': ['Onix', 'Onix Plus', 'Prisma', 'Tracker', 'Spin', 'S10', 'Cruze', 'Celta', 'Corsa', 'Montana'],
  '21': ['Strada', 'Mobi', 'Argo', 'Toro', 'Cronos', 'Pulse', 'Fastback', 'Palio', 'Uno', 'Fiorino'],
  '59': ['Polo', 'T-Cross', 'Nivus', 'Gol', 'Virtus', 'Saveiro', 'Taos', 'Voyage', 'Fox', 'Amarok'],
  '56': ['Corolla', 'Corolla Cross', 'Hilux', 'Yaris Hatch', 'Yaris Sedan', 'SW4', 'Etios'],
  '26': ['HB20', 'HB20S', 'Creta', 'Tucson', 'ix35', 'Santa Fe'],
  '25': ['Civic', 'HR-V', 'Fit', 'City', 'WR-V', 'CR-V'],
  '29': ['Renegade', 'Compass', 'Commander', 'Grand Cherokee'],
  '48': ['Kwid', 'Sandero', 'Logan', 'Duster', 'Oroch', 'Captur', 'Kardian'],
  '22': ['Ka', 'Ka Sedan', 'EcoSport', 'Ranger', 'Fiesta', 'Focus', 'Territory'],
  '43': ['Kicks', 'Versa', 'Sentra', 'Frontier', 'March']
};

class CarApiService {
  constructor() {
    this.cacheBrandsKey = 'dasa_fipe_brands_cache';
    this.cacheModelsPrefix = 'dasa_fipe_models_';
  }

  /**
   * Obtém a lista de marcas (com fallback garantido)
   */
  async getBrands() {
    try {
      const cached = sessionStorage.getItem(this.cacheBrandsKey);
      if (cached) return JSON.parse(cached);

      const response = await fetch('https://parallelum.com.br/fipe/api/v1/carros/marcas', {
        headers: { 'Accept': 'application/json' }
      });
      
      if (!response.ok) throw new Error('API indisponível');
      
      const brands = await response.json();
      if (Array.isArray(brands) && brands.length > 0) {
        sessionStorage.setItem(this.cacheBrandsKey, JSON.stringify(brands));
        return brands;
      }
    } catch (e) {
      console.warn('API FIPE offline ou lenta. Usando marcas populares integradas.', e);
    }
    return POPULAR_BRANDS;
  }

  /**
   * Obtém modelos para uma marca
   */
  async getModels(brandCode) {
    if (!brandCode) return [];

    try {
      const cacheKey = this.cacheModelsPrefix + brandCode;
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) return JSON.parse(cached);

      const response = await fetch(`https://parallelum.com.br/fipe/api/v1/carros/marcas/${brandCode}/modelos`, {
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) throw new Error('Falha ao buscar modelos');

      const data = await response.json();
      const models = data.modelos || [];
      if (models.length > 0) {
        sessionStorage.setItem(cacheKey, JSON.stringify(models));
        return models;
      }
    } catch (e) {
      console.warn(`Fallback de modelos ativado para a marca ${brandCode}`);
    }

    // Fallback integrado
    const fallbackList = POPULAR_MODELS_FALLBACK[brandCode] || ['Modelo Padrão / Passeio', 'Sedan / Hatch', 'SUV / Utilitário'];
    return fallbackList.map((m, idx) => ({ codigo: String(idx + 1), nome: m }));
  }

  /**
   * Retorna os últimos anos de veículos
   */
  getRecentYears() {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let y = currentYear + 1; y >= 2000; y--) {
      years.push(y);
    }
    return years;
  }
}

export const carApiService = new CarApiService();
