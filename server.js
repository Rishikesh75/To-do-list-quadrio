const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware to parse JSON data
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// In-memory storage for users and items
const users = [
    { username: 'admin', password: 'password' }
];

const items = [];
let itemId = 1;

// Serve the login page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve the CRUD page
app.get('/crud.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'crud.html'));
});

// Handle login logic
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        res.send('Login successful!');
    } else {
        res.status(401).send('Invalid username or password.');
    }
});

// CRUD operations

// Get all items
app.get('/items', (req, res) => {
    res.json(items);
});

// Create a new item
app.post('/items', (req, res) => {
    const { name } = req.body;
    const newItem = { id: itemId++, name };
    items.push(newItem);
    res.json(newItem);
});

// Update an item
app.put('/items/:id', (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    const item = items.find(i => i.id == id);
    if (item) {
        item.name = name;
        res.json(item);
    } else {
        res.status(404).send('Item not found.');
    }
});

// Delete an item
app.delete('/items/:id', (req, res) => {
    const { id } = req.params;

    const index = items.findIndex(i => i.id == id);
    if (index !== -1) {
        items.splice(index, 1);
        res.status(204).send();
    } else {
        res.status(404).send('Item not found.');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
