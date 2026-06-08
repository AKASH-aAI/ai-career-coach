document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.career-form');
    const sliders = document.querySelectorAll('.slider');
    const submitBtn = document.querySelector('.submit-btn');

    // Initialize all sliders with their values
    sliders.forEach(function(slider) {
        const sliderId = slider.id;
        const valueDisplay = document.getElementById(sliderId + '_value');
        
        if (valueDisplay) {
            valueDisplay.textContent = slider.value;
        }

        // Update value display in real time
        slider.addEventListener('input', function() {
            if (valueDisplay) {
                valueDisplay.textContent = this.value;
                
                // Add pulse animation to value
                valueDisplay.style.transform = 'scale(1.2)';
                valueDisplay.style.color = '#9D4EDD';
                
                setTimeout(function() {
                    valueDisplay.style.transform = 'scale(1)';
                    valueDisplay.style.color = '#6C63FF';
                }, 150);
            }

            // Update slider background gradient based on value
            updateSliderBackground(this);
        });

        // Set initial background
        updateSliderBackground(slider);
    });

    function updateSliderBackground(slider) {
        const value = (slider.value - slider.min) / (slider.max - slider.min) * 100;
        slider.style.background = 'linear-gradient(90deg, #6C63FF 0%, #9D4EDD ' + value + '%, rgba(108, 99, 255, 0.1) ' + value + '%, rgba(108, 99, 255, 0.1) 100%)';
    }

    // Form validation and submission
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Validate all sliders have values
            let isValid = true;
            sliders.forEach(function(slider) {
                const value = parseInt(slider.value);
                if (isNaN(value) || value < 0 || value > 100) {
                    isValid = false;
                    slider.style.border = '2px solid #FF6B6B';
                    slider.style.boxShadow = '0 0 15px rgba(255, 107, 107, 0.5)';
                    
                    setTimeout(function() {
                        slider.style.border = 'none';
                        slider.style.boxShadow = '';
                    }, 2000);
                }
            });

            if (!isValid) {
                shakeElement(form);
                return false;
            }

            // Show loading animation
            showLoading();
            
            // Submit the form
            form.submit();
        });
    }

    function showLoading() {
        if (submitBtn) {
            const originalContent = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<div class="loader"></div><span>Analyzing Your Profile...</span>';
            submitBtn.disabled = true;
            submitBtn.style.cursor = 'wait';
            submitBtn.style.opacity = '0.8';
            
            // Store original content for potential error recovery
            submitBtn.setAttribute('data-original-content', originalContent);
        }
    }

    function hideLoading() {
        if (submitBtn) {
            const originalContent = submitBtn.getAttribute('data-original-content');
            if (originalContent) {
                submitBtn.innerHTML = originalContent;
                submitBtn.disabled = false;
                submitBtn.style.cursor = 'pointer';
                submitBtn.style.opacity = '1';
            }
        }
    }

    // Add shake animation for validation errors
    function shakeElement(element) {
        element.style.animation = 'none';
        element.offsetHeight; // Trigger reflow
        element.style.animation = 'shake 0.5s ease-in-out';
        
        setTimeout(function() {
            element.style.animation = '';
        }, 500);
    }

    // Add custom scroll reveal animation for result page
    const resultCards = document.querySelectorAll('.career-card, .roadmap-section, .error-card');
    
    if (resultCards.length > 0) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        resultCards.forEach(function(card, index) {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.6s ease-out ' + (index * 0.15) + 's, transform 0.6s ease-out ' + (index * 0.15) + 's';
            observer.observe(card);
        });
    }

    // Add smooth hover effects for slider containers
    const sliderContainers = document.querySelectorAll('.slider-container');
    
    sliderContainers.forEach(function(container) {
        container.addEventListener('mouseenter', function() {
            const sliderValue = this.querySelector('.slider-value');
            if (sliderValue) {
                sliderValue.style.backgroundColor = 'rgba(108, 99, 255, 0.2)';
            }
        });

        container.addEventListener('mouseleave', function() {
            const sliderValue = this.querySelector('.slider-value');
            if (sliderValue) {
                sliderValue.style.backgroundColor = 'rgba(108, 99, 255, 0.1)';
            }
        });
    });

    // Add keyboard navigation support for sliders
    sliders.forEach(function(slider) {
        slider.addEventListener('keydown', function(event) {
            const valueDisplay = document.getElementById(this.id + '_value');
            
            if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
                event.preventDefault();
                this.value = Math.min(parseInt(this.value) + 5, parseInt(this.max));
                if (valueDisplay) {
                    valueDisplay.textContent = this.value;
                }
                updateSliderBackground(this);
                this.dispatchEvent(new Event('input', { bubbles: true }));
            } else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
                event.preventDefault();
                this.value = Math.max(parseInt(this.value) - 5, parseInt(this.min));
                if (valueDisplay) {
                    valueDisplay.textContent = this.value;
                }
                updateSliderBackground(this);
                this.dispatchEvent(new Event('input', { bubbles: true }));
            }
        });
    });

    // Add click to set value on slider track
    sliders.forEach(function(slider) {
        slider.addEventListener('click', function(event) {
            const rect = this.getBoundingClientRect();
            const clickPosition = event.clientX - rect.left;
            const percentage = clickPosition / rect.width;
            const value = Math.round(percentage * (parseInt(this.max) - parseInt(this.min)) + parseInt(this.min));
            
            this.value = value;
            const valueDisplay = document.getElementById(this.id + '_value');
            if (valueDisplay) {
                valueDisplay.textContent = value;
            }
            updateSliderBackground(this);
            this.dispatchEvent(new Event('input', { bubbles: true }));
        });
    });

    // Add ripple effect on buttons
    const buttons = document.querySelectorAll('.submit-btn');
    
    buttons.forEach(function(button) {
        button.addEventListener('click', function(event) {
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = event.clientX - rect.left - size / 2;
            const y = event.clientY - rect.top - size / 2;
            
            ripple.style.width = size + 'px';
            ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            button.appendChild(ripple);
            
            setTimeout(function() {
                ripple.remove();
            }, 600);
        });
    });

    // Add particle effect on career card if present
    const careerCard = document.querySelector('.career-card');
    
    if (careerCard) {
        careerCard.addEventListener('mousemove', function(event) {
            const rect = this.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const moveX = (x - centerX) / centerX * 5;
            const moveY = (y - centerY) / centerY * 5;
            
            const careerIcon = this.querySelector('.career-icon');
            if (careerIcon) {
                careerIcon.style.transform = 'translate(' + moveX + 'px, ' + moveY + 'px)';
            }
        });
        
        careerCard.addEventListener('mouseleave', function() {
            const careerIcon = this.querySelector('.career-icon');
            if (careerIcon) {
                careerIcon.style.transform = 'translate(0, 0)';
            }
        });
    }

    // Handle page visibility for loading states
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            // Page is hidden, could pause animations if needed
        } else {
            // Page is visible again, restore any state if needed
            hideLoading();
        }
    });

    // Prevent double submission
    let formSubmitted = false;
    
    if (form) {
        form.addEventListener('submit', function(event) {
            if (formSubmitted) {
                event.preventDefault();
                return false;
            }
            formSubmitted = true;
        });
    }

    // Add CSS for loader and ripple dynamically
    const style = document.createElement('style');
    style.textContent = `
        .loader {
            width: 24px;
            height: 24px;
            border: 3px solid rgba(255, 255, 255, 0.3);
            border-top-color: #ffffff;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: rippleEffect 0.6s ease-out;
            pointer-events: none;
        }
        
        @keyframes rippleEffect {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .submit-btn {
            position: relative;
            overflow: hidden;
        }
    `;
    document.head.appendChild(style);
});