/**
 * Componente de Comparação Antes & Depois para Obras
 * Suporta modo comparador interativo (slider arrastável) e modo empilhado/toggle mobile
 */

export function renderProjectsGallery(containerId, projects, activeCategory = 'Todos') {
  const container = document.getElementById(containerId);
  if (!container) return;

  const filtered = activeCategory === 'Todos' 
    ? projects 
    : projects.filter(p => p.category.toLowerCase() === activeCategory.toLowerCase());

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <p>Nenhuma obra encontrada nesta categoria.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(project => `
    <article class="project-card reveal-on-scroll" data-category="${project.category}">
      <div class="project-comparison-wrapper">
        <!-- Container de Comparação Interativa -->
        <div class="before-after-container" data-id="${project.id}">
          <div class="ba-image-wrapper ba-before">
            <img src="${project.beforeImage}" alt="${project.title} - Antes" loading="lazy" class="ba-img">
            <span class="ba-badge ba-badge-before">Antes</span>
          </div>
          <div class="ba-image-wrapper ba-after">
            <img src="${project.afterImage}" alt="${project.title} - Depois" loading="lazy" class="ba-img">
            <span class="ba-badge ba-badge-after">Depois</span>
          </div>
          <!-- Controle deslizante interativo para desktop -->
          <input type="range" min="0" max="100" value="50" class="ba-slider" aria-label="Comparar antes e depois">
          <div class="ba-handle" style="left: 50%;">
            <span class="ba-handle-arrows">⇄</span>
          </div>
        </div>

        <!-- Alternador mobile rápido com um toque -->
        <div class="mobile-ba-toggle">
          <button type="button" class="btn-toggle-view" data-view="after">Ver: <strong>Depois (Concluído)</strong> ⇄</button>
        </div>
      </div>

      <div class="project-content">
        <div class="project-header">
          <span class="badge badge-accent">${project.category}</span>
          <span class="project-date">Obra Concluída</span>
        </div>
        <h3 class="project-title">${project.title}</h3>
        <p class="project-description">${project.description}</p>
        
        ${project.tags && project.tags.length ? `
          <ul class="project-tags">
            ${project.tags.map(tag => `<li><span class="tag-bullet">✓</span> ${tag}</li>`).join('')}
          </ul>
        ` : ''}

        <div class="project-footer">
          <a href="#calculadora" class="btn btn-outline btn-sm">Estimar Serviço Parecido</a>
        </div>
      </div>
    </article>
  `).join('');

  initSliders(container);
}

/**
 * Inicializa os controles deslizantes de antes/depois
 */
function initSliders(container) {
  const comparisons = container.querySelectorAll('.before-after-container');

  comparisons.forEach(comp => {
    const slider = comp.querySelector('.ba-slider');
    const beforeWrapper = comp.querySelector('.ba-before');
    const handle = comp.querySelector('.ba-handle');
    const card = comp.closest('.project-card');
    const toggleBtn = card ? card.querySelector('.btn-toggle-view') : null;

    if (!slider || !beforeWrapper || !handle) return;

    // Atualiza a linha divisória com base na posição do slider (0 a 100%)
    const updatePosition = (val) => {
      beforeWrapper.style.clipPath = `polygon(0 0, ${val}% 0, ${val}% 100%, 0 100%)`;
      handle.style.left = `${val}%`;
    };

    slider.addEventListener('input', (e) => {
      updatePosition(e.target.value);
    });

    // Estado inicial
    updatePosition(50);

    // Suporte ao botão de toggle rápido para telas touch/mobile
    if (toggleBtn) {
      let isShowingAfter = true;
      toggleBtn.addEventListener('click', () => {
        isShowingAfter = !isShowingAfter;
        if (isShowingAfter) {
          updatePosition(15);
          toggleBtn.innerHTML = 'Exibindo: <strong>Depois</strong> (Toque p/ Antes)';
        } else {
          updatePosition(85);
          toggleBtn.innerHTML = 'Exibindo: <strong>Antes</strong> (Toque p/ Depois)';
        }
      });
    }
  });
}
