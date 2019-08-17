const db = require('../data/db-config')

module.exports = {
    find,
    findById,
    add,
    findSteps,
    findMaxStep,
    addStep,
    update,
    remove
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
function addStep(stepData , nextStep,  id) {

    const mystep = {
        instructions: stepData.instructions,
        step_number: nextStep,
        scheme_id : parseInt(id)
    }

    return db('steps').insert(mystep);
}


//Function used from middleware to find the MAX steps for a given scheme id
async function findMaxStep(id) {
    return await db('steps').where('scheme_id' , '=' , id).max('step_number as a');
}

//PUT to update the scheme

function update(newScheme , id) {
    return db('schemes').where('id' , '=' , id).update(newScheme)
}

//DELETE to remove schemes
function remove(id) {
    return db('schemes').where('id' , '=' , id).del()
}