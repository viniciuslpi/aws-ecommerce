#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ProductAppStack } from '../lib/productsApp-stack'
import { EcommerceApiStack } from '../lib/ecommerceApi-stack'

const app = new cdk.App();

const env: cdk.Environment = {
  account: '437318764552',
  region: 'us-east-1'
}

const tags = {
  cost: 'Ecommerce',
  team: 'Vinicius'
}

const productAppStack = new ProductAppStack(app, 'ProductApp', {
  tags,
  env,
})


const ecommerceApiStack = new EcommerceApiStack(app, 'EcommerceApi', {
  productsFetchHandler: productAppStack.productsFetchHandler,
  productsAdminHandler: productAppStack.productsAdminHandler,
  tags,
  env,
})

ecommerceApiStack.addDependency(productAppStack)

