const http = require("http");
const axios = require("axios");

const loggingHandler = (config) => {
  const loggingApiHeaders = {
    Authorization: "Bearer " + config.apiKey,
  };

  const log = async (req, res) => {
    let headerObj = {};
    req?.rawHeaders?.map((item, index) => {
      if (index % 2 === 0) headerObj[`${item}`] = req?.rawHeaders[index + 1];
    });

    const body = {
      host: headerObj?.Host,
      timestamp: `${res?.req?._startTime}`,
      processingTime: req?.res?._startTime - res?.req?._startTime,
      rawHeaders: headerObj,
      body: JSON.stringify(req?._body ? req?.body : null),
      httpVersion: req?.httpVersion,
      method: req?.method,
      url: req?.originalUrl,
      statusCode: res?.statusCode,
      response: {
        statusCode: res?.statusCode,
        statusMessage: res?.statusMessage,
        headers: res?._header,
      },
    };

    try {
      await axios.post(
        `https://log-admin-service-production.up.railway.app/api/log`,
        body
      );
    } catch (error) {
      console.log(error.code);
    }
  };

  return log;
};

module.exports = loggingHandler;
