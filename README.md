# Nevo Test Drive Service

EV test drive scheduling platform.

## 🚀 Quick Start

### 1. Run Boot Script

```bash
curl -sSL https://raw.githubusercontent.com/venkateshcv1809/nevo-test-drive/main/boot.sh | sh
```

### 2. Activate Mise

Follow the instructions at: https://mise.jdx.dev/getting-started.html#activate-mise

```bash
# For bash
echo 'eval "$(~/.local/bin/mise activate bash)"' >> ~/.bashrc
source ~/.bashrc

# For zsh
echo 'eval "$(~/.local/bin/mise activate zsh)"' >> ~/.zshrc
source ~/.zshrc

# For fish
echo '~/.local/bin/mise activate fish | source' > ~/.config/fish/conf.d/mise.fish
```

### 3. Update .env File

Configure these required variables in `.env`:

```bash
# Database Configuration
POSTGRES_DB=nevo_test_drive
POSTGRES_USER=nevo_user
POSTGRES_PASSWORD=your_secure_password
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_HOST_AUTH_METHOD=trust

# Database Connection URL
DATABASE_URL=postgresql://nevo_user:your_secure_password@localhost:5432/nevo_test_drive

# Application Configuration
CORS_ORIGINS=http://localhost:3000

# pgAdmin Configuration (optional)
PGADMIN_LISTEN_PORT=5050
```

### 4. Start Database Container

```bash
docker-compose -f compose-db.yml up -d
```

### 5. Setup Database

```bash
mise run db-setup
```

### 6. Start Development Server

```bash
mise run dev
```

## 🌐 Access Points

- **Web App**: http://localhost:3000
- **API**: http://localhost:8080/v1/api
- **pgAdmin**: http://localhost:5050 (if configured)

## 🛠️ Development Commands

```bash
# Start both API and web applications
mise run dev

# Start individual services
mise run api          # API server only
mise run web          # Web app only

# Database management
mise run db-setup     # Initial database setup
mise run db-reset     # Reset and reseed database
mise run db-studio    # Open Prisma Studio

# Build and test
mise run build        # Build all applications
mise run test         # Run all tests
mise run lint         # Run linting
```

## 📋 Requirements

- Node.js 22.22.1+ (managed by mise)
- Yarn 3.8.7+ (managed by mise)
- Docker/Podman for database
- PostgreSQL (via container)
