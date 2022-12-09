const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('recipe', {
    id:{
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true

    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique:true
    },
    resumen: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    score: {
      type: DataTypes.INTEGER,
    },
    stepByStep: {
      type: DataTypes.TEXT,
    },
    img: {
      type: DataTypes.STRING,
      defaultValue: "https://ychef.files.bbci.co.uk/976x549/p04tx3m6.jpg"
    },
    typeDish: {
      type: DataTypes.TEXT
    },
    diet: {
      type: DataTypes.TEXT
    }

  });
};
