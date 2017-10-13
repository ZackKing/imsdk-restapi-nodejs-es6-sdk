
const fs = require('fs');

module.exports = class TIMConfig {
    constructor(config) {
        this._sdkAppid = config.sdkAppid;
        this._identifier = config.identifier;
        this._accountType = config.accountType;
        this._privateKeyPath = config.privateKeyPath;
        this._expireAfter = config.expireAfter;
        this._privateKey = fs.readFileSync(this._privateKeyPath).toString();
    }

    get sdkAppid() {
        return this._sdkAppid;
    }

    get identifier() {
        return this._identifier;
    }

    get accountType() {
        return this._accountType;
    }

    get expireAfter() {
        return this._expireAfter;
    }

    get privateKey() {
        return this._privateKey;
    }
};
