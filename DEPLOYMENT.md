# Deployment Guide - Drought Monitoring System

## Overview

This guide covers deploying the drought monitoring system to production using Vercel with Neon PostgreSQL database.

## Prerequisites

- Vercel account
- Neon PostgreSQL account
- Git repository (GitHub/GitLab)
- Node.js 18+ locally
- npm or yarn package manager

## Step 1: Database Setup

### Create Neon Database

1. Go to [neon.tech](https://console.neon.tech)
2. Create new project:
   - Project name: `drought-monitor`
   - Database name: `drought_db`
   - Branch: `main`
3. Note the connection string

### Initialize Database Schema

```bash
# In your local environment
npm install @neondatabase/serverless

# Run migration
export DATABASE_URL="postgresql://user:password@host/dbname"
node scripts/01-create-drought-system.sql
```

Or use Neon SQL Editor to execute the migration script directly.

## Step 2: Environment Configuration

### Local Development

1. Create `.env.local`:

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/drought_db

# Security
JWT_SECRET=your-super-secret-key-min-32-chars-long

# API Configuration
NODE_ENV=development
```

2. Verify connection:

```bash
npm run dev
# Visit http://localhost:3000
```

### Production (Vercel)

1. Connect repository to Vercel:
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your Git repository
   - Select "Next.js" framework

2. Configure environment variables in Vercel dashboard:
   - Project Settings → Environment Variables
   - Add `DATABASE_URL` (from Neon)
   - Add `JWT_SECRET` (generate with `openssl rand -hex 32`)

3. Configure deployment settings:
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

## Step 3: Security Configuration

### SSL/TLS

- Vercel automatically provides HTTPS for `*.vercel.app` domains
- For custom domain, configure SSL in domain provider

### Environment Variable Security

Neon connection string includes credentials:
```
postgresql://user:password@host:5432/db
```

✓ Use Vercel's encrypted environment variables
✓ Never commit `.env.local` to git
✓ Rotate JWT_SECRET periodically

### CORS Configuration

Update your frontend API calls:

```typescript
// Production
const API_URL = process.env.NEXT_PUBLIC_API_URL || window.location.origin;

// Or use relative paths
fetch('/api/auth/login', {...})
```

### Rate Limiting (Recommended)

Add rate limiting middleware:

```typescript
// lib/rate-limit.ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, "1 m"),
});

export async function checkRateLimit(ip: string) {
  const { success } = await ratelimit.limit(ip);
  return success;
}
```

## Step 4: Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod

# Verify deployment
vercel env list
```

Or push to main branch (auto-deploys if connected):

```bash
git add .
git commit -m "Deploy drought system"
git push origin main
```

### Verify Deployment

1. Visit your Vercel deployment URL
2. Test registration: `/register`
3. Test login: `/login`
4. Access dashboard: `/dashboard`
5. Check API: `curl https://your-domain.vercel.app/api/regions`

## Step 5: Domain Configuration

### Custom Domain (Optional)

1. In Vercel project settings:
   - Domains → Add Domain
   - Enter your domain (e.g., `drought-monitor.com`)

2. Update DNS records:
   - A record: `76.76.19.165` (Vercel IP)
   - Or CNAME: `cname.vercel-dns.com`

3. Verify DNS propagation (up to 48 hours)

## Step 6: Database Optimization

### Enable Query Performance

```sql
-- Add indexes for common queries
CREATE INDEX idx_drought_region_date ON drought_indices(region_id, created_at DESC);
CREATE INDEX idx_alerts_status_date ON drought_alerts(status, created_at DESC);
CREATE INDEX idx_weather_region_date ON weather_data(region_id, recorded_date DESC);
```

### Backup Configuration

Neon automatically manages backups:
- Point-in-time recovery (PITR): 7 days (free)
- Upgrade for 30-day retention

### Connection Pooling

Neon PgBouncer pooling is enabled by default:
- Replace database hostname with pooling endpoint
- Max connections: 100 (free tier)
- Upgrade for higher limits

## Step 7: Monitoring & Analytics

### Vercel Analytics

```bash
npm install @vercel/analytics

# In app/layout.tsx
import { Analytics } from "@vercel/analytics/react";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Database Monitoring

Monitor in Neon dashboard:
- Active connections
- Query performance
- Storage usage
- CPU utilization

### Application Logs

```bash
# View Vercel logs
vercel logs --prod

# Stream logs
vercel logs --prod --follow
```

## Step 8: Performance Optimization

### Image Optimization

```typescript
import Image from 'next/image';

<Image
  src="/drought-map.png"
  alt="Drought severity map"
  width={1200}
  height={600}
  priority
/>
```

### Font Optimization

Already configured in `app/layout.tsx`:
```typescript
import { Geist, Geist_Mono } from 'next/font/google';

const geistSans = Geist({ subsets: ['latin'] });
```

### API Response Caching

```typescript
// lib/cache.ts
export async function getCachedData(key: string, fetcher: () => Promise<any>, ttl = 3600) {
  // Use Upstash Redis for distributed caching
  const cached = await redis.get(key);
  if (cached) return cached;
  
  const data = await fetcher();
  await redis.setex(key, ttl, JSON.stringify(data));
  return data;
}
```

## Step 9: Scaling Strategy

### Horizontal Scaling

Vercel handles scaling automatically:
- Function isolation
- Auto-scaling based on load
- Global edge deployment

### Database Scaling

For high load:
1. Neon: Upgrade to dedicated compute
2. Add read replicas for analytics queries
3. Implement caching layer (Redis)
4. Archive old data to cold storage

### Load Testing

```bash
# Install Apache Bench
ab -n 1000 -c 10 https://your-domain.vercel.app/api/regions
```

## Step 10: Disaster Recovery

### Database Backups

```bash
# Export data from Neon
pg_dump --dbname=postgresql://user:pass@host/db > backup.sql

# Restore
psql --dbname=postgresql://user:pass@host/db < backup.sql
```

### Environment Backup

```bash
# Save environment variables locally (encrypted)
vercel env pull .env.local.prod
```

## Troubleshooting

### Database Connection Issues

```bash
# Test connection locally
PGPASSWORD=password psql -h host -U user -d db -c "SELECT 1"

# Check Neon status
vercel env list  # Verify DATABASE_URL is set
```

### API Route Issues

```bash
# Check function logs
vercel logs --prod --filter "api"

# Test endpoint
curl -H "Authorization: Bearer <token>" https://domain/api/regions
```

### Performance Issues

```typescript
// Add performance monitoring
console.time('api-response');
// ... API logic
console.timeEnd('api-response');
```

### Authentication Issues

```bash
# Verify JWT_SECRET is set
vercel env list | grep JWT_SECRET

# Test auth endpoint
curl -X POST https://domain/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"test123"}'
```

## Security Checklist

- [ ] HTTPS enabled (automatic on Vercel)
- [ ] Environment variables encrypted
- [ ] JWT_SECRET set to secure value
- [ ] Rate limiting implemented
- [ ] CORS configured for your domain
- [ ] SQL injection prevention verified
- [ ] Password hashing working (bcrypt)
- [ ] Session cookies HTTP-only
- [ ] Database backups configured
- [ ] Monitoring and alerting set up
- [ ] Error logging configured
- [ ] Audit logging in place

## Monitoring Dashboard

Create Vercel monitoring dashboard:
1. Analytics tab in Vercel
2. Set up alerts for:
   - High error rate (>1%)
   - High latency (>2s)
   - Function timeouts
   - Database connection issues

## Post-Deployment

### Testing Checklist

```bash
# 1. Health check
curl https://your-domain/api/health

# 2. Auth flow
curl -X POST https://your-domain/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!@#",
    "name": "Test User"
  }'

# 3. Data retrieval
curl -H "Authorization: Bearer <token>" \
  https://your-domain/api/regions

# 4. Dashboard access
# Visit https://your-domain/dashboard
```

### User Onboarding

1. Send welcome email with:
   - Login URL
   - API documentation
   - Initial setup guide
2. Schedule training session
3. Provide support contact

## Maintenance Schedule

**Weekly:**
- Check error logs
- Review database metrics
- Verify data ingestion

**Monthly:**
- Review performance metrics
- Update dependencies
- Test disaster recovery

**Quarterly:**
- Security audit
- Penetration testing
- Capacity planning review

## Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Neon Docs**: https://neon.tech/docs
- **Next.js Docs**: https://nextjs.org/docs
- **API Documentation**: See `API_DOCUMENTATION.md`

---

**Production Deployment Complete!** 🚀

Your drought monitoring system is now live and ready for users.
