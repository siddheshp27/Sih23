const { gatewayConnection } = require('./gatewayConnection');

async function getUserCertificates(userId) {
  try {
    const { gateway, contract } = await gatewayConnection(userId);
    const response = await contract.evaluateTransaction('getUserCertificates', userId);
    await gateway.disconnect();
    console.log('Response from getUserCertificates:', response.toString());
    return JSON.parse(response.toString());
  } catch (error) {
    console.error('Error in getUserCertificates:', error);
    throw error;
  }
}

module.exports = { getUserCertificates };