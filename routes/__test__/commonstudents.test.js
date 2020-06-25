const request = require('supertest');
const server = require('../../server');

describe('/api/commonstudents', () => {
  describe('GET /', () => {
    const teacherKenEmail = 'teacherken@example.com';
    const teacherJoemail = 'teacherjoe@example.com';
    const commonStudentOneEmail = 'commonstudent1@gmail.com';
    const commonStudentTwoEmail = 'commonstudent2@gmail.com';
    const studentOnlyUnderTeacherKenEmail = 'student_only_under_teacher_ken@gmail.com';
    const studentOnlyUnderTeacherJoeEmail = 'student_only_under_teacher_joe@gmail.com';

    beforeEach(async () => {
      await request(server)
        .post('/api/register')
        .send({
          teacher: teacherKenEmail,
          students: [commonStudentOneEmail, commonStudentTwoEmail, studentOnlyUnderTeacherKenEmail],
        })
        .expect(204);

      await request(server)
        .post('/api/register')
        .send({
          teacher: teacherJoemail,
          students: [commonStudentOneEmail, commonStudentTwoEmail, studentOnlyUnderTeacherJoeEmail],
        })
        .expect(204);
    });

    it('should return a 400 error if no query string is provided', async () => {
      await request(server).get('/api/commonstudents').send().expect(400);
    });

    it('should return a 400 error if any invalid email is supplied for teacher', async () => {
      await request(server).get('/api/commonstudents?teacher=teacherken').send().expect(400);
    });

    it('should return a 200 with students specific to a teacher', async () => {
      const { body } = await request(server)
        .get('/api/commonstudents?teacher=teacherken%40example.com')
        .send()
        .expect(200);

      expect(body.students.length).toBe(3);
      expect(body.students.includes(commonStudentOneEmail)).toBe(true);
      expect(body.students.includes(commonStudentTwoEmail)).toBe(true);
      expect(body.students.includes(studentOnlyUnderTeacherKenEmail)).toBe(true);
    });

    it('should return a 200 with students common to teachers in query', async () => {
      const { body } = await request(server)
        .get(
          '/api/commonstudents?teacher=teacherken%40example.com&teacher=teacherjoe%40example.com',
        )
        .send()
        .expect(200);

      expect(body.students.length).toBe(2);
      expect(body.students.includes(commonStudentOneEmail)).toBe(true);
      expect(body.students.includes(commonStudentTwoEmail)).toBe(true);
      expect(body.students.includes(studentOnlyUnderTeacherKenEmail)).toBe(false);
    });

    it('should return a 400 if query is other things and have no teacher', async () => {
      await request(server).get('/api/commonstudents?otherquery=123').send().expect(400);
    });
  });
});
