const errorHanlder = (err, req, res, next) => {
    console.error(err.stack);
    err.statusCode = err.statusCode || 500;

    res.status(err.statusCode).json({
        status: err.statusCode,
        message: err.message
    });
};

module.exports = errorHanlder;

