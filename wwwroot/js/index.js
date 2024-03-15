const postmanButton = document.getElementById("postmanButton");

postmanButton.addEventListener("click", function() {
    window.open('postman://app', '_blank');
});

const uri = '/login';

function processTokenAndRedirect(response) {
    if (response.title) {
        alert("Unexpected response. Please try again.");
    } else {
        window.location.href = `../tasks.html?token=${encodeURIComponent(response.token)}`;
        // Unexpected response, show error message
        
    }
}

function login() {
    const id = document.getElementById('signInID').value;
    const password = document.getElementById('signInPassword').value;
    const name = document.getElementById('signInName').value;
    const user = {
        name: name,
        id: id,
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
