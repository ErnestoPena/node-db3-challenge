const db = require('../data/db-config')

module.exports = {
    find,
    findById,
    add,
    findSteps,
    findMaxStep,
    addStep
}


//Find all schemes
function find() {
    return db('schemes');
}

//Find a single scheme
function findById(id) {
    return db('schemes').where({id});
}

//Find all steps for a given scheme
function findSteps(id) {
    return db('steps').where('scheme_id' , '=' , id);
}

//Add a new Scheme
function add(body) {
    return db('schemes').insert(body);
}

//Function to add steps to schemes
//Step data is composed with id => Autoincrement , step_number => integer , instructions => text , scheme_id => scheme id steps belong to
async function addStep(stepData , nextStep,  id) {

    return await db('steps').insert(stepData, {step_number: nextStep} , {scheme_id: id})
}


//Function used from middleware to find the MAX steps for a given scheme id
function findMaxStep(id) {
    return db('steps').where('scheme_id' , '=' , id).max('step_number');
}