var express = require('express');
var router = express.Router();

router.get('/', (_req, res, _next) => {
  res.render('index');
});

module.exports = router;
