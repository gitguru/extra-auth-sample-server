const { validate_totp_token_from_jwt_token } = require("@agagguturu/extra-auth-totp-validator");

const getAuthorizationToken = (req) => {
    const token = req.header('Authorization');
    if (token && token.length) {
        return token.replace('Bearer ', '');
    } else {
        return null;
    }
}

const getTOTPToken = (req) => {
    const totp = req.header('X-Extra-Auth-Totp');
    if (totp && totp.length) {
        return totp;
    } else {
        return null;
    }
}

const requiresTOTP = (req, res, next) => {
    if (validate_totp_token_from_jwt_token(getAuthorizationToken(req), getTOTPToken(req)) === false) {
        const status = 400;
        const message = "Invalid TOTP token.";
        console.error("Invalid TOTP token given", req.headers);
        res.status(status).json({ status, message });
        return;
    } 
    next();
};

module.exports = {
    requiresTOTP,
};
