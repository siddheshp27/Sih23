'use strict';

const { Contract } = require('fabric-contract-api');

class certificateContract extends Contract {
  async initLedger(ctx) {
    await ctx.stub.putState('test', 'test value');
    return 'success';
  }

  async grantCertAcess(ctx, orgId, certId) {
    // let role = ctx.clientIdentity.getAttributeValue("role").toString();
    // const userRole = await userUtils.getUserRole(req.user.userId);

    let certAcc = await ctx.stub.getState(orgId);
    let certAccList = JSON.parse(certAcc.toString());

    // if (role === "admin") {
    if (!certAccList || !certAccList.length) {
      certAccList = [];
    } else {
      certAccList = JSON.parse(certAccList.toString());
    }
    if (!certAccList.find(certId)) {
      certAccList.push(certId);
      await ctx.stub.putState(orgId, Buffer.from(JSON.stringify(certAccList)));
      return certAccList;
    } else {
      return `Org: ${orgId} has already acess to certificate: ${certId}`;
    }
    // } else {
    //   return "only admin can grant certificate access to organizations";
    // }
  }

  async getOrgData(ctx, orgId) {
    const orgData = await ctx.stub.getState(orgId);
    if (!orgData || orgData.length === 0) {
      throw new Error(`The state for organization ${orgId} does not exist`);
    }
    console.log(`Retrieved orgData: ${orgData.toString()}`);
    return orgData.toString();
  }

  async addCert(ctx, userId, uId, certId) {
    //only the creator of the certificate can add it to persons id
    //all the certinfo will be taken from the desc while accessing
    let role = await ctx.clientIdentity.getAttributeValue('role').toString();
    let clientId = await ctx.clientIdentity.getID().split('::')[1].split('/')[4].split('=')[1];

    if (role === 'organization') {
      // following the maintaining a detailed transaction history method
      let certData = await ctx.getState(certId);
      let certObj = JSON.parse(certData.toString());
      let certAd = certObj.admin;

      if (clientId === certAd) {
        //if the user sending this transaction is the same as the creator
        let data = { [certId]: uId };

        await ctx.stub.putState(userId, Buffer.from(JSON.stringify(data)));
        return Buffer.from(JSON.stringify(data));
      } else {
        return JSON.parse(`{"error": "organization: ${clientId} cannot assign certificate: ${certId}"}`);
      }
    } else {
      return JSON.parse(`{"error": "organization Id: ${clientId} is not valid"}`);
    }
  }

  async getCertificateData(ctx, certId) {
    let biCertData = await ctx.stub.getState(certId);
    let certData = JSON.parse(biCertData.toString());
    return certData;
  }

  async getAccesibleCertificatesList(ctx) {
    let role = ctx.clientIdentity.getAttributeValue('role').toString();
    let clientId = ctx.clientIdentity.getID().split('::')[1].split('/')[4].split('=')[1];

    if (role === 'organization') {
      let certAcc = await ctx.stub.getState(clientId);
      let certAccList = JSON.parse(certAcc.toString());
      return certAccList;
    } else {
      return 'only organization are allowed to access the certificates';
    }
  }

  async getAccesibleCertificates(ctx, userId) {
    let role = ctx.clientIdentity.getAttributeValue('role').toString();
    let clientId = ctx.clientIdentity.getID().split('::')[1].split('/')[4].split('=')[1];

    if (role === 'organization') {
      let certAcc = await ctx.stub.getState(clientId);
      // let userDetails = getUserDetails(); //add function
      let certAccList = JSON.parse(certAcc.toString());
      let certIt = await ctx.stub.getHistoryForKey(userId);
      let certs = await this.getIteratorData(certIt); //[{certid:uid},.....]
      let certIds = certs.flatMap((obj) => Object.keys(obj));
      let finalCertList = [];
      let finalData = [];
      certIds.forEach((id) => {
        if (certAccList.find(id)) {
          finalCertList.push(id);
        }
      });
      finalCertList.forEach((id) => {
        finalData.push({
          [id]: { uid: certs[id], data: this.getCertificateData(id) }
        });
      });

      return finalData;
    } else {
      return 'only organization are allowed to access the certificates';
    }
  }

  async genCertificate(ctx, data) {
    const clientId = ctx.clientIdentity.getID().split('::')[1].split('/')[4].split('=')[1];

    const role = ctx.clientIdentity.getAttributeValue('role').toString();
    const { certificateId, certificateData } = JSON.parse(data);

    if (role === 'organization') {
      // const creator = ctx.stub.getCreator();
      // console.log(`creator : ${creator}`);
      let certData = {
        admin: clientId,
        certificateId,
        certificateData
      };
      const fieldsComposite = [clientId, certificateId];
      const compositekey = ctx.stub.createCompositeKey('certificate', fieldsComposite);
      await ctx.stub.putState(compositekey, Buffer.from(JSON.stringify(certData)));
    }
  }

  async deleteCertificate(ctx, clientId, certificateId) {
    const role = ctx.clientIdentity.getAttributeValue('role').toString();
    const clientIdentity = ctx.clientIdentity.getID().split('::')[1].split('/')[4].split('=')[1];

    if (role === 'organization' || clientIdentity === clientId) {
      const compositeKey = ctx.stub.createCompositeKey('certificate', [clientId, certificateId]);
      const certificate = await ctx.stub.getState(compositeKey);

      if (!certificate || certificate.length === 0) {
        throw new Error(`Certificate ${certificateId} does not exist for client ${clientId}`);
      }

      await ctx.stub.deleteState(compositeKey);
      return JSON.stringify({ success: `Certificate ${certificateId} deleted for client ${clientId}` });
    } else {
      return JSON.stringify({ error: 'Only admin or the certificate owner can delete the certificate' });
    }
  }

  async editCertificate(ctx, clientId, certificateId, newCertificateData) {
    const role = ctx.clientIdentity.getAttributeValue('role').toString();
    const clientIdentity = ctx.clientIdentity.getID().split('::')[1].split('/')[4].split('=')[1];

    if (role === 'organization' || clientIdentity === clientId) {
      const compositeKey = ctx.stub.createCompositeKey('certificate', [clientId, certificateId]);
      const certificateBytes = await ctx.stub.getState(compositeKey);

      if (!certificateBytes || certificateBytes.length === 0) {
        throw new Error(`Certificate ${certificateId} does not exist for client ${clientId}`);
      }

      // Parse the existing certificate
      const certificate = JSON.parse(certificateBytes.toString());
      // Parse the new certificate data
      const newCertificateDataParsed = JSON.parse(newCertificateData);

      // Update only the certificateData field
      certificate.certificateData = {
        ...certificate.certificateData,
        ...newCertificateDataParsed
      };

      // Write the updated certificate back to the ledger
      await ctx.stub.putState(compositeKey, Buffer.from(JSON.stringify(certificate)));
      return JSON.stringify({ success: `Certificate ${certificateId} updated for client ${clientId}`, data: certificate });
    } else {
      return JSON.stringify({ error: 'Only admin or the certificate owner can edit the certificate' });
    }
  }

  async getCertificatesByOrganization(ctx) {
    const role = ctx.clientIdentity.getAttributeValue('role').toString();
    const clientId = ctx.clientIdentity.getID().split('::')[1].split('/')[4].split('=')[1];

    if (role === 'organization') {
      // const creator = ctx.stub.getCreator();
      // console.log(creator.idBytes.toString());
      const iterator = await ctx.stub.getStateByPartialCompositeKey('certificate', [clientId]);
      const certificates = await this.getIteratorData(iterator);

      return JSON.stringify(certificates);
    }
  }

  async assignCertificate(ctx, userId, certificateId) {
    const clientId = ctx.clientIdentity.getID().split('::')[1].split('/')[4].split('=')[1];
    const fieldsComposite = [clientId, certificateId];
    const compositeKey = ctx.stub.createCompositeKey('certificate', fieldsComposite);
    const certificate = await ctx.stub.getState(compositeKey);
    const role = ctx.clientIdentity.getAttributeValue('role').toString();
    console.log(certificate);

    if (role === 'organization' && certificate) {
      let certData = {
        certificateId
      };
      const userCompositeKey = ctx.stub.createCompositeKey('usercertificate', [userId, certificateId]);
      await ctx.stub.putState(userCompositeKey, Buffer.from(JSON.stringify(certData)));
      return JSON.stringify({ success: `Certificate ${certificateId} assigned to user ${userId}` });
    } else {
      return JSON.stringify({ error: 'Only organizations can assign certificates or certificate does not exist' });
    }
  }

  async getUserCertificates(ctx, userId) {
    const iterator = await ctx.stub.getStateByPartialCompositeKey('usercertificate', [userId]);
    const assignedCertificates = [];
  
    while (true) {
      const res = await iterator.next();
  
      if (res.value && res.value.value.toString()) {
        const assignment = JSON.parse(res.value.value.toString());
        const certificateId = assignment.certificateId;
  
        // Optionally, retrieve full certificate details
        const certificateBytes = await ctx.stub.getState(certificateId);
        if (certificateBytes && certificateBytes.length > 0) {
          const certificate = JSON.parse(certificateBytes.toString());
          assignedCertificates.push(certificate);
        }
      }
  
      if (res.done) {
        await iterator.close();
        break;
      }
    }
  
    return JSON.stringify(assignedCertificates);
  }
  
  async getCertificatesByUser(ctx) {
    const role = ctx.clientIdentity.getAttributeValue('role').toString();
    const clientId = ctx.clientIdentity.getID().split('::')[1].split('/')[4].split('=')[1];

    if (role === 'organization') {
      const iterator = await ctx.stub.getStateByPartialCompositeKey('usercertificate', [clientId]);
      const certificates = await this.getIteratorData(iterator);

      return JSON.stringify(certificates);
    }
  }

  async getIteratorData(iterator) {
    let resultArray = [];
    console.log(iterator);
    while (true) {
      let res = await iterator.next();
      if (res.value && res.value.value.toString()) {
        const obj = JSON.parse(res.value.value.toString('utf8'));
        resultArray.push(obj);
      }

      if (res.done) {
        await iterator.close();
        return resultArray;
      }
    }
  }

  async assignUserToOrg(ctx, orgId, userId) {
    const role = ctx.clientIdentity.getAttributeValue('role').toString();
    const clientId = ctx.clientIdentity.getID().split('::')[1].split('/')[4].split('=')[1];

    if (role === 'organization') {
      let orgData = await ctx.stub.getState(orgId);
      let orgUsers = orgData.length ? JSON.parse(orgData.toString()) : [];

      console.log(`Current orgUsers: ${JSON.stringify(orgUsers)}`);

      if (!orgUsers.includes(userId)) {
        orgUsers.push(userId);
        await ctx.stub.putState(orgId, Buffer.from(JSON.stringify(orgUsers)));

        // Store mapping from userId to orgId
        const userOrgKey = ctx.stub.createCompositeKey('userOrg', [userId]);
        await ctx.stub.putState(userOrgKey, Buffer.from(orgId));
        console.log(`Updated orgUsers: ${JSON.stringify(orgUsers)}`);
        return JSON.stringify({ success: `User ${userId} assigned to organization ${orgId}` });
      } else {
        return JSON.stringify({ error: `User ${userId} is already assigned to organization ${orgId}` });
      }
    } else {
      return JSON.stringify({ error: 'Only admin can assign users to organizations' });
    }
  }

  // In certificateContract.js

  async getUserOrg(ctx, userId) {
    const userOrgKey = ctx.stub.createCompositeKey('userOrg', [userId]);
    const orgIdBytes = await ctx.stub.getState(userOrgKey);

    if (!orgIdBytes || orgIdBytes.length === 0) {
      return JSON.stringify({ message: `User ${userId} is not assigned to any organization` });
    } else {
      const orgId = orgIdBytes.toString();
      return JSON.stringify({ orgId });
    }
  }
 
}

module.exports = certificateContract;
