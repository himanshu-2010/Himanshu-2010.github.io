#!/bin/bash
cd c:\Users\Himak\OneDrive\Documents\my-portfolio

# Abort the current rebase
git rebase --abort

# Hard reset to our commit
git reset --hard HEAD

# Force push to overwrite remote
git push -u origin main --force

echo "Portfolio pushed to GitHub!"
echo "Your live portfolio: https://himanshu-2010.github.io"
