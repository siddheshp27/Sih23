const crypto = require('crypto');
const dotenv = require('dotenv');
dotenv.config();
function encryptData(message) {
  const algorithm = 'aes-256-cbc';
  const key = Buffer.from(process.env.SYMMETRIC_KEY, 'hex');
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);

  let encrypted = cipher.update(message, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  let jsonData = {
    iv: iv.toString('hex'),
    encryptedData: encrypted
  };
  return jsonData;
}

function decryptData(encryptedData, iv) {
  const algorithm = 'aes-256-cbc';
  const key = Buffer.from(process.env.SYMMETRIC_KEY, 'hex');
  const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(iv, 'hex'));

  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

module.exports = { encryptData, decryptData };
