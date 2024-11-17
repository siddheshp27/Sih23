const { gatewayConnection } = require('./gatewayConnection');

async function getUserOrg(userId) {
  try {
    // Use the user's identity to connect to the network
    const { gateway, contract } = await gatewayConnection(userId);
    const response = await contract.evaluateTransaction('getUserOrg', userId);
    await gateway.disconnect();

    const parsedResponse = JSON.parse(response.toString());
    return parsedResponse;
  } catch (error) {
    console.error('Error in getUserOrg:', error);
    throw error;
  }
}

module.exports = { getUserOrg };