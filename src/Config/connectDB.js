const mongoose = require('mongoose')

require('dotenv').config()
const host = process.env.DB_HOST
const username = process.env.DB_USERNAME
const password = process.env.DB_PASSWORD
const collection = process.env.DB_COLLECTION_NAME
const cluster = process.env.DB_CLUSTER

const DB_URL = host + "://" + username + ':' + password + "@" + cluster + '/' + collection + "?retryWrites=true&w=majority&appName=Cluster0"

function connectDB(){
    promise = new Promise(async (resolve, reject) => {
        try {
            resolve(await mongoose.connect(DB_URL))
        } catch (error) {
            reject(error)
        }
    })
    return promise
}
module.exports = connectDB