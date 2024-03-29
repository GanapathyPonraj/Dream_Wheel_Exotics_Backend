const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')
const Schema = mongoose.Schema

const userSchema = new Schema({
    name: { type: String },
    contactNumber: { type: Number },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePic: { type:String },
    favoriteCars: [{ type: mongoose.Schema.Types.ObjectID, ref: 'car' }]
}, { timestamps: true })

userSchema.statics.signup = async function (email, password , name, contactNumber) {
    // validation
    if (!email || !password) {
        throw Error('All fields must be filled')
    }
    if (!validator.isEmail(email)) {
        throw Error('Email not valid')
    }
    // if (!validator.isStrongPassword(password)) {
    //     throw Error('Password not strong enough')
    // }
    
    const exists = await this.findOne({ email })
    if (exists) {
        throw Error('Email Already in Use')
    }
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    const user = await this.create({
        name,
        email, 
        password: hash,
        contactNumber
    })
    return user
}

// static login method
userSchema.statics.login = async function (email, password) {

    if (!email || !password) {
        throw Error('All fields must be filled')
    }
    const user = await this.findOne({ email })
    if (!user) {
        throw Error('Incorrect email')
    }
    const match = await bcrypt.compare(password, user.password)
    if (!match) {
        throw Error('Incorrect password')
    }
    return user
}

const userModel = mongoose.model('user', userSchema)
module.exports = userModel