const RequestLog = require('../model/RequestLogs');

const logEvents = async (req, res, next) => {
    //credentials from req
    const { url, ip, method } = req
    const start = Date.now();

    //event listener
    res.on('finish', async () => {
        const responseTime = Date.now() - start;
        const { statusCode } = res;
        const { 'user-agent': userAgent } = req.headers;

        //create new req log
        const requestLog = new RequestLog({
            method,
            url,
            status: statusCode,
            responseTime,
            ipAddress: ip,
            userAgent,
        });

        try {
            await requestLog.save();
        } catch (err) {
            console.error(err);
        }
    });

    next();
}


//log in the terminal
const logger = (req, res, next) => {
    console.log(`${req.path} ${req.method}`)


    //move on to the other route handlers
    next();
}

module.exports = { logger, logEvents };