const express = require('express');
const router = express.Router();
const Joi = require('@hapi/joi');
const studentRepo = require('../repositories/studentRepo');

function validate(model) {
  const schema = Joi.object({
    student: Joi.string().email().required(),
  });

  const options = { errors: { wrap: { label: '' } } };

  return schema.validate(model, options);
}

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  const { student: email } = req.body;
  const studentInDb = await studentRepo.findStudentByEmail(email);

  if (!studentInDb) return res.status(404).send({ message: 'Student Email Not Found' });
  if (studentInDb.suspended) return res.status(400).send({ message: 'Student Already Suspended.' });

  await studentRepo.suspendStudentByEmail(email);

  res.status(204).send();
});

module.exports = router;
