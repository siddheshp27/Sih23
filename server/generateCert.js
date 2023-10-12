const { Gateway, Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { encryptData } = require('./cryptoTools');
const dotenv = require('dotenv');
dotenv.config();

async function genCert(orgId, certUid, certData, certExpTime) {
  try {
    const ccpPath = path.resolve(
      __dirname,
      '..',
      'fabric-samples',
      'test-network',
      'organizations',
      'peerOrganizations',
      'org1.example.com',
      'connection-org1.json'
    );
    let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    // const patientIdentity = await wallet.get(patientId);
    // if (!patientIdentity) {
    //   console.log(`An identity for the patient ${patientId} does not exist in the wallet`);
    //   return;
    // }

    const orgIdentity = await wallet.get(orgId);

    if (!orgIdentity) {
      console.log(`An organization with the Id: ${orgId} does not exist `);
      return;
    }

    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: orgId,
      discovery: { enabled: true, asLocalhost: true }
    });

    const network = await gateway.getNetwork('mychannel');

    const contract = network.getContract('certificateContract');

    const encryptedCertificateData = encryptData(JSON.stringify(certData));

    await contract.submitTransaction('genCertificate', certUid, JSON.stringify(encryptedCertificateData), certExpTime);

    await gateway.disconnect();
  } catch (error) {
    console.error(`Error in invokeDiagnosis: ${error}`);
    // process.exit(1);
  }
}
module.exports = genCert;
