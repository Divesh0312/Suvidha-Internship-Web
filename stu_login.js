document.querySelector('button[type="submit"]').addEventListener('click', function (e) {
    e.preventDefault(); // prevent actual form submission for now
    this.style.animation = 'success-glow 0.5s ease';
    setTimeout(() => {
      this.style.animation = '';
    }, 500);
  });
  