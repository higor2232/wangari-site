// Toggle Sidebar
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.querySelector('.main-content');

    // A classe 'open' será usada para controlar a visibilidade em todas as telas.
    // O CSS já está preparado para lidar com isso de forma responsiva.
    sidebar.classList.toggle('open');

    // A lógica de 'collapsed' e 'expanded' pode ser simplificada ou removida
    // se o CSS for ajustado para usar apenas 'open'.
    // Por enquanto, vamos manter a compatibilidade com a lógica de desktop existente.
    if (window.innerWidth > 768) {
        if (sidebar.classList.contains('open')) {
            sidebar.classList.remove('collapsed');
            mainContent.classList.remove('expanded');
        } else {
            sidebar.classList.add('collapsed');
            mainContent.classList.add('expanded');
        }
    }
}

// Animated Counter for Statistics
function animateCounter() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const increment = target / 100;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current).toLocaleString('pt-BR');
                setTimeout(updateCounter, 20);
            } else {
                counter.textContent = target.toLocaleString('pt-BR');
            }
        };
        
        updateCounter();
    });
}

// Tree Benefits Calculator
function calculateTreeBenefits() {
    const input = document.getElementById('treeCount');
    const results = document.getElementById('calculatorResults');
    const count = parseInt(input.value);
    
    if (isNaN(count) || count <= 0) {
        alert('Por favor, insira um número válido de árvores.');
        return;
    }
    
    // Cálculos baseados em dados médios
    const co2PerTree = 22; // kg de CO2 por ano por árvore
    const oxygenPerTree = 117; // kg de O2 por ano por árvore
    const waterPerTree = 1000; // litros de água filtrada por ano
    const temperatureReduction = count * 0.01; // redução aproximada em °C
    
    const totalCO2 = count * co2PerTree;
    const totalOxygen = count * oxygenPerTree;
    const totalWater = count * waterPerTree;
    const peopleSupported = Math.floor(totalOxygen / 840); // 840kg O2 por pessoa/ano
    
    // Atualizar resultados
    document.getElementById('co2Result').textContent = totalCO2.toLocaleString('pt-BR');
    document.getElementById('oxygenResult').textContent = totalOxygen.toLocaleString('pt-BR');
    document.getElementById('waterResult').textContent = totalWater.toLocaleString('pt-BR');
    document.getElementById('peopleResult').textContent = peopleSupported.toLocaleString('pt-BR');
    document.getElementById('tempResult').textContent = temperatureReduction.toFixed(1).replace('.', ',');
    
    results.classList.add('show');
}

// Initialize animations when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Animate counters when they come into view
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('stats')) {
                    animateCounter();
                    observer.unobserve(entry.target);
                }
            }
        });
    }, observerOptions);
    
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        observer.observe(statsSection);
    }
    
    // Add smooth scrolling
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
    
    // Active menu item based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.sidebar-nav a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });

    // Quote Carousel
    const quoteCarousel = document.getElementById('quote-carousel');
    if (quoteCarousel) {
        const quotes = quoteCarousel.querySelectorAll('.quote-item');
        const prevButton = document.getElementById('quote-prev');
        const nextButton = document.getElementById('quote-next');
        let currentQuoteIndex = 0;
        let quoteInterval;

        const showQuote = (index) => {
            quotes.forEach(quote => quote.classList.remove('active'));
            quotes[index].classList.add('active');
        };

        const nextQuote = () => {
            currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
            showQuote(currentQuoteIndex);
        };

        const prevQuote = () => {
            currentQuoteIndex = (currentQuoteIndex - 1 + quotes.length) % quotes.length;
            showQuote(currentQuoteIndex);
        };

        const startCarousel = () => {
            quoteInterval = setInterval(nextQuote, 5000); // Troca a cada 5 segundos
        };

        const resetCarousel = () => {
            clearInterval(quoteInterval);
            startCarousel();
        };

        nextButton.addEventListener('click', () => {
            nextQuote();
            resetCarousel();
        });

        prevButton.addEventListener('click', () => {
            prevQuote();
            resetCarousel();
        });

        startCarousel(); // Inicia o carrossel automaticamente
    }

    // Image Modal Logic
    const modal = document.getElementById('imageModal');
    if (modal) {
        const modalImg = document.getElementById('modalImage');
        const captionText = document.getElementById('modalCaption');
        const clickableImages = document.querySelectorAll('.project-image-clickable');

        clickableImages.forEach(img => {
            img.onclick = function() {
                modal.style.display = 'block';
                modalImg.src = this.src;
                
                // Encontra os detalhes do card do projeto
                const card = this.closest('.project-card');
                const title = card.querySelector('h3').innerText;
                const description = card.querySelector('p').innerText;
                captionText.innerHTML = `<h3>${title}</h3><p>${description}</p>`;
            }
        });

        const closeBtn = document.querySelector('.close-button');
        closeBtn.onclick = function() {
            modal.style.display = 'none';
        }

        // Fecha o modal ao clicar fora da imagem
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        }
    }
});

// Mobile sidebar handling
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
    const sidebar = document.getElementById('sidebar');
    const swipeThreshold = 100;
    
    if (touchEndX - touchStartX > swipeThreshold) {
        // Swipe right - open sidebar
        sidebar.classList.remove('collapsed');
        sidebar.classList.add('open');
    } else if (touchStartX - touchEndX > swipeThreshold) {
        // Swipe left - close sidebar
        sidebar.classList.add('collapsed');
        sidebar.classList.remove('open');
    }
}
