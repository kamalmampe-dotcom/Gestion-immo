# ImmoGestion Premium - Professional Property Management SaaS

Premium property management platform for Cameroon built with cutting-edge technology. Manage properties, tenants, contracts, payments, and maintenance claims all in one place.

## Overview

ImmoGestion Premium is a modern, secure, and scalable SaaS application designed for property managers and real estate professionals. Built on Next.js 15, TypeScript, Supabase, and Tailwind CSS, it provides an enterprise-grade solution for property portfolio management.

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4, Radix UI
- **Database**: Supabase PostgreSQL with Row Level Security
- **Authentication**: Supabase Auth (Email + Password)
- **Charts**: Recharts
- **UI Components**: Custom Shadcn-like components
- **Export**: jsPDF, jsPDF-AutoTable for PDF/Excel generation

## Features

### Dashboard
- **4 KPI Cards** - Properties, Tenants, Monthly Revenue, Claims overview
- **5 Interactive Charts**:
  - Monthly revenue trend (Line Chart)
  - Occupancy rate (Pie Chart)
  - Revenue by property (Bar Chart)
  - Payment evolution (Line Chart)
  - Claims distribution (Pie Chart)

### Core Modules
1. **Properties Management** - Create, view, edit properties with occupancy status
2. **Tenant Management** - Complete tenant directory with contact information
3. **Contracts** - Digital contract storage, expiration tracking
4. **Payments** - Payment tracking, revenue monitoring, delinquency alerts
5. **Claims & Maintenance** - Kanban-style incident tracking (To Report → In Progress → Resolved)
6. **Reports** - Generate and download comprehensive PDF/Excel reports

### Premium Features
- **Global Search** - Instant search across properties, tenants, contracts, payments
- **Notifications** - Real-time alerts for overdue payments, expiring contracts
- **Export Tools** - PDF and Excel export capabilities
- **Responsive Design** - Fully mobile-responsive with optimized UX
- **Dark Mode Ready** - Foundation for dark theme implementation
- **Performance Optimized** - Sub-2s load times, GPU-accelerated animations

### Security
- Row Level Security (RLS) on all database tables
- Secure authentication with session management
- Security headers (X-Frame-Options, X-Content-Type-Options, etc.)
- Input validation and sanitization
- CSRF protection via middleware

## Getting Started

### Prerequisites
- Node.js 18+ and npm/pnpm
- Supabase account and project
- Vercel account (for deployment)

### Installation

1. **Clone and install dependencies**
```bash
git clone <your-repo>
cd immogestion-premium
npm install
```

2. **Set up environment variables**
```bash
cp .env.example .env.local
```

Then fill in your Supabase credentials:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

3. **Set up Supabase database**
The database schema is auto-managed through Supabase. Tables include:
- `properties` - Property listings
- `tenants` - Tenant information
- `contracts` - Lease agreements
- `payments` - Payment records
- `claims` - Maintenance/damage reports
- `audit_logs` - Activity tracking

4. **Run development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Test Credentials
For development/demo:
- Email: `demo@example.com`
- Password: `DemoPassword123!`

## Project Structure

```
immogestion-premium/
├── app/                          # Next.js app directory
│   ├── auth/                    # Authentication pages
│   ├── dashboard/               # Dashboard and modules
│   ├── globals.css             # Global styles
│   └── layout.tsx              # Root layout
├── components/
│   ├── ui/                      # Base UI components (Button, Card, etc.)
│   ├── dashboard/              # Dashboard components (KPI, Charts)
│   ├── layout/                 # Layout components
│   ├── auth/                   # Auth components
│   ├── search/                 # Global search
│   ├── notifications/          # Notification center
│   └── loading/                # Loading skeletons
├── lib/
│   ├── supabase/              # Supabase client setup
│   ├── utils.ts               # Utility functions
│   └── export.ts              # Export utilities
├── middleware.ts               # Next.js middleware
├── tailwind.config.ts         # Tailwind configuration
└── package.json               # Dependencies
```

## API Routes (Next.js)

Routes are organized under `/app/api/` and use Next.js server actions:

- **Auth**: Handled by Supabase Auth SDK
- **Data**: Direct Supabase client queries with RLS
- **Exports**: PDF/Excel generation on-demand

## Database Schema Highlights

### Properties
```sql
- id (UUID, Primary Key)
- title (String)
- address (String)
- occupancy_status (Enum: occupied/vacant)
- monthly_rent (Decimal)
- user_id (UUID, FK to auth.users)
- created_at (Timestamp)
```

### Tenants
```sql
- id (UUID, Primary Key)
- name (String)
- email (String)
- phone (String)
- property_id (UUID, FK)
- lease_start (Date)
- lease_end (Date)
- user_id (UUID, FK)
```

### Payments
```sql
- id (UUID, Primary Key)
- tenant_id (UUID, FK)
- amount (Decimal)
- due_date (Date)
- paid_date (Date, Nullable)
- status (Enum: pending/paid/overdue)
- user_id (UUID, FK)
```

## Performance Metrics

- **Lighthouse Score**: 90+
- **First Contentful Paint (FCP)**: < 1.5s
- **Time to Interactive (TTI)**: < 2s
- **Cumulative Layout Shift (CLS)**: < 0.1
- **Responsive on**: Mobile, Tablet, Desktop

## Security Considerations

1. **Database**: All queries protected by Supabase RLS policies
2. **Sessions**: Secure cookies, automatic token refresh
3. **API**: All endpoints validate user session
4. **Input**: Sanitization on all user inputs
5. **Rate Limiting**: Implemented at Supabase level
6. **HTTPS Only**: Enforced in production
7. **Headers**: Security headers on all responses

## Deployment to Vercel

1. **Connect GitHub repository** to Vercel
2. **Add environment variables** in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `POSTGRES_URL`

3. **Deploy**:
   ```bash
   vercel deploy
   ```

4. **Custom domain** (optional):
   - Point DNS to Vercel nameservers
   - Configure in Vercel dashboard

## Development

### Build for production
```bash
npm run build
npm start
```

### Run type checking
```bash
npm run type-check
```

### Linting
```bash
npm run lint
```

## Roadmap

### V1.0 (Current)
- Core dashboard with KPIs and charts
- Property and tenant management
- Contract tracking
- Payment monitoring
- Claims management (Kanban)
- Global search
- PDF/Excel exports
- Responsive design

### V1.1 (Planned)
- Email notifications (SendGrid integration)
- WhatsApp integration for alerts
- Advanced filtering and sorting
- Bulk operations
- Custom reports builder
- Audit log viewer

### V2.0 (Future)
- Multi-user teams and roles
- Property co-ownership
- Accounting integration (QuickBooks)
- Mobile app (React Native)
- E-signature for contracts
- Payment gateway integration (Stripe)
- SMS notifications

## Contributing

1. Create a feature branch: `git checkout -b feature/amazing-feature`
2. Commit changes: `git commit -m 'Add amazing feature'`
3. Push to branch: `git push origin feature/amazing-feature`
4. Open a Pull Request

## Support

For issues, questions, or feature requests:
- Email: support@immogestion.cm
- Issues: GitHub Issues
- Documentation: [Wiki](https://github.com/immogestion/wiki)

## License

Proprietary © 2024 ImmoGestion Cameroun. All rights reserved.

## Changelog

### v1.0.0 (2024-06-01)
- Initial release with core features
- Premium design system
- Multi-module management
- Real-time charts and KPIs
- Mobile-responsive interface
