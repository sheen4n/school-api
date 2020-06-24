'use strict';
module.exports = (sequelize, DataTypes) => {
  const Teacher = sequelize.define(
    'Teacher',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      email: { type: DataTypes.STRING, unique: true },
    },
    {},
  );
  Teacher.associate = function (models) {
    Teacher.hasMany(models.Registration, { foreignKey: 'teacherId' });
  };
  return Teacher;
};
