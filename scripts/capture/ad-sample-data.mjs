// AD Account Manager sample data (ticket 09). Fictional people on a fictional contoso.local domain,
// written into a scratch copy's SQLite database. Run from the copy's folder so its Prisma client loads:
//   node --env-file=.env <portfolio>/scripts/capture/ad-sample-data.mjs
import { createRequire } from "node:module";

// Resolve Prisma from the copy being seeded (the current directory), not from this repo.
const load = createRequire(process.cwd() + "/");
const { PrismaClient } = load("@prisma/client");

const prisma = new PrismaClient();
const people = [
  ["Avery", "Lin", "Finance", "Staff Accountant"],
  ["Jordan", "Patel", "Finance", "AP Specialist"],
  ["Morgan", "Reyes", "Operations", "Coordinator"],
  ["Riley", "Okafor", "Operations", "Shift Lead"],
  ["Casey", "Nguyen", "IT", "Support Technician"],
  ["Quinn", "Alvarez", "Sales", "Account Executive"],
  ["Taylor", "Brooks", "Sales", "Account Executive"],
  ["Jamie", "Kowalski", "HR", "Recruiter"],
  ["Drew", "Haddad", "Operations", "Coordinator"],
  ["Skyler", "Moreau", "Finance", "Payroll Analyst"],
  ["Rowan", "Ito", "IT", "Systems Administrator"],
  ["Emerson", "Clarke", "Sales", "Sales Manager"],
];
const hoursAgo = (h) => new Date(Date.now() - h * 3600 * 1000);
const username = (f, l) => (f[0] + l).toLowerCase();

async function main() {
  const admin = await prisma.user.findFirst();
  const templates = await prisma.template.findMany();
  if (!admin || templates.length === 0) throw new Error("run prisma/seed.ts first");
  const byName = (n) => templates.find((t) => t.name.includes(n)) ?? templates[0];

  await prisma.importJobItem.deleteMany();
  await prisma.importJob.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.webhook.deleteMany();

  const jobs = [
    { file: "q4-new-hires.xlsx", template: "Standard", status: "COMPLETED", at: 30, rows: people.slice(0, 9), fail: [] },
    { file: "finance-onboarding.csv", template: "Finance", status: "PARTIAL", at: 6, rows: people.filter((p) => p[2] === "Finance"), fail: [1] },
    { file: "it-contractors.csv", template: "IT", status: "RUNNING", at: 0.05, rows: people.filter((p) => p[2] === "IT").concat([people[5]]), fail: [], pending: 1 },
  ];

  for (const j of jobs) {
    const t = byName(j.template);
    const items = j.rows.map(([first, last, department, jobTitle], i) => {
      const failed = j.fail.includes(i);
      const pending = j.pending && i >= j.rows.length - j.pending;
      return {
        firstName: first,
        lastName: last,
        email: `${username(first, last)}@contoso.com`,
        department,
        jobTitle,
        username: username(first, last),
        status: pending ? "PENDING" : failed ? "FAILED" : "SUCCESS",
        errorMessage: failed ? "A user with this sAMAccountName already exists" : null,
        createdAt: hoursAgo(j.at),
      };
    });
    const created = items.filter((i) => i.status === "SUCCESS").length;
    const failed = items.filter((i) => i.status === "FAILED").length;
    const job = await prisma.importJob.create({
      data: {
        fileName: j.file,
        status: j.status,
        totalUsers: items.length,
        createdUsers: created,
        failedUsers: failed,
        userId: admin.id,
        templateId: t.id,
        createdAt: hoursAgo(j.at),
        items: { create: items },
      },
    });
    await prisma.auditLog.createMany({
      data: [
        { action: "IMPORT_STARTED", entityType: "job", entityId: job.id, entityName: j.file, userId: admin.id, userEmail: admin.email, createdAt: hoursAgo(j.at) },
        ...(j.status === "RUNNING"
          ? []
          : [{ action: `IMPORT_${j.status}`, entityType: "job", entityId: job.id, entityName: j.file, details: JSON.stringify({ created, failed }), userId: admin.id, userEmail: admin.email, createdAt: hoursAgo(j.at - 0.02) }]),
      ],
    });
  }

  await prisma.webhook.create({
    data: { url: "https://hooks.contoso.example/onboarding", description: "Notify HR when accounts are ready", events: "JOB_COMPLETED,JOB_PARTIAL" },
  });
  await prisma.auditLog.createMany({
    data: [
      { action: "TEMPLATE_UPDATED", entityType: "template", entityName: byName("Finance").name, userId: admin.id, userEmail: admin.email, createdAt: hoursAgo(50) },
      { action: "WEBHOOK_CREATED", entityType: "webhook", entityName: "hooks.contoso.example", userId: admin.id, userEmail: admin.email, createdAt: hoursAgo(48) },
    ],
  });
  console.log("sample data:", jobs.length, "jobs,", people.length, "people");
}

await main().finally(() => prisma.$disconnect());
