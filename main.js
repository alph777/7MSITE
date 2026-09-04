/**
 * 7M MOTORS - Luxury Car Dealership & Custom Restoration Studio
 * Client-side Controller & Scroll-Driven Canvas Animation Sequence
 */

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------------------------
    // 1. DOM Element References
    // ----------------------------------------------------------------------
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const revealElements = document.querySelectorAll('.reveal');
    const statNumbers = document.querySelectorAll('.stat-number');

    // ----------------------------------------------------------------------
    // 2. Mobile Menu Toggle
    // ----------------------------------------------------------------------
    function toggleMobileMenu() {
        const isOpen = navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    if (hamburger) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
    });

    // ----------------------------------------------------------------------
    // Interactive Cursor Glass Spotlight & 3D Tilt Effect
    // ----------------------------------------------------------------------
    const cursorSpotlight = document.getElementById('cursor-spotlight');

    if (cursorSpotlight) {
        window.addEventListener('mousemove', (e) => {
            if (window.innerWidth > 992) {
                cursorSpotlight.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
            }
        }, { passive: true });
    }

    // 3D Glass Tilt Effect on Hover
    const glassCards = document.querySelectorAll('.service-card, .showcase-card');
    glassCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            if (window.innerWidth < 992) return;
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // ----------------------------------------------------------------------
    // 3. Navbar Sticky Glassmorphism on Scroll
    // ----------------------------------------------------------------------
    function handleScrollNavbar() {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleScrollNavbar, { passive: true });
    handleScrollNavbar();

    // ----------------------------------------------------------------------
    // 4. Scroll-Driven 194-Frame Canvas Hero Animation (2-Column No Overlap)
    // ----------------------------------------------------------------------
    const canvas = document.getElementById('hero-canvas');
    const heroContainer = document.querySelector('.hero-scroll-container');
    const progressBar = document.getElementById('hero-progress-bar');
    const heroSteps = document.querySelectorAll('.hero-step');
    const stepDots = document.querySelectorAll('.step-dot');

    const TOTAL_FRAMES = 194;
    const images = [];
    let currentFrameIndex = 0;
    let canvasCtx = null;
    let isTicking = false;

    if (canvas) {
        canvasCtx = canvas.getContext('2d');

        function getFramePath(index) {
            const frameNum = String(index + 1).padStart(3, '0');
            return `public/ezgif-frame-${frameNum}.png`;
        }

        // Draw image: Bike in right column on desktop, fully visible, non-short, zero watermark
        function drawFrame(frameIndex) {
            const img = images[frameIndex];
            if (!img || !img.complete || img.naturalWidth === 0) return;

            const cw = canvas.width;
            const ch = canvas.height;
            const iw = img.naturalWidth;
            const ih = img.naturalHeight;

            canvasCtx.clearRect(0, 0, cw, ch);

            const dpr = window.devicePixelRatio || 1;
            const isDesktop = cw > 900 * dpr;

            // Brightness & contrast pop filter
            canvasCtx.filter = 'brightness(1.18) contrast(1.10) saturate(1.12)';

            // Clean watermark removal: trim right 6% and bottom 7% corner without slicing bike top/left
            const cropX = 0;
            const cropY = 0;
            const cropW = iw * 0.94;
            const cropH = ih * 0.93;

            let fitScale, nw, nh, cx, cy;

            if (isDesktop) {
                // Reserve left 42% exclusively for the glass step widget
                const leftWidgetSpace = Math.min(520 * dpr, cw * 0.42);
                const availableW = cw - leftWidgetSpace;
                const topGap = 80 * dpr; // Clears top navbar completely
                const bottomGap = 35 * dpr;
                const availableH = ch - topGap - bottomGap;

                // Scale bike to be prominent & large in the right column (not short!)
                fitScale = Math.min(availableW / cropW, availableH / cropH) * 0.96;
                nw = cropW * fitScale;
                nh = cropH * fitScale;

                // Position bike strictly within the right column
                cx = leftWidgetSpace + (availableW - nw) / 2;
                cy = topGap + (availableH - nh) / 2;
            } else {
                // Mobile/Tablet layout: stack widget below bike
                const topGap = 75 * dpr;
                const bottomGap = 160 * dpr;
                const availableH = ch - topGap - bottomGap;
                const availableW = cw * 0.95;

                fitScale = Math.min(availableW / cropW, availableH / cropH);
                nw = cropW * fitScale;
                nh = cropH * fitScale;
                cx = (cw - nw) / 2;
                cy = topGap + (availableH - nh) / 2;
            }

            // Render 100% fully viewable, un-obscured bike frame in right column
            canvasCtx.drawImage(img, cropX, cropY, cropW, cropH, cx, cy, nw, nh);
        }

        function resizeCanvas() {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            drawFrame(currentFrameIndex);
        }

        window.addEventListener('resize', resizeCanvas, { passive: true });

        // Preload Image Sequence Strategy
        function preloadFrames() {
            for (let i = 0; i < TOTAL_FRAMES; i++) {
                const img = new Image();
                img.src = getFramePath(i);
                if (i === 0) {
                    img.onload = () => {
                        resizeCanvas();
                        drawFrame(0);
                    };
                }
                images.push(img);
            }
        }

        preloadFrames();
        window.addEventListener('load', () => {
            resizeCanvas();
            drawFrame(currentFrameIndex);
        });

        // Scroll listener calculation for canvas scrubbing & step transitions
        function updateScrollSequence() {
            if (!heroContainer) return;

            const containerRect = heroContainer.getBoundingClientRect();
            const containerHeight = heroContainer.offsetHeight;
            const windowHeight = window.innerHeight;

            const scrolled = -containerRect.top;
            const totalScrollable = containerHeight - windowHeight;
            
            let progress = scrolled / totalScrollable;
            progress = Math.max(0, Math.min(1, progress));

            // Update Progress Bar
            if (progressBar) {
                progressBar.style.width = `${(progress * 100).toFixed(1)}%`;
            }

            // Scrub Frame Index
            const targetFrame = Math.min(TOTAL_FRAMES - 1, Math.floor(progress * TOTAL_FRAMES));
            if (targetFrame !== currentFrameIndex) {
                currentFrameIndex = targetFrame;
                drawFrame(currentFrameIndex);
            }

            // Sync Text Steps & Indicators
            let activeFound = false;
            heroSteps.forEach((step, idx) => {
                const start = parseFloat(step.getAttribute('data-start'));
                const end = parseFloat(step.getAttribute('data-end'));

                if (progress >= start && progress <= end) {
                    step.classList.add('active');
                    activeFound = true;
                    if (stepDots[idx]) {
                        stepDots.forEach(dot => dot.classList.remove('active'));
                        stepDots[idx].classList.add('active');
                    }
                } else {
                    step.classList.remove('active');
                }
            });

            // Fallback for edge cases
            if (!activeFound && heroSteps.length > 0) {
                if (progress < 0.25) {
                    heroSteps[0].classList.add('active');
                    if (stepDots[0]) {
                        stepDots.forEach(dot => dot.classList.remove('active'));
                        stepDots[0].classList.add('active');
                    }
                } else if (progress > 0.75) {
                    const lastIdx = heroSteps.length - 1;
                    heroSteps[lastIdx].classList.add('active');
                    if (stepDots[lastIdx]) {
                        stepDots.forEach(dot => dot.classList.remove('active'));
                        stepDots[lastIdx].classList.add('active');
                    }
                }
            }

            isTicking = false;
        }

        window.addEventListener('scroll', () => {
            if (!isTicking) {
                requestAnimationFrame(updateScrollSequence);
                isTicking = true;
            }
        }, { passive: true });

        updateScrollSequence();
    }

    // ----------------------------------------------------------------------
    // 5. Scroll Reveal Animations (IntersectionObserver)
    // ----------------------------------------------------------------------
    const revealObserverOptions = {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.15
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealObserverOptions);

    revealElements.forEach(el => revealObserver.observe(el));

    // ----------------------------------------------------------------------
    // 6. Stat Counter Animation
    // ----------------------------------------------------------------------
    let statsAnimated = false;

    function animateStats() {
        if (statsAnimated) return;
        statsAnimated = true;

        statNumbers.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'), 10) || 0;
            const duration = 1800;
            const stepTime = 20;
            const totalSteps = duration / stepTime;
            const increment = target / totalSteps;
            let current = 0;

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    counter.textContent = target;
                    clearInterval(timer);
                } else {
                    counter.textContent = Math.floor(current);
                }
            }, stepTime);
        });
    }

    const statsSection = document.querySelector('.stats-grid');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateStats();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        statsObserver.observe(statsSection);
    }

    // ----------------------------------------------------------------------
    // 7. Active Nav Anchor Highlight on Scroll
    // ----------------------------------------------------------------------
    const sections = document.querySelectorAll('section[id], div[id="home"]');

    function highlightActiveNav() {
        const scrollPosition = window.scrollY + 120;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightActiveNav, { passive: true });

    // ----------------------------------------------------------------------
    // 8. Bike Background Parallax
    // ----------------------------------------------------------------------
    const bikeBgLayers = document.querySelectorAll('.bike-bg-layer');

    function handleBikeParallax() {
        bikeBgLayers.forEach(layer => {
            const section = layer.closest('.bike-bg-section') || layer.parentElement;
            if (!section) return;
            const rect = section.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const speedFactor = parseFloat(layer.getAttribute('data-parallax')) || 0.2;
                const offsetY = (rect.top) * speedFactor;
                layer.style.transform = `translateY(${offsetY}px)`;
            }
        });
    }

    window.addEventListener('scroll', handleBikeParallax, { passive: true });
    handleBikeParallax();

    // ----------------------------------------------------------------------
    // 9. Bike Exhaust Spark & Smoke Particle FX Canvas
    // ----------------------------------------------------------------------
    const exhaustCanvas = document.getElementById('exhaust-canvas-index') || document.getElementById('exhaust-canvas-gallery');
    if (exhaustCanvas) {
        const ctx = exhaustCanvas.getContext('2d');
        let width = exhaustCanvas.width = exhaustCanvas.parentElement.offsetWidth;
        let height = exhaustCanvas.height = exhaustCanvas.parentElement.offsetHeight;

        window.addEventListener('resize', () => {
            if (exhaustCanvas.parentElement) {
                width = exhaustCanvas.width = exhaustCanvas.parentElement.offsetWidth;
                height = exhaustCanvas.height = exhaustCanvas.parentElement.offsetHeight;
            }
        });

        const particles = Array.from({ length: 28 }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 2.5 + 1,
            color: Math.random() > 0.4 ? 'rgba(0, 229, 255, ' + (Math.random() * 0.4 + 0.2) + ')' : 'rgba(255, 255, 255, ' + (Math.random() * 0.4 + 0.2) + ')',
            vx: (Math.random() - 0.5) * 0.6,
            vy: -Math.random() * 0.8 - 0.3,
            alpha: Math.random() * 0.7 + 0.3
        }));

        function renderExhaustParticles() {
            ctx.clearRect(0, 0, width, height);
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.alpha -= 0.003;
                if (p.y < 0 || p.alpha <= 0) {
                    p.x = Math.random() * width;
                    p.y = height + 10;
                    p.alpha = Math.random() * 0.7 + 0.3;
                }
                ctx.save();
                ctx.globalAlpha = p.alpha;
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            });
            requestAnimationFrame(renderExhaustParticles);
        }
        renderExhaustParticles();
    }

    // ----------------------------------------------------------------------
    // 10. Gallery Interactive Category Filters & Lightbox Modal
    // ----------------------------------------------------------------------
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryCards = document.querySelectorAll('.gallery-card, .showcase-card');
    const lightbox = document.getElementById('gallery-lightbox');
    const lbImg = document.getElementById('lb-img');
    const lbTag = document.getElementById('lb-tag');
    const lbTitle = document.getElementById('lb-title');
    const lbDesc = document.getElementById('lb-desc');
    const lbSpec1Label = document.getElementById('lb-spec-1-lbl');
    const lbSpec1Val = document.getElementById('lb-spec-1-val');
    const lbSpec2Label = document.getElementById('lb-spec-2-lbl');
    const lbSpec2Val = document.getElementById('lb-spec-2-val');
    const lbCloseBtn = document.getElementById('lb-close');

    // Category Filtering
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            galleryCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // Lightbox Modal Trigger
    galleryCards.forEach(card => {
        card.addEventListener('click', (e) => {
            if (!lightbox) return;

            const img = card.querySelector('img');
            const title = card.querySelector('.card-title, .gallery-card-title');
            const meta = card.querySelector('.card-meta, .gallery-meta');
            const desc = card.querySelector('.card-desc, .gallery-card-desc');
            const specs = card.querySelectorAll('.card-specs strong, .gallery-specs strong');
            const specLabels = card.querySelectorAll('.card-specs span:not(:has(strong)), .gallery-specs span:not(:has(strong))');

            if (img && lbImg) lbImg.src = img.src;
            if (meta && lbTag) lbTag.textContent = meta.textContent;
            if (title && lbTitle) lbTitle.textContent = title.textContent;
            if (desc && lbDesc) lbDesc.textContent = desc.textContent;

            if (specs.length >= 1 && lbSpec1Val) lbSpec1Val.textContent = specs[0].textContent;
            if (specs.length >= 2 && lbSpec2Val) lbSpec2Val.textContent = specs[1].textContent;

            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    function closeLightbox() {
        if (lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    if (lbCloseBtn) {
        lbCloseBtn.addEventListener('click', closeLightbox);
    }

    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });

    // ----------------------------------------------------------------------
    // 11. Gallery Hero Auto-Transition Slideshow Controller
    // ----------------------------------------------------------------------
    const slideshowEl = document.getElementById('gallery-slideshow');
    if (slideshowEl) {
        const slides = slideshowEl.querySelectorAll('.slide');
        const dots = slideshowEl.querySelectorAll('.slide-dot');
        const prevBtn = document.getElementById('slide-prev');
        const nextBtn = document.getElementById('slide-next');
        const currentCounter = document.getElementById('slide-current');
        const totalCounter = document.getElementById('slide-total');
        const totalSlides = slides.length;
        let currentSlide = 0;
        let autoPlayTimer = null;
        const AUTO_PLAY_INTERVAL = 4000;

        if (totalCounter) totalCounter.textContent = String(totalSlides).padStart(2, '0');

        function goToSlide(index) {
            slides[currentSlide].classList.remove('active');
            if (dots[currentSlide]) dots[currentSlide].classList.remove('active');

            currentSlide = ((index % totalSlides) + totalSlides) % totalSlides;

            slides[currentSlide].classList.add('active');
            if (dots[currentSlide]) dots[currentSlide].classList.add('active');
            if (currentCounter) currentCounter.textContent = String(currentSlide + 1).padStart(2, '0');
        }

        function nextSlide() {
            goToSlide(currentSlide + 1);
        }

        function prevSlide() {
            goToSlide(currentSlide - 1);
        }

        function startAutoPlay() {
            stopAutoPlay();
            autoPlayTimer = setInterval(nextSlide, AUTO_PLAY_INTERVAL);
        }

        function stopAutoPlay() {
            if (autoPlayTimer) {
                clearInterval(autoPlayTimer);
                autoPlayTimer = null;
            }
        }

        // Navigation button events
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                prevSlide();
                startAutoPlay();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                startAutoPlay();
            });
        }

        // Dot indicator click events
        dots.forEach((dot, idx) => {
            dot.addEventListener('click', () => {
                goToSlide(idx);
                startAutoPlay();
            });
        });

        // Pause on hover, resume on leave
        slideshowEl.addEventListener('mouseenter', stopAutoPlay);
        slideshowEl.addEventListener('mouseleave', startAutoPlay);

        // Keyboard navigation for slideshow
        document.addEventListener('keydown', (e) => {
            const rect = slideshowEl.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            if (!isVisible) return;

            if (e.key === 'ArrowLeft') {
                prevSlide();
                startAutoPlay();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
                startAutoPlay();
            }
        });

        // Start auto-play
        startAutoPlay();
    }
});
