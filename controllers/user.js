const {User, Thought} = require('../models');

const userController = {
    // get all users
    async getAllUsers(req, res) {
        const data = await User.find({})
        .populate({
            path: 'thoughts',
            select: '-__v'
        })
        .populate({
            path: 'friends',
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
    // get one user by id
    async getUserById(req, res) {
        const data = await User.findOne({_id: req.params.userId})
        .populate({
            path: 'thoughts',
            select: '-__v'
        })
        .populate({
            path: 'friends',
            select: '-__v'
        })
        .select('-__v')
        .then(data => {
            // If no user is found, send 404
            if (!data) {
                res.status(404).json({message: 'No user found with this id!'});
                return;
            }
            res.json(data);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },
    // createUser
    async createUser({body}, res) {
        const data = await User.create(body)
        .then(data => res.json(data))
        .catch(err => res.status(400).json(err));
    },
    // update user by id
    async updateUser(req, res) {
        const data = await User.findOneAndUpdate(
            {_id: req.params.userId},
            {$set: req.body},
            {new: true, runValidators: true}
        )
        .then(data => {
            if (!data) {
                res.status(404).json({message: 'No user found with this id!'});
                return;
            }
            res.json(data);
        })
        .catch(err => res.status(400).json(err));
    },
    // delete user
    async deleteUser(req, res) {
        const data = await User.findOneAndDelete({_id: req.params.userId})
        .then(data => {
            if (!data) {
                res.status(404).json({message: 'No user found with this id!'});
                return;
            }
            res.json(data);
        }
        )
        .catch(err => res.status(400).json(err));
    },
    // add friend
    async addFriend(req, res) {
        const data = await User.findOneAndUpdate(
            {_id: req.params.userId},
            {$push: {friends: req.params.friendId}},
            {new: true, runValidators: true}
        )
        .then(data => {
            if (!data) {
                res.status(404).json({message: 'No user found with this id!'});
                return;
            }
            res.json(data);
        })
        .catch(err => res.status(400).json(err));
    },
    // delete friend
    async deleteFriend(req, res) {
        const data = await User.findOneAndUpdate(
            {_id: req.params.userId},
            {$pull: {friends: req.params.friendId}},
            {new: true, runValidators: true}
        )
        .then(data => {
            if (!data) {
                res.status(404).json({message: 'No user found with this id!'});
                return;
            }
            res.json(data);
        })
        .catch(err => res.status(400).json(err));
    }
};

module.exports = userController;
