"use strict";
/*


 */

/**      In God we trust
 * Created by: Servio Palacios on 2016.05.26.
 * Source: restConnector.js
 * Author: Servio Palacios
 * Last edited: 2016.05.26 13:55
 * Description: Spark Job Connector using REST API
 */

//External Libraries
var Client = require('node-rest-client').Client;
var client = new Client();

//Local Libraries
var Enums = require("enums");
var config = require("../../config");

/**
 * @constructor
 *
 */
function Crypto(options) {

    var self = this;

    if(typeof options === "undefined"){ //I only set this when it is integrity check
        throw new Error("[options] parameter not defined.");
    }

    self._threshold = config.security.threshold;

    if(!options.integrityCheck){
        //Uncompressed (65-byte) public key.
        //var publicKey = eccrypto.getPublic(privateKey);
        self._key = new NodeRSA({b: config.security.RSAKeyNBits});

        //Creating "empty" key, later I have to use import
        self._commonKey = new NodeRSA();

    }//if integrity check

}//Crypto Constructor

/* Generates Random Numbers */
Crypto.prototype.random = function(nBytes) {

    return cryptoLib.randomBytes(nBytes);
    //I can see the object:
    //base64:
    //data:

};

/* Generates Random Numbers returns string */
Crypto.prototype.randomString = function(nBytes) {

    return cryptoLib.randomBytes(nBytes).toString();

};

/* Generates Random Numbers returns Base64 */
Crypto.prototype.randomBase64 = function(nBytes) {

    return cryptoLib.randomBytes(nBytes).toBase64();

};

/* RSA Encryption */
Crypto.prototype.RSAEncrypt = function(plainText){

    var encrypted = this._key.encrypt(plainText, config.security.base64Format);

    return encrypted;

};

/* RSA Encryption */
Crypto.prototype.RSACommonEncrypt = function(plainText, publicKey){

    this._commonKey.importKey(publicKey, config.security.publicKeyFormat);
    var encrypted = this._commonKey.encrypt(plainText, config.security.base64Format);

    return encrypted;

};

/* RSA Decryption */
Crypto.prototype.RSADecrypt = function(cypherText){

    var decrypted = this._key.decrypt(cypherText, config.security.utf8Format);

    return decrypted;

};

/* Create challenge to send to peer */
Crypto.prototype.createNonce = function(peerPublicKey){

    var self = this;

    var firstNumber = self.random(8);
    var secondNumber = self.random(4);
    var decFirstNumber = biguint(firstNumber, "dec");
    var decSecondNumber = biguint(secondNumber, "dec");
    var encryptedFirstNumber = self.RSACommonEncrypt(decFirstNumber, peerPublicKey);
    var encryptedSecondNumber = self.RSACommonEncrypt(decSecondNumber, peerPublicKey);
    var expectedResponse = decFirstNumber + decSecondNumber;

    var nonce = {
        firstNumber: encryptedFirstNumber,
        secondNumber: encryptedSecondNumber,
        expectedResponse: expectedResponse
    };

    return nonce;

};

/* Importing Key */
Crypto.prototype.importKey = function(commonPublicKey){

    this._commonKey.importKey(commonPublicKey, config.security.publicKeyFormat);

};//importKey

//Signing messages with elliptic curve cryptography
Crypto.prototype.eccSignMessage = function(message){

    var hashedMessage = crypto.createHash("sha256").update(message).digest();

    eccrypto.sign(privateKey, hashedMessage).then(function(sig) {
        console.log("Signature in DER format:", sig);
        eccrypto.verify(publicKey, hashedMessage, sig).then(function() {
            console.log("Signature is OK");
        }).catch(function() {
            console.log("Signature is BAD");
        });
    });

};//signing messages with elliptic curve cryptography

/* ------------------------ GETTERS ------------------------------------------ */
/* Getting Public Key */
Crypto.prototype.getPublicKey = function () {

    //I'd rather use Base64
    var publicKey = this._key.exportKey(config.security.publicKeyFormat);
    return publicKey;//this._publicKey;

};

/* Getting Private Key */
Crypto.prototype.getPrivateKey = function () {

    return this._privateKey;

};

/* Computes SHA256 of Buffer, it returns hex encoding */
Crypto.prototype.getHashHex = function(buffer){

    hash.update(buffer);
    return hash.digest("hex");

};

/* Computes SHA256 of Buffer, it returns Base64 encoding */
/* Hashes are not reusable, that is why this weird statement */
Crypto.prototype.getHashBase64 = function(buffer){

    var response = require('crypto').createHash('sha256').update(buffer).digest('base64');

    return response;

};

/* Computes SHA256 Heyed hash = HMAC of Buffer, it returns Base64 encoding */
/* Hashes are not reusable, that is why this weird statement */
/* This is used with OTDP */
Crypto.prototype.getHmacBase64 = function(buffer, key){

    var response = require('crypto').createHmac('sha256', key).update(buffer).digest('base64');

    return response;

};

/* Probabilistic approach based on threshold to check video chunks integrity */
Crypto.prototype.checkVideoChunkIntegrity = function(){
    var response = false;

    if(config.security.enableIntegrityCheck) {
        if (Math.floor((Math.random() * 100) + 1) <= this._threshold) {
            response = true;
        }
    }
    else
        response = false;

    console.log("Check Integrity " + response);

    return response;
};

//OTPD Implementation Design
// One Time Digest Protocol (OTDP)
//I have to receive the (random) hashes for some files
//I have to send those hashes using the Public Key of the receiver
//Only Receiver can Decrypt those messages and check the integrity of the file
//Supervisor is considered a Trustworthy authority on our system
//don't forget to use sequence number in the chunk number
//use a hash-table to obtain those chunks/hashes in O(1)

//Paper Steps:
//1) P0 authenticates itself to the server (already have this)
//2) The server (supervisor) provides P0 a set of keys based on the streams requested
//3) P0 send broadcaster to send data and digests
//4) Pi peers send data and digests
//5) P0 verifies each segment with appropriate keys

/* Exporting module */
module.exports = Crypto;

