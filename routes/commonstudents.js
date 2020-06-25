const express = require('express');
const router = express.Router();
const Joi = require('@hapi/joi');
const { convertToArray } = require('../utils/transformUtility');
const commonStudentsRepo = require('../repositories/commonStudentsRepo');

function validate(model) {
  const schema = Joi.object({
    teachers: Joi.array()
      .min(1)
      .unique()
      .items(Joi.string().email())
      .required()
      .label('Teachers Emails'),
  });
  const options = { errors: { wrap: { label: '' } } };

  return schema.validate(model, options);
}

router.get('/', async (req, res) => {
  const { teacher } = req.query;
  const teachersArray = teacher ? convertToArray(teacher) : undefined;
  const { error } = validate({ teachers: teachersArray });
  if (error) return res.status(400).send({ message: error.details[0].message });

  const result = await commonStudentsRepo.getCommonStudents(teachersArray);
  res.send({ students: result });
});

module.exports = router;
