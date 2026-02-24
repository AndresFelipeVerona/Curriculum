gsap.registerPlugin(ScrollTrigger);

// ========================
// HAMBURGER MENU
// ========================
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const nav = document.querySelector('nav');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  // Close menu when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target)) {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
    }
  });
}

// ========================
// CUSTOM CURSOR
// ========================
const cursor = document.getElementById('cursor');
const follower = document.getElementById('follower');
let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  gsap.to(cursor, { x: mouseX - 6, y: mouseY - 6, duration: 0.1 });
});

function animateFollower() {
  followerX += (mouseX - followerX - 18) * 0.1;
  followerY += (mouseY - followerY - 18) * 0.1;
  follower.style.transform = `translate(${followerX}px, ${followerY}px)`;
  requestAnimationFrame(animateFollower);
}
animateFollower();

document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => gsap.to(cursor, { scale: 3, duration: 0.3 }));
  el.addEventListener('mouseleave', () => gsap.to(cursor, { scale: 1, duration: 0.3 }));
});

// ========================
// HERO ANIMATIONS
// ========================
const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

tl.from('.nav-logo', { y: -30, opacity: 0, duration: 0.8 })
  .from('.nav-links li', { y: -20, opacity: 0, stagger: 0.1, duration: 0.6 }, '-=0.4')
  .from('.hero-eyebrow', { y: 40, opacity: 0, duration: 0.8 }, '-=0.2')
  .from('.hero-name .line-1', { y: 120, opacity: 0, duration: 1.2 }, '-=0.4')
  .from('.hero-name .line-2', { y: 120, opacity: 0, duration: 1.2 }, '-=0.9')
  .from('.hero-bottom', { y: 40, opacity: 0, duration: 0.8 }, '-=0.4')
  .from('.scroll-indicator', { opacity: 0, duration: 0.6 }, '-=0.2');

// Background text parallax
gsap.to('.hero-bg-text', {
  scrollTrigger: {
    trigger: '.hero',
    start: 'top top',
    end: 'bottom top',
    scrub: true
  },
  y: -200,
  opacity: 0
});

// ========================
// SKILL BLOCKS
// ========================
gsap.from('.skill-block', {
  scrollTrigger: { trigger: '.skills-grid', start: 'top 80%' },
  y: 60,
  opacity: 0,
  stagger: 0.1,
  duration: 0.8,
  ease: 'power3.out'
});

// ========================
// EDUCATION ITEMS
// ========================
gsap.from('.edu-item', {
  scrollTrigger: { trigger: '.edu-list', start: 'top 75%' },
  y: 40,
  opacity: 0,
  stagger: 0.2,
  duration: 0.8,
  ease: 'power3.out'
});

// ========================
// PROJECT CARDS
// ========================
gsap.set('.project-card', { opacity: 1 });
gsap.from('.project-card', {
  scrollTrigger: { trigger: '.projects-grid', start: 'top bottom', once: true },
  y: 60,
  opacity: 0,
  stagger: 0.15,
  duration: 0.8,
  ease: 'power3.out'
});

// ========================
// CONTACT SECTION
// ========================
gsap.set('.big-title', { opacity: 1 });
gsap.from('.big-title', {
  scrollTrigger: { trigger: '.contact-strip', start: 'top bottom', once: true },
  y: 80,
  opacity: 0,
  duration: 1.2,
  ease: 'power4.out'
});

gsap.set('.contact-link', { opacity: 1 });
gsap.from('.contact-link', {
  scrollTrigger: { trigger: '.contact-links', start: 'top bottom', once: true },
  x: -30,
  opacity: 0,
  stagger: 0.1,
  duration: 0.7,
  ease: 'power3.out'
});

// ========================
// SMOOTH ANCHOR SCROLL
// ========================
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    document.querySelector(a.getAttribute('href'))?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  });
});

// ========================
// NAV BORDER ON SCROLL
// ========================
ScrollTrigger.create({
  start: 'top -80',
  onUpdate: self => {
    document.querySelector('nav').style.borderBottomColor =
      self.progress > 0 ? 'rgba(200,245,90,0.1)' : 'rgba(245,242,237,0.1)';
  }
});

// ========================
// CERTIFICATE MODAL
// ========================
const modal = document.getElementById('certificateModal');
const modalImage = document.getElementById('modalImage');
const modalClose = document.querySelector('.modal-close');
const certificateImages = document.querySelectorAll('.edu-certificate');

certificateImages.forEach(img => {
  img.addEventListener('click', () => {
    modal.classList.add('active');
    modalImage.src = img.src;
    document.body.style.overflow = 'hidden';
  });
});

modalClose.addEventListener('click', () => {
  modal.classList.remove('active');
  document.body.style.overflow = 'auto';
});

modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
});

// Cerrar modal con tecla Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('active')) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
});

// ========================
// PROJECT MODAL
// ========================
const projectModal = document.getElementById('projectModal');
const projectImage = document.getElementById('projectImage');
const projectModalClose = projectModal.querySelector('.modal-close');
const projectCards = document.querySelectorAll('.project-card[data-project]');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const currentImageSpan = document.getElementById('currentImage');
const totalImagesSpan = document.getElementById('totalImages');

let currentProjectImages = [];
let currentImageIndex = 0;

const projectImages = {
  proyecto1: [
    'img/proyecto1/1.PNG',
    'img/proyecto1/2.PNG',
    'img/proyecto1/3.PNG',
    'img/proyecto1/4.PNG',
    'img/proyecto1/5.PNG',
    'img/proyecto1/6.PNG'
  ],
  proyecto2: [
    'img/proyecto2/1.PNG',
    'img/proyecto2/2.PNG',
    'img/proyecto2/3.PNG',
    'img/proyecto2/4.PNG',
    'img/proyecto2/5.PNG'
  ],
  proyecto3: [
    'img/proyecto3/1.PNG',
    'img/proyecto3/2.PNG',
    'img/proyecto3/3.PNG'
  ]
};

projectCards.forEach(card => {
  card.addEventListener('click', () => {
    const projectName = card.getAttribute('data-project');
    currentProjectImages = projectImages[projectName] || [];
    currentImageIndex = 0;
    
    if (currentProjectImages.length > 0) {
      projectModal.classList.add('active');
      totalImagesSpan.textContent = currentProjectImages.length;
      updateProjectImage();
      document.body.style.overflow = 'hidden';
    }
  });
});

function updateProjectImage() {
  if (currentProjectImages.length > 0) {
    projectImage.src = currentProjectImages[currentImageIndex];
    currentImageSpan.textContent = currentImageIndex + 1;
  }
}

prevBtn.addEventListener('click', () => {
  currentImageIndex = (currentImageIndex - 1 + currentProjectImages.length) % currentProjectImages.length;
  updateProjectImage();
});

nextBtn.addEventListener('click', () => {
  currentImageIndex = (currentImageIndex + 1) % currentProjectImages.length;
  updateProjectImage();
});

projectModalClose.addEventListener('click', () => {
  projectModal.classList.remove('active');
  document.body.style.overflow = 'auto';
});

projectModal.addEventListener('click', (e) => {
  if (e.target === projectModal) {
    projectModal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
});

// Cerrar modal de proyectos con tecla Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && projectModal.classList.contains('active')) {
    projectModal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
});

// ========================
// WEATHER WIDGET
// ========================
const initWeatherWidget = async () => {
  // Mapeo de códigos WMO a emojis
  const iconMap = {
    0: '☀️',   // Clear
    1: '🌤️',  // Mainly clear
    2: '⛅',  // Partly cloudy
    3: '☁️',  // Overcast
    45: '🌫️', // Foggy
    48: '❄️', // Depositing rime fog
    51: '🌧️', // Light drizzle
    53: '🌧️', // Moderate drizzle
    55: '🌧️', // Dense drizzle
    61: '🌧️', // Slight rain
    63: '🌧️', // Moderate rain
    65: '🌧️', // Heavy rain
    71: '❄️', // Slight snow
    73: '❄️', // Moderate snow
    75: '❄️', // Heavy snow
    80: '🌦️', // Slight rain showers
    81: '🌦️', // Moderate rain showers
    82: '🌦️', // Violent rain showers
    85: '🌨️', // Slight snow showers
    86: '🌨️', // Heavy snow showers
    95: '⛈️', // Thunderstorm
    96: '⛈️', // Thunderstorm with slight hail
    99: '⛈️'  // Thunderstorm with heavy hail
  };

  try {
    console.log('Iniciando carga de clima...');
    const data = await WeatherService.fetchWeather('Barranquilla');
    console.log('Datos recibidos:', data);

    // Actualizar elementos del widget en la nav
    const tempElement = document.getElementById('weatherTemp');
    const locationElement = document.getElementById('weatherLocation');
    const iconElement = document.getElementById('weatherIcon');
    
    if (tempElement && locationElement && iconElement) {
      const weatherCode = data.weather[0].code;
      tempElement.textContent = `${Math.round(data.main.temp)}°C`;
      locationElement.textContent = data.name;
      iconElement.textContent = iconMap[weatherCode] || '🌤️';
      console.log('Widget actualizado correctamente');
    } else {
      console.error('No se encontraron los elementos del widget');
    }

  } catch (err) {
    console.error('Error al cargar el clima:', err);
    // Mantener valores por defecto en caso de error
    const iconElement = document.getElementById('weatherIcon');
    if (iconElement) {
      iconElement.textContent = '⚠️';
    }
  }
};

// Llamar cuando el DOM esté listo
window.addEventListener('load', () => {
  console.log('Página cargada, iniciando widget de clima');
  initWeatherWidget();
});
