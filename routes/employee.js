'use strict';

const express = require('express');
const router = express.Router();
const employee=require('../contollers/employeeController');


/* GET employees listing. */
router.get('', employee.findAll);

/*  GET employee by id */
router.get('/:id',employee.findOne);

/*  Create an employee */
router.post('',employee.validate('createOrUpdateEmployee'),employee.createEmployee);

/*  Update an Employee by id */
router.put('/:id',employee.validate('createOrUpdateEmployee'),employee.update);

/*  Delete an employee by id */
router.delete('/:id',employee.deleteOne);

module.exports = router;
