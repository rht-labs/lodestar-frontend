import { getHumanReadableSeverity, Severity } from '../system_message';

describe('System message', () => {
  test('gets correct human readable message severity', () => {
    expect(getHumanReadableSeverity(Severity.danger)).toEqual('Danger');
    expect(getHumanReadableSeverity(Severity.info)).toEqual('Info');
    expect(getHumanReadableSeverity(Severity.warning)).toEqual('Warning');
  });
});
