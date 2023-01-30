const { Router } = require('express');

const router = new Router();
const postController = require('../../controllers/admin/postController');

// Add Post
router.post('/add-post', postController.handleAddPost);

/// Edit Post
router.put('/edit-post/:id', postController.handleEditPost);

// Delet Post
router.delete('/delete-post/:id' , postController.getDeletePost);

module.exports = router;