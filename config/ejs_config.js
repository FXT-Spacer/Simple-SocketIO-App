const path = require('path');

const ejsConfig = (app) => {
    app.set('views', path.join(__dirname, '..', 'views'));
    app.set('view engine', 'ejs');
};

module.exports = ejsConfig;