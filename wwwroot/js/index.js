const postmanButton = document.getElementById("postmanButton");
    
postmanButton.addEventListener("click", function() {
    window.open('postman://app', '_blank');
});

const uri = '/login';


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
        .then(token => processTokenAndRedirect(token))
        .catch(error => console.error('Unable to add item.', error));
}

function processTokenAndRedirect(token) {
    // Perform any processing with the token if needed
    console.log('Token:', token);
    
    // Redirect to another page
    // window.location.href = '../tasks.html';
    window.location.href = `../tasks.html?token=${encodeURIComponent(token)}`;
}