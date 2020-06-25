const express = require('express');
const router = express.Router();
const Joi = require('@hapi/joi');
const commonStudentsRepo = require('../repositories/commonStudentsRepo');

function validate(model) {
  const schema = Joi.object({
    teachers: Joi.array()
      .min(1)
      .unique()
      .items(Joi.string().email())
      .required()
      .label('Teachers EmailS'),
  });
  const options = { errors: { wrap: { label: '' } } };

  return schema.validate(model, options);
}

router.get('/', async (req, res) => {
  const query = req.originalUrl.split(`${req.baseUrl}?`)[1];
  if (!query) return res.status(400).send({ message: 'Teacher Email is Required' });
  const queryArray = query.split('&');
  const teachersArray = queryArray
    .filter((item) => item.startsWith('teacher='))
    .map((item) => item.slice('teacher='.length))
    .map((item) => decodeURIComponent(item));

  const { error } = validate({ teachers: teachersArray });
  if (error) return res.status(400).send({ message: error.details[0].message });

  const result = await commonStudentsRepo.getCommonStudents(teachersArray);
  res.send({ students: result });
});

module.exports = router;
