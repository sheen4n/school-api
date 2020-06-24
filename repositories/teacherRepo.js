const db = require('../models');
const Teacher = db.Teacher;

const findTeacherByEmail = async (email, transaction = null) =>
  Teacher.findOne(
    {
      where: { email },
      raw: true,
    },
    { transaction },
  );

const createTeacher = async (email, transaction = null) =>
  Teacher.create(
    {
      email,
    },
    { transaction },
  );

module.exports = {
  createTeacher,
  findTeacherByEmail,
};
