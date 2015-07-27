var path = require('path');

// Postgres DATABASE_URL = postgres://user:passwd@host:port/database
// SQLite   DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name  = (url[6]||null);
var user     = (url[2]||null);
var pwd      = (url[3]||null);
var protocol = (url[1]||null);
var dialect  = (url[1]||null);
var port     = (url[5]||null);
var host     = (url[4]||null);
var storage  = process.env.DATABASE_STORAGE;

// Cargar Modelo ORM
var Sequelize = require('sequelize');

// Usar BBDD SQLite
var sequelize = new Sequelize(DB_name, user, pwd,
  { dialect:  dialect,
    protocol: protocol,
    port:     port,
    host:     host,
    storage:  storage,  // solo SQLite (.env)
    omitNull: true      // solo Postgres
  }
);


//var sequelize = new Sequelize(null, null, null,
//                              {dialect: "sqlite", storage: "quiz.sqlite"}
//                              );

// Importar la definicion de las tablas
var Quiz = sequelize.import(path.join(__dirname,'quiz'));
var Comment = sequelize.import(path.join(__dirname,'comment'));
var User = sequelize.import(path.join(__dirname,'user'));
var Attempt = sequelize.import(path.join(__dirname,'attempt'));

Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);
Comment.belongsTo(User);
User.hasMany(Comment);
Quiz.belongsTo(User);
User.hasMany(Quiz);
Attempt.belongsTo(User);
User.hasMany(Attempt);
Attempt.belongsTo(Quiz);
Quiz.hasMany(Attempt);

exports.Quiz = Quiz;  // exportar definicion de tabla Quiz
exports.Comment = Comment;  // exportar definicion de tabla Comment
exports.User = User;  // exportar definicion de tabla User
exports.Attempt = Attempt;  // exportar definicion de tabla Attempt

// sequelize.sync() crea e inicializa tabla de preguntas en DB
sequelize.sync().then(function() {
	// then(..) ejecuta el manejador una vez creada la tabla
	 User.count().then(function (count){
    if (count < 3) {  // la tabla se inicializa si está vacía
        User.create({ username: 'admin',
                      password: '1111',
                      score: 100
        });
        User.create({ username: 'luis',
                      password: '1234',
                      score: 100
        })
        .then(function(){console.log('Base de datos de usuarios inicializada')});
    };
  });
  Quiz.count().then(function (count){
	  if (count < 2) {  // la tabla se inicializa si está vacía
        Quiz.create({ pregunta: 'Capital de Italia',
                      tema: 'Geografía',
                      respuesta: 'Roma'
        });
        Quiz.create({ pregunta: 'Capital de Portugal',
                      tema: 'Geografía',
                      respuesta: 'Lisboa'
        })
        .then(function(){console.log('Base de datos de preguntas inicializada')});
	  };
	});
});