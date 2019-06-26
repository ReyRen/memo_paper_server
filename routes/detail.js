const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated, initAuthenticated } = require('../config/auth');
const MemoRecord = require('../models/MemoRecord');

// Default page of dashboard
router.get('/', ensureAuthenticated, (req, res) => {
  // TODO: need check query id
  MemoRecord.findById(+req.query.id, function (err, record) {
    res.render('detail', {
      layout: "layouts/layout_dashboard",
      body: record
    })
  });
});

module.exports = router;
