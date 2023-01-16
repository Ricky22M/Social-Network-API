const { Users, Thoughts } = require("../models");

module.exports = {
  //Get all users
  getUser(req, res) {
    Users.find({})
      .then((user) => res.json(user))
      .catch((err) => res.status(500).json(err));
  },
   // Get single user by ID
   getUsersById(req, res) {
    Users.findOne({ _id: req.params.userId })
    .select('-__v')
    // return if no user is found 
    .then(user => {
        if(!user) {
            res.status(404).json({message: 'No User with this ID'});
            return; 
        }
        res.json(user)
    })
    .catch(err => {
        console.log(err);
        res.status(400).json(err)
    })
},

  //create a user
  createUser(req, res) {
    Users.create(req.body)
      .then((user) => res.json(user))
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  //update a user
  updateUser(req, res) {
    Users.findOneAndUpdate(
      { _id: req.params.userId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No User with this ID" })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
  //delete a user
  //BONUS: Remove a user's associated thoughts when deleted.
  deleteUser(req, res) {
    Users.findOneAndDelete({ _id: req.params.userId })
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No User with this ID" })
          : Thoughts.deleteMany({ _id: { $in: user.thoughts } })
      )
      .then(() => res.json({ message: "User and Thought deleted!" }))
      .catch((err) => res.status(500).json(err));
  },
  //add a friend
  addFriend(req, res) {
    Users.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.params.friendId } },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No User find with this ID!" })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
  //delete a friend
  deleteFriend(req, res) {
    Users.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId } },
      { new: true }
    )
      .then(
        (user) =>
          !user
            ? res.status(404).json({ message: "No User find with this ID!" })
            : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
};