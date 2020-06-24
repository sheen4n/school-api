const db = require('../models');
const teacherRepo = require('./teacherRepo');
const studentRepo = require('./studentRepo');
const Registration = db.Registration;

const register = async (teacher, students) => {
  try {
    // Initialize Transaction - Either All Or Nothing Gets Committed
    const t = await db.sequelize.transaction();

    // Search For Teacher and Create If Not Exist
    let teacherInDb = await teacherRepo.findTeacherByEmail(teacher, t);
    if (!teacherInDb) {
      const teacherResult = await teacherRepo.createTeacher(teacher, t);
      teacherInDb = teacherResult.toJSON();
    }

    // Search For Student and Create If Not Exist
    const studentsInDb = await Promise.all(
      students.map(async (student) => {
        let studentInDb = await studentRepo.findStudentByEmail(student, t);
        if (!studentInDb) {
          const studentResult = await studentRepo.createStudent(student, t);
          studentInDb = studentResult.toJSON();
        }
        return studentInDb;
      }),
    );

    const teacherId = teacherInDb.id;

    // Create Transaction If Not Exist
    await Promise.all(
      studentsInDb.map(async ({ id: studentId }) => {
        let registrationInDb = await Registration.findOne(
          { where: { studentId, teacherId }, raw: true },
          { transaction: t },
        );
        if (!registrationInDb) {
          const registrationResult = await Registration.create(
            { studentId, teacherId },
            { transaction: t },
          );
          registrationInDb = registrationResult.toJSON();
        }
        return registrationInDb;
      }),
    );

    // If the execution reaches this line, no errors were thrown.
    // We commit the transaction.
    await t.commit();
  } catch (error) {
    // If the execution reaches this line, an error was thrown.
    // We rollback the transaction.
    console.log(error.message);
    await t.rollback();
  }
};

module.exports = { register };
