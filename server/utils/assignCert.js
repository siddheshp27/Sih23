const { gatewayConnection } = require('./gatewayConnection');

async function assignCert({ orgId, userId, certificateId, certificateNumber }) {
  try {
    const { gateway, contract } = await gatewayConnection(orgId);
    // const encryptedCertificateData = encryptData(JSON.stringify(certData));
    const res = await contract.submitTransaction('assignCertificate', userId, certificateNumber, certificateId);
    await gateway.disconnect();
    return { success: res };
  } catch (error) {
    console.error(`Error in invokeDiagnosis: ${error}`);
    return { error };
  }
}
module.exports = assignCert;
