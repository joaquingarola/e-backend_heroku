const { Router } = require('express');
const express = require("express");
const { fork } = require('child_process');
const randomGenerator = fork('./utils/random');

const router = Router();
router.use(express.json());
router.use(express.urlencoded({extended: true}));

router.get('/randoms', (req, res) => {
    const cant = parseInt(req.query.cant) || 100000;
    randomGenerator.send(cant); 
    randomGenerator.on('message', (result) => {
       res.end('resultado:' +result)
    })

})

module.exports = router;