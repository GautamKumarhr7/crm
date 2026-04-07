import bcrypt from "bcrypt";
import { BCRYPT_SALT_ROUNDS } from "../constant/auth.constant";
import { SEED_ADMIN_USER } from "../constant/seed.constant";
import { db } from "./connection";
import { Users } from "./schema";

async function seed() {
  try {
    console.log("🌱 Starting seed...");

    // Insert into database
    await db.insert(Users).values({
      name: SEED_ADMIN_USER.name,
      email: SEED_ADMIN_USER.email,
      password: await bcrypt.hash(
        SEED_ADMIN_USER.rawPassword,
        BCRYPT_SALT_ROUNDS,
      ),
      department: SEED_ADMIN_USER.department,
      roleId: SEED_ADMIN_USER.roleId,
      designation: SEED_ADMIN_USER.designation,
      dateOfJoining: SEED_ADMIN_USER.dateOfJoining,
      sallery: SEED_ADMIN_USER.sallery,
      type: SEED_ADMIN_USER.type,
      pancardNo: SEED_ADMIN_USER.pancardNo,
      aadharNo: SEED_ADMIN_USER.aadharNo,
      pancardUrl: SEED_ADMIN_USER.pancardUrl,
      aadharUrl: SEED_ADMIN_USER.aadharUrl,
      pfDeduction: SEED_ADMIN_USER.pfDeduction,
      esiDeduction: SEED_ADMIN_USER.esiDeduction,
      adminId: SEED_ADMIN_USER.adminId,
      uanNumber: SEED_ADMIN_USER.uanNumber,
      age: SEED_ADMIN_USER.age,
    });

    console.log("✅ Seed completed successfully!");
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

seed();
