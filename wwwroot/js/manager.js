const uri = '/User';
let users = [];
const urlParams = new URLSearchParams(window.location.search);
const token = localStorage.getItem('token');

//get users
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
    .then(data => _displayItems(data))
    .catch(error => console.error('Unable to get items.', error));
}
getUsers();

//add user
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

//delete user
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

//form with user's details to edit
displayEditForm = (id) => {
    const item = users.find(item => item.id === id);

    document.getElementById('edit-name').value = item.name;
    document.getElementById('edit-id').value = item.id;
    document.getElementById('edit-password').value = item.password;
    document.getElementById('editForm').style.display = 'block';
}

//update user
updateUser = () => {
    const itemId = document.getElementById('edit-id').value;
    const item = {
        id: parseInt(itemId, 10),
        password: document.getElementById('edit-password').value.trim(),
        name: document.getElementById('edit-name').value.trim()
    };

    fetch(`${uri}/${itemId}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify(item)
        })
        .then(() => getUsers())
        .catch(error => console.error('Unable to update item.', error));

    closeInput();

    return false;
}

//close the input that edit the user
closeInput = () => {
    document.getElementById('editForm').style.display = 'none';
}

//display the count of the users
_displayCount = (itemCount) => {
    const name = (itemCount === 1) ? 'user' : 'user kinds';

    document.getElementById('counter').innerText = `${itemCount} ${name}`;
}

//display the users
_displayItems = (data) => {
    const tBody = document.getElementById('users');
    tBody.innerHTML = '';

    _displayCount(data.length);

    const button = document.createElement('button');

    data.forEach(item => {    
        let editButton = button.cloneNode(false);
        editButton.innerText = 'Edit';
        editButton.addEventListener('click', () => {
            displayEditForm(item.id);
        });

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
        td4.appendChild(editButton);

        let td5 = tr.insertCell(4);
        td5.appendChild(deleteButton);
    });

    users = data;
}

//go back to the task page
goBackToTask = () => {
    window.location.href = '../tasks.html'
}