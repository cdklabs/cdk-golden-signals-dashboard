# CloudWatch Golden Signals Dashboard AWS CDK Construct
Create Amazon CloudWatch Dashboards for monitoring CloudWatch Metrics of AWS Resources partitioned in golden signals. *Latency, Traffic, Errors, Saturation*

You can create tag based CloudWatch dashbord solution out of the box using this construct! [Here](https://github.com/cdklabs/cdk-golden-signals-dashboard/tree/main/dashboard-images) are some screen captures of CloudWatch dashboards created using this cdk construct.

# Supported Resource Types
 * AWS::DynamoDB::Table
 * AWS::Lambda::Function
 * AWS::RDS::DBInstance
 * AWS::SNS::Topic
 * AWS::AutoScaling::AutoScalingGroup

# Usage
<summary>Including in a CDK application</summary>

```typescript
import { App, StackProps } from 'aws-cdk-lib';
import { GoldenSignalDashboard } from 'cdk-golden-signals-dashboard';

class MyStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);
    new GoldenSignalDashboard(this, 'dynamodbDashboard', {
      resourceType: 'AWS::DynamoDB::Table',
      dashboardName: 'myGSDashboard',
      resourceDimensions: [{resourceRegion : 'us-east-1', resources: ['Table1', 'Table2']}],
      createAlarms: true,
    });
  }
}
const app = new App();
new MyStack(app, 'golden-signals-sample-app-dev');
app.synth();
```


# Contributing

See [CONTRIBUTING](./CONTRIBUTING.md) for more information.

# License Summary
This project is licensed under the Apache-2.0 License. See the [LICENSE](LICENSE) file for our project's licensing.