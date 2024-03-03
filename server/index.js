const express = require('express');
const path = require('path');
const cors = require('cors');
const body = require('body-parser');
const cookie = require('cookie-parser');
const morgan = require('morgan');
const uuid = require('uuid').v4;

const app = express();

app.use(cors())
app.use(express.static(path.resolve(__dirname, '..', 'static')));
app.use(express.static(path.resolve(__dirname, '..', 'public')));
app.use(express.json());
app.use(body.json);
app.use(cookie());

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'public', 'index.html'));
}); 

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
