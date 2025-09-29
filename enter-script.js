// Global variables
let qrScanner = null;
let isScanning = false;

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    generateQRCode();
    initializeEventListeners();
    addAnimations();
});

// Generate QR code for menu access
function generateQRCode() {
    const qrCodeElement = document.getElementById('qrCode');
    const menuUrl = window.location.origin + '/index.html';
    
    // Generate QR code with high quality settings
    QRCode.toCanvas(qrCodeElement, menuUrl, {
        width: 200,
        height: 200,
        margin: 2,
        color: {
            dark: '#2c3e50',
            light: '#ffffff'
        },
        errorCorrectionLevel: 'M'
    }, function (error) {
        if (error) {
            console.error('QR Code generation error:', error);
            qrCodeElement.innerHTML = `
                <div style="color: #e74c3c; text-align: center;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 1rem;"></i>
                    <p>Ошибка генерации QR-кода</p>
                    <p style="font-size: 0.8rem;">Попробуйте обновить страницу</p>
                </div>
            `;
        } else {
            console.log('QR Code generated successfully');
        }
    });
}

// Initialize event listeners
function initializeEventListeners() {
    // Modal close on outside click
    document.getElementById('instructionsModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeInstructions();
        }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeInstructions();
            if (isScanning) {
                stopQRScanner();
            }
        }
    });

    // Check for camera permissions on page load
    checkCameraPermissions();
}

// Add entrance animations
function addAnimations() {
    const sections = document.querySelectorAll('.qr-section, .direct-entry-section, .scanner-section');
    
    sections.forEach((section, index) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            section.style.transition = 'all 0.6s ease';
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }, index * 200);
    });
}

// Show QR scanning instructions
function showQRInstructions() {
    const modal = document.getElementById('instructionsModal');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Animate modal content
    const modalContent = modal.querySelector('.modal-content');
    modalContent.style.opacity = '0';
    modalContent.style.transform = 'translateY(-20px)';
    
    setTimeout(() => {
        modalContent.style.transition = 'all 0.3s ease';
        modalContent.style.opacity = '1';
        modalContent.style.transform = 'translateY(0)';
    }, 10);
}

// Close instructions modal
function closeInstructions() {
    const modal = document.getElementById('instructionsModal');
    const modalContent = modal.querySelector('.modal-content');
    
    modalContent.style.opacity = '0';
    modalContent.style.transform = 'translateY(-20px)';
    
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }, 300);
}

// Direct menu entry
function enterMenu() {
    showLoadingOverlay();
    
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

// Show loading overlay
function showLoadingOverlay() {
    const overlay = document.getElementById('loadingOverlay');
    overlay.style.display = 'block';
    
    // Add fade-in animation
    overlay.style.opacity = '0';
    setTimeout(() => {
        overlay.style.transition = 'opacity 0.3s ease';
        overlay.style.opacity = '1';
    }, 10);
}

// Hide loading overlay
function hideLoadingOverlay() {
    const overlay = document.getElementById('loadingOverlay');
    overlay.style.opacity = '0';
    
    setTimeout(() => {
        overlay.style.display = 'none';
    }, 300);
}

// Start QR scanner
async function startQRScanner() {
    const video = document.getElementById('scanner');
    const startBtn = document.getElementById('startScanner');
    const stopBtn = document.getElementById('stopScanner');
    const resultDiv = document.getElementById('scannerResult');
    
    try {
        // Check if QR Scanner is available
        if (!window.QrScanner) {
            throw new Error('QR Scanner library not loaded');
        }

        // Create QR scanner instance
        qrScanner = new QrScanner(
            video,
            result => handleQRResult(result),
            {
                highlightScanRegion: true,
                highlightCodeOutline: true,
                preferredCamera: 'environment' // Use back camera on mobile
            }
        );

        // Start scanning
        await qrScanner.start();
        
        isScanning = true;
        startBtn.style.display = 'none';
        stopBtn.style.display = 'inline-flex';
        
        // Clear previous results
        resultDiv.style.display = 'none';
        resultDiv.className = 'scanner-result';
        
        console.log('QR Scanner started successfully');
        
    } catch (error) {
        console.error('Error starting QR scanner:', error);
        showScannerError('Не удалось запустить сканер. Проверьте разрешения камеры.');
    }
}

// Stop QR scanner
function stopQRScanner() {
    const startBtn = document.getElementById('startScanner');
    const stopBtn = document.getElementById('stopScanner');
    
    if (qrScanner) {
        qrScanner.stop();
        qrScanner.destroy();
        qrScanner = null;
    }
    
    isScanning = false;
    startBtn.style.display = 'inline-flex';
    stopBtn.style.display = 'none';
    
    console.log('QR Scanner stopped');
}

// Handle QR scan result
function handleQRResult(result) {
    console.log('QR Code scanned:', result);
    
    const resultDiv = document.getElementById('scannerResult');
    
    // Check if the scanned URL is our menu URL
    const menuUrl = window.location.origin + '/index.html';
    const currentUrl = window.location.origin + window.location.pathname.replace('enter.html', 'index.html');
    
    if (result.includes('index.html') || result.includes('menu') || result === menuUrl || result === currentUrl) {
        showScannerSuccess('QR-код распознан! Переходим к меню...');
        
        setTimeout(() => {
            stopQRScanner();
            showLoadingOverlay();
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        }, 1000);
    } else {
        showScannerError('Неверный QR-код. Пожалуйста, отсканируйте код меню ресторана.');
    }
}

// Show scanner success message
function showScannerSuccess(message) {
    const resultDiv = document.getElementById('scannerResult');
    resultDiv.className = 'scanner-result success';
    resultDiv.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    resultDiv.style.display = 'block';
}

// Show scanner error message
function showScannerError(message) {
    const resultDiv = document.getElementById('scannerResult');
    resultDiv.className = 'scanner-result error';
    resultDiv.innerHTML = `
        <i class="fas fa-exclamation-triangle"></i>
        <span>${message}</span>
    `;
    resultDiv.style.display = 'block';
    
    // Hide error message after 5 seconds
    setTimeout(() => {
        resultDiv.style.display = 'none';
    }, 5000);
}

// Check camera permissions
async function checkCameraPermissions() {
    try {
        // Check if getUserMedia is supported
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            console.log('Camera not supported on this device');
            return;
        }

        // Check camera permissions
        const permissions = await navigator.permissions.query({ name: 'camera' });
        
        if (permissions.state === 'denied') {
            console.log('Camera access denied');
            showCameraPermissionNotice();
        } else if (permissions.state === 'granted') {
            console.log('Camera access granted');
        }
        
    } catch (error) {
        console.log('Permission check not supported:', error);
    }
}

// Show camera permission notice
function showCameraPermissionNotice() {
    const scannerSection = document.querySelector('.scanner-section');
    const notice = document.createElement('div');
    notice.className = 'camera-notice';
    notice.innerHTML = `
        <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 10px; padding: 1rem; margin-top: 1rem; color: #856404;">
            <i class="fas fa-info-circle"></i>
            <strong>Доступ к камере ограничен</strong>
            <p style="margin: 0.5rem 0 0 0; font-size: 0.9rem;">
                Для работы сканера QR-кода разрешите доступ к камере в настройках браузера.
            </p>
        </div>
    `;
    
    scannerSection.appendChild(notice);
}

// Handle page visibility change
document.addEventListener('visibilitychange', function() {
    if (document.hidden && isScanning) {
        stopQRScanner();
    }
});

// Handle page unload
window.addEventListener('beforeunload', function() {
    if (isScanning) {
        stopQRScanner();
    }
});

// Add touch support for mobile
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', function(e) {
    touchStartY = e.changedTouches[0].screenY;
});

document.addEventListener('touchend', function(e) {
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const swipeDistance = touchEndY - touchStartY;
    
    if (Math.abs(swipeDistance) > swipeThreshold) {
        if (swipeDistance > 0 && isScanning) {
            // Swipe down to stop scanner
            stopQRScanner();
        }
    }
}

// Add vibration feedback for mobile (if supported)
function vibrate(pattern = 100) {
    if (navigator.vibrate) {
        navigator.vibrate(pattern);
    }
}

// Enhanced QR result handling with vibration
function handleQRResult(result) {
    console.log('QR Code scanned:', result);
    
    // Vibrate on successful scan
    vibrate(200);
    
    const resultDiv = document.getElementById('scannerResult');
    
    // Check if the scanned URL is our menu URL
    const menuUrl = window.location.origin + '/index.html';
    const currentUrl = window.location.origin + window.location.pathname.replace('enter.html', 'index.html');
    
    if (result.includes('index.html') || result.includes('menu') || result === menuUrl || result === currentUrl) {
        showScannerSuccess('QR-код распознан! Переходим к меню...');
        
        // Vibrate success pattern
        vibrate([200, 100, 200]);
        
        setTimeout(() => {
            stopQRScanner();
            showLoadingOverlay();
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        }, 1000);
    } else {
        showScannerError('Неверный QR-код. Пожалуйста, отсканируйте код меню ресторана.');
        
        // Vibrate error pattern
        vibrate([100, 50, 100, 50, 100]);
    }
}

// Add accessibility features
function addAccessibilityFeatures() {
    // Add ARIA labels
    const qrCode = document.getElementById('qrCode');
    if (qrCode) {
        qrCode.setAttribute('aria-label', 'QR-код для доступа к меню ресторана');
        qrCode.setAttribute('role', 'img');
    }
    
    const scanner = document.getElementById('scanner');
    if (scanner) {
        scanner.setAttribute('aria-label', 'Камера для сканирования QR-кода');
    }
    
    // Add keyboard navigation for buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

// Initialize accessibility features
document.addEventListener('DOMContentLoaded', addAccessibilityFeatures);

// Add performance monitoring
function addPerformanceMonitoring() {
    // Monitor page load time
    window.addEventListener('load', function() {
        const loadTime = performance.now();
        console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
        
        // Send analytics if needed
        if (typeof gtag !== 'undefined') {
            gtag('event', 'page_load_time', {
                value: Math.round(loadTime),
                custom_parameter: 'enter_page'
            });
        }
    });
}

// Initialize performance monitoring
document.addEventListener('DOMContentLoaded', addPerformanceMonitoring);

// Add offline detection
function addOfflineDetection() {
    window.addEventListener('online', function() {
        console.log('Connection restored');
        // Hide any offline messages
        const offlineNotice = document.querySelector('.offline-notice');
        if (offlineNotice) {
            offlineNotice.remove();
        }
    });
    
    window.addEventListener('offline', function() {
        console.log('Connection lost');
        showOfflineNotice();
    });
}

function showOfflineNotice() {
    const notice = document.createElement('div');
    notice.className = 'offline-notice';
    notice.innerHTML = `
        <div style="position: fixed; top: 20px; left: 50%; transform: translateX(-50%); background: #f8d7da; color: #721c24; padding: 1rem; border-radius: 10px; z-index: 10000; box-shadow: 0 5px 15px rgba(0,0,0,0.2);">
            <i class="fas fa-wifi" style="margin-right: 0.5rem;"></i>
            Отсутствует подключение к интернету
        </div>
    `;
    
    document.body.appendChild(notice);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        notice.remove();
    }, 5000);
}

// Initialize offline detection
document.addEventListener('DOMContentLoaded', addOfflineDetection);
