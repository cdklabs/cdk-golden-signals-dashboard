import {
  CdklabsConstructLibrary,
  JsiiLanguage,
} from "cdklabs-projen-project-types";
import { DependencyType, JsonFile } from "projen";
const project = new CdklabsConstructLibrary({
  setNodeEngineVersion: false,
  stability: "experimental",
  private: false,
  author: "AWS",
  authorAddress: "aws-cdk-dev@amazon.com",
  projenrcTs: true,
  cdkVersion: "2.45.0",
  rosettaOptions: {
    strict: false,
  },
  defaultReleaseBranch: "main",
  name: "cdk-golden-signals-dashboard",
  release: false,
  majorVersion: 1,
  npmignoreEnabled: true,
  repositoryUrl: "https://github.com/cdklabs/cdk-golden-signals-dashboard.git",
  license: "Apache-2.0",
  devDeps: ["eslint-plugin-security", "natural-compare-lite"],
  eslintOptions: { prettier: true, dirs: ["src", "projenrc"] },
  jsiiTargetLanguages: [
    JsiiLanguage.PYTHON,
    JsiiLanguage.DOTNET,
    JsiiLanguage.JAVA,
  ],
  publishToPypi: {
    distName: "cdklabs.cdk-enterprise-iac",
    module: "cdklabs.cdk_enterprise_iac",
  },

  // deps: [],                /* Runtime dependencies of this module. */
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  // devDeps: [],             /* Build dependencies for this module. */
  // packageName: undefined,  /* The "name" in package.json. */
});
project.eslint?.addExtends("plugin:security/recommended");
const common_exclude = [
  "cdk.out",
  "cdk.context.json",
  "yarn-error.log",
  "coverage",
  "venv",
  "node_modules",
  ".DS_Store",
];
project.deps.addDependency(
  "@aws-cdk/integ-tests-alpha@2.41.0-alpha.0",
  DependencyType.TEST,
);
new JsonFile(project, "test/integ/tsconfig.json", {
  obj: {
    extends: "../../tsconfig.dev.json",
    include: ["./**/integ.*.ts"],
  },
});
project.gitignore.exclude(...common_exclude);
project.npmignore!.exclude(...common_exclude, "image");
project.synth();
