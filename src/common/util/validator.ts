/**
 * 校验字段集是否存在空字符串
 * @param args
 */
export function isEmpty(args: any[]) {
  if (args.some(arg => arg === '' || arg === null || arg === undefined)) {
    return true;
  }
  return false;
}

/**
 * 校验字段长度范围
 * @param field
 * @param min
 * @param max
 */
export function checkLength(field: string, min: number, max: number) {
  return field.length >= min && field.length <= max;
}

/**
 * 校验字段最小长度
 * @param field
 * @param min
 */
export function checkMinLength(field: string, min: number) {
  return field.length >= min;
}

/**
 * 校验字段最大长度
 * @param field
 * @param max
 */
export function checkMaxLength(field: string, max: number) {
  return field.length <= max;
}

const EmailReg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
/**
 * 校验是否符合邮箱格式
 * @param field
 */
export function checkEmail(field: string) {
  return EmailReg.test(field);
}
