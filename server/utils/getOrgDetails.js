const { gatewayConnection } = require('./gatewayConnection');

async function getOrgDetails(orgId) {
  try {
    const { gateway, contract } = await gatewayConnection(orgId);
    const response = await contract.evaluateTransaction('getOrgData', orgId);
    await gateway.disconnect();


    const orgDetails = JSON.parse(response.toString());
    console.log('Org details:', orgDetails);
    return orgDetails;
  } catch (error) {
    console.error('Error in getOrgDetails:', error);
    throw error;
  }
}

module.exports = { getOrgDetails };