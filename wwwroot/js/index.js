//check if the token exist and required
checkToken = () => {
    if (localStorage.getItem('token')){

        const token = localStorage.getItem('token');
        const tokenParts = token.split('.');
        const payload = JSON.parse(atob(tokenParts[1]));       
        const currentTime = Math.floor(Date.now() / 1000);

        if(payload.exp > currentTime)
            window.location.href = '../tasks.html'
    }
}
checkToken()

//save the current token to the local storage
processTokenAndRedirect = (token) => {
    if (typeof token === 'object') {
        alert("Unexpected response. Please try again.");
    } else {
        localStorage.setItem('token',"Bearer "+ token);

        window.location.href = `../tasks.html`;        
    }
}

//login function
Login = (name, password) => {
    fetch('/login', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(name, password)
    })
    .then(response => response.json())
    .then(response => processTokenAndRedirect(response))
    .catch(error => console.error('Unable to add item.', error));
}

//save name and password after login and send to login function
saveDetails = () => {
    const password = document.getElementById('signInPassword').value;
    const name = document.getElementById('signInName').value;
    Login(name, password)
}

//handle the google button
handleCredentialResponse = (response) =>
{
        if (response.credential) {
            var idToken = response.credential;
            var decodedToken = parseJwt(idToken);
            var userId = decodedToken.sub; // User ID
            var userName = decodedToken.name; // User Name

            Login(userName,userId)
            
        } else {
            alert('Google Sign-In was cancelled.');
        }
    }

    parseJwt = (token) => {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    
        return JSON.parse(jsonPayload);
}