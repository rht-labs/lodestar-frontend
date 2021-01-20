import { getFeaturesFromVersion } from './version_feature_factory';

describe('version feature factory', () => {
  test('when the version is lower than a required version, it does not include the feature', () => {
    const featureVersions = {
      shouldNotHave: '2.0.0',
    };
    const features = getFeaturesFromVersion('1.0.0', featureVersions);
    expect(features.length).toBe(0);
  });
  test('when the version is greater than the required version, it should include the feature', () => {
    const featureVersions = {
      shouldHave: '1.0.0',
    };
    const features = getFeaturesFromVersion('2.0.0', featureVersions);
    expect(features).toEqual(['shouldHave']);
  });
  test('when the version is equal to the required version, it should include the feature', () => {
    const featureVersions = {
      shouldHave: '1.0.0',
    };
    const features = getFeaturesFromVersion('1.0.0', featureVersions);
    expect(features).toEqual(['shouldHave']);
  });
});
