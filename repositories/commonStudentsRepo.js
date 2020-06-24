const db = require('../models');
const Registration = db.Registration;
const Teacher = db.Teacher;
const Student = db.Student;
const Op = db.Sequelize.Op;

const getCommonStudents = async (teachersEmails) => {
  try {
    const commonRegistrations = await Registration.findAll({
      attributes: ['studentId', 'teacherId', 'Teacher.email', 'Student.email'],
      include: [
        {
          model: Teacher,
          attributes: ['email'],
          where: {
            email: {
              [Op.in]: teachersEmails,
            },
          },
        },
        {
          model: Student,
          attributes: ['email'],
        },
      ],
      raw: true,
    });

    const studentRegisterCountObj = commonRegistrations.reduce(
      (a, c) => ((a[c['Student.email']] = (a[c['Student.email']] || 0) + 1), a),
      {},
    );

    const studentsMatch = Object.entries(studentRegisterCountObj).filter(
      (item) => item[1] === teachersEmails.length,
    );

    const studentsEmails = studentsMatch.map((item) => item[0]);

    return studentsEmails;
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = { getCommonStudents };
