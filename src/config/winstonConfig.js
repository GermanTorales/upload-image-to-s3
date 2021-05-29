import winston, { format } from 'winston';
import { v4 as uuid } from 'uuid';
import { format as dateFormat } from 'date-fns';
import { createLogWithChalk } from '../helpers/functions/winston.helpers';
const { combine, printf } = format;

const errorFormat = printf(({ message: { endpoint, location, error } }) => {
  const id = { info: uuid(), color: '#DC143C' };
  const date = { info: dateFormat(new Date(), 'yyyy/MM/dd HH:mm:ss'), color: '#ffffff' };
  const type = { info: 'error', color: '#DC143C', fontType: 'inverse' };
  const errLocation = { info: location, color: '#DC143C' };
  const errorMessage = { info: error?.message || error?._message, color: '#DC143C' };
  const log = {
    id: id.info,
    date: date.info,
    endpoint,
    location,
    error: {
      message: error.message || null,
      stack: error.stack || null,
      object: error || null,
    },
  };

  const data = [date, type, errLocation, errorMessage];
  console.log(createLogWithChalk(data));

  return error && JSON.stringify(log);
});

const logFormat = format.printf(info => {
  const id = { info: uuid(), color: '#11D465' };
  const level = { info: info.level, color: '#11D465', fontTpye: 'inverse' };
  const message = { info: info.message, color: '#11D465' };
  const date = { info: dateFormat(new Date(), 'yyyy/MM/dd HH:mm:ss'), color: '#ffffff' };
  const data = [date, level, message];
  const log = {
    id: id.info,
    date: date.info,
    message: info.message,
  };

  console.log(createLogWithChalk(data));

  return info && JSON.stringify(log);
});

const requestFormat = printf(({ message }) => {
  const data = message.split('#');
  const [status, method, url, ip, date, userAgent, query, resstatus, resmessage, restime] = data;
  const log = {
    request: {
      status,
      method,
      url,
      ip,
      date,
      userAgent,
      queries: JSON.parse(query),
    },
    response: {
      status: resstatus,
      message: resmessage,
      responseTime: restime,
    },
  };
  return JSON.stringify(log);
});

// Winston logger configuraiton
export const loggerError = winston.createLogger({
  exitOnError: false,
  transports: [
    new winston.transports.File({
      level: 'error',
      filename: 'logs/error.log',
      format: winston.format.combine(errorFormat),
      json: true,
      maxsize: 5242880,
      maxFiles: 5,
    }),
  ],
});

export const loggerInfo = winston.createLogger({
  exitOnError: false,
  transports: [
    new winston.transports.File({
      level: 'info',
      filename: 'logs/combined.log',
      format: winston.format.combine(logFormat),
      json: true,
      maxsize: 5242880,
      maxFiles: 5,
    }),
  ],
});

loggerError.stream = {
  write: message => {
    logger.verbose(message);
  },
};

loggerInfo.stream = {
  write: message => {
    logger.verbose(message);
  },
};

export const morganLogger = winston.createLogger({
  exitOnError: false,
  transports: [
    new winston.transports.File({
      level: 'info',
      filename: `logs/access.log`,
      json: true,
      maxsize: 5242880,
      maxFiles: 5,
      format: combine(requestFormat),
    }),
  ],
  exceptionHandlers: [
    new winston.transports.File({
      filename: `logs/exceptions.log`,
    }),
  ],
});
