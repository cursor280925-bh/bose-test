import { closeModal } from './modal.js';
import { closeBurgerMenu } from './burger-menu.js';

export function initKeyboard() {
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeModal();
      closeBurgerMenu();
    }
  });
}
