const { gatewayConnection } = require('./gatewayConnection');

async function genCert({ orgId, certificateId, certificateData }) {
  try {
    const { gateway, contract } = await gatewayConnection(orgId);
    // const encryptedCertificateData = encryptData(JSON.stringify(certData));
    const allData = { certificateId, certificateData };
    const res = await contract.submitTransaction('genCertificate', JSON.stringify(allData));
    await gateway.disconnect();
    return { success: res };
  } catch (error) {
    console.error(`Error in invokeDiagnosis: ${error}`);
    return { error };
  }
}
module.exports = genCert;
