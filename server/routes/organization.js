const express = require('express');
const router = express.Router();
const userUtils = require('../user');
const jwt = require('jsonwebtoken');

//new
const genCert = require('../utils/generateCert');
const dotenv = require('dotenv');
dotenv.config();
const getAccList = require('../getAccList');
const getAllCerts = require('../utils/getCertificates');
const { generateRandomUID } = require('../utils/cryptoTools');
//////////////////////////////

const authMiddleware = (req, res, next) => {
  const token = req.headers && req.headers['authorization'] ? req.headers['authorization'].split(' ')[1] : undefined;

  if (!token) {
    return res.sendStatus(401); // unauthorized
  }
  jwt.verify(token, '123456789', (err, data) => {
    if (err) {
      return res.sendStatus(403); // forbidden
    }
    req.user = data;
    next();
  });
};

router.post('/genCert', authMiddleware, async (req, res) => {
  const certificateData = req.body;
  const orgId = req.user.userName;
  const certificateId = generateRandomUID();
  console.log(certificateData, orgId, certificateId);

  const response = genCert({ orgId, certificateId, certificateData });
  res.status(200).json(response);
});

router.post('/getCertificates', authMiddleware, async (req, res) => {
  const org = req.user.userName;
  const response = await getAllCerts({ orgId: org });
  res.status(200).json(response);
});

router.get('/accessList', authMiddleware, async (req, res) => {
  res.json(getAccList());
});

router.post('/assignCert', authMiddleware, async (req, res) => {
  const userId = req.body.userId;
  const uId = req.body.uId;
  const certId = req.body.certId;
});

//get-doctor-list
router.get('/list', authMiddleware, async (req, res) => {
  const doctorList = await userUtils.getDoctorList();
  let doctorListInfo = [];

  doctorList.forEach((doctor, index, array) => {
    let doctorId = doctor.id;
    let firstName = doctor.attrs.find((attr) => attr.name === 'firstName');
    let lastName = doctor.attrs.find((attr) => attr.name === 'lastName');
    let age = doctor.attrs.find((attr) => attr.name === 'age');
    let gender = doctor.attrs.find((attr) => attr.name === 'gender');
    let address = doctor.attrs.find((attr) => attr.name === 'address');
    let phoneNumber = doctor.attrs.find((attr) => attr.name === 'phoneNumber');
    let specialization = doctor.attrs.find((attr) => attr.name === 'specialization');

    let doctorInfo = {
      userId: doctorId,
      firstName: firstName.value,
      lastName: lastName.value,
      age: age.value,
      gender: gender.value,
      address: address.value,
      phoneNumber: phoneNumber.value,
      specialization: specialization.value
    };
    doctorListInfo.push(doctorInfo);
  });

  res.json(doctorListInfo);
});

router.post('/:doctorId/medical-data', authMiddleware, async (req, res) => {
  const patientId = req.body.patientId;
  const medicalData = req.body.medicalData;
  const accessList = req.body.accessList;
  const doctorId = req.params.doctorId;

  // if(!accessList){
  //     res.sendStatus(403)
  //     return
  // }

  // if(accessList.find(patient => patient !== patientId)){
  //     res.sendStatus(403)
  //     return
  // }

  await invokeDiagnosis(patientId, medicalData, doctorId);

  res.json(medicalData);
});

router.post('addCert', authMiddleware, async (req, res) => {
  const userId = req.body.userId;
  const certId = req.body.userId;
  const uId = req.body.uId;
});

router.get('/:doctorId/access-list', authMiddleware, async (req, res) => {
  const doctorId = req.params.doctorId;
  const doctorAccessList = await getDoctorAccessList(doctorId);

  if (!doctorAccessList) {
    // if undefined doctor doesn't have any access
    let list = [];
    res.json(list);
  } else {
    res.json(doctorAccessList);
  }
});

module.exports = router;
