const express = require('express');
const { getSkillGap } = require('../controllers/skillController');
const router = express.Router();

router.get('/', getSkillGap);

module.exports = router;
