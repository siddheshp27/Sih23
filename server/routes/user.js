const express = require('express');
const router = express.Router();
const userUtils = require('../user');
const { getUserOrg } = require('../utils/getUserOrg');
const {getOrgDetails} = require('../utils/getOrgDetails');
const jwt = require('jsonwebtoken');
const { get } = require('./organization');

const authMiddleware = (req, res, next) => {
  const token = req.headers && req.headers['authorization'] ? req.headers['authorization'].split(' ')[1] : undefined;

  if (!token) {
    return res.sendStatus(401); // unauthorized
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
    if (err) {
      console.log("JWT verification error:", err);
      return res.sendStatus(403); // forbidden
    }

    req.user = data;
    next();
  });
};

router.get('/getUserOrg', async (req, res) => {
  const { userId } = req.query;
  console.log('Getting user organization:', userId);
  try {
    const response = await getUserOrg(userId);
    console.log('Response from getUserOrg:', response);
    if (response.orgId) {
      const orgDetails = await userUtils.getOrgById(response.orgId);
      console.log('Org details:', orgDetails);
      res.status(200).json({ success:true, orgDetails});
    } else {
      res.status(404).json({ message: response.message });
    }
  } catch (error) {
    console.error('Error getting user organization:', error);
    res.status(500).json({ error: 'Failed to get user organization' });
  }
});

router.get('/getUserCertificates', authMiddleware, async (req, res) => {
  const { userId } = req.query;

  try {
    const certificates = await getUserCertificates(userId);
    res.status(200).json(certificates);
  } catch (error) {
    console.error('Error getting user certificates:', error);
    res.status(500).json({ error: 'Failed to get user certificates' });
  }
});


module.exports = router;
