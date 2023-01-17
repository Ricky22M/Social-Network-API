const { Users, Thoughts } = require("../models");

module.exports = {
  // Gets all thoughts from GET request
  getThought(req, res) {
    Thoughts.find({})
      .then((thought) => res.json(thought))
      // return error if thought ID cannot be found
      .catch((err) => res.status(500).json(err));
  },
  // Gets a single thought from GET thought By ID requests
  getSingleThought(req, res) {
    Thoughts.findOne({ _id: req.params.thoughtId })
      .select("-__v")
      .then((thought) =>
        // return error if thought ID cannot be found
        !thought
          ? res.status(404).json({ message: "No Thought found with this ID" })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
  // This creates a thought and push the created thought's _id to the associated user's thoughts array field (This is used as a POST request)
  createThought(req, res) {
    Thoughts.create(req.body)
      .then(({ _id }) => {
        return Users.findOneAndUpdate(
          { _id: req.body.userId },
          { $push: { thoughts: _id } },
          { new: true }
        );
      })
      .then((thought) =>
        // return error if thought ID cannot be found
        !thought
          ? res.status(404).json({ message: "No User with this ID" })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
  // PUT request used to update a user's thought
  updateThought(req, res) {
    Thoughts.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $set: req.body },
      { runValidators: true, New: true }
    )
      .then((user) =>
        // return error if thought ID cannot be found
        !user
          ? res.status(404).json({ message: "No thought with this ID" })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
  // DELETE request is used to get a thought by its ID and delete the thought
  deleteThought(req, res) {
    Thoughts.findOneAndDelete({ _id: req.params.thoughtId })
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "No thought with this ID" })
          : Users.findOneAndUpdate(
              { thoughts: req.params.thoughtId },
              { $pull: { thoughts: req.params.thoughtId } },
              { new: true }
            )
      )
      .then((user) =>
            // return error if thought ID cannot be found
        !user
          ? res.status(404).json({ message: 'Thought deleted, but no user found'})
          : res.json({ message: 'Thought successfully deleted' })
      )
      .catch((err) => res.status(500).json(err));
  },
  // POST request used to create a reaction on a user's thought
  createReaction(req, res) {
    Thoughts.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: { reactions: req.body } },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        // return error if thought ID cannot be found
        !thought
          ? res.status(404).json({ message: "No thought with this ID" })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
  // DELETE request used to get a reaction's ID and deletes that reaction
  deleteReaction(req, res) {
    Thoughts.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        // return error if thought ID cannot be found
        !thought
          ? res.status(404).json({ message: "No thought found with this ID" })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
};