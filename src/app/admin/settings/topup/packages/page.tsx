import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import PackageEditor from "./PackageEditor";

export default async function TopupPackagesPage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;

  if (!session?.user || role !== "ADMIN") {
    redirect("/");
  }

  const packages = await prisma.topupPackage.findMany({
    orderBy: [{ sortOrder: "asc" }, { price: "asc" }],
  });

  return <PackageEditor initialPackages={packages} />;
}
