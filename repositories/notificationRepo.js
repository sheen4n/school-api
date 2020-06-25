const db = require('../models');
const Registration = db.Registration;
const Student = db.Student;
const Op = db.Sequelize.Op;

const retrieveForNotifications = async (teacherId, studentsEmails) => {
  const studentsForNotificationArray = await Registration.findAll({
    attributes: ['studentId', 'teacherId'],
    where: {
      $suspended$: false,
      [Op.or]: [{ teacherId }, { $email$: { [Op.in]: studentsEmails } }],
    },
    include: [{ model: Student, attributes: ['email', 'suspended'] }],
    raw: true,
  });
  const studentsEmailArray = studentsForNotificationArray.map((item) => item['Student.email']);
  const uniqueStudentsEmail = studentsEmailArray.reduce(
    (unique, item) => (unique.includes(item) ? unique : [...unique, item]),
    [],
  );

  return uniqueStudentsEmail;
};

module.exports = { retrieveForNotifications };
