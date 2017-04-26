import express from 'express';
import _ from 'lodash';
import mongoose from 'mongoose';
import Direction from './directionsModel';
import UrlServices from '../../UrlServices';

const router = express.Router();
const urlServices = new UrlServices();

// Gey all directions
// Url can contain queries like ?user_id and limit=
router.get('/', (req, res) => {
    const limit = urlServices.obtainLimitFromRequest(req);
    const userId = req.query.user_id;
    let startDateSearch = null;
    let endDateSearch = null;
    if (req.query.start_date && req.query.end_date) {
        try {
            startDateSearch = Date.parse(req.query.start_date);
            endDateSearch = Date.parse(req.query.end_date);
        } catch (e) {
            console.log('Error Parsing Dates');
        }
    }

    const queryObject = {};
    if (userId) {
        queryObject.user_id = userId;
    }
    if (startDateSearch && endDateSearch) {
        queryObject.date_searched = { $gt: startDateSearch, $lt: endDateSearch }
    }
    const query = Direction.find(queryObject);
    query.
    limit(limit).
    sort({_id : -1}).
    exec((err, directions) => {
        if (err) {
            return handleError(res, err);
        } else {
            return res.send(directions);

        }
    });
});


// Get specific direction
router.get('/:id', (req, res) => {
    const key = req.params.id;
    Direction.findById(key, (err, direction) => {
        if (err) {
            return handleError(res, err);
        }
        if (!direction) {
            console.log('Did not find the direction');
            return res.send(404);
        } else {
            return res.send(direction);
        }
    });
});


//Add a direction
router.post('/', (req, res) => {
    const newDirection = req.body;
    if (newDirection) {
        Direction.create(newDirection, (err, direction) => {
            if (err) {
                return handleError(res, err);
            }
            return res.status(201).send({ direction });
        });
    }
});

//Update a direction - Probably uneeded, wont be updating
router.put('/:id', (req, res) => {
    let key = req.params.id;
    const updateDirection = req.body;

    if (updateDirection._id) { delete updateDirection._id; }
    Direction.findById(key, (err, direction) => {
        if (err) {
            return handleError(res, err);
        }
        if (!direction) {
            console.log('Did not find the direction');
            return res.send(404);
        } else {
            const updated = _.merge(direction, updateDirection);
            updated.save((err) => {
                if (err) {
                    return handleError(res, err);
                } else {
                    return res.send(direction);
                }
            });
        }
    });
});

//Delete a direction
router.delete('/:id', (req, res) => {
    const key = req.params.id;
    Direction.findById(key, (err, direction) => {
        if (err) {
            return res.status(400).send(err);
        }
        if (!direction) {
            return res.send(404);
        }
        direction.remove(err => {
            if (err) {
                return handleError(res, err);
            }
            return res.send(direction);
        });
    });
});

function handleError(res, err) {
    return res.status(500).send(err);
}

export default router;
