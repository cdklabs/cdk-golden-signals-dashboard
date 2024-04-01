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
import { App, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { GoldenSignalDashboard } from 'golden-signals-dashboard';

export class MyStack extends Stack {
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
# API Reference <a name="API Reference" id="api-reference"></a>

## Constructs <a name="Constructs" id="Constructs"></a>

### GoldenSignalDashboard <a name="GoldenSignalDashboard" id="cdk-golden-signals-dashboard.GoldenSignalDashboard"></a>

#### Initializers <a name="Initializers" id="cdk-golden-signals-dashboard.GoldenSignalDashboard.Initializer"></a>

```typescript
import { GoldenSignalDashboard } from 'cdk-golden-signals-dashboard'

new GoldenSignalDashboard(scope: Construct, id: string, props: CdkGoldenSignalDashboardProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-golden-signals-dashboard.GoldenSignalDashboard.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#cdk-golden-signals-dashboard.GoldenSignalDashboard.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-golden-signals-dashboard.GoldenSignalDashboard.Initializer.parameter.props">props</a></code> | <code><a href="#cdk-golden-signals-dashboard.CdkGoldenSignalDashboardProps">CdkGoldenSignalDashboardProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="cdk-golden-signals-dashboard.GoldenSignalDashboard.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="cdk-golden-signals-dashboard.GoldenSignalDashboard.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="cdk-golden-signals-dashboard.GoldenSignalDashboard.Initializer.parameter.props"></a>

- *Type:* <a href="#cdk-golden-signals-dashboard.CdkGoldenSignalDashboardProps">CdkGoldenSignalDashboardProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-golden-signals-dashboard.GoldenSignalDashboard.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="cdk-golden-signals-dashboard.GoldenSignalDashboard.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-golden-signals-dashboard.GoldenSignalDashboard.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="cdk-golden-signals-dashboard.GoldenSignalDashboard.isConstruct"></a>

```typescript
import { GoldenSignalDashboard } from 'cdk-golden-signals-dashboard'

GoldenSignalDashboard.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="cdk-golden-signals-dashboard.GoldenSignalDashboard.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-golden-signals-dashboard.GoldenSignalDashboard.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#cdk-golden-signals-dashboard.GoldenSignalDashboard.property.goldenSignalDashboardArn">goldenSignalDashboardArn</a></code> | <code>string</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="cdk-golden-signals-dashboard.GoldenSignalDashboard.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `goldenSignalDashboardArn`<sup>Required</sup> <a name="goldenSignalDashboardArn" id="cdk-golden-signals-dashboard.GoldenSignalDashboard.property.goldenSignalDashboardArn"></a>

```typescript
public readonly goldenSignalDashboardArn: string;
```

- *Type:* string

---


## Structs <a name="Structs" id="Structs"></a>

### CdkGoldenSignalDashboardProps <a name="CdkGoldenSignalDashboardProps" id="cdk-golden-signals-dashboard.CdkGoldenSignalDashboardProps"></a>

#### Initializer <a name="Initializer" id="cdk-golden-signals-dashboard.CdkGoldenSignalDashboardProps.Initializer"></a>

```typescript
import { CdkGoldenSignalDashboardProps } from 'cdk-golden-signals-dashboard'

const cdkGoldenSignalDashboardProps: CdkGoldenSignalDashboardProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-golden-signals-dashboard.CdkGoldenSignalDashboardProps.property.account">account</a></code> | <code>string</code> | The AWS account ID this resource belongs to. |
| <code><a href="#cdk-golden-signals-dashboard.CdkGoldenSignalDashboardProps.property.environmentFromArn">environmentFromArn</a></code> | <code>string</code> | ARN to deduce region and account from. |
| <code><a href="#cdk-golden-signals-dashboard.CdkGoldenSignalDashboardProps.property.physicalName">physicalName</a></code> | <code>string</code> | The value passed in by users to the physical name prop of the resource. |
| <code><a href="#cdk-golden-signals-dashboard.CdkGoldenSignalDashboardProps.property.region">region</a></code> | <code>string</code> | The AWS region this resource belongs to. |
| <code><a href="#cdk-golden-signals-dashboard.CdkGoldenSignalDashboardProps.property.dashboardName">dashboardName</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-golden-signals-dashboard.CdkGoldenSignalDashboardProps.property.resourceDimensions">resourceDimensions</a></code> | <code><a href="#cdk-golden-signals-dashboard.CdkGSDashboardResourceProps">CdkGSDashboardResourceProps</a>[]</code> | *No description.* |
| <code><a href="#cdk-golden-signals-dashboard.CdkGoldenSignalDashboardProps.property.resourceType">resourceType</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-golden-signals-dashboard.CdkGoldenSignalDashboardProps.property.createAlarms">createAlarms</a></code> | <code>boolean</code> | If you want to create reasonable CloudWatch Alarms for the resources. |
| <code><a href="#cdk-golden-signals-dashboard.CdkGoldenSignalDashboardProps.property.createEmptyDashboard">createEmptyDashboard</a></code> | <code>boolean</code> | If you want to create dashboards with no live AWS resources. |
| <code><a href="#cdk-golden-signals-dashboard.CdkGoldenSignalDashboardProps.property.showInsightsMetrics">showInsightsMetrics</a></code> | <code>boolean</code> | If you want to see insights metrics for the resources on dashboard. |

---

##### `account`<sup>Optional</sup> <a name="account" id="cdk-golden-signals-dashboard.CdkGoldenSignalDashboardProps.property.account"></a>

```typescript
public readonly account: string;
```

- *Type:* string
- *Default:* the resource is in the same account as the stack it belongs to

The AWS account ID this resource belongs to.

---

##### `environmentFromArn`<sup>Optional</sup> <a name="environmentFromArn" id="cdk-golden-signals-dashboard.CdkGoldenSignalDashboardProps.property.environmentFromArn"></a>

```typescript
public readonly environmentFromArn: string;
```

- *Type:* string
- *Default:* take environment from `account`, `region` parameters, or use Stack environment.

ARN to deduce region and account from.

The ARN is parsed and the account and region are taken from the ARN.
This should be used for imported resources.

Cannot be supplied together with either `account` or `region`.

---

##### `physicalName`<sup>Optional</sup> <a name="physicalName" id="cdk-golden-signals-dashboard.CdkGoldenSignalDashboardProps.property.physicalName"></a>

```typescript
public readonly physicalName: string;
```

- *Type:* string
- *Default:* The physical name will be allocated by CloudFormation at deployment time

The value passed in by users to the physical name prop of the resource.

`undefined` implies that a physical name will be allocated by
  CloudFormation during deployment.
- a concrete value implies a specific physical name
- `PhysicalName.GENERATE_IF_NEEDED` is a marker that indicates that a physical will only be generated
  by the CDK if it is needed for cross-environment references. Otherwise, it will be allocated by CloudFormation.

---

##### `region`<sup>Optional</sup> <a name="region" id="cdk-golden-signals-dashboard.CdkGoldenSignalDashboardProps.property.region"></a>

```typescript
public readonly region: string;
```

- *Type:* string
- *Default:* the resource is in the same region as the stack it belongs to

The AWS region this resource belongs to.

---

##### `dashboardName`<sup>Required</sup> <a name="dashboardName" id="cdk-golden-signals-dashboard.CdkGoldenSignalDashboardProps.property.dashboardName"></a>

```typescript
public readonly dashboardName: string;
```

- *Type:* string

---

##### `resourceDimensions`<sup>Required</sup> <a name="resourceDimensions" id="cdk-golden-signals-dashboard.CdkGoldenSignalDashboardProps.property.resourceDimensions"></a>

```typescript
public readonly resourceDimensions: CdkGSDashboardResourceProps[];
```

- *Type:* <a href="#cdk-golden-signals-dashboard.CdkGSDashboardResourceProps">CdkGSDashboardResourceProps</a>[]

---

##### `resourceType`<sup>Required</sup> <a name="resourceType" id="cdk-golden-signals-dashboard.CdkGoldenSignalDashboardProps.property.resourceType"></a>

```typescript
public readonly resourceType: string;
```

- *Type:* string

---

##### `createAlarms`<sup>Optional</sup> <a name="createAlarms" id="cdk-golden-signals-dashboard.CdkGoldenSignalDashboardProps.property.createAlarms"></a>

```typescript
public readonly createAlarms: boolean;
```

- *Type:* boolean
- *Default:* false

If you want to create reasonable CloudWatch Alarms for the resources.

---

##### `createEmptyDashboard`<sup>Optional</sup> <a name="createEmptyDashboard" id="cdk-golden-signals-dashboard.CdkGoldenSignalDashboardProps.property.createEmptyDashboard"></a>

```typescript
public readonly createEmptyDashboard: boolean;
```

- *Type:* boolean
- *Default:* false

If you want to create dashboards with no live AWS resources.

---

##### `showInsightsMetrics`<sup>Optional</sup> <a name="showInsightsMetrics" id="cdk-golden-signals-dashboard.CdkGoldenSignalDashboardProps.property.showInsightsMetrics"></a>

```typescript
public readonly showInsightsMetrics: boolean;
```

- *Type:* boolean
- *Default:* true

If you want to see insights metrics for the resources on dashboard.

Currently only lambda insights metrices are supported.

---

### CdkGSDashboardResourceProps <a name="CdkGSDashboardResourceProps" id="cdk-golden-signals-dashboard.CdkGSDashboardResourceProps"></a>

#### Initializer <a name="Initializer" id="cdk-golden-signals-dashboard.CdkGSDashboardResourceProps.Initializer"></a>

```typescript
import { CdkGSDashboardResourceProps } from 'cdk-golden-signals-dashboard'

const cdkGSDashboardResourceProps: CdkGSDashboardResourceProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-golden-signals-dashboard.CdkGSDashboardResourceProps.property.account">account</a></code> | <code>string</code> | The AWS account ID this resource belongs to. |
| <code><a href="#cdk-golden-signals-dashboard.CdkGSDashboardResourceProps.property.environmentFromArn">environmentFromArn</a></code> | <code>string</code> | ARN to deduce region and account from. |
| <code><a href="#cdk-golden-signals-dashboard.CdkGSDashboardResourceProps.property.physicalName">physicalName</a></code> | <code>string</code> | The value passed in by users to the physical name prop of the resource. |
| <code><a href="#cdk-golden-signals-dashboard.CdkGSDashboardResourceProps.property.region">region</a></code> | <code>string</code> | The AWS region this resource belongs to. |
| <code><a href="#cdk-golden-signals-dashboard.CdkGSDashboardResourceProps.property.resourceRegion">resourceRegion</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-golden-signals-dashboard.CdkGSDashboardResourceProps.property.resources">resources</a></code> | <code>string[]</code> | *No description.* |

---

##### `account`<sup>Optional</sup> <a name="account" id="cdk-golden-signals-dashboard.CdkGSDashboardResourceProps.property.account"></a>

```typescript
public readonly account: string;
```

- *Type:* string
- *Default:* the resource is in the same account as the stack it belongs to

The AWS account ID this resource belongs to.

---

##### `environmentFromArn`<sup>Optional</sup> <a name="environmentFromArn" id="cdk-golden-signals-dashboard.CdkGSDashboardResourceProps.property.environmentFromArn"></a>

```typescript
public readonly environmentFromArn: string;
```

- *Type:* string
- *Default:* take environment from `account`, `region` parameters, or use Stack environment.

ARN to deduce region and account from.

The ARN is parsed and the account and region are taken from the ARN.
This should be used for imported resources.

Cannot be supplied together with either `account` or `region`.

---

##### `physicalName`<sup>Optional</sup> <a name="physicalName" id="cdk-golden-signals-dashboard.CdkGSDashboardResourceProps.property.physicalName"></a>

```typescript
public readonly physicalName: string;
```

- *Type:* string
- *Default:* The physical name will be allocated by CloudFormation at deployment time

The value passed in by users to the physical name prop of the resource.

`undefined` implies that a physical name will be allocated by
  CloudFormation during deployment.
- a concrete value implies a specific physical name
- `PhysicalName.GENERATE_IF_NEEDED` is a marker that indicates that a physical will only be generated
  by the CDK if it is needed for cross-environment references. Otherwise, it will be allocated by CloudFormation.

---

##### `region`<sup>Optional</sup> <a name="region" id="cdk-golden-signals-dashboard.CdkGSDashboardResourceProps.property.region"></a>

```typescript
public readonly region: string;
```

- *Type:* string
- *Default:* the resource is in the same region as the stack it belongs to

The AWS region this resource belongs to.

---

##### `resourceRegion`<sup>Required</sup> <a name="resourceRegion" id="cdk-golden-signals-dashboard.CdkGSDashboardResourceProps.property.resourceRegion"></a>

```typescript
public readonly resourceRegion: string;
```

- *Type:* string

---

##### `resources`<sup>Required</sup> <a name="resources" id="cdk-golden-signals-dashboard.CdkGSDashboardResourceProps.property.resources"></a>

```typescript
public readonly resources: string[];
```

- *Type:* string[]

---



