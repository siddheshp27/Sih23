const registerUser = require('./utils/register');
const userUtils = require('./user');

const registerDefaultUser = async () => {
  console.log('Register User!!!');

  let userName = '12121212';
  let name = 'Aryan';
  let email = 'aryan@vit.edu';
  let dob = '08-12-2003';
  let gender = 'M';
  let password = '12345678';
  let hashedPassword = await userUtils.encryptPassword(password);
  let phoneNumber = '7755658585';

  const regResponse = await registerUser({ userName, name, email, gender, role: 'user', dob, hashedPassword, phoneNumber });
  console.log(regResponse);

  console.log('Register Org!!!!');

  let orgId = '1234567';
  let orgName = 'vit';
  password = 'test';
  hashedPassword = await userUtils.encryptPassword(password);
  email = 'a@vit.edu';

  await registerUser({ orgId, orgName, email, role: 'organization', hashedPassword });
};

registerDefaultUser();
