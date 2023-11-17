const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const generateHash = (password) => {
    try {
        const salt = crypto.randomBytes(16).toString('hex');
        const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
        return {
            salt: salt,
            hash: hash
        };
    } catch (error) {
        console.error('Error generating hash:', error);
        throw error;
    }
};

const comparePassword = (password,hash,salt)=>{
    const newHash  = crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`);

    return newHash === hash
}

const createToken = (correo)=>{
    return jwt.sign(correo, 'token-secreto');
}

const validateToken =(token) =>{
    return jwt.verify(token,'token-secreto',(error,correo)=>{
        if(error) return {error:'token invalido'}
        else return correo
    })
}

module.exports = {
    generateHash:generateHash,
    comparePassword:comparePassword,
    createToken:createToken,
    validateToken:validateToken
}