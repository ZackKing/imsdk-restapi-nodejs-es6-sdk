
const axios = require('axios');
const TIMSigGenerator = require('./TIMSigGenerator.js');
const TIMConfig = require('./TIMConfig.js');

module.exports = class TIMRestAPI {
    constructor(config) {
        this._timConfig = new TIMConfig(config);
        this._expireUntil = 0;
    }

    init() {
        this._reSign();
    }

    _reSign() {
        const timSigGenerator = new TIMSigGenerator(this._timConfig);
        const result = timSigGenerator.gen();
        this._usersig = result.sig;
        this._expireUntil = result.expireUntil;
    }

    get loginInfo() {
        this._checkExpire();

        return {
            identifier: this._timConfig.identifier,
            usersig: this._usersig
        };
    }

    async request(serviceName, cmdName, reqBody) {
        this._checkExpire();
        const urlPath = `/v4/${serviceName}/${cmdName}?usersig=${this._usersig}&identifier=${this._timConfig.identifier}&sdkappid=${this._timConfig.sdkAppid}&contenttype=json`;
        return await axios.post(`https://console.tim.qq.com${urlPath}`, reqBody);
    }

    _checkExpire() {
        if (this._expireUntil < Date.now() / 1000) {
            this._reSign();
        }
    }
};
