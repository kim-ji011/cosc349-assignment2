const express = require('express')
const path = require('path');

/* create the server */
const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

/* host public/ directory to serve: images, css, js, etc. */
app.use(express.static('public'));

/* path routing and endpoints */
app.use('/', require('./path_router'));

// /* start the server */
app.listen(3000, '0.0.0.0', () => {
  console.log('API running on port 3000');
});
