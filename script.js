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

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeModal);
    }

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

    const modalEnquiryForm = document.getElementById('modalEnquiryForm');
    const modalFormFeedback = document.getElementById('modalFormFeedback');

    if (modalEnquiryForm) {
        modalEnquiryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const mName = document.getElementById('mFullName').value;

            modalFormFeedback.className = 'form-feedback success';
            modalFormFeedback.innerHTML = `Thank you, <strong>${mName}</strong>! Your registration enquiry is submitted.`;
            modalEnquiryForm.reset();

            setTimeout(() => {
                closeModal();
                modalFormFeedback.innerHTML = '';
                modalFormFeedback.className = 'form-feedback';
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
