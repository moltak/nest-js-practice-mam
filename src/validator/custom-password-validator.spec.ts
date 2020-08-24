import { CustomPasswordValidator } from './custom-password-validator';

describe('CustomPasswordValidator test', () => {
  const validator = new CustomPasswordValidator();

  it('틀린 패턴', () => {
    expect(validator.validate('1234567', null)).toBeFalsy();
    expect(validator.validate('12345678aB', null)).toBeFalsy();
    expect(validator.validate('12345678A*&', null)).toBeFalsy();
  });

  it('특수문자, 대소문자 8-15글자 포함되어 있어야함', () => {
    expect(validator.validate('123456%aA', null)).toBeTruthy();
  });

  it('대소문자가 포함되어 있어야함', () => {
    expect(validator.validate('123456%aA', null)).toBeTruthy();
  });
});
