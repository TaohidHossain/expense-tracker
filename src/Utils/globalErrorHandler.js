module.exports = function(error, req, res, error){
    error.status = error.status || 'error'
    error.statusCode = error.statusCode || 500
    return res.status(error.statusCode).json({
        "status": error.statusCode < 500 ? 'fail' : 'error',
        "statusCode": error.statusCode,
        "message": error.message,
        "error": error
    })
}