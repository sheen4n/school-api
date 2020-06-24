const db = require('../models');
const Student = db.Student;

const findStudentByEmail = async (email, transaction = null) =>
  Student.findOne(
    {
      where: { email },
      raw: true,
    },
    { transaction },
  );

const createStudent = async (email, transaction = null) =>
  Student.create(
    {
      email,
    },
    { transaction },
  );

module.exports = {
  createStudent,
  findStudentByEmail,
};
