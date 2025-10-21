const productId = this.dataset.id;
const key = `product-${productId}-liked`;

// на загрузке
if (localStorage.getItem(key) === '1') {
  like.classList.add('active');
}

like.addEventListener('click', () => {
  like.classList.toggle('active');
  if (like.classList.contains('active')) {
    localStorage.setItem(key, '1');
  } else {
    localStorage.removeItem(key);
  }
});
