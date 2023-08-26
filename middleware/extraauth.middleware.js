const { ExtraAuthTokenValidator } = require("@agagguturu/extra-auth-totp-validator");

/**
 * Extract Bearer token from request headers
 * @param {*} req 
 */
const getAuthorizationToken = (req) => {
    const token = req.header('Authorization');
    if (token && token.length) {
        return token.replace('Bearer ', '');
    } else {
        throw new Error(`Authorization header not present.`);
    }
}

/**
 * Extract ExtraAuth token from request headers
 * @param {*} req 
 */
const getExtraAuthToken = (token_validator, req) => {
    const extra_auth_token = req.header(token_validator.getExtraAuthTokenHeaderName());
    if (extra_auth_token && extra_auth_token.length) {
        return extra_auth_token;
    } else {
        throw new Error(`${token_validator.getExtraAuthTokenHeaderName()} header not present.`);
    }
}

/**
 * Validates if current request meets required Authorization and ExtaAuth token
 * @param {*} req - current request
 * @param {*} res - server response
 * @param {*} next - next route if validation success
 */
const requiresExtraAuthToken = (req, res, next) => {
    let token_validator = new ExtraAuthTokenValidator();
    // ATTENTION !!!
    // make sure extra-auth-sample-client configuration matches this settings for server
    token_validator.digits = 6;
    token_validator.period = 60;
    // token_validator.algorithm = "SHA-512"; // SHA-512 is the default
    
    if (token_validator.validate_token(getAuthorizationToken(req), getExtraAuthToken(token_validator, req)) === false) {
        const status = 400;
        const message = "Invalid ExtraAuth token.";
        console.error("Invalid ExtraAuth token given", req.headers);
        res.status(status).json({ status, message });
        return;
    } 
    next();
};

module.exports = {
    requiresExtraAuthToken,
};
