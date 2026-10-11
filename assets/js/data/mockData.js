/**
 * Dados Iniciais Mockados (Seed) - DASA Centro Automotivo
 * Estrutura preparada para sincronização com LocalStorage e Supabase
 */

export const INITIAL_SERVICES = [
  {
    id: 'srv-1',
    name: 'Troca de Óleo e Filtros',
    category: 'Lubrificação',
    description: 'Óleos sintéticos recomendados pela montadora (5W30, 0W20, 10W40) + filtro de óleo e vedação para máxima longevidade do motor.',
    price: 180.00,
    unit: 'a partir de',
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=600&q=80',
    time: '40 min',
    featured: true
  },
  {
    id: 'srv-2',
    name: 'Revisão Preventiva (Check-up 30 Itens)',
    category: 'Check-up Geral',
    description: 'Inspeção minuciosa de segurança: fluidos, correias, velas, bateria, iluminação, pneus, suspensão e freios com relatório de saúde.',
    price: 220.00,
    unit: 'serviço',
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=600&q=80',
    time: '1h30',
    featured: true
  },
  {
    id: 'srv-3',
    name: 'Manutenção de Freios e Pastilhas',
    category: 'Segurança',
    description: 'Substituição de pastilhas de cerâmica, aferição de espessura de discos ventilados, sangria com máquina e teste do fluido DOT 4/5.1.',
    price: 160.00,
    unit: 'par dianteiro',
    image: 'https://images.unsplash.com/photo-1600793575654-910699b5e4d4?auto=format&fit=crop&w=600&q=80',
    time: '1h',
    featured: true
  },
  {
    id: 'srv-4',
    name: 'Alinhamento 3D e Balanceamento',
    category: 'Geometria 3D',
    description: 'Geometria computadorizada a laser com parâmetros oficiais de fábrica. Elimina vibrações no volante e evita desgaste irregular dos pneus.',
    price: 120.00,
    unit: '4 rodas',
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=600&q=80',
    time: '50 min',
    featured: true
  },
  {
    id: 'srv-5',
    name: 'Diagnóstico por Scanner (Injeção)',
    category: 'Injeção Eletrônica',
    description: 'Leitura completa de códigos de falha em injeção eletrônica, sensores de motor, câmbio, ABS e Airbag com reset de luz de anomalia.',
    price: 130.00,
    unit: 'diagnóstico',
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=600&q=80',
    time: '45 min',
    featured: true
  },
  {
    id: 'srv-6',
    name: 'Higienização e Carga de Ar-Condicionado',
    category: 'Climatização',
    description: 'Oxi-sanitização por ozônio bactericida anti-ácaro, troca do filtro de cabine e recarga de gás R134a para resfriamento rápido no calor de Petrolina.',
    price: 150.00,
    unit: 'serviço',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80',
    time: '1h',
    featured: true
  },
  {
    id: 'srv-7',
    name: 'Suspensão, Amortecedores e Buchas',
    category: 'Conforto & Direção',
    description: 'Substituição de amortecedores, molas, bieletas, pivôs e buchas. Eliminação de rangidos e barulhos secos em lombadas e asfalto irregular.',
    price: 200.00,
    unit: 'eixo',
    image: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&w=600&q=80',
    time: '2h',
    featured: true
  },
  {
    id: 'srv-8',
    name: 'Sistema de Arrefecimento e Radiador',
    category: 'Temperatura',
    description: 'Limpeza de reservatório, teste de estanqueidade contra vazamentos e reposição de aditivo orgânico com água desmineralizada contra fervura.',
    price: 140.00,
    unit: 'serviço',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80',
    time: '1h',
    featured: false
  },
  {
    id: 'srv-9',
    name: 'Teste e Troca de Bateria / Alternador',
    category: 'Elétrica',
    description: 'Aferição de CCA e carga do alternador com equipamento digital, limpeza de bornes e instalação de baterias novas seladas com garantia.',
    price: 90.00,
    unit: 'mão de obra',
    image: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=600&q=80',
    time: '30 min',
    featured: false
  },
  {
    id: 'srv-10',
    name: 'Troca de Kit Correia Dentada e Tensor',
    category: 'Motor & Correias',
    description: 'Substituição preventiva da correia de sincronismo e polias tensoras dentro da quilometragem recomendada para proteger as válvulas.',
    price: 280.00,
    unit: 'serviço',
    image: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=600&q=80',
    time: '2h30',
    featured: false
  }
];

export const INITIAL_PROJECTS = [
  {
    id: 'proj-1',
    title: 'Restauração e Vitrificação de Faróis Opacos',
    category: 'Estética & Faróis',
    description: 'Lixamento progressivo em 4 etapas e vitrificação cerâmica com proteção UV, restaurando o alcance do facho de luz na estrada.',
    beforeImage: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
    afterImage: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=800&q=80',
    tags: ['Proteção UV', 'Recuperação de foco', 'Lente 100% cristalina'],
    date: '2026-03-20'
  },
  {
    id: 'proj-2',
    title: 'Limpeza Técnica a Vapor e Detalhamento de Motor',
    category: 'Motor & Injeção',
    description: 'Descontaminação profunda sem agredir chicotes elétricos ou bobinas, higienização a vapor seco e proteção térmica com verniz protetor.',
    beforeImage: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=800&q=80',
    afterImage: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=800&q=80',
    tags: ['Vapor ecológico a seco', 'Chicotes protegidos', 'Verniz protetor térmico'],
    date: '2026-02-14'
  },
  {
    id: 'proj-3',
    title: 'Troca de Discos Ventilados e Pastilhas Cerâmica',
    category: 'Freios',
    description: 'Substituição completa do conjunto com discos Fremax de alta dissipação e pastilhas cerâmicas Bosch, eliminando chiados e vibrações.',
    beforeImage: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&w=800&q=80',
    afterImage: 'https://images.unsplash.com/photo-1600793575654-910699b5e4d4?auto=format&fit=crop&w=800&q=80',
    tags: ['Pastilhas de cerâmica', 'Fluido DOT 4 novo', 'Zero vibração no pedal'],
    date: '2026-01-28'
  },
  {
    id: 'proj-4',
    title: 'Alinhamento 3D e Revisão Completa de Suspensão',
    category: 'Suspensão',
    description: 'Troca preventiva de amortecedores e batentes com geometria computadorizada 3D a laser, garantindo estabilidade total na pista.',
    beforeImage: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=800&q=80',
    afterImage: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80',
    tags: ['Geometria laser 3D', 'Amortecedores novos', 'Estabilidade na rodovia'],
    date: '2026-01-10'
  }
];

export const INITIAL_TESTIMONIALS = [
  {
    id: 'test-1',
    author: 'Marcos Vinícius',
    location: 'Caminho do Sol - Petrolina',
    car: 'Jeep Compass Longitude',
    rating: 5,
    text: 'Levei meu carro para revisão antes de pegar estrada para o litoral. Atendimento pontual, explicaram tudo o que precisava trocar sem empurrar peças desnecessárias e entregaram no horário combinado. Muito confiável!',
    avatar: 'M',
    featured: true
  },
  {
    id: 'test-2',
    author: 'Camila Duarte',
    location: 'Bairro Atrás da Banca - Petrolina',
    car: 'Chevrolet Onix Turbo',
    rating: 5,
    text: 'A luz de injeção acendeu e passei em duas oficinas sem solução. Na DASA passaram o scanner, identificaram o sensor com defeito e resolveram na hora. Preço super justo e equipe muito atenciosa!',
    avatar: 'C',
    featured: true
  },
  {
    id: 'test-3',
    author: 'Rodrigo Alencar',
    location: 'Centro - Petrolina',
    car: 'Toyota Corolla XEi',
    rating: 5,
    text: 'Estrutura de ponta e muita transparência. O carro ficou perfeito, sem puxar nada e rodando macio com o alinhamento 3D. Recomendo de olhos fechados a todos de Petrolina e Juazeiro!',
    avatar: 'R',
    featured: true
  },
  {
    id: 'test-4',
    author: 'Eduardo Silveira',
    location: 'Juazeiro - BA',
    car: 'Fiat Toro Volcano',
    rating: 5,
    text: 'Atendimento nota 10. Fizeram a troca de pastilhas e sangria do fluido de freio em menos de 1 hora com preço muito bom. Excelente ter uma mecânica de confiança perto da gente.',
    avatar: 'E',
    featured: true
  }
];

export const INITIAL_SETTINGS = {
  businessName: 'DASA Centro Automotivo',
  tagline: 'Auto Peças e Serviços Mecânicos Especializados',
  professionalName: 'Equipe DASA',
  phoneDisplay: '(87) 3862-3648',
  phoneRaw: '8738623648',
  whatsappRaw: '558738623648',
  instagramHandle: '@dasacentroautomotivo',
  instagramUrl: 'https://www.instagram.com/dasacentroautomotivo/',
  address: 'Rua Miguel Santos, 356 - Cidade Jardim - Caminho do Sol, Petrolina - PE, 56330-620',
  plusCode: 'JF9W+9M Caminho do Sol, Petrolina - PE',
  googleMapsUrl: 'https://www.google.com.br/maps/place/Dasa+Centro+Automotivo+-+Auto+Pe%C3%A7as+e+Servi%C3%A7os,+Petrolina,+Pernambuco/@-9.3814963,-40.5034818,19z/data=!4m6!3m5!1s0x7737079e9e9619b:0xa8cd7bf26769a444!8m2!3d-9.3815255!4d-40.5033337!16s%2Fg%2F11f2wr9r36!5m1!1e1?entry=ttu&g_ep=EgoyMDI2MTAwNy4wIKXMDSoASAFQAw%3D%3D',
  serviceArea: 'Petrolina - PE, Juazeiro - BA e Vale do São Francisco',
  workingHours: 'Seg a Sex: 07:30 às 18:00 | Sáb: 07:30 às 12:00'
};
