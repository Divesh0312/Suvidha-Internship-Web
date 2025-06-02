// Global variable to store selected user type
let selectedUserType = "";

// Initialize user type buttons when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initializeUserTypeButtons();
  initializeFormInteractions();
  initializeFormSubmission();
});

// Initialize user type button functionality
function initializeUserTypeButtons() {
  document.querySelectorAll('.user-type-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const userType = this.dataset.type;
      selectUserType(userType);
    });
  });
}

// Handle user type selection
function selectUserType(type) {
  selectedUserType = type;
  
  // Remove active class from all buttons
  document.querySelectorAll('.user-type-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  // Add active class to selected button
  const selectedBtn = document.querySelector(`[data-type="${type}"]`);
  if (selectedBtn) {
    selectedBtn.classList.add('active');
  }
  
  // Log selection for debugging
  console.log("Selected user type:", type);
}

// Toggle password visibility
function togglePassword() {
  const passwordField = document.getElementById("password");
  const toggleIcon = document.querySelector('.toggle-password');
  
  if (passwordField.type === "password") {
    passwordField.type = "text";
    toggleIcon.textContent = "🙈";
  } else {
    passwordField.type = "password";
    toggleIcon.textContent = "👁️";
  }
}

// Initialize form submission handler
function initializeFormSubmission() {
  document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const remember = document.getElementById('remember-me').checked;
    
    // Clear previous messages
    clearMessages();
    
    // Validation
    if (!validateForm(username, password)) {
      return;
    }
    
    // Add success animation to button
    const submitBtn = document.querySelector('.login-btn');
    submitBtn.style.animation = 'success-glow 0.5s ease';
    
    setTimeout(() => {
      submitBtn.style.animation = '';
    }, 500);
    
    // Log user type as requested
    const userType = selectedUserType;
    console.log(userType); // "student", "employee", or "tpo"
    
    const selectedRole = selectedUserType;
    console.log("Logged in as:", selectedRole);
    
    // Show success message
    showSuccess(`Welcome back! Logging in as ${selectedUserType.toUpperCase()}...`);
    
    // Simulate redirect after successful login
    setTimeout(() => {
      console.log("Redirecting to dashboard...");
      // In a real application, you would redirect here
      // window.location.href = `${selectedUserType}-dashboard.html`;
    }, 1500);
  });
}

// Form validation
function validateForm(username, password) {
  if (!selectedUserType) {
    showError('Please select your user type (Student, TPO, or Employee)');
    return false;
  }
  
  if (username.length < 3) {
    showError('Username must be at least 3 characters long');
    return false;
  }
  
  if (password.length < 4) {
    showError('Password must be at least 4 characters long');
    return false;
  }
  
  return true;
}

// Clear all messages
function clearMessages() {
  document.getElementById('success-message').style.display = 'none';
  document.getElementById('error-message').style.display = 'none';
}

// Display success message
function showSuccess(message) {
  const successDiv = document.getElementById('success-message');
  successDiv.textContent = message;
  successDiv.style.display = 'block';
  successDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Display error message
function showError(message) {
  const errorDiv = document.getElementById('error-message');
  errorDiv.textContent = message;
  errorDiv.style.display = 'block';
  errorDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Initialize enhanced form interactions
function initializeFormInteractions() {
  // Enhanced input focus effects
  document.querySelectorAll('input').forEach(input => {
    input.addEventListener('focus', function() {
      this.parentElement.style.transform = 'scale(1.02)';
      this.parentElement.style.transition = 'transform 0.2s ease';
    });
    
    input.addEventListener('blur', function() {
      this.parentElement.style.transform = 'scale(1)';
    });
  });
}

// Button click animation (as requested in the example)
document.addEventListener('DOMContentLoaded', function() {
  const loginButton = document.querySelector('.login-btn');
  if (loginButton) {
    loginButton.addEventListener('click', function() {
      this.style.animation = 'success-glow 0.5s ease';
      setTimeout(() => {
        this.style.animation = '';
      }, 500);
    });
  }
});

// Utility function to get selected user type (for external access)
function getSelectedUserType() {
  return selectedUserType;
}

// Utility function to check if user type is selected
function isUserTypeSelected() {
  return selectedUserType !== "";
}

// Export functions for potential module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    selectUserType,
    getSelectedUserType,
    isUserTypeSelected,
    togglePassword
  };
}
