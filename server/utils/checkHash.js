const { gatewayConnection } = require('./gatewayConnection');

async function checkHash(part1, part2) {
  try {// Use a known organization identity
    const { gateway, contract } = await gatewayConnection(part2);
    const response = await contract.evaluateTransaction('checkHash', part1, part2);
    await gateway.disconnect();

    return JSON.parse(response.toString());
  } catch (error) {
    console.error('Error in checkHash:', error);
    throw error;
  }
}

module.exports = { checkHash };