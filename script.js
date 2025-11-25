
const intro = document.getElementById("intro-screen");
const envelope = document.getElementById("envelope");
const main = document.getElementById("main");

const carousel = document.getElementById("carousel");
const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");

let envelopeOpened = false;

function getGreetingEmoji() {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) return "🌅"; 
  if (hour >= 12 && hour < 17) return "☀️"; 
  if (hour >= 17 && hour < 21) return "🌆"; 
  return "🌙"; 
}

function updateGreeting() {
  const greetingBadge = document.querySelector(".greeting-badge");
  if (greetingBadge) {
    const hour = new Date().getHours();
    let greeting = "Hello";
    
    if (hour >= 5 && hour < 12) greeting = "Good Morning";
    else if (hour >= 12 && hour < 17) greeting = "Good Afternoon";
    else if (hour >= 17 && hour < 21) greeting = "Good Evening";
    else greeting = "Good Night";
    
    const greetingText = greetingBadge.querySelector("span:last-child");
    if (greetingText) {
      greetingText.textContent = `${greeting}, I'm`;
    }
  }
}


function createConfetti(x, y, count = 30) {
  const colors = ['#2e5fa8', '#cddcff', '#ffd93d', '#ff6b9d', '#c084fc', '#4ade80'];
  
  for (let i = 0; i < count; i++) {
    const confetti = document.createElement('div');
    confetti.style.position = 'fixed';
    confetti.style.left = x + 'px';
    confetti.style.top = y + 'px';
    confetti.style.width = '10px';
    confetti.style.height = '10px';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
    confetti.style.pointerEvents = 'none';
    confetti.style.zIndex = '9999';
    confetti.textContent = Math.random() > 0.7 ? '✦' : '';
    confetti.style.fontSize = '12px';
    
    document.body.appendChild(confetti);
    
    const angle = Math.random() * Math.PI * 2;
    const velocity = 2 + Math.random() * 4;
    const vx = Math.cos(angle) * velocity;
    const vy = Math.sin(angle) * velocity - 5;
    
    animateConfetti(confetti, vx, vy);
  }
}

function animateConfetti(element, vx, vy) {
  let x = parseFloat(element.style.left);
  let y = parseFloat(element.style.top);
  let velocityX = vx;
  let velocityY = vy;
  let opacity = 1;
  let rotation = 0;
  
  function update() {
    velocityY += 0.3; 
    x += velocityX;
    y += velocityY;
    rotation += 5;
    opacity -= 0.015;
    
    element.style.left = x + 'px';
    element.style.top = y + 'px';
    element.style.opacity = opacity;
    element.style.transform = `rotate(${rotation}deg)`;
    
    if (opacity > 0 && y < window.innerHeight) {
      requestAnimationFrame(update);
    } else {
      element.remove();
    }
  }
  
  requestAnimationFrame(update);
}

let sparkleEnabled = false;

function createSparkle(x, y) {
  if (!sparkleEnabled) return;
  
  const sparkle = document.createElement('div');
  sparkle.textContent = '✦';
  sparkle.style.position = 'fixed';
  sparkle.style.left = x + 'px';
  sparkle.style.top = y + 'px';
  sparkle.style.fontSize = '12px';
  sparkle.style.color = '#2e5fa8';
  sparkle.style.pointerEvents = 'none';
  sparkle.style.zIndex = '9999';
  sparkle.style.opacity = '0';
  sparkle.style.animation = 'sparkleFloat 1.5s ease-out forwards';
  
  document.body.appendChild(sparkle);
  
  setTimeout(() => sparkle.remove(), 1500);
}

if (!document.querySelector('#sparkle-animation')) {
  const style = document.createElement('style');
  style.id = 'sparkle-animation';
  style.textContent = `
    @keyframes sparkleFloat {
      0% {
        opacity: 1;
        transform: translateY(0) scale(0);
      }
      50% {
        opacity: 1;
        transform: translateY(-20px) scale(1);
      }
      100% {
        opacity: 0;
        transform: translateY(-40px) scale(0);
      }
    }
  `;
  document.head.appendChild(style);
}


document.addEventListener('mousemove', (e) => {
  const target = e.target;
  if (target.closest('.profile-pic-frame, .envelope-container, .spotify-card')) {
    if (Math.random() > 0.85) {
      createSparkle(e.clientX + (Math.random() - 0.5) * 20, e.clientY + (Math.random() - 0.5) * 20);
    }
  }
});


function openEnvelope() {
  if (envelopeOpened) return; 
  envelopeOpened = true;

  envelope.classList.add("opened");

  const rect = envelope.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  
  setTimeout(() => {
    createConfetti(centerX, centerY, 40);
  }, 400);

  setTimeout(() => {
    intro.style.transition = "opacity 0.7s ease";
    intro.style.opacity = "0";
  }, 600);

  setTimeout(() => {
    intro.classList.add("hidden");
    intro.style.display = "none";
    main.classList.remove("hidden");
    main.style.opacity = "1";
    window.scrollTo({ top: 0, behavior: "smooth" });

    updateGreeting();       
    sparkleEnabled = true;
  }, 1300);
}

envelope.addEventListener("click", openEnvelope);

envelope.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    openEnvelope();
  }
});

setTimeout(() => {
  if (!envelopeOpened) {
    openEnvelope();
  }
}, 8000);


function typeWriter(element, text, speed = 50) {
  if (!element) return;
  
  let i = 0;
  element.textContent = '';
  element.style.opacity = '1';
  
  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  
  type();
}

const landingObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && envelopeOpened) {
      const tagline = entry.target.querySelector('.tagline');
      if (tagline && !tagline.dataset.typed) {
        tagline.dataset.typed = 'true';
        const originalText = tagline.textContent;
        typeWriter(tagline, originalText, 30);
      }
    }
  });
}, { threshold: 0.5 });

window.addEventListener('load', () => {
  const landing = document.querySelector('.landing');
  if (landing) landingObserver.observe(landing);
});


document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", (event) => {
    const href = link.getAttribute("href");
    const target = document.querySelector(href);
    
    if (!target) return;

    event.preventDefault();


    if (!envelopeOpened) {
      openEnvelope();
      setTimeout(() => {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 1400);
    } 
    else {

      const offset = target.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: offset, behavior: "smooth" });
    }
  });
});

const sections = document.querySelectorAll(".section");
const navLinks = document.querySelectorAll(".nav-link-item");

window.addEventListener("scroll", () => {
  let current = "";
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 150;
    const sectionHeight = section.clientHeight;
    
    if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
      current = section.getAttribute("id");
    }
  });
  
  navLinks.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
      link.style.background = "rgba(255, 255, 255, 0.15)";
    } else {
      link.style.background = "";
    }
  });
});

function createScrollProgress() {
  const progressBar = document.createElement('div');
  progressBar.id = 'scroll-progress';
  progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 3px;
    background: linear-gradient(90deg, #2e5fa8, #c084fc);
    z-index: 9999;
    transition: width 0.1s ease;
    width: 0%;
  `;
  document.body.appendChild(progressBar);
  
  window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;
    progressBar.style.width = scrolled + '%';
  });
}

createScrollProgress();

document.querySelectorAll('.skill-badge').forEach(badge => {
  badge.addEventListener('click', () => {
    const skill = badge.textContent.trim();
    
   
    const notification = document.createElement('div');
    notification.textContent = `💡 Love ${skill} too? Let's connect!`;
    notification.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) scale(0);
      background: linear-gradient(135deg, #2e5fa8, #0b2340);
      color: white;
      padding: 20px 30px;
      border-radius: 16px;
      font-size: 16px;
      font-weight: 600;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
      z-index: 9999;
      animation: popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    `;
    
    document.body.appendChild(notification);
    
    const popStyle = document.createElement('style');
    popStyle.textContent = `
      @keyframes popIn {
        to {
          transform: translate(-50%, -50%) scale(1);
        }
      }
      @keyframes popOut {
        to {
          transform: translate(-50%, -50%) scale(0);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(popStyle);
    
    setTimeout(() => {
      notification.style.animation = 'popOut 0.3s ease forwards';
      setTimeout(() => notification.remove(), 300);
    }, 2000);
    

    const rect = badge.getBoundingClientRect();
    createConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2, 15);
  });
});

let isDragging = false;
let dragStartX = 0;
let scrollStartLeft = 0;

carousel.addEventListener("mousedown", (e) => {
  isDragging = true;
  dragStartX = e.pageX;
  scrollStartLeft = carousel.scrollLeft;
  carousel.style.cursor = "grabbing";
  carousel.style.userSelect = "none";
});

carousel.addEventListener("mouseup", () => {
  isDragging = false;
  carousel.style.cursor = "grab";
});

carousel.addEventListener("mouseleave", () => {
  isDragging = false;
  carousel.style.cursor = "grab";
});

carousel.addEventListener("mousemove", (e) => {
  if (!isDragging) return;
  e.preventDefault();
  const walk = (e.pageX - dragStartX) * 1.8;
  carousel.scrollLeft = scrollStartLeft - walk;
});

carousel.addEventListener("touchstart", (e) => {
  dragStartX = e.touches[0].pageX;
  scrollStartLeft = carousel.scrollLeft;
}, { passive: true });

carousel.addEventListener("touchmove", (e) => {
  const touchX = e.touches[0].pageX;
  const walk = (touchX - dragStartX) * 1.8;
  carousel.scrollLeft = scrollStartLeft - walk;
}, { passive: true });

const scrollAmount = 370;

leftBtn.addEventListener("click", () => {
  carousel.scrollBy({
    left: -scrollAmount,
    behavior: "smooth"
  });
  
  leftBtn.style.transform = "translateY(-50%) scale(0.9)";
  setTimeout(() => {
    leftBtn.style.transform = "translateY(-50%) scale(1)";
  }, 150);
});

rightBtn.addEventListener("click", () => {
  carousel.scrollBy({
    left: scrollAmount,
    behavior: "smooth"
  });

  rightBtn.style.transform = "translateY(-50%) scale(0.9)";
  setTimeout(() => {
    rightBtn.style.transform = "translateY(-50%) scale(1)";
  }, 150);
});

carousel.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") {
    carousel.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  } else if (e.key === "ArrowRight") {
    carousel.scrollBy({ left: scrollAmount, behavior: "smooth" });
  }
});

function updateArrowVisibility() {
  if (!leftBtn || !rightBtn) return;
  
  const atStart = carousel.scrollLeft <= 10;
  const atEnd = carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 10;
  
  leftBtn.style.opacity = atStart ? "0.3" : "1";
  leftBtn.style.pointerEvents = atStart ? "none" : "auto";
  
  rightBtn.style.opacity = atEnd ? "0.3" : "1";
  rightBtn.style.pointerEvents = atEnd ? "none" : "auto";
}

carousel.addEventListener("scroll", updateArrowVisibility);
window.addEventListener("load", updateArrowVisibility);
window.addEventListener("resize", updateArrowVisibility);

document.querySelectorAll('.spotify-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.boxShadow = '0 20px 60px rgba(46, 95, 168, 0.3)';
  });
  
  card.addEventListener('mouseleave', () => {
    card.style.boxShadow = '';
  });
});


document.querySelectorAll('.mini-card').forEach(card => {
  card.addEventListener('click', () => {
    const rect = card.getBoundingClientRect();
    createConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2, 10);
    
    card.style.transform = 'translateX(8px) scale(1.02)';
    setTimeout(() => {
      card.style.transform = '';
    }, 200);
  });
});

const revealTargets = document.querySelectorAll(
  ".section, .spotify-card, .notebook-page, .landing, .group, .mini-card, .interest-item"
);

function revealOnScroll() {
  const triggerPoint = window.innerHeight * 0.85;

  revealTargets.forEach((el, index) => {
    const rect = el.getBoundingClientRect().top;

    if (rect < triggerPoint) {
      setTimeout(() => {
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      }, index * 50); // Staggered delay
    }
  });
}

revealTargets.forEach((el) => {
  el.style.opacity = "0"; 
  el.style.transform = "translateY(40px)";
  el.style.transition = "opacity 0.6s ease, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)";
});

window.addEventListener("scroll", debounce(revealOnScroll, 50));
window.addEventListener("load", revealOnScroll);

setTimeout(revealOnScroll, 100);

const observerOptions = {
  threshold: 0.3,
  rootMargin: "0px"
};

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
      
      if (entry.target.id === 'projects') {
        animateProjectCards();
      }
    }
  });
}, observerOptions);

sections.forEach(section => {
  sectionObserver.observe(section);
});

function animateProjectCards() {
  const cards = document.querySelectorAll('.spotify-card');
  cards.forEach((card, index) => {
    setTimeout(() => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, index * 100);
  });
}


const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
  if (e.key === konamiCode[konamiIndex]) {
    konamiIndex++;
    
    if (konamiIndex === konamiCode.length) {
      activatePartyMode();
      konamiIndex = 0;
    }
  } else {
    konamiIndex = 0;
  }
});

function activatePartyMode() {
  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      createConfetti(Math.random() * window.innerWidth, Math.random() * window.innerHeight / 2, 50);
    }, i * 200);
  }
  
  const message = document.createElement('div');
  message.textContent = 'PARTY MODE ACTIVATED! 🎉';
  message.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: linear-gradient(135deg, #ff6b9d, #c084fc);
    color: white;
    padding: 30px 50px;
    border-radius: 20px;
    font-size: 24px;
    font-weight: 700;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
    z-index: 9999;
    animation: rainbow 2s linear infinite;
  `;
  
  document.body.appendChild(message);
  
  setTimeout(() => {
    message.style.opacity = '0';
    message.style.transition = 'opacity 0.5s ease';
    setTimeout(() => message.remove(), 500);
  }, 3000);
  
  console.log('You found the secret! You must be a developer too! 🎊');
}


const imagesToPreload = [
  "assets/lovejump.jpg",
  "assets/travelbuddy.jpg",
  "assets/passwordtracker.jpg",
  "assets/galaxywordle.jpg",
  "assets/profile.png"
];

imagesToPreload.forEach(src => {
  const img = new Image();
  img.src = src;
});


document.querySelectorAll(".album-btn").forEach(btn => {
  btn.addEventListener("click", (e) => {
    const href = btn.getAttribute("href");
    
    if (!href || href.includes("yourusername") || href === "#") {
      e.preventDefault();
      
      const notification = document.createElement('div');
      notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px;">
          <span style="font-size: 24px;">🔗</span>
          <div>
            <strong>Link Coming Soon!</strong><br>
            <small>This project link will be added shortly</small>
          </div>
        </div>
      `;
      notification.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: linear-gradient(135deg, #2e5fa8, #0b2340);
        color: white;
        padding: 20px 25px;
        border-radius: 16px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        z-index: 9999;
        animation: slideInRight 0.4s ease;
        font-family: 'Inter', sans-serif;
      `;
      
      const slideStyle = document.createElement('style');
      slideStyle.textContent = `
        @keyframes slideInRight {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `;
      document.head.appendChild(slideStyle);
      
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => notification.remove(), 300);
      }, 3000);
    }
  });
});

if (!('scrollBehavior' in document.documentElement.style)) {
  const smoothScrollPolyfill = document.createElement('script');
  smoothScrollPolyfill.src = 'https://cdn.jsdelivr.net/npm/smoothscroll-polyfill@0.4.4/dist/smoothscroll.min.js';
  document.head.appendChild(smoothScrollPolyfill);
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Tab") {
    document.body.classList.add("keyboard-nav");
  }
});

document.addEventListener("mousedown", () => {
  document.body.classList.remove("keyboard-nav");
});

function announceToScreenReader(message) {
  const announcement = document.createElement("div");
  announcement.setAttribute("role", "status");
  announcement.setAttribute("aria-live", "polite");
  announcement.className = "sr-only";
  announcement.textContent = message;
  document.body.appendChild(announcement);
  
  setTimeout(() => announcement.remove(), 1000);
}

envelope.addEventListener("click", () => {
  if (!envelopeOpened) {
    announceToScreenReader("Portfolio opened. Welcome to Anushka's creative space!");
  }
});


function debounce(func, wait = 10) {
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

function createBackToTop() {
  const btn = document.createElement('button');
  btn.innerHTML = '↑';
  btn.id = 'back-to-top';
  btn.setAttribute('aria-label', 'Back to top');
  btn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    background: linear-gradient(135deg, #2e5fa8, #0b2340);
    color: white;
    border: none;
    border-radius: 50%;
    font-size: 24px;
    cursor: pointer;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 1000;
  `;
  
  document.body.appendChild(btn);
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      btn.style.opacity = '1';
      btn.style.visibility = 'visible';
    } else {
      btn.style.opacity = '0';
      btn.style.visibility = 'hidden';
    }
  });
  
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
 
    const rect = btn.getBoundingClientRect();
    createConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2, 20);
  });
  
  btn.addEventListener('mouseenter', () => {
    btn.style.transform = 'scale(1.1) rotate(180deg)';
  });
  
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = 'scale(1) rotate(0deg)';
  });
}

createBackToTop();

console.log(
  "%c👋 Welcome to Anushka's Portfolio! ",
  "background: linear-gradient(135deg, #2e5fa8, #c084fc); color: #fff; padding: 12px 24px; font-size: 18px; border-radius: 8px; font-weight: bold;"
);
console.log(
  "%c✨ Built with ❤️ using HTML, CSS, and Vanilla JavaScript",
  "color: #2e5fa8; font-size: 14px; font-style: italic; padding: 8px 0;"
);
console.log(
  "%c🎮 Try the Konami Code for a surprise! (↑ ↑ ↓ ↓ ← → ← → B A)",
  "color: #c084fc; font-size: 12px; padding: 8px 0;"
);


window.addEventListener('load', () => {
  console.log('🚀 Portfolio loaded successfully!');
  
  setTimeout(() => {
    document.body.style.opacity = '1';
  }, 100);
  
  updateGreeting();
});

const DEBUG = false;

if (DEBUG) {
  console.log("🔍 Debug Mode Active");
  
  envelope.addEventListener("click", () => {
    console.log("Envelope state:", envelopeOpened);
  });
  
  carousel.addEventListener("scroll", () => {
    console.log("Carousel position:", carousel.scrollLeft);
  });
  
  window.addEventListener('scroll', debounce(() => {
    console.log("Scroll position:", window.scrollY);
  }, 500));

}
