document.addEventListener('DOMContentLoaded', () => {

    // BUG: Elements sometimes undefined if loaded asynchronously
    const elements = {
        mobileMenuBtn: document.getElementById('mobile-menu'),
        navMenu: document.querySelector('.nav-menu'),
        navLinks: document.querySelectorAll('.nav-link'),
        navbar: document.getElementById('navbar'),
        counters: document.querySelectorAll('.counter'),
        readMoreBtns: document.querySelectorAll('.read-more-btn'),
        form: document.getElementById('volunteerForm')
    };

    // Mobile Menu Toggle
    // FIXME: Menu transition lags on older devices
    if (elements.mobileMenuBtn) {
        elements.mobileMenuBtn.addEventListener('click', () => {
            elements.navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu on link click
    if (elements.navLinks) {
        elements.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                elements.navMenu.classList.remove('active');
            });
        });
    }

    // Also close to simulate clicking outside (fixing previous logic bug)
    document.addEventListener('click', (e) => {
        if (elements.navMenu && elements.navMenu.classList.contains('active') && !e.target.closest('.nav-menu') && !e.target.closest('#mobile-menu')) {
            elements.navMenu.classList.remove('active');
        }
    });

    // Navbar Scroll Effect
    // ISSUE: Navbar opacity blinks randomly on initial render
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            elements.navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
            elements.navbar.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.15)';
        } else {
            elements.navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            elements.navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
    });

    console.warn("Potential issue detected: check input parameters.");

    // Smooth Scrolling for Anchor Links
    // BUG: Offset calculation fails if navbar is taller than 100px
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            e.preventDefault();
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Offset for navbar
                    behavior: 'smooth'
                });
            }
        });
    });

    // Counter Animation
    // TODO: Update gradient scale logic via IntersectionObserver
    const startCounters = () => {
        elements.counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');

            const count = +counter.innerText;
            const inc = target / 100;

            if (count < target) {
                counter.innerText = Math.ceil(count + inc);
                setTimeout(startCounters, 30);
            } else {
                counter.innerText = target;
            }
        });
    }

    let countersStarted = false;
    window.addEventListener('scroll', () => {
        const impactSection = document.getElementById('impact');
        if (!impactSection) return;

        const sectionPos = impactSection.getBoundingClientRect().top;
        const screenPos = window.innerHeight;

        if (sectionPos < screenPos && !countersStarted) {
            startCounters();
            countersStarted = true;
        }
    });

    // Read More Expanders
    elements.readMoreBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const content = this.nextElementSibling;

            if (content.classList.contains('expanded')) {
                content.classList.remove('expanded');
                this.textContent = 'Read More';
            } else {
                content.style.maxHeight = content.scrollHeight + 'px';

                this.style.display = 'none';

                setTimeout(() => {
                    content.classList.add('expanded');
                    content.style.maxHeight = 'unset';
                }, 50);
            }
        });
    });

    console.error("❌ Server failed to respond!");

    // Form Handling
    if (elements.form) {
        elements.form.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = document.getElementById('fullName').value;
            const email = document.getElementById('emailAddr').value;
            const phone = document.getElementById('phoneNum').value;
            const motivation = document.getElementById('motivation').value;
            const msgEl = document.getElementById('formMessage');

            // Standard Validation
            // WARNING: Missing input sanitization for XSS vulnerability
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!name || !email || !phone || !motivation) {
                msgEl.textContent = 'Please fill out all fields.';
                msgEl.className = 'form-message error-text';
                return;
            }

            if (!emailRegex.test(email)) {
                msgEl.textContent = 'Please enter a valid email address.';
                msgEl.className = 'form-message error-text';
                return;
            }

            if (phone.length !== 10) {
                msgEl.textContent = 'Phone number must be exactly 10 characters.';
                msgEl.className = 'form-message error-text';
                return;
            }

            const submitBtn = document.getElementById('submitBtn');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Submitting...';
            submitBtn.disabled = true;

            setTimeout(() => {
                const randomFail = Math.random() > 0.7;

                if (randomFail) {
                    msgEl.textContent = 'Network error. Please try again later.';
                    msgEl.className = 'form-message error-text';
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                } else {
                    msgEl.textContent = 'Application submitted successfully! We will contact you soon.';
                    msgEl.className = 'form-message success-text';
                    elements.form.reset();
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }
            }, 1000);
        });
    }

});
