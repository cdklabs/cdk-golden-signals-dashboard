// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { ResourceProps, Token, Duration, Stack } from 'aws-cdk-lib';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import { IMetric, IAlarm } from 'aws-cdk-lib/aws-cloudwatch';
import { Construct } from 'constructs';
import { dynamodbConstants, dashboardConstants } from './constants';
import { CdkGSDashboardResourceProps } from './index';
import * as utilities from './utilities';

export interface CdkDynamodbDashboardProps extends ResourceProps {
  readonly dashboardName: string;
  readonly tableNames: CdkGSDashboardResourceProps[];
  /**
   * If you want to create reasonable CloudWatch Alarms for the resources.
   * @default false
   */
  readonly createAlarms?: boolean;
}

export class DynamodbDashboard extends Construct {
  public readonly dashboardArn: string;

  constructor(scope: Construct, id: string, props: CdkDynamodbDashboardProps) {
    super(scope, id);

    const dynamodbDashboard = new cloudwatch.Dashboard(this, 'MyDashboard', {
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
          'DynamoDB',
        ) + dynamodbConstants.DYNAMODB_TITLE_MARKDOWN,
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

    let systemErrorsMetricListLeft: IMetric[] = [];
    let systemErrorsMetricListRight: IMetric[] = [];
    let userErrorsMetricList: IMetric[] = [];
    let conditionalCheckFailedRequestsMetricList: IMetric[] = [];
    let successfulRequestLatencyMetricLeft: IMetric[] = [];
    let successfulRequestLatencyMetricRight: IMetric[] = [];
    let successfulRequestLatencyMetricQueryList: IMetric[] = [];
    let successfulRequestLatencyMetricScanList: IMetric[] = [];
    let throttledRequestsMetricListLeft: IMetric[] = [];
    let throttledRequestsMetricListRight: IMetric[] = [];
    let readThrottleEventsMetricList: IMetric[] = [];
    let writeThrottleEventsMetricList: IMetric[] = [];
    let consumedReadCapacityList: IMetric[] = [];
    let consumedWriteCapacityList: IMetric[] = [];
    let returnedBytesMetricList: IMetric[] = [];
    let returnedRecordsCountMetricList: IMetric[] = [];
    let dynamodbAlarms: IAlarm[] = [];
    let tableLinksMarkdown: string = '';

    for (let entry of props.tableNames) {
      let tables: string[] = entry.resources;
      for (let t of tables) {
        let table = Token.asString(t);
        let leftColorHex = utilities.getRandomColor();
        let rightColorHex = utilities.getRandomColor();

        // Metrics
        tableLinksMarkdown += dynamodbConstants.TABLE_LINK_ROW.replace(
          /\bus-east-1\b/g,
          entry.resourceRegion,
        ).replace(/\bTable_Name\b/g, table);

        const metricPeriod: Duration = Duration.minutes(
          dynamodbConstants.METRIC_DURATION_MINUTES,
        );
        let tableId: string =
          entry.resourceRegion.replace(/[^a-zA-Z0-9]/g, '') +
          table.replace(/[^a-zA-Z0-9]/g, '');

        let systemErrorsMetricGetItem = new cloudwatch.Metric({
          namespace: dynamodbConstants.NAMESPACE,
          metricName: 'SystemErrors',
          label: dynamodbConstants.LABEL,
          period: metricPeriod,
          dimensionsMap: {
            TableName: table,
            Operation: 'GetItem',
          },
          statistic: cloudwatch.Statistic.SUM,
          color: leftColorHex,
          region: entry.resourceRegion,
        });
        let systemErrorsMetricScan = new cloudwatch.Metric({
          namespace: dynamodbConstants.NAMESPACE,
          metricName: 'SystemErrors',
          label: dynamodbConstants.LABEL,
          period: metricPeriod,
          dimensionsMap: {
            TableName: table,
            Operation: 'Scan',
          },
          statistic: cloudwatch.Statistic.SUM,
          color: leftColorHex,
          region: entry.resourceRegion,
        });
        let systemErrorsMetricQuery = new cloudwatch.Metric({
          namespace: dynamodbConstants.NAMESPACE,
          metricName: 'SystemErrors',
          label: dynamodbConstants.LABEL,
          period: metricPeriod,
          dimensionsMap: {
            TableName: table,
            Operation: 'Query',
          },
          statistic: cloudwatch.Statistic.SUM,
          color: leftColorHex,
          region: entry.resourceRegion,
        });
        let systemErrorsMetricBatchGetItem = new cloudwatch.Metric({
          namespace: dynamodbConstants.NAMESPACE,
          metricName: 'SystemErrors',
          label: dynamodbConstants.LABEL,
          period: metricPeriod,
          dimensionsMap: {
            TableName: table,
            Operation: 'BatchGetItem',
          },
          statistic: cloudwatch.Statistic.SUM,
          color: leftColorHex,
          region: entry.resourceRegion,
        });
        let systemErrorsMetricTransactGetItems = new cloudwatch.Metric({
          namespace: dynamodbConstants.NAMESPACE,
          metricName: 'SystemErrors',
          label: dynamodbConstants.LABEL,
          period: metricPeriod,
          dimensionsMap: {
            TableName: table,
            Operation: 'TransactGetItems',
          },
          statistic: cloudwatch.Statistic.SUM,
          color: leftColorHex,
          region: entry.resourceRegion,
        });
        let s6: string = tableId + 'ReadGetItem';
        let s7: string = tableId + 'ReadScan';
        let s8: string = tableId + 'ReadQuery';
        let s9: string = tableId + 'ReadBatchGetItem';
        let s10: string = tableId + 'ReadTransactGetItems';
        let systemErrorsMetricReadExpression: string =
          'SUM(METRICS("TABLEID"))';
        systemErrorsMetricReadExpression =
          systemErrorsMetricReadExpression.replace(
            /\bTABLEID\b/g,
            tableId + 'Read',
          );
        let systemErrorsMetricRead = new cloudwatch.MathExpression({
          label: table,
          period: metricPeriod,
          expression: systemErrorsMetricReadExpression,
          usingMetrics: {
            [s6]: systemErrorsMetricGetItem,
            [s7]: systemErrorsMetricScan,
            [s8]: systemErrorsMetricQuery,
            [s9]: systemErrorsMetricBatchGetItem,
            [s10]: systemErrorsMetricTransactGetItems,
          },
          color: leftColorHex,
        });
        systemErrorsMetricListLeft.push(systemErrorsMetricRead);

        let systemErrorsMetricPutItem = new cloudwatch.Metric({
          namespace: dynamodbConstants.NAMESPACE,
          metricName: 'SystemErrors',
          label: dynamodbConstants.LABEL,
          period: metricPeriod,
          dimensionsMap: {
            TableName: table,
            Operation: 'PutItem',
          },
          statistic: cloudwatch.Statistic.SUM,
          color: rightColorHex,
          region: entry.resourceRegion,
        });
        let systemErrorsMetricUpdateItem = new cloudwatch.Metric({
          namespace: dynamodbConstants.NAMESPACE,
          metricName: 'SystemErrors',
          label: dynamodbConstants.LABEL,
          period: metricPeriod,
          dimensionsMap: {
            TableName: table,
            Operation: 'UpdateItem',
          },
          statistic: cloudwatch.Statistic.SUM,
          color: rightColorHex,
          region: entry.resourceRegion,
        });
        let systemErrorsMetricDeleteItem = new cloudwatch.Metric({
          namespace: dynamodbConstants.NAMESPACE,
          metricName: 'SystemErrors',
          label: dynamodbConstants.LABEL,
          period: metricPeriod,
          dimensionsMap: {
            TableName: table,
            Operation: 'DeleteItem',
          },
          statistic: cloudwatch.Statistic.SUM,
          color: rightColorHex,
          region: entry.resourceRegion,
        });
        let systemErrorsMetricBatchWriteItem = new cloudwatch.Metric({
          namespace: dynamodbConstants.NAMESPACE,
          metricName: 'SystemErrors',
          label: dynamodbConstants.LABEL,
          period: metricPeriod,
          dimensionsMap: {
            TableName: table,
            Operation: 'BatchWriteItem',
          },
          statistic: cloudwatch.Statistic.SUM,
          color: rightColorHex,
          region: entry.resourceRegion,
        });
        let systemErrorsMetricTransactWriteItems = new cloudwatch.Metric({
          namespace: dynamodbConstants.NAMESPACE,
          metricName: 'SystemErrors',
          label: dynamodbConstants.LABEL,
          period: metricPeriod,
          dimensionsMap: {
            TableName: table,
            Operation: 'TransactWriteItems',
          },
          statistic: cloudwatch.Statistic.SUM,
          color: rightColorHex,
          region: entry.resourceRegion,
        });
        let s1: string = tableId + 'WritePutItem';
        let s2: string = tableId + 'WriteUpdateItem';
        let s3: string = tableId + 'WriteDeleteItem';
        let s4: string = tableId + 'WriteBatchWriteItem';
        let s5: string = tableId + 'WriteTransactWriteItems';
        let systemErrorsMetricWriteExpression: string =
          'SUM(METRICS("TABLEID"))';
        systemErrorsMetricWriteExpression =
          systemErrorsMetricWriteExpression.replace(
            /\bTABLEID\b/g,
            tableId + 'Write',
          );
        let systemErrorsMetricWrite = new cloudwatch.MathExpression({
          label: table,
          period: metricPeriod,
          expression: systemErrorsMetricReadExpression,
          usingMetrics: {
            [s1]: systemErrorsMetricPutItem,
            [s2]: systemErrorsMetricUpdateItem,
            [s3]: systemErrorsMetricDeleteItem,
            [s4]: systemErrorsMetricBatchWriteItem,
            [s5]: systemErrorsMetricTransactWriteItems,
          },
          color: rightColorHex,
        });
        systemErrorsMetricListRight.push(systemErrorsMetricWrite);

        let userErrorsMetric = new cloudwatch.Metric({
          namespace: dynamodbConstants.NAMESPACE,
          metricName: 'UserErrors',
          label: dynamodbConstants.LABEL,
          period: metricPeriod,
          dimensionsMap: {
            TableName: table,
          },
          statistic: cloudwatch.Statistic.SUM,
          color: leftColorHex,
          region: entry.resourceRegion,
        });
        userErrorsMetricList.push(userErrorsMetric);

        let conditionalCheckFailedRequestsMetric = new cloudwatch.Metric({
          namespace: dynamodbConstants.NAMESPACE,
          metricName: 'ConditionalCheckFailedRequests',
          label: dynamodbConstants.LABEL,
          period: metricPeriod,
          dimensionsMap: {
            TableName: table,
          },
          statistic: cloudwatch.Statistic.SUM,
          color: leftColorHex,
          region: entry.resourceRegion,
        });
        conditionalCheckFailedRequestsMetricList.push(
          conditionalCheckFailedRequestsMetric,
        );

        let successfulRequestLatencyMetricGetItem = new cloudwatch.Metric({
          namespace: dynamodbConstants.NAMESPACE,
          metricName: 'SuccessfulRequestLatency',
          label: dynamodbConstants.LABEL,
          period: metricPeriod,
          dimensionsMap: {
            TableName: table,
            Operation: 'GetItem',
          },
          statistic: cloudwatch.Statistic.AVERAGE,
          color: leftColorHex,
          region: entry.resourceRegion,
        });
        let successfulRequestLatencyMetricBatchGetItem = new cloudwatch.Metric({
          namespace: dynamodbConstants.NAMESPACE,
          metricName: 'SuccessfulRequestLatency',
          label: dynamodbConstants.LABEL,
          period: metricPeriod,
          dimensionsMap: {
            TableName: table,
            Operation: 'BatchGetItem',
          },
          statistic: cloudwatch.Statistic.AVERAGE,
          color: leftColorHex,
          region: entry.resourceRegion,
        });
        let r1: string = tableId + 'ReadGetItem';
        let r2: string = tableId + 'ReadBatchGetItem';
        let successfulRequestLatencyMetricReadExpression: string =
          'AVG(METRICS("TABLEID"))';
        successfulRequestLatencyMetricReadExpression =
          successfulRequestLatencyMetricReadExpression.replace(
            /\bTABLEID\b/g,
            tableId + 'Read',
          );
        let successfulRequestLatencyMetricRead = new cloudwatch.MathExpression({
          label: table,
          period: metricPeriod,
          expression: successfulRequestLatencyMetricReadExpression,
          usingMetrics: {
            [r1]: successfulRequestLatencyMetricGetItem,
            [r2]: successfulRequestLatencyMetricBatchGetItem,
          },
          color: leftColorHex,
        });
        successfulRequestLatencyMetricLeft.push(
          successfulRequestLatencyMetricRead,
        );

        let successfulRequestLatencyMetricPutItem = new cloudwatch.Metric({
          namespace: dynamodbConstants.NAMESPACE,
          metricName: 'SuccessfulRequestLatency',
          label: dynamodbConstants.LABEL,
          period: metricPeriod,
          dimensionsMap: {
            TableName: table,
            Operation: 'PutItem',
          },
          statistic: cloudwatch.Statistic.AVERAGE,
          color: rightColorHex,
          region: entry.resourceRegion,
        });
        let successfulRequestLatencyMetricBatchWriteItem =
          new cloudwatch.Metric({
            namespace: dynamodbConstants.NAMESPACE,
            metricName: 'SuccessfulRequestLatency',
            label: dynamodbConstants.LABEL,
            period: metricPeriod,
            dimensionsMap: {
              TableName: table,
              Operation: 'BatchWriteItem',
            },
            statistic: cloudwatch.Statistic.AVERAGE,
            color: rightColorHex,
            region: entry.resourceRegion,
          });
        let r3: string = tableId + 'WritePutItem';
        let r4: string = tableId + 'WriteBatchWriteItem';
        let successfulRequestLatencyMetricWriteExpression: string =
          'AVG(METRICS("TABLEID"))';
        successfulRequestLatencyMetricWriteExpression =
          successfulRequestLatencyMetricWriteExpression.replace(
            /\bTABLEID\b/g,
            tableId + 'Write',
          );
        let successfulRequestLatencyMetricWrite = new cloudwatch.MathExpression(
          {
            label: table,
            period: metricPeriod,
            expression: successfulRequestLatencyMetricWriteExpression,
            usingMetrics: {
              [r3]: successfulRequestLatencyMetricPutItem,
              [r4]: successfulRequestLatencyMetricBatchWriteItem,
            },
            color: rightColorHex,
          },
        );
        successfulRequestLatencyMetricRight.push(
          successfulRequestLatencyMetricWrite,
        );

        let successfulRequestLatencyMetricQuery = new cloudwatch.Metric({
          namespace: dynamodbConstants.NAMESPACE,
          metricName: 'SuccessfulRequestLatency',
          label: dynamodbConstants.LABEL,
          period: metricPeriod,
          dimensionsMap: {
            TableName: table,
            Operation: 'Query',
          },
          statistic: 'p95',
          color: leftColorHex,
          region: entry.resourceRegion,
        });
        successfulRequestLatencyMetricQueryList.push(
          successfulRequestLatencyMetricQuery,
        );

        let successfulRequestLatencyMetricScan = new cloudwatch.Metric({
          namespace: dynamodbConstants.NAMESPACE,
          metricName: 'SuccessfulRequestLatency',
          label: dynamodbConstants.LABEL,
          period: metricPeriod,
          dimensionsMap: {
            TableName: table,
            Operation: 'Scan',
          },
          statistic: 'p95',
          color: leftColorHex,
          region: entry.resourceRegion,
        });
        successfulRequestLatencyMetricScanList.push(
          successfulRequestLatencyMetricScan,
        );

        let throttledRequestsMetricPutItem = new cloudwatch.Metric({
          namespace: dynamodbConstants.NAMESPACE,
          metricName: 'ThrottledRequests',
          label: dynamodbConstants.LABEL,
          period: metricPeriod,
          dimensionsMap: {
            TableName: table,
            Operation: 'PutItem',
          },
          statistic: cloudwatch.Statistic.SUM,
          color: rightColorHex,
          region: entry.resourceRegion,
        });
        let throttledRequestsMetricUpdateItem = new cloudwatch.Metric({
          namespace: dynamodbConstants.NAMESPACE,
          metricName: 'ThrottledRequests',
          label: dynamodbConstants.LABEL,
          period: metricPeriod,
          dimensionsMap: {
            TableName: table,
            Operation: 'UpdateItem',
          },
          statistic: cloudwatch.Statistic.SUM,
          color: rightColorHex,
          region: entry.resourceRegion,
        });
        let throttledRequestsMetricDeleteItem = new cloudwatch.Metric({
          namespace: dynamodbConstants.NAMESPACE,
          metricName: 'ThrottledRequests',
          label: dynamodbConstants.LABEL,
          period: metricPeriod,
          dimensionsMap: {
            TableName: table,
            Operation: 'DeleteItem',
          },
          statistic: cloudwatch.Statistic.SUM,
          color: rightColorHex,
          region: entry.resourceRegion,
        });
        let throttledRequestsMetricBatchWriteItem = new cloudwatch.Metric({
          namespace: dynamodbConstants.NAMESPACE,
          metricName: 'ThrottledRequests',
          label: dynamodbConstants.LABEL,
          period: metricPeriod,
          dimensionsMap: {
            TableName: table,
            Operation: 'BatchWriteItem',
          },
          statistic: cloudwatch.Statistic.SUM,
          color: rightColorHex,
          region: entry.resourceRegion,
        });
        let t1: string = tableId + 'WritePutItem';
        let t2: string = tableId + 'WriteUpdateItem';
        let t3: string = tableId + 'WriteDeleteItem';
        let t4: string = tableId + 'WriteBatchWriteItem';
        let throttledRequestsMetricWriteExpression: string =
          'SUM(METRICS("TABLEID"))';
        throttledRequestsMetricWriteExpression =
          throttledRequestsMetricWriteExpression.replace(
            /\bTABLEID\b/g,
            tableId + 'Write',
          );
        let throttledRequestsMetricWrite = new cloudwatch.MathExpression({
          label: table,
          period: metricPeriod,
          expression: throttledRequestsMetricWriteExpression,
          usingMetrics: {
            [t1]: throttledRequestsMetricPutItem,
            [t2]: throttledRequestsMetricUpdateItem,
            [t3]: throttledRequestsMetricDeleteItem,
            [t4]: throttledRequestsMetricBatchWriteItem,
          },
          color: rightColorHex,
        });
        throttledRequestsMetricListRight.push(throttledRequestsMetricWrite);

        let throttledRequestsMetricGetItem = new cloudwatch.Metric({
          namespace: dynamodbConstants.NAMESPACE,
          metricName: 'ThrottledRequests',
          label: dynamodbConstants.LABEL,
          period: metricPeriod,
          dimensionsMap: {
            TableName: table,
            Operation: 'GetItem',
          },
          statistic: cloudwatch.Statistic.SUM,
          color: leftColorHex,
          region: entry.resourceRegion,
        });
        let throttledRequestsMetricScan = new cloudwatch.Metric({
          namespace: dynamodbConstants.NAMESPACE,
          metricName: 'ThrottledRequests',
          label: dynamodbConstants.LABEL,
          period: metricPeriod,
          dimensionsMap: {
            TableName: table,
            Operation: 'Scan',
          },
          statistic: cloudwatch.Statistic.SUM,
          color: leftColorHex,
          region: entry.resourceRegion,
        });
        let throttledRequestsMetricQuery = new cloudwatch.Metric({
          namespace: dynamodbConstants.NAMESPACE,
          metricName: 'ThrottledRequests',
          label: dynamodbConstants.LABEL,
          period: metricPeriod,
          dimensionsMap: {
            TableName: table,
            Operation: 'Query',
          },
          statistic: cloudwatch.Statistic.SUM,
          color: leftColorHex,
          region: entry.resourceRegion,
        });
        let throttledRequestsMetricBatchGetItem = new cloudwatch.Metric({
          namespace: dynamodbConstants.NAMESPACE,
          metricName: 'ThrottledRequests',
          label: dynamodbConstants.LABEL,
          period: metricPeriod,
          dimensionsMap: {
            TableName: table,
            Operation: 'BatchGetItem',
          },
          statistic: cloudwatch.Statistic.SUM,
          color: leftColorHex,
          region: entry.resourceRegion,
        });
        let t5: string = tableId + 'ReadGetItem';
        let t6: string = tableId + 'ReadScan';
        let t7: string = tableId + 'ReadDeleteItem';
        let t8: string = tableId + 'ReadBatchWriteItem';
        let throttledRequestsMetricReadExpression: string =
          'SUM(METRICS("TABLEID"))';
        throttledRequestsMetricReadExpression =
          throttledRequestsMetricReadExpression.replace(
            /\bTABLEID\b/g,
            tableId + 'Read',
          );
        let throttledRequestsMetricRead = new cloudwatch.MathExpression({
          label: table,
          period: metricPeriod,
          expression: throttledRequestsMetricReadExpression,
          usingMetrics: {
            [t5]: throttledRequestsMetricGetItem,
            [t6]: throttledRequestsMetricScan,
            [t7]: throttledRequestsMetricQuery,
            [t8]: throttledRequestsMetricBatchGetItem,
          },
          color: leftColorHex,
        });
        throttledRequestsMetricListLeft.push(throttledRequestsMetricRead);

        let readThrottleEventsMetric = new cloudwatch.Metric({
          namespace: dynamodbConstants.NAMESPACE,
          metricName: 'ReadThrottleEvents',
          label: dynamodbConstants.LABEL,
          period: metricPeriod,
          dimensionsMap: {
            TableName: table,
          },
          statistic: cloudwatch.Statistic.SUM,
          color: leftColorHex,
          region: entry.resourceRegion,
        });
        readThrottleEventsMetricList.push(readThrottleEventsMetric);

        let writeThrottleEventsMetric = new cloudwatch.Metric({
          namespace: dynamodbConstants.NAMESPACE,
          metricName: 'WriteThrottleEvents',
          label: dynamodbConstants.LABEL,
          period: metricPeriod,
          dimensionsMap: {
            TableName: table,
          },
          statistic: cloudwatch.Statistic.SUM,
          color: rightColorHex,
          region: entry.resourceRegion,
        });
        writeThrottleEventsMetricList.push(writeThrottleEventsMetric);

        let consumedReadCapacityUnitsMetric = new cloudwatch.Metric({
          namespace: dynamodbConstants.NAMESPACE,
          metricName: 'ConsumedReadCapacityUnits',
          label: dynamodbConstants.LABEL,
          period: metricPeriod,
          dimensionsMap: {
            TableName: table,
          },
          statistic: cloudwatch.Statistic.SUM,
          color: leftColorHex,
          region: entry.resourceRegion,
        });
        let provisionedReadCapacityUnitsMetric = new cloudwatch.Metric({
          namespace: dynamodbConstants.NAMESPACE,
          metricName: 'ProvisionedReadCapacityUnits',
          label: dynamodbConstants.LABEL,
          period: metricPeriod,
          dimensionsMap: {
            TableName: table,
          },
          statistic: cloudwatch.Statistic.SUM,
          color: leftColorHex,
          region: entry.resourceRegion,
        });
        let p1: string = tableId + 'ProvisionedReadCapacityUnits';
        let c1: string = tableId + 'ConsumedReadCapacityUnits';
        let consumedReadCapacityExpression: string =
          'IF(p1 !=0, ((c1/PERIOD(c1)) / p1) * 100, 0)';
        consumedReadCapacityExpression = consumedReadCapacityExpression
          .replace(/\bp1\b/g, p1)
          .replace(/\bc1\b/g, c1);
        let consumedReadCapacity = new cloudwatch.MathExpression({
          label: table,
          period: metricPeriod,
          expression: consumedReadCapacityExpression,
          usingMetrics: {
            [p1]: provisionedReadCapacityUnitsMetric,
            [c1]: consumedReadCapacityUnitsMetric,
          },
          color: leftColorHex,
        });
        consumedReadCapacityList.push(consumedReadCapacity);

        let consumedWriteCapacityUnitsMetric = new cloudwatch.Metric({
          namespace: dynamodbConstants.NAMESPACE,
          metricName: 'ConsumedWriteCapacityUnits',
          label: dynamodbConstants.LABEL,
          period: metricPeriod,
          dimensionsMap: {
            TableName: table,
          },
          statistic: cloudwatch.Statistic.SUM,
          color: rightColorHex,
          region: entry.resourceRegion,
        });
        let provisionedWriteCapacityUnitsMetric = new cloudwatch.Metric({
          namespace: dynamodbConstants.NAMESPACE,
          metricName: 'ProvisionedWriteCapacityUnits',
          label: dynamodbConstants.LABEL,
          period: metricPeriod,
          dimensionsMap: {
            TableName: table,
          },
          statistic: cloudwatch.Statistic.SUM,
          color: rightColorHex,
          region: entry.resourceRegion,
        });
        let p2: string = tableId + 'ProvisionedWriteCapacityUnits';
        let c2: string = tableId + 'ConsumedWriteCapacityUnits';
        let consumedWriteCapacityExpression: string =
          'IF(p2 !=0, ((c2/PERIOD(c2)) / p2) * 100, 0)';
        consumedWriteCapacityExpression = consumedWriteCapacityExpression
          .replace(/\bp2\b/g, p2)
          .replace(/\bc2\b/g, c2);
        let consumedWriteCapacity = new cloudwatch.MathExpression({
          label: table,
          period: metricPeriod,
          expression: consumedWriteCapacityExpression,
          usingMetrics: {
            [p2]: provisionedWriteCapacityUnitsMetric,
            [c2]: consumedWriteCapacityUnitsMetric,
          },
          color: rightColorHex,
        });
        consumedWriteCapacityList.push(consumedWriteCapacity);

        let returnedBytesMetric = new cloudwatch.Metric({
          namespace: dynamodbConstants.NAMESPACE,
          metricName: 'ReturnedBytes',
          label: dynamodbConstants.LABEL,
          period: metricPeriod,
          dimensionsMap: {
            TableName: table,
            Operation: 'GetRecords',
          },
          statistic: cloudwatch.Statistic.AVERAGE,
          color: leftColorHex,
          region: entry.resourceRegion,
        });
        returnedBytesMetricList.push(returnedBytesMetric);

        let returnedRecordsCountMetric = new cloudwatch.Metric({
          namespace: dynamodbConstants.NAMESPACE,
          metricName: 'ReturnedRecordsCount',
          label: dynamodbConstants.LABEL,
          period: metricPeriod,
          dimensionsMap: {
            TableName: table,
            Operation: 'GetRecords',
          },
          statistic: cloudwatch.Statistic.SUM,
          color: leftColorHex,
          region: entry.resourceRegion,
        });
        returnedRecordsCountMetricList.push(returnedRecordsCountMetric);

        // Alarms
        // Creating alarms only for the resources of deployment region.

        if (props.createAlarms === true) {
          if (Stack.of(this).region === entry.resourceRegion) {
            // Metrics only for Alarms, hence no requirement of uniq id

            let sustainedReadThrottlingExpression: string =
              'IF(c1 !=0, (rt1 / c1) * 100, 0)';
            let sustainedReadThrottling = new cloudwatch.MathExpression({
              label: table,
              period: metricPeriod,
              expression: sustainedReadThrottlingExpression,
              usingMetrics: {
                ['rt1']: readThrottleEventsMetric.with({
                  statistic: cloudwatch.Statistic.SAMPLE_COUNT,
                }),
                ['c1']: consumedReadCapacityUnitsMetric.with({
                  statistic: cloudwatch.Statistic.SAMPLE_COUNT,
                }),
              },
            });

            let sustainedWriteThrottlingExpression: string =
              'IF(c2 !=0, (wt1 / c2) * 100, 0)';
            let sustainedWriteThrottling = new cloudwatch.MathExpression({
              label: table,
              period: metricPeriod,
              expression: sustainedWriteThrottlingExpression,
              usingMetrics: {
                ['wt1']: writeThrottleEventsMetric.with({
                  statistic: cloudwatch.Statistic.SAMPLE_COUNT,
                }),
                ['c2']: consumedWriteCapacityUnitsMetric.with({
                  statistic: cloudwatch.Statistic.SAMPLE_COUNT,
                }),
              },
            });

            let sustainedSystemErrorsExpression: string =
              'IF(SUM([c1,c2]) !=0, (SUM([s1,s2,s3,s4,s6,s7,s8,s9]) / SUM([c1,c2])) * 100, 0)';
            let sustainedSystemErrors = new cloudwatch.MathExpression({
              label: table,
              period: metricPeriod,
              expression: sustainedSystemErrorsExpression,
              usingMetrics: {
                ['c1']: consumedReadCapacityUnitsMetric.with({
                  statistic: cloudwatch.Statistic.SAMPLE_COUNT,
                }),
                ['c2']: consumedWriteCapacityUnitsMetric.with({
                  statistic: cloudwatch.Statistic.SAMPLE_COUNT,
                }),
                ['s1']: systemErrorsMetricPutItem.with({
                  statistic: cloudwatch.Statistic.SAMPLE_COUNT,
                }),
                ['s2']: systemErrorsMetricUpdateItem.with({
                  statistic: cloudwatch.Statistic.SAMPLE_COUNT,
                }),
                ['s3']: systemErrorsMetricDeleteItem.with({
                  statistic: cloudwatch.Statistic.SAMPLE_COUNT,
                }),
                ['s4']: systemErrorsMetricBatchWriteItem.with({
                  statistic: cloudwatch.Statistic.SAMPLE_COUNT,
                }),
                ['s6']: systemErrorsMetricGetItem.with({
                  statistic: cloudwatch.Statistic.SAMPLE_COUNT,
                }),
                ['s7']: systemErrorsMetricScan.with({
                  statistic: cloudwatch.Statistic.SAMPLE_COUNT,
                }),
                ['s8']: systemErrorsMetricQuery.with({
                  statistic: cloudwatch.Statistic.SAMPLE_COUNT,
                }),
                ['s9']: systemErrorsMetricBatchGetItem.with({
                  statistic: cloudwatch.Statistic.SAMPLE_COUNT,
                }),
              },
            });

            let sustainedUserErrorsExpression: string =
              'IF(SUM([c1,c2]) !=0, (u1 / SUM([c1,c2])) * 100, 0)';
            let sustainedUserErrors = new cloudwatch.MathExpression({
              label: table,
              period: metricPeriod,
              expression: sustainedUserErrorsExpression,
              usingMetrics: {
                ['u1']: writeThrottleEventsMetric.with({
                  statistic: cloudwatch.Statistic.SAMPLE_COUNT,
                }),
                ['c1']: consumedReadCapacityUnitsMetric.with({
                  statistic: cloudwatch.Statistic.SAMPLE_COUNT,
                }),
                ['c2']: consumedWriteCapacityUnitsMetric.with({
                  statistic: cloudwatch.Statistic.SAMPLE_COUNT,
                }),
              },
            });

            let sustainedReadThrottlingAlarm = new cloudwatch.Alarm(
              this,
              'SustainedReadThrottling' + table,
              {
                alarmName: 'SustainedReadThrottling-' + tableId,
                comparisonOperator:
                  cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
                threshold: 2,
                evaluationPeriods: 1,
                metric: sustainedReadThrottling,
              },
            );
            let sustainedWriteThrottlingAlarm = new cloudwatch.Alarm(
              this,
              'SustainedWriteThrottling' + table,
              {
                alarmName: 'SustainedWriteThrottling-' + tableId,
                comparisonOperator:
                  cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
                threshold: 2,
                evaluationPeriods: 1,
                metric: sustainedWriteThrottling,
              },
            );

            let sustainedSystemErrorsAlarm = new cloudwatch.Alarm(
              this,
              'SustainedSystemErrors' + table,
              {
                alarmName: 'SustainedSystemErrors-' + tableId,
                comparisonOperator:
                  cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
                threshold: 2,
                evaluationPeriods: 1,
                metric: sustainedSystemErrors,
              },
            );

            let sustainedUserErrorsAlarm = new cloudwatch.Alarm(
              this,
              'SustainedUserErrors' + table,
              {
                alarmName: 'SustainedUserErrors-' + tableId,
                comparisonOperator:
                  cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
                threshold: 2,
                evaluationPeriods: 1,
                metric: sustainedUserErrors,
              },
            );

            dynamodbAlarms.push(
              sustainedReadThrottlingAlarm,
              sustainedWriteThrottlingAlarm,
              sustainedUserErrorsAlarm,
              sustainedSystemErrorsAlarm,
            );
          }
        }
      }
    }

    const systemErrorsWidget = new cloudwatch.GraphWidget({
      title: 'SystemErrors: Sum',
      left: systemErrorsMetricListLeft,
      right: systemErrorsMetricListRight,
      height: 6,
      width: 12,
      leftYAxis: { label: 'Read-Count', showUnits: false },
      rightYAxis: { label: 'Write-Count', showUnits: false },
    });

    const userErrorsWidget = new cloudwatch.GraphWidget({
      title: 'UserErrors: Max',
      left: userErrorsMetricList,
      height: 6,
      width: 6,
      leftYAxis: { label: 'Count', showUnits: false },
    });

    const conditionalCheckFailedRequestsWidget = new cloudwatch.GraphWidget({
      title: 'ConditionalCheckFailedRequests: Max',
      left: conditionalCheckFailedRequestsMetricList,
      height: 6,
      width: 6,
      leftYAxis: { label: 'Count', showUnits: false },
    });

    const successfulRequestLatencyWidget = new cloudwatch.GraphWidget({
      title: 'Get & Put SuccessfulRequestLatency: Average',
      left: successfulRequestLatencyMetricLeft,
      right: successfulRequestLatencyMetricRight,
      height: 6,
      width: 12,
      leftYAxis: { label: 'Get-ms', showUnits: false },
      rightYAxis: { label: 'Put-ms', showUnits: false },
    });

    const successfulRequestLatencyQueryWidget = new cloudwatch.GraphWidget({
      title: 'Query SuccessfulRequestLatency: P95',
      left: successfulRequestLatencyMetricQueryList,
      height: 6,
      width: 6,
      leftYAxis: { label: 'Milliseconds', showUnits: false },
    });

    const successfulRequestLatencyScanWidget = new cloudwatch.GraphWidget({
      title: 'Scan SuccessfulRequestLatency: P95',
      left: successfulRequestLatencyMetricScanList,
      height: 6,
      width: 6,
      leftYAxis: { label: 'Milliseconds', showUnits: false },
    });

    const throttledRequestsWidget = new cloudwatch.GraphWidget({
      title: 'ThrottledRequests: Sum',
      left: throttledRequestsMetricListLeft,
      right: throttledRequestsMetricListRight,
      height: 6,
      width: 12,
      leftYAxis: { label: 'Read-Count', showUnits: false },
      rightYAxis: { label: 'Write-Count', showUnits: false },
    });

    const throttledEventsWidget = new cloudwatch.GraphWidget({
      title: 'ThrottleEvents: Sum',
      left: readThrottleEventsMetricList,
      right: writeThrottleEventsMetricList,
      height: 6,
      width: 12,
      leftYAxis: { label: 'Read-Count', showUnits: false },
      rightYAxis: { label: 'Write-Count', showUnits: false },
    });

    const consumedCapacityWidget = new cloudwatch.GraphWidget({
      title: 'Consumed Read & Write Capacity: Percent',
      left: consumedReadCapacityList,
      right: consumedWriteCapacityList,
      height: 6,
      width: 12,
      leftYAxis: { label: 'Read-Percent', showUnits: false },
      rightYAxis: { label: 'Write-Percent', showUnits: false },
    });

    const returnedBytesWidget = new cloudwatch.GraphWidget({
      title: 'Streams: GetRecords returned bytes: Average',
      left: returnedBytesMetricList,
      height: 6,
      width: 6,
      leftYAxis: { label: 'Bytes', showUnits: false },
    });

    const returnedRecordsCountWidget = new cloudwatch.GraphWidget({
      title: 'Streams: GetRecords returned records: Average',
      left: returnedRecordsCountMetricList,
      height: 6,
      width: 6,
      leftYAxis: { label: 'Count', showUnits: false },
    });

    const tableWidget = new cloudwatch.TextWidget({
      markdown: dynamodbConstants.TABLE_HEADER + tableLinksMarkdown,
      height: 1 + userErrorsMetricList.length,
      width: 24,
    });

    const firstHeadingRaw = new cloudwatch.Row(errorWidget, latencyWidget);
    const seconHeadingdRaw = new cloudwatch.Row(
      saturationWidget,
      trafficWidget,
    );
    const firstWidgetRaw = new cloudwatch.Row(
      systemErrorsWidget,
      successfulRequestLatencyWidget,
    );
    const secondWidgetRaw = new cloudwatch.Row(
      userErrorsWidget,
      conditionalCheckFailedRequestsWidget,
      successfulRequestLatencyQueryWidget,
      successfulRequestLatencyScanWidget,
    );
    const thirdWidgetRaw = new cloudwatch.Row(
      throttledRequestsWidget,
      consumedCapacityWidget,
    );
    const fourthWidgetRaw = new cloudwatch.Row(
      throttledEventsWidget,
      returnedBytesWidget,
      returnedRecordsCountWidget,
    );

    if (props.createAlarms === true) {
      const alarmWidget = new cloudwatch.AlarmStatusWidget({
        title: 'Alarms',
        height: utilities.getAlarmWidgetHeight(dynamodbAlarms),
        width: 24,
        alarms: dynamodbAlarms,
      });
      dynamodbDashboard.addWidgets(
        titleWidget,
        alarmWidget,
        firstHeadingRaw,
        firstWidgetRaw,
        secondWidgetRaw,
        seconHeadingdRaw,
        thirdWidgetRaw,
        fourthWidgetRaw,
        tableWidget,
      );
    } else {
      dynamodbDashboard.addWidgets(
        titleWidget,
        firstHeadingRaw,
        firstWidgetRaw,
        secondWidgetRaw,
        seconHeadingdRaw,
        thirdWidgetRaw,
        fourthWidgetRaw,
        tableWidget,
      );
    }

    this.dashboardArn = dynamodbDashboard.dashboardArn;
  }
}
