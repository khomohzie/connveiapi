const express = require('express');
const { contactForm, contactBlogAuthorForm } = require('../controllers/form');

const router = express.Router();

// const {  } = require('../controllers/category');

// validators
const { runValidation } = require('../validators');
const { contactFormValidator } = require('../validators/form');

router.post('/contact', contactFormValidator, runValidation, contactForm);
router.post('/contact-blog-author', contactFormValidator, runValidation, contactBlogAuthorForm);

module.exports = router;