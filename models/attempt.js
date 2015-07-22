// Definicion del modelo de Comment

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Attempt',
	  { acierto:  { 
	  	  type: DataTypes.BOOLEAN,
	  	  defaultValue: false
	  	}
	  });
}