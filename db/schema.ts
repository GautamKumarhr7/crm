import {
  AnyPgColumn,
  date,
  doublePrecision,
  pgEnum,
  pgTable,
  uniqueIndex,
  serial,
  varchar,
  integer,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";

export const userTypeEnum = pgEnum("user_type", ["admin", "employee"]);

export const Users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name"),
  email: varchar("email").unique(),
  password: varchar("password"),
  department: varchar("department").notNull(),
  designation: varchar("designation"),
  dateOfJoining: date("date_of_joining"),
  sallery: doublePrecision("sallery"),
  roleId: integer("role_id").notNull(),
  type: userTypeEnum("type"),
  pancardNo: varchar("pancard_no").unique(),
  aadharNo: varchar("aadhar_no").unique(),
  pancardUrl: varchar("pancard_url"),
  aadharUrl: varchar("aadhar_url"),
  pfDeduction: boolean("pf_deduction"),
  esiDeduction: boolean("esi_deduction"),
  adminId: integer("admin_id").notNull().default(0),
  createdBy: integer("created_by").references((): AnyPgColumn => Users.id),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdateFn(() => new Date()),
  uanNumber: varchar("uan_number").unique(),
  age: integer("age"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const Projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  code: varchar("code"),
  name: varchar("name"),
  client: varchar("client"),
  category: varchar("category"),
  value: doublePrecision("value"),
  process: varchar("process"),
  status: varchar("status"),
  location: varchar("location"),
  advancement: integer("advancement"),
  startDate: date("start_date"),
  endDate: date("end_date"),
  employeeId: integer("employee_id").references((): AnyPgColumn => Users.id),
  createdBy: integer("created_by").references((): AnyPgColumn => Users.id),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdateFn(() => new Date()),
  createdAt: timestamp("created_at").defaultNow(),
});

export const Bills = pgTable("bills", {
  id: serial("id").primaryKey(),
  code: varchar("code").unique(),
  description: varchar("description"),
  unit: integer("unit"),
  contractAmount: doublePrecision("contract_amount"),
  subrate: doublePrecision("subrate"),
  poQuantity: doublePrecision("po_quantity"),
  billedQuantity: doublePrecision("billed_quantity"),
  noOfContract: integer("no_of_contract"),
  diffValue: doublePrecision("diff_value"),
  status: varchar("status"),
  isDeleted: boolean("is_deleted").default(false),
  createdBy: integer("created_by").references((): AnyPgColumn => Users.id),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdateFn(() => new Date()),
  createdAt: timestamp("created_at").defaultNow(),
});

export const Procurements = pgTable("procurements", {
  id: serial("id").primaryKey(),
  poNumber: varchar("po_number").notNull().unique(),
  vendor: varchar("vendor").notNull(),
  items: varchar("items").notNull(),
  amount: doublePrecision("amount").notNull(),
  raised: date("raised").notNull(),
  expectedDelivery: date("expected_delivery").notNull(),
  progress: varchar("progress").notNull(),
  status: varchar("status").notNull(),
  createdBy: integer("created_by")
    .references((): AnyPgColumn => Users.id)
    .notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdateFn(() => new Date()),
  createdAt: timestamp("created_at").defaultNow(),
});

export const MaterialReconciliations = pgTable("material_reconciliations", {
  id: serial("id").primaryKey(),
  billCode: varchar("bill_code").notNull(),
  description: varchar("description").notNull(),
  unit: varchar("unit").notNull(),
  contRate: doublePrecision("cont_rate").notNull(),
  subRate: doublePrecision("sub_rate").notNull(),
  poQty: doublePrecision("po_qty").notNull(),
  billedQty: doublePrecision("billed_qty").notNull(),
  contTotal: doublePrecision("cont_total").notNull(),
  diffQty: doublePrecision("diff_qty").notNull(),
  diffValue: doublePrecision("diff_value").notNull(),
  status: varchar("status").notNull(),
  createdBy: integer("created_by")
    .references((): AnyPgColumn => Users.id)
    .notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdateFn(() => new Date()),
  createdAt: timestamp("created_at").defaultNow(),
});

export const Invoices = pgTable("invoices", {
  id: serial("id").primaryKey(),
  invoiceId: varchar("invoice_id").notNull().unique(),
  projectId: integer("project_id")
    .references((): AnyPgColumn => Projects.id)
    .notNull(),
  clientOrProject: varchar("client_or_project").notNull(),
  type: varchar("type").notNull(),
  date: date("date").notNull(),
  gst: doublePrecision("gst").default(18).notNull(),
  retention: doublePrecision("retention").default(0).notNull(),
  amount: doublePrecision("amount").notNull(),
  status: varchar("status").notNull(),
  createdBy: integer("created_by")
    .references((): AnyPgColumn => Users.id)
    .notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdateFn(() => new Date()),
  createdAt: timestamp("created_at").defaultNow(),
});

export const Accounts = pgTable("accounts", {
  id: serial("id").primaryKey(),
  code: varchar("code").notNull().unique(),
  name: varchar("name").notNull(),
  type: varchar("type").notNull(),
  balance: doublePrecision("balance").default(0).notNull(),
  parents: varchar("parents"),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdateFn(() => new Date()),
  createdAt: timestamp("created_at").defaultNow(),
});

export const Tenders = pgTable("tenders", {
  id: serial("id").primaryKey(),
  nameOfWork: varchar("name_of_work").notNull(),
  natureOfWorkBriefDescription: varchar(
    "nature_of_work_brief_description",
  ).notNull(),
  clientNameAddress: varchar("client_name_address").notNull(),
  contractNo: varchar("contract_no").notNull().unique(),
  value: doublePrecision("value").notNull(),
  date: date("date").notNull(),
  createdBy: integer("created_by")
    .references((): AnyPgColumn => Users.id)
    .notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdateFn(() => new Date()),
  createdAt: timestamp("created_at").defaultNow(),
});

export const Vendors = pgTable("vendors", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  category: varchar("category").notNull(),
  city: varchar("city").notNull(),
  complianceTax: varchar("compliance_tax").notNull(),
  gstinOrPan: varchar("gstin_or_pan").notNull().unique(),
  status: varchar("status").notNull(),
  createdBy: integer("created_by")
    .references((): AnyPgColumn => Users.id)
    .notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdateFn(() => new Date()),
  createdAt: timestamp("created_at").defaultNow(),
});

export const Contracts = pgTable("contracts", {
  id: serial("id").primaryKey(),
  contractId: varchar("contract_id").notNull().unique(),
  projectId: integer("project_id")
    .references((): AnyPgColumn => Projects.id)
    .notNull(),
  value: doublePrecision("value").notNull(),
  period: varchar("period").notNull(),
  status: varchar("status").notNull(),
  createdBy: integer("created_by")
    .references((): AnyPgColumn => Users.id)
    .notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdateFn(() => new Date()),
  createdAt: timestamp("created_at").defaultNow(),
});

export const Leaves = pgTable("leaves", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references((): AnyPgColumn => Users.id)
    .notNull(),
  type: varchar("type").default("casual").notNull(),
  title: varchar("title").notNull(),
  reason: varchar("reason").notNull(),
  status: varchar("status").default("pending").notNull(),
  approvedBy: integer("approved_by").references((): AnyPgColumn => Users.id),
  rejectionReason: varchar("rejection_reason"),
  createdBy: integer("created_by")
    .references((): AnyPgColumn => Users.id)
    .notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdateFn(() => new Date()),
  createdAt: timestamp("created_at").defaultNow(),
});

export const LeaveAllocations = pgTable("leave_allocations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references((): AnyPgColumn => Users.id)
    .notNull(),
  sick: integer("sick").default(0),
  casual: integer("casual").default(0),
  annual: integer("annual").default(0),
  company: integer("company").default(0),
  other: integer("other").default(0),
  createdBy: integer("created_by")
    .references((): AnyPgColumn => Users.id)
    .notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdateFn(() => new Date()),
  createdAt: timestamp("created_at").defaultNow(),
});

export const Sites = pgTable("sites", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references((): AnyPgColumn => Projects.id),
  name: varchar("name"),
  location: varchar("location"),
  supervisor: varchar("supervisor"),
  count: integer("count"),
  budget: doublePrecision("budget"),
  complexity: varchar("complexity"),
  status: varchar("status"),
  rating: integer("rating"),
  createdBy: integer("created_by").references((): AnyPgColumn => Users.id),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdateFn(() => new Date()),
  createdAt: timestamp("created_at").defaultNow(),
});

export const Works = pgTable("works", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references((): AnyPgColumn => Projects.id),
  contractor: varchar("contractor"),
  description: varchar("description"),
  value: doublePrecision("value"),
  retention: doublePrecision("retention"),
  startDate: date("start_date"),
  target: date("target"),
  type: varchar("type"),
  status: varchar("status"),
  createdBy: integer("created_by").references((): AnyPgColumn => Users.id),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdateFn(() => new Date()),
  createdAt: timestamp("created_at").defaultNow(),
});

export const Milestones = pgTable("milestones", {
  id: serial("id").primaryKey(),
  siteId: integer("site_id").references((): AnyPgColumn => Sites.id),
  title: varchar("title"),
  startDate: date("start_date"),
  endDate: date("end_date"),
  priority: varchar("priority"),
  status: varchar("status"),
  completion: integer("completion"),
});

export const AttendanceLogs = pgTable(
  "attendance_logs",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .references((): AnyPgColumn => Users.id)
      .notNull(),
    attendanceDate: date("attendance_date").notNull(),
    clockIn: timestamp("clock_in"),
    clockOut: timestamp("clock_out"),
    workingHours: doublePrecision("working_hours"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => ({
    userDateUnique: uniqueIndex("attendance_logs_user_date_unique").on(
      table.userId,
      table.attendanceDate,
    ),
  }),
);
