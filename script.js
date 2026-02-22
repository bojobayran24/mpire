/**
 * =====================================================================
 * MPIRE OFFICIAL — Main JavaScript
 * =====================================================================
 * Handles:
 *   1. Mobile hamburger menu toggle + backdrop
 *   2. Smooth scrolling for anchor links
 *   3. Sticky header scroll effect
 *   4. Active nav‑link highlighting on scroll
 *   5. Track filter buttons (All / Music Videos / Official Audio)
 *   6. Scroll‑reveal animations (IntersectionObserver)
 * =====================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    // ── DOM REFERENCES ──────────────────────────────────────────────
    const header      = document.getElementById('site-header');
    const hamburger   = document.getElementById('hamburger');
    const mainNav     = document.getElementById('main-nav');
    const navLinks    = document.querySelectorAll('.nav-link');
    const filterBtns  = document.querySelectorAll('.filter-btn');
    const trackCards  = document.querySelectorAll('.track-card');
    const sections    = document.querySelectorAll('section[id]');

    // Create backdrop element for mobile nav
    const backdrop = document.createElement('div');
    backdrop.classList.add('nav-backdrop');
    document.body.appendChild(backdrop);

    // ═════════════════════════════════════════════════════════════════
    // 1. MOBILE HAMBURGER MENU
    // ═════════════════════════════════════════════════════════════════
    function openMobileNav() {
        hamburger.classList.add('active');
        mainNav.classList.add('open');
        backdrop.classList.add('show');
        document.body.style.overflow = 'hidden'; // Prevent background scroll
    }

    function closeMobileNav() {
        hamburger.classList.remove('active');
        mainNav.classList.remove('open');
        backdrop.classList.remove('show');
        document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', () => {
        if (mainNav.classList.contains('open')) {
            closeMobileNav();
        } else {
            openMobileNav();
        }
    });

    // Close nav when clicking the backdrop
    backdrop.addEventListener('click', closeMobileNav);

    // Close nav when clicking a link (mobile)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mainNav.classList.contains('open')) {
                closeMobileNav();
            }
        });
    });

    // ═════════════════════════════════════════════════════════════════
    // 2. SMOOTH SCROLLING
    // ═════════════════════════════════════════════════════════════════
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = anchor.getAttribute('href');
            const target   = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ═════════════════════════════════════════════════════════════════
    // 3. STICKY HEADER — adds 'scrolled' class on scroll
    // ═════════════════════════════════════════════════════════════════
    function handleHeaderScroll() {
        if (window.scrollY > 60) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    handleHeaderScroll(); // Run once on load

    // ═════════════════════════════════════════════════════════════════
    // 4. ACTIVE NAV HIGHLIGHTING ON SCROLL
    // ═════════════════════════════════════════════════════════════════
    function highlightActiveSection() {
        const scrollPos = window.scrollY + 120;

        sections.forEach(section => {
            const sectionTop    = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId     = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    window.addEventListener('scroll', highlightActiveSection, { passive: true });

    // ═════════════════════════════════════════════════════════════════
    // 5. TRACK FILTER BUTTONS
    // ═════════════════════════════════════════════════════════════════
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state on buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            trackCards.forEach(card => {
                const type = card.getAttribute('data-type');

                if (filter === 'all' || type === filter) {
                    card.classList.remove('hidden');
                    // Smooth fade‑in
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(16px)';
                    requestAnimationFrame(() => {
                        card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    });
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    // ═════════════════════════════════════════════════════════════════
    // 6. SCROLL REVEAL ANIMATIONS (IntersectionObserver)
    // ═════════════════════════════════════════════════════════════════
    // Add '.reveal' class to elements that should animate on scroll
    const revealTargets = document.querySelectorAll(
        '.track-card, .contact-card, .about-text, .about-visual, .stats-row'
    );

    revealTargets.forEach(el => el.classList.add('reveal'));

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target); // Animate only once
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
    });

    revealTargets.forEach(el => revealObserver.observe(el));

    // ═════════════════════════════════════════════════════════════════
    // STAGGERED REVEAL FOR TRACK CARDS
    // ═════════════════════════════════════════════════════════════════
    trackCards.forEach((card, i) => {
        card.style.transitionDelay = `${i * 0.06}s`;
    });

    // ═════════════════════════════════════════════════════════════════
    // 7. DESCRIPTION MODAL
    // ═════════════════════════════════════════════════════════════════
    const modalOverlay   = document.getElementById('desc-modal-overlay');
    const modalClose     = document.getElementById('desc-modal-close');
    const modalTitle     = document.getElementById('modal-track-title');
    const modalArtist    = document.getElementById('modal-track-artist');
    const modalDesc      = document.getElementById('modal-track-desc');

    function openModal(title, artist, desc) {
        modalTitle.textContent  = title;
        modalArtist.textContent = artist;
        // Convert newlines to <br> manually for the modal body
        modalDesc.innerHTML = desc.replace(/\n/g, '<br>');
        modalOverlay.style.display = 'flex';
        // Force reflow so transition fires
        requestAnimationFrame(() => modalOverlay.classList.add('open'));
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modalOverlay.classList.remove('open');
        // Wait for fade-out before hiding
        setTimeout(() => {
            modalOverlay.style.display = 'none';
        }, 250);
        document.body.style.overflow = '';
    }

    // Open modal on each Description button
    document.querySelectorAll('.show-more-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            openModal(
                btn.getAttribute('data-title'),
                btn.getAttribute('data-artist'),
                btn.getAttribute('data-desc')
            );
        });
    });

    // Close on X button
    modalClose.addEventListener('click', closeModal);

    // Close on overlay click (outside modal box)
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.classList.contains('open')) closeModal();
    });
});

