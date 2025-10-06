// Quiz data storage
let quizData = {
    role: '',
    dependents: '',
    income: '',
    health: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    state: '',
    email: '',
    phone: ''
};

let currentPage = 1;
const totalPages = 7;

// Initialize the quiz
document.addEventListener('DOMContentLoaded', function() {
    updateProgressBar();
    setupEventListeners();
    
    // Track page view
    trackPageView();
    
    // Track time on page
    trackTimeOnPage();
});

// Setup event listeners
function setupEventListeners() {
    // Form validation for contact page
    const formInputs = document.querySelectorAll('#page6 input');
    formInputs.forEach(input => {
        input.addEventListener('input', validateContactForm);
    });
}

// Navigation functions
function nextPage() {
    if (currentPage < totalPages) {
        hidePage(currentPage);
        currentPage++;
        showPage(currentPage);
        updateProgressBar();
        
        // Track quiz progress
        trackQuizProgress(currentPage);
        
        // Auto-scroll to top of the page
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function previousPage() {
    if (currentPage > 1) {
        hidePage(currentPage);
        currentPage--;
        showPage(currentPage);
        updateProgressBar();
        // Auto-scroll to top of the page
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Page visibility functions
function showPage(pageNumber) {
    const page = document.getElementById(`page${pageNumber}`);
    if (page) {
        page.classList.add('active');
    }
}

function hidePage(pageNumber) {
    const page = document.getElementById(`page${pageNumber}`);
    if (page) {
        page.classList.remove('active');
    }
}

// Progress bar
function updateProgressBar() {
    const progressBar = document.getElementById('progressBar');
    const progress = (currentPage / totalPages) * 100;
    progressBar.style.width = progress + '%';
}

// Option selection
function selectOption(field, value) {
    quizData[field] = value;
    
    // Remove selected class from all options in current page
    const currentPageElement = document.getElementById(`page${currentPage}`);
    const options = currentPageElement.querySelectorAll('.option-card, .option-simple');
    options.forEach(option => option.classList.remove('selected'));
    
    // Add selected class to clicked option
    event.currentTarget.classList.add('selected');
    
    // Auto-advance to next page after a short delay
    setTimeout(() => {
        if (currentPage < 6) { // Don't auto-advance from the contact form page
            nextPage();
        }
    }, 500); // 500ms delay to show the selection
}

// Validation functions
function validateCurrentPage() {
    switch(currentPage) {
        case 2:
            return quizData.role !== '';
        case 3:
            return quizData.dependents !== '';
        case 4:
            return quizData.income !== '';
        case 5:
            return quizData.health !== '';
        default:
            return true;
    }
}

function validateContactForm() {
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const dateOfBirth = document.getElementById('dateOfBirth').value;
    const state = document.getElementById('state').value;
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const consent = document.getElementById('consent').checked;
    
    const submitButton = document.getElementById('btn-submit');
    
    if (firstName && lastName && dateOfBirth && state && isValidEmail(email) && isValidPhone(phone) && consent) {
        submitButton.disabled = false;
        return true;
    } else {
        submitButton.disabled = true;
        return false;
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    // Remove all non-digit characters
    const digitsOnly = phone.replace(/\D/g, '');
    return digitsOnly.length >= 10;
}

// Form submission
function submitForm() {
    if (!validateContactForm()) {
        return;
    }
    
    // Collect form data
    quizData.firstName = document.getElementById('firstName').value.trim();
    quizData.lastName = document.getElementById('lastName').value.trim();
    quizData.dateOfBirth = document.getElementById('dateOfBirth').value;
    quizData.state = document.getElementById('state').value;
    quizData.email = document.getElementById('email').value.trim();
    quizData.phone = document.getElementById('phone').value.trim();
    
    // Update hidden fields with quiz data
    document.getElementById('militaryBranch').value = quizData.role;
    document.getElementById('dependents').value = quizData.dependents;
    document.getElementById('income').value = quizData.income;
    document.getElementById('health').value = quizData.health;
    
    // Show loading state
    const submitButton = document.getElementById('btn-submit');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<span class="loading"></span> Processing...';
    submitButton.disabled = true;
    
    // Submit form to Formspree using AJAX
    const form = document.getElementById('contactForm');
    const formData = new FormData(form);
    
    fetch('https://formspree.io/f/mpwlbpqj', {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            console.log('Form submitted successfully');
            // Google conversion tracking
            gtag('event', 'conversion', {
                'send_to': 'AW-11492282990/kAfaCLTg0KYbEO6k-ecq',
                'value': 1.0,
                'currency': 'USD'
            });
        } else {
            console.log('Form submission failed');
        }
    })
    .catch(error => {
        console.log('Error submitting form:', error);
    })
    .finally(() => {
        // Store data locally
        localStorage.setItem('quizData', JSON.stringify(quizData));
        
        // Move to thank you page
        hidePage(currentPage);
        currentPage++;
        showPage(currentPage);
        updateProgressBar();
        
        // Reset button
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
        
        // Track conversion
        trackConversion();
    });
}

// Analytics and tracking
function trackPageView() {
    // Track page view with Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', 'page_view', {
            'page_title': 'Veteran Valor Life Insurance Quiz',
            'page_location': window.location.href,
            'event_category': 'engagement',
            'event_label': 'quiz_landing_page'
        });
    }
    
    // Track with custom analytics
    const pageViewData = {
        timestamp: new Date().toISOString(),
        url: window.location.href,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        screenResolution: `${screen.width}x${screen.height}`,
        viewportSize: `${window.innerWidth}x${window.innerHeight}`
    };
    
    // Store locally for tracking
    localStorage.setItem('pageView_' + Date.now(), JSON.stringify(pageViewData));
    
    console.log('Page view tracked:', pageViewData);
}

function trackTimeOnPage() {
    const startTime = Date.now();
    
    // Track time on page when user leaves
    window.addEventListener('beforeunload', function() {
        const timeOnPage = Math.round((Date.now() - startTime) / 1000);
        
        if (typeof gtag !== 'undefined') {
            gtag('event', 'time_on_page', {
                'event_category': 'engagement',
                'event_label': 'quiz_session_duration',
                'value': timeOnPage
            });
        }
        
        // Store session data
        const sessionData = {
            timestamp: new Date().toISOString(),
            duration: timeOnPage,
            pagesViewed: currentPage,
            quizCompleted: currentPage >= 7
        };
        
        localStorage.setItem('session_' + Date.now(), JSON.stringify(sessionData));
    });
}

function trackQuizProgress(pageNumber) {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'quiz_progress', {
            'event_category': 'engagement',
            'event_label': `page_${pageNumber}`,
            'value': pageNumber
        });
    }
    
    console.log(`Quiz progress: Page ${pageNumber}`);
}

function trackConversion() {
    // Google Analytics event (replace with your tracking code)
    if (typeof gtag !== 'undefined') {
        gtag('event', 'quiz_completion', {
            'event_category': 'lead_generation',
            'event_label': 'first_responder_insurance',
            'value': 1
        });
    }
    
    // Facebook Pixel event (replace with your pixel code)
    if (typeof fbq !== 'undefined') {
        fbq('track', 'Lead', {
            content_name: 'First Responder Insurance Quiz',
            content_category: 'Insurance'
        });
    }
    
    console.log('Quiz completed:', quizData);
}

// Track embedded calendar view
function trackCalendarView() {
    // Track calendar view
    if (typeof gtag !== 'undefined') {
        gtag('event', 'calendar_view', {
            'event_category': 'lead_generation',
            'event_label': 'embedded_calendar',
            'value': 1
        });
    }
    
    if (typeof fbq !== 'undefined') {
        fbq('track', 'ViewContent', {
            content_name: 'Embedded Calendar',
            content_category: 'Insurance Consultation'
        });
    }
}

// Utility functions
function formatPhoneNumber(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length >= 6) {
        value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    } else if (value.length >= 3) {
        value = value.replace(/(\d{3})(\d{0,3})/, '($1) $2');
    }
    input.value = value;
}

// Add phone formatting
document.addEventListener('DOMContentLoaded', function() {
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            formatPhoneNumber(this);
        });
    }
    
    // Track embedded calendar when it loads
    if (typeof Calendly !== 'undefined') {
        Calendly.onEventScheduled(function(e) {
            // Track when someone books an appointment
            if (typeof gtag !== 'undefined') {
                gtag('event', 'appointment_booked', {
                    'event_category': 'lead_generation',
                    'event_label': 'calendly_booking',
                    'value': 1
                });
            }
            
            if (typeof fbq !== 'undefined') {
                fbq('track', 'Lead', {
                    content_name: 'Appointment Booked',
                    content_category: 'Insurance Consultation'
                });
            }
        });
    }
});

// Analytics data retrieval
function getAnalyticsData() {
    const pageViews = [];
    const sessions = [];
    
    // Get all page view data from localStorage
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('pageView_')) {
            try {
                const data = JSON.parse(localStorage.getItem(key));
                pageViews.push(data);
            } catch (e) {
                console.error('Error parsing page view data:', e);
            }
        }
        if (key && key.startsWith('session_')) {
            try {
                const data = JSON.parse(localStorage.getItem(key));
                sessions.push(data);
            } catch (e) {
                console.error('Error parsing session data:', e);
            }
        }
    }
    
    return {
        pageViews: pageViews,
        sessions: sessions,
        totalPageViews: pageViews.length,
        totalSessions: sessions.length,
        completedQuizzes: sessions.filter(s => s.quizCompleted).length
    };
}

function displayAnalyticsData() {
    const data = getAnalyticsData();
    
    console.log('=== ANALYTICS SUMMARY ===');
    console.log(`Total Page Views: ${data.totalPageViews}`);
    console.log(`Total Sessions: ${data.totalSessions}`);
    console.log(`Completed Quizzes: ${data.completedQuizzes}`);
    console.log(`Conversion Rate: ${data.totalSessions > 0 ? ((data.completedQuizzes / data.totalSessions) * 100).toFixed(2) : 0}%`);
    console.log('========================');
    
    return data;
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('Quiz error:', e.error);
    // In production, send error to analytics service
});

// Mobile optimization
function isMobile() {
    return window.innerWidth <= 768;
}

// Add touch support for mobile
if ('ontouchstart' in window) {
    document.addEventListener('touchstart', function() {}, {passive: true});
}

// Performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimize scroll performance
const optimizedScroll = debounce(function() {
    // Handle scroll events if needed
}, 16);

window.addEventListener('scroll', optimizedScroll, {passive: true}); 