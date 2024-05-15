// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

const dashboardConstants = {
  REGION: 'us-east-1',
  TITLE_MARKDOWN:
    '# SERVICE_NAME-GoldenSignals\n **NOTICE: THIS DASHBOARD IS CREATED BY CDK CONSTRUCT, DO NOT MODIFY FOR CONSISTENT BEHAVIOUR.** ',
  TITLE_REGEX: /SERVICE_NAME/g,
  LATENCY_MARKDOWN: '## Latency',
  ERROR_MARKDOWN: '## Error',
  SATURATION_MARKDOWN: '## Saturation',
  TRAFFIC_MARKDOWN: '## Traffic',
  DUMMY_RESOURCES: ['DummyResource1'],
};

const dynamodbConstants = {
  DYNAMODB_TITLE_MARKDOWN:
    'Visit AWS Docs to understand [DynamoDB metrics](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/metrics-dimensions.html)',
  NAMESPACE: 'AWS/DynamoDB',
  LABEL: '${PROP("Dim.TableName")}',
  METRIC_DURATION_MINUTES: 1,
  TABLE_HEADER: 'Table | Dynamodb Contributor Insights Dashboard\n----|-----\n',
  TABLE_LINK_ROW:
    '[Table_Name](https://us-east-1.console.aws.amazon.com/dynamodbv2/home?region=us-east-1#table?name=Table_Name&tab=monitoring) | [link](https://us-east-1.console.aws.amazon.com/cloudwatch/home?region=us-east-1#contributor-insights:rules)\n',
};

const lambdaConstants = {
  LAMBDA_TITLE_MARKDOWN:
    'Visit AWS Docs to understand [Lambda metrics](https://docs.aws.amazon.com/lambda/latest/dg/monitoring-metrics.html)',
  NAMESPACE: 'AWS/Lambda',
  LABEL: '${PROP("Dim.FunctionName")}',
  METRIC_DURATION_MINUTES: 1,
  TABLE_HEADER: 'Function | Insight Dashboard\n----|-----\n',
  TABLE_LINK_ROW:
    '[Function_Name](https://us-east-1.console.aws.amazon.com/lambda/home?region=us-east-1#/functions/Function_Name?tab=monitoring) | [link](https://us-east-1.console.aws.amazon.com/cloudwatch/home?region=us-east-1#lambda-insights:functions/Function_Name)\n',
  LAMBDA_INSIGHTS_MARKDOWN:
    '## Lambda Insights Metrics: Insight Dashboard links: ',
  LAMBDA_INSIGHTS_NAMESPACE: 'LambdaInsights',
  LAMBDA_INSIGHTS_LABEL: '${PROP("Dim.function_name")}',
  LAMBDA_INSIGHT_DASHBOARD_MARKDOWN:
    '[us-east-1](https://us-east-1.console.aws.amazon.com/cloudwatch/home?region=us-east-1#lambda-insights:performance) ',
};

const rdsConstants = {
  RDS_TITLE_MARKDOWN:
    'Visit AWS Docs to understand [RDS metrics](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-metrics.html)',
  NAMESPACE: 'AWS/RDS',
  LABEL: '${PROP("Dim.DBInstanceIdentifier")}',
  METRIC_DURATION_MINUTES: 1,
  TABLE_HEADER:
    'DatabaseInstance | Performance Insights Dashboard\n----|-----\n',
  TABLE_LINK_ROW:
    '[Database_Identifier](https://us-east-1.console.aws.amazon.com/rds/home?region=us-east-1#database:id=Database_Identifier;is-cluster=false;tab=monitoring) | [link](https://us-east-1.console.aws.amazon.com/rds/home?region=us-east-1#performance-insights-v20206:)\n',
};

const snsConstants = {
  SNS_TITLE_MARKDOWN:
    'Visit AWS Docs to understand [SNS metrics](https://docs.aws.amazon.com/sns/latest/dg/sns-monitoring-using-cloudwatch.html)',
  NAMESPACE: 'AWS/SNS',
  LABEL: '${PROP("Dim.TopicName")}',
  METRIC_DURATION_MINUTES: 1,
};

const asgConstants = {
  ASG_TITLE_MARKDOWN:
    'Visit AWS Docs to understand [ASG metrics](https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-cloudwatch-monitoring.html)',
  NAMESPACE: 'AWS/AutoScaling',
  LABEL: '${PROP("Dim.AutoScalingGroupName")}',
  METRIC_DURATION_MINUTES: 1,
  TABLE_HEADER:
    'AutoScaling Group Info | ASG Monitoring Dashboard\n----|-----\n',
  TABLE_LINK_ROW:
    '[ASG_NAME](https://us-east-1.console.aws.amazon.com/ec2/home?region=us-east-1#AutoScalingGroupDetails:id=ASG_NAME;view=details) | [link](https://us-east-1.console.aws.amazon.com/ec2/home?region=us-east-1#AutoScalingGroupDetails:id=ASG_NAME;view=monitoring)\n',
};

export {
  dashboardConstants,
  dynamodbConstants,
  lambdaConstants,
  rdsConstants,
  snsConstants,
  asgConstants,
};
