const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated, initAuthenticated } = require('../config/auth');
const MemoRecord = require('../models/MemoRecord');

router.post('/', ensureAuthenticated, (req, res) => {
    MemoRecord.findById(req.body.id, function (err, record) {
		res.end(JSON.stringify(record));
  });
});

module.exports = router;
