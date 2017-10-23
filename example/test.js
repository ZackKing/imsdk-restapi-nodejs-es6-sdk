
const path = require('path');
const TIMRestApi = require('../index.js');

(async () => {

  // get from your app
  // https://console.cloud.tencent.com/avc
  
  const config = {
    sdkAppid: 'sdkAppid',
    identifier: 'admin identifier',
    accountType: 'admin accountType',
    // version: '201512300000',
    privateKeyPath: path.join(__dirname, './key/private_key'),
    expireAfter: 30 * 24 * 3600
  };

  const api = new TIMRestApi(config);
  api.init();

  // account login info
  console.log(api.loginInfo);

  // test im_open_login_svc/account_import api
  const data = {
    Identifier : 'zack_king',
    Nick : 'Zack King' ,
    FaceUrl : 'https://avatars3.githubusercontent.com/u/8475242?s=460&v=4'
  };
  const serviceName = 'im_open_login_svc';
  const cmdName = 'account_import';

  try {

    const request = await api.request(serviceName, cmdName, data);
    console.log(request.data);

  } catch (error) {

    if (error.response) {

      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);

    } else if (error.request) {

      console.log(error.request);

    } else {

      console.log('Error', error.message);

    }

    console.log(error.config);

  }

})();



