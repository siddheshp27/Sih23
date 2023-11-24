'use strict';

const { Contract } = require('fabric-contract-api');
// const crypto = require('crypto');
// const { X509Identity } = require('fabric-shim');
// const util = require('util');
// const { access } = require('fs');

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

  async assignCertificate(ctx, userId, certificateNumber, certificateId) {
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
      const fieldsComposite = [userId, certificateNumber];
      const compositekey = ctx.stub.createCompositeKey('usercertificate', fieldsComposite);
      await ctx.stub.putState(compositekey, Buffer.from(JSON.stringify(certData)));
    }
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

  // async getCertificates(ctx) {
  //   const userId = ctx.clientIdentity.getID().split('::')[1].split('/')[4].split('=')[1];
  //   const role = ctx.clientIdentity.getAttributeValue('role').toString();
  //   // console.log();
  //   if (role === 'organization') {
  //     let iteratorAllCertsIds = await ctx.stub.getHistoryForKey(userId);
  //     let certIds = await this.getIteratorData(iteratorAllCertsIds);

  //     console.log(certIds[0]);
  //     const allCerts = {};

  //     certIds.forEach(async (id) => {
  //       console.log(id);
  //       const res = await ctx.stub.getState(id);
  //       const data = await res.toString();
  //       console.log(data);
  //       allCerts[id] = data;
  //     });
  //     return JSON.stringify(allCerts);
  //   }
  // }

  // {
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

  // async getCertificatesByOrganization(ctx) {
  // const userId = ctx.clientIdentity.getID().split('::')[1].split('/')[4].split('=')[1];
  //   const role = ctx.clientIdentity.getAttributeValue('role').toString();

  //   if (role === 'organization') {
  //     const orgMSPID = ctx.clientIdentity.getMSPID();
  //     const queryString = {
  //       selector: {
  //         _id: {
  //           $regex: `^\\u0000certificate\\u0000${orgMSPID}\\u0000.*`
  //         }
  //       }
  //     };
  //     // const queryString = { selector: { orgMSPID } };
  //     const iterator = await ctx.stub.getQueryResult(JSON.stringify(queryString));
  //     // console.log(iterator);
  //     const certificates = await this.getIteratorData(iterator);
  //     return JSON.stringify(certificates);
  //     // return { iterator };
  //   }
  // }

  //   async getIteratorData(iterator) {
  //   //   let resultArray = [];

  //   //   // Extract the result array from the wrapped iterator
  //   //   console.log(iterator);
  //   //   console.log('=========================================================================');
  //   //   console.log(iterator.response);
  //   //   const { array } = iterator.response;

  //   //   for (let i = 0; i < array.length; i++) {
  //   //     if (array[i].length > 0) {
  //   //       const obj = JSON.parse(array[i][0].toString('utf8'));
  //   //       resultArray.push(obj);
  //   //     }
  //   //   }

  //   //   return resultArray;
  //   // }

  // }
}

module.exports = certificateContract;
