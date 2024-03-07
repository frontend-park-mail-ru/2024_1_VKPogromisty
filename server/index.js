const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();

const PORT = process.env.PORT;

app.use("/static", express.static(path.resolve(__dirname, '..', 'static')));
app.use("/public", express.static(path.resolve(__dirname, '..', 'public')));
app.use("/handlebars", express.static(path.resolve(__dirname, '..', 'handlebars')));

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'public', 'index.html'));
}); 

app.get('/feed', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'templates', 'feed.html'));
}); 

app.get('/login', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'templates', 'authorization.html'));
}); 

app.get('/signup', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'templates', 'sign_up.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
