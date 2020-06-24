const db = require('../models');

const TEACHERS = [
  {
    email: 'teacherjoe@test.com',
  },
  {
    email: 'teacherbob@test.com',
  },
];

const insert = async () => {
  try {
    await Promise.all(TEACHERS.map((teacher) => db.Teacher.create(teacher)));
  } catch (error) {
    console.log(error.message);
  }
};

insert();
