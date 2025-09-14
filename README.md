# FirstByte Infrastructure Dashboard

A dashboard for tracking FirstByte club participation, attendance, projects, and engagement.

---

## 🚀 Tech Stack

- **Frontend:** Next.js 15, React, TypeScript, Tailwind CSS  
- **Backend:** Prisma ORM, Supabase PostgreSQL  
- **UI Components:** shadcn/ui  
- **Deployment:** Vercel

---

## 📋 Prerequisites

- Node.js 18.x or 20.x  
- npm (or your preferred package manager)  
- Access to the shared Supabase database (ask a project admin for credentials)

---

## 🔐 Environment Setup

1. **Clone the repository**
   ```bash
   git clone [REPO_URL]
   cd [REPO_NAME]
   ```

2. **Copy and update environment variables**
   - Create an `.env.local` file
   - Ask Ameeka or Nick for the Supabase keys
   - Fill in the required values (Should look like this)
     ```
     DATABASE_URL="postgresql://postgres.[URL]:[PASSWORD]@aws-0-us-east-2.pooler.supabase.com:6543/postgres"
     NEXT_PUBLIC_SUPABASE_URL="https://[URL].supabase.co"
     NEXT_PUBLIC_SUPABASE_ANON_KEY="[ANON_KEY]"
     ```

3. **Install dependencies**
   ```bash
   npm install
   ```

---

## 🗄️ Database & Prisma Setup

**Never run `prisma db push` or `prisma migrate dev` on the shared database unless you are coordinating a schema change!**

1. **Pull the latest schema from Supabase**
   ```bash
   npx prisma db pull
   ```
   This syncs your local `schema.prisma` with the database structure.

2. **Generate the Prisma Client**
   ```bash
   npx prisma generate
   ```
   This creates the client code used by the app to interact with the database.

---

## 🛠️ Starting the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Project Features

- **User Management:** Track club members and team memberships  
- **Team Organization:** Manage different club teams  
- **Meeting Tracking:** Schedule and track meetings, workshops, and events  
- **Attendance System:** Record and monitor member attendance  
- **Feedback Collection:** Gather feedback on meetings and events  
- **Analytics Dashboard:** View participation and engagement metrics

---

## 📝 Development Notes

- All database operations go through Prisma ORM  
- UI components use shadcn/ui and Tailwind CSS  
- Dashboard is responsive and accessible  
- Use TypeScript throughout

---

## 🚨 Troubleshooting

**Common Issues:**

- `"Environment variable not found: DATABASE_URL"`  
  - Make sure `.env.local` exists and is filled out  
  - Restart the dev server after any changes

- `"Can't reach database server"`  
  - Confirm your Supabase project is active and credentials are correct  
  - Try using the pooled connection string

- `"Module not found" errors`  
  - Run `npm install` to ensure all dependencies are present

**If you’re stuck:**  
- Check terminal output for error messages  
- Verify your environment variables  
- Contact the development team for help

---

## 🎯 Future Roadmap

- User authentication & authorization  
- Google SSO integration  
- File upload capabilities  
- Linear integration for task management  
- Admin dashboard for content management  
- Individual user workspaces

---

**For any questions or access requests, contact the project admin.**
