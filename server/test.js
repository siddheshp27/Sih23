const assignUserToOrg = require('./utils/assignUser');
const { getUsersByOrg } = require('./user');

// const testUserAssignmentToOrg = async () => {
//   console.log('Assign User to Org!!!');

//   let userId = '12121211';
//   let orgId = '12345678';

//   const assignResponse = await assignUserToOrg({ userId, orgId });
//   console.log(assignResponse);
// };

async function testGetUsersByOrg() {
  const orgId = '12345678';
  const users = await getUsersByOrg(orgId);
  console.log(users);
}

// testUserAssignmentToOrg();
testGetUsersByOrg();