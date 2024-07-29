document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('login-btn');
    const createBtn = document.getElementById('create-btn');
    const itemsList = document.getElementById('items-list');

    if (loginBtn) {
        // Handle login
        loginBtn.addEventListener('click', async () => {
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();

            // Send login data to the server
            try {
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password })
                });

                const result = await response.text();
                console.log(result);

                // If login is successful, redirect to the CRUD page
                if (response.ok) {
                    alert(result);
                    window.location.href = '/crud.html'; // Redirect to the CRUD operations page
                } else {
                    alert('Login failed: ' + result);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred. Please try again later.');
            }
        });
    } 
    else if (createBtn) {
        // Fetch and display items when the CRUD page loads
        fetchItems();

        // Create an item
        createBtn.addEventListener('click', async () => {
            const itemInput = document.getElementById('item-input');
            const itemName = itemInput.value.trim();
            if (itemName) {
                await createItem(itemName);
                itemInput.value = '';
                fetchItems();
            }
        });
    }

    // Fetch and display items
    async function fetchItems() {
        const response = await fetch('/items');
        const items = await response.json();

        itemsList.innerHTML = ''; // Clear existing items

        items.forEach(item => {
            const li = document.createElement('li');
            li.dataset.id = item.id;

            const itemText = document.createElement('span');
            itemText.textContent = item.name;

            const updateInput = document.createElement('input');
            updateInput.type = 'text';
            updateInput.value = item.name;
            updateInput.style.display = 'none';

            const updateBtn = document.createElement('button');
            updateBtn.textContent = 'Update';
            updateBtn.classList.add('update-btn');
            updateBtn.style.display = 'none';
            updateBtn.addEventListener('click', async () => {
                const newName = updateInput.value.trim();
                if (newName) {
                    await updateItem(item.id, newName);
                    fetchItems();
                }
            });

            const editBtn = document.createElement('button');
            editBtn.textContent = 'Edit';
            editBtn.addEventListener('click', () => {
                itemText.style.display = 'none';
                updateInput.style.display = 'block';
                updateBtn.style.display = 'inline';
                editBtn.style.display = 'none';
            });

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', async () => {
                await deleteItem(item.id);
                fetchItems();
            });

            li.appendChild(itemText);
            li.appendChild(updateInput);
            li.appendChild(editBtn);
            li.appendChild(updateBtn);
            li.appendChild(deleteBtn);

            itemsList.appendChild(li);
        });
    }

    // Create item on the server
    async function createItem(name) {
        await fetch('/items', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name })
        });
    }

    // Update item on the server
    async function updateItem(id, name) {
        await fetch(`/items/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name })
        });
    }

    // Delete item on the server
    async function deleteItem(id) {
        await fetch(`/items/${id}`, {
            method: 'DELETE'
        });
    }
});
