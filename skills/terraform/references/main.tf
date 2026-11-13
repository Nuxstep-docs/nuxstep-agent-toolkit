# Blueprint: estrutura por ambiente + nomenclatura de recursos.
#
# Layout do repositório:
#   modules/<nome>/        — reutilizáveis; recebem NOMES PRONTOS e usam verbatim
#   environments/<env>/    — instanciam os módulos; cada um com state e tfvars próprios
#
# ============================================================================
# environments/prod/terraform.tfvars — só valores PUROS (dados, sem composição;
# nomes de variáveis em snake_case — hífen só nos VALORES)
# ============================================================================
# environment  = "prod"
# project_name = "backup-hosting01-directadmin"
# aws_region   = "us-east-1"

# ============================================================================
# environments/prod/main.tf
# ============================================================================
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  backend "s3" {
    bucket       = "nuxstep-terraform-state"
    key          = "prod/app/terraform.tfstate"
    region       = "us-east-1"
    use_lockfile = true # locking nativo do S3 (TF 1.11+); DynamoDB locking está deprecado
    encrypt      = true
  }
}

variable "aws_region" {
  description = "The AWS region to deploy into"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "The deployment environment (e.g., prod, hml, dev)"
  type        = string
}

variable "project_name" {
  description = "Pure project name, WITHOUT environment suffix (e.g., backup-hosting01-directadmin)"
  type        = string
}

# TODA composição de nome acontece AQUI (um dono só). Convenção única: sufixo -<env>.
# Nome composto é imutável na prática: renomear = destroy/recreate na maioria dos providers.
locals {
  name = "${var.project_name}-${var.environment}" # => backup-hosting01-directadmin-prod
  # Variante para recursos que proíbem hífen ou têm limite curto (ex.: nomes globais):
  name_compact = replace(local.name, "-", "")
}

provider "aws" {
  region = var.aws_region
  default_tags {
    tags = {
      Environment = var.environment
      Project     = var.project_name
      ManagedBy   = "Terraform"
    }
  }
}

# O módulo recebe os nomes FINAIS — um por recurso nomeável — e usa verbatim.
module "backup" {
  source = "git::https://example.com/terraform/modules/backup.git?ref=v1.2.0"

  vault_name  = local.name            # backup-hosting01-directadmin-prod
  bucket_name = "${local.name}-store" # sub-nome também composto AQUI, nunca dentro do módulo
}

# ============================================================================
# modules/backup/variables.tf — contrato: nome validado, usado exatamente como veio
# (a validation conhece as restrições DESTE recurso e falha no plan, não no apply)
# ============================================================================
# variable "vault_name" {
#   description = "Final backup vault name, used verbatim (no composition inside the module)"
#   type        = string
#   validation {
#     condition     = can(regex("^[a-z0-9][a-z0-9-]{1,48}[a-z0-9]$", var.vault_name))
#     error_message = "vault_name: 3-50 chars, lowercase letters, digits and hyphens, no leading/trailing hyphen."
#   }
# }
#
# resource "aws_backup_vault" "this" {
#   name = var.vault_name # verbatim: o plan mostra exatamente o nome pedido no root
# }
