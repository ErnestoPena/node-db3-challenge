const express = require('express');

const Schemes = require('./scheme-model.js');

const router = express.Router();


//GET to retreive all schemes
router.get('/', async (req, res) => {
  try {
    const schemes = await Schemes.find();
    res.json(schemes);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get schemes' });
  }
});


//GET to retreive a single scheme
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const scheme = await Schemes.findById(id);

    if (scheme) {
      res.json(scheme);
    } else {
      res.status(404).json({ message: 'Could not find scheme with given id.' })
    }
  } catch (err) {
    res.status(500).json({ message: 'Failed to get schemes' });
  }
});

//GET to retreive the steps for a given scheme
router.get('/:id/steps', async (req, res) => {
  const { id } = req.params;

  try {
    const steps = await Schemes.findSteps(id);

    if (steps.length) {
      res.json(steps);
    } else {
      res.status(404).json({ message: 'Could not find steps for given scheme' })
    }
  } catch (err) {
    res.status(500).json({ message: 'Failed to get steps' });
  }
});


//POST to add a single scheme
router.post('/', async (req, res) => {
  const schemeData = req.body;

  try {
    const scheme = await Schemes.add(schemeData);
    res.status(201).json(scheme);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create new scheme' });
  }
});

//POST to create new steps for a given scheme
router.post('/:id/steps', findNextStep, async (req, res) => {
  const stepData  = req.body;
  const { id } = req.params; 
  const nextStep = req.params.nextStepNumber

  try {
    const scheme = await Schemes.findById(id);

    if (scheme) {
      const step = await Schemes.addStep(stepData , nextStep , id);
      res.status(201).json(step);
    } else {
      res.status(404).json({ message: 'Could not find scheme with given id.' })
    }
  } catch (err) {
    res.status(500).json({ message: 'Failed to create new step', err });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  try {
    const scheme = await Schemes.findById(id);

    if (scheme) {
      const updatedScheme = await Schemes.update(changes, id);
      res.json(updatedScheme);
    } else {
      res.status(404).json({ message: 'Could not find scheme with given id' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Failed to update scheme' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Schemes.remove(id);

    if (deleted) {
      res.json({ removed: deleted });
    } else {
      res.status(404).json({ message: 'Could not find scheme with given id' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete scheme' });
  }
});

//Middleware to process the next step number in the sequence
async function findNextStep(req , res , next) {
  const { id } = req.params;
  
  const [countSchemes] = await Schemes.find(id);
  if (countSchemes) {
    const stepNumber = await Schemes.findMaxStep(id);
    req.params.nextStepNumber = stepNumber[0].a + 1;
    next();
  } else {
    res.status(203).json({message: `There was no schemes associated with the id: ${id}`});
  }
}


module.exports = router;