const jwt = require('jsonwebtoken')
const { asyncErrorHandler, CustomError } = require('../Utils')
const { User } = require('../Models')
const { serverConfig } = require('../Config')

// helper function for siging jwt token using user id
const signToken = function(id){
    return jwt.sign(id, serverConfig.SECRET_STR, { expiresIn: parseInt(serverConfig.LOGIN_EXPIRES / 1000)})
}

const signup = asyncErrorHandler(async (req, res, next) => {
    // create a new User
    const newUser = await User.create(req.body)
    return res.status(201).json({
        'status': 'success'
    })
})

const login = asyncErrorHandler( async (req, res, next) => {
    // Step 1.0: find user with given email
    const { email, password } = req.body
    if(!email || !password){
        const error = new CustomError('Please provide both email and password', 400)
        next(error)
    }
    const user = await User.findOne({email}).select('password')
    if(!user || !await user.comparePasswordInDB(password)){
        const error = new CustomError("Incorrect email or password", 400)
        next(error)
    }
    // Step 2.0: sign jwt token and send token along with user
    const token = signToken(user._id)
    const userObj = { ...user._doc }
    delete userObj['password']
    delete userObj['__v']
    return res.status(200).json({
        'status': 'success',
        token,
        'user': userObj
    })
})

const protect = asyncErrorHandler(async (req, res, next) => {
    // Step 1.0: check if token exists
    const authToken = req.headers.authorization
    let token
    if(authToken && authToken.startsWith("Bearer"))
        token = authToken.split(' ')[1]
    if(!token){
        const error = new CustomError('You are not logged in', 401)
        return next(error)
    }
    // Step 2.0: Verify token and check if user exists
    const decodedToken = jwt.verify(token, serverConfig.SECRET_STR)
    const user = await User.findById(decodedToken.id)
    if(!user){
        const error = new CustomError("The user with given token does not exist.", 404)
        return next(error)
    }
    // Step: 3.0: check if user changed password after signing the token
    // TODO
    // Step 4.0: Allow access
    req.user = user
    return next()
})

module.exports = {
    signup,
    login,
    protect
}