const errorHandler = (error, req, res, next) => {
    console.error('Error!!!', error);

    if (error.name === 'UnauthorizedError') {
        const status = 401;
        const message = error.message || "No authorization token was found";
        const code = error.code || error.status;

        res.status(status).json({ status, code, message });

        return;
    }
    
    if (error.status === 401 && error.message === "Unauthorized") {
        const status = 401;
        const message = error.message || "Requires authentication";
        const code = error.code || error.status;

        res.status(status).json({ status, code, message });
    
        return;
    }
    
    if (error.status === 401 && error.code === "invalid_token" && error.message === "Permission denied") {
        const status = 403;
        const message = error.message;
        const code = error.code || error.status;
    
        res.status(status).json({ status, code, message });
    
        return;
    }
    
    const status = error.statusCode || error.code || 500;
    const code = error.code || error.status;
    const message = error.message || "internal error";

    res.status(status).json({ status, message });
};
    
module.exports = {
    errorHandler,
};
