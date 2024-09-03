const fs = require('fs')
const qrcode = require('qrcode-terminal')
const { sessionFolderPath } = require('../config')
const { sendErrorResponse } = require('../utils')
const axios = require('axios')

/**
 * Responds to ping request with 'pong'
 *
 * @function ping
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - Promise that resolves once response is sent
 * @throws {Object} - Throws error if response fails
 */
const ping = async (req, res) => {
  /*
    #swagger.tags = ['Various']
  */
  try {
    res.json({ success: true, message: 'pong' })
  } catch (error) {
    sendErrorResponse(res, 500, error.message)
  }
}

/**
 * Example local callback function that generates a QR code and writes a log file
 *
 * @function localCallbackExample
 * @async
 * @param {Object} req - Express request object containing a body object with dataType and data
 * @param {string} req.body.dataType - Type of data (in this case, 'qr')
 * @param {Object} req.body.data - Data to generate a QR code from
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - Promise that resolves once response is sent
 * @throws {Object} - Throws error if response fails
 */

//const webhookUrl = 'https://webhook.site/3804d4b7-1cd1-4880-9c0a-4107316d5f71';
const webhookUrl = 'https://clickwhats.clicki9.com.br/api/webhook/messaging?event=MESSAGE_RECEIVED';

// const sendToWebhook = async (data) => {
//   if (data.dataType === 'message') {
//     return axios.post(webhookUrl, data);
//   }
// };

const sendToWebhook = async (data) => {
  if (data.dataType === 'message') {

    const formData = new URLSearchParams();
    formData.append('payload', JSON.stringify(data));

    return axios.post(webhookUrl, formData);
  }
};

const localCallbackExample = async (req, res) => {
  /*
    #swagger.tags = ['Various']
  */
  try {
    const { dataType, data } = req.body
    if (dataType === 'qr') { qrcode.generate(data.qr, { small: true }) }
    await sendToWebhook(req.body);
    fs.writeFile(`${sessionFolderPath}/message_log.txt`, `${JSON.stringify(req.body)}\r\n`, { flag: 'a+' }, _ => _)
    res.json({ success: true })
  } catch (error) {
    console.log(error)
    fs.writeFile(`${sessionFolderPath}/message_log.txt`, `(ERROR) ${JSON.stringify(error)}\r\n`, { flag: 'a+' }, _ => _)
    sendErrorResponse(res, 500, error.message)
  }
}

module.exports = { ping, localCallbackExample }
