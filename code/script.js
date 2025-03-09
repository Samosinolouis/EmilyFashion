/**
 * Emily's Fashion Collections
 * Main JavaScript file for website functionality
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all tooltips
    initializeTooltips();

    // Setup lightbox functionality
    setupLightbox();

    // Setup contact form validation
    setupFormValidation();

    // Initialize product filtering (for shop page)
    setupProductFiltering();
    
    // Setup back to top button
    setupBackToTop();
    
    // Theme toggle removed
    
    // NEW: Initialize scroll animations
    initScrollAnimations();
    
    // NEW: Setup countdown timer
    setupCountdownTimer();
    
    // NEW: Setup responsive navigation
    setupResponsiveNav();
    
    // NEW: Setup responsive image map
    setupResponsiveImageMap();
    
    // NEW: Add lazy loading for images
    setupLazyLoading();
    
    // Initialize EmailJS
    initEmailJS();
    
    // Setup newsletter form
    setupNewsletterForm();
    
    // Animation observer
    // Set item indexes for staggered animations on lists
    document.querySelectorAll('.footer-links').forEach(list => {
      list.querySelectorAll('li').forEach((item, index) => {
        item.style.setProperty('--item-index', index);
      });
    });
    
    // Observer for reveal animations
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          revealObserver.unobserve(entry.target); // Only animate once
        }
      });
    }, {
      threshold: 0.1, // Trigger when 10% of the element is visible
      rootMargin: '0px 0px -50px 0px' // Adjust when animation triggers
    });
  
    // Observe all elements with reveal class
    document.querySelectorAll('.reveal, .reveal-list').forEach(item => {
      revealObserver.observe(item);
    });
});

/**
 * Initialize Bootstrap tooltips
 */
function initializeTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

/**
 * Setup lightbox functionality for product images
 */
function setupLightbox() {
    // Check if we're on the shop page
    const lightboxModal = document.getElementById('lightboxModal');
    
    if (lightboxModal) {
        const lightboxImage = document.getElementById('lightboxImage');
        
        // Handle modal show event
        lightboxModal.addEventListener('show.bs.modal', function(event) {
            const triggerImage = event.relatedTarget;
            const imgSrc = triggerImage.getAttribute('data-bs-image');
            // Make sure we use the updated image path
            lightboxImage.src = imgSrc;
            
            // Add alt text from the original image
            lightboxImage.alt = triggerImage.alt || 'Product Image';
        });
        
        // Add keyboard navigation for lightbox
        document.addEventListener('keydown', function(e) {
            if (!lightboxModal.classList.contains('show')) return;
            
            if (e.key === 'Escape') {
                bootstrap.Modal.getInstance(lightboxModal).hide();
            }
        });
    }
}

/**
 * Setup contact form validation and submission
 */
function setupFormValidation() {
    const contactForm = document.querySelector('form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Get form fields
            const nameField = document.getElementById('name');
            const emailField = document.getElementById('email');
            const messageField = document.getElementById('message');
            
            // Basic validation
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
            
            // If valid, show success message
            if (isValid) {
                // In a real application, you would send the form data to a server
                showFormSuccess(contactForm);
            }
        });
    }
}

/**
 * Helper function to highlight invalid form fields
 */
function highlightInvalidField(field, message) {
    field.classList.add('is-invalid');
    
    // Check if error message already exists
    let errorDiv = field.nextElementSibling;
    if (!errorDiv || !errorDiv.classList.contains('invalid-feedback')) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'invalid-feedback';
        field.after(errorDiv);
    }
    
    errorDiv.textContent = message;
}

/**
 * Helper function to reset field validation state
 */
function resetField(field) {
    field.classList.remove('is-invalid');
    field.classList.add('is-valid');
}

/**
 * Helper function to validate email format
 */
function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

/**
 * Display success message after form submission
 */
function showFormSuccess(form) {
    // Create success alert
    const successAlert = document.createElement('div');
    successAlert.className = 'alert alert-success mt-3';
    successAlert.innerHTML = '<strong>Thank you!</strong> Your message has been sent successfully.';
    
    // Insert after form
    form.after(successAlert);
    
    // Reset form
    form.reset();
    
    // Remove any validation styling
    form.querySelectorAll('.is-valid').forEach(el => {
        el.classList.remove('is-valid');
    });
    
    // Remove success message after 5 seconds
    setTimeout(() => {
        successAlert.remove();
    }, 5000);
}

/**
 * Setup product filtering functionality for shop page
 */
function setupProductFiltering() {
    const shopPage = document.querySelector('.product-card');
    
    if (shopPage) {
        // Check if filter controls exist, create them if not
        let filterContainer = document.querySelector('.filter-container');
        
        if (!filterContainer) {
            // Create filter UI in shop page
            const productSection = document.querySelector('.container.py-5');
            
            if (productSection) {
                filterContainer = document.createElement('div');
                filterContainer.className = 'filter-container mb-4';
                filterContainer.innerHTML = `
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <div class="input-group">
                                <input type="text" class="form-control" id="searchInput" placeholder="Search products...">
                                <button class="btn btn-outline-secondary" type="button" id="searchButton">
                                    Search
                                </button>
                            </div>
                        </div>
                        <div class="col-md-6 mb-3">
                            <div class="d-flex justify-content-md-end">
                                <select class="form-select" id="sortProducts" style="max-width: 200px;">
                                    <option value="default">Sort by</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                    <option value="name">Name: A to Z</option>
                                </select>
                            </div>
                        </div>
                    </div>
                `;
                
                // Insert after h1 element
                const heading = productSection.querySelector('h1');
                if (heading) {
                    heading.after(filterContainer);
                    
                    // Add event listeners for filtering
                    setupFilterListeners();
                }
            }
        }
    }
}

/**
 * Setup event listeners for product filtering
 */
function setupFilterListeners() {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const sortSelect = document.getElementById('sortProducts');
    
    if (searchButton && searchInput) {
        searchButton.addEventListener('click', filterProducts);
        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                filterProducts();
            }
        });
    }
    
    if (sortSelect) {
        sortSelect.addEventListener('change', sortProducts);
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
        
        if (title.includes(searchTerm) || description.includes(searchTerm)) {
            card.closest('.col-sm-6').style.display = 'block';
        } else {
            card.closest('.col-sm-6').style.display = 'none';
        }
    });
}

/**
 * Sort products based on selected option
 */
function sortProducts() {
    const sortSelect = document.getElementById('sortProducts');
    
    if (!sortSelect) return;
    
    const sortValue = sortSelect.value;
    const productsContainer = document.querySelector('.row.g-4');
    
    if (!productsContainer) return;
    
    const productItems = Array.from(productsContainer.querySelectorAll('.col-sm-6'));
    
    productItems.sort((a, b) => {
        const aTitle = a.querySelector('.card-title').textContent;
        const bTitle = b.querySelector('.card-title').textContent;
        
        const aPrice = parseFloat(a.querySelector('.card-text').textContent.replace('₱', '').replace(',', ''));
        const bPrice = parseFloat(b.querySelector('.card-text').textContent.replace('₱', '').replace(',', ''));
        
        switch(sortValue) {
            case 'price-low':
                return aPrice - bPrice;
            case 'price-high':
                return bPrice - aPrice;
            case 'name':
                return aTitle.localeCompare(bTitle);
            default:
                return 0;
        }
    });
    
    // Clear container and append sorted items
    productItems.forEach(item => {
        productsContainer.appendChild(item);
    });
}

/**
 * Setup back to top button
 */
function setupBackToTop() {
    // Create back to top button if it doesn't exist
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
            background-color: var(--purple-color);
            color: white;
            border-radius: 50%;
            width: 40px;
            height: 40px;
        `;
        
        document.body.appendChild(backToTop);
        
        // Show/hide back to top button based on scroll position
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTop.style.display = 'block';
            } else {
                backToTop.style.display = 'none';
            }
        });
        
        // Scroll to top when clicked
        backToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

/**
 * Initialize scroll animations for elements with 'reveal' class
 */
function initScrollAnimations() {
    window.addEventListener('scroll', revealOnScroll);
    
    // Initial check in case elements are already in view
    revealOnScroll();
    
    function revealOnScroll() {
        const reveals = document.querySelectorAll('.reveal');
        
        for (let i = 0; i < reveals.length; i++) {
            const windowHeight = window.innerHeight;
            const elementTop = reveals[i].getBoundingClientRect().top;
            const elementVisible = 150; // how many pixels before element is revealed
            
            if (elementTop < windowHeight - elementVisible) {
                reveals[i].classList.add('active');
            }
        }
    }
}

/**
 * Setup countdown timer for promotions
 */
function setupCountdownTimer() {
    const countdownElement = document.getElementById('countdown');
    
    if (countdownElement) {
        // Set the target date (adjust as needed)
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 3); // 3 days from now
        
        // Update countdown every second
        const countdownInterval = setInterval(updateCountdown, 1000);
        
        function updateCountdown() {
            const now = new Date().getTime();
            const distance = targetDate.getTime() - now;
            
            if (distance < 0) {
                clearInterval(countdownInterval);
                countdownElement.innerHTML = '<div class="countdown-expired">Promotion has ended</div>';
                return;
            }
            
            // Time calculations
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            // Update the countdown HTML
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
        }
        
        // Initial call
        updateCountdown();
    }
}

/**
 * Setup responsive behavior for navigation
 */
function setupResponsiveNav() {
  // Close menu when clicking outside on mobile
  document.addEventListener('click', function(e) {
    const navbarCollapse = document.querySelector('.navbar-collapse');
    const navbarToggler = document.querySelector('.navbar-toggler');
    
    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
      // If clicked element is not inside the navbar
      if (!navbarCollapse.contains(e.target) && e.target !== navbarToggler) {
        bootstrap.Collapse.getInstance(navbarCollapse).hide();
      }
    }
  });
  
  // Close dropdown when clicking a link on mobile
  const dropdownItems = document.querySelectorAll('.dropdown-item');
  dropdownItems.forEach(item => {
    item.addEventListener('click', function() {
      const navbarCollapse = document.querySelector('.navbar-collapse');
      if (window.innerWidth < 992 && navbarCollapse.classList.contains('show')) {
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
  if (map) {
    window.addEventListener('resize', function() {
      const img = document.querySelector('img[usemap]');
      if (img) {
        // Recalculate image map coordinates on window resize
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
          const newCoords = coords.split(',').map(coord => Math.round(Number(coord) * scale)).join(',');
          
          area.setAttribute('coords', newCoords);
        });
      }
    });
    
    // Initial calculation
    window.dispatchEvent(new Event('resize'));
  }
}

/**
 * Setup lazy loading for images
 */
function setupLazyLoading() {
  if ('loading' in HTMLImageElement.prototype) {
    // Browser supports native lazy loading
    const images = document.querySelectorAll('img:not([loading])');
    images.forEach(img => {
      img.setAttribute('loading', 'lazy');
    });
  } else {
    // Fallback to Intersection Observer
    const config = {
      rootMargin: '50px 0px',
      threshold: 0.01
    };
    
    let observer = new IntersectionObserver((entries) => {
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
    
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => {
      observer.observe(img);
    });
  }
}

/**
 * Initialize EmailJS
 */
function initEmailJS() {
    // Replace with your EmailJS user ID (you'll get this when you sign up)
    emailjs.init("PnyewYYFW5Qupe5cw");
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
            
            // Reset previous messages
            successMsg.classList.add('d-none');
            errorMsg.classList.add('d-none');
            
            // Validate email
            if (!isValidEmail(emailField.value)) {
                highlightInvalidField(emailField, 'Please enter a valid email address');
                return;
            }
            
            // Show loading state
            buttonText.classList.add('d-none');
            buttonLoading.classList.remove('d-none');
            submitBtn.disabled = true;
            
            // Prepare template parameters
            const templateParams = {
                email: emailField.value,
                subscription_date: new Date().toLocaleString()
            };
            
            // Send email using EmailJS
            emailjs.send('service_wdfqtnh', 'template_newsletter', templateParams)
                .then(function() {
                    // Success
                    successMsg.classList.remove('d-none');
                    newsletterForm.reset();
                    emailField.classList.remove('is-invalid');
                })
                .catch(function(error) {
                    // Error
                    console.error('EmailJS error:', error);
                    errorMsg.classList.remove('d-none');
                })
                .finally(function() {
                    // Reset button state
                    buttonText.classList.remove('d-none');
                    buttonLoading.classList.add('d-none');
                    submitBtn.disabled = false;
                });
        });
    }
}