const request = require('supertest');
const server = require('../../server');

const db = require('../../models');
const Teacher = db.Teacher;
const Student = db.Student;
const Registration = db.Registration;

describe('/api/register', () => {
  describe('POST /', () => {
    it('should return a 400 error if no body is provided', async () => {
      await request(server).post('/api/register').send().expect(400);
    });

    it('should return a 400 error if no teacher email is provided', async () => {
      await request(server)
        .post('/api/register')
        .send({ students: ['studentjon@example.com', 'studenthon@example.com'] })
        .expect(400);
    });

    it('should return a 400 error if no student email is provided', async () => {
      await request(server)
        .post('/api/register')
        .send({ teacher: 'teacherken@gmail.com' })
        .expect(400);
    });

    it('should return a 400 error if invalid teacher email is provided', async () => {
      await request(server).post('/api/register').send({ teacher: 'teacherken' }).expect(400);
    });

    it('should return a 400 error if any invalid student email is provided', async () => {
      await request(server)
        .post('/api/register')
        .send({
          teacher: 'teacherken@gmail.com',
          students: ['studentjon', 'studenthon@example.com'],
        })
        .expect(400);
    });

    it('should create a teacher and students for a valid request if the teacher not existing in db', async () => {
      const teacherEmail = 'teacherken@gmail.com';
      const studentEmailOne = 'studentjon@example.com';
      const studentEmailTwo = 'studenthon@example.com';

      await request(server)
        .post('/api/register')
        .send({
          teacher: teacherEmail,
          students: [studentEmailOne, studentEmailTwo],
        })
        .expect(204);

      const teacherInDb = await Teacher.findOne({ where: { email: teacherEmail }, raw: true });
      expect(teacherInDb).not.toBeNull();

      const studentInDbOne = await Student.findOne({
        where: { email: studentEmailOne },
        raw: true,
      });
      expect(studentInDbOne).not.toBeNull();

      const studentInDbTwo = await Student.findOne({
        where: { email: studentEmailTwo },
        raw: true,
      });
      expect(studentInDbTwo).not.toBeNull();
    });

    it('should not create a teacher and students for a valid request if the teacher already existing in db', async () => {
      const teacherEmail = 'teacherken@gmail.com';
      const studentEmailOne = 'studentjon@example.com';
      const studentEmailTwo = 'studenthon@example.com';

      await Teacher.create({ email: teacherEmail });
      await Student.create({ email: studentEmailOne });
      await Student.create({ email: studentEmailTwo });

      await request(server)
        .post('/api/register')
        .send({
          teacher: teacherEmail,
          students: [studentEmailOne, studentEmailTwo],
        })
        .expect(204);

      const teachersInDb = await Teacher.findAll({ raw: true });
      expect(teachersInDb.length).toBe(1);

      const studentsInDb = await Student.findAll({ raw: true });
      expect(studentsInDb.length).toBe(2);
    });

    it('should create registrations association if not existing in db', async () => {
      const teacherEmail = 'teacherken@gmail.com';
      const studentEmailOne = 'studentjon@example.com';
      const studentEmailTwo = 'studenthon@example.com';

      await request(server)
        .post('/api/register')
        .send({
          teacher: teacherEmail,
          students: [studentEmailOne, studentEmailTwo],
        })
        .expect(204);

      const registrationsInDb = await Registration.findAll({ raw: true });
      expect(registrationsInDb.length).toBe(2);
    });

    it('should not create registrations association if already existing in db', async () => {
      const teacherEmail = 'teacherken@gmail.com';
      const studentEmailOne = 'studentjon@example.com';
      const studentEmailTwo = 'studenthon@example.com';

      await request(server)
        .post('/api/register')
        .send({
          teacher: teacherEmail,
          students: [studentEmailOne, studentEmailTwo],
        })
        .expect(204);

      // Make another request
      await request(server)
        .post('/api/register')
        .send({
          teacher: teacherEmail,
          students: [studentEmailOne, studentEmailTwo],
        })
        .expect(204);

      const registrationsInDb = await Registration.findAll({ raw: true });
      expect(registrationsInDb.length).toBe(2);
    });
  });
});
