document.querySelector('button').addEventListener('click', function () {
    this.style.animation = 'success-glow 0.5s ease';
    setTimeout(() => {
      this.style.animation = '';
    }, 500);
  });