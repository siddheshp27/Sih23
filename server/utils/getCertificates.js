const { gatewayConnection } = require('./gatewayConnection');

async function getCertificates({ orgId }) {
  try {
    const { gateway, contract } = await gatewayConnection(orgId);
    const res = await contract.evaluateTransaction('getCertificatesByOrganization');
    const data = JSON.parse(res.toString());
    await gateway.disconnect();
    return { success: data };
  } catch (error) {
    console.error(`Error in invokeDiagnosis: ${error}`);
    return { error };
  }
}
module.exports = getCertificates;
