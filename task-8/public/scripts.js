document.getElementById('registrationForm').addEventListener('submit', function(event) {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
  
    if (password !== confirmPassword) {
      alert('Password and Confirm Password must match');
      event.preventDefault();
    }
  });
  
  function logout() {
    alert('You have been logged out!');
  }
  