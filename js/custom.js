/**
 * Custom JavaScript for Mehran Ahmadlou's Personal Website
 * Author: Mehran Ahmadlou
 * Version: 1.0
 * Last Updated: March 24, 2025
 */

// ======================================
// UTILITIES & HELPER FUNCTIONS
// ======================================

/**
 * Creates and shows a toast notification
 * @param {string} message - Message to display
 * @param {string} type - Type of notification (success, error, info)
 * @param {number} duration - How long to show notification in ms
 */
function showToast(message, type = 'success', duration = 3000) {
    // Remove any existing toasts
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) {
        existingToast.remove();
    }
    
    // Create new toast
    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <div class="toast-message">${message}</div>
        </div>
    `;
    
    // Add to document
    document.body.appendChild(toast);
    
    // Show with animation
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Auto dismiss
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// ======================================
// PUBLICATIONS HANDLING
// ======================================

/**
 * Parses a BibTeX file content into structured objects
 * @param {string} bibContent - Raw BibTeX file content
 * @returns {Array} Array of publication objects
 */
function parseBibFile(bibContent) {
    const entries = bibContent.split('@').slice(1); // Split by entries
    return entries.map(entry => {
        const fields = {};
        const lines = entry.split('\n').map(line => line.trim());

        // Extract the ID (e.g., ahmadlou2010wavelet) from the first line
        const idMatch = lines[0].match(/^(\w+)\{(.+?),$/);
        if (idMatch) {
            fields.id = idMatch[2]; // Store the ID
        }

        // Extract other fields
        lines.slice(1).forEach(line => {
            const match = line.match(/^(\w+)\s*=\s*[{"](.+?)[}"],?$/);
            if (match) {
                fields[match[1].toLowerCase()] = match[2];
            }
        });

        // Format title to capitalize the first letter of each word
        if (fields.title) {
            fields.title = fields.title
                .toLowerCase()
                .replace(/\b\w/g, char => char.toUpperCase());
        }

        return fields;
    });
}

/**
 * Formats author names for display
 * @param {string} authors - Raw author string from BibTeX
 * @returns {string} Formatted author names
 */
function formatAuthors(authors) {
    if (!authors) return 'Unknown Author';
    
    return authors.split(' and ').map(author => {
        const parts = author.split(', ');
        return `${parts[1] ? parts[1][0] + '.' : ''} ${parts[0]}`;
    }).join(', ');
}

/**
 * Escapes BibTeX entry for safe use in HTML attributes
 * @param {Object} pub - Publication object
 * @returns {string} Escaped BibTeX string
 */
function escapeBib(pub) {
    const excludedFields = ['url', 'image'];
    const bibEntry = Object.entries(pub)
        .filter(([key]) => !excludedFields.includes(key))
        .map(([key, value]) => `  ${key}={${value}}`)
        .join(',\n');
    const bibString = `@article{${pub.id || 'unknown'},\n${bibEntry}\n}`;
    return bibString.replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/\n/g, '\\n');
}

/**
 * Copies bibliography to clipboard with modern notification
 * @param {string} bib - Bibliography text to copy
 */
function copyBibliography(bib) {
    navigator.clipboard.writeText(bib).then(() => {
        showToast('Bibliography copied to clipboard!', 'success');
    }).catch(err => {
        console.error('Failed to copy: ', err);
        showToast('Failed to copy bibliography', 'error');
    });
}

/**
 * Loads publications from BibTeX file and returns HTML
 * @returns {Promise<string>} HTML string for publications carousel
 */
async function loadPublications() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/mehranahmadlou/mehranahmadlou.github.io/refs/heads/main/publications.bib');
        const bibContent = await response.text();

        // Parse the .bib content
        const publications = parseBibFile(bibContent);

        // Sort publications by year in ascending order
        publications.sort((a, b) => {
            const yearA = parseInt(a.year || '0');
            const yearB = parseInt(b.year || '0');
            return yearA - yearB;
        });

        // Generate HTML for each publication
        let itemsHTML = '';
        let journalBadge = '';
        
        publications.forEach(pub => {
            if (pub.journal) {
                journalBadge = `<p class="journal-badge">${pub.journal}`;
                if (pub.volume) {
                    journalBadge += `<span class="journal-details">(Vol. ${pub.volume}${pub.number ? ` | Issue ${pub.number}` : ''})</span>`;
                }
                journalBadge += `</p>`;
            } else {
                journalBadge = '';
            }
            
            itemsHTML += `
                <div class="item">
                    <div class="image-holder">
                        <img src="${pub.image || 'img/publication-default.jpg'}" alt="${pub.title || 'A Publication'} by Mehran Ahmadlou" class="publication-img">
                        <div class="overlay-gradient"></div>
                    </div>
                    <div class="pub-badges">
                        <p class="year-badge">${pub.year || 'Unknown'}</p>
                        ${journalBadge}
                    </div>
                    <div class="publication-content">
                        <h3 class="pub-title">${pub.title || 'A Publication'} by Mehran Ahmadlou</h3>
                        <p class="pub-authors">${formatAuthors(pub.author)}</p>
                        
                        <div class="pub-actions align-items-center">
                            <a href="javascript:void(0);" class="work-btn btn-main-inverse rounded-pill" onclick="copyBibliography('${escapeBib(pub)}')">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="cite-icon"><path d="M208 0L332.1 0c12.7 0 24.9 5.1 33.9 14.1l67.9 67.9c9 9 14.1 21.2 14.1 33.9L448 336c0 26.5-21.5 48-48 48l-192 0c-26.5 0-48-21.5-48-48l0-288c0-26.5 21.5-48 48-48zM48 128l80 0 0 64-64 0 0 256 192 0 0-32 64 0 0 48c0 26.5-21.5 48-48 48L48 512c-26.5 0-48-21.5-48-48L0 176c0-26.5 21.5-48 48-48z"/></svg>
                                Cite
                            </a>
                            <a href="${pub.url || '#contact-sec'}" class="work-btn btn-main-inverse rounded-pill" target="${pub.url ? '_blank' : '_self'}">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="cite-icon"><path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 242.7-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7 288 32zM64 352c-35.3 0-64 28.7-64 64l0 32c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-32c0-35.3-28.7-64-64-64l-101.5 0-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352 64 352zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z"/></svg>
                                Download
                            </a>
                        </div>
                    </div>
                </div>
            `;
        });

        return itemsHTML;
    } catch (error) {
        console.error('Error loading publications:', error);
        return '<div class="item"><p>Error loading publications</p></div>';
    }
}

/**
 * Injects publications into the carousel and initializes it
 */
async function injectPublications() {
    try {
        const itemsHTML = await loadPublications();
        const carousel = document.getElementById('publications-carousel');
        
        if (carousel) {
            carousel.innerHTML = itemsHTML;

            // Reinitialize Owl Carousel
            if (typeof $.fn.owlCarousel === 'function') {
                $('.portfolio-carousel').owlCarousel('destroy');
                $('.portfolio-carousel').owlCarousel({
                    loop: true,
                    margin: 10,
                    nav: true,
                    responsive: {
                        0: { items: 1 },
                        600: { items: 1 },
                        1000: { items: 1 }
                    }
                });
                
                // Add navigation handlers
                $('.portfolio-left-arr').on('click', function() {
                    $('.portfolio-carousel').trigger('prev.owl.carousel');
                });
                
                $('.portfolio-right-arr').on('click', function() {
                    $('.portfolio-carousel').trigger('next.owl.carousel');
                });
            }
        }
    } catch (error) {
        console.error('Error injecting publications:', error);
    }
}

// ======================================
// CONTACT FORM HANDLING
// ======================================

/**
 * Validates form inputs and checks for security issues
 * @param {string} name - User's name
 * @param {string} email - User's email
 * @param {string} phone - User's phone (optional)
 * @param {string} message - User's message
 * @returns {Object} Validation result with valid flag and message
 */
function validateFormAndSecurity(name, email, phone, message) {
    // Check required fields
    if (!name) {
        return { valid: false, message: 'Please enter your name.' };
    }
    
    if (!email) {
        return { valid: false, message: 'Please enter your email address.' };
    }
    
    if (!message) {
        return { valid: false, message: 'Please enter your message.' };
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { valid: false, message: 'Please enter a valid email address.' };
    }
    
    // Validate phone format (if provided)
    if (phone) {
        const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,10}[-\s.]?[0-9]{1,10}$/;
        if (!phoneRegex.test(phone)) {
            return { valid: false, message: 'Please enter a valid phone number.' };
        }
    }
    
    // Security checks
    // 1. Check for HTML tags
    if (/<[^>]*>/.test(name) || /<[^>]*>/.test(email) || /<[^>]*>/.test(phone) || /<[^>]*>/.test(message)) {
        return { valid: false, message: 'HTML code is not allowed in form fields.' };
    }
    
    // 2. Check for JavaScript patterns
    const scriptPatterns = [
        /javascript:/i,
        /on\w+\s*=/i,
        /script/i,
        /eval\(/i,
        /alert\(/i,
        /document\./i,
        /window\./i,
        /\(\s*\)\s*{/,
        /function\s*\(/
    ];
    
    for (const pattern of scriptPatterns) {
        if (pattern.test(name) || pattern.test(email) || pattern.test(phone) || pattern.test(message)) {
            return { valid: false, message: 'Potentially unsafe content detected. Please remove code snippets.' };
        }
    }
    
    // Check field lengths
    if (name.length > 100) {
        return { valid: false, message: 'Name is too long. Maximum 100 characters allowed.' };
    }
    
    if (email.length > 100) {
        return { valid: false, message: 'Email is too long. Maximum 100 characters allowed.' };
    }
    
    if (message.length > 5000) {
        return { valid: false, message: 'Message is too long. Maximum 5000 characters allowed.' };
    }
    
    return { valid: true };
}

/**
 * Displays form submission result messages
 * @param {string} message - Message to display
 * @param {string} type - Type of message (success or error)
 */
function showResult(message, type) {
    const resultDiv = document.getElementById('result');
    if (!resultDiv) return;
    
    resultDiv.innerHTML = message;
    resultDiv.style.display = 'block';
    
    // Add appropriate styling
    if (type === 'success') {
        resultDiv.className = 'col-sm-12 alert alert-success';
    } else {
        resultDiv.className = 'col-sm-12 alert alert-danger';
    }
    
    // Scroll to result div
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Hide after 5 seconds
    setTimeout(() => {
        resultDiv.style.display = 'none';
    }, 5000);
}

/**
 * Initializes contact form submission handling
 */
function initContactForm() {
    const contactBtn = document.querySelector('.contact_btn');
    const form = document.getElementById('contact-form-data');
    
    if (contactBtn && form) {
        contactBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get form field values
            const name = form.querySelector('[name="userName"]').value.trim();
            const email = form.querySelector('[name="userEmail"]').value.trim();
            const phone = form.querySelector('[name="userPhone"]').value.trim();
            const message = form.querySelector('[name="userMessage"]').value.trim();
            
            // Validate and check for malicious content
            const validationResult = validateFormAndSecurity(name, email, phone, message);
            
            if (!validationResult.valid) {
                showResult(validationResult.message, 'error');
                return;
            }
            
            // Show spinner
            const spinner = contactBtn.querySelector('.fa-spinner');
            spinner.classList.remove('d-none');
            contactBtn.classList.add('disabled');
            
            // Collect form data
            const formData = new FormData(form);
            
            // Send data to Formspree
            fetch('https://formspree.io/f/mldjnoal', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.ok) {
                    showResult('Thank you for your message! I will get back to you soon.', 'success');
                    form.reset();
                } else {
                    showResult('Oops! There was a problem submitting your form.', 'error');
                }
            })
            .catch(error => {
                showResult('Oops! There was a problem submitting your form.', 'error');
                console.error(error);
            })
            .finally(() => {
                // Hide spinner
                spinner.classList.add('d-none');
                contactBtn.classList.remove('disabled');
            });
        });
    }
}

// ======================================
// Dynamic License Content Loading
// ======================================

// ======================================
// Dynamic License Content Loading
// ======================================

document.addEventListener('DOMContentLoaded', function() {
    const aboutSection = document.querySelector('#about .col-12.padding-top-half');
    
    if (aboutSection) {
        // Show loading indicator
        aboutSection.innerHTML = '<div class="text-center"><p>Loading license information...</p></div>';
        
        // Function to dynamically load a script
        function loadScript(url) {
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = url;
                script.onload = resolve;
                script.onerror = () => reject(new Error(`Failed to load script: ${url}`));
                document.head.appendChild(script);
            });
        }
        
        // First load the marked.js library, then process the LICENSE file
        loadScript('https://cdn.jsdelivr.net/npm/marked/marked.min.js')
            .then(() => fetch('LICENSE'))
            .then(response => {
                if (!response.ok) {
                    throw new Error('Could not load license file');
                }
                return response.text();
            })
            .then(markdown => {
                // Now marked is available to use
                const licenseHtml = marked.parse(markdown);
                aboutSection.innerHTML = `
                    <div class="license-content">
                        ${licenseHtml}
                    </div>
                `;
            })
            .catch(error => {
                aboutSection.innerHTML = `
                    <div class="alert alert-danger">
                        <p>Error loading license information: ${error.message}</p>
                        <p>Please visit <a href="LICENSE">the license file</a> directly.</p>
                    </div>
                `;
                console.error('License loading error:', error);
            });
    }
});

// ======================================
// INITIALIZATION
// ======================================

/**
 * Updates the current year in the footer
 */
function updateCopyrightYear() {
    const yearElements = document.querySelectorAll('#currentYear');
    const currentYear = new Date().getFullYear();
    
    yearElements.forEach(element => {
        element.textContent = currentYear;
    });
}

/**
 * Main initialization function
 */
function init() {
    // Set copyright year
    updateCopyrightYear();
    
    // Initialize contact form
    initContactForm();
    
    // Load publications
    injectPublications();
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', init);