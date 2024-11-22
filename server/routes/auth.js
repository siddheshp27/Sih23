const express = require('express');
const router = express.Router();
const registerUser = require('../utils/register');
const updateUserAttributes = require('../editUser');
const userUtils = require('../user');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const dotenv = require('dotenv');
const cors = require('cors');
const fetchPhotoFromDigiLocker = require('../utils/getPhoto');
dotenv.config();
// const { authMiddleware, isAdmin } = require('../routes')

router.use(cors());

const authMiddleware = (req, res, next) => {
  const token = req.headers && req.headers['authorization'] ? req.headers['authorization'].split(' ')[1] : undefined;

  if (!token) {
    return res.sendStatus(401); // unauthorized
  }
  jwt.verify(token, '123456789', (err, data) => {
    if (err) {
      console.log(token);
      return res.json({ err }); // forbidden
    }
    console.log();
    req.user = data;
    console.log('verified');
    next();
  });
};

const isAdmin = async (req, res, next) => {
  const userRole = await userUtils.getUserRole(req.user.role);
  console.log(userRole);
  if (userRole === 'admin') {
    next();
  } else {
    res.status(401).json({ error: 'Admin authorization required' });
  }
};

{
  // const myRoute = (request, response) => {
  // 	const csrfToken = generateToken(response, request);
  // 	res.json({ csrfToken });
  // };
  // router.post('/registerUser', authMiddleware, async (req, res) => {
  //   console.log('registerUser');
  //   console.log(req.body);
  //   let role = req.body.role;
  //   if (role === 'user') {
  //     let firstName = req.body.firstName;
  //     let lastName = req.body.lastName;
  //     let username = req.body.userId;
  //     let password = req.body.password;
  //     let hashedPassword = await userUtils.encryptPassword(password);
  //     let age = req.body.age.toString();
  //     let gender = req.body.gender;
  //     let address = req.body.address;
  //     let phoneNumber = req.body.phoneNumber;
  //     let user = await userUtils.getUserById(username);
  //     if (user) {
  //       return res.sendStatus(409);
  //     }
  //     await registerUser(firstName, lastName, role, username, hashedPassword, age, gender, address, phoneNumber);
  //   } else {
  //     return res.json({ error: 'user registeration only' });
  //   }
  //   res.json(req.body);
  // });
}

async function setuReq(purpose, obj) {
  // Define headers as a single object
  const headers = {
    'x-client-id': process.env.CLIENT_ID,
    'x-client-secret': process.env.CLIENT_SECRET,
    'x-product-instance-id': process.env.PRODUCT_ID
  };

  let data, url, method;

  // Handle different purposes for the API request
  if (purpose === 'getAadhar') {
    url = `https://dg-sandbox.setu.co/api/digilocker/${obj.dId}/aadhaar`;
    method = 'get';
    data = null; // GET requests don't require body data
  } else if (purpose === 'register') {
    url = 'https://dg-sandbox.setu.co/api/digilocker';
    method = 'post';
    data = {
      redirectUrl: obj.redirectUrl
    };
  } else if (purpose === 'doc') {
    url = `https://dg-sandbox.setu.co/api/digilocker/${obj.dId}/document`;
    method = 'post';
    data = {
      docType: obj.doc,
      format: obj.docFormat,
      consent: 'Y'
    };
  }

  // Axios request configuration
  let config = {
    method: method,
    maxBodyLength: Infinity,
    url: url,
    headers: {
      ...headers, // Spread the headers object
      'Content-Type': 'application/json'
    },
    // Only pass 'data' if it's a POST request
    data: method === 'post' ? data : undefined
  };

  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.error(`Error in ${purpose} request:`, error.response ? error.response.data : error.message);
    throw error; // Re-throw to handle it higher up
  }
}


// Route to initiate user registration
router.post('/initiateRegisterUser', async (req, res) => {
  const redirectUrl = 'http://localhost:3000/register';

  try {
    const response = await setuReq('register', { redirectUrl });
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Registration initiation failed' });
  }
});

router.post('/getId', async (req, res) => {
  const redirectUrl = 'http://localhost:3000/user/documents';

  try {
    const response = await setuReq('register', { redirectUrl });
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Id generation failed' });
  }
});

router.post('/getAadhar', async (req, res) => {
  const dId = req.body.dId;
  const response = await setuReq('getAadhar', { dId });
  const details = response.aadhaar;
  const aId = details.maskedNumber;
  const userName = aId.substring(aId.length - 4);
  // const buffer = Buffer.from(details.photo, 'base64');
  // const photo = await uploadToS3(userName + 'pp', buffer);
  const resp = {
    name: details.name,
    userName,
    gender: details.gender,
    dob: details.dateOfBirth,
    age: details.age,
    address: JSON.stringify(details.address)
  };
  res.json(resp);
});



router.post('/getDocument', async (req, res) => {
  try {
    const { doc, docFormat, dId } = req.body;
    const response = await setuReq('doc', { doc, docFormat, dId });
    res.json(response); // Return the full response
  } catch (error) {
    console.error('Error fetching document:', error.message);
    res.status(500).json({ error: 'Failed to fetch document' });
  }
});

router.post('/getDocumentPan', async (req, res) => {
  try {
    const { doc, docFormat, dId } = req.body;
    const response = await setuReq('doc', { doc, docFormat, dId });
    res.json(response); // Return the full response
  } catch (error) {
    console.error('Error fetching document:', error.message);
    res.status(500).json({ error: 'Failed to fetch document' });
  }
});

router
router.post('/registerOrg', authMiddleware, isAdmin, async (req, res) => {
  console.log('Register Org!!!!');
  console.log(req.body);

  let orgId = req.body.userId;
  let orgName = req.body.name;
  let hashedPassword = req.body.hashedPassword;
  let email = req.body.email;

  let user = await userUtils.getUserById(orgId);

  if (user) {
    return res.sendStatus(409);
  }

  try {
    const result = await registerUser({ orgId, orgName, email, role: 'organization', hashedPassword });

    if (result.success) {
      console.log(result.success);
      return res.status(200).send({ message: result.success });
    } else {
      console.log(result.error);
      return res.status(500).send({ error: result.error });
    }
  } catch (error) {
    console.error(`Failed to register organization: ${error}`);
    return res.status(500).send({ error: `Failed to register organization: ${error.message}` });
  }
});


router.post('/registerUser', async (req, res) => {
  console.log('Register User!!!');

  const userName = req.body.prn;
  const name = req.body.name;
  const email = req.body.email;
  const dob = req.body.dob;
  const gender = req.body.gender;
  const hashedPassword = req.body.password;
  const phoneNumber = req.body.phoneNumber;
  const reqId = req.body.reqId;

  try {
    // Check if the user already exists
    // let user = await userUtils.getUserById(userName);
    // if (user) {
    //   return res.status(409).json('User Already Exists');
    // }

    // Fetch photo from DigiLocker API
    const photo = await fetchPhotoFromDigiLocker(reqId);

    // Register the user with the photo from DigiLocker API
    const regResponse = await registerUser({ 
      userName, 
      name, 
      email, 
      gender, 
      role: 'user', 
      dob, 
      hashedPassword, 
      phoneNumber, 
      photo 
    });

    if (regResponse.success) {
      return res.status(200).json(regResponse);
    } else {
      return res.status(411).json(regResponse);
    }

  } catch (error) {
    console.error('Error registering user:', error);
    return res.status(500).json('Error registering user');
  }
});

router.post('/login', async (req, res) => {
  console.log('login');
  console.log(req.body);

  let username = req.body.prn;
  let password = req.body.password;
  let userRole = req.body.role;
  let user = await userUtils.getUserById(username);
  const userRoleExisting = await userUtils.getUserRole(username);
  const userData = {};

  if (!user) {
    return res.status(404).json('User Does Not Exists'); // user doesn't exist
  }
  if (userRole === 'admin') {
    // const adminPassword = await userUtils.getAdminEnrollmentSecret();
    const adminPassword = 'adminpw';
    if (adminPassword !== password) {
      console.log('incorrect password');
      return res.sendStatus(404);
    } else {
      userData.role = 'admin';
    }
  } else {
    const hashedPassword = await userUtils.getUserHashedPassword(username);
    const isPasswordMatch = await userUtils.comparePasswords(password, hashedPassword);
    if (!isPasswordMatch) {
      return res.status(401).json({ error: 'Incorrect Password' });
    }
    userData.role = userRole;
  }
  const userAttrs = await userUtils.getUserAttrs(username);
  const attrsNeeded = ['role', 'name', 'email','photo','phoneNumber', 'hf.EnrollmentID'];
  // userAttrs.forEach((obj) => {});
  for (obj of userAttrs) {
    // console.log();
    if (attrsNeeded.includes(obj.name)) {
      if (obj.name === 'hf.EnrollmentID') userData['userName'] = obj.value;
      else userData[obj.name] = obj.value;
    }
  }
  console.log(userData);

  try {
    let accessToken = jwt.sign(userData, '123456789', {
      expiresIn: '30m'
    });

    let refreshToken = jwt.sign(userData, process.env.REFRESH_TOKEN_SECRET);

    res.json({ accessToken, refreshToken, userData });
  } catch (error) {
    console.error('Error signing the token:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

///get-user-attrs/:userId
router.get('/:userId/attrs', authMiddleware, async (req, res) => {
  const userId = req.params.userId;
  let userAttrs = await userUtils.getUserAttrs(userId);

  res.json(userAttrs);
});

router.put('/:userId/edit', authMiddleware, async (req, res) => {
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  let role = req.body.role;
  let userId = req.body.userId;
  let password = req.body.password;
  let hashedPassword = await userUtils.encryptPassword(password);
  let age = req.body.age.toString();
  let gender = req.body.gender;
  let address = req.body.address;
  let phoneNumber = req.body.phoneNumber;

  // let user = await userUtils.getUserById(username)
  // if(user){
  //     return res.sendStatus(401)
  // }

  if (role === 'organization') {
    await updateUserAttributes(firstName, lastName, role, userId, hashedPassword, age, gender, address, phoneNumber);
  } else {
    await updateUserAttributes(firstName, lastName, role, userId, hashedPassword, age, gender, address, phoneNumber);
  }

  res.json(req.body);
});

router.get('/:userId/role', authMiddleware, async (req, res) => {
  const userId = req.params.userId;

  let userRole = await userUtils.getUserRole(userId);

  res.json({ userRole: userRole });
});

// get-user-details/:userId
router.get('/:userId/details', authMiddleware, async (req, res) => {
  const userId = req.params.userId;
  // const role = req.params.role;
  let userAttrs = await userUtils.getUserAttrs(userId);

  if (!userAttrs) {
    return res.sendStatus(404);
  }
  const role = userAttrs.find((attr) => attr.name === 'role').value;

  let userInfo = {
    userId: userId,
    firstName: userAttrs.find((attr) => attr.name === 'firstName').value,
    lastName: userAttrs.find((attr) => attr.name === 'lastName').value,
    age: userAttrs.find((attr) => attr.name === 'age').value,
    gender: userAttrs.find((attr) => attr.name === 'gender').value,
    address: userAttrs.find((attr) => attr.name === 'address').value,
    phoneNumber: userAttrs.find((attr) => attr.name === 'phoneNumber').value
  };

  res.json(userInfo);
});

router.post('/refresh-access-token', (req, res) => {
  const { refreshToken } = req.body;
  // if(!refreshTokens.includes(refreshToken)){
  //     return res.sendStatus(403)
  // }
  console.log(refreshToken);
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, data) => {
    if (err) {
      console.log('error in refresh access token');
      return res.sendStatus(403);
    }

    console.log('no error in refresh access token');

    const userJson = {
      userId: data.userId
    };
    let newAccessToken = jwt.sign(userJson, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '30m'
    });
    res.json({ accessToken: newAccessToken, refreshToken: refreshToken });
  });
});

router.post('/access-token', (req, res) => {
  const { accessToken } = req.body;

  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
    if (err) {
      return res.sendStatus(403); // unauthorized
    }
    req.user = data;
    res.json(accessToken);
  });
});

router.post('/refresh-token', (req, res) => {
  const { refreshToken } = req.body;

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, data) => {
    if (err) {
      return res.sendStatus(403); // unauthorized
    }
    req.user = data;
    // next()
    res.json(refreshToken);
  });
});

router.get('/csrf-token', (req, res) => {
  const csrfToken = req.csrfToken();

  res.json({ csrfToken });
});

module.exports = router;

// 75644100-19b6-4186-9b17-18d3eb452d3c