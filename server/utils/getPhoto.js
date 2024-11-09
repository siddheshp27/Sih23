var axios = require('axios');

async function fetchPhotoFromDigiLocker(reqId) {
  try {
    const options = {
      method: 'get',
      url: `https://dg-sandbox.setu.co/api/digilocker/${reqId}/aadhaar`,
      headers: {
        'x-client-id': process.env.CLIENT_ID,
        'x-client-secret': process.env.CLIENT_SECRET,
        'x-product-instance-id': process.env.PRODUCT_ID
      }
    };

    const response = await axios.request(options);
    console.log(response.data);
    if (response.data.aadhaar && response.data.aadhaar.photo) {
      console.log(response.data.aadhaar.photo);
      return response.data.aadhaar.photo; // Base64 encoded photo
    } else {
      throw new Error('Photo not found in DigiLocker response');
    }
  } catch (error) {
    console.error(error);
    return error.message;
  }
}

// async function fetchPhotoFromDigiLocker(reqId) {
//   var options = {
//     method: 'get',
//     url: `https://dg-sandbox.setu.co/api/digilocker/${reqId}/aadhaar`,
//     headers: {
//       'x-client-id': process.env.CLIENT_ID,
//       'x-client-secret': process.env.CLIENT_SECRET,
//       'x-product-instance-id': process.env.PRODUCT_ID
//     }
//   };

//   axios
//     .request(options)
//     .then(function (response) {
//       console.log(response.data);
//       if (response.data.aadhaar && response.data.aadhaar.photo) {
//         return response.data.aadhaar.photo; // Base64 encoded photo
//       } else {
//         throw new Error('Photo not found in DigiLocker response');
//       }
//     })
//     .catch(function (error) {
//       console.error(error);
//     });
// }

module.exports = fetchPhotoFromDigiLocker;
