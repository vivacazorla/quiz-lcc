var express = require('express');
var router = express.Router();
var quizController = require('../controllers/quiz_controller');
var commentController = require('../controllers/comment_controller');
var sessionController = require('../controllers/session_controller');
var userController = require('../controllers/user_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz', errors: [] });
});

router.get('/author', function(req, res) {
  res.render('author', { title: 'Quiz', errors: [] });
});

//Autoload
router.param('quizId', quizController.load);
router.param('commentId', commentController.load);

//router.get('/quizes/question', quizController.question);
//router.get('/quizes/answer',   quizController.answer);

// Definicion de rutas de /session
router.get('/login',   sessionController.new);
router.post('/login',  sessionController.create);
router.get('/logout',  sessionController.destroy);

// Definicion de rutas de /quizies
router.get('/quizes',                      quizController.index);
router.get('/quizes/:quizId(\\d+)',        quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);
router.get('/quizes/statistics',           quizController.statistics);
router.get('/quizes/new',                  sessionController.loginRequired, quizController.new);
router.post('/quizes/create',              sessionController.loginRequired, quizController.create);
router.get('/quizes/:quizId(\\d+)/edit',   sessionController.loginRequired, quizController.edit);
router.put('/quizes/:quizId(\\d+)',        sessionController.loginRequired, quizController.update);
router.delete('/quizes/:quizId(\\d+)',     sessionController.loginRequired, quizController.destroy);

router.get('/quizes/:quizId(\\d+)/comments/new', sessionController.loginRequired, commentController.new);
router.post('/quizes/:quizId(\\d+)/comments',    sessionController.loginRequired, commentController.create);
router.get('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish',    
	        sessionController.loginRequired, commentController.publish);

router.get('/users/new',        userController.new);
router.post('/users/create',    userController.create);
router.get('/users/statistics', userController.statistics);

module.exports = router;
