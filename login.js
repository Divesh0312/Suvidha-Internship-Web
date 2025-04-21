document.querySelector('button').addEventListener('click', function () {
    this.style.animation = 'success-glow 0.5s ease';
    setTimeout(() => {
      this.style.animation = '';
    }, 500);
  });
  const userType = document.querySelector('input[name="userType"]:checked').value;
console.log(userType); // "student", "employee", or "tpo"
const selectedRole = document.querySelector('input[name="userType"]:checked').value;
console.log("Logged in as:", selectedRole);
