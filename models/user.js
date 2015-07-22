// Definicion del modelo de User

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('User',
	  { username:  { 
	  	  type: DataTypes.STRING,
	  	  validate: { notEmpty: {msg: "-> Indicar Usuario"}}
	  	},
	    password: { 
	  	  type: DataTypes.STRING,
	  	  validate: { notEmpty: {msg: "-> Indicar Clave"}}
	  	},
	    score: { 
	  	  type: DataTypes.INTEGER,
  	  	  defaultValue: 0
	  	}  
	  });
}