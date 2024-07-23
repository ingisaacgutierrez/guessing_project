const { body, validationResult, param } = require('express-validator');
const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

// Obtener todos los usuarios
const getAll = async (req, res) => {
  try {
    const result = await mongodb.getDb().db().collection('user').find();
    const users = await result.toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while retrieving the users', error });
  }
};

const getSingle = async (req, res) => {
  const userId = req.params.id;
  try {
    const result = await mongodb
      .getDb()
      .db()
      .collection('user')
      .findOne({ _id: new ObjectId(userId) });

    if (result) {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: 'Admin Not Found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while retrieving the admin', error });
  }
};

// Crear un nuevo usuario
const createUser = [
  body('username').notEmpty().withMessage('Username is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  body('highestScore').isInt().withMessage('Highest score must be an integer'),
  body('numberOfErrors').isInt().withMessage('Number of errors must be an integer'),
  body('scoreHistory').isArray().withMessage('Score history must be an array'),
  body('missed_question').isArray().withMessage('Missed questions must be an array'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userInsert = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      highestScore: req.body.highestScore,
      numberOfErrors: req.body.numberOfErrors,
      scoreHistory: req.body.scoreHistory,
      missed_question: req.body.missed_question
    };

    try {
      const response = await mongodb
        .getDb()
        .db()
        .collection('user')
        .insertOne(userInsert);
      if (response.acknowledged) {
        res.status(201).json(response);
      } else {
        res.status(500).json({ message: 'An error occurred while creating the user.' });
      }
    } catch (error) {
      res.status(500).json({ message: 'An error occurred while creating the user', error });
    }
  }
];

// Actualizar un usuario
const updateUser = [
  param('id').notEmpty().withMessage('User ID is required'),
  body('username').notEmpty().withMessage('Username is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  body('highestScore').isInt().withMessage('Highest score must be an integer'),
  body('numberOfErrors').isInt().withMessage('Number of errors must be an integer'),
  body('scoreHistory').isArray().withMessage('Score history must be an array'),
  body('missed_question').isArray().withMessage('Missed questions must be an array'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.params.id;
    const userUpdate = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      highestScore: req.body.highestScore,
      numberOfErrors: req.body.numberOfErrors,
      scoreHistory: req.body.scoreHistory,
      missed_question: req.body.missed_question
    };

    try {
      const response = await mongodb
        .getDb()
        .db()
        .collection('user')
        .replaceOne({ _id: new ObjectId(userId) }, userUpdate);
      if (response.modifiedCount > 0) {
        res.status(204).send();
      } else {
        res.status(500).json({ message: 'An error occurred while updating the user.' });
      }
    } catch (error) {
      res.status(500).json({ message: 'An error occurred while updating the user', error });
    }
  }
];

// Eliminar un usuario
const deleteUser = [
  param('id').notEmpty().withMessage('User ID is required'),

  async (req, res) => {
    const userId = req.params.id;
    try {
      const response = await mongodb
        .getDb()
        .db()
        .collection('user')
        .deleteOne({ _id: new ObjectId(userId) });
      if (response.deletedCount > 0) {
        res.status(204).send();
      } else {
        res.status(500).json({ message: 'An error occurred while deleting the user.' });
      }
    } catch (error) {
      res.status(500).json({ message: 'An error occurred while deleting the user', error });
    }
  }
];

module.exports = { getAll, getSingle, createUser, updateUser, deleteUser };
