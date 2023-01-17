const router = require('express').Router();

    // Thought routes

const {
    getUser,
    getUsersById,
    createUser,
    updateUser,
    deleteUser,
    addFriend,
    deleteFriend
} = require('../../controllers/user-controller');

// /api/users GET all and POST 
router.route('/').get(getUser).post(createUser);

// /api/users/:userId GET one user, PUT and DELETE by user's ID
router.route('/:userId')
.get(getUsersById)
.put(updateUser)
.delete(deleteUser);

// /api/users/:userId/friends/:friendId POST and DELETE a friend by ID
router.route('/:userId/friends/:friendId')
.post(addFriend)
.delete(deleteFriend);

module.exports = router;