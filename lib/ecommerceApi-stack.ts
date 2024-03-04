import * as lambdaNodejs from 'aws-cdk-lib/aws-lambda-nodejs'
import * as cdk from 'aws-cdk-lib'
import * as apigateway from 'aws-cdk-lib/aws-apigateway'
import * as cwlogs from 'aws-cdk-lib/aws-logs'

import { Construct } from 'constructs'


interface EcommerceApiStackProxy extends cdk.StackProps {
    productsFetchHandler: lambdaNodejs.NodejsFunction
    productsAdminHandler: lambdaNodejs.NodejsFunction
}

export class EcommerceApiStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: EcommerceApiStackProxy) {
        super(scope, id, props)

        cloudWatchRole: true

        const logGroup = new cwlogs.LogGroup(this, 'EcommerceApiLogs')
        const api = new apigateway.RestApi(this, 'EcommerceApi', {
            restApiName: 'EcommerceApi',
            deployOptions: {
                accessLogDestination: new apigateway.LogGroupLogDestination(logGroup),
                accessLogFormat: apigateway.AccessLogFormat.jsonWithStandardFields({
                    httpMethod: true,
                    ip: true,
                    protocol: true,
                    requestTime: true,
                    resourcePath: true,
                    responseLength: true,
                    status: true,
                    caller: true,
                    user: true,
                }),
            },
            cloudWatchRole: true,
        })

        // criação de logs no cloudwatch
        const productsFetchIntegration = new apigateway.LambdaIntegration(props.productsFetchHandler)
        const productsAdminHandler = new apigateway.LambdaIntegration(props.productsAdminHandler)


        // /products
        const productsResource = api.root.addResource('products')
        productsResource.addMethod('GET', productsFetchIntegration)

        // /products/{id}
        const productIdResource = productsResource.addResource('{id}')
        productIdResource.addMethod('GET', productsFetchIntegration)

        const productsAdminIntegration = new apigateway.LambdaIntegration(props.productsAdminHandler)

        // POST /products
        productsResource.addMethod('POST', productsAdminIntegration)
        
        // PUT /products/{id}
        productIdResource.addMethod('PUT', productsAdminIntegration)
        
        // DELETE /products/{id}
        productIdResource.addMethod('DELETE', productsAdminIntegration)

    }
}