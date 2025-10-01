const modal = document.getElementById('modal');
const openButtons = document.querySelectorAll('[data-open-modal]');
const closeButtons = document.querySelectorAll('[data-close-modal], .modal-backdrop, .modal-close');

function openModal() {
  if (!modal) return;
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  const firstInput = modal.querySelector('input');
  if (firstInput) {
    setTimeout(() => firstInput.focus(), 50);
  }
}

function closeModal() {
  if (!modal) return;
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

export function initModal() {
  openButtons.forEach(btn => btn.addEventListener('click', openModal));
  closeButtons.forEach(btn => btn.addEventListener('click', closeModal));

  // Form handling
  const form = document.querySelector('.modal-form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      closeModal();
      alert('Спасибо! Мы свяжемся с вами.');
      form.reset();
    });
  }
}

export { openModal, closeModal };
