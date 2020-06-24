const db = require('../models');

const STUDENTS = [
  {
    email: 'jane@test.com',
  },
  {
    email: 'bob@test.com',
  },
];

const insert = async () => {
  try {
    await Promise.all(STUDENTS.map((student) => db.Student.create(student)));
  } catch (error) {
    console.log(error.message);
  }
};

insert();
