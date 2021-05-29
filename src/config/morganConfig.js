import morgan from 'morgan';
import { morganLogger } from './winstonConfig';
import { format as dateFormat } from 'date-fns';
import httpStatus from 'http-status';
import { createLogWithChalk, getHttpMethodColor } from '../helpers/functions/winston.helpers';

/**
 * Add new fields to morgan request message
 * @param {object} req Request object
 * @param {object} res Response object
 * @param {Function} next
 * @returns Morgan updated Middleware
 */
export const morganConfig = (req, res, next) => {
  morgan.token('resstatus', (req, res) => res.statusCode);
  morgan.token('resmessage', (req, res) => res.statusMessage);
  morgan.token('query', (req, res) => JSON.stringify(req.query));

  const requestConfig =
    ':status#:method#:url#:remote-addr#:date[iso]#:user-agent#:query#:resstatus#:resmessage#:response-time[4]';

  return morgan(requestConfig, {
    stream: morganLogger.stream,
  })(req, res, () => next());
};

morganLogger.stream = {
  write: message => {
    morganLogger.info(message);
  },
};

morganLogger.on('finish', function (info) {
  console.error(
    colorized({
      message: '[ERROR] Morgan logger is stopped',
      color: 'red',
    })
  );
  console.error(info);
});

morganLogger.on('error', function (err) {
  if (!isTest) {
    console.error(
      colorized({
        message: '[ERROR] An error occurred in Morgan logger',
        color: 'red',
      })
    );
    console.error(err);
  }
});

export const apiLogging = morgan(function (tokens, req, res, next) {
  const method = tokens.method(req, res);
  const methodColor = getHttpMethodColor(method);
  const status = tokens.status(req, res);
  const statusColor = status < httpStatus.BAD_REQUEST ? 'green' : 'red';
  const reqDate = dateFormat(new Date(), 'yyyy/MM/dd HH:mm:ss');
  const responseTime = tokens['response-time'](req, res) + ' ms';
  const date = { info: reqDate, color: '#ffffff' };
  const type = { info: 'request', color: '#32CD32', fontType: 'inverse' };
  const reqMethod = { info: method, color: methodColor };
  const reqStatus = { info: status, color: statusColor, colorType: 'keyword' };
  const url = { info: tokens.url(req, res), color: '#32CD32' };
  const resTime = { info: responseTime, color: '#32CD32' };
  const data = [date, type, reqMethod, reqStatus, url, resTime];
  const coloredLog = createLogWithChalk(data);

  return coloredLog;
});
