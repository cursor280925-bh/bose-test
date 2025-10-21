// document.querySelectorAll('.icon-like').forEach(icon => {
//   icon.addEventListener('click', () => {
//     icon.classList.toggle('active');
//   });
// });

// цей варіант подобається
document.querySelectorAll('.icon-like').forEach((like, index) => {
  const key = `product-${index}-liked`;

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
});
