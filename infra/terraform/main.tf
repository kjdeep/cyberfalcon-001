terraform {
  required_version = ">= 1.7.0"
  required_providers { aws = { source = "hashicorp/aws", version = "~> 5.0" } }
}
provider "aws" { region = var.aws_region }
variable "aws_region" { type = string, default = "us-west-2" }
variable "environment" { type = string, default = "demo" }
variable "db_username" { type = string, default = "fleetops" }

resource "aws_s3_bucket" "firmware" { bucket = "falconfleetops-firmware-${var.environment}" }
resource "aws_db_instance" "timescale_placeholder" {
  identifier = "falconfleetops-${var.environment}"
  engine = "postgres"
  instance_class = "db.t4g.medium"
  allocated_storage = 50
  username = var.db_username
  manage_master_user_password = true
  skip_final_snapshot = false
  deletion_protection = true
  backup_retention_period = 7
}

# Production modules must add private networking, KMS, certificate rotation, backups,
# Redis, MQTT broker ACLs and an ECS/Kubernetes service. Secrets are never Terraform literals.
