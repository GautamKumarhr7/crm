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
