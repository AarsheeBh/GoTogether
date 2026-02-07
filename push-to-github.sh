#!/bin/bash

# GoTogether - Push to GitHub Script

echo "🚀 GoTogether GitHub Push Script"
echo "================================"
echo ""

# Check if SSH key is added to GitHub
echo "Checking SSH connection to GitHub..."
if ssh -T git@github.com 2>&1 | grep -q "successfully authenticated"; then
    echo "✅ SSH authentication successful!"
    echo ""
    echo "Pushing to GitHub..."
    git push -u origin main
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Successfully pushed to GitHub!"
        echo "Repository: https://github.com/AarsheeBh/GoTogether"
    else
        echo "❌ Push failed. Please check the error above."
    fi
else
    echo "❌ SSH key not yet added to GitHub"
    echo ""
    echo "Please follow these steps:"
    echo "1. Copy your SSH public key:"
    echo ""
    cat ~/.ssh/id_ed25519.pub
    echo ""
    echo "2. Go to: https://github.com/settings/ssh/new"
    echo "3. Paste the key and click 'Add SSH key'"
    echo "4. Run this script again: ./push-to-github.sh"
    echo ""
    echo "Or use a Personal Access Token:"
    echo "1. Go to: https://github.com/settings/tokens"
    echo "2. Generate a new token with 'repo' scope"
    echo "3. Run: git remote set-url origin https://YOUR_TOKEN@github.com/AarsheeBh/GoTogether.git"
    echo "4. Run: git push -u origin main"
fi
