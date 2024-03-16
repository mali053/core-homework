const postmanButton = document.getElementById("postmanButton");

postmanButton.addEventListener("click", function() {
    window.open('postman://app', '_blank');
});

const uri = '/login';

function processTokenAndRedirect(token) {
    if (typeof token === 'object') {
        alert("Unexpected response. Please try again.");
    } else {
        localStorage.setItem('token',"Bearer "+ token);

        window.location.href = `../tasks.html`;        
    }
}

function login() {
    const password = document.getElementById('signInPassword').value;
    const name = document.getElementById('signInName').value;
    const user = {
        name: name,
        password: password
    };

    fetch(uri, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
    .then(response => response.json())
    .then(response => processTokenAndRedirect(response))
    .catch(error => console.error('Unable to add item.', error));
}
