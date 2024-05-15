// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { ResourceProps, Token, Duration } from 'aws-cdk-lib';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import { IMetric } from 'aws-cdk-lib/aws-cloudwatch';
import { Construct } from 'constructs';
import { snsConstants, dashboardConstants } from './constants';
import { CdkGSDashboardResourceProps } from './index';
import * as utilities from './utilities';

export interface CdkSNSDashboardProps extends ResourceProps {
  readonly dashboardName: string;
  readonly topicNames: CdkGSDashboardResourceProps[];
  /**
   * If you want to create reasonable CloudWatch Alarms for the resources.
   * @default false
   */
  readonly createAlarms?: boolean;
}

export class SNSDashboard extends Construct {
  public readonly dashboardArn: string;

  constructor(scope: Construct, id: string, props: CdkSNSDashboardProps) {
    super(scope, id);

    const snsDashboard = new cloudwatch.Dashboard(this, 'MyDashboard', {
      dashboardName: props.dashboardName,
      end: 'end',
      periodOverride: cloudwatch.PeriodOverride.AUTO,
      start: 'start',
      widgets: [],
    });

    const titleWidget = new cloudwatch.TextWidget({
      markdown:
        dashboardConstants.TITLE_MARKDOWN.replace(
          dashboardConstants.TITLE_REGEX,
          'SNS',
        ) + snsConstants.SNS_TITLE_MARKDOWN,
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

    let numberOfNotificationsDeliveredMetricList: IMetric[] = [];
    let numberOfNotificationsFailedMetricList: IMetric[] = [];
    let numberOfMessagesPublishedMetricList: IMetric[] = [];
    let publishSizeMetricList: IMetric[] = [];
    let smsSuccessRateMetricList: IMetric[] = [];

    for (let entry of props.topicNames) {
      let topics: string[] = entry.resources;
      for (let t of topics) {
        let topic = Token.asString(t);
        let colorHex = utilities.getRandomColor();

        const metricPeriod: Duration = Duration.minutes(
          snsConstants.METRIC_DURATION_MINUTES,
        );

        numberOfNotificationsDeliveredMetricList.push(
          new cloudwatch.Metric({
            namespace: snsConstants.NAMESPACE,
            metricName: 'NumberOfNotificationsDelivered',
            label: snsConstants.LABEL,
            period: metricPeriod,
            dimensionsMap: {
              TopicName: topic,
            },
            statistic: cloudwatch.Statistic.SUM,
            color: colorHex,
            region: entry.resourceRegion,
          }),
        );
        numberOfMessagesPublishedMetricList.push(
          new cloudwatch.Metric({
            namespace: snsConstants.NAMESPACE,
            metricName: 'NumberOfMessagesPublished',
            label: snsConstants.LABEL,
            period: metricPeriod,
            dimensionsMap: {
              TopicName: topic,
            },
            statistic: cloudwatch.Statistic.SUM,
            color: colorHex,
            region: entry.resourceRegion,
          }),
        );
        publishSizeMetricList.push(
          new cloudwatch.Metric({
            namespace: snsConstants.NAMESPACE,
            metricName: 'PublishSize',
            label: snsConstants.LABEL,
            period: metricPeriod,
            dimensionsMap: {
              TopicName: topic,
            },
            statistic: cloudwatch.Statistic.AVERAGE,
            color: colorHex,
            region: entry.resourceRegion,
          }),
        );
        smsSuccessRateMetricList.push(
          new cloudwatch.Metric({
            namespace: snsConstants.NAMESPACE,
            metricName: 'SMSSuccessRate',
            label: snsConstants.LABEL,
            period: metricPeriod,
            dimensionsMap: {
              TopicName: topic,
            },
            statistic: cloudwatch.Statistic.SUM,
            color: colorHex,
            region: entry.resourceRegion,
          }),
        );
        numberOfNotificationsFailedMetricList.push(
          new cloudwatch.Metric({
            namespace: snsConstants.NAMESPACE,
            metricName: 'NumberOfNotificationsFailed',
            label: snsConstants.LABEL,
            period: metricPeriod,
            dimensionsMap: {
              TopicName: topic,
            },
            statistic: cloudwatch.Statistic.SUM,
            color: colorHex,
            region: entry.resourceRegion,
          }),
        );
      }
    }

    const numberOfNotificationsDeliveredWidget = new cloudwatch.GraphWidget({
      title: 'NumberOfNotificationsDelivered: Sum',
      left: numberOfNotificationsDeliveredMetricList,
      height: 6,
      width: 4,
      leftYAxis: { label: 'Count', showUnits: false },
    });

    const numberOfMessagesPublishedWidget = new cloudwatch.GraphWidget({
      title: 'NumberOfMessagesPublished: Sum',
      left: numberOfMessagesPublishedMetricList,
      height: 6,
      width: 4,
      leftYAxis: { label: 'Count', showUnits: false },
    });

    const publishSizeWidget = new cloudwatch.GraphWidget({
      title: 'PublishSize: Average',
      left: publishSizeMetricList,
      height: 6,
      width: 4,
      leftYAxis: { label: 'Bytes', showUnits: false },
    });

    const smsSuccessRateWidget = new cloudwatch.GraphWidget({
      title: 'SMSSuccessRate: Sum',
      left: smsSuccessRateMetricList,
      height: 6,
      width: 6,
      leftYAxis: { label: 'Count', showUnits: false },
    });

    const numberOfNotificationsFailedWidget = new cloudwatch.GraphWidget({
      title: 'NumberOfNotificationsFailed: Sum',
      left: numberOfNotificationsFailedMetricList,
      height: 6,
      width: 6,
      leftYAxis: { label: 'Count', showUnits: false },
    });

    const spacer = new cloudwatch.Spacer({
      height: 6,
      width: 12,
    });

    const firstHeadingRaw = new cloudwatch.Row(errorWidget, latencyWidget);
    const seconHeadingdRaw = new cloudwatch.Row(
      saturationWidget,
      trafficWidget,
    );
    const firstWidgetRaw = new cloudwatch.Row(
      smsSuccessRateWidget,
      numberOfNotificationsFailedWidget,
    );
    const secondWidgetRaw = new cloudwatch.Row(
      spacer,
      numberOfNotificationsDeliveredWidget,
      numberOfMessagesPublishedWidget,
      publishSizeWidget,
    );
    snsDashboard.addWidgets(
      titleWidget,
      firstHeadingRaw,
      firstWidgetRaw,
      seconHeadingdRaw,
      secondWidgetRaw,
    );

    this.dashboardArn = snsDashboard.dashboardArn;
  }
}
