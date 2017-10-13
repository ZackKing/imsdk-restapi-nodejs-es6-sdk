
const zlib = require('zlib');
const crypto = require('crypto');

class Base64Url {
    constructor(str) {
        this._str = str;
    }

    unescape() {
        this._str = (this._str + Array(5 - this._str.length % 4)).replace(/_/g, '=').replace(/\-/g, '/').replace(/\*/g, '+');
        return this;
    }

    escape() {
        this._str = this._str.replace(/\+/g, '*').replace(/\//g, '-').replace(/=/g, '_');
        return this;
    }

    encode() {
        return this.escape(new Buffer(this._str).toString('base64'));
    }

    decode() {
        return new Buffer(this.unescape(this._str), 'base64').toString();
    }

    toString() {
        return this._str;
    }
}

module.exports = class TIMSigGenerator {
    constructor(timConfig) {
        this._timConfig = timConfig;
    }

    _genSignContent(obj) {
        let ret = '';
        for (const i in obj) {
            ret += i + ':' + obj[i] + '\n';
        }
        return ret;
    }

    gen() {
        const obj = {
            'TLS.appid_at_3rd': this._timConfig.sdkAppid,
            'TLS.account_type': this._timConfig.accountType,
            'TLS.identifier': this._timConfig.identifier,
            'TLS.sdk_appid': this._timConfig.sdkAppid,
            'TLS.time': (Math.floor(Date.now() / 1000)).toString(),
            'TLS.expire_after': String(this._timConfig.expireAfter)
        };
        const content = this._genSignContent(obj);

        const signer = crypto.createSign('sha256');
        signer.update(content, 'utf8');
        obj['TLS.sig'] = signer.sign(this._timConfig.privateKey, 'base64');

        const base64url = new Base64Url(zlib.deflateSync(new Buffer(JSON.stringify(obj))).toString('base64'));

        return {
            expireUntil: parseInt(Date.now() / 1000) + parseInt(this._timConfig.expireAfter),
            sig: base64url.escape().toString()
        };
    }
};
