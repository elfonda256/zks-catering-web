import { redirect } from "next/navigation";

/** Batch planning is part of the production schedule. */
export default function Page() {
  redirect("/admin/production");
}
