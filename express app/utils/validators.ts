export const required = (value: string) => (value ? undefined : "Required");
export const email = (value: string) => (/\S+@\S+\.\S+/.test(value) ? undefined : "Invalid Email");
export const minLength = (value: string) => (value.length < 3 ? "Length must be 3 or more characters" : undefined);
export const maxLength = (value: string) => (value.length > 18 ? "Length cannot be more than 18 characters" : undefined);
export const composeValidators =
  (...validators: ((value: string) => string | undefined)[]) =>
  (value: string) =>
    validators.reduce((error: string | undefined, validator: (value: string) => string | undefined) => error || validator(value), undefined);
