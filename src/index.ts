// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { ResourceProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { AutoScalingDashboard } from "./autoscaling";
import { dashboardConstants } from "./constants";
import { DynamodbDashboard } from "./dynamodb";
import { LambdaDashboard } from "./lambda";
import { RDSDashboard } from "./rds";
import { SNSDashboard } from "./sns";

export interface CdkGSDashboardResourceProps extends ResourceProps {
  readonly resourceRegion: string;
  readonly resources: string[];
}

export interface CdkGoldenSignalDashboardProps extends ResourceProps {
  readonly dashboardName: string;
  readonly resourceType: string;
  readonly resourceDimensions: CdkGSDashboardResourceProps[];
  /**
   * If you want to create reasonable CloudWatch Alarms for the resources.
   * @default false
   */
  readonly createAlarms?: boolean;
  /**
   * If you want to see insights metrics for the resources on dashboard.
   * Currently only lambda insights metrices are supported.
   * @default true
   */
  readonly showInsightsMetrics?: boolean;
  /**
   * If you want to create dashboards with no live AWS resources
   * @default false
   */
  readonly createEmptyDashboard?: boolean;
}

export class GoldenSignalDashboard extends Construct {
  public readonly goldenSignalDashboardArn: string;

  constructor(
    scope: Construct,
    id: string,
    props: CdkGoldenSignalDashboardProps,
  ) {
    super(scope, id);
    this.goldenSignalDashboardArn = "";

    let allResources: string[] = [];
    for (let region of props.resourceDimensions) {
      allResources = allResources.concat(region.resources);
    }

    let createEmptyDashboard: boolean = props.createEmptyDashboard
      ? props.createEmptyDashboard
      : false;
    if (allResources.length == 0 && createEmptyDashboard == true) {
      props.resourceDimensions.push({
        resourceRegion: dashboardConstants.REGION,
        resources: dashboardConstants.DUMMY_RESOURCES,
      });
    }

    if (allResources.length > 0 || createEmptyDashboard == true) {
      switch (props.resourceType) {
        case "AWS::DynamoDB::Table": {
          let outputDashboard = new DynamodbDashboard(
            this,
            "dynamodbDashboard",
            {
              dashboardName: props.dashboardName,
              tableNames: props.resourceDimensions,
              createAlarms: props.createAlarms,
            },
          );
          this.goldenSignalDashboardArn = outputDashboard.dashboardArn;
          break;
        }
        case "AWS::Lambda::Function": {
          let outputDashboard = new LambdaDashboard(this, "lambdaDashboard", {
            dashboardName: props.dashboardName,
            functionNames: props.resourceDimensions,
            createAlarms: props.createAlarms,
            showInsightsMetrics: props.showInsightsMetrics,
          });
          this.goldenSignalDashboardArn = outputDashboard.dashboardArn;
          break;
        }
        case "AWS::RDS::DBInstance": {
          let outputDashboard = new RDSDashboard(this, "rdsDashboard", {
            dashboardName: props.dashboardName,
            dbInstanceIdentifiers: props.resourceDimensions,
            createAlarms: props.createAlarms,
          });
          this.goldenSignalDashboardArn = outputDashboard.dashboardArn;
          break;
        }
        case "AWS::SNS::Topic": {
          let outputDashboard = new SNSDashboard(this, "snsDashboard", {
            dashboardName: props.dashboardName,
            topicNames: props.resourceDimensions,
            createAlarms: props.createAlarms,
          });
          this.goldenSignalDashboardArn = outputDashboard.dashboardArn;
          break;
        }
        case "AWS::AutoScaling::AutoScalingGroup": {
          let outputDashboard = new AutoScalingDashboard(this, "asgDashboard", {
            dashboardName: props.dashboardName,
            autoScalingGroupNames: props.resourceDimensions,
            createAlarms: props.createAlarms,
          });
          this.goldenSignalDashboardArn = outputDashboard.dashboardArn;
          break;
        }
        default: {
          throw new Error("Provided Resource Type is Not Supported");
        }
      }
    }
  }
}
