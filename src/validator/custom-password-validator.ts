import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'customPassword', async: false })
export class CustomPasswordValidator implements ValidatorConstraintInterface {
  validate(text: string, args: ValidationArguments): boolean {
    // 8-50자. 대소문자, 숫자, 특수문자가 필요.
    return !!new RegExp(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,50}$/g,
    ).exec(text);
  }

  defaultMessage(args: ValidationArguments): string {
    return '비밀번호가 올바르지 않습니다.';
  }
}
