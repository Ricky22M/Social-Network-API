const router = require('express').Router();

const {
    getThoughts,
    thoughtById,
    createThought,
    updateThought,
    deleteThought,
    createReaction,
    deleteReaction
} = require('../../controllers/thought-controller');

// GET thoughts and POST new thoughts
router.route('/')
    .get(getThoughts)
    .post(createThought);

// GET a thought by id, update thought with PUT route using id, and DELETE thought using id
router.route('/:thoughtId')
    .get(thoughtById)
    .put(updateThought)
    .delete(deleteThought);

// POST new reaction
router.route('/:thoughtId/reactions')
    .post(createReaction);

// DELETE reaction with reaction id
router.route('/:thoughtId/reactions/:reactionId')
    .delete(deleteReaction);

module.exports = router;