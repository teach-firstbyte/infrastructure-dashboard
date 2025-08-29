This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Tech stack:
- Next.js, Supabase, React, TypeScript
- Backend on Prisma + Supabase
- Hosted on Vercel.


TODOS:
Dashboard to view attendance and statistics of the club, active members, and analytics of the website.
- Ability to log into the system and make an account based on an access code.
  - SSO with Northeastern account.
- Ability to delegate read/write access to certain files within firstbyte drive WITHOUT giving full access to firstbyte gmail(like cmon we should not have everyone on the account) https://developers.google.com/workspace/drive/api/guides/ref-roles 
The ability to send tasks to other users and similar to Linear.
- Ability to have admin accounts.
- Login with Google / Magic Link
- Ability to have multiple teams.
  - CS Curricula Team
  - STEM Curricula Team
- Ability to upload all previous workshops.
- Ability to Assign homework/tasks.
- Ability to track attendance.
- Add feedback form.`
- Ability to upload files.
Reach: 
- Maybe just add linear integration the ability to join a linear workspace from our website and manage tasks, and potentially sync linear tasks to the website easily through the API.
- The ability to actually manage our landing page using a database schema, uploading new team members, etc. And editing the content within the application rather than writing more code to edit the application.
- Individual workspaces for each user—that's a student.


