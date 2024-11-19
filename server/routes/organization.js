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
const assignCert = require('../utils/assignCert');
const assignUserToOrg = require('../utils/assignUser'); // Import the function
const { deleteCert, editCert } = require('../utils/updateAndDeleteCert');
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

router.post('/genCert/:orgId', async (req, res) => {
  const certificateData = req.body;
  const orgId = req.params.orgId;
  const certificateId = generateRandomUID();

  try {
    const response = await genCert({ orgId, certificateId, certificateData });
    console.log('Certificate generated successfully', response);
    if (response.success) {
      res.status(200).json(response.message);
    } else {
      res.status(500).json({ error: response.error });
    }
  } catch (error) {
    console.error('Error generating certificate:', error.message);
    res.status(500).json({ error: 'Failed to generate certificate' });
  }
});

router.delete('/deleteCert/:certId', authMiddleware, async (req, res) => {
  const certId = req.params.certId;
  const clientId = req.user.userName;
  try {
    const response = await deleteCert(clientId, certId);

    if (response.success) {
      res.status(200).json(response.data);
    } else {
      res.status(500).json({ error: response.error });
    }
  } catch (error) {
    console.error('Error deleting certificate:', error.message);
    res.status(500).json({ error: 'Failed to delete certificate' });
  }
});

router.post('/editCert/:certId', authMiddleware, async (req, res) => {
  const certId = req.params.certId;
  const clientId = req.user.userName;
  const newCertificateData = req.body;
  try {
    const response = await editCert(clientId, certId, newCertificateData);
    if (response.success) {
      console.log('Certificate edited successfully', response.data);
      res.status(200).json({ message: 'Certificate edited successfully', data: response.data });
    } else {
      res.status(404).json({ error: 'Certificate not found' });
    }
  } catch (error) {
    console.error('Error edit certificate:', error.message);
    res.status(500).json({ error: 'Failed to edit certificate' });
  }
});

router.get('/getCertificates', authMiddleware, async (req, res) => {
  const orgId = req.user.userName;
  console.log(orgId);
  const response = await getAllCerts({ orgId });
  if (response.success) {
    res.status(200).json(response.data);
  } else {
    res.status(500).json({ error: response.error });
  }
});


router.get('/getUserCount',authMiddleware, async (req, res) => {
  const orgId = req.user.userName;
  try {
    const response = await userUtils.getUsersByOrg(orgId);
    if(response.success){
      const userCount = response.orgUsers.length;
      res.status(200).json({success:true,userCount});
    }else{
      res.status(200).json({ success:false,userCount: 0 });
    }
  } catch (error) {
    console.error('Error fetching organization users:', error.message);
    res.status(500).json({ error: 'Failed to fetch organization users' });
  }
});

router.post('/assignCert', authMiddleware, async (req, res) => {
  const { id: certificateId, userName: userId } = req.body;
  console.log('assignCert', certificateId, userId);
  let user = await userUtils.getUserById(userId);
  if (user) {
    const orgId = req.user.userName;
    const certificateNumber = generateRandomUID();
    console.log(orgId, certificateNumber, userId, certificateId);

    const response = await assignCert({ orgId, certificateNumber, userId, certificateId });
    if (response.success) {
      console.log('Certificate assigned successfully', response.message);
      res.status(200).json({ message: 'Certificate assigned successfully', data: response.message });
    } else {
      res.status(500).json({ error: response.error });
    }
  } else {
    res.status(404).json({ error: `User with Id : ${userId} does not exists` });
  }
});
router.post('/getMyCert', authMiddleware, async (req, res) => {
  const { id: certificateId, userName: userId } = req.body;
  const orgId = req.user.userName;
  const certificateNumber = generateRandomUID();
  console.log(orgId, certificateNumber, userId, certificateId);

  const response = assignCert({ orgId, certificateNumber, userId, certificateId });
  res.status(200).json(response);
});

router.get('/accessList', authMiddleware, async (req, res) => {
  res.json(getAccList());
});

// New route to assign user to organization
router.post('/assignUserToOrg', authMiddleware, async (req, res) => {
  const { orgId, userId } = req.body;

  try {
    const response = await assignUserToOrg({ orgId, userId });
    res.status(200).json(response.messgage);
  } catch (error) {
    console.error('Error assigning user to organization:', error.message);
    res.status(500).json({ error: 'Failed to assign user to organization' });
  }
});

router.get('/orgUsers/:orgId', async (req, res) => {
  const orgId = req.params.orgId;
  try {
    const response = await userUtils.getUsersByOrg(orgId);
    if(response.success){
      res.status(200).json(response.orgUsers);
    }else{
      res.status(404).json({ error: 'Organization not found' });
    }
  } catch (error) {
    console.error('Error fetching organization users:', error.message);
    res.status(500).json({ error: 'Failed to fetch organization users' });
  }
});

router.get('/user/:userId', async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await userUtils.getUserById(userId);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user info:', error.message);
    res.status(500).json({ error: 'Failed to fetch user info' });
  }
});


module.exports = router;
