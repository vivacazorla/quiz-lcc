var models = require('../models/models.js');

//var users = { admin: {id:1, username:"admin", password:"1111"},
//             luis:  {id:2, username:"luis",  password:"1234"}};

// Comprueba si el usuario está registrado en users
exports.autenticar = function(login, password, callback) {
   models.User.find({where:["username = ?", login]}).then(function(user) {
    if (user){
       if (password === user.password){
          callback(null, user);
       }
       else { callback(new Error('Password erróneo.')); }
    } else { callback(new Error('No existe el usuario.'));}
   });
};

// GET /users/new
exports.new = function(req, res) {
  var user = models.User.build( //crea Objeto User
    { username: "", password: "", score: 100}
    );
    res.render('users/new', { user: user, errors: []});
};

// POST /users/create
exports.create = function(req, res) {
  var usernew = models.User.build( req.body.user );

  usernew.validate().then(function(err){
      if (err) {
       res.render('users/new', { user: usernew, errors: err.errors});   
      } else {
       models.User.find({where:["username = ?", usernew.username]}).then(function(user) {
          if (user){ 
          	 var err = new Error('Nombre de usuario ya existente. Elija otro');
             res.render('users/new', { user: user, errors: [err]  });  
          } else {
           usernew.score = 100;
           usernew  // guarda en BD los campos de User
           .save({fields: ["username","password","score"]})
           .then(function(){res.redirect('/quizes')})
          }});
      }
    });
  req.session.timer = new Date().getTime();
  req.session.user = {id:usernew.id, username:usernew.username};
  res.redirect('/quizes');
};

// GET /users/statistics
exports.statistics = function(req, res) {
     models.User.findAll({
        include: [{ model: models.Quiz },
                  { model: models.Comment },
                  { model: models.Attempt }]}).then(function(users) {
     res.render('users/statistics.ejs', { users: users, errors: []});
   }
  );
};
