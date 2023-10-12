'use strict';

const { Contract } = require('fabric-contract-api');
const crypto = require('crypto');
const { X509Identity } = require('fabric-shim');
const util = require('util');
const { access } = require('fs');

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

  async getIteratorData(iterator) {
    let resultArray = [];

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

  async genCertificate(ctx, certId, desc, expTime) {
    //all the certificate related data will be provided in desc
    let role = ctx.clientIdentity.getAttributeValue('role').toString();
    let clientId = ctx.clientIdentity.getID().split('::')[1].split('/')[4].split('=')[1];
    if (role === 'organization') {
      let certData = {
        admin: clientId,
        desc: desc,
        expTime: expTime
      };
      ctx.stub.putState(certId, Buffer.from(JSON.stringify(certData)));
    }
  }

  // async writeData(ctx, patientId, data) {
  // 	let patientData = JSON.parse(data);
  // 	await ctx.stub.putState(patientId, Buffer.from(JSON.stringify(patientData)));
  // 	return Buffer.from(JSON.stringify(patientData));
  // }

  // async readData(ctx, patientId) {
  // 	let patientDataAsBuffer = await ctx.stub.getState(patientId);

  // 	const patientData = JSON.parse(patientDataAsBuffer.toString());
  // 	return JSON.stringify(patientData);
  // }

  // async readHistoryData(ctx, patientId) {
  // 	let iterator = await ctx.stub.getHistoryForKey(patientId);
  // 	let result = await this.getIteratorData(iterator);
  // 	return JSON.stringify(result);
  // }
}

module.exports = certificateContract;
