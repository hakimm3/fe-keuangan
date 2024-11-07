import CryptoJS from 'crypto-js';

const APP_KEY = import.meta.env.VITE_APP_ENC;

export function encryptData(data) {
    // const iv = CryptoJS.lib.WordArray.random(32);
    // const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), CryptoJS.enc.Base64.parse(APP_KEY), {
    //     iv: iv,
    //     mode: CryptoJS.mode.CBC,
    //     padding: CryptoJS.pad.Pkcs7
    // });
    // return iv.toString(CryptoJS.enc.Hex) + encrypted.toString();
    return CryptoJS.AES.encrypt(JSON.stringify(data), APP_KEY).toString();
}

export function decryptData(encryptedData) {
    // const iv = CryptoJS.enc.Hex.parse(encryptedData.slice(0, 32));
    // const encrypted = encryptedData.slice(32);
    // const decrypted = CryptoJS.AES.decrypt(encrypted, CryptoJS.enc.Base64.parse(APP_KEY), {
    //     iv: iv,
    //     mode: CryptoJS.mode.CBC,
    //     padding: CryptoJS.pad.Pkcs7
    // });
    // return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
    const bytes = CryptoJS.AES.decrypt(encryptedData, APP_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}
