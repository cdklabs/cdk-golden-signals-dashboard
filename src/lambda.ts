// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { ResourceProps, Token, Duration, Stack } from "aws-cdk-lib";
import * as cloudwatch from "aws-cdk-lib/aws-cloudwatch";
import { IMetric, IAlarm } from "aws-cdk-lib/aws-cloudwatch";
import { Construct } from "constructs";
import { lambdaConstants, dashboardConstants } from "./constants";
import { CdkGSDashboardResourceProps } from "./index";
import * as utilities from "./utilities";

export interface CdkLambdaDashboardProps extends ResourceProps {
  readonly dashboardName: string;
  readonly functionNames: CdkGSDashboardResourceProps[];
  /**
   * If you want to see lambda insights metrics for the resources on dashboard.
   * @default true
   */
  readonly showInsightsMetrics?: boolean;
  /**
   * If you want to create reasonable CloudWatch Alarms for the resources.
   * @default false
   */
  readonly createAlarms?: boolean;
}

export class LambdaDashboard extends Construct {
  public readonly dashboardArn: string;

  constructor(scope: Construct, id: string, props: CdkLambdaDashboardProps) {
    super(scope, id);

    let lambdaDashboard = new cloudwatch.Dashboard(this, "MyDashboard", {
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
          "Lambda",
        ) + lambdaConstants.LAMBDA_TITLE_MARKDOWN,
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

    let durationMetricList: IMetric[] = [];
    let errorsMetricList: IMetric[] = [];
    let invocationsMetricList: IMetric[] = [];
    let concurrentExecutionsMetricList: IMetric[] = [];
    let throttlesMetricList: IMetric[] = [];
    let memoryUtilizationMetricList: IMetric[] = [];
    let cpuTotalTimeMetricList: IMetric[] = [];
    let totalNetworkMetricList: IMetric[] = [];
    let lambdaAlarms: IAlarm[] = [];
    let insightDashboardMarkdown: string = "";
    let functionLinksMarkdown: string = "";

    for (let entry of props.functionNames) {
      let functions: string[] = entry.resources;
      insightDashboardMarkdown +=
        lambdaConstants.LAMBDA_INSIGHT_DASHBOARD_MARKDOWN.replace(
          /\bus-east-1\b/g,
          entry.resourceRegion,
        );
      for (let f of functions) {
        let func = Token.asString(f);
        let colorHex = utilities.getRandomColor();

        //Metrics
        functionLinksMarkdown += lambdaConstants.TABLE_LINK_ROW.replace(
          /\bus-east-1\b/g,
          entry.resourceRegion,
        ).replace(/\bFunction_Name\b/g, func);

        const metricPeriod: Duration = Duration.minutes(
          lambdaConstants.METRIC_DURATION_MINUTES,
        );
        let functionName: string =
          entry.resourceRegion.replace(/[^a-zA-Z0-9]/g, "") +
          func.replace(/[^a-zA-Z0-9]/g, "");

        let durationMetric = new cloudwatch.Metric({
          namespace: lambdaConstants.NAMESPACE,
          metricName: "Duration",
          label: lambdaConstants.LABEL,
          period: metricPeriod,
          dimensionsMap: {
            FunctionName: func,
          },
          statistic: "p95",
          color: colorHex,
          region: entry.resourceRegion,
        });
        durationMetricList.push(durationMetric);

        let invocationMetric = new cloudwatch.Metric({
          namespace: lambdaConstants.NAMESPACE,
          metricName: "Invocations",
          label: lambdaConstants.LABEL,
          period: metricPeriod,
          dimensionsMap: {
            FunctionName: func,
          },
          statistic: cloudwatch.Statistic.SUM,
          color: colorHex,
          region: entry.resourceRegion,
        });
        invocationsMetricList.push(invocationMetric);

        let concurrentExecutionsMetric = new cloudwatch.Metric({
          namespace: lambdaConstants.NAMESPACE,
          metricName: "ConcurrentExecutions",
          label: lambdaConstants.LABEL,
          period: metricPeriod,
          dimensionsMap: {
            FunctionName: func,
          },
          statistic: cloudwatch.Statistic.SUM,
          color: colorHex,
          region: entry.resourceRegion,
        });
        concurrentExecutionsMetricList.push(concurrentExecutionsMetric);

        let throttlesMetric = new cloudwatch.Metric({
          namespace: lambdaConstants.NAMESPACE,
          metricName: "Throttles",
          label: lambdaConstants.LABEL,
          period: metricPeriod,
          dimensionsMap: {
            FunctionName: func,
          },
          statistic: cloudwatch.Statistic.SUM,
          color: colorHex,
          region: entry.resourceRegion,
        });
        throttlesMetricList.push(throttlesMetric);

        let errorsMetric = new cloudwatch.Metric({
          namespace: lambdaConstants.NAMESPACE,
          metricName: "Errors",
          label: lambdaConstants.LABEL,
          period: metricPeriod,
          dimensionsMap: {
            FunctionName: func,
          },
          statistic: cloudwatch.Statistic.SUM,
          region: entry.resourceRegion,
        });

        let i1: string = functionName + "Invocations";
        let e1: string = functionName + "Errors";
        let errorRateExpression: string = "IF(i1 !=0, (e1 / i1) * 100, 0)";
        errorRateExpression = errorRateExpression
          .replace(/\bi1\b/g, i1)
          .replace(/\be1\b/g, e1);

        let errorRateMetric = new cloudwatch.MathExpression({
          label: func,
          period: metricPeriod,
          expression: errorRateExpression,
          usingMetrics: {
            [i1]: invocationMetric,
            [e1]: errorsMetric,
          },
          color: colorHex,
        });

        errorsMetricList.push(errorRateMetric);

        // Alarms
        // Creating alarms only for the resources of deployment region.
        if (props.createAlarms === true) {
          if (Stack.of(this).region === entry.resourceRegion) {
            let throttlesAlarm = new cloudwatch.Alarm(
              this,
              "Throttles" + functionName,
              {
                alarmName: "Throttles-" + functionName,
                comparisonOperator:
                  cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
                threshold: 0,
                evaluationPeriods: 1,
                metric: throttlesMetric,
              },
            );

            let errorRateAlarm = new cloudwatch.Alarm(
              this,
              "ErrorRate" + functionName,
              {
                alarmName: "ErrorRate-" + functionName,
                comparisonOperator:
                  cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
                threshold: 2,
                evaluationPeriods: 1,
                metric: errorRateMetric,
              },
            );
            lambdaAlarms.push(throttlesAlarm, errorRateAlarm);
          }
        }

        //Lambda Insights

        if (props.showInsightsMetrics === true) {
          let memoryUtilizationMetric = new cloudwatch.Metric({
            namespace: lambdaConstants.LAMBDA_INSIGHTS_NAMESPACE,
            metricName: "memory_utilization",
            label: lambdaConstants.LAMBDA_INSIGHTS_LABEL,
            period: metricPeriod,
            dimensionsMap: {
              function_name: func,
            },
            statistic: cloudwatch.Statistic.AVERAGE,
            region: entry.resourceRegion,
          });
          memoryUtilizationMetricList.push(memoryUtilizationMetric);

          let cpuTotalTimeMetric = new cloudwatch.Metric({
            namespace: lambdaConstants.LAMBDA_INSIGHTS_NAMESPACE,
            metricName: "cpu_total_time",
            label: lambdaConstants.LAMBDA_INSIGHTS_LABEL,
            period: metricPeriod,
            dimensionsMap: {
              function_name: func,
            },
            statistic: cloudwatch.Statistic.AVERAGE,
            region: entry.resourceRegion,
          });
          cpuTotalTimeMetricList.push(cpuTotalTimeMetric);

          let totalNetworkMetric = new cloudwatch.Metric({
            namespace: lambdaConstants.LAMBDA_INSIGHTS_NAMESPACE,
            metricName: "total_network",
            label: lambdaConstants.LAMBDA_INSIGHTS_LABEL,
            period: metricPeriod,
            dimensionsMap: {
              function_name: func,
            },
            statistic: cloudwatch.Statistic.AVERAGE,
            region: entry.resourceRegion,
          });
          totalNetworkMetricList.push(totalNetworkMetric);
        }
      }
    }

    const durationWidget = new cloudwatch.GraphWidget({
      title: "Duration: P95",
      left: durationMetricList,
      height: 6,
      width: 12,
      leftYAxis: { label: "Milliseconds", showUnits: false },
    });

    const invocationsWidget = new cloudwatch.GraphWidget({
      title: "Invocations: Sum",
      left: invocationsMetricList,
      height: 6,
      width: 12,
      leftYAxis: { label: "Count", showUnits: false },
    });

    const concurrentExecutionsWidget = new cloudwatch.GraphWidget({
      title: "ConcurrentExecutions: Sum",
      left: concurrentExecutionsMetricList,
      height: 6,
      width: 6,
      leftYAxis: { label: "Count", showUnits: false },
    });

    const throttlesWidget = new cloudwatch.GraphWidget({
      title: "Throttles: Sum",
      left: throttlesMetricList,
      height: 6,
      width: 6,
      leftYAxis: { label: "Count", showUnits: false },
    });

    const errorsWidget = new cloudwatch.GraphWidget({
      title: "ErrorRate: Percent",
      left: errorsMetricList,
      height: 6,
      width: 12,
      leftYAxis: { label: "Percent", showUnits: false },
    });

    const insightWidget = new cloudwatch.TextWidget({
      markdown:
        lambdaConstants.LAMBDA_INSIGHTS_MARKDOWN + insightDashboardMarkdown,
      height: 1,
      width: 24,
    });

    const tableWidget = new cloudwatch.TextWidget({
      markdown: lambdaConstants.TABLE_HEADER + functionLinksMarkdown,
      height: 1 + invocationsMetricList.length,
      width: 24,
    });

    const memoryWidget = new cloudwatch.GraphWidget({
      title: "Memory Usage: Percent",
      left: memoryUtilizationMetricList,
      height: 6,
      width: 8,
      leftYAxis: { label: "Percent", showUnits: false },
    });

    const cpuWidget = new cloudwatch.GraphWidget({
      title: "CPU Usage: Average",
      left: cpuTotalTimeMetricList,
      height: 6,
      width: 8,
      leftYAxis: { label: "Milliseconds", showUnits: false },
    });

    const networkWidget = new cloudwatch.GraphWidget({
      title: "Network Usage: Average",
      left: totalNetworkMetricList,
      height: 6,
      width: 8,
      leftYAxis: { label: "Bytes", showUnits: false },
    });

    const alarmWidget = new cloudwatch.AlarmStatusWidget({
      title: "Alarms",
      height: utilities.getAlarmWidgetHeight(lambdaAlarms),
      width: 24,
      alarms: lambdaAlarms,
    });

    const firstHeadingRaw = new cloudwatch.Row(errorWidget, latencyWidget);
    const seconHeadingdRaw = new cloudwatch.Row(
      saturationWidget,
      trafficWidget,
    );
    const firstWidgetRaw = new cloudwatch.Row(errorsWidget, durationWidget);
    const secondWidgetRaw = new cloudwatch.Row(
      throttlesWidget,
      concurrentExecutionsWidget,
      invocationsWidget,
    );

    if (props.createAlarms === true) {
      lambdaDashboard.addWidgets(
        titleWidget,
        alarmWidget,
        firstHeadingRaw,
        firstWidgetRaw,
        seconHeadingdRaw,
        secondWidgetRaw,
      );
    } else {
      lambdaDashboard.addWidgets(
        titleWidget,
        firstHeadingRaw,
        firstWidgetRaw,
        seconHeadingdRaw,
        secondWidgetRaw,
      );
    }
    if (props.showInsightsMetrics === true) {
      lambdaDashboard.addWidgets(
        insightWidget,
        memoryWidget,
        cpuWidget,
        networkWidget,
      );
    }
    lambdaDashboard.addWidgets(tableWidget);

    this.dashboardArn = lambdaDashboard.dashboardArn;
  }
}
