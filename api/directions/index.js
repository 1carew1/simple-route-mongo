import express from 'express';
import _ from 'lodash';
import mongoose from 'mongoose';
import Direction from './directionsModel';
import config from './../../config';


// Connect to database
mongoose.connect(config.mongoDb);

const router = express.Router();

router.get('/', (req, res) => {
 Direction.find((err, directions) => {
    if(err) { return handleError(res, err); }
    return res.send(directions);
  });
});

//Add a direction
router.post('/', (req, res) => {
        let newDirection = req.body;
        if (newDirection){
           Direction.create(newDirection, (err, direction) => {
              if(err) { return handleError(res, err); }
                 return res.status(201).send({direction});
          });
      }else{
           return handleError(res, err);
      }
});

//Update a direction
router.put('/:id', (req, res) => {
     let key = req.params.id;
     let updateDirection = req.body;

   if(updateDirection._id) { delete updateDirection._id; }
   Direction.findById(req.params.id,  (err, direction) => {
      if (err) { return handleError(res, err); }
        if(!direction) { return res.send(404); }
            const updated = _.merge(direction, updateDirection);
            updated.save((err) => {
                  if (err) { return handleError(res, err); }
                          return res.send(direction);
            });
      });
});

//Delete a direction
router.delete('/:id', (req, res) => {
     let key = req.params.id;
   Direction.findById(key, (err, direction)=> {
    if(err) { return res.status(400).send(err);}
    if(!direction) { return res.send(404); }
    direction.remove(err => {
      if(err) { return handleError(res, err); }
      return res.send(direction);
    });
  });      
});

function handleError(res, err) {
  return res.status(500).send(err);
};

export default router;