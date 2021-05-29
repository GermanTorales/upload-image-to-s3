import chalk from 'chalk';

export const createLogWithChalk = data => {
  const log = data
    .reduce((acc, { info, color, colorType = 'hex', fontType }) => {
      const newData = fontType ? chalk[colorType](color)[fontType](info) : chalk[colorType](color)(info);

      return !acc ? `${acc} ${newData}` : `${acc} | ${newData}`;
    }, '')
    .trim();

  return log;
};

export const getHttpMethodColor = method => {
  const defaultColor = '#F0E68C';
  const methodColor = {
    GET: '#1E90FF',
    POST: '#FFA500',
    PUT: '#FFD700',
    DELETE: '#DC143C',
  };

  return methodColor[method] || defaultColor;
};
