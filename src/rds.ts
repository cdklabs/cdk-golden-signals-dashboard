// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { ResourceProps, Token, Duration } from 'aws-cdk-lib';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import { IMetric } from 'aws-cdk-lib/aws-cloudwatch';
import { Construct } from 'constructs';
import { rdsConstants, dashboardConstants } from './constants';
import { CdkGSDashboardResourceProps } from './index';
import * as utilities from './utilities';

export interface CdkRDSDashboardProps extends ResourceProps {
  readonly dashboardName: string;
  readonly dbInstanceIdentifiers: CdkGSDashboardResourceProps[];
  /**
   * If you want to create reasonable CloudWatch Alarms for the resources.
   * @default false
   */
  readonly createAlarms?: boolean;
}

export class RDSDashboard extends Construct {
  public readonly dashboardArn: string;

  constructor(scope: Construct, id: string, props: CdkRDSDashboardProps) {
    super(scope, id);

    const rdsDashboard = new cloudwatch.Dashboard(this, 'MyDashboard', {
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
          'RDS',
        ) + rdsConstants.RDS_TITLE_MARKDOWN,
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

    let cpuUtilizationMetricList: IMetric[] = [];
    let freeStorageSpaceMetricList: IMetric[] = [];
    let databaseConnectionsMetricList: IMetric[] = [];
    let swapUsageMetricList: IMetric[] = [];
    let freeableMemoryMetricList: IMetric[] = [];
    let readLatencyMetricList: IMetric[] = [];
    let writeLatencyMetricList: IMetric[] = [];
    let diskQueueDepthMetricList: IMetric[] = [];
    let readThroughputMetricList: IMetric[] = [];
    let writeThroughputMetricList: IMetric[] = [];
    let readIOPSMetricList: IMetric[] = [];
    let writeIOPSMetricList: IMetric[] = [];
    let failedSQLServerAgentJobsCountMetricList: IMetric[] = [];
    let replicaLagMetricList: IMetric[] = [];
    let dbinstanceLinksMarkdown: string = '';

    for (let entry of props.dbInstanceIdentifiers) {
      let dbInstances: string[] = entry.resources;
      for (let i of dbInstances) {
        let dbInstance = Token.asString(i);
        let colorHex = utilities.getRandomColor();

        dbinstanceLinksMarkdown += rdsConstants.TABLE_LINK_ROW.replace(
          /\bus-east-1\b/g,
          entry.resourceRegion,
        ).replace(/\bDatabase_Identifier\b/g, dbInstance);

        // Metrics
        const metricPeriod: Duration = Duration.minutes(
          rdsConstants.METRIC_DURATION_MINUTES,
        );

        cpuUtilizationMetricList.push(
          new cloudwatch.Metric({
            namespace: rdsConstants.NAMESPACE,
            metricName: 'CPUUtilization',
            label: rdsConstants.LABEL,
            period: metricPeriod,
            dimensionsMap: {
              DBInstanceIdentifier: dbInstance,
            },
            statistic: cloudwatch.Statistic.AVERAGE,
            color: colorHex,
            region: entry.resourceRegion,
          }),
        );
        freeStorageSpaceMetricList.push(
          new cloudwatch.Metric({
            namespace: rdsConstants.NAMESPACE,
            metricName: 'FreeStorageSpace',
            label: rdsConstants.LABEL,
            period: metricPeriod,
            dimensionsMap: {
              DBInstanceIdentifier: dbInstance,
            },
            statistic: cloudwatch.Statistic.AVERAGE,
            color: colorHex,
            region: entry.resourceRegion,
          }),
        );
        databaseConnectionsMetricList.push(
          new cloudwatch.Metric({
            namespace: rdsConstants.NAMESPACE,
            metricName: 'DatabaseConnections',
            label: rdsConstants.LABEL,
            period: metricPeriod,
            dimensionsMap: {
              DBInstanceIdentifier: dbInstance,
            },
            statistic: cloudwatch.Statistic.SUM,
            color: colorHex,
            region: entry.resourceRegion,
          }),
        );
        swapUsageMetricList.push(
          new cloudwatch.Metric({
            namespace: rdsConstants.NAMESPACE,
            metricName: 'SwapUsage',
            label: rdsConstants.LABEL,
            period: metricPeriod,
            dimensionsMap: {
              DBInstanceIdentifier: dbInstance,
            },
            statistic: cloudwatch.Statistic.AVERAGE,
            color: colorHex,
            region: entry.resourceRegion,
          }),
        );
        freeableMemoryMetricList.push(
          new cloudwatch.Metric({
            namespace: rdsConstants.NAMESPACE,
            metricName: 'FreeableMemory',
            label: rdsConstants.LABEL,
            period: metricPeriod,
            dimensionsMap: {
              DBInstanceIdentifier: dbInstance,
            },
            statistic: cloudwatch.Statistic.AVERAGE,
            color: colorHex,
            region: entry.resourceRegion,
          }),
        );
        readLatencyMetricList.push(
          new cloudwatch.Metric({
            namespace: rdsConstants.NAMESPACE,
            metricName: 'ReadLatency',
            label: rdsConstants.LABEL,
            period: metricPeriod,
            dimensionsMap: {
              DBInstanceIdentifier: dbInstance,
            },
            statistic: cloudwatch.Statistic.AVERAGE,
            color: colorHex,
            region: entry.resourceRegion,
          }),
        );
        writeLatencyMetricList.push(
          new cloudwatch.Metric({
            namespace: rdsConstants.NAMESPACE,
            metricName: 'WriteLatency',
            label: rdsConstants.LABEL,
            period: metricPeriod,
            dimensionsMap: {
              DBInstanceIdentifier: dbInstance,
            },
            statistic: cloudwatch.Statistic.AVERAGE,
            color: colorHex,
            region: entry.resourceRegion,
          }),
        );
        diskQueueDepthMetricList.push(
          new cloudwatch.Metric({
            namespace: rdsConstants.NAMESPACE,
            metricName: 'DiskQueueDepth',
            label: rdsConstants.LABEL,
            period: metricPeriod,
            dimensionsMap: {
              DBInstanceIdentifier: dbInstance,
            },
            statistic: cloudwatch.Statistic.AVERAGE,
            color: colorHex,
            region: entry.resourceRegion,
          }),
        );
        readThroughputMetricList.push(
          new cloudwatch.Metric({
            namespace: rdsConstants.NAMESPACE,
            metricName: 'ReadThroughput',
            label: rdsConstants.LABEL,
            period: metricPeriod,
            dimensionsMap: {
              DBInstanceIdentifier: dbInstance,
            },
            statistic: cloudwatch.Statistic.AVERAGE,
            color: colorHex,
            region: entry.resourceRegion,
          }),
        );
        writeThroughputMetricList.push(
          new cloudwatch.Metric({
            namespace: rdsConstants.NAMESPACE,
            metricName: 'WriteThroughput',
            label: rdsConstants.LABEL,
            period: metricPeriod,
            dimensionsMap: {
              DBInstanceIdentifier: dbInstance,
            },
            statistic: cloudwatch.Statistic.AVERAGE,
            color: colorHex,
            region: entry.resourceRegion,
          }),
        );
        readIOPSMetricList.push(
          new cloudwatch.Metric({
            namespace: rdsConstants.NAMESPACE,
            metricName: 'ReadIOPS',
            label: rdsConstants.LABEL,
            period: metricPeriod,
            dimensionsMap: {
              DBInstanceIdentifier: dbInstance,
            },
            statistic: cloudwatch.Statistic.AVERAGE,
            color: colorHex,
            region: entry.resourceRegion,
          }),
        );
        writeIOPSMetricList.push(
          new cloudwatch.Metric({
            namespace: rdsConstants.NAMESPACE,
            metricName: 'WriteIOPS',
            label: rdsConstants.LABEL,
            period: metricPeriod,
            dimensionsMap: {
              DBInstanceIdentifier: dbInstance,
            },
            statistic: cloudwatch.Statistic.AVERAGE,
            color: colorHex,
            region: entry.resourceRegion,
          }),
        );
        failedSQLServerAgentJobsCountMetricList.push(
          new cloudwatch.Metric({
            namespace: rdsConstants.NAMESPACE,
            metricName: 'FailedSQLServerAgentJobsCount',
            label: rdsConstants.LABEL,
            period: metricPeriod,
            dimensionsMap: {
              DBInstanceIdentifier: dbInstance,
            },
            statistic: cloudwatch.Statistic.SUM,
            color: colorHex,
            region: entry.resourceRegion,
          }),
        );
        replicaLagMetricList.push(
          new cloudwatch.Metric({
            namespace: rdsConstants.NAMESPACE,
            metricName: 'ReplicaLag',
            label: rdsConstants.LABEL,
            period: metricPeriod,
            dimensionsMap: {
              DBInstanceIdentifier: dbInstance,
            },
            statistic: cloudwatch.Statistic.AVERAGE,
            color: colorHex,
            region: entry.resourceRegion,
          }),
        );
      }
    }

    const cpuUtilizationWidget = new cloudwatch.GraphWidget({
      title: 'CPUUtilization: Average',
      left: cpuUtilizationMetricList,
      height: 6,
      width: 6,
      leftYAxis: { label: 'Percent', showUnits: false },
    });
    const freeStorageSpaceWidget = new cloudwatch.GraphWidget({
      title: 'FreeStorageSpace: Average',
      left: freeStorageSpaceMetricList,
      height: 6,
      width: 4,
      leftYAxis: { label: 'Bytes', showUnits: false },
    });
    const databaseConnectionsWidget = new cloudwatch.GraphWidget({
      title: 'DatabaseConnections: Sum',
      left: databaseConnectionsMetricList,
      height: 6,
      width: 4,
      leftYAxis: { label: 'Count', showUnits: false },
    });
    const swapUsageWidget = new cloudwatch.GraphWidget({
      title: 'SwapUsage: Average',
      left: swapUsageMetricList,
      height: 6,
      width: 4,
      leftYAxis: { label: 'Bytes', showUnits: false },
    });
    const freeableMemoryWidget = new cloudwatch.GraphWidget({
      title: 'FreeableMemory: Average',
      left: freeableMemoryMetricList,
      height: 6,
      width: 6,
      leftYAxis: { label: 'Bytes', showUnits: false },
    });
    const readLatencyWidget = new cloudwatch.GraphWidget({
      title: 'ReadLatency: Average',
      left: readLatencyMetricList,
      height: 6,
      width: 6,
      leftYAxis: { label: 'Seconds', showUnits: false },
    });
    const writeLatencyWidget = new cloudwatch.GraphWidget({
      title: 'WriteLatency: Average',
      left: writeLatencyMetricList,
      height: 6,
      width: 6,
      leftYAxis: { label: 'Seconds', showUnits: false },
    });
    const diskQueueDepthWidget = new cloudwatch.GraphWidget({
      title: 'DiskQueueDepth: Average',
      left: diskQueueDepthMetricList,
      height: 6,
      width: 6,
      leftYAxis: { label: 'Count', showUnits: false },
    });
    const readThroughputWidget = new cloudwatch.GraphWidget({
      title: 'ReadThroughput: Average',
      left: readThroughputMetricList,
      height: 6,
      width: 6,
      leftYAxis: { label: 'Bytes/Second', showUnits: false },
    });
    const writeThroughputWidget = new cloudwatch.GraphWidget({
      title: 'WriteThroughput: Average',
      left: writeThroughputMetricList,
      height: 6,
      width: 6,
      leftYAxis: { label: 'Bytes/Second', showUnits: false },
    });
    const readIOPSWidget = new cloudwatch.GraphWidget({
      title: 'ReadIOPS: Average',
      left: readIOPSMetricList,
      height: 6,
      width: 6,
      leftYAxis: { label: 'Count/Second', showUnits: false },
    });
    const writeIOPSWidget = new cloudwatch.GraphWidget({
      title: 'WriteIOPS: Average',
      left: writeIOPSMetricList,
      height: 6,
      width: 6,
      leftYAxis: { label: 'Count/Second', showUnits: false },
    });
    const failedSQLServerAgentJobsCountWidget = new cloudwatch.GraphWidget({
      title: 'FailedSQLServerAgentJobsCount: Sum',
      left: failedSQLServerAgentJobsCountMetricList,
      height: 12,
      width: 12,
      leftYAxis: { label: 'Count', showUnits: false },
    });
    const replicaLagWidget = new cloudwatch.GraphWidget({
      title: 'ReplicaLag: Average',
      left: replicaLagMetricList,
      height: 6,
      width: 6,
      leftYAxis: { label: 'Seconds', showUnits: false },
    });
    const spacer = new cloudwatch.Spacer({
      height: 6,
      width: 12,
    });
    const tableWidget = new cloudwatch.TextWidget({
      markdown: rdsConstants.TABLE_HEADER + dbinstanceLinksMarkdown,
      height: 1 + cpuUtilizationMetricList.length,
      width: 24,
    });

    const firstHeadingRaw = new cloudwatch.Row(errorWidget, latencyWidget);
    const seconHeadingdRaw = new cloudwatch.Row(
      saturationWidget,
      trafficWidget,
    );
    const firstWidgetRaw = new cloudwatch.Row(
      failedSQLServerAgentJobsCountWidget,
      readLatencyWidget,
      writeLatencyWidget,
    );
    const secondWidgetRaw = new cloudwatch.Row(
      spacer,
      diskQueueDepthWidget,
      replicaLagWidget,
    );
    const thirdWidgetRaw = new cloudwatch.Row(
      cpuUtilizationWidget,
      freeableMemoryWidget,
      readThroughputWidget,
      writeThroughputWidget,
    );
    const fourthWidgetRaw = new cloudwatch.Row(
      freeStorageSpaceWidget,
      databaseConnectionsWidget,
      swapUsageWidget,
      readIOPSWidget,
      writeIOPSWidget,
    );

    rdsDashboard.addWidgets(
      titleWidget,
      firstHeadingRaw,
      firstWidgetRaw,
      secondWidgetRaw,
      seconHeadingdRaw,
      thirdWidgetRaw,
      fourthWidgetRaw,
      tableWidget,
    );
    this.dashboardArn = rdsDashboard.dashboardArn;
  }
}
