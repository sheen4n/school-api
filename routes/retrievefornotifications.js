const express = require('express');
const router = express.Router();
const Joi = require('@hapi/joi');
const teacherRepo = require('../repositories/teacherRepo');
const notificationRepo = require('../repositories/notificationRepo');
const { getEmailMentions } = require('../utils/getEmailMentions');

function validate(model) {
  const schema = Joi.object({
    teacher: Joi.string().email().required(),
    notification: Joi.string().min(1).required(),
  });
  const options = { errors: { wrap: { label: '' } } };

  return schema.validate(model, options);
}

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  const { teacher, notification } = req.body;
  const teacherInDb = await teacherRepo.findTeacherByEmail(teacher);

  if (!teacherInDb) return res.status(404).send({ message: 'Teacher Not Found' });

  const studentsEmailsArray = getEmailMentions(notification);

  const studentsForNotification = await notificationRepo.retrieveForNotifications(
    teacherInDb.id,
    studentsEmailsArray,
  );

  res.send({ recipients: studentsForNotification });
});

module.exports = router;
