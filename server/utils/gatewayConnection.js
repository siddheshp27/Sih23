const { Gateway, Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { encryptData } = require('./cryptoTools');
const dotenv = require('dotenv');
dotenv.config();

exports.gatewayConnection = async (userId) => {
  const ccpPath = path.resolve(
    __dirname,
    '../..',
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

  const orgIdentity = await wallet.get(userId);

  if (!orgIdentity) {
    console.log(`An User with the Id: ${userId} does not exist `);
    return;
  }

  const gateway = new Gateway();
  await gateway.connect(ccp, {
    wallet,
    identity: userId,
    discovery: { enabled: true, asLocalhost: true }
  });

  const network = await gateway.getNetwork('mychannel');

  const contract = network.getContract('certificateContract');
  return { gateway, contract };
};
