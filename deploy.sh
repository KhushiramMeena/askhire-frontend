#!/bin/bash

# Frontend Build and Deploy Script
# This script builds the frontend and deploys to production server

# Colors for better readability
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
REMOTE_SERVER="root@82.25.109.105"
REMOTE_PATH="~/new-backend/askhire_ui"
BUILD_FOLDER="build" # Adjust if your build folder has a different name (e.g., "dist")

# Function to display error message and exit
function error_exit {
    echo -e "${RED}ERROR: $1${NC}" >&2
    exit 1
}

# Function to display success message
function success_message {
    echo -e "${GREEN}SUCCESS: $1${NC}"
}

# Function to display info message
function info_message {
    echo -e "${YELLOW}INFO: $1${NC}"
}

# Check if we're in a frontend project directory (package.json exists)
if [ ! -f "package.json" ]; then
    error_exit "package.json not found. Please run this script from your frontend project root."
fi

# Confirm config.ts has been updated
echo -e "${YELLOW}IMPORTANT:${NC} Have you changed config.ts with https://askhire.in? (Y/N)"
read -r CONFIG_CONFIRMATION

# Convert to uppercase for easier comparison
CONFIG_CONFIRMATION_UC=$(echo "$CONFIG_CONFIRMATION" | tr '[:lower:]' '[:upper:]')

if [ "$CONFIG_CONFIRMATION_UC" != "Y" ]; then
    error_exit "Build process stopped. Please update config.ts with https://askhire.in and run the script again."
fi
success_message "Config confirmation received. Proceeding with build process."

# Step 1: Remove existing build folder
info_message "Removing existing build folder..."
if [ -d "$BUILD_FOLDER" ]; then
    rm -rf "$BUILD_FOLDER" || error_exit "Failed to remove existing build folder."
    success_message "Existing build folder removed."
else
    info_message "No existing build folder found."
fi

# Step 2: Build the frontend
info_message "Building frontend..."
npm run build || error_exit "Frontend build failed. Check build logs for errors."
success_message "Frontend built successfully."

# Check if build folder was created
if [ ! -d "$BUILD_FOLDER" ]; then
    error_exit "Build folder was not created after npm run build. Check your build configuration."
fi

# Step 3: Remove .map files from build/static directory
info_message "Removing .map files from build/static directory..."
if [ -d "$BUILD_FOLDER/static" ]; then
    MAP_FILES=$(find $BUILD_FOLDER/static -name "*.map" -type f)
    MAP_COUNT=$(echo "$MAP_FILES" | grep -c "\.map$")
    
    if [ $MAP_COUNT -gt 0 ]; then
        echo "$MAP_FILES" | xargs rm -f || error_exit "Failed to remove .map files."
        success_message "Removed $MAP_COUNT .map files from build/static directory."
    else
        info_message "No .map files found in build/static directory."
    fi
else
    info_message "No static directory found in build folder."
fi

# Step 4: Verify SSH connection to the remote server
info_message "Verifying SSH connection to $REMOTE_SERVER..."
ssh -o BatchMode=yes -o ConnectTimeout=5 $REMOTE_SERVER echo "SSH connection successful" > /dev/null 2>&1
if [ $? -ne 0 ]; then
    error_exit "Cannot connect to remote server. Check your SSH configuration and server status."
fi
success_message "SSH connection verified."

# Step 4: Clear the remote askhire_ui folder
info_message "Clearing remote askhire_ui folder..."
ssh $REMOTE_SERVER "if [ -d $REMOTE_PATH ]; then rm -rf $REMOTE_PATH/*; else mkdir -p $REMOTE_PATH; fi" || \
    error_exit "Failed to clear remote askhire_ui folder. Check permissions and path."
success_message "Remote folder cleared."

# Step 5: Copy build contents to remote server
info_message "Copying build folder to remote server..."
scp -r $BUILD_FOLDER/* $REMOTE_SERVER:$REMOTE_PATH/ || \
    error_exit "Failed to copy build files to remote server. Check permissions and connection."
success_message "Build files copied to remote server."

# Verify deployment
info_message "Verifying deployment..."
COUNT=$(ssh $REMOTE_SERVER "find $REMOTE_PATH -type f | wc -l")
if [ "$COUNT" -eq 0 ]; then
    error_exit "Verification failed: No files found in remote directory after deployment."
fi
success_message "Deployment verified with $COUNT files."

echo -e "\n${GREEN}==================================${NC}"
echo -e "${GREEN}DEPLOYMENT COMPLETED SUCCESSFULLY!${NC}"
echo -e "${GREEN}==================================${NC}"
echo "Frontend deployed to $REMOTE_SERVER:$REMOTE_PATH"