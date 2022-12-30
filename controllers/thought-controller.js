const { User, Thought } = require('../models');

const thoughtController = {
    // GET all thoughts
    getThoughts(req, res) {
        Thought.find({})
            .then((dbThoughtInfo) => res.json(dbThoughtInfo))
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },

    // GET thought by id
    thoughtById(req, res) {
        Thought.findOne({ _id: req.params.id })
            .then((dbThoughtInfo) => {
                !dbThoughtInfo
                    ? res.status(404).json({
                        message: "No thoughts have been found with this id. Please try again!"
                    })
                    : res.json(dbThoughtInfo);
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },

    // POST a new thought
    createThought(req, res) {
        Thought.create(req.body)
            .then((dbThoughtInfo) => {
                return User.findByIdAndUpdate(
                    req.body.userId,
                    { $push: { thoughts: dbThoughtInfo._id } },
                    { new: true }
                );
            })
            .then((dbThoughtInfo) => res.json(dbThoughtInfo))
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },

    // UPDATE a thought
    updateThought({ params, body }, res) {
        Thought.findByIdAndUpdate({ _id: params.id }, body, {
            new: true,
            runValidators: true,
        })
        .then((updatedThought) => {
            if (!updatedThought) {
                return res.status(404).json({
                    message: "No thoughts have been found with this id. Please try again!"
                });
            } else {
                res.json(updatedThought);
            }
        })
        .catch((err) => res.json(err));
    },

    // DELETE a thought
    deleteThought(req, res) {
        Thought.findOneAndDelete({ _id: req.params.id })
            .then((dbThoughtInfo) => {
                !dbThoughtInfo
                    ? res.status(404).json({
                        message: "No thoughts have been found with this id. Please try again!"
                    })
                    : res.status(200).json({
                        message: "Thought with this id has been found and deleted successfully."
                    })
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },
    
    // POST a reaction
    createReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $push: { reactions: body } },
            { new: true, runValidators: true }
        )
            .then((dbThoughtInfo) => {
                !dbThoughtInfo
                    ? res.status(404).json({
                        message: "No thoughts have been found with this id. Please try again!"
                    })
                    : res.json({
                        message: "Successfully added a new reaction",
                        dbThoughtInfo
                    });
            })
            .catch((err) => res.json(err));
    },

    // DELETE a reaction
    deleteReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reactions: { reactionId: req.params.reactionId } } }
        )
            .then((dbThoughtInfo) => {
                !dbThoughtInfo
                    ? res.status(404).json({
                        message: "No thoughts have been found with this id. Please try again!"
                    })
                    : res.status(200).json({
                        message: "Thought with this id has been found and deleted successfully."
                    });
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    }
}

module.exports = thoughtController;