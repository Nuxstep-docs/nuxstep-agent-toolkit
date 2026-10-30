terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  backend "s3" {
    bucket         = "nuxstep-terraform-state"
    key            = "prod/app/terraform.tfstate"
    region         = "us-east-1"
    use_lockfile   = true  # locking nativo do S3 (TF 1.11+); DynamoDB locking está deprecado
    encrypt        = true
  }
}

variable "aws_region" {
  description = "The AWS region to deploy into"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "The deployment environment (e.g., prod, dev)"
  type        = string
}

provider "aws" {
  region = var.aws_region
  default_tags {
    tags = {
      Environment = var.environment
      Project     = "NuxstepCore"
      ManagedBy   = "Terraform"
    }
  }
}
