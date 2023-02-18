const { Schema, model } = require('mongoose');

// Schema to create User model
const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            // Must match a valid email address
            match: /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/
        },
        // Array of _id values referencing the Thought model
        thoughts: [
            {
                type: Schema.Types.ObjectId,
                ref: 'thought'
            }
        ],
        // Array of _id values referencing the User model (self-reference)
        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: 'user'
            }
        ],
    },
    {
        toJSON: {
            virtuals: true,
        },
        id: false,
    }
);
// a virtual called friendCount that retrieves the length of the user's friends array field on query.
userSchema
    .virtual('friendCount')
    .get(function () {
        return this.friends.length;
    });


const User = model('user', userSchema);

module.exports = User;