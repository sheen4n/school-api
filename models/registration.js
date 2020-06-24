'use strict';
module.exports = (sequelize, DataTypes) => {
  let Registration = sequelize.define(
    'Registration',
    {
      teacherId: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false },
      studentId: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false },
    },
    {},
  );
  Registration.associate = function (models) {
    Registration.belongsTo(models.Student, { foreignKey: 'studentId' });
    Registration.belongsTo(models.Teacher, { foreignKey: 'teacherId' });
  };
  Registration.removeAttribute('id');
  return Registration;
};
