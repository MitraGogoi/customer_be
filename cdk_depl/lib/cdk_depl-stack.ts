import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as ecr_asset from "aws-cdk-lib/aws-ecr-assets";
import * as ecr from "aws-cdk-lib/aws-ecr";
import * as ecsPattern from "aws-cdk-lib/aws-ecs-patterns";
import * as elbv2 from "aws-cdk-lib/aws-elasticloadbalancingv2";
import * as servicediscovery from "aws-cdk-lib/aws-servicediscovery";

export class CdkDeplStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create ECS Cluster
    const cluster = new ecs.Cluster(this, "MyCluster", {
      clusterName: "my-cluster",
    });

    // Create Service Discovery Namespace
    const namespace = new servicediscovery.PrivateDnsNamespace(
      this,
      "MyNamespace",
      {
        name: "internal",
        vpc: cluster.vpc,
      }
    );

    // Check if ECR repository exists, if not create it
    const repositoryName = "customer-app";
    const repository = ecr.Repository.fromRepositoryName(
      this,
      "MyECRRepository",
      repositoryName
    );

    // if (!repository) {
    //   // Create ECR Repository if it doesn't exist
    //   const newRepository = new ecr.Repository(this, "NewECRRepository", {
    //     repositoryName: repositoryName,
    //   });
    // }

    // // Build Docker Image and Push to ECR Repository
    // const asset = new ecr_assets.DockerImageAsset(this, "MyDockerImage", {
    //   directory: "./path/to/dockerfile",
    // });

    // Define Fargate Service
    const fargateService = new ecsPattern.ApplicationLoadBalancedFargateService(
      this,
      "MyFargateService",
      {
        taskImageOptions: {
          image: ecs.ContainerImage.fromEcrRepository(repository),
          containerPort: 80,
        },
        memoryLimitMiB: 512,
        cpu: 256,
        cloudMapOptions: {
          cloudMapNamespace: namespace,
          name: "my-microservice", // Service name
        },
      }
    );

    // Output LoadBalancer DNS Name
    new cdk.CfnOutput(this, "LoadBalancerDNS", {
      value: fargateService.loadBalancer.loadBalancerDnsName,
    });

    // Output Service Discovery Namespace Name
    new cdk.CfnOutput(this, "NamespaceName", {
      value: namespace.namespaceName,
    });
  }
}
