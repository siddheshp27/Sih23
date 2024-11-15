const { gatewayConnection } = require('./gatewayConnection');

async function assignCert({ orgId, userId, certificateId }) {
  try {
    const { gateway, contract } = await gatewayConnection(orgId);
    const res = await contract.submitTransaction('assignCertificate', userId, certificateId);
    await gateway.disconnect();

    let responseJson;
    try {
      const responseString = res.toString('utf8');
      responseJson = JSON.parse(responseString);
    } catch (parseError) {
      console.error(`Failed to parse response: ${parseError}`);
      return { success: false, error: 'Failed to parse response from chaincode' };
    }

    return { success: true, message: responseJson };
  } catch (error) {
    console.error(`Error in assignCert: ${error}`);
    return { success: false, error: error.message };
  }
}

module.exports = assignCert;