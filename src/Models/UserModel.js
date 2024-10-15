const mongoos = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const { asyncErrorHandler } = require('../Utils')
const userSchema = new mongoos.Schema(
    {
        name: {
            type: String,
            required: [true, "User name is required"]
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            validate: [validator.isEmail, "Please enter a valid email"]
        },
        photo: String,
        password: {
            type: String,
            required: [true, "Password is required"],
            minLength: 6,
            select: false
        },
        confirmPassword: {
            type: String,
            required: [true, "Confirm password is required"],
            validate: {
                validator: function(val){
                    return val == this.password
                },
                message: "Password and Confirm Password do not match"
            }
        },
        passwordChangedAt: Date,
        passwordResetToken: String,
        passwordResetTokenExpiredAt: Date
    },
    {
        timestamps: true
    }
)

userSchema.pre('save', async function(next){
    // if password is not modified don't hash it
    if(!this.isModified('password'))
        return next()
    // else hash password before saving
    this.password = await bcrypt.hash(this.password, 4)
    this.confirmPassword = undefined // we don't nedd this field in future
    next() // call next middleware
})

userSchema.methods.comparePasswordInDB = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.createPasswordResetToken = function(){
    const resetToken = crypto.randomBytes(16).toString('hex')
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    this.passwordResetTokenExpires = Date.now() + 5 * 60 * 1000 // 5 minutes
    return resetToken
}

const User = mongoos.model('user', userSchema)

module.exports = User