// ==== Obtener elementos ====
const loginBtn = document.getElementById('loginBtn');
const guestBtn = document.getElementById('guestBtn');
const shopBtn = document.getElementById('shopBtn');
const modal = document.getElementById('loginModal');
const closeBtn = document.querySelector('.close');
const loginForm = document.getElementById('loginForm');
const actionsSection = document.querySelector('.actions');
const heroLogo = document.querySelector('.hero .logo');

// ==== Hero logo fadeIn ====
window.addEventListener('load', () => {
  heroLogo.style.opacity = 1; // ya tiene fadeIn en CSS, solo aseguro que aparezca
});

// ==== Animación de botones al scrollear ====
window.addEventListener('scroll', () => {
  const top = actionsSection.getBoundingClientRect().top;
  const windowHeight = window.innerHeight;
  if(top < windowHeight - 100){
    actionsSection.classList.add('visible');
  }
});

// ==== Abrir modal al hacer clic en "Iniciar sesión" ====
loginBtn.addEventListener('click', () => {
  modal.style.display = 'flex';
});

// ==== Cerrar modal ====
closeBtn.addEventListener('click', () => {
  modal.style.display = 'none';
});
window.addEventListener('click', (e) => {
  if(e.target === modal){
    modal.style.display = 'none';
  }
});

// ==== Validación del formulario (cualquier usuario) ====
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  // Aquí podés agregar validación real si querés
  window.location.href = "principal.html";
});

// ==== Botón de invitado ====
guestBtn.addEventListener('click', () => {
  window.location.href = "principal.html";
});

// ==== Botón de tienda ====
shopBtn.addEventListener('click', () => {
  window.location.href = "tienda.html";
});
