var models = require('../models/models.js');

// Autoload
exports.load = function(req, res, next, quizId) {
   models.Quiz.find({
         where: { id: Number(quizId) },
         include: [{ model: models.Comment }]
   }).then(function(quiz) {
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
     var search = req.query.search?"%" + req.query.search.replace(/ /g,'%') + "%":"%";
     var vtema = req.query.tema?req.query.tema:"%";

     models.Quiz.findAll({include: [{ model: models.Attempt, where: { UserId: req.session.user?req.session.user.id:null }, required: false }],  
                          where: { pregunta: { $like: search },
                                   tema: { $like: vtema } },        
                          order: 'tema, pregunta ASC' }).then(function(quizes) {
     res.render('quizes/index.ejs', { quizes: quizes, errors: []});
   //models.Quiz.findAll({where:["lower(pregunta) LIKE ?", search]}).then(function(quizes) {
   //res.render('quizes/index.ejs', { quizes: quizes, errors: []});
   // include: [{ model: models.Attempt, where: { UserId: req.session.user?req.session.user.id:null }, required: false }], 
   }
  ).catch(function(error){next(error);});
};

// GET /quizes/new
exports.new = function(req, res) {
  var quiz = models.Quiz.build( //crea Objeto Quiz
    { pregunta: "", respuesta: "", tema: ""}
    );
    res.render('quizes/new', { quiz: quiz, errors: []});
};

// POST /quizes/create
exports.create = function(req, res) {
  var quiz = models.Quiz.build( 
      { pregunta: req.body.quiz.pregunta,
        respuesta: req.body.quiz.respuesta,
        tema: req.body.quiz.tema,
        UserId: req.session.user.id });

  quiz.validate().then(function(err){
      if (err) {
       res.render('quizes/new', { quiz: quiz, errors: err.errors});   
      } else {
       quiz  // guarda en BD los campos pregunta, tema y respuesta de Quiz
       .save()
       .then(function(){res.redirect('/quizes')});
       sumapuntos(quiz.UserId, 10, function(error, user) {
            if (error) {
                req.session.errors = [{"message": 'Se ha producido un error: '+error}];
                return;
            }});
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

// GET /quizes/statistics
exports.statistics = function(req, res) {
     models.Quiz.findAll({
        include: [{ model: models.Comment },
                  { model: models.Attempt }]}).then(function(quizes) {
     res.render('quizes/statistics.ejs', { quizes: quizes, errors: []});
   }
  ).catch(function(error){next(error);});
};

// GET /quizes/:id/edit
exports.edit = function(req, res) {
    var quiz = req.quiz;
    res.render('quizes/edit', { quiz: quiz, errors: []});
};

// GET /quizes/answer
exports.answer = function(req, res) {
   var resultado = 'Incorrecto';
   var correcto = (req.query.respuesta === req.quiz.respuesta);

   if (correcto){ resultado = 'Correcto'; };

   models.Attempt.find({where: {QuizId : req.quiz.id,
                                UserId : req.session.user?req.session.user.id:null }}).then(function(attempt) {
    if (!attempt){
      var attempt = models.Attempt.build( 
        { aciertos: (correcto),
          fallos:  !(correcto),
          QuizId:  req.quiz.id,
          UserId:  req.session.user?req.session.user.id:null });
      attempt
       .save()
       .then(function(){
       res.render('quizes/answer', { quiz: req.quiz, respuesta: resultado, errors: []});
      });
    } else {;
       (correcto)?++attempt.aciertos:++attempt.fallos; 
       attempt
       .save()
       .then(function(){
       res.render('quizes/answer', { quiz: req.quiz, respuesta: resultado, errors: []});});
    };
    }); 
};

// DELETE /quizes/:id
exports.destroy = function(req, res) {
   req.quiz.destroy().then(function(){
     res.redirect('/quizes');
    }).catch(function(error){next(error)});
};