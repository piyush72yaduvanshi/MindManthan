# Hire Mind Backend

AI-Powered Job Portal Backend built with Node.js, Fastify, TypeScript, and PostgreSQL.

## 🚀 Features

- 🔐 **Authentication**: JWT, OAuth (Google/GitHub)
- 👥 **User Management**: Profile, roles, permissions
- 💼 **Job Listings**: Search, filters, recommendations
- 📝 **Applications**: Track and manage applications
- 📄 **Resume**: Upload, parse, ATS scoring
- 🏢 **Companies**: Company profiles and verification
- 🔔 **Notifications**: Real-time notifications
- 📊 **Analytics**: Dashboard and reports
- 🔒 **RBAC**: Role-based access control
- 📧 **Email**: Transactional emails
- ☁️ **AWS S3**: File storage
- 🚀 **Production-Ready**: Logging, monitoring, testing

## 🛠️ Tech Stack

- **Runtime**: Node.js 20+
- **Framework**: Fastify
- **Language**: TypeScript
- **Database**: PostgreSQL 16+
- **ORM**: Drizzle ORM
- **Cache**: Redis
- **Storage**: AWS S3
- **Validation**: Zod
- **Testing**: Vitest
- **Documentation**: Swagger/OpenAPI

## 📋 Prerequisites

- Node.js >= 20.0.0
- pnpm >= 8.0.0
- PostgreSQL >= 16
- Redis >= 7

## 🔧 Installation

```bash
# Clone repository
git clone https://github.com/your-org/hire-mind-backend.git
cd hire-mind-backend

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env

# Update .env with your values

# Generate database migrations
pnpm db:generate

# Run migrations
pnpm db:migrate

# Seed database (optional)
pnpm db:seed
```

## 🚀 Development

```bash
# Start development server
pnpm dev

# The server will start on http://localhost:3000
# API documentation available at http://localhost:3000/docs
```

## 📜 Scripts

```bash
pnpm dev              # Start dev server with hot reload
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Lint code
pnpm lint:fix         # Fix linting issues
pnpm format           # Format code with Prettier
pnpm type-check       # TypeScript type checking
pnpm test             # Run unit tests
pnpm test:watch       # Run tests in watch mode
pnpm test:coverage    # Generate coverage report
pnpm test:e2e         # Run E2E tests
pnpm db:generate      # Generate migrations
pnpm db:migrate       # Run migrations
pnpm db:seed          # Seed database
pnpm db:reset         # Reset database
```

## 📁 Project Structure

```
hire-mind-backend/
├── src/
│   ├── config/           # Configuration files
│   ├── database/         # Database schema & migrations
│   ├── modules/          # Feature modules
│   ├── shared/           # Shared utilities
│   ├── services/         # Global services
│   ├── middleware/       # Middleware
│   ├── plugins/          # Fastify plugins
│   ├── routes/           # API routes
│   ├── logger/           # Logger configuration
│   ├── app.ts            # Fastify app setup
│   └── server.ts         # Server startup
├── tests/                # Test files
├── scripts/              # Utility scripts
├── docker/               # Docker configuration
├── docs/                 # Documentation
└── ...
```

See [BACKEND_ARCHITECTURE.md](./BACKEND_ARCHITECTURE.md) for complete architecture documentation.

## 📖 API Documentation

Once the server is running, visit:
- **Swagger UI**: `http://localhost:3000/docs`
- **OpenAPI JSON**: `http://localhost:3000/docs/json`

## 🧪 Testing

```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# Coverage
pnpm test:coverage
```

## 🐳 Docker

```bash
# Build image
docker build -f docker/Dockerfile -t hire-mind-backend .

# Run with Docker Compose
cd docker
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

## 🚀 Deployment

See [docs/deployment/](./docs/deployment/) for deployment guides:
- [AWS](./docs/deployment/aws.md)
- [Docker](./docs/deployment/docker.md)
- [Kubernetes](./docs/deployment/kubernetes.md)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

MIT License - see [LICENSE](./LICENSE) file for details

## 📞 Support

For questions and support, please open an issue in the GitHub repository.

---

Built with ❤️ by the Hire Mind Team
