const db = require('../models');

const REGISTRATIONS = [
  {
    teacherId: 1,
    studentId: 2,
  },
  {
    teacherId: 2,
    studentId: 2,
  },
];

const insert = async () => {
  try {
    await Promise.all(REGISTRATIONS.map((r) => db.Registration.create(r)));
  } catch (error) {
    console.log(error.message);
  }
};

insert();
