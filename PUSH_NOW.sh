#!/bin/bash
# One-command push script
# Usage: GITHUB_TOKEN=your_token_here ./PUSH_NOW.sh

cd "/Users/aarsheebhattacharya/Downloads/untitled folder 2/GoTogether"

if [ -z "$GITHUB_TOKEN" ]; then
    echo "❌ GITHUB_TOKEN environment variable not set"
    echo ""
    echo "Quick setup:"
    echo "1. Get token from: https://github.com/settings/tokens/new"
    echo "2. Select 'repo' scope"
    echo "3. Run: GITHUB_TOKEN=your_token ./PUSH_NOW.sh"
    exit 1
fi

echo "🚀 Pushing to GitHub..."
git remote set-url origin https://${GITHUB_TOKEN}@github.com/AarsheeBh/GoTogether.git
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Successfully pushed to GitHub!"
    echo "📍 https://github.com/AarsheeBh/GoTogether"
    # Clean up - remove token from URL
    git remote set-url origin https://github.com/AarsheeBh/GoTogether.git
else
    echo "❌ Push failed. Check your token permissions."
fi
