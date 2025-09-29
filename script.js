// DOM elements
const navButtons = document.querySelectorAll('.nav-btn');
const menuItems = document.querySelectorAll('.menu-item');
const menuGrid = document.getElementById('menuGrid');

// Initialize the menu
document.addEventListener('DOMContentLoaded', function() {
    // Add click event listeners to navigation buttons
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            filterMenu(category);
            
            // Update active button
            navButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Add smooth scrolling for better UX
    addSmoothScrolling();
    
    // Add intersection observer for animations
    addIntersectionObserver();
    
    // Add search functionality (bonus feature)
    addSearchFunctionality();
});

// Filter menu items based on category
function filterMenu(category) {
    const items = Array.from(menuItems);
    
    // Add loading state
    menuGrid.style.opacity = '0.5';
    
    setTimeout(() => {
        items.forEach(item => {
            const itemCategory = item.getAttribute('data-category');
            
            if (category === 'all' || itemCategory === category) {
                item.classList.remove('hidden');
                item.classList.add('animate-in');
            } else {
                item.classList.add('hidden');
                item.classList.remove('animate-in');
            }
        });
        
        // Remove loading state
        menuGrid.style.opacity = '1';
        
        // Scroll to menu
        menuGrid.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }, 200);
}

// Add smooth scrolling behavior
function addSmoothScrolling() {
    // Smooth scroll for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Add intersection observer for scroll animations
function addIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe menu items for scroll animations
    menuItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(item);
    });
}

// Add search functionality
function addSearchFunctionality() {
    // Create search input
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    searchContainer.innerHTML = `
        <div class="search-box">
            <i class="fas fa-search"></i>
            <input type="text" id="menuSearch" placeholder="Поиск блюд...">
            <button id="clearSearch" class="clear-btn" style="display: none;">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

    // Insert search box after hero section
    const heroSection = document.querySelector('.hero-section');
    heroSection.insertAdjacentElement('afterend', searchContainer);

    // Add search styles
    const searchStyles = `
        <style>
            .search-container {
                max-width: 600px;
                margin: 0 auto 2rem auto;
                padding: 0 20px;
            }
            
            .search-box {
                position: relative;
                display: flex;
                align-items: center;
                background: white;
                border-radius: 25px;
                padding: 0.5rem 1rem;
                box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                border: 2px solid transparent;
                transition: all 0.3s ease;
            }
            
            .search-box:focus-within {
                border-color: #e74c3c;
                box-shadow: 0 5px 20px rgba(231, 76, 60, 0.2);
            }
            
            .search-box i {
                color: #6c757d;
                margin-right: 0.5rem;
            }
            
            .search-box input {
                flex: 1;
                border: none;
                outline: none;
                padding: 0.5rem;
                font-size: 1rem;
                background: transparent;
            }
            
            .clear-btn {
                background: none;
                border: none;
                color: #6c757d;
                cursor: pointer;
                padding: 0.25rem;
                border-radius: 50%;
                transition: all 0.3s ease;
            }
            
            .clear-btn:hover {
                background: #f8f9fa;
                color: #e74c3c;
            }
            
            @media (max-width: 768px) {
                .search-container {
                    margin: 0 20px 2rem 20px;
                }
            }
        </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', searchStyles);

    // Add search functionality
    const searchInput = document.getElementById('menuSearch');
    const clearBtn = document.getElementById('clearSearch');

    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        
        if (searchTerm) {
            clearBtn.style.display = 'block';
            performSearch(searchTerm);
        } else {
            clearBtn.style.display = 'none';
            showAllItems();
        }
    });

    clearBtn.addEventListener('click', function() {
        searchInput.value = '';
        this.style.display = 'none';
        showAllItems();
        
        // Reset navigation
        navButtons.forEach(btn => btn.classList.remove('active'));
        navButtons[0].classList.add('active'); // "Все блюда" button
    });
}

// Perform search
function performSearch(searchTerm) {
    menuItems.forEach(item => {
        const title = item.querySelector('h3').textContent.toLowerCase();
        const description = item.querySelector('.description').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || description.includes(searchTerm)) {
            item.classList.remove('hidden');
            item.style.display = 'block';
        } else {
            item.classList.add('hidden');
            item.style.display = 'none';
        }
    });
}

// Show all items
function showAllItems() {
    menuItems.forEach(item => {
        item.classList.remove('hidden');
        item.style.display = 'block';
    });
}

// Add keyboard navigation
document.addEventListener('keydown', function(e) {
    // Press 'Escape' to clear search
    if (e.key === 'Escape') {
        const searchInput = document.getElementById('menuSearch');
        const clearBtn = document.getElementById('clearSearch');
        
        if (searchInput && searchInput.value) {
            searchInput.value = '';
            clearBtn.style.display = 'none';
            showAllItems();
            
            // Reset navigation
            navButtons.forEach(btn => btn.classList.remove('active'));
            navButtons[0].classList.add('active');
        }
    }
    
    // Press 'Ctrl+F' to focus search
    if (e.ctrlKey && e.key === 'f') {
        e.preventDefault();
        const searchInput = document.getElementById('menuSearch');
        if (searchInput) {
            searchInput.focus();
        }
    }
});

// Add touch/swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const swipeDistance = touchEndX - touchStartX;
    
    if (Math.abs(swipeDistance) > swipeThreshold) {
        if (swipeDistance > 0) {
            // Swipe right - go to previous category
            switchToPreviousCategory();
        } else {
            // Swipe left - go to next category
            switchToNextCategory();
        }
    }
}

function switchToPreviousCategory() {
    const activeIndex = Array.from(navButtons).findIndex(btn => btn.classList.contains('active'));
    const prevIndex = activeIndex > 0 ? activeIndex - 1 : navButtons.length - 1;
    
    navButtons.forEach(btn => btn.classList.remove('active'));
    navButtons[prevIndex].classList.add('active');
    
    const category = navButtons[prevIndex].getAttribute('data-category');
    filterMenu(category);
}

function switchToNextCategory() {
    const activeIndex = Array.from(navButtons).findIndex(btn => btn.classList.contains('active'));
    const nextIndex = activeIndex < navButtons.length - 1 ? activeIndex + 1 : 0;
    
    navButtons.forEach(btn => btn.classList.remove('active'));
    navButtons[nextIndex].classList.add('active');
    
    const category = navButtons[nextIndex].getAttribute('data-category');
    filterMenu(category);
}

// Add lazy loading for images
function addLazyLoading() {
    const images = document.querySelectorAll('.item-image img');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.style.opacity = '0';
                img.style.transition = 'opacity 0.3s ease';
                
                img.onload = function() {
                    img.style.opacity = '1';
                };
                
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading when DOM is ready
document.addEventListener('DOMContentLoaded', addLazyLoading);

// Add performance optimization
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

// Optimize search with debouncing
const debouncedSearch = debounce((searchTerm) => {
    performSearch(searchTerm);
}, 300);

// Update search input listener to use debounced search
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('menuSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            const clearBtn = document.getElementById('clearSearch');
            
            if (searchTerm) {
                clearBtn.style.display = 'block';
                debouncedSearch(searchTerm);
            } else {
                clearBtn.style.display = 'none';
                showAllItems();
            }
        });
    }
});
