'use strict';
module.exports = (sequelize, DataTypes) => {
  const Student = sequelize.define(
    'Student',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      email: { type: DataTypes.STRING, unique: true },
      suspended: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    {},
  );
  Student.associate = function (models) {
    Student.hasMany(models.Registration, { foreignKey: 'studentId' });
  };
  return Student;
};
