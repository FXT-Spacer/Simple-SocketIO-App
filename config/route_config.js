const handlers = require('../handlers/handlers');

module.exports = function(app) {
    app.get('/helloworld', (req, res) => {
        res.send("Hello world");
    });

    app.get('/', (req, res) => {
        res.render('homePage');
    });

    app.get('/login', (req, res) => {
        res.render("loginPage");
    });

    app.post('/logout', handlers.Logout);

    app.post('/register', handlers.register);
    app.post('/login', handlers.login);

    app.get('/questions', handlers.listAllQuestions);

    app.get('/create-question', handlers.createQuestionView);

    app.post('/create-question', handlers.createQuestion)

    app.get('/join-question/', handlers.joinQuestionView);

    app.get('/view-question/:idQuestion', handlers.viewQuestion);

    app.use((req, res, next) => {
        res.status(404).send('Sorry, page not found!');
    });
};
