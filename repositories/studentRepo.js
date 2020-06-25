const db = require('../models');
const Student = db.Student;

const createStudent = async (email, transaction = null) =>
  Student.create(
    {
      email,
    },
    { transaction },
  );

const findStudentByEmail = async (email, transaction = null) =>
  Student.findOne(
    {
      where: { email },
      raw: true,
    },
    { transaction },
  );

const suspendStudentByEmail = async (email) =>
  Student.update({ suspended: true }, { where: { email } });

module.exports = {
  createStudent,
  findStudentByEmail,
  suspendStudentByEmail,
};
