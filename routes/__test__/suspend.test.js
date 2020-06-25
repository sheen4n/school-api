const request = require('supertest');
const server = require('../../server');

const db = require('../../models');
const Student = db.Student;

describe('/api/suspend', () => {
  describe('POST /', () => {
    it('should return a 400 error if no body is provided', async () => {
      await request(server).post('/api/suspend').send().expect(400);
    });

    it('should return a 400 error if invalid student email is provided', async () => {
      await request(server)
        .post('/api/suspend')
        .send({
          student: 'abc',
        })
        .expect(400);
    });

    it('should return a 404 error if valid email is supplied but not found', async () => {
      await request(server)
        .post('/api/suspend')
        .send({
          student: 'studentmary@gmail.com',
        })
        .expect(404);
    });

    it('should return a 204 error if valid email is supplied but not found', async () => {
      const studentEmailOne = 'studentmary@gmail.com';

      await Student.create({ email: studentEmailOne });

      await request(server)
        .post('/api/suspend')
        .send({
          student: 'studentmary@gmail.com',
        })
        .expect(204);

      const studentInDb = await Student.findOne({ where: { email: studentEmailOne }, raw: true });
      expect(studentInDb.suspended).toBeTruthy();
    });

    it('should return a 400 error if student is already suspended', async () => {
      const studentEmailOne = 'studentmary@gmail.com';

      await Student.create({ email: studentEmailOne });

      await request(server)
        .post('/api/suspend')
        .send({
          student: 'studentmary@gmail.com',
        })
        .expect(204);

      const studentInDb = await Student.findOne({ where: { email: studentEmailOne }, raw: true });
      expect(studentInDb.suspended).toBeTruthy();

      await request(server)
        .post('/api/suspend')
        .send({
          student: 'studentmary@gmail.com',
        })
        .expect(400);
    });
  });
});
