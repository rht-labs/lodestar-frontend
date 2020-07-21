import './wdyr';
import React, { Profiler } from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';
import { unstable_trace as trace } from 'scheduler/tracing';
import './assets/css/overrides.css';
import { Validation } from './schemas/validators';
import * as Validators from './schemas/validators/standard_validators';
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

if (process.env.NODE_ENV === 'development') {
  trace('initial render', performance.now(), () =>
    ReactDOM.render(
      <Profiler
        id="application"
        onRender={(
          id: string,
          phase: 'mount' | 'update',
          actualDuration: number,
          baseDuration: number,
          startTime: number,
          commitTime: number,
          interactions: Set<any>
        ) => {}}
      >
        <App />
      </Profiler>,
      document.getElementById('root')
    )
  );
} else {
  ReactDOM.render(<App />, document.getElementById('root'));
}
