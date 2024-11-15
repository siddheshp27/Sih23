const { gatewayConnection } = require('./gatewayConnection');

async function assignUserToOrg({ orgId, userId }) {
  try {
    const { gateway, contract } = await gatewayConnection(orgId);
    const res = await contract.submitTransaction('assignUserToOrg', orgId, userId);
    await gateway.disconnect();
    return { messgage: res.toString() };
  } catch (error) {
    console.error(`Error in assignUserToOrg: ${error}`);
    return { error };
  }
}

module.exports = assignUserToOrg;