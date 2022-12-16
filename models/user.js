const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            unique: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        passwordHash: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true,
            unique: true
        },
        isAdmin: {
            type: Boolean,
            default: false
        },
        firstName: {
            type: String,
            default: ''
        },
        lastName: {
            type: String,
            default: ''
        },
        street: {
            type: String,
            default: ''
        },
        apartment: {
            type: String,
            default: ''
        },
        zip: {
            type: String,
            default: ''
        },
        city: {
            type: String,
            default: ''
        },
        country: {
            type: String,
            default: ''
        }
    },
    {
        timestamps: true
    }
);

userSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

userSchema.set('toJSON', {
    virtuals: true,
});

exports.User = mongoose.model('User', userSchema);
exports.userSchema = userSchema;