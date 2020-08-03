import {
  getHumanReadableNameForHealthStatus,
  HealthStatus,
  getColorForHealthStatus,
} from '../cluster_status';

describe('Cluster status', () => {
  test('can get correct human readable color name for each health status', () => {
    expect(getHumanReadableNameForHealthStatus(HealthStatus.green)).toEqual(
      'Green'
    );
    expect(getHumanReadableNameForHealthStatus(HealthStatus.yellow)).toEqual(
      'Yellow'
    );
    expect(getHumanReadableNameForHealthStatus(HealthStatus.red)).toEqual(
      'Red'
    );
  });
  test('can get correct color for each health status', () => {
    expect(getColorForHealthStatus(HealthStatus.green)).toEqual('green');
    expect(getColorForHealthStatus(HealthStatus.yellow)).toEqual('#EC7A08');
    expect(getColorForHealthStatus(HealthStatus.red)).toEqual('#C9190B');
    expect(getColorForHealthStatus(undefined)).toEqual('grey');
  });
});
