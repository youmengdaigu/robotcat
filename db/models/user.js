"use strict";
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    username:DataTypes.STRING,
    password:DataTypes.STRING,
    rate:{type:DataTypes.FLOAT,defaultValue:0}
  });
  return User;
};
