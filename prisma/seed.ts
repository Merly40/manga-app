import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("admin12345", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      name: "แอดมิน",
      email: "admin@example.com",
      passwordHash,
      role: "ADMIN",
    },
  });

  console.log("สร้างบัญชีแอดมินแล้ว:", admin.email, "(รหัสผ่าน: admin12345)");

  const manga = await prisma.manga.upsert({
    where: { slug: "sample-story" },
    update: {},
    create: {
      title: "เรื่องตัวอย่าง",
      slug: "sample-story",
      description: "นี่คือเรื่องตัวอย่างสำหรับทดสอบระบบ แทนที่ด้วยเรื่องจริงที่คุณมีสิทธิ์เผยแพร่",
      coverUrl: "",
      author: "นักเขียนตัวอย่าง",
      status: "ongoing",
    },
  });

  console.log("สร้างเรื่องตัวอย่างแล้ว:", manga.title);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
