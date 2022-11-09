const generateProducts = require('../controllers/testController.js');
const { Router } = require("express");
const routerTest = new Router();

routerTest.get('/', generateProducts)

module.exports = routerTest;