import semver from 'semver';
import { AppFeature } from '../common/app_features';

export type FeatureVersionMap = {
  [key in AppFeature]?: string;
};

export const FEATURE_VERSION_MAP: FeatureVersionMap = {
  resetUser: 'v1.1.50',
  newDashboard: 'v0.0.1',
};
const getSemverFromVersionString = (version: string = ''): string => {
  return semver.clean(version);
};
const isVersionGreaterOrEqualTo = (
  version: string,
  comparisonVersion: string
) => {
  if (!version || !comparisonVersion) {
    return false;
  }
  return semver.gte(version, comparisonVersion);
};
export function getFeaturesFromVersion(
  version: string,
  featureVersionMap: FeatureVersionMap = {}
): string[] {
  if (!version) {
    return [];
  }
  const givenSemver = getSemverFromVersionString(version);
  const featureFromVersions = Object.keys(featureVersionMap).filter(k => {
    const wantedVersionString = featureVersionMap[k];
    const wantedSemver = getSemverFromVersionString(wantedVersionString);
    const hasWantedVersion = isVersionGreaterOrEqualTo(
      givenSemver,
      wantedSemver
    );
    return hasWantedVersion;
  });
  return featureFromVersions;
}
