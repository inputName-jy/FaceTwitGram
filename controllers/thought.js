const {ObjectId} = require('mongodb');
const {Thought, User} = require('../models');

const thoughtController = {
    // get all thoughts
    async getAllThoughts(req, res) {
        const data = await Thought.find({})
        .populate({
            path: 'reactions',
            select: '-__v'
        })
        .select('-__v')
        .sort({_id: -1})
        .then(data => res.json(data))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },
    // get one thought by id
    async getThoughtById(req, res) {
        const data = await Thought.findOne({_id: req.params.thoughtId})
        .populate({
            path: 'reactions',
            select: '-__v'
        })
        .select('-__v')
        .then(data => {
            // If no thought is found, send 404
            if (!data) {
                res.status(404).json({message: 'No thought found with this id!'});
                return;
            }
            res.json(data);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },
    // createThought
    async createThought(req, res) {
        const data = await Thought.create({
            thoughtText: req.body.thoughtText,
            username: req.body.username,
        })
        .then(data => {
            return User.findOneAndUpdate(
                {_id: req.body.userId},
                {$push: {thoughts: data._id}},
                {new: true}
            );
        })
        .then(data => {
            if (!data) {
                res.status(404).json({message: 'No user found with this id!'});
                return;
            }
            res.json(data);
        })
        .catch(err => res.status(400).json(err));
    },
    // update thought by id
    async updateThought(req, res) {
        const data = await Thought.findOneAndUpdate(
            {_id: req.params.thoughtId},
            {$set: req.body},
            {new: true, runValidators: true}
        )
        .then(data => {
            if (!data) {
                res.status(404).json({message: 'No thought found with this id!'});
                return;
            }
            res.json(data);
        })
        .catch(err => res.status(400).json(err));
    },
    // delete thought
    async deleteThought(req, res) {
        const data = await Thought.findOneAndDelete({_id: req.params.thoughtId})
        .then(data => {
            if (!data) {
                res.status(404).json({message: 'No thought found with this id!'});
                return;
            }
            return User.findOneAndUpdate(
                {username: data.username},
                {$pull: {thoughts: req.params.thoughtId}},
                {new: true}
            );
        })
        .then(data => {
            if (!data) {
                res.status(404).json({message: 'No user found with this id!'});
                return;
            }
            res.json(data);
        })
        .catch(err => res.status(400).json(err));
    },
    // add reaction
    async addReaction(req, res) {
        const data = await Thought.findOneAndUpdate(
            {_id: req.params.thoughtId},
            {$push: {reactions: req.body}},
            {new: true, runValidators: true}
        )
        .then(data => {
            if (!data) {
                res.status(404).json({message: 'No thought found with this id!'});
                return;
            }
            res.json(data);
        })
        .catch(err => res.status(400).json(err));
    },
    // delete reaction
    async deleteReaction(req, res) {
        const data = await Thought.findOneAndUpdate(
            {_id: req.params.thoughtId},
            {$pull: {reactions: {reactionId: req.params.reactionId}}},
            {new: true}
        )
        .then(data => {
            if (!data) {
                res.status(404).json({message: 'No thought found with this id!'});
                return;
            }
            res.json(data);
        })
        .catch(err => res.status(400).json(err));
    }


};


module.exports = thoughtController;