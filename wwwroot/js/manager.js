const uri = '/User';
let users = [];
const urlParams = new URLSearchParams(window.location.search);
const token = localStorage.getItem('token');

//Function to fetch all users data from server.
getUsers = () => {
    fetch('/allUsers', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': token
        },
    })
    .then(response => {
        if (!response.ok) {
            alert('you have login again');
            window.location.href = '../index.html';
        }
        return response.json();
    })
    .then(data => _displayUsers(data))
    .catch(error => console.error('Unable to get items.', error));
}
getUsers();

//Function to add new user to the database
addUser = () => {
    const addNameTextbox = document.getElementById('add-name');
    const addPasswordTextBox = document.getElementById('add-password');
    const addStatusTextBox = document.getElementById('userType');

    const item = {
        password: addPasswordTextBox.value.trim(),
        name: addNameTextbox.value.trim(),
        status: addStatusTextBox.value.trim()
    };

    fetch(uri, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify(item)
        })
        .then(response => response.json())
        .then(() => {
            getUsers();
            addNameTextbox.value = '';
            addPasswordTextBox.value = '';
        })
        .catch(error => console.error('Unable to add item.', error));
}

// Function to delete user from the database.
deleteUser = (id) => {
    fetch(`${uri}/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            },
        })
        .then(() => getUsers())
        .catch(error => console.error('Unable to delete item.', error));
}

//display the users
_displayUsers = (data) => {
    const tBody = document.getElementById('users');
    tBody.innerHTML = '';


    const button = document.createElement('button');

    data.forEach(item => {    
        let deleteButton = button.cloneNode(false);
        deleteButton.innerText = 'Delete';
        deleteButton.setAttribute('onclick', `deleteUser(${item.id})`);

        let tr = tBody.insertRow();

        let td1 = tr.insertCell(0);
        let userIdTextNode = document.createTextNode(item.id);
        td1.appendChild(userIdTextNode);

        let td2 = tr.insertCell(1);
        let textNode = document.createTextNode(item.name);
        td2.appendChild(textNode);

        let td3 = tr.insertCell(2);
        let passwordTextNode = document.createTextNode(item.password);
        td3.appendChild(passwordTextNode);

        let td4 = tr.insertCell(3);
        td4.appendChild(deleteButton);
    });

    users = data;
}

//go back to the task page
goBackToTask = () => {
    window.location.href = '../tasks.html'
}