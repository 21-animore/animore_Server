var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'ani-more\'s Server' });
});

router.use('/user', require('./user'));
router.use('/card', require('./card'));

module.exports = router;
