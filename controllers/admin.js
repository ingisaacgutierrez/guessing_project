const { body, validationResult, param } = require('express-validator');
const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

// Obtener todos los administradores
const getAllAdmins = async (req, res) => {
  try {
    const result = await mongodb.getDb().db().collection('admin').find();
    const admins = await result.toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while retrieving the admins', error });
  }
};

// Obtener un solo administrador por ID
const getSingleAdmin = async (req, res) => {
  const adminId = req.params.id;
  try {
    const result = await mongodb
      .getDb()
      .db()
      .collection('admin')
      .findOne({ _id: new ObjectId(adminId) });

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

// Crear un nuevo administrador
const createAdmin = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const adminInsert = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    };

    try {
      const response = await mongodb
        .getDb()
        .db()
        .collection('admin')
        .insertOne(adminInsert);
      if (response.acknowledged) {
        res.status(201).json(response);
      } else {
        res.status(500).json({ message: 'An error occurred while creating the admin.' });
      }
    } catch (error) {
      res.status(500).json({ message: 'An error occurred while creating the admin', error });
    }
  }
];

// Actualizar un administrador
const updateAdmin = [
  param('id').notEmpty().withMessage('Admin ID is required'),
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const adminId = req.params.id;
    const adminUpdate = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    };

    try {
      const response = await mongodb
        .getDb()
        .db()
        .collection('admin')
        .replaceOne({ _id: new ObjectId(adminId) }, adminUpdate);
      if (response.modifiedCount > 0) {
        res.status(204).send();
      } else {
        res.status(500).json({ message: 'An error occurred while updating the admin.' });
      }
    } catch (error) {
      res.status(500).json({ message: 'An error occurred while updating the admin', error });
    }
  }
];

// Eliminar un administrador
const deleteAdmin = [
  param('id').notEmpty().withMessage('Admin ID is required'),

  async (req, res) => {
    const adminId = req.params.id;
    try {
      const response = await mongodb
        .getDb()
        .db()
        .collection('admin')
        .deleteOne({ _id: new ObjectId(adminId) });
      if (response.deletedCount > 0) {
        res.status(204).send();
      } else {
        res.status(500).json({ message: 'An error occurred while deleting the admin.' });
      }
    } catch (error) {
      res.status(500).json({ message: 'An error occurred while deleting the admin', error });
    }
  }
];

module.exports = { getAllAdmins, getSingleAdmin, createAdmin, updateAdmin, deleteAdmin };

