/* ==========================================================================
   INDIA BAKERY EXPO '26 - INTERACTIVE SCRIPT
   Vanilla JavaScript for sticky nav, mobile menu, stat counter, accordion, modal, and forms.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // ----------------------------------------------------------------------
    // 1. STICKY HEADER & ACTIVE NAV LINKS ON SCROLL
    // ----------------------------------------------------------------------
    const header = document.getElementById('header');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id], header[id]');

    function handleScroll() {
        if (window.scrollY > 40) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Active Section Indicator
        let currentSection = '';
        const scrollPosition = window.scrollY + 200;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', handleScroll);

    // ----------------------------------------------------------------------
    // 2. MOBILE MENU HAMBURGER TOGGLE
    // ----------------------------------------------------------------------
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const navMenu = document.getElementById('navMenu');

    if (hamburgerBtn && navMenu) {
        hamburgerBtn.addEventListener('click', () => {
            hamburgerBtn.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking nav link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburgerBtn.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // ----------------------------------------------------------------------
    // 3. STATS COUNTER ANIMATION (INTERSECTION OBSERVER)
    // ----------------------------------------------------------------------
    const counterElements = document.querySelectorAll('[data-counter]');
    let animatedCounters = false;

    function startCounters() {
        counterElements.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-counter'), 10);
            const duration = 2000; // ms
            const stepTime = 30;
            const steps = duration / stepTime;
            const increment = target / steps;
            let current = 0;

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    counter.innerText = target.toLocaleString();
                    clearInterval(timer);
                } else {
                    counter.innerText = Math.floor(current).toLocaleString();
                }
            }, stepTime);
        });
    }

    const statsSection = document.querySelector('.stats-grid');
    if (statsSection && 'IntersectionObserver' in window) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !animatedCounters) {
                    animatedCounters = true;
                    startCounters();
                }
            });
        }, { threshold: 0.3 });

        statsObserver.observe(statsSection);
    } else {
        startCounters();
    }

    // ----------------------------------------------------------------------
    // 4. VISITOR ACCORDION TOGGLE
    // ----------------------------------------------------------------------
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(headerBtn => {
        headerBtn.addEventListener('click', () => {
            const item = headerBtn.parentElement;
            const isOpen = item.classList.contains('active');

            // Close all items
            document.querySelectorAll('.accordion-item').forEach(accItem => {
                accItem.classList.remove('active');
                accItem.querySelector('.accordion-header').setAttribute('aria-expanded', 'false');
            });

            // If it was closed, open it
            if (!isOpen) {
                item.classList.add('active');
                headerBtn.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // ----------------------------------------------------------------------
    // 5. REGISTRATION & ENQUIRY MODAL DIALOG
    // ----------------------------------------------------------------------
    const openModalBtns = document.querySelectorAll('.open-modal-btn');
    const modalOverlay = document.getElementById('enquiryModal');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const stallCancelBtn = document.getElementById('stallCancelBtn');
    const visitorCancelBtn = document.getElementById('visitorCancelBtn');

    function openModal() {
        if (modalOverlay) {
            modalOverlay.classList.add('active');
            modalOverlay.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeModal() {
        if (modalOverlay) {
            modalOverlay.classList.remove('active');
            modalOverlay.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }
    }

    openModalBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();
        });
    });

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (stallCancelBtn) stallCancelBtn.addEventListener('click', closeModal);
    if (visitorCancelBtn) visitorCancelBtn.addEventListener('click', closeModal);

    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
            closeModal();
        }
    });

    // ----------------------------------------------------------------------
    // MODAL TAB SWITCHER (STALL BOOKING vs VISITOR REGISTRATION)
    // ----------------------------------------------------------------------
    const tabStallBtn = document.getElementById('tabStallBtn');
    const tabVisitorBtn = document.getElementById('tabVisitorBtn');
    const stallForm = document.getElementById('stallForm');
    const visitorForm = document.getElementById('visitorForm');

    function switchModalTab(targetTab) {
        if (targetTab === 'stall') {
            tabStallBtn.classList.add('active');
            tabStallBtn.setAttribute('aria-selected', 'true');
            tabVisitorBtn.classList.remove('active');
            tabVisitorBtn.setAttribute('aria-selected', 'false');
            stallForm.style.display = 'block';
            visitorForm.style.display = 'none';
        } else {
            tabVisitorBtn.classList.add('active');
            tabVisitorBtn.setAttribute('aria-selected', 'true');
            tabStallBtn.classList.remove('active');
            tabStallBtn.setAttribute('aria-selected', 'false');
            visitorForm.style.display = 'block';
            stallForm.style.display = 'none';
        }
    }

    if (tabStallBtn && tabVisitorBtn) {
        tabStallBtn.addEventListener('click', () => switchModalTab('stall'));
        tabVisitorBtn.addEventListener('click', () => switchModalTab('visitor'));
    }

    // ----------------------------------------------------------------------
    // 6. FORM SUBMISSIONS (INTERACTIVE FEEDBACK)
    // ----------------------------------------------------------------------
    const contactForm = document.getElementById('contactForm');
    const formFeedback = document.getElementById('formFeedback');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const fullName = document.getElementById('fullName').value;
            
            formFeedback.className = 'form-feedback success';
            formFeedback.innerHTML = `Thank you, <strong>${fullName}</strong>! Your enquiry has been sent successfully to the Secretariat. We will contact you shortly.`;
            contactForm.reset();

            setTimeout(() => {
                formFeedback.innerHTML = '';
                formFeedback.className = 'form-feedback';
            }, 6000);
        });
    }

    // Stall Form Submit
    const stallFormFeedback = document.getElementById('stallFormFeedback');
    if (stallForm) {
        stallForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const sName = document.getElementById('stallName').value;

            stallFormFeedback.className = 'form-feedback success';
            stallFormFeedback.innerHTML = `Thank you, <strong>${sName}</strong>! Your Stall Booking request for India Bakery Expo 2026 has been submitted.`;
            stallForm.reset();

            setTimeout(() => {
                closeModal();
                stallFormFeedback.innerHTML = '';
                stallFormFeedback.className = 'form-feedback';
            }, 2500);
        });
    }

    // Visitor Form Submit
    const visitorFormFeedback = document.getElementById('visitorFormFeedback');
    if (visitorForm) {
        visitorForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const vName = document.getElementById('visitorName').value;

            visitorFormFeedback.className = 'form-feedback success';
            visitorFormFeedback.innerHTML = `Thank you, <strong>${vName}</strong>! Your Visitor Registration for India Bakery Expo 2026 is confirmed.`;
            visitorForm.reset();

            setTimeout(() => {
                closeModal();
                visitorFormFeedback.innerHTML = '';
                visitorFormFeedback.className = 'form-feedback';
            }, 2500);
        });
    }

    // ----------------------------------------------------------------------
    // 7. BACK TO TOP BUTTON
    // ----------------------------------------------------------------------
    const backToTopBtn = document.getElementById('backToTopBtn');

    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});
