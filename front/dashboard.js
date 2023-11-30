const jwt = localStorage.getItem('jwt');

if (!jwt) {
    window.location.href = 'index.html';
}

fetch('http://localhost:3000/students', {
    method: 'GET',
    headers: {
        'Authorization': `${jwt}`
    }
})
.then(response => response.json())
.then(data => {
    userdata=parseJwt(jwt)
    const userDataElement = document.getElementById('userData');
    userDataElement.innerHTML = `<p>Bienvenue ${userdata.username} role:${userdata.role}!</p>`;
})
.catch(error => {
    console.error(error);
    window.location.href = 'index.html';
});

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}
// Function to refresh the JWT token
function refreshJwtToken() {
    fetch('http://localhost:3000/refresh', {
        method: 'POST',
        headers: {
            'Authorization': `${localStorage.getItem('jwt')}`
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.jwt) {
            localStorage.setItem('jwt', data.token);
            console.log('Token refreshed successfully.');
        } else {
            console.error('Failed to refresh token.');
        }
    })
    .catch(error => console.error(error));
}

// Call the function initially
refreshJwtToken();

// Refresh the JWT token every 30 seconds
setInterval(refreshJwtToken, 30000); // 30 seconds = 30000 milliseconds
