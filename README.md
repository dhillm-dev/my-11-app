# PickNWin - Fantasy Sports Platform

A modern fantasy sports platform built with SvelteKit frontend and Phoenix backend, deployed as a monorepo with CI/CD automation.

## 🏗️ Architecture

```
picknwin/
├── apps/
│   ├── web/          # SvelteKit frontend application
│   ├── api/          # Phoenix API backend
│   └── admin/        # Phoenix admin panel
├── packages/
│   └── shared-types/ # Shared TypeScript definitions
├── .github/
│   └── workflows/    # GitHub Actions CI/CD pipelines
└── infra/           # Infrastructure configurations
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20+ and npm
- **Elixir** 1.16+ and Phoenix 1.7+
- **PostgreSQL** 15+
- **Redis** (optional, for caching)

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd picknwin
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Frontend Setup (SvelteKit)**
   ```bash
   cd apps/web
   npm install
   npm run dev
   ```
   Frontend will be available at `http://localhost:5173`

4. **Backend Setup (Phoenix API)**
   ```bash
   cd apps/api
   mix deps.get
   mix ecto.setup
   mix phx.server
   ```
   API will be available at `http://localhost:4000`

5. **Admin Panel Setup (Phoenix)**
   ```bash
   cd apps/admin
   mix deps.get
   mix ecto.setup
   mix phx.server
   ```
   Admin panel will be available at `http://localhost:4001`

6. **Shared Types Package**
   ```bash
   cd packages/shared-types
   npm install
   npm run build
   ```

## 📦 Applications

### Web App (`apps/web`)
- **Framework**: SvelteKit with TypeScript
- **Styling**: Tailwind CSS
- **Testing**: Vitest + Testing Library
- **Linting**: ESLint + Prettier
- **Deployment**: GitHub Pages (static) or Vercel

**Available Scripts:**
```bash
npm run dev          # Development server
npm run build        # Production build
npm run preview      # Preview production build
npm run test         # Run tests
npm run lint         # Run linter
npm run typecheck    # Type checking
```

### API Backend (`apps/api`)
- **Framework**: Phoenix 1.7 with Elixir
- **Database**: PostgreSQL with Ecto
- **Authentication**: JWT tokens
- **Real-time**: Phoenix Channels
- **Deployment**: Fly.io

**Available Commands:**
```bash
mix deps.get         # Install dependencies
mix ecto.setup       # Setup database
mix phx.server       # Start server
mix test             # Run tests
mix credo            # Code analysis
```

### Admin Panel (`apps/admin`)
- **Framework**: Phoenix LiveView
- **UI**: Tailwind CSS
- **Features**: User management, analytics, content moderation
- **Deployment**: Fly.io

## 🔄 CI/CD Pipeline

### GitHub Actions Workflows

1. **Web CI** (`.github/workflows/web-ci.yml`)
   - Runs on push/PR to `main` or `develop`
   - Linting, type checking, testing
   - Build verification for both deployment targets

2. **Web Deploy to GitHub Pages** (`.github/workflows/web-deploy-pages.yml`)
   - Deploys to GitHub Pages on push to `main`
   - Static site generation with SvelteKit adapter

3. **API Deploy to Fly.io** (`.github/workflows/api-deploy-fly.yml`)
   - Deploys API backend to Fly.io
   - Includes database migrations

4. **Admin Deploy to Fly.io** (`.github/workflows/admin-deploy-fly.yml`)
   - Deploys admin panel to Fly.io
   - Asset compilation and database setup

### Required Secrets

Configure these secrets in your GitHub repository:

```bash
# Fly.io Deployment
FLY_API_TOKEN=your-fly-api-token

# Database (for production)
DATABASE_URL=postgresql://user:pass@host:port/db

# External APIs
SOFASCORE_API_KEY=your-api-key
RAPIDAPI_KEY=your-rapidapi-key

# Email Service
SMTP_USERNAME=your-smtp-username
SMTP_PASSWORD=your-smtp-password

# File Storage
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
```

## 🌍 Deployment

### Frontend Deployment Options

#### Option 1: GitHub Pages (Static)
```bash
# Automatic deployment on push to main
# Or manual deployment:
cd apps/web
DEPLOY_TARGET=github-pages npm run build
```

#### Option 2: Vercel
```bash
# Connect your GitHub repo to Vercel
# Set environment variables in Vercel dashboard
DEPLOY_TARGET=vercel npm run build
```

### Backend Deployment (Fly.io)

1. **Install Fly CLI**
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. **Deploy API**
   ```bash
   cd apps/api
   fly deploy
   ```

3. **Deploy Admin**
   ```bash
   cd apps/admin
   fly deploy
   ```

## 🧪 Testing

### Frontend Testing
```bash
cd apps/web
npm run test          # Run all tests
npm run test:watch    # Watch mode
npm run test:ui       # UI mode
```

### Backend Testing
```bash
cd apps/api
mix test              # Run all tests
mix test --cover      # With coverage
```

## 📝 Development Guidelines

### Git Workflow
- `main` - Production branch
- `develop` - Development branch
- `feature/*` - Feature branches
- `hotfix/*` - Hotfix branches

### Code Standards
- **Frontend**: ESLint + Prettier configuration
- **Backend**: Elixir formatter + Credo
- **Commits**: Conventional commit messages
- **PRs**: Required reviews and CI checks

### Environment Variables
- Development: `.env` files (not committed)
- Production: GitHub Secrets and Fly.io secrets
- Staging: Separate environment configurations

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Issues**
   ```bash
   # Check PostgreSQL is running
   pg_ctl status
   
   # Reset database
   mix ecto.reset
   ```

2. **Node Modules Issues**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Elixir Dependencies**
   ```bash
   # Clean and reinstall
   mix deps.clean --all
   mix deps.get
   ```

### Performance Monitoring
- Frontend: Lighthouse CI in GitHub Actions
- Backend: Phoenix LiveDashboard
- Database: Ecto query analysis
- Deployment: Fly.io metrics

## 📚 Documentation

- [SvelteKit Documentation](https://kit.svelte.dev/)
- [Phoenix Framework](https://phoenixframework.org/)
- [Fly.io Deployment](https://fly.io/docs/)
- [GitHub Actions](https://docs.github.com/en/actions)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
# my-web-app
