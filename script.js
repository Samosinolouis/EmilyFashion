/**
 * Emily's Fashion Collections
 * Main JavaScript file for website functionality
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize core functionality
    initializeTooltips();
    setupLightbox();
    setupNavbarScroll();
    setupResponsiveNav();
    initScrollAnimations();
    setupLazyLoading();
    
    // Initialize EmailJS if the library exists
    if (typeof emailjs !== 'undefined') {
        initEmailJS();
        setupNewsletterForm();
    }
    
    // Page-specific functionality
    if (document.querySelector('form')) {
        setupFormValidation();
    }
    
    if (document.querySelector('.product-card')) {
        setupProductFiltering();
    }
    
    if (document.getElementById('countdown')) {
        setupCountdownTimer();
    }
    
    if (document.querySelector('img[usemap]')) {
        setupResponsiveImageMap();
    }
    
    // Setup back to top button for all pages
    setupBackToTop();
    
    // Handle reveal animations
    setupRevealAnimations();
    
    // Add navbar active state handling
    setupActiveNavLinks();
});


/**
 * Initialize Bootstrap tooltips
 */
function initializeTooltips() {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    if (tooltipTriggerList.length) {
        tooltipTriggerList.forEach(tooltipTriggerEl => {
            new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }
}

/**
 * Setup lightbox functionality for product images
 */
function setupLightbox() {
    const lightboxModal = document.getElementById('lightboxModal');
    
    if (lightboxModal) {
        const lightboxImage = document.getElementById('lightboxImage');
        
        lightboxModal.addEventListener('show.bs.modal', function(event) {
            const triggerImage = event.relatedTarget;
            const imgSrc = triggerImage.getAttribute('data-bs-image');
            lightboxImage.src = imgSrc;
            lightboxImage.alt = triggerImage.alt || 'Product Image';
        });
    }
}

/**
 * Form validation helper functions
 */
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function highlightInvalidField(field, message) {
    field.classList.add('is-invalid');
    
    let errorDiv = field.nextElementSibling;
    if (!errorDiv || !errorDiv.classList.contains('invalid-feedback')) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'invalid-feedback';
        field.after(errorDiv);
    }
    
    errorDiv.textContent = message;
}

function resetField(field) {
    field.classList.remove('is-invalid');
    field.classList.add('is-valid');
}

function showFormSuccess(form) {
    const successAlert = document.createElement('div');
    successAlert.className = 'alert alert-success mt-3';
    successAlert.innerHTML = '<strong>Thank you!</strong> Your message has been sent successfully.';
    
    form.after(successAlert);
    form.reset();
    
    form.querySelectorAll('.is-valid').forEach(el => {
        el.classList.remove('is-valid');
    });
    
    setTimeout(() => successAlert.remove(), 5000);
}

/**
 * Setup contact form validation and submission
 */
function setupFormValidation() {
    const contactForm = document.querySelector('form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const nameField = document.getElementById('name');
            const emailField = document.getElementById('email');
            const messageField = document.getElementById('message');
            
            if (!nameField || !emailField || !messageField) return;
            
            let isValid = true;
            
            if (!nameField.value.trim()) {
                highlightInvalidField(nameField, 'Please enter your name');
                isValid = false;
            } else {
                resetField(nameField);
            }
            
            if (!emailField.value.trim()) {
                highlightInvalidField(emailField, 'Please enter your email');
                isValid = false;
            } else if (!isValidEmail(emailField.value)) {
                highlightInvalidField(emailField, 'Please enter a valid email address');
                isValid = false;
            } else {
                resetField(emailField);
            }
            
            if (!messageField.value.trim()) {
                highlightInvalidField(messageField, 'Please enter your message');
                isValid = false;
            } else {
                resetField(messageField);
            }
            
            if (isValid) {
                showFormSuccess(contactForm);
            }
        });
    }
}

/**
 * Setup product filtering functionality for shop page
 */
function setupProductFiltering() {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const sortSelect = document.getElementById('sortProducts');
    
    const debounce = (fn, delay) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => fn(...args), delay);
        };
    };
    
    if (searchInput) {
        const debouncedSearch = debounce(() => filterProducts(), 300);
        searchInput.addEventListener('input', debouncedSearch);
    }
    
    if (searchButton) {
        searchButton.addEventListener('click', filterProducts);
    }
    
    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            sortProducts(sortSelect.value);
        });
    }
}

/**
 * Filter products based on search input
 */
function filterProducts() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    const searchTerm = searchInput.value.toLowerCase().trim();
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        const title = card.querySelector('.card-title').textContent.toLowerCase();
        const description = card.querySelector('.card-text')?.textContent.toLowerCase() || '';
        
        const visible = title.includes(searchTerm) || description.includes(searchTerm);
        card.closest('.col-sm-6').style.display = visible ? 'block' : 'none';
    });
}

/**
 * Sort products based on selected option
 */
function sortProducts(sortOption) {
    if (!sortOption) return;
    
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    const productItems = Array.from(productsGrid.querySelectorAll('.col-sm-6'));
    
    productItems.sort((a, b) => {
        const productA = a.querySelector('.product-card');
        const productB = b.querySelector('.product-card');
        
        if (sortOption === 'price-low') {
            const priceA = parseFloat(productA.dataset.price || 0);
            const priceB = parseFloat(productB.dataset.price || 0);
            return priceA - priceB;
        } else if (sortOption === 'price-high') {
            const priceA = parseFloat(productA.dataset.price || 0);
            const priceB = parseFloat(productB.dataset.price || 0);
            return priceB - priceA;
        } else if (sortOption === 'name') {
            const nameA = productA.querySelector('.card-title').textContent;
            const nameB = productB.querySelector('.card-title').textContent;
            return nameA.localeCompare(nameB);
        }
        
        // Default - original order
        return 0;
    });
    
    // Clear and re-append in new order
    productItems.forEach(item => productsGrid.appendChild(item));
}

/**
 * Setup back to top button
 */
function setupBackToTop() {
    if (!document.getElementById('backToTop')) {
        const backToTop = document.createElement('button');
        backToTop.id = 'backToTop';
        backToTop.className = 'btn btn-purple position-fixed';
        backToTop.innerHTML = '&uarr;';
        backToTop.style.cssText = `
            bottom: 20px;
            right: 20px;
            display: none;
            z-index: 1000;
            opacity: 0.8;
            background-color: var(--purple-primary);
            color: white;
            border-radius: 50%;
            width: 40px;
            height: 40px;
        `;
        
        document.body.appendChild(backToTop);
        
        window.addEventListener('scroll', function() {
            backToTop.style.display = window.pageYOffset > 300 ? 'block' : 'none';
        });
        
        backToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

/**
 * Setup scroll animations and reveals
 */
function setupRevealAnimations() {
    document.querySelectorAll('.footer-links').forEach(list => {
        list.querySelectorAll('li').forEach((item, index) => {
            item.style.setProperty('--item-index', index);
        });
    });
}

/**
 * Initialize scroll animations for elements with 'reveal' class
 */
function initScrollAnimations() {
    const revealOnScroll = () => {
        const reveals = document.querySelectorAll('.reveal');
        
        reveals.forEach(element => {
            const windowHeight = window.innerHeight;
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('active');
            }
        });
    };
    
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Initial check for elements already in view
}

/**
 * Setup countdown timer for promotions
 */
function setupCountdownTimer() {
    const countdownElement = document.getElementById('countdown');
    
    if (countdownElement) {
        // Set the target date (3 days from now)
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 3);
        
        const updateCountdown = () => {
            const now = new Date().getTime();
            const distance = targetDate.getTime() - now;
            
            if (distance < 0) {
                clearInterval(countdownInterval);
                countdownElement.innerHTML = '<div class="countdown-expired">Promotion has ended</div>';
                return;
            }
            
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            countdownElement.innerHTML = `
                <div class="countdown-item">
                    <span class="countdown-value">${days}</span>
                    <span class="countdown-label">Days</span>
                </div>
                <div class="countdown-item">
                    <span class="countdown-value">${hours}</span>
                    <span class="countdown-label">Hours</span>
                </div>
                <div class="countdown-item">
                    <span class="countdown-value">${minutes}</span>
                    <span class="countdown-label">Mins</span>
                </div>
                <div class="countdown-item">
                    <span class="countdown-value">${seconds}</span>
                    <span class="countdown-label">Secs</span>
                </div>
            `;
        };
        
        const countdownInterval = setInterval(updateCountdown, 1000);
        updateCountdown(); // Initial call
    }
}

/**
 * Setup responsive behavior for navigation
 */
function setupResponsiveNav() {
    document.addEventListener('click', function(e) {
        const navbarCollapse = document.querySelector('.navbar-collapse');
        const navbarToggler = document.querySelector('.navbar-toggler');
        
        if (navbarCollapse && navbarCollapse.classList.contains('show') && 
            !navbarCollapse.contains(e.target) && e.target !== navbarToggler) {
            // Check if Bootstrap is available before using its API
            if (typeof bootstrap !== 'undefined') {
                bootstrap.Collapse.getInstance(navbarCollapse).hide();
            } else {
                navbarCollapse.classList.remove('show');
            }
        }
    });
    
    // Close dropdown when clicking a link on mobile
    document.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', function() {
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (window.innerWidth < 992 && navbarCollapse?.classList.contains('show') && 
                typeof bootstrap !== 'undefined') {
                bootstrap.Collapse.getInstance(navbarCollapse).hide();
            }
        });
    });
}

/**
 * Enhance image map responsiveness
 */
function setupResponsiveImageMap() {
    const map = document.querySelector('map');
    if (!map) return;
  
    const updateMapCoordinates = () => {
        const img = document.querySelector('img[usemap]');
        if (!img) return;
      
        const originalWidth = img.naturalWidth;
        const displayedWidth = img.clientWidth;
        const areas = map.querySelectorAll('area');
      
        areas.forEach(area => {
            let coords = area.getAttribute('data-original-coords');
          
            if (!coords) {
                coords = area.getAttribute('coords');
                area.setAttribute('data-original-coords', coords);
            }
          
            const scale = displayedWidth / originalWidth;
            const newCoords = coords.split(',')
                .map(coord => Math.round(Number(coord) * scale))
                .join(',');
          
            area.setAttribute('coords', newCoords);
        });
    };
  
    window.addEventListener('resize', updateMapCoordinates);
    updateMapCoordinates(); // Initial calculation
}

/**
 * Setup lazy loading for images
 */
function setupLazyLoading() {
    if ('loading' in HTMLImageElement.prototype) {
        // Browser supports native lazy loading
        document.querySelectorAll('img:not([loading])').forEach(img => {
            img.setAttribute('loading', 'lazy');
        });
    } else {
        // Fallback to Intersection Observer
        const config = {
            rootMargin: '50px 0px',
            threshold: 0.01
        };
    
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
                
                    if (src) {
                        img.src = src;
                        img.removeAttribute('data-src');
                    }
                
                    observer.unobserve(img);
                }
            });
        }, config);
    
        document.querySelectorAll('img[data-src]').forEach(img => {
            observer.observe(img);
        });
    }
}

/**
 * Initialize EmailJS
 */
function initEmailJS() {
    if (typeof emailjs !== 'undefined') {
        emailjs.init("PnyewYYFW5Qupe5cw");
    }
}

/**
 * Setup newsletter subscription via EmailJS
 */
function setupNewsletterForm() {
    const newsletterForm = document.getElementById('newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const emailField = document.getElementById('newsletter-email');
            const submitBtn = document.getElementById('newsletter-submit');
            const buttonText = document.getElementById('button-text');
            const buttonLoading = document.getElementById('button-loading');
            const successMsg = document.getElementById('newsletter-success');
            const errorMsg = document.getElementById('newsletter-error');
            
            successMsg.classList.add('d-none');
            errorMsg.classList.add('d-none');
            
            if (!isValidEmail(emailField.value)) {
                highlightInvalidField(emailField, 'Please enter a valid email address');
                return;
            }
            
            buttonText.classList.add('d-none');
            buttonLoading.classList.remove('d-none');
            submitBtn.disabled = true;
            
            const templateParams = {
                email: emailField.value,
                subscription_date: new Date().toLocaleString()
            };
            
            emailjs.send('service_wdfqtnh', 'template_newsletter', templateParams)
                .then(() => {
                    successMsg.classList.remove('d-none');
                    newsletterForm.reset();
                    emailField.classList.remove('is-invalid');
                })
                .catch(error => {
                    console.error('EmailJS error:', error);
                    errorMsg.classList.remove('d-none');
                })
                .finally(() => {
                    buttonText.classList.remove('d-none');
                    buttonLoading.classList.add('d-none');
                    submitBtn.disabled = false;
                });
        });
    }
}

/**
 * Setup navbar scroll effects
 */
function setupNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    
    if (navbar) {
        const toggleScrolledClass = () => {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        };
        
        window.addEventListener('scroll', toggleScrolledClass);
        toggleScrolledClass(); // Check initial scroll position
    }
}

/**
 * Setup active state for navbar links based on current page
 */
function setupActiveNavLinks() {
    console.log("Setting up active nav links");
    
    // Get current page path and filename
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop() || 'index.html';
    
    console.log("Current page detected:", currentPage);
    
    // Get all nav links
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    // First remove any existing active classes
    navLinks.forEach(link => link.classList.remove('active'));
    
    // Find the exact match first
    let exactMatch = false;
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        console.log("Checking link:", linkHref);
        
        // Direct page name check - most reliable method
        if (linkHref === currentPage) {
            console.log("Exact match found for:", linkHref);
            link.classList.add('active');
            exactMatch = true;
            return;
        }
        
        // Handle index/home page variations
        const isHomePage = currentPage === '' || currentPage === 'index.html' || currentPage === 'main.html';
        const isHomeLink = linkHref === 'index.html' || linkHref === 'main.html' || linkHref === './';
        
        if (isHomePage && isHomeLink) {
            console.log("Home page match found");
            link.classList.add('active');
            exactMatch = true;
        }
    });
    
    // If no exact match was found, try to match by URL containing the href
    if (!exactMatch) {
        console.log("No exact match found, trying URL includes method");
        
        // Check for page names without looking at full path
        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            // Skip dropdown toggles
            if (linkHref === '#' || !linkHref) return;
            
            const linkPage = linkHref.split('/').pop();
            if (linkPage === currentPage) {
                console.log("Found match by filename:", linkPage);
                link.classList.add('active');
                exactMatch = true;
            }
        });
        
        // Handle dropdown items
        if (!exactMatch) {
            const dropdownItems = document.querySelectorAll('.dropdown-item');
            dropdownItems.forEach(item => {
                const itemHref = item.getAttribute('href');
                if (itemHref && (currentPath.includes(itemHref) || window.location.href.includes(itemHref))) {
                    console.log("Found match in dropdown:", itemHref);
                    const parentDropdown = item.closest('.dropdown')?.querySelector('.nav-link');
                    if (parentDropdown) {
                        parentDropdown.classList.add('active');
                    }
                }
            });
        }
    }
}

// Make sure the function runs when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded, running setupActiveNavLinks");
    setupActiveNavLinks();
});