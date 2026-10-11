-- ====================================================================
-- ESQUEMA COMPLETO DE BANCO DE DADOS - SUPABASE (POSTGRESQL)
-- Projeto: Web App Profissional para Construção Civil / Reformas
-- ====================================================================

-- 1. Habilitar extensão para geração de UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Tabela: Configurações do Profissional / Empresa
CREATE TABLE IF NOT EXISTS public.settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_name VARCHAR(150) NOT NULL DEFAULT 'Clebson Gomes - Construção & Reformas',
    professional_name VARCHAR(100) NOT NULL DEFAULT 'Clebson Gomes',
    phone VARCHAR(20) NOT NULL DEFAULT '87991965954',
    whatsapp VARCHAR(20) NOT NULL DEFAULT '87991965954',
    description TEXT DEFAULT 'Especialista em assentamento de porcelanato, cerâmicas finas, reboco de alto padrão e reformas residenciais completas.',
    service_area VARCHAR(200) DEFAULT 'Petrolina, Juazeiro e toda a região do Vale do São Francisco',
    working_hours VARCHAR(100) DEFAULT 'Segunda a Sexta: 07:30 às 17:30 | Sábado: 07:30 às 12:00',
    instagram VARCHAR(100) DEFAULT '@clebson.obras.reformas',
    years_experience INT DEFAULT 15,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Tabela: Serviços
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    unit VARCHAR(30) NOT NULL DEFAULT 'm²',
    icon VARCHAR(50) DEFAULT 'hammer',
    featured BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Tabela: Obras Realizadas (Projetos)
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(80) NOT NULL DEFAULT 'Porcelanato',
    before_image_url TEXT NOT NULL,
    after_image_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Tabela: Imagens Adicionais dos Projetos (Opcional para galerias ampliadas)
CREATE TABLE IF NOT EXISTS public.project_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('before', 'after', 'detail', 'progress')),
    url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Tabela: Depoimentos de Clientes
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(120) NOT NULL,
    location VARCHAR(120) DEFAULT 'Bairro Centro',
    service_done VARCHAR(120) DEFAULT 'Assentamento de Porcelanato',
    text TEXT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5) DEFAULT 5,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Tabela: Solicitações de Orçamento e Agendamentos de Visita Técnica
CREATE TABLE IF NOT EXISTS public.quote_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_name VARCHAR(120) NOT NULL,
    client_phone VARCHAR(30) NOT NULL,
    service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
    service_name VARCHAR(150),
    area_m2 NUMERIC(8, 2),
    estimated_total NUMERIC(10, 2),
    breakdown_json JSONB,
    preferred_date DATE,
    preferred_period VARCHAR(30), -- 'Manhã', 'Tarde', 'Horário comercial'
    notes TEXT,
    status VARCHAR(30) DEFAULT 'Pendente' CHECK (status IN ('Pendente', 'Em Atendimento', 'Visita Agendada', 'Concluído', 'Cancelado')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ====================================================================
-- POLÍTICAS DE SEGURANÇA (ROW LEVEL SECURITY - RLS)
-- ====================================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;

-- 1. Leitura Pública (Visitantes podem ver site institucional livremente)
CREATE POLICY "Permitir leitura pública de configurações" ON public.settings FOR SELECT USING (true);
CREATE POLICY "Permitir leitura pública de serviços" ON public.services FOR SELECT USING (true);
CREATE POLICY "Permitir leitura pública de projetos" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Permitir leitura pública de imagens de projetos" ON public.project_images FOR SELECT USING (true);
CREATE POLICY "Permitir leitura pública de depoimentos" ON public.testimonials FOR SELECT USING (true);

-- 2. Visitantes podem enviar solicitações de orçamento
CREATE POLICY "Permitir inserção pública de solicitações" ON public.quote_requests FOR INSERT WITH CHECK (true);

-- 3. Apenas usuário autenticado (Mestre / Admin) pode alterar dados
CREATE POLICY "Admin pode gerenciar configurações" ON public.settings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin pode gerenciar serviços" ON public.services FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin pode gerenciar projetos" ON public.projects FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin pode gerenciar imagens" ON public.project_images FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin pode gerenciar depoimentos" ON public.testimonials FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin pode ver e gerenciar solicitações" ON public.quote_requests FOR ALL USING (auth.role() = 'authenticated');

-- ====================================================================
-- SEED INICIAL (DADOS INICIAIS DE EXEMPLO)
-- ====================================================================
INSERT INTO public.settings (business_name, professional_name, phone, whatsapp, description, service_area, working_hours)
VALUES (
    'Clebson Gomes - Construção e Reformas',
    'Clebson Gomes',
    '87991965954',
    '87991965954',
    'Mais de 15 anos de tradição em assentamento de porcelanato retificado, cerâmicas finas, contrapiso nivelado, reboco de qualidade e reformas completas.',
    'Petrolina, Juazeiro e toda a região do Vale',
    'Segunda a Sábado, das 07:30 às 18:00'
);

INSERT INTO public.services (name, description, price, unit, icon) VALUES
('Assentamento de Cerâmica', 'Instalação alinhada com espaçadores niveladores, argamassa apropriada e rejuntamento perfeito.', 40.00, 'm²', 'grid'),
('Assentamento de Porcelanato', 'Mão de obra de alta precisão para grandes formatos, cortes em 45 graus (meia-esquadria) e nivelamento impecável.', 45.00, 'm²', 'layers'),
('Preparação e Reboco', 'Aplicação de chapisco, emboço e reboco nivelado pronto para receber pintura ou revestimentos.', 28.00, 'm²', 'paint'),
('Contrapiso Nivelado', 'Execução de contrapiso com traço reforçado, caimento adequado para ralos e superfície pronta para piso.', 30.00, 'm²', 'maximize'),
('Demolição e Retirada de Entulho', 'Remoção cuidadosa de pisos e revestimentos antigos, preservando a alvenaria e tubulações existentes.', 20.00, 'm²', 'trash'),
('Reformas Residenciais Gerais', 'Acompanhamento e execução de reformas completas de banheiros, cozinhas, varandas e ampliações.', 60.00, 'm²', 'home');

INSERT INTO public.testimonials (name, location, service_done, text, rating) VALUES
('Roberto Albuquerque', 'Bairro Centro', 'Porcelanato Polido 84x84', 'O Clebson é extremamente caprichoso! Colocou o porcelanato do meu apartamento inteiro sem nenhum dente de desnível e os recortes nos cantos ficaram perfeitos.', 5),
('Mariana Ferreira', 'Condomínio Reserva dos Ipês', 'Reforma de Banheiro', 'Pontualidade britânica e deixou a obra limpa todos os dias no final da tarde. Orçamento muito claro desde o primeiro dia. Recomendo de olhos fechados!', 5),
('Eng. Fernando Souza', 'Bairro Maria Auxiliadora', 'Contrapiso e Cerâmica', 'Trabalho com obras há anos e é difícil achar um profissional com o compromisso e a precisão do Clebson. Cumpre prazos rigorosamente.', 5);
