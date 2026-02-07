#!/bin/bash

# Quick Push Script - Uses Personal Access Token

echo "🚀 Quick Push to GitHub"
echo "======================"
echo ""
echo "To push using a Personal Access Token:"
echo ""
echo "1. Get your token from: https://github.com/settings/tokens"
echo "   (Generate new token → classic → select 'repo' scope)"
echo ""
echo "2. Run this command (replace YOUR_TOKEN with your actual token):"
echo ""
echo "   git remote set-url origin https://YOUR_TOKEN@github.com/AarsheeBh/GoTogether.git"
echo "   git push -u origin main"
echo ""
echo "Or, if you prefer, enter your token here and I'll push for you:"
echo -n "Enter your GitHub Personal Access Token: "
read -s TOKEN
echo ""

if [ -n "$TOKEN" ]; then
    echo "Setting up remote with token..."
    git remote set-url origin https://${TOKEN}@github.com/AarsheeBh/GoTogether.git
    echo "Pushing to GitHub..."
    git push -u origin main
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Successfully pushed to GitHub!"
        echo "Repository: https://github.com/AarsheeBh/GoTogether"
        # Remove token from remote URL for security
        git remote set-url origin https://github.com/AarsheeBh/GoTogether.git
    else
        echo "❌ Push failed. Please check your token and try again."
    fi
else
    echo "No token provided. Please run the script again with a token."
fi
