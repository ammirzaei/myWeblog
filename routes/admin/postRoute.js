const { Router } = require('express');

const router = new Router();
const postController = require('../../controllers/admin/postController');

// Add Post
router.get('/add-post', postController.getAddPost);
router.post('/add-post', postController.handleAddPost);

/// Edit Post
router.get('/edit-post/:id', postController.getEditPost);
router.post('/edit-post/:id', postController.handleEditPost);

// Delet Post
router.get('/delete-post/:id' , postController.getDeletePost);

module.exports = router;