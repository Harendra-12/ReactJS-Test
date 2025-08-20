export const requiredValidator = {
  required: "This field is required",
};

export const numberValidator = {
  pattern: {
    value: /^[0-9]*$/,
    message: "Only digits are allowed",
  },
};
export const emailValidator = {
  pattern: {
    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    message: "Invalid email format",
  },
};
export const userNameValidator = {
  pattern: {
    value: /^[a-zA-Z0-9]{4,}$/,
    message:
      "Invalid username format, only alphanumeric characters and minimum 4 are allowed",
  },
};
export const fullNameValidator = {
  pattern: {
    value: /^[A-Za-z\s]{2,}$/,
    message:
      "Name should contain only letters and spaces, minimum 2 characters",
  },
};
export const minLengthValidator = (min) => ({
  minLength: {
    value: min,
    message: `Minimum ${min} characters required`,
  },
});
export const passwordValidator = {
  pattern: {
    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    message:
      "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character",
  },
};
