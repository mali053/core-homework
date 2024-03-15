const uri = '/Chore';
let chores = [];
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');

function getItems() {
    console.log(token);
    fetch(uri, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            // 'Accept': 'application/json',
            // 'Content-Type': 'application/json'
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        _displayItems(data);
    })
    .catch(error => {
        console.error('Unable to get items.', error);
        // Add further error handling here if needed
    });
}

function _displayItems(data) {
    const tBody = document.getElementById('chores');
    tBody.innerHTML = '';

    _displayCount(data.length);

    const button = document.createElement('button');

    data.forEach(item => {
        let isGlutenFreeCheckbox = document.createElement('input');
        isGlutenFreeCheckbox.type = 'checkbox';
        isGlutenFreeCheckbox.disabled = true;
        isGlutenFreeCheckbox.checked = item.isGlutenFree;

        let editButton = button.cloneNode(false);
        editButton.innerText = 'Edit';
        editButton.addEventListener('click', () => {
            displayEditForm(item.id);
        });

        let deleteButton = button.cloneNode(false);
        deleteButton.innerText = 'Delete';
        deleteButton.addEventListener('click', () => {
            deleteItem(item.id);
        });

        let tr = tBody.insertRow();

        let td1 = tr.insertCell(0);
        td1.appendChild(isGlutenFreeCheckbox);

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

function displayEditForm(itemId) {
    // Implement edit form display logic here
}

function deleteItem(itemId) {
    // Implement item deletion logic here
}

function _displayCount(count) {
    // Implement count display logic here
}
