import { validationMessages } from './validationMessages';

export function validateUserForm(input, selectedUser) {
  const rules = [
    {
      valid: !!input.email,
      message: validationMessages.emailRequired,
    },
    {
      valid: !!input.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email),
      message: validationMessages.emailInvalid,
    },
    {
      valid: !!input.name,
      message: validationMessages.nameRequired,
    },
    {
      valid: !!input.first_lastName,
      message: validationMessages.firstLastNameRequired,
    },
    {
      valid: !!input.second_lastName,
      message: validationMessages.secondLastNameRequired,
    },
  ];

  // Password rules for new user
  if (!selectedUser) {
    rules.push(
      {
        valid: !!input.password,
        message: validationMessages.passwordRequired,
      },
      {
        valid: (input.password || '').length >= 6,
        message: validationMessages.passwordLength,
      },
      {
        valid: !!input.confirmation_password,
        message: validationMessages.passwordConfirm,
      },
      {
        valid: input.password === input.confirmation_password,
        message: validationMessages.passwordMismatch,
      }
    );
  } else if (input.password) {
    // Password update rules
    rules.push(
      {
        valid: (input.password || '').length >= 6,
        message: validationMessages.passwordLength,
      },
      {
        valid: input.password === input.confirmation_password,
        message: validationMessages.passwordMismatch,
      }
    );
  }

  for (const rule of rules) {
    if (!rule.valid) {
      return rule.message;
    }
  }
  return null;
};
