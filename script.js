document.addEventListener('DOMContentLoaded', () => {
    // --- CUSTOM CURSOR ---
    const cursor = document.querySelector('.custom-cursor');
    const links = document.querySelectorAll('a, button, .project-card, input, textarea');

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
        });
        link.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
        });
    });

    // --- STICKY NAVBAR & ACTIVE LINKS ---
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        // Sticky logic
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active link highlighting
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 150) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    });

    // --- SCROLL REVEAL ANIMATION ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply reveal to elements
    const revealElements = document.querySelectorAll('.hero-content > *, .section-title, .about-grid > *, .project-card, .contact-content > *');

    // Add initial classes for animation
    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s cubic-bezier(0.165, 0.84, 0.44, 1)';
        revealObserver.observe(el);
    });

    // Handle the .revealed state in JS style or append a class
    document.addEventListener('scroll', () => {
        revealElements.forEach(el => {
            if (el.classList.contains('revealed')) {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }
        });
    });

    // --- CONTACT FORM HANDLING ---
    const contactForm = document.querySelector('.contact-form');
    const successModal = document.getElementById('successModal');
    const closeModalElements = document.querySelectorAll('.close-modal, #closeModalBtn');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button');
            const originalText = submitBtn.innerHTML;

            // Start loading state
            submitBtn.innerHTML = 'Sending... <i class="fa-solid fa-spinner fa-spin"></i>';
            submitBtn.disabled = true;
            contactForm.classList.add('form-submitting');

            try {
                const formData = new FormData(contactForm);
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    // Success
                    successModal.classList.add('active');
                    contactForm.reset();
                } else {
                    // Error response
                    const data = await response.json();
                    alert(data.errors ? data.errors.map(error => error.message).join(", ") : "Oops! There was a problem submitting your form");
                }
            } catch (error) {
                // Network error
                alert("Oops! There was a problem submitting your form. Please check your connection.");
            } finally {
                // Restore button state
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                contactForm.classList.remove('form-submitting');
            }
        });
    }

    // Modal close logic
    closeModalElements.forEach(el => {
        el.addEventListener('click', () => {
            successModal.classList.remove('active');
        });
    });

    // Close modal on outside click
    window.addEventListener('click', (e) => {
        if (e.target === successModal) {
            successModal.classList.remove('active');
        }
    });

    // --- MOBILE MENU TOGGLE ---
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.querySelector('.nav-links');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    // Close mobile menu on link click
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // --- PARALLAX EFFECT FOR BACKGROUND BLURS ---
    window.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;

        document.querySelector('.blur-1').style.transform = `translate(${x * 50}px, ${y * 50}px)`;
        document.querySelector('.blur-2').style.transform = `translate(${x * -50}px, ${y * -50}px)`;
    });
});
