const { Schema, model, Types } = require("mongoose");

const userSchema = new Schema (
    {
        username: {
            type: String,
            unique: [true, "This username is already being usef. Please try a different one."],
            required: [true, "Cannot proceed with an empty username!"],
            trim: true
        },

        email: {
            type: String, 
            unique: [true, "This email address is already being used. Please try a different one."],
            required: [true, "Cannot proceed with an empty email address!"],
            match: [
                /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                "Enter a valid email address."
            ]
        },

        thoughts: [
            {
                type: Schema.Types.ObjectId,
                ref: "Thought"
            }
        ],

        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: "User"
            }
        ],
    },
    {
        toJSON: {
            virtuals: true
        },

        id: false
    }
);

const User = model("User", userSchema);

userSchema.virtual("friendCount", userSchema).get(function() {
    return this.friends.length;
});

module.exports = User;