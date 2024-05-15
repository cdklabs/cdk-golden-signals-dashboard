// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as cdk from 'aws-cdk-lib';
import { GoldenSignalDashboard } from '../src/index';

test('Test Create', () => {
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'testing-stack-1');

  new GoldenSignalDashboard(stack, 'dynamodb', {
    resourceType: 'AWS::DynamoDB::Table',
    dashboardName: 'dynamodbDashboard',
    resourceDimensions: [
      { resourceRegion: 'us-east-1', resources: ['testTable1', 'testTable2'] },
      { resourceRegion: 'us-east-2', resources: ['testTable3'] },
    ],
    createAlarms: true,
  });

  new GoldenSignalDashboard(stack, 'lambda', {
    resourceType: 'AWS::Lambda::Function',
    dashboardName: 'lambdaDashboard',
    resourceDimensions: [
      {
        resourceRegion: 'us-east-1',
        resources: ['testFunction1', 'testFunction2'],
      },
      { resourceRegion: 'us-east-2', resources: ['testFunction3'] },
    ],
    createAlarms: true,
    showInsightsMetrics: true,
  });

  new GoldenSignalDashboard(stack, 'rds', {
    resourceType: 'AWS::RDS::DBInstance',
    dashboardName: 'rdsDashboard',
    resourceDimensions: [
      {
        resourceRegion: 'us-east-1',
        resources: ['testDatabase1', 'testDatabase2'],
      },
      { resourceRegion: 'us-east-2', resources: ['testDatabase3'] },
    ],
    createAlarms: true,
  });

  new GoldenSignalDashboard(stack, 'sns', {
    resourceType: 'AWS::SNS::Topic',
    dashboardName: 'snsDashboard',
    resourceDimensions: [
      { resourceRegion: 'us-east-1', resources: ['testTopic1', 'testTopic2'] },
      { resourceRegion: 'us-east-2', resources: ['testTopic3'] },
    ],
    createAlarms: true,
  });

  new GoldenSignalDashboard(stack, 'asg', {
    resourceType: 'AWS::AutoScaling::AutoScalingGroup',
    dashboardName: 'asgDashboard',
    resourceDimensions: [
      { resourceRegion: 'us-east-1', resources: ['testASG1', 'testASG2'] },
      { resourceRegion: 'us-east-2', resources: ['testASG3'] },
    ],
  });

  new GoldenSignalDashboard(stack, 'emptyDynamodb', {
    resourceType: 'AWS::DynamoDB::Table',
    dashboardName: 'emptyDynamodbDashboard',
    resourceDimensions: [],
    createEmptyDashboard: true,
  });

  new GoldenSignalDashboard(stack, 'emptyLambda', {
    resourceType: 'AWS::Lambda::Function',
    dashboardName: 'emptyLambdaDashboard',
    resourceDimensions: [],
    createEmptyDashboard: true,
  });

  new GoldenSignalDashboard(stack, 'emptyRDS', {
    resourceType: 'AWS::RDS::DBInstance',
    dashboardName: 'emptyRDSDashboard',
    resourceDimensions: [],
    createEmptyDashboard: true,
  });

  new GoldenSignalDashboard(stack, 'emptySNS', {
    resourceType: 'AWS::SNS::Topic',
    dashboardName: 'emptySNSDashboard',
    resourceDimensions: [],
    createEmptyDashboard: true,
  });

  new GoldenSignalDashboard(stack, 'emptyASG', {
    resourceType: 'AWS::AutoScaling::AutoScalingGroup',
    dashboardName: 'emptyASGDashboard',
    resourceDimensions: [],
    createEmptyDashboard: true,
  });
});

test('Test exception-1', () => {
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'testing-stack-3');
  expect(() => {
    new GoldenSignalDashboard(stack, 'service', {
      resourceType: 'AWS::service::resource',
      dashboardName: 'resourceDashboard',
      resourceDimensions: [
        { resourceRegion: 'us-east-1', resources: ['resource1', 'resource2'] },
      ],
      createEmptyDashboard: true,
    });
  }).toThrow(Error);
});
