const {Router} = require('express');

const router = new Router();
const postController = require('../../controllers/admin/postController');

router.get('/add-post', postController.getAddPost);
module.exports = router;