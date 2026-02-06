/* script.js */
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Initial Fade In
    const body = document.body;
    body.style.opacity = '0';
    setTimeout(() => {
        body.style.transition = 'opacity 1s ease';
        body.style.opacity = '1';
    }, 100);

    // 2. Typing Animation for Roles
    const rotator = document.querySelector('.role-rotator');
    if (rotator) {
        const roles = JSON.parse(rotator.getAttribute('data-roles'));
        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 100;

        function type() {
            const currentRole = roles[roleIndex];
            
            if (isDeleting) {
                rotator.textContent = currentRole.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 50;
            } else {
                rotator.textContent = currentRole.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 100;
            }

            if (!isDeleting && charIndex === currentRole.length) {
                isDeleting = true;
                typeSpeed = 2000; // Pause at end
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                typeSpeed = 500;
            }

            setTimeout(type, typeSpeed);
        }
        type();
    }

    // 3. Reveal on Scroll (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // Animate progress bars if inside
                const bars = entry.target.querySelectorAll('.bar b');
                bars.forEach(bar => {
                    bar.style.width = bar.style.getPropertyValue('--w');
                });
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => revealOnScroll.observe(el));

    // 4. Background Canvas Particle Effect (Constellation)
    const canvas = document.getElementById('bg-flow');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resize);
        resize();

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }
            draw() {
                ctx.fillStyle = 'rgba(0, 255, 157, 0.5)';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        for (let i = 0; i < 50; i++) particles.push(new Particle());

        function animateCanvas() {
            ctx.clearRect(0, 0, width, height);
            
            particles.forEach((p, index) => {
                p.update();
                p.draw();
                
                // Draw lines between close particles
                for (let j = index + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
                    if (dist < 150) {
                        ctx.strokeStyle = `rgba(0, 255, 157, ${1 - dist/150 * 0.5})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            });
            requestAnimationFrame(animateCanvas);
        }
        animateCanvas();
    }

    // 5. Code Snippet Copy
    const copyBtn = document.getElementById('copySnippet');
    if(copyBtn) {
        copyBtn.addEventListener('click', () => {
            const code = document.getElementById('heroSnippet').innerText;
            navigator.clipboard.writeText(code).then(() => {
                const originalText = copyBtn.innerHTML;
                copyBtn.innerHTML = '<i class="bi bi-check"></i> Copied!';
                setTimeout(() => {
                    copyBtn.innerHTML = originalText;
                }, 2000);
            });
        });
    }

    // 6. Mobile Nav Toggle
    const toggleBtn = document.querySelector('.nav-toggle');
    const mobileNav = document.getElementById('mobileNav');
    
    if(toggleBtn && mobileNav) {
        toggleBtn.addEventListener('click', () => {
            const isHidden = mobileNav.hidden;
            mobileNav.hidden = !isHidden;
            toggleBtn.setAttribute('aria-expanded', isHidden);
        });
    }

    // 7. Dynamic Year
    document.getElementById('year').textContent = new Date().getFullYear();
    
    // 8. Contact Form Handling (Prevent reload)
    const form = document.getElementById('contact-form');
    if(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button');
            const originalText = btn.innerHTML;
            
            btn.innerHTML = '<i class="bi bi-hourglass-split"></i> Sending...';
            
            // Simulate sending
            setTimeout(() => {
                btn.innerHTML = '<i class="bi bi-check-circle"></i> Message Sent!';
                btn.classList.add('btn--primary'); // Ensure style stays
                form.reset();
                
                setTimeout(() => {
                    btn.innerHTML = originalText;
                }, 3000);
            }, 1500);
        });
    }

    // 9. Project Filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projects = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            projects.forEach(project => {
                const tags = project.getAttribute('data-tags');
                if (filter === 'all' || tags.includes(filter)) {
                    project.style.display = 'flex';
                    setTimeout(() => project.classList.add('reveal', 'active'), 50);
                } else {
                    project.style.display = 'none';
                    project.classList.remove('active');
                }
            });
        });
    });

    // 10. Theme Toggle (Dark/Light Mode)
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    const themeIcon = themeToggle?.querySelector('.theme-icon');
    
    // Check saved theme or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    html.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    if(themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
            
            // Update meta theme-color
            const metaTheme = document.getElementById('theme-color');
            if(metaTheme) {
                metaTheme.content = newTheme === 'dark' ? '#05080b' : '#ffffff';
            }
        });
    }
    
    function updateThemeIcon(theme) {
        if(themeIcon) {
            if(theme === 'dark') {
                themeIcon.className = 'bi bi-sun-fill theme-icon';
            } else {
                themeIcon.className = 'bi bi-moon-stars-fill theme-icon';
            }
        }
    }
});