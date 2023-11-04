const { getUserAttrs } = require('./user');

async function a() {
  const res = await getUserAttrs('8799');
  console.log(res);
}
a();
