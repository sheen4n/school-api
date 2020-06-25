const request = require('supertest');
const server = require('../../server');

const db = require('../../models');

describe('/api/retrievefornotifications', () => {
  describe('POST /', () => {
    const teacherKenEmail = 'teacherken@example.com';
    const studentOnlyUnderTeacherKenEmail = 'studentbob@example.com';
    const studentUnderTeacherKenAndSuspended = 'suspendedstudent@example.com';

    const teacherJoemail = 'teacherjoe@example.com';
    const otherExistingStudent = 'studentagnes@example.com';
    const secondExistingStudent = 'studentmiche@example.com';
    const studentMentionedAndSuspended = 'suspendedmentionedstudent@example.com';

    beforeEach(async () => {
      await request(server)
        .post('/api/register')
        .send({
          teacher: teacherKenEmail,
          students: [studentOnlyUnderTeacherKenEmail, studentUnderTeacherKenAndSuspended],
        })
        .expect(204);

      await request(server)
        .post('/api/register')
        .send({
          teacher: teacherJoemail,
          students: [otherExistingStudent, secondExistingStudent, studentMentionedAndSuspended],
        })
        .expect(204);

      await request(server).post('/api/suspend').send({
        student: studentUnderTeacherKenAndSuspended,
      });

      await request(server).post('/api/suspend').send({
        student: studentMentionedAndSuspended,
      });
    });

    it('should return a 400 error if no teacher or notification is provided in body', async () => {
      await request(server).post('/api/retrievefornotifications').send().expect(400);
    });

    it('should return a 400 error if teacher is empty string in body', async () => {
      await request(server)
        .post('/api/retrievefornotifications')
        .send({ teacher: '', notification: 'hello' })
        .expect(400);
    });

    it('should return a 400 error if notification is empty string in body', async () => {
      await request(server)
        .post('/api/retrievefornotifications')
        .send({ teacher: 'teacher@gmail.com', notification: '' })
        .expect(400);
    });

    it('should return a 400 error if teacher is invalid email in body', async () => {
      await request(server)
        .post('/api/retrievefornotifications')
        .send({ teacher: 'teacher', notification: 'hello' })
        .expect(400);
    });

    it('should return a 404 error if teacher does not exist', async () => {
      await request(server)
        .post('/api/retrievefornotifications')
        .send({ teacher: 'teacher@donotexist.com', notification: 'hello' })
        .expect(404);
    });

    it('should return valid list of recipients for specific teacher and no mentions', async () => {
      const requestBody = {
        teacher: teacherKenEmail,
        notification: 'Hello students!',
      };

      const { body } = await request(server)
        .post('/api/retrievefornotifications')
        .send(requestBody)
        .expect(200);

      expect(body.recipients.length).toBe(1);
      expect(body.recipients.includes(studentOnlyUnderTeacherKenEmail)).toBe(true);
      expect(body.recipients.includes(studentUnderTeacherKenAndSuspended)).toBe(false);
    });

    it('should return valid list of recipients for specific teacher and with mentions', async () => {
      const requestBody = {
        teacher: teacherKenEmail,
        notification: `Hello students! @${otherExistingStudent} @${secondExistingStudent} @{studentMentionedAndSuspended}`,
      };

      const { body } = await request(server)
        .post('/api/retrievefornotifications')
        .send(requestBody)
        .expect(200);

      expect(body.recipients.length).toBe(3);
      expect(body.recipients.includes(studentOnlyUnderTeacherKenEmail)).toBe(true);
      expect(body.recipients.includes(otherExistingStudent)).toBe(true);
      expect(body.recipients.includes(secondExistingStudent)).toBe(true);
      expect(body.recipients.includes(studentMentionedAndSuspended)).toBe(false);
      expect(body.recipients.includes(studentUnderTeacherKenAndSuspended)).toBe(false);
    });

    it('should return valid list of recipients for specific teacher and with mentions with fake mentions', async () => {
      const requestBody = {
        teacher: teacherKenEmail,
        notification: `Hello students! @${otherExistingStudent} @${secondExistingStudent} @{studentMentionedAndSuspended} @12321321faker@email.com`,
      };

      const { body } = await request(server)
        .post('/api/retrievefornotifications')
        .send(requestBody)
        .expect(200);

      expect(body.recipients.length).toBe(3);
      expect(body.recipients.includes(studentOnlyUnderTeacherKenEmail)).toBe(true);
      expect(body.recipients.includes(otherExistingStudent)).toBe(true);
      expect(body.recipients.includes(secondExistingStudent)).toBe(true);
      expect(body.recipients.includes(studentMentionedAndSuspended)).toBe(false);
      expect(body.recipients.includes(studentUnderTeacherKenAndSuspended)).toBe(false);
    });
  });
});
