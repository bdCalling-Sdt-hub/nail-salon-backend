const crypto =require('crypto');

const cryptoHexToken = () => {
    const token = crypto.randomBytes(32).toString('hex')
    return token
}

module.exports = cryptoHexToken;