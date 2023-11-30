document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('http://localhost:3000/authent', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)
        if (data.token) {
            localStorage.setItem('jwt', data.token);
            window.location.href = 'dashboard.html';
        } else {
            alert('Identifiants incorrects. Veuillez réessayer.');
        }
    })
    .catch(error => console.error(error));
});
