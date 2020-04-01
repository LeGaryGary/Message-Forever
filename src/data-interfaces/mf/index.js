import {AddAppName, AddVersion, AddUnixTime, FromAppName} from '../arweave'

import { GetUnixTime } from '../time'

export const AppName = 'space.securemessage';
export const AppVersion = '0.0.0';
export const AppVersionData = [
  {
    version: '0.0.0',
    description:
      'Alpha version of securemessage.space before intial public release',
    features: [],
    knownIssues: []
  },
  {
    version: '0.1.0',
    releaseDate: null,
    features: [],
    knownIssues: []
  }
];

export const MajorVersionNames = ['tiny'];

export const MinorVersionNames = ['alligator', 'koala'];

export const PatchVerionNames = [
  'calm',
  'annoyed',
  'offended',
  'sullen',
  'uptight',
  'exasperated',
  'indignant',
  'resentful',
  'bitter',
  'irate',
  'furious',
  'outraged'
];

let currentVersionData = null;

function GetCurrentVersionName() {
  const [major, minor, patch] = AppVersion.split('.').map(numbStr =>
    Number.parseInt(numbStr)
  );
  const versionName = `${MajorVersionNames[major]} ${PatchVerionNames[patch]} ${MinorVersionNames[minor]}`
  console.log('version: ', versionName)
  console.log('version number:', major, minor, patch);
  return versionName;
}

export function GetCurrentVersionData() {
  if (currentVersionData) return currentVersionData;
  const versionData = AppVersionData.find(
    element => element.version === AppVersion
  );
  versionData.name = GetCurrentVersionName();
  return currentVersionData = versionData;
}

export const ThisApp = FromAppName(AppName)

export function StampTx(tx) {
  AddAppName(tx, AppName);
  AddVersion(tx, AppVersion);
  AddUnixTime(tx, GetUnixTime());
}
