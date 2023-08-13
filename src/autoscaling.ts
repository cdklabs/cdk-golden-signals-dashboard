// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { ResourceProps, Token, Duration } from "aws-cdk-lib";
import * as cloudwatch from "aws-cdk-lib/aws-cloudwatch";
import { IMetric } from "aws-cdk-lib/aws-cloudwatch";
import { Construct } from "constructs";
import { asgConstants, dashboardConstants } from "./constants";
import { CdkGSDashboardResourceProps } from "./index";
import * as utilities from "./utilities";

export interface CdkAutoScalingDashboardProps extends ResourceProps {
  readonly dashboardName: string;
  readonly autoScalingGroupNames: CdkGSDashboardResourceProps[];
  /**
   * If you want to create reasonable CloudWatch Alarms for the resources.
   * @default false
   */
  readonly createAlarms?: boolean;
}

export class AutoScalingDashboard extends Construct {
  public readonly dashboardArn: string;

  constructor(
    scope: Construct,
    id: string,
    props: CdkAutoScalingDashboardProps,
  ) {
    super(scope, id);

    const asgDashboard = new cloudwatch.Dashboard(this, "MyDashboard", {
      dashboardName: props.dashboardName,
      end: "end",
      periodOverride: cloudwatch.PeriodOverride.AUTO,
      start: "start",
      widgets: [],
    });

    const titleWidget = new cloudwatch.TextWidget({
      markdown:
        dashboardConstants.TITLE_MARKDOWN.replace(
          dashboardConstants.TITLE_REGEX,
          "AutoScaling",
        ) + asgConstants.ASG_TITLE_MARKDOWN,
      height: 2,
      width: 24,
    });

    const errorWidget = new cloudwatch.TextWidget({
      markdown: dashboardConstants.ERROR_MARKDOWN,
      height: 1,
      width: 12,
    });

    const latencyWidget = new cloudwatch.TextWidget({
      markdown: dashboardConstants.LATENCY_MARKDOWN,
      height: 1,
      width: 12,
    });

    const saturationWidget = new cloudwatch.TextWidget({
      markdown: dashboardConstants.SATURATION_MARKDOWN,
      height: 1,
      width: 12,
    });

    const trafficWidget = new cloudwatch.TextWidget({
      markdown: dashboardConstants.TRAFFIC_MARKDOWN,
      height: 1,
      width: 12,
    });

    let groupInServiceInstancesMetricList: IMetric[] = [];
    let groupStandbyInstancesMetricList: IMetric[] = [];
    let groupTotalInstancesMetricList: IMetric[] = [];
    let groupDesiredCapacityMetricList: IMetric[] = [];
    let groupPendingInstancesMetricList: IMetric[] = [];
    let groupTerminatingInstancesMetricList: IMetric[] = [];
    let groupTotalCapacityMetricList: IMetric[] = [];
    let groupStandbyCapacityMetricList: IMetric[] = [];
    let warmPoolTotalCapacityMetricList: IMetric[] = [];
    let groupAndWarmPoolDesiredCapacityMetricList: IMetric[] = [];
    let warmPoolPendingCapacityMetricList: IMetric[] = [];
    let asgLinksMarkdown: string = "";

    for (let entry of props.autoScalingGroupNames) {
      let asgNames: string[] = entry.resources;
      for (let group of asgNames) {
        let asg = Token.asString(group);
        let colorHex = utilities.getRandomColor();

        asgLinksMarkdown += asgConstants.TABLE_LINK_ROW.replace(
          /\bus-east-1\b/g,
          entry.resourceRegion,
        ).replace(/\bASG_NAME\b/g, asg);

        const metricPeriod: Duration = Duration.minutes(
          asgConstants.METRIC_DURATION_MINUTES,
        );

        groupInServiceInstancesMetricList.push(
          new cloudwatch.Metric({
            namespace: asgConstants.NAMESPACE,
            metricName: "GroupInServiceInstances",
            label: asgConstants.LABEL,
            period: metricPeriod,
            dimensionsMap: {
              AutoScalingGroupName: asg,
            },
            statistic: cloudwatch.Statistic.AVERAGE,
            color: colorHex,
            region: entry.resourceRegion,
          }),
        );
        groupStandbyInstancesMetricList.push(
          new cloudwatch.Metric({
            namespace: asgConstants.NAMESPACE,
            metricName: "GroupStandbyInstances",
            label: asgConstants.LABEL,
            period: metricPeriod,
            dimensionsMap: {
              AutoScalingGroupName: asg,
            },
            statistic: cloudwatch.Statistic.AVERAGE,
            color: colorHex,
            region: entry.resourceRegion,
          }),
        );
        groupTotalInstancesMetricList.push(
          new cloudwatch.Metric({
            namespace: asgConstants.NAMESPACE,
            metricName: "GroupTotalInstances",
            label: asgConstants.LABEL,
            period: metricPeriod,
            dimensionsMap: {
              AutoScalingGroupName: asg,
            },
            statistic: cloudwatch.Statistic.AVERAGE,
            color: colorHex,
            region: entry.resourceRegion,
          }),
        );
        groupDesiredCapacityMetricList.push(
          new cloudwatch.Metric({
            namespace: asgConstants.NAMESPACE,
            metricName: "GroupDesiredCapacity",
            label: asgConstants.LABEL,
            period: metricPeriod,
            dimensionsMap: {
              AutoScalingGroupName: asg,
            },
            statistic: cloudwatch.Statistic.AVERAGE,
            color: colorHex,
            region: entry.resourceRegion,
          }),
        );
        groupPendingInstancesMetricList.push(
          new cloudwatch.Metric({
            namespace: asgConstants.NAMESPACE,
            metricName: "GroupPendingInstances",
            label: asgConstants.LABEL,
            period: metricPeriod,
            dimensionsMap: {
              AutoScalingGroupName: asg,
            },
            statistic: cloudwatch.Statistic.AVERAGE,
            color: colorHex,
            region: entry.resourceRegion,
          }),
        );
        groupTerminatingInstancesMetricList.push(
          new cloudwatch.Metric({
            namespace: asgConstants.NAMESPACE,
            metricName: "GroupTerminatingInstances",
            label: asgConstants.LABEL,
            period: metricPeriod,
            dimensionsMap: {
              AutoScalingGroupName: asg,
            },
            statistic: cloudwatch.Statistic.AVERAGE,
            color: colorHex,
            region: entry.resourceRegion,
          }),
        );
        groupTotalCapacityMetricList.push(
          new cloudwatch.Metric({
            namespace: asgConstants.NAMESPACE,
            metricName: "GroupTotalCapacity",
            label: asgConstants.LABEL,
            period: metricPeriod,
            dimensionsMap: {
              AutoScalingGroupName: asg,
            },
            statistic: cloudwatch.Statistic.AVERAGE,
            color: colorHex,
            region: entry.resourceRegion,
          }),
        );
        groupStandbyCapacityMetricList.push(
          new cloudwatch.Metric({
            namespace: asgConstants.NAMESPACE,
            metricName: "GroupStandbyCapacity",
            label: asgConstants.LABEL,
            period: metricPeriod,
            dimensionsMap: {
              AutoScalingGroupName: asg,
            },
            statistic: cloudwatch.Statistic.AVERAGE,
            color: colorHex,
            region: entry.resourceRegion,
          }),
        );
        warmPoolTotalCapacityMetricList.push(
          new cloudwatch.Metric({
            namespace: asgConstants.NAMESPACE,
            metricName: "WarmPoolTotalCapacity",
            label: asgConstants.LABEL,
            period: metricPeriod,
            dimensionsMap: {
              AutoScalingGroupName: asg,
            },
            statistic: cloudwatch.Statistic.AVERAGE,
            color: colorHex,
            region: entry.resourceRegion,
          }),
        );
        groupAndWarmPoolDesiredCapacityMetricList.push(
          new cloudwatch.Metric({
            namespace: asgConstants.NAMESPACE,
            metricName: "GroupAndWarmPoolDesiredCapacity",
            label: asgConstants.LABEL,
            period: metricPeriod,
            dimensionsMap: {
              AutoScalingGroupName: asg,
            },
            statistic: cloudwatch.Statistic.AVERAGE,
            color: colorHex,
            region: entry.resourceRegion,
          }),
        );
        warmPoolPendingCapacityMetricList.push(
          new cloudwatch.Metric({
            namespace: asgConstants.NAMESPACE,
            metricName: "WarmPoolPendingCapacity",
            label: asgConstants.LABEL,
            period: metricPeriod,
            dimensionsMap: {
              AutoScalingGroupName: asg,
            },
            statistic: cloudwatch.Statistic.AVERAGE,
            color: colorHex,
            region: entry.resourceRegion,
          }),
        );
      }
    }

    const groupInServiceInstancesWidget = new cloudwatch.GraphWidget({
      title: "GroupInServiceInstances: Average",
      left: groupInServiceInstancesMetricList,
      height: 6,
      width: 6,
      leftYAxis: { label: "Count", showUnits: false },
    });
    const groupStandbyInstancesWidget = new cloudwatch.GraphWidget({
      title: "GroupStandbyInstances: Average",
      left: groupStandbyInstancesMetricList,
      height: 6,
      width: 4,
      leftYAxis: { label: "Count", showUnits: false },
    });
    const groupTotalInstancesWidget = new cloudwatch.GraphWidget({
      title: "GroupTotalInstances: Average",
      left: groupTotalInstancesMetricList,
      height: 6,
      width: 6,
      leftYAxis: { label: "Count", showUnits: false },
    });
    const groupDesiredCapacityWidget = new cloudwatch.GraphWidget({
      title: "GroupDesiredCapacity: Average",
      left: groupDesiredCapacityMetricList,
      height: 6,
      width: 4,
      leftYAxis: { label: "Count", showUnits: false },
    });
    const groupPendingInstancesWidget = new cloudwatch.GraphWidget({
      title: "GroupPendingInstances: Average",
      left: groupPendingInstancesMetricList,
      height: 6,
      width: 4,
      leftYAxis: { label: "Count", showUnits: false },
    });
    const groupTerminatingInstancesWidget = new cloudwatch.GraphWidget({
      title: "GroupTerminatingInstances: Average",
      left: groupTerminatingInstancesMetricList,
      height: 6,
      width: 4,
      leftYAxis: { label: "Count", showUnits: false },
    });
    const groupTotalCapacityWidget = new cloudwatch.GraphWidget({
      title: "GroupTotalCapacity: Average",
      left: groupTotalCapacityMetricList,
      height: 6,
      width: 4,
      leftYAxis: { label: "Count", showUnits: false },
    });
    const groupStandbyCapacityWidget = new cloudwatch.GraphWidget({
      title: "GroupStandbyCapacity: Average",
      left: groupStandbyCapacityMetricList,
      height: 6,
      width: 4,
      leftYAxis: { label: "Count", showUnits: false },
    });
    const warmPoolTotalCapacityWidget = new cloudwatch.GraphWidget({
      title: "WarmPoolTotalCapacity: Average",
      left: warmPoolTotalCapacityMetricList,
      height: 6,
      width: 4,
      leftYAxis: { label: "Count", showUnits: false },
    });
    const groupAndWarmPoolDesiredCapacityWidget = new cloudwatch.GraphWidget({
      title: "GroupAndWarmPoolDesiredCapacity: Average",
      left: groupAndWarmPoolDesiredCapacityMetricList,
      height: 6,
      width: 4,
      leftYAxis: { label: "Count", showUnits: false },
    });
    const warmPoolPendingCapacityWidget = new cloudwatch.GraphWidget({
      title: "WarmPoolPendingCapacity: Average",
      left: warmPoolPendingCapacityMetricList,
      height: 6,
      width: 4,
      leftYAxis: { label: "Count", showUnits: false },
    });
    const tableWidget = new cloudwatch.TextWidget({
      markdown: asgConstants.TABLE_HEADER + asgLinksMarkdown,
      height: 1 + groupInServiceInstancesMetricList.length,
      width: 24,
    });

    const firstHeadingRaw = new cloudwatch.Row(errorWidget, latencyWidget);
    const seconHeadingdRaw = new cloudwatch.Row(
      saturationWidget,
      trafficWidget,
    );
    const firstWidgetRaw = new cloudwatch.Row(
      groupDesiredCapacityWidget,
      groupTotalCapacityWidget,
      groupStandbyCapacityWidget,
      groupInServiceInstancesWidget,
      groupTotalInstancesWidget,
    );
    const secondWidgetRaw = new cloudwatch.Row(
      warmPoolTotalCapacityWidget,
      groupAndWarmPoolDesiredCapacityWidget,
      warmPoolPendingCapacityWidget,
      groupStandbyInstancesWidget,
      groupPendingInstancesWidget,
      groupTerminatingInstancesWidget,
    );

    asgDashboard.addWidgets(
      titleWidget,
      firstHeadingRaw,
      seconHeadingdRaw,
      firstWidgetRaw,
      secondWidgetRaw,
      tableWidget,
    );
    this.dashboardArn = asgDashboard.dashboardArn;
  }
}
