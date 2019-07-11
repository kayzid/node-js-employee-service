const axios = require('axios');
const { body } = require('express-validator');
const { validationResult } = require('express-validator');
const emp=require('../models/employee.Model');

const DATABASE=[]
var _id=1;
const EMPLOYEE_TYPE=['VP','MANAGER','CEO','LACKEY'];
const DAYS_IN_MONTHS_OF_YEAR=[31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

const DATE_REG_EX= /^\d{4}\-\d{1,2}\-\d{1,2}$/;

exports.createEmployee= async function(req,res) {
    try {
        console.log("Request received : {}",JSON.stringify(req.body));
        const errors=validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });            
        }
    

        const {firstName,lastName,hireDate,role}=req.body;
        
        const id=_id;
        

        let Employee=emp.create;
        let quote1=await getQuotes1();
        console.log("Quote/Joke 1:" + quote1);

        const quote2= await getQuote2();
        console.log("Quote/Joke 2: " + quote2);
        
        employee = new Employee(id,firstName,lastName,hireDate,role,[quote1,quote2])
        console.log(employee);
        DATABASE[id]=employee;
        _id=_id+1;
        
        console.log("Employee Database: " + JSON.stringify(DATABASE));    
        return res.status(200).json(generateSuccessResponse(id));
    }
    catch(error) {
        console.log("Error in creating user - " + error.message);
        return res.status(500).send(generateUnexpectedError("Unexpected error in creating an employee. Please try again."));
    }
    
}

exports.findAll = function(req,res) {
    return res.status(200).send(DATABASE);
}

exports.findOne = function(req,res) {
    const id=req.params.id;
    console.log("employee-controller: Finding employee with id : " + id);
    const employee=DATABASE[id];
    if(employee) {
        console.log("Employee fetched : " + JSON.stringify(employee));
        return res.status(200).send(employee);
    }
    else {
        console.log("No employee found with id : " + id);        
        return res.status(404).send(generateErrorResponse(id));
    }

    
}

exports.update= async function(req,res) {
    try {
        const errors=validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });            
        }

        const id=req.params.id;
        console.log("employee-controller: Finding employee with id : " + id);
        console.log("employee-controller: Request body : " + req.body);
        const employee=DATABASE[id];
        const {firstName,lastName,hireDate,role}=req.body;
        if(employee) {       
            employee['firstName']=firstName;
            employee['lastName']=lastName;
            employee['hireDate']=hireDate;
            employee['role']=role;
            DATABASE[id]=employee;
            console.log("Updated db : " + JSON.stringify(DATABASE));
            return res.status(200).send(generateUpdateSuccessResponse())

        }
        else {
            let quote1=await getQuotes1();
            console.log("Quote/Joke 1:" + quote1);

            const quote2= await getQuote2();
            console.log("Quote/Joke 2: " + quote2);

            let Employee=emp.create;
            const newEmployee = new Employee(id,firstName,lastName,hireDate,role,[quote1,quote2]);    
            DATABASE[id]=newEmployee;
            _id=_id+1;
            console.log("Updated db : " + JSON.stringify(DATABASE));
            return res.status(200).send(generateSuccessResponse(id))
        }
    }
    catch(error) {
        console.log("Error in updating user - " + error.message);
        return res.status(500).send(generateUnexpectedError("Unexpected error in updating an employee with id " + id + ". Please try again"));
    }
    
}

exports.deleteOne=function(req,res) {
    const id=req.params.id;
    console.log("employee-controller: Deleting employee with id : " + id);
    console.log("Employee Database: " + JSON.stringify(DATABASE)); 
    if(DATABASE[id]) {
        delete DATABASE[id];
        console.log("Employee deleted successfully with id " + id);
        return res.status(200).send(generateDeleteSuccessResponse());
    }
    else {
        console.log("Error in deleting data! No record found with id : " + id);
        return res.status(404).send(generateErrorResponse(id));
    }
}


exports.validate=(methodName) => {
    console.log("Validate input for " + methodName);
    switch(methodName) {
        case 'createOrUpdateEmployee' :{
            return [
                body('firstName','Required parameter Employee first name not provided!').exists().isAlpha(),
                body('lastName','Required parameter Last name not provided!').exists().isAlphanumeric(),
                body('hireDate').exists().custom(value => {                    
                    if(!DATE_REG_EX.test(value)){                        
                        throw new Error("Hire Date must match the pattern YYYY-MM-DD");
                    }
                    let splitDate=value.split("-");
                    
                    let day=parseInt(splitDate[2],10);
                    let month=parseInt(splitDate[1],10);                    
                    let year=parseInt(splitDate[0],10);

                    const currYear=new Date().getFullYear();
                    const minYear=currYear - 100;                    
                    if(year < minYear || year > currYear || month > 12 || month <= 0){                        
                        throw new Error("Hire Date must be a valid date! In the format YYYY-MM-DD");
                    }

                    if(year%4 == 0) {
                        DAYS_IN_MONTHS_OF_YEAR[1]=29;
                    }

                    if( day <=0 || day > DAYS_IN_MONTHS_OF_YEAR[month-1]){                        
                        throw new Error("Hire Date must be a valid date! In the format YYYY-MM-DD");
                    }
                    return true;

                }),
                body('role','Required parameter Role is not provided or has an invalid value! Supported values are ' + EMPLOYEE_TYPE).exists().isIn(EMPLOYEE_TYPE)
            ];
        }
    }
}


function generateUnexpectedError(message){
    const errorResponse={
        "Response":message
    }
    return errorResponse;
}

function generateErrorResponse(id) {
    const errorResponse={
        "Response":"No employee found with id " + id
    }
    return errorResponse;
}

function generateSuccessResponse(id) {
    const successResponse={
        "Response":"Employee created successfully", 
        "Id":id
    }
    return successResponse;
}

function generateUpdateSuccessResponse() {
    const successResponse={
        "Response":"Employee updated successfully"        
    }
    return successResponse;
}

function generateDeleteSuccessResponse() {
    const successResponse={
        "Response":"Employee deleted successfully"        
    }
    return successResponse;
}


async function getQuotes1() {
   
   try{
       console.log("Getting joke!");
       
       const response = await axios({
        url: 'https://icanhazdadjoke.com',
        method: 'get',
        headers:{'Accept':'application/json'}
      })
    
      console.log(response.data) 
        return response.data.joke;
    }
    catch(error) {
        console.log(error.message);
        console.log("Error in getting jokes. Using default");
        return "This is a default joke";
    }
   
}


async function getQuote2(){    
    try{
        const response = await axios({
            url: 'https://ron-swanson-quotes.herokuapp.com/v2/quotes',
            method: 'get',
            headers:{'Accept':'application/json'}
          })
        
          console.log("Response: " + response.data) 
            return response.data[0]; 
    }
    catch(error) {
        console.log("Error in getting ron swanson quotes. Using default");
        return "This is a default quote 2";
    }        
}
