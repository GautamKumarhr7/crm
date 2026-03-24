import {
  AnyPgColumn,
  date,
  doublePrecision,
  pgEnum,
  pgTable,
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
  department: varchar("department"),
  designation: varchar("designation"),
  dateOfJoining: date("date_of_joining"),
  sallery: doublePrecision("sallery"),
  type: userTypeEnum("type"),
  pancardNo: varchar("pancard_no").unique(),
  aadharNo: varchar("aadhar_no").unique(),
  pancardUrl: varchar("pancard_url"),
  aadharUrl: varchar("aadhar_url"),
  pfDeduction: boolean("pf_deduction"),
  esiDeduction: boolean("esi_deduction"),
  isAdmin: boolean("is_admin").default(false),
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

export const Leaves = pgTable("leaves", {
  id: serial("id").primaryKey(),
  type: varchar("type"),
  total: integer("total"),
});

export const LeaveAllocations = pgTable("leave_allocations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references((): AnyPgColumn => Users.id),
  leaveId: integer("leave_id").references((): AnyPgColumn => Leaves.id),
  status: varchar("status"),
  taken: integer("taken"),
  reason: varchar("reason"),
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
