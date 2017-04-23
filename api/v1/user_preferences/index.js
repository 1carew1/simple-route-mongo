import express from 'express';
import _ from 'lodash';
import mongoose from 'mongoose';
import UserPreference from './userPreferencesModel';

const router = express.Router();

// Gey all UserPreferences
router.get('/', (req, res) => {
    UserPreference.find((err, userPreferences) => {
        if (err) {
            return handleError(res, err);
        }
        return res.send(userPreferences);
    });
});


// Get specific UserPreference given the user id
router.get('/:user_id', (req, res) => {
    const key = req.params.user_id;
    const query = UserPreference.findOne({ 'user_id': key });
    query.exec((err, userPref) => {
        if (err) {
            return handleError(res, err);
        }
        return res.send(userPref);
    });
});


//Add a UserPreference
router.post('/', (req, res) => {
    let newUserPreference = req.body;
    if (newUserPreference) {
        UserPreference.create(newUserPreference, (err, userPreference) => {
            if (err) {
                return handleError(res, err);
            }
            console.log('UserPreference was saved');
            return res.status(201).send({ userPreference });
        });
    } else {
        return handleError(res, err);
    }
});

//Update a UserPreference
router.put('/:user_id', (req, res) => {
    let key = req.params.user_id;
    let updateUserPreference = req.body;

    if (updateUserPreference._id) { delete updateUserPreference._id; }
    const query = UserPreference.findOne({ 'user_id': key });
    query.exec((err, userPreference) => {
        if (err) {
            console.log('Did not find the userPreference');
            return handleError(res, err);
        } else {
            const updated = _.merge(userPreference, updateUserPreference);
            updated.save((err) => {
                if (err) {
                    return handleError(res, err);
                } else {
                    return res.send(userPreference);
                }
            });
        }
        return res.send(userPref);
    });
});

//Delete a UserPreference
router.delete('/:id', (req, res) => {
    let key = req.params.id;
    UserPreference.findById(key, (err, userPreference) => {
        if (err) {
            return res.status(400).send(err);
        }
        if (!userPreference) {
            return res.send(404);
        }
        userPreference.remove(err => {
            if (err) {
                return handleError(res, err);
            }
            return res.send(userPreference);
        });
    });
});

function handleError(res, err) {
    return res.status(500).send(err);
};

export default router;
