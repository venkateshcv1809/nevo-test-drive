#!/bin/sh

# Exit immediately if a command exits with a non-zero status
set -e

# Text colors
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

printf "${BLUE}🏎️  Nevo Test Drive | Initializing Environment...${NC}\n"

# 0. Check if in project directory, clone if not
if [ ! -f "mise.toml" ]; then
    printf "${BLUE}📥 Cloning Nevo Test Drive project...${NC}\n"
    git clone https://github.com/venkateshcv1809/nevo-test-drive.git nevo-test-drive-temp
    mv nevo-test-drive-temp/* . 2>/dev/null || true
    mv nevo-test-drive-temp/.* . 2>/dev/null || true
    rmdir nevo-test-drive-temp
    printf "${GREEN}✅ Project downloaded.${NC}\n"
fi

# 1. Check/Install Mise
if ! command -v mise > /dev/null 2>&1; then
    printf "${BLUE}Installing mise (Tool Version Manager)...${NC}\n"
    curl https://mise.jdx.dev/install.sh | sh
    # Add mise to current path for this session
    export PATH="$HOME/.local/bin:$PATH"
    printf "${GREEN}✅ Mise installed.${NC}\n"
else
    printf "${GREEN}✅ Mise is already installed.${NC}\n"
fi

# 2. Trust the mise config
printf "${BLUE}Trusting project mise.toml...${NC}\n"
mise trust

# 3. Install Tools
printf "${BLUE}Installing defined tools from mise.toml...${NC}\n"
mise install

# 4. Handle .env file
if [ ! -f .env ]; then
    printf "${BLUE}Creating .env from .env.example...${NC}\n"
    if [ -f .env.example ]; then
        cp .env.example .env
        printf "${GREEN}✅ .env created.${NC}\n"
    else
        printf "${RED}⚠️  .env.example not found! Creating a blank .env...${NC}\n"
        touch .env
    fi
fi

# 5. Hand off to the mise setup task
printf "${BLUE}Running project setup task...${NC}\n"
mise run setup

printf -- "---\n"
printf "${GREEN}🚀 Environment Ready!${NC}\n"
printf "${BLUE}Run 'mise run dev' to start.${NC}\n"