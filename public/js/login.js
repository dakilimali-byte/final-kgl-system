window.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault(); 

            const userEl = document.getElementById('username');
            const passEl = document.getElementById('password');
            const errorDiv = document.getElementById('error-message');

            if (!userEl || !passEl) {
                console.error("Could not find username or password fields.");
                return;
            }

            // The backend only needs username and password to authenticate
            // We capture role/branch from the DB response, not the UI dropdowns, for security.
            const formData = {
                username: userEl.value,
                password: passEl.value
            };

            try {
                // Pointing to your Node.js backend
                const response = await fetch('http://localhost:5000/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();

                if (response.ok) {
                    // 1. Save the JWT token for accessing protected routes later
                    localStorage.setItem('token', result.token);
                    
                    // 2. Save user details so the dashboard knows what to display
                    localStorage.setItem('userRole', result.user.role);
                    localStorage.setItem('userBranch', result.user.branch);
                    localStorage.setItem('username', result.user.username);
                    
                    // 3. Redirect to the dashboard
                    window.location.href = `${result.user.role.toLowerCase()}.html`; // e.g., admin-dashboard.html
                } else {
                    if (errorDiv) {
                        errorDiv.style.color = '#dc3545'; // Bootstrap danger color
                        errorDiv.innerText = result.message || 'Login failed. Check your credentials.';
                    }
                }
            } catch (err) {
                if (errorDiv) {
                    errorDiv.style.color = '#dc3545';
                    errorDiv.innerText = 'Connection error. Ensure the Node backend is running.';
                }
                console.error("Login Error:", err);
            }
        });
    } else {
        console.error("Login form not found in the DOM.");
    }
});