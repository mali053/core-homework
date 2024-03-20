const uri = '/Chore';
let chores = [];
const urlParams = new URLSearchParams(window.location.search);
const token = localStorage.getItem('token');
const tokenParts = token.split('.');
const payload = JSON.parse(atob(tokenParts[1]));
const userId = payload.id;

function isTokenExpired(token) {
    const currentTime = Math.floor(Date.now() / 1000);

    if(payload.exp < currentTime)
        window.location.href = '../index.html'
}

function getItems() {
    isTokenExpired(token);
    fetch(uri, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': token
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Access denied. Please check your permissions.');
        }
        return response.json();
    })
    .then(data => _displayItems(data))
    .then(isManager())
    .then(isUser())
    .catch(error => console.error('Unable to get items.', error));
}
getItems();

function LoadingUserDetails(){
    fetch('/myUser', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': token
        },
    }).then(response => {
        if (!response.ok) {
            throw new Error('Problem retrieving user information.');
        }
        return response.json();
    }).then(data => _displayUser(data))
        .catch(error => console.error('Unable to get user information.', error));
}

function addItem() {
    isTokenExpired(token);
    const addNameTextbox = document.getElementById('add-name');

    const item = {
        isDone: false,
        name: addNameTextbox.value.trim()
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
            getItems();
            addNameTextbox.value = '';
        })
        .catch(error => console.error('Unable to add item.', error));
}

function deleteItem(id) {
    fetch(`${uri}/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            },
        })
        .then(() => getItems())
        .catch(error => console.error('Unable to delete item.', error));
}

function displayEditForm(id) {
    const item = chores.find(item => item.id === id);
    
    document.getElementById('edit-name').value = item.name;
    document.getElementById('edit-id').value = item.id;
    document.getElementById('edit-isDone').checked = item.isDone;
    document.getElementById('editForm').style.display = 'block';
}

function updateItem() {
    const itemId = document.getElementById('edit-id').value;
    const item = {
        id: parseInt(itemId, 10),
        isDone: document.getElementById('edit-isDone').checked,
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
        .then(() => getItems())
        .catch(error => console.error('Unable to update item.', error));

    closeInput();

    return false;
}

function closeInput() {
    document.getElementById('editForm').style.display = 'none';
}

function editUserDetails(){
    LoadingUserDetails()
    document.getElementById('editDetailsPopup').style.display = 'block';
}

function closePopup(){
    document.getElementById('editDetailsPopup').style.display = 'none';
}


function _displayCount(itemCount) {
    const name = (itemCount === 1) ? 'chore' : 'chore kinds';

    document.getElementById('counter').innerText = `${itemCount} ${name}`;
}

function _displayItems(data) {
    const tBody = document.getElementById('chores');
    tBody.innerHTML = '';

    _displayCount(data.length);

    const button = document.createElement('button');

    data.forEach(item => {
        let isDoneCheckbox = document.createElement('input');
        isDoneCheckbox.type = 'checkbox';
        isDoneCheckbox.disabled = true;
        isDoneCheckbox.checked = item.IsDone;

        let editButton = button.cloneNode(false);
        editButton.innerText = 'Edit';
        editButton.addEventListener('click', () => {
            displayEditForm(item.id);
        });

        let deleteButton = button.cloneNode(false);
        deleteButton.innerText = 'Delete';
        deleteButton.setAttribute('onclick', `deleteItem(${item.id})`);

        let tr = tBody.insertRow();

        let td1 = tr.insertCell(0);
        td1.appendChild(isDoneCheckbox);

        let td2 = tr.insertCell(1);
        let textNode = document.createTextNode(item.name);
        td2.appendChild(textNode);

        let td3 = tr.insertCell(2);
        td3.appendChild(editButton);

        let td4 = tr.insertCell(3);
        td4.appendChild(deleteButton);
    });

    chores = data;
}

function isManager(){
    if(userId === '0')
        document.getElementById('managerButton').style.display = 'block';
}

function isUser(){
    console.log(userId);
    if(userId != '0')
        document.getElementById('editUserDetails').style.display = 'block';
}

function submitManager(){
    window.location.href = '../manager.html'
}

const updateName=document.getElementById("updateName");
const updatePassword=document.getElementById("updatePassword");
function _displayUser(user){
    updateName.value=user.name;
    updatePassword.value=user.password;

}

function saveDetails() {
    const item = {
        id: userId,
        password: updatePassword.value.trim(),
        name: updateName.value.trim()
    };
    fetch(`User/${userId}`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify(item)
    })
    .then(() => getItems())
    .catch(error => console.error('Unable to update item.', error));

    closePopup();
}