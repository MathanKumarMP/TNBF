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
            clearAllFormErrors(stallForm);
            clearAllFormErrors(visitorForm);
            modalOverlay.classList.add('active');
            modalOverlay.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeModal() {
        if (modalOverlay) {
            clearAllFormErrors(stallForm);
            clearAllFormErrors(visitorForm);
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
    // POPUP MODAL ONLY ON USER 1ST SCROLL (NEVER ON REFRESH)
    // ----------------------------------------------------------------------
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }

    // Force page top on refresh
    window.scrollTo(0, 0);

    let hasAutoOpenedOnScroll = false;
    let userHasInteracted = false;

    // Track user active scroll gestures (wheel, touch, scrollbar drag, keydown)
    function markUserInteracted() {
        userHasInteracted = true;
    }

    window.addEventListener('wheel', markUserInteracted, { passive: true });
    window.addEventListener('touchmove', markUserInteracted, { passive: true });
    window.addEventListener('mousedown', markUserInteracted, { passive: true });
    window.addEventListener('keydown', (e) => {
        if (['ArrowDown', 'PageDown', 'Space'].includes(e.key)) {
            userHasInteracted = true;
        }
    });

    function checkScrollForModal() {
        // Open modal ONLY if user has actively performed a scroll gesture and scrolled > 80px
        if (!hasAutoOpenedOnScroll && userHasInteracted && window.scrollY > 80) {
            hasAutoOpenedOnScroll = true;
            openModal();
            window.removeEventListener('scroll', checkScrollForModal);
            window.removeEventListener('wheel', markUserInteracted);
            window.removeEventListener('touchmove', markUserInteracted);
            window.removeEventListener('mousedown', markUserInteracted);
        }
    }

    window.addEventListener('scroll', checkScrollForModal);

    // ----------------------------------------------------------------------
    // MODAL TAB SWITCHER (STALL BOOKING vs VISITOR REGISTRATION)
    // ----------------------------------------------------------------------
    const tabStallBtn = document.getElementById('tabStallBtn');
    const tabVisitorBtn = document.getElementById('tabVisitorBtn');
    const stallForm = document.getElementById('stallForm');
    const visitorForm = document.getElementById('visitorForm');

    // ----------------------------------------------------------------------
    // CUSTOM FORM VALIDATION & ERROR HANDLING
    // ----------------------------------------------------------------------
    function setFieldError(fieldId, errorMsg) {
        const inputElem = document.getElementById(fieldId);
        if (!inputElem) return;
        
        inputElem.classList.add('input-error');
        
        const parentGroup = inputElem.closest('.modal-field-group');
        if (parentGroup) {
            let errSpan = parentGroup.querySelector('.field-error-msg');
            if (!errSpan) {
                errSpan = document.createElement('span');
                errSpan.className = 'field-error-msg';
                parentGroup.appendChild(errSpan);
            }
            errSpan.textContent = errorMsg;
        }
    }

    function clearFieldError(fieldId) {
        const inputElem = document.getElementById(fieldId);
        if (!inputElem) return;
        
        inputElem.classList.remove('input-error');
        
        const parentGroup = inputElem.closest('.modal-field-group');
        if (parentGroup) {
            const errSpan = parentGroup.querySelector('.field-error-msg');
            if (errSpan) {
                errSpan.remove();
            }
        }
    }

    function clearAllFormErrors(formElem) {
        if (!formElem) return;
        const errInputs = formElem.querySelectorAll('.input-error');
        errInputs.forEach(input => input.classList.remove('input-error'));
        
        const errSpans = formElem.querySelectorAll('.field-error-msg');
        errSpans.forEach(span => span.remove());
    }

    // Attach real-time input event listeners to clear error styles on type
    const allFormInputs = document.querySelectorAll('.expo-input, .expo-select');
    allFormInputs.forEach(input => {
        input.addEventListener('input', () => clearFieldError(input.id));
        input.addEventListener('change', () => clearFieldError(input.id));
    });

    // ------------------------------------------------------------------
    // REAL-TIME INPUT BLOCKING
    // ------------------------------------------------------------------
    // Name fields: allow only letters and spaces (no digits/symbols)
    const nameFieldIds = ['visitorName', 'cVisitorName', 'stallName', 'cStallName'];
    nameFieldIds.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener('input', () => {
            // Strip any character that is not a letter or space
            el.value = el.value.replace(/[^a-zA-Z\u00C0-\u024F\s]/g, '');
        });
        el.addEventListener('keydown', (e) => {
            // Block digit keys in real time
            if (e.key >= '0' && e.key <= '9') e.preventDefault();
        });
    });

    // Mobile fields: allow only digits (no letters, no spaces, no symbols)
    const mobileFieldIds = ['visitorMobile', 'cVisitorMobile', 'stallMobile', 'cStallMobile'];
    mobileFieldIds.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener('input', () => {
            // Strip non-digits and limit to 10 chars
            el.value = el.value.replace(/\D/g, '').slice(0, 10);
        });
        el.addEventListener('keydown', (e) => {
            // Allow: digits, backspace, delete, arrows, tab
            const allowed = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End'];
            if (allowed.includes(e.key)) return;
            if (e.key < '0' || e.key > '9') e.preventDefault();
        });
    });

    // ------------------------------------------------------------------
    // HELPER VALIDATORS
    // ------------------------------------------------------------------
    // Name: only letters and spaces allowed
    function isValidName(nameStr) {
        return /^[a-zA-Z\u00C0-\u024F\s]+$/.test(nameStr.trim());
    }

    // Mobile: exactly 10 digits, no repeating same digit 10 times
    const submittedMobiles = new Set();
    function isValidMobile(mobileStr) {
        const cleaned = mobileStr.trim().replace(/\D/g, '');
        if (cleaned.length !== 10) return { ok: false, msg: 'Please enter a valid 10-digit mobile number' };
        // Check all same digit (e.g. 0000000000)
        if (/^(\d)\1{9}$/.test(cleaned)) return { ok: false, msg: 'Please enter a valid mobile number' };
        return { ok: true, cleaned };
    }

    function isDuplicateMobile(cleaned) {
        return submittedMobiles.has(cleaned);
    }

    // Email: must contain @
    function isValidEmail(emailStr) {
        return emailStr.trim() === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr.trim());
    }

    // ----------------------------------------------------------------------
    // MODAL TAB SWITCHER (STALL BOOKING vs VISITOR REGISTRATION)
    // ----------------------------------------------------------------------

    function switchModalTab(targetTab) {
        clearAllFormErrors(stallForm);
        clearAllFormErrors(visitorForm);
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
    // INLINE CONTACT SECTION TAB SWITCHER
    // ----------------------------------------------------------------------
    const cTabStallBtn = document.getElementById('cTabStallBtn');
    const cTabVisitorBtn = document.getElementById('cTabVisitorBtn');
    const cStallForm = document.getElementById('cStallForm');
    const cVisitorForm = document.getElementById('cVisitorForm');

    function switchContactTab(targetTab) {
        clearAllFormErrors(cStallForm);
        clearAllFormErrors(cVisitorForm);
        if (targetTab === 'stall') {
            cTabStallBtn.classList.add('active');
            cTabStallBtn.setAttribute('aria-selected', 'true');
            cTabVisitorBtn.classList.remove('active');
            cTabVisitorBtn.setAttribute('aria-selected', 'false');
            cStallForm.style.display = 'block';
            cVisitorForm.style.display = 'none';
        } else {
            cTabVisitorBtn.classList.add('active');
            cTabVisitorBtn.setAttribute('aria-selected', 'true');
            cTabStallBtn.classList.remove('active');
            cTabStallBtn.setAttribute('aria-selected', 'false');
            cVisitorForm.style.display = 'block';
            cStallForm.style.display = 'none';
        }
    }

    if (cTabStallBtn && cTabVisitorBtn) {
        cTabStallBtn.addEventListener('click', () => switchContactTab('stall'));
        cTabVisitorBtn.addEventListener('click', () => switchContactTab('visitor'));
    }

    // ----------------------------------------------------------------------
    // FORM SUBMISSIONS WITH CUSTOM VALIDATION
    // ----------------------------------------------------------------------
    // 1. Modal Stall Form Submit
    const stallFormFeedback = document.getElementById('stallFormFeedback');
    if (stallForm) {
        stallForm.addEventListener('submit', (e) => {
            e.preventDefault();
            clearAllFormErrors(stallForm);

            const sName     = document.getElementById('stallName').value.trim();
            const sCompany  = document.getElementById('stallCompany') ? document.getElementById('stallCompany').value.trim() : '';
            const sMobile   = document.getElementById('stallMobile').value.trim();
            const sEmail    = document.getElementById('stallEmail') ? document.getElementById('stallEmail').value.trim() : '';
            const sCategory = document.getElementById('stallCategory') ? document.getElementById('stallCategory').value.trim() : '';
            const sSize     = document.getElementById('stallSize') ? document.getElementById('stallSize').value.trim() : '';
            const sCity     = document.getElementById('stallCity').value.trim();
            const sRemarks  = document.getElementById('stallRemarks') ? document.getElementById('stallRemarks').value.trim() : '';

            let isValid = true;

            if (!sName) {
                setFieldError('stallName', 'Name is required');
                isValid = false;
            } else if (!isValidName(sName)) {
                setFieldError('stallName', 'Name must contain only letters and spaces');
                isValid = false;
            }

            if (!sCompany) {
                setFieldError('stallCompany', 'Company Name is required');
                isValid = false;
            }

            const mobileCheck = isValidMobile(sMobile);
            if (!sMobile) {
                setFieldError('stallMobile', 'Mobile number is required');
                isValid = false;
            } else if (!mobileCheck.ok) {
                setFieldError('stallMobile', mobileCheck.msg);
                isValid = false;
            } else if (isDuplicateMobile(mobileCheck.cleaned)) {
                setFieldError('stallMobile', 'This mobile number has already been registered');
                isValid = false;
            }

            if (!sEmail) {
                setFieldError('stallEmail', 'Email ID is required');
                isValid = false;
            } else if (!isValidEmail(sEmail)) {
                setFieldError('stallEmail', 'Please enter a valid email address with @');
                isValid = false;
            }

            if (!sCategory) {
                setFieldError('stallCategory', 'Business Category is required');
                isValid = false;
            }

            if (!sSize) {
                setFieldError('stallSize', 'Stall Size is required');
                isValid = false;
            }

            if (!sCity) {
                setFieldError('stallCity', 'City is required');
                isValid = false;
            }

            if (!sRemarks) {
                setFieldError('stallRemarks', 'Remarks is required');
                isValid = false;
            }

            if (!isValid) return;

            submittedMobiles.add(mobileCheck.cleaned);
            stallForm.reset();
            closeModal();
            window.open('thank-you.html', '_blank');
        });
    }

    // 2. Modal Visitor Form Submit
    const visitorFormFeedback = document.getElementById('visitorFormFeedback');
    if (visitorForm) {
        visitorForm.addEventListener('submit', (e) => {
            e.preventDefault();
            clearAllFormErrors(visitorForm);

            const vVisitDate = document.getElementById('visitorVisitDate') ? document.getElementById('visitorVisitDate').value : '';
            const vProfile   = document.getElementById('visitorProfile').value;
            const vName      = document.getElementById('visitorName').value.trim();
            const vMobile    = document.getElementById('visitorMobile').value.trim();
            const vEmail     = document.getElementById('visitorEmail') ? document.getElementById('visitorEmail').value.trim() : '';
            const vCity      = document.getElementById('visitorCity').value.trim();

            let isValid = true;

            if (!vVisitDate) {
                setFieldError('visitorVisitDate', 'Please select when you plan to visit');
                isValid = false;
            }

            if (!vProfile) {
                setFieldError('visitorProfile', 'Please select a profile option');
                isValid = false;
            }

            if (!vName) {
                setFieldError('visitorName', 'Full name is required');
                isValid = false;
            } else if (!isValidName(vName)) {
                setFieldError('visitorName', 'Name must contain only letters and spaces');
                isValid = false;
            }

            const mobileCheck = isValidMobile(vMobile);
            if (!vMobile) {
                setFieldError('visitorMobile', 'Phone number is required');
                isValid = false;
            } else if (!mobileCheck.ok) {
                setFieldError('visitorMobile', mobileCheck.msg);
                isValid = false;
            } else if (isDuplicateMobile(mobileCheck.cleaned)) {
                setFieldError('visitorMobile', 'This phone number has already been registered');
                isValid = false;
            }

            if (!vEmail) {
                setFieldError('visitorEmail', 'Email is required');
                isValid = false;
            } else if (!isValidEmail(vEmail)) {
                setFieldError('visitorEmail', 'Please enter a valid email address with @');
                isValid = false;
            }

            if (!vCity) {
                setFieldError('visitorCity', 'City is required');
                isValid = false;
            }

            if (!isValid) return;

            submittedMobiles.add(mobileCheck.cleaned);
            visitorForm.reset();
            closeModal();
            window.open('thank-you.html', '_blank');
        });
    }

    // 3. Inline Contact Stall Form Submit
    const cStallFeedback = document.getElementById('cStallFeedback');
    if (cStallForm) {
        cStallForm.addEventListener('submit', (e) => {
            e.preventDefault();
            clearAllFormErrors(cStallForm);

            const csName   = document.getElementById('cStallName').value.trim();
            const csMobile = document.getElementById('cStallMobile').value.trim();
            const csEmail  = document.getElementById('cStallEmail') ? document.getElementById('cStallEmail').value.trim() : '';
            const csCity   = document.getElementById('cStallCity').value.trim();

            let isValid = true;

            if (!csName) {
                setFieldError('cStallName', 'Full name is required');
                isValid = false;
            } else if (!isValidName(csName)) {
                setFieldError('cStallName', 'Name must contain only letters and spaces');
                isValid = false;
            }

            const mobileCheck = isValidMobile(csMobile);
            if (!csMobile) {
                setFieldError('cStallMobile', 'Mobile number is required');
                isValid = false;
            } else if (!mobileCheck.ok) {
                setFieldError('cStallMobile', mobileCheck.msg);
                isValid = false;
            } else if (isDuplicateMobile(mobileCheck.cleaned)) {
                setFieldError('cStallMobile', 'This mobile number has already been registered');
                isValid = false;
            }

            if (csEmail && !isValidEmail(csEmail)) {
                setFieldError('cStallEmail', 'Please enter a valid email address with @');
                isValid = false;
            }

            if (!csCity) {
                setFieldError('cStallCity', 'City is required');
                isValid = false;
            }

            if (!isValid) return;

            submittedMobiles.add(mobileCheck.cleaned);
            cStallFeedback.className = 'form-feedback success';
            cStallFeedback.innerHTML = `Thank you, <strong>${csName}</strong>! Your Stall Booking enquiry has been received successfully.`;
            cStallForm.reset();

            setTimeout(() => {
                cStallFeedback.innerHTML = '';
                cStallFeedback.className = 'form-feedback';
            }, 5000);
        });
    }

    // 4. Inline Contact Visitor Form Submit
    const cVisitorFeedback = document.getElementById('cVisitorFeedback');
    if (cVisitorForm) {
        cVisitorForm.addEventListener('submit', (e) => {
            e.preventDefault();
            clearAllFormErrors(cVisitorForm);

            const cvProfile = document.getElementById('cVisitorProfile').value;
            const cvName    = document.getElementById('cVisitorName').value.trim();
            const cvMobile  = document.getElementById('cVisitorMobile').value.trim();
            const cvEmail   = document.getElementById('cVisitorEmail') ? document.getElementById('cVisitorEmail').value.trim() : '';
            const cvCity    = document.getElementById('cVisitorCity').value.trim();

            let isValid = true;

            if (!cvProfile) {
                setFieldError('cVisitorProfile', 'Please select a profile option');
                isValid = false;
            }

            if (!cvName) {
                setFieldError('cVisitorName', 'Full name is required');
                isValid = false;
            } else if (!isValidName(cvName)) {
                setFieldError('cVisitorName', 'Name must contain only letters and spaces');
                isValid = false;
            }

            const mobileCheck = isValidMobile(cvMobile);
            if (!cvMobile) {
                setFieldError('cVisitorMobile', 'Phone number is required');
                isValid = false;
            } else if (!mobileCheck.ok) {
                setFieldError('cVisitorMobile', mobileCheck.msg);
                isValid = false;
            } else if (isDuplicateMobile(mobileCheck.cleaned)) {
                setFieldError('cVisitorMobile', 'This phone number has already been registered');
                isValid = false;
            }

            if (cvEmail && !isValidEmail(cvEmail)) {
                setFieldError('cVisitorEmail', 'Please enter a valid email address with @');
                isValid = false;
            }

            if (!cvCity) {
                setFieldError('cVisitorCity', 'City is required');
                isValid = false;
            }

            if (!isValid) return;

            submittedMobiles.add(mobileCheck.cleaned);
            cVisitorFeedback.className = 'form-feedback success';
            cVisitorFeedback.innerHTML = `Thank you, <strong>${cvName}</strong>! Your Visitor Registration enquiry has been received successfully.`;
            cVisitorForm.reset();

            setTimeout(() => {
                cVisitorFeedback.innerHTML = '';
                cVisitorFeedback.className = 'form-feedback';
            }, 5000);
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
