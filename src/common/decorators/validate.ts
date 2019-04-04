import { createParamDecorator } from '@nestjs/common';
export const validateRange = createParamDecorator((data, req) => {
    console.log(data);
  return data;
});
