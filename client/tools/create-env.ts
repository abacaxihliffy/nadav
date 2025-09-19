import { spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

import { availableLangs, Languages } from '../../shared/config/i18n';
import env from './read-env';

const configPath = path.resolve(__dirname, '../config');

// ✅ Normalização de variáveis de ambiente (Windows/CMD/PowerShell vs *nix)
// Aceitar tanto camelCase quanto UPPER_CASE e definir alguns defaults.
process.env.CLIENT_LOCALE = process.env.CLIENT_LOCALE || process.env.clientLocale;
process.env.CURRICULUM_LOCALE =
  process.env.CURRICULUM_LOCALE || process.env.curriculumLocale;
process.env.DEPLOYMENT_ENV =
  process.env.DEPLOYMENT_ENV || process.env.deploymentEnv;

process.env.homeLocation =
  process.env.homeLocation || process.env.HOME_LOCATION || process.env.HOME_URL;
process.env.apiLocation =
  process.env.apiLocation || process.env.API_LOCATION || process.env.API_URL;
process.env.forumLocation =
  process.env.forumLocation ||
  process.env.FORUM_LOCATION ||
  'https://forum.freecodecamp.org';
process.env.newsLocation =
  process.env.newsLocation ||
  process.env.NEWS_LOCATION ||
  'https://www.freecodecamp.org/news';
process.env.radioLocation =
  process.env.radioLocation || process.env.RADIO_LOCATION;

// ✅ Tratar FREECODECAMP_NODE_ENV não definido como 'development' (melhor DX)
const FREECODECAMP_NODE_ENV =
  process.env.FREECODECAMP_NODE_ENV || 'development';

function checkClientLocale() {
  if (!process.env.CLIENT_LOCALE) throw Error('CLIENT_LOCALE is not set');
  if (!availableLangs.client.includes(process.env.CLIENT_LOCALE as Languages)) {
    throw Error(`
      CLIENT_LOCALE, ${process.env.CLIENT_LOCALE}, is not an available language in shared/config/i18n.ts
    `);
  }
}

function checkCurriculumLocale() {
  if (!process.env.CURRICULUM_LOCALE)
    throw Error('CURRICULUM_LOCALE is not set');
  if (
    !availableLangs.curriculum.includes(
      process.env.CURRICULUM_LOCALE as Languages
    )
  ) {
    throw Error(`
      CURRICULUM_LOCALE, ${process.env.CURRICULUM_LOCALE}, is not an available language in shared/config/i18n.ts
    `);
  }
}

function checkDeploymentEnv() {
  if (!process.env.DEPLOYMENT_ENV) throw Error('DEPLOYMENT_ENV is not set');
  if (!['staging', 'production'].includes(process.env.DEPLOYMENT_ENV)) {
    throw Error(`
${process.env.DEPLOYMENT_ENV} is not a valid value for DEPLOYMENT_ENV.
Only 'staging' and 'production' are valid deployment environments.
`);
  }
}

checkClientLocale();
checkCurriculumLocale();
checkDeploymentEnv();

if (FREECODECAMP_NODE_ENV !== 'development') {
  const locationKeys = [
    'homeLocation',
    'apiLocation',
    'forumLocation',
    'newsLocation',
    'radioLocation'
  ];
  const deploymentKeys = [
    'clientLocale',
    'curriculumLocale',
    'deploymentEnv',
    'environment',
    'showUpcomingChanges',
    'showDailyCodingChallenges'
  ];
  const searchKeys = ['algoliaAppId', 'algoliaAPIKey'];
  const donationKeys = ['stripePublicKey', 'paypalClientId', 'patreonClientId'];
  const abTestingKeys = ['growthbookUri'];

  const expectedVariables = locationKeys.concat(
    deploymentKeys,
    searchKeys,
    donationKeys,
    abTestingKeys
  );
  const actualVariables = Object.keys(env as Record<string, unknown>);
  if (expectedVariables.length !== actualVariables.length) {
    const extraVariables = actualVariables
      .filter(x => !expectedVariables.includes(x))
      .toString();
    const missingVariables = expectedVariables
      .filter(x => !actualVariables.includes(x))
      .toString();

    throw Error(
      `
    Env. variable validation failed. Make sure only expected variables are used and configured.
    ` +
        (extraVariables ? `Extra variables: ${extraVariables}\n` : '') +
        (missingVariables ? `Missing variables: ${missingVariables}` : '')
    );
  }

  for (const key of expectedVariables) {
    const envVal = env[key as keyof typeof env];
    if (typeof envVal === 'undefined' || envVal === null) {
      throw Error(`
      Env. variable ${key} is missing, build cannot continue
      `);
    }
  }

  if (env['environment'] !== 'production')
    throw Error(`
  Production environment should be 'production'
  `);

  if (env['showUpcomingChanges'] && env['deploymentEnv'] !== 'staging')
    throw Error(`
  SHOW_UPCOMING_CHANGES should never be 'true' in production
  `);
} else {
  if (fs.existsSync(`${configPath}/env.json`)) {
    const { showUpcomingChanges } = JSON.parse(
      fs.readFileSync(`${configPath}/env.json`, 'utf-8')
    ) as { showUpcomingChanges: boolean };

    if (env['showUpcomingChanges'] !== showUpcomingChanges) {
      console.log('Feature flags have been changed, cleaning client cache.');
      const child = spawn('pnpm', ['run', '-w', 'clean:client']);
      child.stdout.setEncoding('utf8');
      child.stdout.on('data', function (data) {
        console.log(data);
      });
      child.on('error', err => {
        console.error(err);
      });
    }
  }
}

fs.writeFileSync(`${configPath}/env.json`, JSON.stringify(env));
