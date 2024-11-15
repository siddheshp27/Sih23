const { gatewayConnection } = require('./gatewayConnection');

async function deleteCert(clientId, certificateId) {
  try {
    const { gateway, contract } = await gatewayConnection(clientId);
    const response = await contract.submitTransaction('deleteCertificate', clientId, certificateId);
    await gateway.disconnect();
    console.log(response.toString());
    return response.toString();
  } catch (error) {
    console.error(`Failed to delete certificate: ${error}`);
  }
}

async function editCert(clientId, certificateId, newCertificateData) {
  try {
    const { gateway, contract } = await gatewayConnection(clientId);
    const response = await contract.submitTransaction('editCertificate', clientId, certificateId, JSON.stringify(newCertificateData));
    await gateway.disconnect();
    console.log(response.toString());
    return response.toString();
  } catch (error) {
    console.error(`Failed to edit certificate: ${error}`);
  }
}

module.exports = { deleteCert, editCert };