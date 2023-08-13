import { Stack, StackProps, App } from "aws-cdk-lib";
import { GoldenSignalDashboard } from "./index";

export class DashboardStack extends Stack {
  constructor(scope: App, id: string, props: StackProps) {
    super(scope, id, props);

    new GoldenSignalDashboard(this, "dynamodb", {
      resourceType: "AWS::DynamoDB::Table",
      dashboardName: "dynamodbDashboard",
      resourceDimensions: [
        {
          resourceRegion: "us-east-1",
          resources: ["ProductCatalog", "Reply", "Forum", "Thread"],
        },
        { resourceRegion: "eu-west-1", resources: ["eu-west-1-table"] },
      ],
      createAlarms: true,
    });

    new GoldenSignalDashboard(this, "lambda", {
      resourceType: "AWS::Lambda::Function",
      dashboardName: "lambdaDashboard",
      resourceDimensions: [
        {
          resourceRegion: "us-east-1",
          resources: [
            "ErrorRateLambda",
            "cwsyn-petadoption-ui-canary-04868e64-24ab-47c1-8ca4-2be0a67d9a10",
            "cwsyn-pet-adoption-hb-d51ea3ff-9dd5-4892-8180-031c58adec62",
          ],
        },
        {
          resourceRegion: "eu-west-1",
          resources: ["eu-west-1-function2", "eu-west-1-function1"],
        },
      ],
      createAlarms: true,
      showInsightsMetrics: true,
    });

    new GoldenSignalDashboard(this, "rds", {
      resourceType: "AWS::RDS::DBInstance",
      dashboardName: "rdsDashboard",
      resourceDimensions: [
        { resourceRegion: "us-east-1", resources: ["database-1"] },
        { resourceRegion: "us-east-2", resources: ["testDatabase3"] },
      ],
      createAlarms: true,
    });

    new GoldenSignalDashboard(this, "sns", {
      resourceType: "AWS::SNS::Topic",
      dashboardName: "snsDashboard",
      resourceDimensions: [
        {
          resourceRegion: "us-east-1",
          resources: ["testTopic1", "testTopic2"],
        },
        { resourceRegion: "us-east-2", resources: ["testTopic3"] },
      ],
      createAlarms: true,
    });

    new GoldenSignalDashboard(this, "asg", {
      resourceType: "AWS::AutoScaling::AutoScalingGroup",
      dashboardName: "asgDashboard",
      resourceDimensions: [
        { resourceRegion: "us-east-1", resources: ["Test"] },
        { resourceRegion: "us-east-2", resources: ["testASG3"] },
      ],
      createAlarms: true,
    });
  }
}

const app = new App();
const environment = {
  account: process.env.AWS_ACCOUNT,
  region: process.env.AWS_REGION,
};
new DashboardStack(app, "GoldenSignalDashboards", { env: environment });
