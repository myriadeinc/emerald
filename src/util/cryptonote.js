/**
 * Imported utility functions from Cryptonote Node.JS Pool
 * https://github.com/dvandal/cryptonote-nodejs-pool
 **/

const crypto = require('crypto');
const dateFormat = require('dateformat');
const cnUtil = require('cryptonote-util');
const uuid = require('uuid/v4');

const config = require('src/util/config.js');
const addressBase58Prefix = parseInt(cnUtil.address_decode(Buffer.from(config.get('pool:poolAddress'))).toString());
const integratedAddressBase58Prefix = config.get('pool:intAddressPrefix') ? parseInt(config.get('pool:intAddressPrefix')) : addressBase58Prefix + 1;

const CryptonoteUtil = {

  cnUtil,

  dateFormat,

  instanceId: () => {
    return crypto.randomBytes(4);
  },

  getAddressPrefix: (address) => {
    const addressBuffer = Buffer.from(address);

    let addressPrefix = cnUtil.address_decode(addressBuffer);
    if (addressPrefix) addressPrefix = parseInt(addressPrefix.toString());

    if (!addressPrefix) {
      addressPrefix = cnUtil.address_decode_integrated(addressBuffer);
      if (addressPrefix) addressPrefix = parseInt(addressPrefix.toString());
    }

    return addressPrefix || null;
  },

  validateMinerAddress: (address) => {
    const addressPrefix = getAddressPrefix(address);
    if (addressPrefix === addressBase58Prefix) return true;
    else if (addressPrefix === integratedAddressBase58Prefix) return true;
    return false;
  },

  isIntegratedAddress: (address) => {
    // Return true if value is an integrated address
    const addressPrefix = getAddressPrefix(address);
    return (addressPrefix === integratedAddressBase58Prefix);
  },

  cleanupSpecialChars: (str) => {
    str = str.replace(/[ÀÁÂÃÄÅ]/g, 'A');
    str = str.replace(/[àáâãäå]/g, 'a');
    str = str.replace(/[ÈÉÊË]/g, 'E');
    str = str.replace(/[èéêë]/g, 'e');
    str = str.replace(/[ÌÎÏ]/g, 'I');
    str = str.replace(/[ìîï]/g, 'i');
    str = str.replace(/[ÒÔÖ]/g, 'O');
    str = str.replace(/[òôö]/g, 'o');
    str = str.replace(/[ÙÛÜ]/g, 'U');
    str = str.replace(/[ùûü]/g, 'u');
    return str.replace(/[^A-Za-z0-9\-\_]/gi, '');
  },

  getReadableHashRate: (hashrate) => {
    /**
         * Get readable hashrate
         **/
    let i = 0;
    const byteUnits = [' H', ' KH', ' MH', ' GH', ' TH', ' PH'];
    while (hashrate > 1000) {
      hashrate = hashrate / 1000;
      i++;
    }
    return hashrate.toFixed(2) + byteUnits[i] + '/sec';
  },

  getReadableCoins: (coins, digits, withoutSymbol) => {
    /**
         * Get readable coins
         **/
    const coinDecimalPlaces = config.coinDecimalPlaces || config.coinUnits.toString().length - 1;
    const amount = (parseInt(coins || 0) / config.coinUnits).toFixed(digits || coinDecimalPlaces);
    return amount + (withoutSymbol ? '' : (' ' + config.symbol));
  },

  ringBuffer: (maxSize) => {
    let data = [];
    let cursor = 0;
    let isFull = false;

    return {
      append: function(x) {
        if (isFull) {
          data[cursor] = x;
          cursor = (cursor + 1) % maxSize;
        } else {
          data.push(x);
          cursor++;
          if (data.length === maxSize) {
            cursor = 0;
            isFull = true;
          }
        }
      },
      avg: function(plusOne) {
        const sum = data.reduce(function(a, b) {
          return a + b;
        }, plusOne || 0);
        return sum / ((isFull ? maxSize : cursor) + (plusOne ? 1 : 0));
      },
      size: function() {
        return isFull ? maxSize : cursor;
      },
      clear: function() {
        data = [];
        cursor = 0;
        isFull = false;
      },
    };
  },

  uid: () => {
    return uuid();
  },

};
module.exports = CryptonoteUtil;
