#!/bin/bash

# IELTS Vocabulary App - Fly.io Deployment Script
# This script automates the deployment to Fly.io
# Optimized for free tier (under $5/month)

set -e

echo "=========================================="
echo "IELTS Vocabulary App - Fly.io Deployment"
echo "=========================================="
echo ""

# Check if flyctl is installed
if ! command -v flyctl &> /dev/null; then
    echo "❌ flyctl not found. Installing..."
    curl -L https://fly.io/install.sh | sh
    export PATH="$HOME/.fly/bin:$PATH"
    echo "✅ flyctl installed"
fi

# Check if logged in
echo "🔍 Checking Fly.io authentication..."
if ! flyctl auth whoami &> /dev/null; then
    echo "❌ Not logged in. Please login:"
    flyctl auth login
else
    echo "✅ Already logged in"
fi

# Create app if it doesn't exist
echo ""
echo "🔍 Checking if app exists..."
if ! flyctl apps list | grep -q "ielts-vocab-app"; then
    echo "📱 Creating new app..."
    flyctl apps create ielts-vocab-app --region sin
    echo "✅ App created"
else
    echo "✅ App already exists"
fi

# Build and deploy
echo ""
echo "🔨 Building and deploying..."
flyctl deploy --remote-only

echo ""
echo "=========================================="
echo "✅ Deployment successful!"
echo "=========================================="
echo ""
echo "📊 Cost Estimate (Free Tier):"
echo "  - VM: 1x shared-cpu-1x (FREE)"
echo "  - Memory: 256MB (FREE)"
echo "  - Auto-stop when idle (saves costs)"
echo "  - Estimated monthly cost: $0"
echo ""
echo "🌐 App URL: https://ielts-vocab-app.fly.dev"
echo ""
echo "To view logs: flyctl logs"
echo "To open app: flyctl open"
