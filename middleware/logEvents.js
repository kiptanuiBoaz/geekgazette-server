//third party modules
const { format } = require('date-fns');
const { v4: uuid } = require('uuid');

//node core modules
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

const logEvents = async (message, logName) => {
    //create timestamp
    const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`;
    //create log with timestamp
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

    try {
        //check if dir exists and create otherwise append
        if (!fs.existsSync(path.join(__dirname, "..", 'logs'))) {
            await fsPromises.mkdir(path.join(__dirname,"..", 'logs'));
        }

        //append if exists otherwise perform a write operation
        await fsPromises.appendFile(path.join(__dirname, "..",'logs', logName), logItem);
    } catch (err) {
        console.log(err);
    }
}

const logger = (req,res,next)=>{
    console.log(`${req.path} ${req.method}`)

    logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, "reqLog.txt")
    //move on to the other route handlers
    next();
}

module.exports = { logger,logEvents};