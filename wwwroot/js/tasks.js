const uri = '/Chore';
let chores = [];
const urlParams = new URLSearchParams(window.location.search);
const token = localStorage.getItem('token');
const tokenParts = token.split('.');
const payload = JSON.parse(atob(tokenParts[1]));
const userType = payload.type; 
const userId = payload.id;

//add task function
addTask = () => {
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
            LoadingTasksDetails();
            addNameTextbox.value = '';
        })
        .catch(error => console.error('Unable to update item.', error));
    }

//delete task function
deleteTask = (id) => {
    fetch(`${uri}/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            },
        })
        .then(() => LoadingTasksDetails())
        .catch(error => console.error('Unable to delete item.', error));
    }

//update task function
updateTask = () => {
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
        .then(() => LoadingTasksDetails())
        .catch(error => console.error('Unable to update item.', error));

    closeInput();

    return false;
}

//form for update
displayEditForm = (id) => {
    const item = chores.find(item => item.id === id);
    document.getElementById('edit-name').value = item.name;
    document.getElementById('edit-id').value = item.id;
    document.getElementById('edit-isDone').checked = item.isDone;
    document.getElementById('editForm').style.display = 'block';
}

//close the form of editing the task
closeInput = () => {
    document.getElementById('editForm').style.display = 'none';
}

//get user's details to edit them
LoadingUserDetails = () =>{
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
    .catch(error => console.error('Unable to update item.', error));
}

//display the user details for update them
_displayUser = (user) => {
    const updateName=document.getElementById("updateName");
    const updatePassword=document.getElementById("updatePassword");
    updateName.value=user.name;
    updatePassword.value=user.password;
}

//edit the user's details
editUserDetails = () =>{
    LoadingUserDetails()
    document.getElementById('editDetailsPopup').style.display = 'block';
}

//close the form of editing the user
closePopup = () =>{
    document.getElementById('editDetailsPopup').style.display = 'none';
}

//saves the user's details after he change them
saveDetails = () => {
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
    .then(() => LoadingTasksDetails())
    .catch(error => console.error('Unable to update item.', error));

    closePopup();
}

//display the count of the task you have
_displayCount = (itemCount) => {
    const name = (itemCount === 1) ? 'chore' : 'chore kinds';

    document.getElementById('counter').innerText = `${itemCount} ${name}`;
}

//display the user tasks
_displayItems = (data) => {
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
        deleteButton.setAttribute('onclick', `deleteTask(${item.id})`);

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

//check if the user is manager
isManager = () => {
    console.log(userType);
    if(userType === "Admin")
        document.getElementById('managerButton').style.display = 'block';
}

//move to the manager page exist only if the user is manager
submitManager = () => {
    window.location.href = '../manager.html'
}

//get tasks
LoadingTasksDetails = () => {
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
            alert('you have login again');
            window.location.href = '../index.html';
        }
        return response.json();
    })
    .then(data => _displayItems(data))
    .then(isManager())
    .catch(error => console.error('Unable to get item.', error));
}
LoadingTasksDetails();