import { Validation } from '../schemas/validators';

import * as Validators from '../schemas/validators/standard_validators';

export function setUpValidation() {
  Validation.registerValidator('regex', validationOptions =>
    Validators.RegexValidator(
      RegExp(validationOptions.value),
      validationOptions.message
    )
  );
  Validation.registerValidator('email', validationOptions =>
    Validators.EmailAddressValidator(validationOptions.message)
  );

  Validation.registerValidator('notnull', validationOptions =>
    Validators.NotNullValidator(validationOptions.message as string)
  );

  Validation.registerValidator('date', validationOptions => {
    return Validators.DateValidator(
      validationOptions.value,
      validationOptions.message
    );
  });
}
