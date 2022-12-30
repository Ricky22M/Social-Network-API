const { User, Thought } = require('../models');

const userController = {
    // GET all users
    getUsers(req, res) {
        User.find({})
            .populate('thoughts')
            .populate('friends')
            .select('-__v')
            .sort({ _id: -1 })
            .then((dbUserInfo) => res.json((dbUserInfo)))
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },

    // GET user by id
    userById(req, res) {
        User.findOne({ _id: req.params.id })
            .then((dbUserInfo) => res.json(dbUserInfo))
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },

    // POST a new user
    createUser(req, res) {
        User.create(req.body)
            .then((dbUserInfo) => res.json(dbUserInfo))
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },

    // DELETE a user and DELETE that user's thoughts
    deleteUser(req, res) {
        User.findOneAndDelete({ _id: req.params.id })
            .then((dbUserInfo) => {
                if (!dbUserInfo) {
                    return res.status(404).json({
                        message: "No users were found with this id. Please try again!"
                    })
                }
                Thought.deleteMany({ username: dbUserInfo.username })
                    .then((result) => {
                        res.status(200).json({
                            message: "This user and all associated thoughts have been deleted successfully."
                        });
                    })
                    .catch((thoughtsError) => {
                        res.status(500).json({
                            message: "User thoughts could not be deleted due to an error"
                        });
                    });
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },

    // UPDATE a user
    updateUser(req, res) {
        User.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
            .then((dbUserInfo) => {
                if (!dbUserInfo) {
                    res.status(404).json({
                        message: "No users have been found with this id. Please try again!"
                    })
                } else {
                    res.status(200).json({
                        message: "User found and has been updated successfully."
                    });
                }
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },

    // ADD a friend
    addFriend(req, res) {
        User.findByIdAndUpdate(
            req.params.id,
            { $push: { friends: req.params.friendId } },
            { new: true }
        )
            .then((dbUserInfo) => {
                if (!dbUserInfo) {
                    res.status(404).json({
                        message: "No users have been found with this id. Please try again!"
                    });
                } else {
                    res.status(200).json({
                        message: "You have successfully added a new friend!",
                        user: dbFriendInfo
                    });
                }
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },

    // REMOVE a friend
    deleteFriend(req, res) {
        User.findByIdAndUpdate(
            { _id: req.params.id },
            { $pull: { friends: req.params.friendId } },
            { new: true }
        )
            .then((dbFriendInfo) => {
                if (!dbFriendInfo) {
                    res.status(404).json({
                        message: "No users have been found with this id. Please try again!"
                    });
                } else {
                    res.status(200).json({
                        message: "This friend has been successfully removed.",
                        user: dbFriendInfo
                    });
                }
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    }
}

module.exports = userController;