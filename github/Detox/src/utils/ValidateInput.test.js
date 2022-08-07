import {Message} from '../assets/localize/message/Message';
import ValidateInput from './ValidateInput';

// isEmpty
describe('ValidateInput isEmpty test cases', () => {
  it('isEmpty: Should return false for non empty string', () => {
    const input = '123';
    const output = ValidateInput.isEmpty(input);
    expect(output).toEqual(false);
  });

  it('isEmpty: Should return true for empty string', () => {
    const input = '';
    const output = ValidateInput.isEmpty(input);
    expect(output).toEqual(true);
  });

  it('isEmpty: Should return true for null', () => {
    const input = null;
    const output = ValidateInput.isEmpty(input);
    expect(output).toEqual(true);
  });
});

// checkName
describe('ValidateInput checkName test cases', () => {
  it('checkName: Should return empty string for non-empty text', () => {
    const input = 'abc';
    const output = ValidateInput.checkName(input);
    expect(output).toEqual('');
  });

  it('checkName: Should return required error MRG_ERR_001 for empty text', () => {
    const input = '';
    const output = ValidateInput.checkName(input);
    expect(output).toEqual(Message.MRG_ERR_001);
  });

  it('checkName: Should return required error MRG_ERR_001 for null text', () => {
    const input = null;
    const output = ValidateInput.checkName(input);
    expect(output).toEqual(Message.MRG_ERR_001);
  });
});

// checkUserName
// Valid UserName: string containing number or letter, excluding special characters, at least 6 characters
describe('ValidateInput checkUserName test cases', () => {
  it('checkUserName: Should return required error MRG_ERR_001 for null text', () => {
    const input = null;
    const output = ValidateInput.checkUserName(input);
    expect(output).toEqual(Message.MRG_ERR_001);
  });

  it('checkUserName: Should return required error MRG_ERR_001 for empty text', () => {
    const input = '';
    const output = ValidateInput.checkUserName(input);
    expect(output).toEqual(Message.MRG_ERR_001);
  });

  it('checkUserName: Should return invalid error MRG_ERR_011 for text containing special character', () => {
    const input = 'abc123@';
    const output = ValidateInput.checkUserName(input);
    expect(output).toEqual(Message.MRG_ERR_011);
  });

  it('checkUserName: Should return invalid error MRG_ERR_011 for text having length under 6', () => {
    const input = 'abc12';
    const output = ValidateInput.checkUserName(input);
    expect(output).toEqual(Message.MRG_ERR_011);
  });

  it('checkUserName: Should return invalid error MRG_ERR_011 for text having length under 6 and containing special character', () => {
    const input = 'ab`12';
    const output = ValidateInput.checkUserName(input);
    expect(output).toEqual(Message.MRG_ERR_011);
  });

  it('checkUserName: Should return empty string for text having length equal 6 and not containing special character', () => {
    const input = 'aba121';
    const output = ValidateInput.checkUserName(input);
    expect(output).toEqual('');
  });

  it('checkUserName: Should return empty string for text having length more than 6 and not containing special character', () => {
    const input = 'aba121a';
    const output = ValidateInput.checkUserName(input);
    expect(output).toEqual('');
  });
});

// checkMobilePhone
// Valid MobilePhone: string containing exactly 10 digits, starting with 0, excluding space, special characters
describe('ValidateInput checkMobilePhone test cases', () => {
  it('checkMobilePhone: Should return required error MRG_ERR_001 for null text', () => {
    const input = null;
    const output = ValidateInput.checkMobilePhone(input);
    expect(output).toEqual(Message.MRG_ERR_001);
  });

  it('checkMobilePhone: Should return required error MRG_ERR_001 for empty text', () => {
    const input = '';
    const output = ValidateInput.checkMobilePhone(input);
    expect(output).toEqual(Message.MRG_ERR_001);
  });

  it('checkMobilePhone: Should return invalid error MRG_ERR_003 for text having length < 10, all number, start with 0', () => {
    const input = '012345678';
    const output = ValidateInput.checkMobilePhone(input);
    expect(output).toEqual(Message.MRG_ERR_003);
  });

  it('checkMobilePhone: Should return invalid error MRG_ERR_003 for text having length > 10, all number, start with 0', () => {
    const input = '01234567891';
    const output = ValidateInput.checkMobilePhone(input);
    expect(output).toEqual(Message.MRG_ERR_003);
  });

  it('checkMobilePhone: Should return invalid error MRG_ERR_003 for text having length > 10, having letter, start with 0', () => {
    const input = '012av34567891';
    const output = ValidateInput.checkMobilePhone(input);
    expect(output).toEqual(Message.MRG_ERR_003);
  });

  it('checkMobilePhone: Should return invalid error MRG_ERR_003 for text having length < 10, having letter, start with 0', () => {
    const input = '012av3';
    const output = ValidateInput.checkMobilePhone(input);
    expect(output).toEqual(Message.MRG_ERR_003);
  });

  it('checkMobilePhone: Should return invalid error MRG_ERR_003 for text having length < 10, having letter, not start with 0', () => {
    const input = '12av3';
    const output = ValidateInput.checkMobilePhone(input);
    expect(output).toEqual(Message.MRG_ERR_003);
  });

  it('checkMobilePhone: Should return invalid error MRG_ERR_003 for text having length > 10, having letter, not start with 0', () => {
    const input = '12av31234567';
    const output = ValidateInput.checkMobilePhone(input);
    expect(output).toEqual(Message.MRG_ERR_003);
  });

  it('checkMobilePhone: Should return invalid error MRG_ERR_003 for text having length = 10, all number, not start with 0', () => {
    const input = '1234567899';
    const output = ValidateInput.checkMobilePhone(input);
    expect(output).toEqual(Message.MRG_ERR_003);
  });

  it('checkMobilePhone: Should return invalid error MRG_ERR_003 for text having length = 10, having letter, start with 0', () => {
    const input = '02345a7899';
    const output = ValidateInput.checkMobilePhone(input);
    expect(output).toEqual(Message.MRG_ERR_003);
  });

  it('checkMobilePhone: Should return empty string for valid text having length = 10, all number, start with 0', () => {
    const input = '0123456789';
    const output = ValidateInput.checkMobilePhone(input);
    expect(output).toEqual('');
  });

  it('checkMobilePhone: check normalize phone number correctly', () => {
    const input = '0123456789';
    const output = ValidateInput.normalizePhoneNumber(input);
    expect(output).toEqual('0123456789');
  });
});

// Check Email
describe('ValidateInput checkEmail test cases', () => {
  it('checkEmail: Should return required error MRG_ERR_001 for null text', () => {
    const input = null;
    const output = ValidateInput.checkEmail(input);
    expect(output).toEqual(Message.MRG_ERR_001);
  });
  it('checkEmail: Should return required error MRG_ERR_001 for empty text', () => {
    const input = '';
    const output = ValidateInput.checkEmail(input);
    expect(output).toEqual(Message.MRG_ERR_001);
  });
  it('checkEmail: Should return invalid error MRG_ERR_004 for text not containing @', () => {
    const input = 'asdf.com';
    const output = ValidateInput.checkEmail(input);
    expect(output).toEqual(Message.MRG_ERR_004);
  });
  it('checkEmail: Should return invalid error MRG_ERR_004 for text containing @ but not domain', () => {
    const input = 'asdf@com';
    const output = ValidateInput.checkEmail(input);
    expect(output).toEqual(Message.MRG_ERR_004);
  });
  it('checkEmail: Should return empty string for valid email text', () => {
    const input = 'asdf@gn.com';
    const output = ValidateInput.checkEmail(input);
    expect(output).toEqual('');
  });
  //VALID EMAIL:

  it('checkEmail: Should return empty string for valid email email@domain.com', () => {
    const input = 'email@domain.com';
    const output = ValidateInput.checkEmail(input);
    expect(output).toEqual('');
  });

  it('checkEmail: Should return empty string for valid email firstname.lastname@domain.com', () => {
    const input = 'firstname.lastname@domain.com';
    const output = ValidateInput.checkEmail(input);
    expect(output).toEqual('');
  });

  it('checkEmail: Should return empty string for valid email email@subdomain.domain.com', () => {
    const input = 'email@subdomain.domain.com';
    const output = ValidateInput.checkEmail(input);
    expect(output).toEqual('');
  });
  it('checkEmail: Should return empty string for valid email Firstname+lastname@domain.com', () => {
    const input = 'Firstname+lastname@domain.com';
    const output = ValidateInput.checkEmail(input);
    expect(output).toEqual('');
  });
  it('checkEmail: Should return empty string for valid email email@123.123.123.123', () => {
    const input = 'email@123.123.123.123';
    const output = ValidateInput.checkEmail(input);
    expect(output).toEqual('');
  });
  it("checkEmail: Should return empty string for valid email email!#$%&'*+-/=?^_`{|recipient@domain.com", () => {
    const input = "email!#$%&'*+-/=?^_`{|recipient@domain.com";
    const output = ValidateInput.checkEmail(input);
    expect(output).toEqual('');
  });
  it('checkEmail: Should return empty string for valid email email@domain-one.com', () => {
    const input = 'email@domain-one.com';
    const output = ValidateInput.checkEmail(input);
    expect(output).toEqual('');
  });
  it('checkEmail: Should return empty string for valid email Firstname-lastname@domain.com', () => {
    const input = 'Firstname-lastname@domain.com';
    const output = ValidateInput.checkEmail(input);
    expect(output).toEqual('');
  });

  //INVALID EMAIL:
  it('checkEmail: Should return invalid error MRG_ERR_004 for  email"(),:;<>[\\]recipient@domain.com', () => {
    const input = ' email"(),:;<>[\\]recipient@domain.com';
    const output = ValidateInput.checkEmail(input);
    expect(output).toEqual(Message.MRG_ERR_004);
  });
  it('checkEmail: Should return invalid error MRG_ERR_004 for email @domain.com', () => {
    const input = '@domain.com';
    const output = ValidateInput.checkEmail(input);
    expect(output).toEqual(Message.MRG_ERR_004);
  });
  it('checkEmail: Should return invalid error MRG_ERR_004 for email Testmail< email@domain.com>', () => {
    const input = 'Testmail< email@domain.com>';
    const output = ValidateInput.checkEmail(input);
    expect(output).toEqual(Message.MRG_ERR_004);
  });
  it('checkEmail: Should return invalid error MRG_ERR_004 for email email.domain.com', () => {
    const input = 'email.domain.com';
    const output = ValidateInput.checkEmail(input);
    expect(output).toEqual(Message.MRG_ERR_004);
  });
  it('checkEmail: Should return invalid error MRG_ERR_004 for email email@domain@domain.com', () => {
    const input = 'email@domain@domain.com';
    const output = ValidateInput.checkEmail(input);
    expect(output).toEqual(Message.MRG_ERR_004);
  });
  it('checkEmail: Should return invalid error MRG_ERR_004 for email plainaddress', () => {
    const input = 'plainaddress';
    const output = ValidateInput.checkEmail(input);
    expect(output).toEqual(Message.MRG_ERR_004);
  });
  it('checkEmail: Should return invalid error MRG_ERR_004 for email #@%^%#@#@#.com', () => {
    const input = '#@%^%#@#@#.com';
    const output = ValidateInput.checkEmail(input);
    expect(output).toEqual(Message.MRG_ERR_004);
  });
  it('checkEmail: Should return invalid error MRG_ERR_004 for email .email@domain.com', () => {
    const input = '.email@domain.com';
    const output = ValidateInput.checkEmail(input);
    expect(output).toEqual(Message.MRG_ERR_004);
  });
  it('checkEmail: Should return invalid error MRG_ERR_004 for email email@domain', () => {
    const input = 'email@domain';
    const output = ValidateInput.checkEmail(input);
    expect(output).toEqual(Message.MRG_ERR_004);
  });
  it('checkEmail: Should return invalid error MRG_ERR_004 for email email"abc@abc.com', () => {
    const input = 'email"abc@abc.com ';
    const output = ValidateInput.checkEmail(input);
    expect(output).toEqual(Message.MRG_ERR_004);
  });
  it('checkEmail: Should return invalid error MRG_ERR_004 for email email”ab@domain', () => {
    const input = 'email”ab@domain';
    const output = ValidateInput.checkEmail(input);
    expect(output).toEqual(Message.MRG_ERR_004);
  });
  it('checkEmail: Should return invalid error MRG_ERR_004 for email contain emoji', () => {
    const input = 'agent😒😒@gm.com';
    const output = ValidateInput.checkEmail(input);
    expect(output).toEqual(Message.MRG_ERR_004);
  });
});

// Check Password:
// Valid password: String must including uppercase and lowercase letter, number and at least 8 characters
describe('ValidateInput checkPassword test cases', () => {
  it('checkPassword: Should return invalid error MRG_ERR_001 for null text', () => {
    const input = null;
    const output = ValidateInput.checkPassword(input);
    expect(output).toEqual(Message.MRG_ERR_001);
  });

  it('checkPassword: Should return invalid error MRG_ERR_001 for empty text', () => {
    const input = '';
    const output = ValidateInput.checkPassword(input);
    expect(output).toEqual(Message.MRG_ERR_001);
  });

  it('checkPassword: Should return invalid error MRG_ERR_006 for text not containing uppercase letter, having lowercase letter, number, 8 characters', () => {
    const input = 'aaaa1234';
    const output = ValidateInput.checkPassword(input);
    expect(output).toEqual(Message.MRG_ERR_006);
  });

  it('checkPassword: Should return invalid error MRG_ERR_006 for text not containing lowercase letter, having uppercase letter, number, 8 characters', () => {
    const input = 'AAAA1234';
    const output = ValidateInput.checkPassword(input);
    expect(output).toEqual(Message.MRG_ERR_006);
  });

  it('checkPassword: Should return invalid error MRG_ERR_006 for text not containing number, having uppercase, lower letter, 8 characters', () => {
    const input = 'AAAAaaaa';
    const output = ValidateInput.checkPassword(input);
    expect(output).toEqual(Message.MRG_ERR_006);
  });

  it('checkPassword: Should return invalid error MRG_ERR_006 for text containing uppercase, lower letter, number but < 8 characters', () => {
    const input = 'AAaa12';
    const output = ValidateInput.checkPassword(input);
    expect(output).toEqual(Message.MRG_ERR_006);
  });

  it('checkPassword: Should return invalid error MRG_ERR_006 for text containing only number, 8 characters', () => {
    const input = '12345678';
    const output = ValidateInput.checkPassword(input);
    expect(output).toEqual(Message.MRG_ERR_006);
  });

  it('checkPassword: Should return invalid error MRG_ERR_006 for text containing only uppercase letter, 8 characters', () => {
    const input = 'AAAAAAAA';
    const output = ValidateInput.checkPassword(input);
    expect(output).toEqual(Message.MRG_ERR_006);
  });

  it('checkPassword: Should return invalid error MRG_ERR_006 for text containing only lowercase letter, 8 characters', () => {
    const input = 'aaaaaaaaa';
    const output = ValidateInput.checkPassword(input);
    expect(output).toEqual(Message.MRG_ERR_006);
  });

  it('checkPassword: Should return empty string for text containing uppercase, lower letter, number,  8 characters', () => {
    const input = 'AAaaaa12';
    const output = ValidateInput.checkPassword(input);
    expect(output).toEqual('');
  });

  it('checkPassword: Should return empty string for text containing uppercase, lower letter, number, > 8 characters', () => {
    const input = 'AAafaaaa12';
    const output = ValidateInput.checkPassword(input);
    expect(output).toEqual('');
  });

  it('checkPassword: Should return empty string for text containing uppercase, lower letter, number, special characters, > 8 characters', () => {
    const input = 'AAafaaaa12#@#~*';
    const output = ValidateInput.checkPassword(input);
    expect(output).toEqual('');
  });
});

// Check ConfirmPassword
// Valid when confirmPassword === password
describe('ValidateInput checkConfirmPassword test cases', () => {
  it('checkConfirmPassword: Should return error MRG_ERR_007 when confirmPassword and password are not the same', () => {
    const password = 'Aaaa1234';
    const confirmPassword = 'Baaa1234';
    const output = ValidateInput.checkConfirmPassword(password, confirmPassword);
    expect(output).toEqual(Message.MRG_ERR_007);
  });

  it('checkConfirmPassword: Should return error MRG_ERR_007 when confirmPassword and password are not the same, one is null', () => {
    const password = null;
    const confirmPassword = 'Baaa1234';
    const output = ValidateInput.checkConfirmPassword(password, confirmPassword);
    expect(output).toEqual(Message.MRG_ERR_007);
  });

  it('checkConfirmPassword: Should return empty string when match confirmPassword and password are indentical', () => {
    const password = 'Aaaa1234';
    const confirmPassword = 'Aaaa1234';
    const output = ValidateInput.checkConfirmPassword(password, confirmPassword);
    expect(output).toEqual('');
  });
});

// Check OTP
// Valid OTP: string including exactly 6 digits
describe('ValidateInput checkOtp test cases', () => {
  it('checkOtp: Should return error MRG_ERR_001 for null text', () => {
    const input = null;
    const output = ValidateInput.checkOtp(input);
    expect(output).toEqual(Message.MRG_ERR_001);
  });

  it('checkOtp: Should return error MRG_ERR_001 for empty text', () => {
    const input = '';
    const output = ValidateInput.checkOtp(input);
    expect(output).toEqual(Message.MRG_ERR_001);
  });

  it('checkOtp: Should return error MRG_ERR_005 for text including all letter, 6 characters', () => {
    const input = 'aabbcc';
    const output = ValidateInput.checkOtp(input);
    expect(output).toEqual(Message.MRG_ERR_005);
  });

  it('checkOtp: Should return error MRG_ERR_005 for text including letter, number, 6 characters', () => {
    const input = '1122cc';
    const output = ValidateInput.checkOtp(input);
    expect(output).toEqual(Message.MRG_ERR_005);
  });

  it('checkOtp: Should return error MRG_ERR_005 for text including only number, < 6 characters', () => {
    const input = '11224';
    const output = ValidateInput.checkOtp(input);
    expect(output).toEqual(Message.MRG_ERR_005);
  });

  it('checkOtp: Should return error MRG_ERR_005 for text including only number, > 6 characters', () => {
    const input = '1122445';
    const output = ValidateInput.checkOtp(input);
    expect(output).toEqual(Message.MRG_ERR_005);
  });

  it('checkOtp: Should return empty string for text including only number, 6 characters', () => {
    const input = '112244';
    const output = ValidateInput.checkOtp(input);
    expect(output).toEqual('');
  });
});
