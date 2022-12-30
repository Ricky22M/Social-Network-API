const router = require('express').Router();

const {
    getUsers,
    userById,
    createUser,
    deleteUser,
    updateUser,
    addFriend,
    deleteFriend
} = require('../../controllers/user-controller');

// GET and POST users
router.route('/')
    .get(getUsers)
    .post(createUser);

// GET a user by id, DELETE a user with id, and update users with PUT
router.route('/:userId')
    .get(userById)
    .delete(deleteUser)
    .put(updateUser);

// POST and DELETE friends with ids
router.route('/:userId/friends/:friendId')
    .post(addFriend)
    .delete(deleteFriend);

module.exports = router;