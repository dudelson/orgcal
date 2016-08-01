'use strict';

function logErr(error) {
  console.error('[ERROR]', error.message, error.code);
}

function logErrMessage(errMessage) {
  console.error('[ERROR]', errMessage);
}

module.exports.logErr = logErr;
module.exports.logErrMessage = logErrMessage;
