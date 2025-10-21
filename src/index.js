import { initModal } from './js/modal.js';
import { initBurgerMenu } from './js/burger-menu.js';
import { initKeyboard } from './js/keyboard.js';
import './js/like-toggle.js';

// Initialize all modules
document.addEventListener('DOMContentLoaded', () => {
  initModal();
  initBurgerMenu();
  initKeyboard();
});
