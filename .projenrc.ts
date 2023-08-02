import { CdklabsConstructLibrary } from "cdklabs-projen-project-types";
const project = new CdklabsConstructLibrary({
  author: "AWS",
  authorAddress: "aws-cdk-dev@amazon.com",
  cdkVersion: "2.1.0",
  defaultReleaseBranch: "main",
  devDeps: ["cdklabs-projen-project-types"],
  name: "cdk-golden-signals-dashboard",
  projenrcTs: true,
  release: false,
  repositoryUrl: "https://github.com/cdklabs/cdk-golden-signals-dashboard.git",

  // deps: [],                /* Runtime dependencies of this module. */
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  // packageName: undefined,  /* The "name" in package.json. */
});
project.synth();