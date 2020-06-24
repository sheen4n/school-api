const express = require('express');
const router = express.Router();
const Joi = require('@hapi/joi');
const registrationRepo = require('../repositories/registrationRepo');

function validate(model) {
  const schema = Joi.object({
    teacher: Joi.string().email().required(),
    students: Joi.array().min(1).unique().items(Joi.string().email()).required(),
  });

  return schema.validate(model);
}

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  const { teacher, students } = req.body;
  await registrationRepo.register(teacher, students);

  res.status(204).send();
});

module.exports = router;
