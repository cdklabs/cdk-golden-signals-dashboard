// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { IAlarm } from 'aws-cdk-lib/aws-cloudwatch';

export function getRandomColor(): string {
  let letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export function getAlarmWidgetHeight(alarms: IAlarm[]): number {
  let height =
    1 + Math.floor(alarms.length / 4) + (alarms.length % 4 != 0 ? 1 : 0);
  return height;
}
