/**
 * Portafolio de David Gonzalez
 * Main JavaScript File
 */

'use strict';

// ======================
// NAVIGATION MODULE
// ======================
const Navigation = {
    init() {
        const navLinks = document.querySelectorAll('.nav-link');

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const sectionId = link.getAttribute('href').substring(1);
                this.showSection(sectionId, link);
            });
        });

        // CTAs en cualquier parte (hero, etc.) que apuntan a una sección via data-goto
        document.querySelectorAll('[data-goto]').forEach(el => {
            el.addEventListener('click', () => {
                const sectionId = el.getAttribute('data-goto');
                const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                this.showSection(sectionId, navLink);

                // CTA opcional: abrir una categoría de proyectos al llegar (data-filter)
                const filter = el.getAttribute('data-filter');
                if (filter && typeof ProjectsFilter !== 'undefined') {
                    ProjectsFilter.filterProjects(filter);
                }

                const content = document.getElementById('main-content');
                if (content) content.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });
    },

    showSection(sectionId, clickedLink) {
        const section = document.getElementById(sectionId);

        if (!section) {
            console.error(`Section ${sectionId} not found`);
            return;
        }

        // Hide all sections
        document.querySelectorAll('.section').forEach(s => {
            s.classList.remove('active');
        });

        // Remove active class from all nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
        });

        // Show selected section
        section.classList.add('active');

        // Add active class to clicked nav link
        if (clickedLink) {
            clickedLink.classList.add('active');
            clickedLink.setAttribute('aria-current', 'page');
        }

        // Initialize diagram if diagrama section is selected
        if (sectionId === 'diagrama' && !SkillsDiagram.initialized) {
            setTimeout(() => SkillsDiagram.init(), 100);
        }
    }
};


// ======================
// SKILLS DIAGRAM MODULE
// ======================
const SkillsDiagram = {
    initialized: false,
    nodes: {},
    connections: [],

    skills: {
        // Nodos principales (categorías)
        frontend: {
            type: 'category',
            class: 'frontend center-node',
            position: { x: 15, y: 25 },
            connections: ['javascript', 'typescript', 'html', 'vuejs', 'tailwind']
        },
        backend: {
            type: 'category',
            class: 'backend center-node',
            position: { x: 85, y: 25 },
            connections: ['php', 'laravel', 'python', 'django', 'vbnet']
        },
        database: {
            type: 'category',
            class: 'database center-node',
            position: { x: 50, y: 15 },
            connections: ['mysql', 'oracle', 'sqlite', 'redis', 'dataverse']
        },
        automation: {
            type: 'category',
            class: 'automation center-node',
            position: { x: 20, y: 70 },
            connections: ['uipath', 'powerautomate', 'vba']
        },
        tools: {
            type: 'category',
            class: 'tools center-node',
            position: { x: 80, y: 70 },
            connections: ['git', 'github', 'postman', 'powerapps', 'odoo', 'vscode']
        },
        methodologies: {
            type: 'category',
            class: 'methodologies center-node',
            position: { x: 50, y: 85 },
            connections: ['scrum', 'kanban']
        },
        // Tecnologías específicas
        javascript: {
            type: 'tech',
            class: 'frontend tech-node',
            position: { x: 5, y: 40 },
            connections: ['vuejs', 'typescript', 'php', 'postman']
        },
        typescript: {
            type: 'tech',
            class: 'frontend tech-node',
            position: { x: 8, y: 15 },
            connections: ['javascript', 'vuejs']
        },
        html: {
            type: 'tech',
            class: 'frontend tech-node',
            position: { x: 25, y: 10 },
            connections: ['tailwind', 'javascript']
        },
        vuejs: {
            type: 'tech',
            class: 'frontend tech-node',
            position: { x: 35, y: 35 },
            connections: ['laravel', 'tailwind', 'typescript']
        },
        tailwind: {
            type: 'tech',
            class: 'frontend tech-node',
            position: { x: 30, y: 50 },
            connections: ['html', 'vuejs']
        },
        php: {
            type: 'tech',
            class: 'backend tech-node',
            position: { x: 70, y: 40 },
            connections: ['laravel', 'mysql', 'oracle']
        },
        laravel: {
            type: 'tech',
            class: 'backend tech-node',
            position: { x: 65, y: 50 },
            connections: ['php', 'mysql', 'vuejs', 'redis']
        },
        python: {
            type: 'tech',
            class: 'backend tech-node',
            position: { x: 90, y: 40 },
            connections: ['django', 'mysql', 'uipath', 'odoo']
        },
        django: {
            type: 'tech',
            class: 'backend tech-node',
            position: { x: 95, y: 55 },
            connections: ['python']
        },
        vbnet: {
            type: 'tech',
            class: 'backend tech-node',
            position: { x: 75, y: 10 },
            connections: ['uipath']
        },
        mysql: {
            type: 'tech',
            class: 'database tech-node',
            position: { x: 40, y: 5 },
            connections: ['php', 'laravel', 'python']
        },
        oracle: {
            type: 'tech',
            class: 'database tech-node',
            position: { x: 60, y: 5 },
            connections: ['php']
        },
        sqlite: {
            type: 'tech',
            class: 'database tech-node',
            position: { x: 38, y: 18 },
            connections: ['laravel']
        },
        redis: {
            type: 'tech',
            class: 'database tech-node',
            position: { x: 62, y: 18 },
            connections: ['laravel']
        },
        dataverse: {
            type: 'tech',
            class: 'database tech-node',
            position: { x: 50, y: 2 },
            connections: ['powerapps']
        },
        uipath: {
            type: 'tech',
            class: 'automation tech-node',
            position: { x: 10, y: 85 },
            connections: ['vba', 'vbnet', 'python']
        },
        powerautomate: {
            type: 'tech',
            class: 'automation tech-node',
            position: { x: 30, y: 85 },
            connections: ['powerapps', 'vba']
        },
        vba: {
            type: 'tech',
            class: 'automation tech-node',
            position: { x: 5, y: 55 },
            connections: ['uipath', 'powerautomate']
        },
        git: {
            type: 'tech',
            class: 'tools tech-node',
            position: { x: 95, y: 75 },
            connections: ['github', 'laravel', 'django']
        },
        github: {
            type: 'tech',
            class: 'tools tech-node',
            position: { x: 95, y: 60 },
            connections: ['git', 'vscode']
        },
        postman: {
            type: 'tech',
            class: 'tools tech-node',
            position: { x: 70, y: 85 },
            connections: ['php', 'laravel']
        },
        powerapps: {
            type: 'tech',
            class: 'tools tech-node',
            position: { x: 85, y: 85 },
            connections: ['powerautomate', 'dataverse']
        },
        odoo: {
            type: 'tech',
            class: 'tools tech-node',
            position: { x: 90, y: 10 },
            connections: ['python']
        },
        vscode: {
            type: 'tech',
            class: 'tools tech-node',
            position: { x: 75, y: 60 },
            connections: ['github', 'git']
        },
        scrum: {
            type: 'tech',
            class: 'methodologies tech-node',
            position: { x: 40, y: 95 },
            connections: ['kanban']
        },
        kanban: {
            type: 'tech',
            class: 'methodologies tech-node',
            position: { x: 60, y: 95 },
            connections: ['scrum']
        }
    },

    capitalize(str) {
        const specialCases = {
            'javascript': 'JavaScript',
            'typescript': 'TypeScript',
            'html': 'HTML',
            'vuejs': 'Vue.js',
            'tailwind': 'Tailwind CSS',
            'php': 'PHP',
            'laravel': 'Laravel',
            'python': 'Python',
            'django': 'Django',
            'vbnet': 'VB.NET',
            'mysql': 'MySQL',
            'oracle': 'ORACLE',
            'sqlite': 'SQLite',
            'redis': 'Redis',
            'dataverse': 'Dataverse',
            'uipath': 'UiPath',
            'powerautomate': 'Power Automate',
            'vba': 'VBA',
            'git': 'Git',
            'github': 'GitHub',
            'postman': 'Postman',
            'powerapps': 'Power Apps',
            'odoo': 'Odoo',
            'vscode': 'VS Code',
            'scrum': 'Scrum',
            'kanban': 'Kanban',
            'frontend': 'FRONTEND',
            'backend': 'BACKEND',
            'database': 'BASES DE DATOS',
            'automation': 'AUTOMATIZACIÓN',
            'tools': 'HERRAMIENTAS',
            'methodologies': 'METODOLOGÍAS'
        };
        return specialCases[str] || str.charAt(0).toUpperCase() + str.slice(1);
    },

    init() {
        if (this.initialized) return;

        const networkContainer = document.getElementById('network');
        if (!networkContainer) {
            console.error('Network container not found');
            return;
        }

        // Clear container
        networkContainer.innerHTML = '';

        // Create nodes
        Object.entries(this.skills).forEach(([id, skill]) => {
            const node = document.createElement('div');
            node.className = `node ${skill.class}`;
            node.id = id;
            node.textContent = this.capitalize(id);
            node.setAttribute('tabindex', '0');
            node.setAttribute('role', 'button');
            node.setAttribute('aria-label', `${this.capitalize(id)} — ver conexiones`);

            node.style.left = `${skill.position.x}%`;
            node.style.top = `${skill.position.y}%`;
            node.style.transform = 'translate(-50%, -50%)';

            networkContainer.appendChild(node);
            this.nodes[id] = node;
        });

        // Create connections
        Object.entries(this.skills).forEach(([id, skill]) => {
            skill.connections.forEach(targetId => {
                this.createConnection(id, targetId, networkContainer);
            });
        });

        // Setup interaction events
        this.setupInteractions();

        this.initialized = true;
    },

    createConnection(from, to, container) {
        const fromNode = this.nodes[from];
        const toNode = this.nodes[to];

        if (!fromNode || !toNode) return;

        const connection = document.createElement('div');
        connection.className = 'connection';
        connection.dataset.from = from;
        connection.dataset.to = to;

        this.updateConnectionPosition(connection, fromNode, toNode, container);

        container.appendChild(connection);
        this.connections.push(connection);
    },

    updateConnectionPosition(connection, fromNode, toNode, container) {
        const fromRect = fromNode.getBoundingClientRect();
        const toRect = toNode.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        const fromX = fromRect.left + fromRect.width / 2 - containerRect.left;
        const fromY = fromRect.top + fromRect.height / 2 - containerRect.top;
        const toX = toRect.left + toRect.width / 2 - containerRect.left;
        const toY = toRect.top + toRect.height / 2 - containerRect.top;

        const distance = Math.sqrt(Math.pow(toX - fromX, 2) + Math.pow(toY - fromY, 2));
        const angle = Math.atan2(toY - fromY, toX - fromX) * (180 / Math.PI);

        connection.style.left = fromX + 'px';
        connection.style.top = fromY + 'px';
        connection.style.width = distance + 'px';
        connection.style.transform = `rotate(${angle}deg)`;
    },

    setupInteractions() {
        let activeConnections = [];

        const highlightConnections = (nodeId) => {
            activeConnections.forEach(conn => conn.classList.remove('active'));
            activeConnections = [];

            this.connections.forEach(connection => {
                if (connection.dataset.from === nodeId || connection.dataset.to === nodeId) {
                    connection.classList.add('active');
                    activeConnections.push(connection);
                }
            });

            document.querySelectorAll('.node').forEach(node => {
                node.classList.remove('active', 'pulse');
            });

            if (this.nodes[nodeId]) {
                this.nodes[nodeId].classList.add('active', 'pulse');

                if (this.skills[nodeId].connections) {
                    this.skills[nodeId].connections.forEach(connId => {
                        if (this.nodes[connId]) {
                            this.nodes[connId].classList.add('active');
                        }
                    });
                }
            }
        };

        const clearHighlights = () => {
            activeConnections.forEach(conn => conn.classList.remove('active'));
            activeConnections = [];
            document.querySelectorAll('.node').forEach(node => {
                node.classList.remove('active', 'pulse');
            });
        };

        // Events for nodes
        Object.keys(this.nodes).forEach(nodeId => {
            const node = this.nodes[nodeId];

            node.addEventListener('mouseenter', () => {
                highlightConnections(nodeId);
            });

            node.addEventListener('mouseleave', () => {
                clearHighlights();
            });

            node.addEventListener('focus', () => {
                highlightConnections(nodeId);
            });

            node.addEventListener('blur', () => {
                clearHighlights();
            });

            node.addEventListener('click', () => {
                highlightConnections(nodeId);
                setTimeout(clearHighlights, 3000);
            });

            node.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    highlightConnections(nodeId);
                    setTimeout(clearHighlights, 3000);
                }
            });
        });
    }
};

// Global function for legacy compatibility
function initSkillsNetwork() {
    SkillsDiagram.init();
}

// ======================
// PROJECTS FILTER MODULE
// ======================
const ProjectsFilter = {
    filterProjects(category) {
        const containers = document.querySelectorAll('.projects-container');
        const cards = document.querySelectorAll('.category-card');

        // Remove active class from all category cards
        cards.forEach(card => card.classList.remove('active'));

        // Add active class to selected card
        const activeCard = document.getElementById(`filter-${category}`);
        if (activeCard) {
            activeCard.classList.add('active');
        }

        // Ocultar el aviso inicial una vez se elige una categoría
        const placeholder = document.getElementById('projects-placeholder');
        if (placeholder) placeholder.style.display = 'none';

        // Reiniciar los acordeones a colapsado: lista limpia al cambiar de grupo
        document.querySelectorAll('.project-acc.open').forEach(acc => {
            acc.classList.remove('open');
            const h = acc.querySelector('.project-acc-head');
            if (h) h.setAttribute('aria-expanded', 'false');
        });

        if (category === 'all') {
            containers.forEach(container => {
                container.style.display = 'block';
                container.style.animation = 'fadeIn 0.5s ease';
            });
        } else {
            containers.forEach(container => {
                if (container.dataset.category === category) {
                    container.style.display = 'block';
                    container.style.animation = 'fadeIn 0.5s ease';
                } else {
                    container.style.display = 'none';
                }
            });
        }
    }
};

// Global function for legacy compatibility
function filterProjects(category) {
    ProjectsFilter.filterProjects(category);
}

// ======================
// PROJECTS ACCORDION MODULE
// Convierte cada tarjeta de proyecto en un acordeón: encabezado compacto
// (icono + título + badges) siempre visible; el detalle se expande al clic.
// ======================
const ProjectsAccordion = {
    init() {
        document.querySelectorAll('.projects-container > .card').forEach(card => this.transform(card));
    },

    transform(card) {
        const titleEl = card.querySelector('.project-title');
        if (!titleEl) return;

        // --- Encabezado (siempre visible) ---
        const head = document.createElement('button');
        head.type = 'button';
        head.className = 'project-acc-head';
        head.setAttribute('aria-expanded', 'false');

        const titlewrap = document.createElement('span');
        titlewrap.className = 'project-acc-titlewrap';

        const iconEl = titleEl.querySelector('i');
        if (iconEl) {
            const ic = iconEl.cloneNode(true);
            ic.classList.add('project-acc-icon');
            titlewrap.appendChild(ic);
        }

        const titleSpan = document.createElement('span');
        titleSpan.className = 'project-acc-title';
        titleSpan.textContent = titleEl.textContent.trim();
        titlewrap.appendChild(titleSpan);

        // Mover los badges (viven junto al título en .project-head, si existen)
        const ph = titleEl.closest('.project-head');
        if (ph) {
            ph.querySelectorAll('.proj-badge, .demo-badge').forEach(b => titlewrap.appendChild(b));
        }

        head.appendChild(titlewrap);

        const chevron = document.createElement('i');
        chevron.className = 'fas fa-chevron-down project-acc-chevron';
        chevron.setAttribute('aria-hidden', 'true');
        head.appendChild(chevron);

        // --- Cuerpo colapsable (resto del contenido de la tarjeta) ---
        const body = document.createElement('div');
        body.className = 'project-acc-body';
        const inner = document.createElement('div');
        inner.className = 'project-acc-inner';
        while (card.firstChild) inner.appendChild(card.firstChild);
        body.appendChild(inner);

        // Quitar el título duplicado (ya está en el encabezado)
        const innerTitle = inner.querySelector('.project-title');
        if (innerTitle) {
            const innerPh = innerTitle.closest('.project-head');
            innerTitle.remove();
            if (innerPh && innerPh.children.length === 0) innerPh.remove();
        }

        card.appendChild(head);
        card.appendChild(body);
        card.classList.add('project-acc');

        head.addEventListener('click', () => {
            const open = card.classList.toggle('open');
            head.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
    }
};

// ======================
// MOBILE CAROUSEL MODULE
// ======================
const MobileCarousel = {
    sections: [],
    dots: [],
    currentIndex: 0,
    content: null,
    indicator: null,
    isMobile: false,

    sectionData: [
        { id: 'perfil', name: 'Perfil', icon: 'fa-user' },
        { id: 'proyectos', name: 'Proyectos', icon: 'fa-code-branch' },
        { id: 'experiencia', name: 'Experiencia', icon: 'fa-briefcase' },
        { id: 'habilidades', name: 'Habilidades', icon: 'fa-cogs' },
        { id: 'educacion', name: 'Educación', icon: 'fa-graduation-cap' },
        { id: 'diagrama', name: 'Skills', icon: 'fa-project-diagram' },
        { id: 'contacto', name: 'Contacto', icon: 'fa-paper-plane' }
    ],

    init() {
        this.content = document.querySelector('.content');
        this.sections = document.querySelectorAll('.section');

        if (!this.content || this.sections.length === 0) return;

        this.checkMobile();
        window.addEventListener('resize', () => this.checkMobile());
    },

    checkMobile() {
        const wasMobile = this.isMobile;
        this.isMobile = window.innerWidth <= 768;

        if (this.isMobile && !wasMobile) {
            this.setupCarousel();
        } else if (!this.isMobile && wasMobile) {
            this.destroyCarousel();
        }
    },

    setupCarousel() {
        const nav = document.querySelector('.nav-tabs');
        if (!nav) return;

        // Create dots navigation
        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'mobile-nav-dots';

        this.sectionData.forEach((section, index) => {
            const dot = document.createElement('button');
            dot.className = 'nav-dot' + (index === 0 ? ' active' : '');
            dot.innerHTML = `<i class="fas ${section.icon}"></i>`;
            dot.setAttribute('aria-label', section.name);
            dot.setAttribute('title', section.name);
            dot.addEventListener('click', () => this.goToSection(index));
            dotsContainer.appendChild(dot);
            this.dots.push(dot);
        });

        nav.insertBefore(dotsContainer, nav.firstChild);

        // Create section indicator
        this.indicator = document.createElement('div');
        this.indicator.className = 'carousel-indicator';
        this.updateIndicator(0);
        nav.appendChild(this.indicator);

        // Create navigation arrows
        const arrows = document.createElement('div');
        arrows.className = 'carousel-arrows';
        arrows.innerHTML = `
            <button class="carousel-arrow prev" aria-label="Anterior">
                <i class="fas fa-chevron-left"></i>
            </button>
            <button class="carousel-arrow next" aria-label="Siguiente">
                <i class="fas fa-chevron-right"></i>
            </button>
        `;
        document.body.appendChild(arrows);

        this.prevBtn = arrows.querySelector('.prev');
        this.nextBtn = arrows.querySelector('.next');

        this.prevBtn.addEventListener('click', () => this.navigate(-1));
        this.nextBtn.addEventListener('click', () => this.navigate(1));

        // Show swipe hint on first visit
        if (!localStorage.getItem('swipeHintShown')) {
            this.showSwipeHint();
            localStorage.setItem('swipeHintShown', 'true');
        }

        // Listen for scroll to update dots
        this.content.addEventListener('scroll', () => this.onScroll());

        // Update arrows state
        this.updateArrows();
    },

    destroyCarousel() {
        const dotsContainer = document.querySelector('.mobile-nav-dots');
        const arrows = document.querySelector('.carousel-arrows');
        const hint = document.querySelector('.swipe-hint');

        if (dotsContainer) dotsContainer.remove();
        if (this.indicator) this.indicator.remove();
        if (arrows) arrows.remove();
        if (hint) hint.remove();

        this.dots = [];
        this.indicator = null;
    },

    showSwipeHint() {
        const hint = document.createElement('div');
        hint.className = 'swipe-hint';
        hint.innerHTML = '<span>Desliza para navegar</span><i class="fas fa-arrow-right"></i>';
        document.body.appendChild(hint);

        setTimeout(() => hint.remove(), 3500);
    },

    goToSection(index) {
        if (index < 0 || index >= this.sections.length) return;

        const section = this.sections[index];
        this.content.scrollTo({
            left: section.offsetLeft,
            behavior: 'smooth'
        });
    },

    navigate(direction) {
        const newIndex = this.currentIndex + direction;
        if (newIndex >= 0 && newIndex < this.sections.length) {
            this.goToSection(newIndex);
        }
    },

    onScroll() {
        const scrollLeft = this.content.scrollLeft;
        const sectionWidth = this.content.offsetWidth;
        const newIndex = Math.round(scrollLeft / sectionWidth);

        if (newIndex !== this.currentIndex && newIndex >= 0 && newIndex < this.sections.length) {
            this.currentIndex = newIndex;
            this.updateDots(newIndex);
            this.updateIndicator(newIndex);
            this.updateArrows();

            // Also update the desktop nav for consistency
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach((link, i) => {
                const isActive = i === newIndex;
                link.classList.toggle('active', isActive);
                if (isActive) {
                    link.setAttribute('aria-current', 'page');
                } else {
                    link.removeAttribute('aria-current');
                }
            });
        }
    },

    updateDots(activeIndex) {
        this.dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === activeIndex);
        });
    },

    updateIndicator(index) {
        if (this.indicator && this.sectionData[index]) {
            const section = this.sectionData[index];
            this.indicator.innerHTML = `<i class="fas ${section.icon}"></i><span>${section.name}</span>`;
        }
    },

    updateArrows() {
        if (this.prevBtn) {
            this.prevBtn.disabled = this.currentIndex === 0;
        }
        if (this.nextBtn) {
            this.nextBtn.disabled = this.currentIndex === this.sections.length - 1;
        }
    }
};

// ======================
// DARK MODE MODULE
// ======================
const DarkMode = {
    init() {
        this.themeToggle = document.getElementById('theme-toggle');
        this.icon = this.themeToggle.querySelector('i');

        // Check for saved theme preference or default to light mode
        const currentTheme = localStorage.getItem('theme') || this.getPreferredTheme();
        this.setTheme(currentTheme);

        // Listen for toggle clicks
        this.themeToggle.addEventListener('click', () => this.toggleTheme());

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
    },

    getPreferredTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    },

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.updateIcon(theme);
    },

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    },

    updateIcon(theme) {
        if (theme === 'dark') {
            this.icon.classList.remove('fa-moon');
            this.icon.classList.add('fa-sun');
        } else {
            this.icon.classList.remove('fa-sun');
            this.icon.classList.add('fa-moon');
        }
    }
};

// ======================
// IMAGE GALLERY MODULE
// ======================
const ImageGallery = {
    changeImage(thumb, projectId) {
        const gallery = document.querySelector(`.project-gallery[data-project="${projectId}"]`);
        if (!gallery) return;

        const mainImage = gallery.querySelector('.gallery-main img');
        const thumbs = gallery.querySelectorAll('.thumb');

        // Update main image
        mainImage.src = thumb.src;
        mainImage.alt = thumb.alt;

        // Update active thumb
        thumbs.forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
    },

    lastFocus: null,

    openModal(imageSrc) {
        const modal = document.getElementById('imageModal');
        const modalImage = document.getElementById('modalImage');

        this.lastFocus = document.activeElement;
        modalImage.src = imageSrc;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Mover el foco al botón de cerrar para navegación por teclado
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) closeBtn.focus();
    },

    closeModal() {
        const modal = document.getElementById('imageModal');
        if (!modal.classList.contains('active')) return;
        modal.classList.remove('active');
        document.body.style.overflow = '';

        // Devolver el foco al elemento que abrió el modal
        if (this.lastFocus && typeof this.lastFocus.focus === 'function') {
            this.lastFocus.focus();
        }
        this.lastFocus = null;
    },

    init() {
        const modal = document.getElementById('imageModal');

        document.addEventListener('keydown', (e) => {
            if (!modal || !modal.classList.contains('active')) return;
            // Cerrar con ESC
            if (e.key === 'Escape') {
                this.closeModal();
            }
            // Trampa de foco simple: mantener el foco en el botón de cerrar
            if (e.key === 'Tab') {
                e.preventDefault();
                const closeBtn = modal.querySelector('.modal-close');
                if (closeBtn) closeBtn.focus();
            }
        });

        // Evitar que el clic en la imagen cierre el modal
        const modalImage = document.getElementById('modalImage');
        if (modalImage) {
            modalImage.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }

        // Hacer operables por teclado las miniaturas y la imagen principal de cada galería
        document.querySelectorAll('.gallery-main img, .gallery-thumbs .thumb').forEach(img => {
            img.setAttribute('role', 'button');
            img.setAttribute('tabindex', '0');
            img.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    img.click();
                }
            });
        });
    }
};

// Global functions for onclick compatibility
function changeGalleryImage(thumb, projectId) {
    ImageGallery.changeImage(thumb, projectId);
}

function openImageModal(imageSrc) {
    ImageGallery.openModal(imageSrc);
}

function closeImageModal() {
    ImageGallery.closeModal();
}

// ======================
// CV GENERATOR MODULE
// ======================
const CVGenerator = {
    // Colores del tema
    colors: {
        primary: [37, 99, 235],      // Azul principal
        dark: [30, 41, 59],          // Texto oscuro
        gray: [100, 116, 139],       // Texto secundario
        light: [241, 245, 249],      // Fondo claro
        white: [255, 255, 255]
    },

    // Datos del CV
    data: {
        personal: {
            nombre: 'David Steven Gonzalez Padilla',
            titulo: 'Desarrollador Full Stack | Web & SaaS',
            telefono: '+57 305 759 4088',
            email: 'davidsgonzalez98@hotmail.com',
            ubicacion: 'Bogotá, Colombia',
            linkedin: 'linkedin.com/in/david-steven-gonzalez-padilla',
            github: 'github.com/ROBOCOP3PK'
        },
        get perfil() {
            const exp = ExperienceCalculator.getFullText();
            return `Desarrollador Full Stack con ${exp} de experiencia en desarrollo de software y automatización de procesos para el sector público y empresarial. Trabajo de extremo a extremo adaptándome al stack de cada proyecto (Laravel, Vue, Next.js), con sólida experiencia en RPA y Power Platform. Enfoque en código limpio, buenas prácticas y entrega de valor.`;
        },
        experiencia: [
            {
                cargo: 'Ingeniero de Desarrollo',
                empresa: 'Sies Salud',
                periodo: 'Abr 2026 - Actualidad',
                ubicacion: '',
                logros: []
            },
            {
                cargo: 'Desarrollador Full Stack',
                empresa: 'TurriSystem',
                periodo: 'Dic 2024 - Mar 2026',
                ubicacion: 'Bogotá (Híbrido)',
                logros: [
                    'Desarrollo de sistemas para el sector público con Laravel y Vue.js',
                    'Migración de código PHP legacy a PHP 8.x',
                    'Gestión de bases de datos MySQL y ORACLE',
                    'Implementación de APIs RESTful y módulos completos',
                    'Interfaces responsivas con Tailwind CSS'
                ]
            },
            {
                cargo: 'Desarrollador RPA',
                empresa: 'Thomas Greg and Sons',
                periodo: 'Feb 2023 - Nov 2024',
                ubicacion: 'Bogotá (Híbrido)',
                logros: [
                    'Desarrollo de bots RPA con UiPath (VB.NET + Python) para procesos financieros y de RRHH',
                    'Desarrollo de aplicaciones internas con Power Apps y Dataverse',
                    'Creación de chatbots internos con Power Virtual Agents para autogestión de empleados (nómina, vacaciones y certificados laborales)',
                    'Personalización y desarrollo de módulos en ODOO (ERP)',
                    'Automatización de procesos contables y tributarios con macros VBA'
                ]
            },
            {
                cargo: 'Auxiliar II Mejora Continua',
                empresa: 'Thomas Greg and Sons',
                periodo: 'Sep 2021 - Ene 2023',
                ubicacion: 'Bogotá',
                logros: [
                    'Levantamiento de procesos: toma de tiempos, diagramas de flujo y documentos PDD',
                    'Apoyo en evaluación y selección de proveedores tecnológicos',
                    'Seguimiento de proyectos de transformación digital (RPA, ERP, firma digital)',
                    'Documentación bajo estándares de calidad ISO'
                ]
            }
        ],
        educacion: [
            {
                titulo: 'Especialización en Gestión de TI',
                institucion: 'Universidad CUN',
                periodo: 'En curso - 2026'
            },
            {
                titulo: 'Ingeniería Electrónica',
                institucion: 'Universidad Cooperativa de Colombia',
                periodo: 'Finalizada - 2022'
            }
        ],
        habilidades: {
            tecnicas: [
                'PHP / Laravel',
                'JavaScript / TypeScript / Vue.js',
                'MySQL / ORACLE / SQLite',
                'Tailwind CSS / Redis',
                'Python / Django',
                'VB.NET / VBA',
                'UiPath / Power Automate',
                'Power Apps / Dataverse',
                'Power Virtual Agents',
                'Git / GitHub / Postman'
            ],
            blandas: [
                'Resolución de problemas',
                'Trabajo en equipo',
                'Comunicación efectiva',
                'Adaptación al cambio',
                'Gestión del tiempo'
            ]
        },
        idiomas: [
            { idioma: 'Español', nivel: 'Nativo' },
            { idioma: 'Inglés', nivel: 'B2 - Intermedio' }
        ],
        certificaciones: [
            'Six Sigma - Universidad EAN',
            'UiPath Developer - UiPath Academy',
            'Power Apps - Microsoft Learn',
            'Python - Uniagustiniana',
            'AutoCAD 2D - SENA',
            'IoT Fundamentals - Cisco'
        ],
        proyectos: [
            {
                nombre: 'VigilIA - Administración de Conjuntos Residenciales',
                tecnologias: 'Laravel 12 + Vue.js 3 + PHP 8.4 + MySQL + Sanctum + Spatie Permission',
                url: 'vigilia.deepdev.com.co',
                descripcion: 'Sistema integral multi-tenant con control de acceso, facturación, reservas, PQRS, emergencias, 7 roles y 105 permisos'
            },
            {
                nombre: 'Valera Emocional - Bienestar Laboral',
                tecnologias: 'Laravel 12 + Vue.js 3 + TypeScript + MySQL + PWA',
                url: 'github.com/ROBOCOP3PK/valera',
                descripcion: 'Plataforma SaaS multi-tenant de permisos laborales con aprobaciones jerárquicas, motor de reglas y dashboards'
            },
            {
                nombre: 'PetuniaPlay - E-commerce para Mascotas',
                tecnologias: 'Laravel 12 + Vue.js 3 + Tailwind CSS + MySQL',
                url: 'tienda.deepdev.com.co',
                descripcion: 'Sistema completo de e-commerce con catálogo, carrito, cupones, programa de fidelidad y panel admin'
            },
            {
                nombre: 'Finanzas Compartidas - Gestión de Gastos',
                tecnologias: 'Laravel 12 + Vue.js 3 + Pinia + SQLite + PWA',
                url: 'finanzas.deepdev.com.co',
                descripcion: 'App PWA para gastos personales y compartidos con funcionamiento offline y sincronización'
            },
            {
                nombre: 'Sistema de Gestión de Demandas - Sector Público',
                tecnologias: 'Laravel + Vue.js + MySQL + ORACLE + Tailwind CSS',
                url: '',
                descripcion: 'Plataforma web para entidades públicas con gestión de pagos, validaciones bancarias y reportes PDF'
            }
        ]
    },

    loadProfileImage() {
        return fetch('assets/images/profile.jpg')
            .then(response => response.blob())
            .then(blob => new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                    const img = new Image();
                    img.onload = () => {
                        const size = Math.min(img.width, img.height);
                        const canvas = document.createElement('canvas');
                        canvas.width = size;
                        canvas.height = size;
                        const ctx = canvas.getContext('2d');
                        // Recorte circular
                        ctx.beginPath();
                        ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
                        ctx.closePath();
                        ctx.clip();
                        // Centrar imagen
                        const offsetX = (img.width - size) / 2;
                        const offsetY = (img.height - size) / 2;
                        ctx.drawImage(img, offsetX, offsetY, size, size, 0, 0, size, size);
                        resolve(canvas.toDataURL('image/png'));
                    };
                    img.onerror = reject;
                    img.src = reader.result;
                };
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            }));
    },

    async generate() {
        if (!window.jspdf) {
            alert('El generador de PDF aún está cargando. Intenta de nuevo en unos segundos.');
            return;
        }
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'mm', 'a4');

        // Cargar fuentes con soporte UTF-8
        await window.RobotoFontLoader.initFonts(doc);

        const pageWidth = 210;
        const pageHeight = 297;
        const margin = 15;
        const contentWidth = pageWidth - (margin * 2);
        let y = 0;

        // === HEADER CON FONDO AZUL ===
        doc.setFillColor(...this.colors.primary);
        doc.rect(0, 0, pageWidth, 52, 'F');

        // === FOTO DE PERFIL ===
        const photoSize = 34;
        const photoX = pageWidth - margin - photoSize;
        const photoY = (52 - photoSize) / 2;
        try {
            const profileImgData = await this.loadProfileImage();
            doc.addImage(profileImgData, 'PNG', photoX, photoY, photoSize, photoSize);
            // Borde blanco circular
            doc.setDrawColor(...this.colors.white);
            doc.setLineWidth(1.5);
            doc.circle(photoX + photoSize / 2, photoY + photoSize / 2, photoSize / 2, 'S');
        } catch (e) {
            console.warn('No se pudo incluir la foto en el PDF:', e);
        }

        // Nombre
        doc.setTextColor(...this.colors.white);
        doc.setFontSize(24);
        doc.setFont('Roboto', 'bold');
        doc.text(this.data.personal.nombre, margin, 20);

        // Titulo profesional
        doc.setFontSize(12);
        doc.setFont('Roboto', 'normal');
        doc.text(this.data.personal.titulo, margin, 28);

        // Informacion de contacto en header
        doc.setFontSize(9);
        const contactLine1 = `${this.data.personal.telefono}  |  ${this.data.personal.email}  |  ${this.data.personal.ubicacion}`;
        const contactLine2 = `${this.data.personal.linkedin}  |  ${this.data.personal.github}`;
        doc.text(contactLine1, margin, 38);
        doc.text(contactLine2, margin, 44);

        y = 60;

        // === PERFIL PROFESIONAL ===
        y = this.addSection(doc, 'PERFIL PROFESIONAL', y, margin);
        doc.setTextColor(...this.colors.dark);
        doc.setFontSize(10);
        doc.setFont('Roboto', 'normal');
        const perfilLines = doc.splitTextToSize(this.data.perfil, contentWidth);
        doc.text(perfilLines, margin, y);
        y += perfilLines.length * 5 + 8;

        // === EXPERIENCIA LABORAL ===
        y = this.addSection(doc, 'EXPERIENCIA LABORAL', y, margin);

        this.data.experiencia.forEach(exp => {
            // Check if we need a new page
            if (y > pageHeight - 50) {
                doc.addPage();
                y = 20;
            }

            // Periodo y ubicacion (alineado a la derecha)
            doc.setTextColor(...this.colors.gray);
            doc.setFontSize(9);
            doc.setFont('Roboto', 'normal');
            const periodoText = exp.ubicacion ? `${exp.periodo} | ${exp.ubicacion}` : exp.periodo;
            const periodoWidth = doc.getTextWidth(periodoText);
            doc.text(periodoText, pageWidth - margin - periodoWidth, y);

            // Cargo y empresa (con ancho máximo para no solapar la fecha)
            const maxTitleWidth = contentWidth - periodoWidth - 10;
            doc.setTextColor(...this.colors.dark);
            doc.setFontSize(11);
            doc.setFont('Roboto', 'bold');
            const cargoLines = doc.splitTextToSize(exp.cargo, maxTitleWidth);
            doc.text(cargoLines, margin, y);

            doc.setFontSize(10);
            doc.setFont('Roboto', 'normal');
            doc.setTextColor(...this.colors.primary);
            doc.text(exp.empresa, margin, y + 5);

            y += 12;

            // Logros
            doc.setTextColor(...this.colors.dark);
            doc.setFontSize(9);
            exp.logros.forEach(logro => {
                const logroLines = doc.splitTextToSize(`•  ${logro}`, contentWidth - 5);
                // Check if we need a new page for this logro
                if (y + logroLines.length * 4 > pageHeight - 20) {
                    doc.addPage();
                    y = 20;
                }
                doc.text(logroLines, margin + 3, y);
                y += logroLines.length * 4;
            });

            y += 6;
        });

        // === PROYECTOS PERSONALES ===
        if (y > pageHeight - 50) {
            doc.addPage();
            y = 20;
        }

        y = this.addSection(doc, 'PROYECTOS DESTACADOS', y, margin);

        this.data.proyectos.forEach(proyecto => {
            if (y > pageHeight - 30) {
                doc.addPage();
                y = 20;
            }

            // Nombre del proyecto
            doc.setTextColor(...this.colors.dark);
            doc.setFontSize(10);
            doc.setFont('Roboto', 'bold');
            doc.text(proyecto.nombre, margin, y);

            // URL (alineada a la derecha)
            doc.setTextColor(...this.colors.primary);
            doc.setFontSize(9);
            doc.setFont('Roboto', 'normal');
            const urlWidth = doc.getTextWidth(proyecto.url);
            doc.text(proyecto.url, pageWidth - margin - urlWidth, y);

            y += 5;

            // Tecnologías
            doc.setTextColor(...this.colors.gray);
            doc.setFontSize(9);
            const techLines = doc.splitTextToSize(proyecto.tecnologias, contentWidth - 5);
            doc.text(techLines, margin, y);
            y += techLines.length * 4;

            // Descripción
            doc.setTextColor(...this.colors.dark);
            const descLines = doc.splitTextToSize(`•  ${proyecto.descripcion}`, contentWidth - 5);
            doc.text(descLines, margin + 3, y);
            y += descLines.length * 4 + 4;
        });

        y += 4;

        // === DOS COLUMNAS: EDUCACION Y HABILIDADES ===
        if (y > pageHeight - 80) {
            doc.addPage();
            y = 20;
        }

        const colWidth = (contentWidth - 10) / 2;
        const leftCol = margin;
        const rightCol = margin + colWidth + 10;
        let yLeft = y;
        let yRight = y;

        // COLUMNA IZQUIERDA: EDUCACION
        yLeft = this.addSection(doc, 'EDUCACIÓN', yLeft, leftCol, colWidth);

        this.data.educacion.forEach(edu => {
            doc.setTextColor(...this.colors.dark);
            doc.setFontSize(10);
            doc.setFont('Roboto', 'bold');
            const tituloLines = doc.splitTextToSize(edu.titulo, colWidth);
            doc.text(tituloLines, leftCol, yLeft);
            yLeft += tituloLines.length * 4;

            doc.setFont('Roboto', 'normal');
            doc.setTextColor(...this.colors.primary);
            doc.setFontSize(9);
            doc.text(edu.institucion, leftCol, yLeft);
            yLeft += 4;

            doc.setTextColor(...this.colors.gray);
            doc.text(edu.periodo, leftCol, yLeft);
            yLeft += 8;
        });

        // Certificaciones
        yLeft += 4;
        doc.setTextColor(...this.colors.primary);
        doc.setFontSize(10);
        doc.setFont('Roboto', 'bold');
        doc.text('CERTIFICACIONES', leftCol, yLeft);
        yLeft += 6;

        doc.setTextColor(...this.colors.dark);
        doc.setFontSize(9);
        doc.setFont('Roboto', 'normal');
        this.data.certificaciones.forEach(cert => {
            doc.text(`•  ${cert}`, leftCol, yLeft);
            yLeft += 4.5;
        });

        // COLUMNA DERECHA: HABILIDADES
        yRight = this.addSection(doc, 'HABILIDADES TÉCNICAS', yRight, rightCol, colWidth);

        doc.setTextColor(...this.colors.dark);
        doc.setFontSize(9);
        doc.setFont('Roboto', 'normal');

        // Skills en lista simple
        this.data.habilidades.tecnicas.forEach(skill => {
            doc.text(`•  ${skill}`, rightCol, yRight);
            yRight += 4.5;
        });

        yRight += 4;

        // Habilidades blandas
        doc.setTextColor(...this.colors.primary);
        doc.setFontSize(10);
        doc.setFont('Roboto', 'bold');
        doc.text('HABILIDADES BLANDAS', rightCol, yRight);
        yRight += 6;

        doc.setTextColor(...this.colors.dark);
        doc.setFontSize(9);
        doc.setFont('Roboto', 'normal');
        this.data.habilidades.blandas.forEach(skill => {
            doc.text(`•  ${skill}`, rightCol, yRight);
            yRight += 4.5;
        });

        yRight += 6;

        // Idiomas
        doc.setTextColor(...this.colors.primary);
        doc.setFontSize(10);
        doc.setFont('Roboto', 'bold');
        doc.text('IDIOMAS', rightCol, yRight);
        yRight += 6;

        doc.setTextColor(...this.colors.dark);
        doc.setFontSize(9);
        doc.setFont('Roboto', 'normal');
        this.data.idiomas.forEach(lang => {
            doc.text(`•  ${lang.idioma}: ${lang.nivel}`, rightCol, yRight);
            yRight += 4.5;
        });

        // === FOOTER ===
        const finalY = Math.max(yLeft, yRight) + 10;
        if (finalY < pageHeight - 15) {
            doc.setDrawColor(...this.colors.light);
            doc.setLineWidth(0.5);
            doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

            doc.setTextColor(...this.colors.gray);
            doc.setFontSize(8);
            doc.text('CV generado desde portafolio web', margin, pageHeight - 7);

            const dateText = new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long' });
            const dateWidth = doc.getTextWidth(dateText);
            doc.text(dateText, pageWidth - margin - dateWidth, pageHeight - 7);
        }

        // Descargar
        doc.save('David_Gonzalez_CV.pdf');
    },

    addSection(doc, title, y, x, maxWidth = null) {
        doc.setTextColor(...this.colors.primary);
        doc.setFontSize(11);
        doc.setFont('Roboto', 'bold');
        doc.text(title, x, y);

        // Linea bajo el titulo
        const titleWidth = maxWidth || doc.getTextWidth(title);
        doc.setDrawColor(...this.colors.primary);
        doc.setLineWidth(0.5);
        doc.line(x, y + 1.5, x + Math.min(titleWidth, 50), y + 1.5);

        return y + 8;
    }
};

// ======================
// SCROLL TO TOP (MOBILE)
// ======================
const ScrollToTop = {
    init() {
        const scrollBtn = document.getElementById('scroll-top-mobile');
        if (!scrollBtn) return;

        scrollBtn.addEventListener('click', () => {
            // Scroll the page to top (header)
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });

            // Also scroll the hero into view
            const hero = document.querySelector('.hero');
            if (hero) {
                hero.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }
};

// ======================
// EXPERIENCE CALCULATOR
// ======================
const ExperienceCalculator = {
    startDate: new Date(2021, 8, 1), // Septiembre 2021

    calculate() {
        const now = new Date();
        let years = now.getFullYear() - this.startDate.getFullYear();
        let months = now.getMonth() - this.startDate.getMonth();

        if (months < 0) {
            years--;
            months += 12;
        }

        return { years, months };
    },

    getShortText() {
        const { years } = this.calculate();
        return `+${years} años`;
    },

    getFullText() {
        const { years, months } = this.calculate();
        if (months === 0) return `+${years} años`;
        return `+${years} años y ${months} meses`;
    },

    init() {
        const elements = document.querySelectorAll('[data-experience]');
        elements.forEach(el => {
            const format = el.dataset.experience;
            el.textContent = format === 'full' ? this.getFullText() : this.getShortText();
        });

        // Update meta description
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute('content',
                `David Gonzalez - Desarrollador Full Stack. ${this.getShortText()} construyendo apps web y plataformas SaaS; experiencia en Laravel, Vue, Next.js, RPA y Power Platform para sector público y empresarial.`
            );
        }
    }
};

// ======================
// NEURAL NETWORK BACKGROUND
// ======================
const NeuralNetwork = {
    canvas: null,
    ctx: null,
    nodes: [],
    mouse: { x: -9999, y: -9999 },
    width: 0,
    height: 0,
    SPACING: 110,
    CONNECT_DIST: 130,
    MOUSE_RADIUS: 200,
    MOUSE_FORCE: 25,
    RETURN_SPEED: 0.03,
    NODE_RADIUS: 1.5,
    isDark: false,
    rafId: null,
    paused: false,

    init() {
        if (window.matchMedia('(pointer: coarse)').matches) return;
        this.createCanvas();
        this.handleResize();
        this.bindEvents();
        this.animate();
    },

    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.className = 'neural-canvas';
        this.canvas.setAttribute('aria-hidden', 'true');
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
    },

    handleResize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.createNodes();
    },

    createNodes() {
        this.nodes = [];
        const cols = Math.ceil(this.width / this.SPACING) + 1;
        const rows = Math.ceil(this.height / this.SPACING) + 1;
        const offsetX = (this.width - (cols - 1) * this.SPACING) / 2;
        const offsetY = (this.height - (rows - 1) * this.SPACING) / 2;

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const baseX = offsetX + col * this.SPACING + (Math.random() - 0.5) * 20;
                const baseY = offsetY + row * this.SPACING + (Math.random() - 0.5) * 20;
                this.nodes.push({
                    baseX, baseY,
                    x: baseX, y: baseY,
                    vx: 0, vy: 0
                });
            }
        }
    },

    bindEvents() {
        window.addEventListener('resize', () => this.handleResize());

        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        document.addEventListener('mouseleave', () => {
            this.mouse.x = -9999;
            this.mouse.y = -9999;
        });

        // Pausar el loop cuando la pestaña no está visible (ahorra CPU/batería)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.paused = true;
                if (this.rafId) cancelAnimationFrame(this.rafId);
            } else if (this.paused) {
                this.paused = false;
                this.animate();
            }
        });

        // Observe theme changes
        const observer = new MutationObserver(() => {
            this.isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
        this.isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    },

    animate() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        const nodeAlpha = this.isDark ? 0.25 : 0.12;
        const lineAlpha = this.isDark ? 0.12 : 0.06;
        const color = this.isDark ? '147, 197, 253' : '37, 99, 235';

        // Update node positions
        for (const node of this.nodes) {
            const dx = this.mouse.x - node.x;
            const dy = this.mouse.y - node.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < this.MOUSE_RADIUS && dist > 0) {
                const force = (1 - dist / this.MOUSE_RADIUS) * this.MOUSE_FORCE;
                node.vx -= (dx / dist) * force * 0.02;
                node.vy -= (dy / dist) * force * 0.02;
            }

            // Spring back to base position
            node.vx += (node.baseX - node.x) * this.RETURN_SPEED;
            node.vy += (node.baseY - node.y) * this.RETURN_SPEED;

            // Damping
            node.vx *= 0.9;
            node.vy *= 0.9;

            node.x += node.vx;
            node.y += node.vy;
        }

        // Draw connections — comparamos distancia al cuadrado y solo hacemos sqrt
        // cuando el par está dentro del rango (la mayoría no lo está).
        this.ctx.lineWidth = 0.5;
        const maxSq = this.CONNECT_DIST * this.CONNECT_DIST;
        for (let i = 0; i < this.nodes.length; i++) {
            for (let j = i + 1; j < this.nodes.length; j++) {
                const a = this.nodes[i];
                const b = this.nodes[j];
                const dx = a.x - b.x;
                const dy = a.y - b.y;
                const distSq = dx * dx + dy * dy;

                if (distSq < maxSq) {
                    const alpha = lineAlpha * (1 - Math.sqrt(distSq) / this.CONNECT_DIST);
                    this.ctx.strokeStyle = `rgba(${color}, ${alpha})`;
                    this.ctx.beginPath();
                    this.ctx.moveTo(a.x, a.y);
                    this.ctx.lineTo(b.x, b.y);
                    this.ctx.stroke();
                }
            }
        }

        // Draw nodes
        for (const node of this.nodes) {
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, this.NODE_RADIUS, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(${color}, ${nodeAlpha})`;
            this.ctx.fill();
        }

        if (!this.paused) {
            this.rafId = requestAnimationFrame(() => this.animate());
        }
    }
};

// ======================
// LIGHTING EFFECTS MODULE
// ======================
const LightingEffects = {
    glowEl: null,
    mouse: { x: 0, y: 0 },

    init() {
        if (this.isTouchDevice()) return;
        this.createOrbs();
        this.createCursorGlow();
        this.bindEvents();
    },

    isTouchDevice() {
        return window.matchMedia('(pointer: coarse)').matches ||
            ('ontouchstart' in window && navigator.maxTouchPoints > 0);
    },

    createOrbs() {
        for (let i = 1; i <= 3; i++) {
            const orb = document.createElement('div');
            orb.className = `ambient-orb ambient-orb--${i}`;
            orb.setAttribute('aria-hidden', 'true');
            document.body.appendChild(orb);
        }
    },

    createCursorGlow() {
        this.glowEl = document.createElement('div');
        this.glowEl.className = 'cursor-glow';
        this.glowEl.setAttribute('aria-hidden', 'true');
        this.glowEl.style.opacity = '0';
        document.body.appendChild(this.glowEl);
    },

    bindEvents() {
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            this.glowEl.style.left = e.clientX + 'px';
            this.glowEl.style.top = e.clientY + 'px';
            this.glowEl.style.opacity = '1';
        });

        document.addEventListener('mouseleave', () => {
            this.glowEl.style.opacity = '0';
        });

        document.addEventListener('mouseenter', () => {
            this.glowEl.style.opacity = '1';
        });
    }
};

// ======================
// CURSOR EFFECTS MODULE
// ======================
const CursorEffects = {
    mouse: { x: 0, y: 0 },
    ring: { x: 0, y: 0 },
    particles: [],
    dot: null,
    ringEl: null,
    canvas: null,
    ctx: null,
    animId: null,
    visible: false,
    hovering: false,
    clicking: false,
    isDark: false,
    lastMouse: { x: 0, y: 0 },
    LERP_FACTOR: 0.15,
    MAX_PARTICLES: 400,
    TRAIL_COLORS_DARK: ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'],
    TRAIL_COLORS_LIGHT: ['#1d4ed8', '#2563eb', '#3b82f6', '#1e40af'],
    FIREWORK_COLORS_DARK: ['#3b82f6', '#2563eb', '#60a5fa', '#93c5fd', '#bfdbfe'],
    FIREWORK_COLORS_LIGHT: ['#1d4ed8', '#2563eb', '#1e40af', '#3b82f6', '#0ea5e9'],
    CORE_COLOR_DARK: '#bfdbfe',
    CORE_COLOR_LIGHT: '#1e40af',

    init() {
        if (this.isTouchDevice()) return;
        this.isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        this.observeTheme();
        this.createDOM();
        this.bindEvents();
        this.animate();
    },

    observeTheme() {
        const observer = new MutationObserver(() => {
            this.isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    },

    getTrailColors() {
        return this.isDark ? this.TRAIL_COLORS_DARK : this.TRAIL_COLORS_LIGHT;
    },

    getFireworkColors() {
        return this.isDark ? this.FIREWORK_COLORS_DARK : this.FIREWORK_COLORS_LIGHT;
    },

    getCoreColor() {
        return this.isDark ? this.CORE_COLOR_DARK : this.CORE_COLOR_LIGHT;
    },

    isTouchDevice() {
        return window.matchMedia('(pointer: coarse)').matches ||
            ('ontouchstart' in window && navigator.maxTouchPoints > 0);
    },

    createDOM() {
        this.dot = document.createElement('div');
        this.dot.className = 'cursor-dot';
        document.body.appendChild(this.dot);

        this.ringEl = document.createElement('div');
        this.ringEl.className = 'cursor-ring';
        document.body.appendChild(this.ringEl);

        this.canvas = document.createElement('canvas');
        this.canvas.className = 'cursor-canvas';
        document.body.appendChild(this.canvas);

        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    },

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    },

    bindEvents() {
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            if (!this.visible) {
                this.visible = true;
                this.ring.x = e.clientX;
                this.ring.y = e.clientY;
                this.dot.style.opacity = '1';
                this.ringEl.style.opacity = '1';
            }
        });

        document.addEventListener('mousedown', (e) => {
            this.clicking = true;
            this.dot.classList.add('clicking');
            this.ringEl.classList.add('clicking');
            this.spawnFirework(e.clientX, e.clientY);
        });

        document.addEventListener('mouseup', () => {
            this.clicking = false;
            this.dot.classList.remove('clicking');
            this.ringEl.classList.remove('clicking');
        });

        document.addEventListener('mouseover', (e) => {
            const target = e.target.closest('a, button, [role="button"], .clickable, input[type="submit"], .nav-link, .thumb, .gallery-main');
            if (target) {
                this.hovering = true;
                this.dot.classList.add('hovering');
                this.ringEl.classList.add('hovering');
            }
        });

        document.addEventListener('mouseout', (e) => {
            const target = e.target.closest('a, button, [role="button"], .clickable, input[type="submit"], .nav-link, .thumb, .gallery-main');
            if (target) {
                this.hovering = false;
                this.dot.classList.remove('hovering');
                this.ringEl.classList.remove('hovering');
            }
        });

        document.addEventListener('mouseleave', () => {
            this.visible = false;
            this.dot.style.opacity = '0';
            this.ringEl.style.opacity = '0';
        });

        document.addEventListener('mouseenter', () => {
            this.visible = true;
            this.dot.style.opacity = '1';
            this.ringEl.style.opacity = '1';
        });
    },

    animate() {
        if (this.visible) {
            // Dot follows mouse instantly
            this.dot.style.left = this.mouse.x + 'px';
            this.dot.style.top = this.mouse.y + 'px';

            // Ring follows with lerp
            this.ring.x += (this.mouse.x - this.ring.x) * this.LERP_FACTOR;
            this.ring.y += (this.mouse.y - this.ring.y) * this.LERP_FACTOR;
            this.ringEl.style.left = this.ring.x + 'px';
            this.ringEl.style.top = this.ring.y + 'px';

            // Spawn trail particles
            this.spawnTrail();
        }

        // Update and render particles
        this.updateParticles();

        this.animId = requestAnimationFrame(() => this.animate());
    },

    spawnTrail() {
        const dx = this.mouse.x - this.lastMouse.x;
        const dy = this.mouse.y - this.lastMouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 2) {
            this.lastMouse.x = this.mouse.x;
            this.lastMouse.y = this.mouse.y;
            return;
        }

        const count = Math.min(Math.floor(dist / 4), 8);
        for (let i = 0; i < count; i++) {
            const t = i / count;
            const x = this.lastMouse.x + dx * t + (Math.random() - 0.5) * 8;
            const y = this.lastMouse.y + dy * t + (Math.random() - 0.5) * 8;
            const colors = this.getTrailColors();
            const color = colors[Math.floor(Math.random() * colors.length)];

            this.particles.push({
                x, y,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                life: 1,
                decay: 0.02 + Math.random() * 0.02,
                size: 2 + Math.random() * 3,
                color,
                gravity: 0,
                drag: 1
            });
        }

        this.lastMouse.x = this.mouse.x;
        this.lastMouse.y = this.mouse.y;

        // Cap particles
        if (this.particles.length > this.MAX_PARTICLES) {
            this.particles.splice(0, this.particles.length - this.MAX_PARTICLES);
        }
    },

    spawnFirework(x, y) {
        const count = 20 + Math.floor(Math.random() * 10);
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.3;
            const speed = 3 + Math.random() * 5;
            const fwColors = this.getFireworkColors();
            const color = fwColors[Math.floor(Math.random() * fwColors.length)];

            this.particles.push({
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1,
                decay: 0.015 + Math.random() * 0.01,
                size: 3 + Math.random() * 4,
                color,
                gravity: 0.12,
                drag: 0.98
            });
        }
    },

    updateParticles() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];

            // Physics
            p.vx *= p.drag;
            p.vy *= p.drag;
            p.vy += p.gravity;
            p.x += p.vx;
            p.y += p.vy;
            p.life -= p.decay;

            if (p.life <= 0) {
                this.particles.splice(i, 1);
                continue;
            }

            // Render outer glow
            const rgba = this.hexToRgba(p.color, p.life * 0.4);
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size * 2.5 * p.life, 0, Math.PI * 2);
            this.ctx.fillStyle = rgba;
            this.ctx.fill();

            // Render core
            const coreRgba = this.hexToRgba(this.getCoreColor(), p.life * 0.9);
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
            this.ctx.fillStyle = coreRgba;
            this.ctx.fill();
        }
    },

    hexToRgba(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r},${g},${b},${alpha})`;
    }
};

// ======================
// INITIALIZATION
// ======================
document.addEventListener('DOMContentLoaded', () => {
    Navigation.init();
    ProjectsAccordion.init();
    MobileCarousel.init();
    DarkMode.init();
    ImageGallery.init();
    ScrollToTop.init();
    ExperienceCalculator.init();

    // Proyectos arranca "recogido": solo las categorías + un aviso.
    // Cada grupo aparece al seleccionar su categoría (ver ProjectsFilter / category cards).

    // Efectos decorativos: solo si el usuario NO pidió menos movimiento
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReduced) {
        NeuralNetwork.init();
        LightingEffects.init();
        CursorEffects.init();
        // Ocultar el cursor nativo SOLO si el cursor personalizado realmente se activó
        if (!CursorEffects.isTouchDevice()) {
            document.documentElement.classList.add('custom-cursor');
        }
    }

    // Set current year in footer
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
});
