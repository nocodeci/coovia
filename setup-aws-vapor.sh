#!/bin/bash

# Script de configuration AWS pour Vapor
echo "🔧 Configuration AWS pour Laravel Vapor..."

# Vérification des prérequis
echo "📋 Vérification des prérequis..."

# Vérifier que AWS CLI est installé
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI n'est pas installé. Installation..."
    brew install awscli
fi

# Vérifier que nous avons les permissions d'administrateur
echo "🔑 Vérification des permissions d'administrateur..."
if aws sts get-caller-identity &> /dev/null; then
    echo "✅ AWS CLI configuré."
    aws sts get-caller-identity
else
    echo "❌ AWS CLI non configuré ou credentials invalides."
    exit 1
fi

echo ""
echo "📋 Permissions nécessaires pour Vapor :"
echo "- CloudFormation (Full Access)"
echo "- Lambda (Full Access)"
echo "- API Gateway (Full Access)"
echo "- S3 (Full Access)"
echo "- RDS (Full Access)"
echo "- ElastiCache (Full Access)"
echo "- IAM (Limited - pour créer les rôles)"
echo "- CloudWatch (Full Access)"
echo "- Route 53 (Full Access)"
echo "- Certificate Manager (Full Access)"
echo ""

# Test des services AWS
echo "🧪 Test des services AWS..."

# Test CloudFormation
echo "📦 Test CloudFormation..."
if aws cloudformation list-stacks --max-items 1 &> /dev/null; then
    echo "✅ CloudFormation accessible"
else
    echo "❌ CloudFormation non accessible"
fi

# Test Lambda
echo "⚡ Test Lambda..."
if aws lambda list-functions --max-items 1 &> /dev/null; then
    echo "✅ Lambda accessible"
else
    echo "❌ Lambda non accessible"
fi

# Test S3
echo "🗄️ Test S3..."
if aws s3 ls --max-items 1 &> /dev/null; then
    echo "✅ S3 accessible"
else
    echo "❌ S3 non accessible"
fi

# Test RDS
echo "🗃️ Test RDS..."
if aws rds describe-db-instances --max-items 1 &> /dev/null; then
    echo "✅ RDS accessible"
else
    echo "❌ RDS non accessible"
fi

# Test ElastiCache
echo "🔥 Test ElastiCache..."
if aws elasticache describe-cache-clusters --max-items 1 &> /dev/null; then
    echo "✅ ElastiCache accessible"
else
    echo "❌ ElastiCache non accessible"
fi

echo ""
echo "💡 Si certains services ne sont pas accessibles, vous devez :"
echo "1. Aller dans la console AWS IAM"
echo "2. Créer un nouvel utilisateur ou modifier l'existant"
echo "3. Attacher les politiques suivantes :"
echo "   - AdministratorAccess (pour les tests)"
echo "   - Ou créer une politique personnalisée avec les permissions Vapor"
echo ""
echo "🔗 Console AWS IAM : https://console.aws.amazon.com/iam/"
echo ""

# Configuration de la région
echo "🌍 Configuration de la région..."
aws configure set region us-east-1
echo "✅ Région configurée : us-east-1"

# Test final
echo ""
echo "🎯 Test final de la configuration..."
if aws sts get-caller-identity &> /dev/null; then
    echo "✅ Configuration AWS valide"
    echo ""
    echo "🚀 Vous pouvez maintenant essayer :"
    echo "   vapor init"
    echo "   vapor deploy production"
else
    echo "❌ Configuration AWS invalide"
    exit 1
fi
