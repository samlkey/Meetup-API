const db = require("../models");
const User = db.users;
const bcrypt = require('bcrypt');
const saltRounds = 10;

exports.create = (req, res) => {
  if (!req.body) {
    res.status(400).send({ message: "[ERROR] Empty Request!" });
    return;
  }
  bcrypt.genSalt(saltRounds, function(err, salt){
    bcrypt.hash(req.body.password, salt, function(err, hash){
      const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: hash,
      });
      user
        .save(user)
        .then(data => {
          res.send(data);
        })
        .catch(err => {
          res.status(500).send({
          message:
          err.message || "[ERROR] A Problem Occured While Saving The User"
        });
      });
    })
  })
};

exports.read = (req, res) => {
  const id = req.params.id;
  User.findById(id)
    .then(data => {
      if(!data){
        res.status(404).send({ message: "[ERROR] User Not Found!"})
      }else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "[ERROR] User Not Found With ID " + id});
    })
};

exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "[ERROR] Update data empty!"
    });
  }
  const id = req.params.id;
  bcrypt.genSalt(saltRounds, function(err, salt){
    bcrypt.hash(req.body.password, salt, function(err, hash){
      req.body.password = hash; 
      User.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
        if (!data) {
          res.status(404).send({
            message: `[ERROR] Cannot Update User With ID ${id}`
          });
        } else res.send({ message: "[PASS] User Updated Successfully." });
        })
        .catch(err => {
          res.status(500).send({
          message: "[ERROR] Cant Update User With ID " + id
          });
        });   
    });
  })  
};

exports.delete = (req, res) => {
  const id = req.params.id;
  User.findByIdAndRemove(id)
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `[ERROR] Cannot delete user with id=${id}`
        });
      } else {
        res.send({
          message: "[PASS] User Deleted Successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "[ERROR] Could Not Delete User With ID " + id
      });
    });
}

exports.readAll = (req, res) => {
  const title = req.query.username;
  var condition = title ? {username: {$regex: new RegExp(title), $options: "i"}} : {}
  User.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "[ERROR] Problem Has Occured"
      })
    })
}