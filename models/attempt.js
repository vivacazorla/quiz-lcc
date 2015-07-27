// Definicion del modelo de Comment

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Attempt',
	  { aciertos:  { 
	  	  type: DataTypes.INTEGER,
	  	  defaultValue: 0
	  	},
	  	fallos:  { 
	  	  type: DataTypes.INTEGER,
	  	  defaultValue: 0
	  	},
	  });
}