import {
  CdklabsConstructLibrary,
  JsiiLanguage,
} from 'cdklabs-projen-project-types';
import { DependencyType, JsonFile, github } from 'projen';
const project = new CdklabsConstructLibrary({
  cdkVersion: '2.189.1',
  setNodeEngineVersion: false,
  private: false,
  name: 'cdk-golden-signals-dashboard',
  description:
    'A construct library that creates CloudWatch Dashboards of AWS Service Golden Signals',
  keywords: [
    'aws',
    'aws-cdk',
    'constructs',
    'golden-signals',
    'cloudwatch',
    'dashboard',
  ],
  projenrcTs: true,
  license: 'Apache-2.0',
  stability: 'experimental',

  repositoryUrl: 'https://github.com/cdklabs/cdk-golden-signals-dashboard.git',
  defaultReleaseBranch: 'main',
  author: 'AWS',
  authorAddress: 'aws-cdk-dev@amazon.com',
  authorOrganization: true,

  minNodeVersion: '16.16.0',
  jsiiVersion: '5.1.x',

  rosettaOptions: {
    strict: false,
  },
  majorVersion: 1,
  npmignoreEnabled: true,

  devDeps: ['eslint-plugin-security', 'natural-compare-lite'],
  eslintOptions: { prettier: true, dirs: ['src', 'projenrc'] },

  pullRequestTemplateContents: [
    '',
    '----',
    '',
    '*By submitting this pull request, I confirm that my contribution is made under the terms of the Apache-2.0 license*',
  ],
  enablePRAutoMerge: true,
  releaseToNpm: true,
  cdklabsPublishingDefaults: false,

  jsiiTargetLanguages: [
    JsiiLanguage.PYTHON,
    JsiiLanguage.DOTNET,
    JsiiLanguage.JAVA,
  ],
  // jsii publishing
  publishToPypi: {
    distName: 'cdk-golden-signals-dashboard',
    module: 'cdk-golden-signals-dashboard',
  },
  publishToNuget: {
    packageId: 'Cdklabs.GoldenSignalsDashboard',
    dotNetNamespace: 'Cdklabs.GoldenSignalsDashboard',
  },
  publishToMaven: {
    mavenGroupId: 'io.github.cdklabs',
    javaPackage: 'io.github.cdklabs.goldensignalsdashboard',
    mavenArtifactId: 'goldensignalsdashboard',
    mavenServerId: 'central-ossrh',
  },

  autoApproveOptions: {
    allowedUsernames: ['cdklabs-automation', 'jekzvadaria'],
    secret: 'GITHUB_TOKEN',
  },
  autoApproveUpgrades: true,

  depsUpgradeOptions: {
    workflowOptions: {
      labels: ['auto-approve'],
      projenCredentials: github.GithubCredentials.fromPersonalAccessToken({
        secret: 'PROJEN_GITHUB_TOKEN',
      }),
    },
  },

  jestOptions: {
    jestConfig: {
      // Ensure we don't try to parallelize too much, this causes timeouts.
      maxConcurrency: 2,
      moduleNameMapper: {
        '../package.json': '<rootDir>/package.json',
      },
    },
  },

  prettier: true,
  prettierOptions: {
    settings: {
      singleQuote: true,
    },
  },
});

// trick projen so that it doesn't override the version in package.json
project.tasks.addEnvironment('RELEASE', '1');

project.eslint?.addExtends('plugin:security/recommended');
const common_exclude = [
  'cdk.out',
  'cdk.context.json',
  'yarn-error.log',
  'coverage',
  'venv',
  'node_modules',
  '.DS_Store',
];
project.deps.addDependency(
  '@aws-cdk/integ-tests-alpha@2.41.0-alpha.0',
  DependencyType.TEST,
);
new JsonFile(project, 'test/integ/tsconfig.json', {
  obj: {
    extends: '../../tsconfig.dev.json',
    include: ['./**/integ.*.ts'],
  },
});
project.gitignore.exclude(...common_exclude);
project.npmignore!.exclude(...common_exclude, 'image');
project.synth();
