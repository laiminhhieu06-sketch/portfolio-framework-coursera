'use strict';
// Interactive enhancement over the official Bootstrap 5 starter structure.
const doc = document.documentElement;
const menuButton = document.querySelector('.nav-toggle');
const menu = document.querySelector('#primaryMenu');
const themeButton = document.querySelector('#themeToggle');
const themeLabel = document.querySelector('.theme-label');
const scrollButton = document.querySelector('#scrollTopBtn');

menuButton.addEventListener('click', () => {
  const isOpen = menu.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
});
menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  menu.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation menu');
}));

function applyTheme(theme){
  const isDark = theme === 'dark';
  doc.setAttribute('data-bs-theme', isDark ? 'dark' : 'light');
  themeButton.setAttribute('aria-pressed', String(isDark));
  themeButton.firstElementChild.textContent = isDark ? '☀' : '☾';
  themeLabel.textContent = isDark ? 'Light mode' : 'Dark mode';
}
let savedTheme = 'light';
try {savedTheme = localStorage.getItem('studio-nova-theme') || 'light';} catch (error) { /* allow private browsing */ }
applyTheme(savedTheme);
themeButton.addEventListener('click', () => {
  const nextTheme = doc.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(nextTheme);
  try {localStorage.setItem('studio-nova-theme', nextTheme);} catch (error) { /* optional persistence */ }
});

const filterButtons = [...document.querySelectorAll('.filter-chip')];
const cards = [...document.querySelectorAll('.project-item')];
const filterStatus = document.querySelector('#filterStatus');
filterButtons.forEach(button => button.addEventListener('click', () => {
  const category = button.dataset.filter;
  filterButtons.forEach(item => {
    const active = item === button;
    item.classList.toggle('is-active', active);
    item.setAttribute('aria-pressed', String(active));
  });
  let count = 0;
  cards.forEach(card => {
    const show = category === 'all' || card.dataset.category === category;
    card.hidden = !show;
    if (show) count++;
  });
  filterStatus.textContent = `Showing ${count} ${count === 1 ? 'project' : 'projects'}${category === 'all' ? '.' : ` in ${category}.`}`;
}));

function toggleScrollButton(){scrollButton.classList.toggle('show', window.scrollY > 500);}
window.addEventListener('scroll', toggleScrollButton, {passive: true});
toggleScrollButton();
scrollButton.addEventListener('click', () => window.scrollTo({top:0,behavior:'smooth'}));

document.querySelector('#year').textContent = new Date().getFullYear();

const form = document.querySelector('#contactForm');
const status = document.querySelector('#formStatus');
function validateField(field, errorId, message){
  const feedback = document.getElementById(errorId);
  feedback.textContent = message;
  field.setAttribute('aria-invalid', String(Boolean(message)));
  if(message) field.setAttribute('aria-describedby', errorId);
  else field.removeAttribute('aria-describedby');
  return !message;
}
form.addEventListener('submit', event => {
  event.preventDefault(); // No network requests: demonstration form only.
  const name = document.querySelector('#contactName');
  const email = document.querySelector('#contactEmail');
  const message = document.querySelector('#contactMessage');
  const nameValid = validateField(name,'nameError',name.value.trim().length < 2 ? 'Please enter at least two characters.' : '');
  const emailValid = validateField(email,'emailError',/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()) ? '' : 'Please enter a valid email address.');
  const messageValid = validateField(message,'messageError',message.value.trim().length < 10 ? 'Please write at least ten characters.' : '');
  if(nameValid && emailValid && messageValid){
    status.textContent = 'Demo validated successfully! No message was sent or stored.';
    form.reset();
  } else {
    status.textContent = 'Please correct the highlighted fields and try again.';
    [nameValid ? null : name, emailValid ? null : email, messageValid ? null : message].find(Boolean)?.focus();
  }
});
