# Quick Start Guide - Drought Monitoring System

## ⚡ 5-Minute Setup

### 1. Local Development (2 min)

```bash
# Clone and install
git clone <repository>
cd drought-system
npm install

# Add database connection
echo "DATABASE_URL=your_neon_connection_string" > .env.local
echo "JWT_SECRET=$(openssl rand -hex 32)" >> .env.local

# Start development server
npm run dev

# Open http://localhost:3000
```

### 2. Create Database (1 min)

Go to [Neon Console](https://console.neon.tech):
1. Create new project
2. Copy connection string
3. Paste into `.env.local`

### 3. Initialize Schema (1 min)

In Neon SQL Editor, run:
```sql
-- Copy contents from scripts/01-create-drought-system.sql
-- Paste and execute in SQL Editor
```

### 4. Test System (1 min)

- Visit http://localhost:3000
- Click "Get Started"
- Register test account
- Access dashboard

---

## 🚀 Deploy to Production (10 min)

### Step 1: Connect to Vercel

```bash
vercel --prod
```

### Step 2: Add Environment Variables

In Vercel Dashboard → Settings → Environment Variables:

```
DATABASE_URL = postgresql://user:pass@host/db
JWT_SECRET = <output from openssl rand -hex 32>
```

### Step 3: Deploy

```bash
git push origin main
# Auto-deploys to Vercel!
```

---

## 📚 Key Documentation

| Need | Document |
|------|----------|
| **API Reference** | `API_DOCUMENTATION.md` |
| **System Features** | `SYSTEM_README.md` |
| **Deployment Help** | `DEPLOYMENT.md` |
| **Configuration** | `PROJECT_CONFIGURATION.md` |
| **Full Summary** | `IMPLEMENTATION_SUMMARY.md` |

---

## 🔑 Environment Variables

```env
# Required
DATABASE_URL=postgresql://user:pass@host:5432/dbname
JWT_SECRET=very-secret-key-min-32-characters

# Optional
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://your-domain.com
```

---

## 📱 Key Pages

| URL | Purpose |
|-----|---------|
| `/` | Landing page |
| `/register` | Create account |
| `/login` | Sign in |
| `/dashboard` | Main dashboard |
| `/dashboard/analytics` | Analytics & reports |

---

## 🔌 API Endpoints (Quick Reference)

### Authentication
```bash
POST /api/auth/register
POST /api/auth/login
```

### Data Submission
```bash
POST /api/data/weather          # Submit weather data
POST /api/data/drought-indices   # Submit drought metrics
POST /api/data/ingest          # Batch ingestion
```

### Data Retrieval
```bash
GET /api/data/weather?region_id=xyz
GET /api/data/drought-indices?region_id=xyz
GET /api/alerts
GET /api/regions
GET /api/analytics/report?days=30
```

### Alert Management
```bash
POST /api/alerts               # Create alert
PATCH /api/alerts             # Update alert status
```

---

## 🧪 Test the API

### Get Access Token

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@waterauth.com",
    "password": "any_password_on_first_register"
  }'
```

### Test Endpoint

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/regions
```

---

## 🗄️ Database Quick Reference

### Connect to Database

```bash
# Using psql (install PostgreSQL CLI)
psql $DATABASE_URL

# Once connected:
\dt                    # List tables
SELECT COUNT(*) FROM users;  # Count users
SELECT * FROM regions;       # View regions
```

### Execute Migration

```bash
# Download SQL file
curl https://raw.githubusercontent.com/yourrepo/scripts/01-create-drought-system.sql > migration.sql

# Execute
psql $DATABASE_URL < migration.sql
```

---

## 🐛 Troubleshooting

### "Connection refused"
```bash
# Check DATABASE_URL
echo $DATABASE_URL

# Test connection
PGPASSWORD=password psql -h host -U user -d dbname -c "SELECT 1"
```

### "401 Unauthorized"
```bash
# Check JWT_SECRET matches
echo $JWT_SECRET | wc -c  # Should be 64+ chars

# Verify token in request
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3000/api/regions
```

### "Cannot find module"
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

## 📊 Sample Data

Pre-loaded sample includes:
- 8 geographic regions
- 24+ weather observations
- Multiple drought indices
- 6 active alerts
- Water resource data

Run this to load:
```bash
# In Neon SQL Editor
-- Copy from scripts/02-seed-data.sql
-- Paste and execute
```

---

## 🔐 Security Quick Tips

- ✅ Never commit `.env.local`
- ✅ Use `JWT_SECRET` with 32+ characters
- ✅ Change default passwords in production
- ✅ Use HTTPS in production (Vercel provides)
- ✅ Rotate secrets regularly

---

## 📈 Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run start           # Start production server

# Database
npm run migrate         # Run migrations
npm run seed           # Load sample data

# Linting
npm run lint           # Check code quality
npm run format         # Format code

# Testing
npm test              # Run tests (when added)
```

---

## 🎯 First 30 Minutes

1. **Setup** (5 min)
   - Clone repo
   - npm install
   - Add DATABASE_URL

2. **Database** (5 min)
   - Create Neon project
   - Run migration
   - Load sample data

3. **Test Locally** (10 min)
   - npm run dev
   - Register account
   - View dashboard
   - Check analytics

4. **Deploy** (10 min)
   - Connect Vercel
   - Add env vars
   - Push to main
   - System live!

---

## 🆘 Need Help?

1. **API Issues** → Read `API_DOCUMENTATION.md`
2. **Setup Issues** → Read `PROJECT_CONFIGURATION.md`
3. **Deployment** → Read `DEPLOYMENT.md`
4. **System Overview** → Read `SYSTEM_README.md`
5. **Everything** → Read `IMPLEMENTATION_SUMMARY.md`

---

## ✅ Verification Checklist

After setup, verify:

- [ ] `npm run dev` starts without errors
- [ ] http://localhost:3000 loads
- [ ] Can register account
- [ ] Can login
- [ ] Dashboard shows data
- [ ] API endpoints respond
- [ ] Database has tables

If all ✅, your system is ready!

---

## 🚀 Next Steps

### Immediate
1. Deploy to production
2. Configure custom domain
3. Set up monitoring

### Short-term
1. Integrate real data sources
2. Configure alerts for your regions
3. Train team on system

### Long-term
1. Customize for your needs
2. Add advanced features
3. Scale infrastructure

---

## 📞 Support Resources

- **Neon Database**: https://neon.tech/docs
- **Next.js**: https://nextjs.org/docs
- **Vercel**: https://vercel.com/docs
- **React**: https://react.dev
- **TypeScript**: https://www.typescriptlang.org/docs

---

**System Version**: 1.0.0
**Last Updated**: January 2025
**Status**: ✅ Production Ready

Happy monitoring! 🌍💧
