var models = require('../models/models.js');

// Autoload
exports.load = function(req, res, next, quizId) {
   models.Quiz.findById(quizId).then(function(quiz) {
     if (quiz) {
        req.quiz = quiz;
        next();
     } else { next( new Error('No existe quizId=' + quizId));}
   } 
  ).catch(function(error) { next(error);});
};

// GET /quizes/question
//exports.question = function(req, res) {
//   models.Quiz.findAll().then(function(quiz) {
//     res.render('quizes/question', {pregunta: quiz[0].pregunta})
//  })
//};

// GET /quizes
exports.index = function(req, res) {
     var search = req.query.search?"%" + req.query.search.toLowerCase().replace(/ /g,'%') + "%":"%";
     var vtema = req.query.tema?req.query.tema:"%";

     models.Quiz.findAll({where: { pregunta: { $like: search },
                                   tema: { $like: vtema } } }).then(function(quizes) {
     res.render('quizes/index.ejs', { quizes: quizes, errors: []});
   //models.Quiz.findAll({where:["lower(pregunta) LIKE ?", search]}).then(function(quizes) {
   //res.render('quizes/index.ejs', { quizes: quizes, errors: []});
    // models.Quiz.findAll({where:["lower(pregunta) LIKE ?", search]}).then(function(quizes) {
    // res.render('quizes/index.ejs', { quizes: quizes, errors: []});
   }
  ).catch(function(error){next(error);});
};

// GET /quizes/new
exports.new = function(req, res) {
  var quiz = models.Quiz.build( //crea Objeto Quiz
    { pregunta: "Pregunta", respuesta: "Respuesta", tema: "Tema"}
    );
    res.render('quizes/new', { quiz: quiz, errors: []});
};

// POST /quizes/create
exports.create = function(req, res) {
  var quiz = models.Quiz.build( req.body.quiz );

  quiz.validate().then(function(err){
      if (err) {
       res.render('quizes/new', { quiz: quiz, errors: err.errors});   
      } else {
       quiz  // guarda en BD los campos pregunta, tema y respuesta de Quiz
       .save({fields: ["pregunta","tema","respuesta"]})
       .then(function(){res.redirect('/quizes')})
      }
    });
};

// PUT /quizes/:id
exports.update = function(req, res) {
  req.quiz.pregunta = req.body.quiz.pregunta;
  req.quiz.respuesta = req.body.quiz.respuesta;
  req.quiz.tema = req.body.quiz.tema;

  req.quiz.validate().then(function(err){
      if (err) {
       res.render('quizes/edit', { quiz: req.quiz, errors: err.errors});   
      } else {
       req.quiz  // guarda en BD los campos pregunta y respuesta de Quiz
       .save({fields: ["pregunta","respuesta","tema"]})
       .then(function(){res.redirect('/quizes')})
      }
    });
};

// GET /quizes/:id
exports.show = function(req, res) {
     res.render('quizes/show', { quiz: req.quiz, errors: []});
};

// GET /quizes/:id/edit
exports.edit = function(req, res) {
    var quiz = req.quiz;
    res.render('quizes/edit', { quiz: quiz, errors: []});
};

// GET /quizes/answer
exports.answer = function(req, res) {
   var resultado = 'Incorrecto';
   if (req.query.respuesta === req.quiz.respuesta){ resultado = 'Correcto'; }
   res.render('quizes/answer', { quiz: req.quiz, respuesta: resultado, errors: []});
};

// DELETE /quizes/:id
exports.destroy = function(req, res) {
   req.quiz.destroy().then(function(){
     res.redirect('/quizes');
    }).catch(function(error){next(error)});
};