const registerUser = require('../utils/register');
const userUtils = require('../user');

const registerDefaultUser = async () => {
  console.log('Register User!!!');

  let userName = 8799;
  let name = 'Siddhesh';
  let email = 'sid@vit.edu';
  let dob = '20';
  let photo = 'url';
  let gender = 'M';
  let password = 'test';
  let hashedPassword = await userUtils.encryptPassword(password);
  let phoneNumber = 775;

  const regResponse = await registerUser({ userName, name, email, gender, role: 'user', dob, photo, hashedPassword, phoneNumber });
  console.log(regResponse);

  console.log('Register Org!!!!');

  let orgId = 'vit';
  let orgName = 'vit';
  password = 'test';
  hashedPassword = await userUtils.encryptPassword(password);
  let address = '';
  email = 'a@vit.edu';
  phoneNumber = 885;

  await registerUser({ orgId, orgName, email, role: 'organization', hashedPassword, address, phoneNumber });
};

registerDefaultUser();
