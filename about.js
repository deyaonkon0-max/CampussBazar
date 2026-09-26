
document.getElementById('contactForm').addEventListener('submit', (e) => {
  e.preventDefault();
  document.getElementById('contactToast').classList.add('show');
  e.target.reset();
  setTimeout(() => document.getElementById('contactToast').classList.remove('show'), 4000);
});
