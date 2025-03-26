/**
 * Custom JavaScript for Mehran Ahmadlou's Personal Website
 * Author: Mehran Ahmadlou
 * Version: 1.0
 * Last Updated: March 24, 2025
 */

// Console styling helpers
const consoleStyles = {
    title: 'color: #4682B4; font-weight: bold; font-size: 14px;',
    info: 'color: #3CB371; font-weight: bold;',
    warning: 'color: #FFA500; font-weight: bold;',
    error: 'color: #FF6347; font-weight: bold;',
    success: 'color: #32CD32; font-weight: bold;'
};

// Global variables for publications and license data
let publicationsFile = 'https://ahmadlou.com/publications.bib'; // Path to the BibTeX file
let licenseFile = 'https://ahmadlou.com/license.html'; // Path to the license file
let licenseContent = 'https://ahmadlou.com/LICENSE'; // Variable to hold license content

// Print fancy initialization message
console.log("%c 🧠 Welcome to Mehran Ahmadlou's Brainy Lab! 🧠", consoleStyles.title);
console.log("%c 🐭 Training mice to outsmart the cheese traps... because neuroscience is serious business.", consoleStyles.info);
console.log("%c 🚀 Launching neural circuits into the digital frontier... Hold tight, neurons firing!", consoleStyles.success);
console.log("%c 🎩 Mixing science, humor, and a dash of mouse wisdom... Mehran's style!", consoleStyles.warning);
console.log("%c 🌟 Pro tip: If you're reading this, you're either a neuroscientist, a developer, or a curious hacker. Either way, Mehran waves his lab coat at you!", consoleStyles.info);

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
    console.log(`%c 🔔 Toast notification: [${type}] ${message}`, consoleStyles.info);

    // Remove any existing toasts
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) {
        existingToast.remove();
        console.log('%c 🧹 Removed existing toast notification', 'color: #888;');
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
        console.log('%c 🔔 Toast dismissed after ' + duration + 'ms', 'color: #888;');
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
    console.group('%c 📚 Publication Parsing Started', consoleStyles.title);
    console.log('%c 📑 Raw BibTeX content length: ' + bibContent.length + ' characters', consoleStyles.info);

    const entries = bibContent.split('@').slice(1); // Split by entries
    console.log(`%c 🔬 Found ${entries.length} publication entries`, consoleStyles.info);

    const publications = entries.map((entry, index) => {
        const fields = {};
        const lines = entry.split('\n').map(line => line.trim());

        // Extract the ID (e.g., ahmadlou2010wavelet) from the first line
        const idMatch = lines[0].match(/^(\w+)\{(.+?),$/);
        if (idMatch) {
            fields.id = idMatch[2]; // Store the ID
            fields.type = idMatch[1]; // Store the publication type
        } else {
            console.warn(`%c ⚠️ Publication #${index+1} has an invalid ID format`, consoleStyles.warning);
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
            console.log(`%c 📖 Parsed publication ${index+1}: "${fields.title}"`, 'color: #708090;');
        } else {
            console.warn(`%c ⚠️ Publication #${index+1} is missing a title`, consoleStyles.warning);
        }

        return fields;
    });

    console.log('%c 📊 Publication statistics:', consoleStyles.info);

    // Count publications by year
    const yearCounts = publications.reduce((acc, pub) => {
        if (pub.year) {
            acc[pub.year] = (acc[pub.year] || 0) + 1;
        }
        return acc;
    }, {});

    console.table(yearCounts);

    // Show summary of journals
    const journals = publications
        .filter(pub => pub.journal)
        .map(pub => pub.journal);
    const uniqueJournals = [...new Set(journals)];
    console.log(`%c 🔬 Publications appear in ${uniqueJournals.length} different journals`, consoleStyles.info);

    console.groupEnd();
    return publications;
}

/**
 * Formats author names for display
 * @param {string} authors - Raw author string from BibTeX
 * @returns {string} Formatted author names
 */
function formatAuthors(authors) {
    if (!authors) {
        console.warn('%c ⚠️ Missing author information', consoleStyles.warning);
        return 'Unknown Author';
    }

    const authorList = authors.split(' and ');
    console.log(`%c 👥 Formatting ${authorList.length} authors`, 'color: #708090;');

    return authorList.map(author => {
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
    console.log(`%c 🔒 Escaping BibTeX for citation: "${pub.title || 'Unknown'}"`, 'color: #708090;');

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
    console.log('%c 📋 Copying citation to clipboard...', consoleStyles.info);

    navigator.clipboard.writeText(bib).then(() => {
        console.log('%c ✅ Citation copied successfully!', consoleStyles.success);
        showToast('Bibliography copied to clipboard!', 'success');
    }).catch(err => {
        console.error('%c ❌ Failed to copy citation: ', consoleStyles.error, err);
        showToast('Failed to copy bibliography', 'error');
    });
}

/**
 * Loads publications from BibTeX file and returns HTML
 * @returns {Promise<string>} HTML string for publications carousel
 */
async function loadPublications() {
    console.group('%c 🧪 Loading Publications', consoleStyles.title);
    console.time('Publications loading time');

    try {
        console.log('%c 🔄 Fetching BibTeX file from GitHub...', consoleStyles.info);
        const response = await fetch(publicationsFile);

        if (!response.ok) {
            throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
        }

        const bibContent = await response.text();
        console.log('%c ✅ BibTeX file retrieved successfully', consoleStyles.success);

        // Parse the .bib content
        const publications = parseBibFile(bibContent);
        console.log(`%c 📚 Parsed ${publications.length} publications:`, consoleStyles.info);

        // Log the full publication data in a collapsible table
        console.groupCollapsed('Publication details (click to expand)');
        console.table(publications.map(p => ({
            year: p.year || 'Unknown',
            title: p.title || 'Unknown',
            journal: p.journal || 'N/A',
            authors: p.author ? p.author.split(' and ').length : 0
        })));
        console.groupEnd();

        // Sort publications by year in descending order
        publications.sort((a, b) => {
            const yearA = parseInt(a.year || '0');
            const yearB = parseInt(b.year || '0');
            return yearB - yearA;
        });
        console.log('%c 🔄 Publications sorted by year (descending)', consoleStyles.info);

        // Generate HTML for each publication
        let itemsHTML = '';
        let journalBadge = '';

        console.log('%c 🖌️ Generating HTML for publications carousel...', consoleStyles.info);

        publications.forEach((pub, index) => {
            console.log('%c 📄 Full publication data:', consoleStyles.info, pub);

            if (pub.journal) {
                journalBadge = `<p class="journal-badge">${pub.journal}`;
                if (pub.volume) {
                    journalBadge += `<span class="journal-details">(Vol. ${pub.volume}${pub.number ? ` | Issue ${pub.number}` : ''})</span>`;
                }
                journalBadge += `</p>`;
            } else {
                journalBadge = '';
            }

            console.log(`%c 🔖 Adding publication #${index+1}: ${pub.title || 'Unknown'} (${pub.year || 'Unknown year'})`, 'color: #708090;');

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
                          <h3 class="pub-title">${pub.title || 'A Publication by Mehran Ahmadlou'}</h3>
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

        console.log('%c ✅ Publication HTML generated successfully', consoleStyles.success);
        console.timeEnd('Publications loading time');
        console.groupEnd();
        return itemsHTML;
    } catch (error) {
        console.error('%c ❌ Error loading publications:', consoleStyles.error, error);
        console.timeEnd('Publications loading time');
        console.groupEnd();
        return '<div class="item"><p>Error loading publications</p></div>';
    }
}

/**
 * Injects publications into the carousel and initializes it
 */
async function injectPublications() {
    console.group('%c 💉 Injecting Publications', consoleStyles.title);

    try {
        console.log('%c 🔄 Starting publications injection process...', consoleStyles.info);
        const itemsHTML = await loadPublications();
        const carousel = document.getElementById('publications-carousel');

        if (carousel) {
            console.log('%c 🎯 Found carousel target element', consoleStyles.info);
            carousel.innerHTML = itemsHTML;
            console.log('%c ✅ Publications HTML injected into carousel', consoleStyles.success);

            // Reinitialize Owl Carousel
            if (typeof $.fn.owlCarousel === 'function') {
                console.log('%c 🦉 Reinitializing Owl Carousel', consoleStyles.info);
                $('.portfolio-carousel').owlCarousel('destroy');
                $('.portfolio-carousel').owlCarousel({
                    loop: true,
                    margin: 10,
                    nav: true,
                    responsive: {
                        0: {
                            items: 1
                        },
                        600: {
                            items: 1
                        },
                        1000: {
                            items: 1
                        }
                    }
                });

                // Add navigation handlers
                $('.portfolio-left-arr').on('click', function() {
                    console.log('%c ⬅️ Carousel navigation: previous', 'color: #888;');
                    $('.portfolio-carousel').trigger('prev.owl.carousel');
                });

                $('.portfolio-right-arr').on('click', function() {
                    console.log('%c ➡️ Carousel navigation: next', 'color: #888;');
                    $('.portfolio-carousel').trigger('next.owl.carousel');
                });

                console.log('%c 🎠 Carousel initialized successfully', consoleStyles.success);
            } else {
                console.warn('%c ⚠️ Owl Carousel not available', consoleStyles.warning);
            }
        } else {
            console.warn('%c ⚠️ Publications carousel element not found in DOM', consoleStyles.warning);
        }
    } catch (error) {
        console.error('%c ❌ Error injecting publications:', consoleStyles.error, error);
    }

    console.groupEnd();
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
    console.group('%c 🔒 Form Validation', consoleStyles.title);
    console.log('%c 📝 Validating form data...', consoleStyles.info);
    console.log({
        name,
        email,
        phone,
        message: message.substring(0, 30) + (message.length > 30 ? '...' : '')
    });

    // Check required fields
    if (!name) {
        console.warn('%c ⚠️ Validation failed: Missing name', consoleStyles.warning);
        console.groupEnd();
        return {
            valid: false,
            message: 'Please enter your name.'
        };
    }

    if (!email) {
        console.warn('%c ⚠️ Validation failed: Missing email', consoleStyles.warning);
        console.groupEnd();
        return {
            valid: false,
            message: 'Please enter your email address.'
        };
    }

    if (!message) {
        console.warn('%c ⚠️ Validation failed: Missing message', consoleStyles.warning);
        console.groupEnd();
        return {
            valid: false,
            message: 'Please enter your message.'
        };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        console.warn('%c ⚠️ Validation failed: Invalid email format', consoleStyles.warning);
        console.groupEnd();
        return {
            valid: false,
            message: 'Please enter a valid email address.'
        };
    }

    // Validate phone format (if provided)
    if (phone) {
        const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,10}[-\s.]?[0-9]{1,10}$/;
        if (!phoneRegex.test(phone)) {
            console.warn('%c ⚠️ Validation failed: Invalid phone format', consoleStyles.warning);
            console.groupEnd();
            return {
                valid: false,
                message: 'Please enter a valid phone number.'
            };
        }
    }

    // Security checks
    console.log('%c 🛡️ Running security checks...', consoleStyles.info);

    // 1. Check for HTML tags
    if (/<[^>]*>/.test(name) || /<[^>]*>/.test(email) || /<[^>]*>/.test(phone) || /<[^>]*>/.test(message)) {
        console.warn('%c ⚠️ Security check failed: HTML tags detected', consoleStyles.warning);
        console.groupEnd();
        return {
            valid: false,
            message: 'HTML code is not allowed in form fields.'
        };
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
            console.warn('%c 🚨 Security check failed: Potentially malicious code detected', consoleStyles.warning);
            console.groupEnd();
            return {
                valid: false,
                message: 'Potentially unsafe content detected. Please remove code snippets.'
            };
        }
    }

    // Check field lengths
    if (name.length > 100) {
        console.warn('%c ⚠️ Validation failed: Name too long', consoleStyles.warning);
        console.groupEnd();
        return {
            valid: false,
            message: 'Name is too long. Maximum 100 characters allowed.'
        };
    }

    if (email.length > 100) {
        console.warn('%c ⚠️ Validation failed: Email too long', consoleStyles.warning);
        console.groupEnd();
        return {
            valid: false,
            message: 'Email is too long. Maximum 100 characters allowed.'
        };
    }

    if (message.length > 5000) {
        console.warn('%c ⚠️ Validation failed: Message too long', consoleStyles.warning);
        console.groupEnd();
        return {
            valid: false,
            message: 'Message is too long. Maximum 5000 characters allowed.'
        };
    }

    console.log('%c ✅ Form validation passed successfully', consoleStyles.success);
    console.groupEnd();
    return {
        valid: true
    };
}

/**
 * Displays form submission result messages
 * @param {string} message - Message to display
 * @param {string} type - Type of message (success or error)
 */
function showResult(message, type) {
    console.log(`%c 📢 Form result: [${type}] ${message}`, type === 'success' ? consoleStyles.success : consoleStyles.error);

    const resultDiv = document.getElementById('result');
    if (!resultDiv) {
        console.warn('%c ⚠️ Result display element not found', consoleStyles.warning);
        return;
    }

    resultDiv.innerHTML = message;
    resultDiv.style.display = 'block';

    // Add appropriate styling
    if (type === 'success') {
        resultDiv.className = 'col-sm-12 alert alert-success';
    } else {
        resultDiv.className = 'col-sm-12 alert alert-danger';
    }

    // Scroll to result div
    resultDiv.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
    });
    console.log('%c 🔍 Scrolled to result message', 'color: #888;');

    // Hide after 5 seconds
    setTimeout(() => {
        resultDiv.style.display = 'none';
        console.log('%c 🕒 Result message hidden after timeout', 'color: #888;');
    }, 5000);
}

/**
 * Initializes contact form submission handling
 */
function initContactForm() {
    console.group('%c 📝 Initializing Contact Form', consoleStyles.title);

    const contactBtn = document.querySelector('.contact_btn');
    const form = document.getElementById('contact-form-data');

    if (contactBtn && form) {
        console.log('%c ✅ Contact form and submit button found', consoleStyles.success);

        contactBtn.addEventListener('click', function(e) {
            console.group('%c 📨 Contact Form Submission', consoleStyles.title);
            console.log('%c 🖱️ Submit button clicked', consoleStyles.info);

            e.preventDefault();

            // Get form field values
            const name = form.querySelector('[name="userName"]').value.trim();
            const email = form.querySelector('[name="userEmail"]').value.trim();
            const phone = form.querySelector('[name="userPhone"]').value.trim();
            const message = form.querySelector('[name="userMessage"]').value.trim();

            console.log('%c 📋 Form data collected:', consoleStyles.info);
            console.log({
                name,
                email,
                phone: phone || '[not provided]',
                message: message.substring(0, 30) + (message.length > 30 ? '...' : '')
            });

            // Validate and check for malicious content
            const validationResult = validateFormAndSecurity(name, email, phone, message);

            if (!validationResult.valid) {
                console.warn('%c ⚠️ Form validation failed', consoleStyles.warning);
                showResult(validationResult.message, 'error');
                console.groupEnd();
                return;
            }

            console.log('%c ✅ Form validation passed', consoleStyles.success);

            // Show spinner
            const spinner = contactBtn.querySelector('.fa-spinner');
            spinner.classList.remove('d-none');
            contactBtn.classList.add('disabled');
            console.log('%c 🔄 Loading spinner displayed', consoleStyles.info);

            // Collect form data
            const formData = new FormData(form);

            console.log('%c 🚀 Sending form data to Formspree...', consoleStyles.info);

            // Send data to Formspree
            fetch('https://formspree.io/f/mldjnoal', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                })
                .then(response => {
                    console.log(`%c 📡 Formspree response status: ${response.status}`, consoleStyles.info);
                    return response.json();
                })
                .then(data => {
                    if (data.ok) {
                        console.log('%c ✅ Form submitted successfully!', consoleStyles.success);
                        showResult('Thank you for your message! I will get back to you soon.', 'success');
                        form.reset();
                        console.log('%c 🧹 Form fields cleared', 'color: #888;');
                    } else {
                        console.error('%c ❌ Form submission rejected by Formspree', consoleStyles.error);
                        showResult('Oops! There was a problem submitting your form.', 'error');
                    }
                })
                .catch(error => {
                    console.error('%c ❌ Form submission error:', consoleStyles.error, error);
                    showResult('Oops! There was a problem submitting your form.', 'error');
                })
                .finally(() => {
                    // Hide spinner
                    spinner.classList.add('d-none');
                    contactBtn.classList.remove('disabled');
                    console.log('%c 🔄 Loading spinner hidden', 'color: #888;');
                    console.groupEnd();
                });
        });

        console.log('%c ✅ Contact form event listener attached', consoleStyles.success);
    } else {
        console.warn('%c ⚠️ Contact form elements not found in DOM', consoleStyles.warning);
    }

    console.groupEnd();
}

// ======================================
// Dynamic License Content Loading
// ======================================

document.addEventListener('DOMContentLoaded', function() {
    console.group('%c 📄 License Page Check', consoleStyles.title);

    // Check if we're on the license.html page
    if (window.location.pathname.includes(licenseFile)) {
        console.log('%c ✅ License page detected', consoleStyles.success);
        const aboutSection = document.querySelector('#license .col-12.padding-top-half');

        if (aboutSection) {
            console.log('%c 🎯 Found license content container', consoleStyles.info);

            // Show loading indicator
            aboutSection.innerHTML = '<div class="text-center"><p>Loading license information...</p></div>';

            // Function to dynamically load a script
            function loadScript(url) {
                console.log(`%c 📜 Loading script: ${url}`, consoleStyles.info);
                return new Promise((resolve, reject) => {
                    const script = document.createElement('script');
                    script.src = url;
                    script.onload = () => {
                        console.log(`%c ✅ Script loaded: ${url}`, consoleStyles.success);
                        resolve();
                    };
                    script.onerror = () => {
                        console.error(`%c ❌ Failed to load script: ${url}`, consoleStyles.error);
                        reject(new Error(`Failed to load script: ${url}`));
                    };
                    document.head.appendChild(script);
                });
            }

            // First load the marked.js library, then process the LICENSE file
            loadScript('https://cdn.jsdelivr.net/npm/marked/marked.min.js')
                .then(() => {
                    console.log('%c 🔧 Configuring Marked.js renderer', consoleStyles.info);

                    // Configure marked to customize headings
                    const renderer = new marked.Renderer();

                    renderer.heading = function(text, level) {
                        // Make sure level is treated as a number
                        const levelNum = parseInt(level) || 1;
                        // Adjust level to start from h5
                        const newLevel = Math.min(levelNum + 4, 6); // h1 becomes h5, h2 becomes h6

                        // Handle case where text is an object (newer versions of marked.js)
                        let headingText = text;
                        if (typeof text === 'object' && text !== null) {
                            headingText = text.text || text.toString();
                        }

                        return `<h${newLevel} class="heading">${headingText}</h${newLevel}>`;
                    };

                    // Set renderer options
                    marked.setOptions({
                        renderer: renderer,
                        gfm: true,
                        breaks: true
                    });

                    console.log('%c 🔄 Fetching LICENSE file...', consoleStyles.info);
                    return fetch(licenseContent);
                })
                .then(response => {
                    if (!response.ok) {
                        console.error(`%c ❌ License file fetch failed: ${response.status} ${response.statusText}`, consoleStyles.error);
                        throw new Error('Could not load license file');
                    }
                    console.log('%c ✅ LICENSE file retrieved', consoleStyles.success);
                    return response.text();
                })
                .then(markdown => {
                    console.log('%c 🔄 Parsing LICENSE markdown...', consoleStyles.info);
                    // Now marked is available to use with custom renderer
                    const licenseHtml = marked.parse(markdown);
                    aboutSection.innerHTML = `
                          <div class="text">
                              ${licenseHtml}
                          </div>
                      `;
                    console.log('%c ✅ LICENSE content rendered successfully', consoleStyles.success);
                })
                .catch(error => {
                    console.error('%c ❌ License loading error:', consoleStyles.error, error);
                    aboutSection.innerHTML = `
                          <div class="alert alert-danger">
                              <p>Error loading license information: ${error.message}</p>
                              <p>Please visit <a href="${licenseContent}">the license file</a> directly.</p>
                          </div>
                      `;
                });
        } else {
            console.warn('%c ⚠️ License content container not found in DOM', consoleStyles.warning);
        }
    } else {
        console.log(`%c ℹ️ Current page "${window.location.pathname}" is not the license page. License loading skipped.`, 'color: #888;');
    }

    console.groupEnd();
});

// ======================================
// INITIALIZATION
// ======================================

/**
 * Updates the current year in the footer
 */
function updateCopyrightYear() {
    console.log('%c 📅 Updating copyright year...', consoleStyles.info);

    const yearElements = document.querySelectorAll('#currentYear');
    const currentYear = new Date().getFullYear();

    if (yearElements.length > 0) {
        yearElements.forEach(element => {
            element.textContent = currentYear;
        });
        console.log(`%c ✅ Copyright year updated to ${currentYear} in ${yearElements.length} elements`, consoleStyles.success);
    } else {
        console.warn('%c ⚠️ No copyright year elements found', consoleStyles.warning);
    }
}

/**
 * Main initialization function
 */
function init() {
    console.group('%c 🧠 Initializing Website', consoleStyles.title);
    console.time('Website initialization');

    // Set copyright year
    updateCopyrightYear();

    // Initialize contact form
    initContactForm();

    // Load publications
    console.log('%c 📚 Starting publications loading process...', consoleStyles.info);
    injectPublications();

    console.timeEnd('Website initialization');
    console.log('%c 🎉 Website initialization completed!', consoleStyles.success);
    console.groupEnd();
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('%c 🌐 DOM fully loaded and ready', consoleStyles.info);
    init();
});