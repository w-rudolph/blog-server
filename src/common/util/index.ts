import * as Crypto from 'crypto';

export function md5(text: string) {
  return Crypto.createHash('md5')
    .update(text)
    .digest('hex');
}

const validateMap = {
  email: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
};
export function checkFormat(type: string, data: any): boolean {
  return (validateMap[type] as RegExp).test(data.toString());
}

export function formatResponse(data: any, code: any, error?: any, extra?: any) {
  return {
    data,
    code,
    success: !error,
    message: error || null,
    ...(extra || {}),
  };
}

export function fetchFields(obj: object, fields: string[]) {
  const ret = {};
  fields.forEach(field => {
    ret[field] = obj[field];
  });
  return ret;
}
