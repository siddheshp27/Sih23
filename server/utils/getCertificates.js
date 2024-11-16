const { gatewayConnection } = require('./gatewayConnection');

async function getCertificates({ orgId }) {
  try {
    const { gateway, contract } = await gatewayConnection(orgId);
    const res = await contract.evaluateTransaction('getCertificatesByOrganization');
    const data = JSON.parse(res.toString());
    await gateway.disconnect();

    // Add lastModified field to each certificate
    const certificates = data.map(cert => ({
      ...cert,
      lastModified: new Date().toISOString()
    }));
    return { success: true, data: certificates };
  } catch (error) {
    console.error(`Error in invokeDiagnosis: ${error}`);
    return { error };
  }
}
module.exports = getCertificates;
