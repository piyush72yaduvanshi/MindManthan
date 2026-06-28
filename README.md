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

## 📝 License

MIT License - see [LICENSE](./LICENSE) file for details

## 📞 Support

For questions and support, please open an issue in the GitHub repository.

---

Built with ❤️ by the Hire Mind Team
