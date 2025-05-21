"use server";

import { db } from "@/drizzle/db";
import { ContainerTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function generateBaseReport(containerId: string) {
  if (containerId.length === 0) return;

  return await db.query.ContainerTable.findFirst({
    where: eq(ContainerTable.id, containerId),
    columns: {
      name: true,
    },
    with: {
      containerItems: {
        columns: {},
        with: {
          item: {
            columns: {
              name: true,
            },
          },
        },
      },
    },
  });
}
