document.addEventListener('DOMContentLoaded', () => {
    
    // --- Theme Toggle Logic ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn.querySelector('i');
    
    // Check for saved theme priority
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
        if (currentTheme === 'dark') {
            themeIcon.classList.replace('fa-moon', 'fa-sun');
        }
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // Check system preference
        document.documentElement.setAttribute('data-theme', 'dark');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    }

    themeToggleBtn.addEventListener('click', () => {
        let theme = document.documentElement.getAttribute('data-theme');
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            themeIcon.classList.replace('fa-sun', 'fa-moon');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeIcon.classList.replace('fa-moon', 'fa-sun');
        }
    });

    // --- Header Scroll Effect ---
    window.addEventListener('scroll', () => {
        const header = document.getElementById('header');
        if (window.scrollY > 50) {
            header.style.boxShadow = 'var(--shadow-md)';
        } else {
            header.style.boxShadow = 'none';
        }
    });

    updateAuthUI();

    // --- SPA Routing Logic ---
    const navLinks = document.querySelectorAll('.nav-link[data-target]');
    const viewSections = document.querySelectorAll('.view-section');

    function navigateTo(targetId) {
        // Update Nav Links Active State
        document.querySelectorAll('.nav-menu .nav-link').forEach(link => {
            link.classList.remove('active');
            if(link.getAttribute('data-target') === targetId) {
                link.classList.add('active');
            }
        });

        // Update View Sections
        viewSections.forEach(section => {
            section.classList.remove('active');
            if (section.id === targetId) {
                section.classList.add('active');
            }
        });

        // Scroll to top
        window.scrollTo(0, 0);
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('data-target');
            if(target) {
                navigateTo(target);
            }
        });
    });

    // Handle incoming hash if any
    const hash = window.location.hash.replace('#', '');
    if (hash && document.getElementById(hash)) {
         navigateTo(hash);
    }

    // --- Interactive "How It Works" Steps ---
    const stepBtns = document.querySelectorAll('.step-btn');
    const stepPanels = document.querySelectorAll('.step-panel');

    stepBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            stepBtns.forEach(b => b.classList.remove('active'));
            stepPanels.forEach(p => p.classList.remove('active'));

            // Add active class to clicked
            btn.classList.add('active');
            const stepId = btn.getAttribute('data-step');
            document.getElementById(`step-panel-${stepId}`).classList.add('active');
        });
    });
});
