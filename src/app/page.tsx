import { redirect } from "next/navigation";

export const revalidate = 0;

export default async function Page(): Promise<JSX.Element> {
  return redirect("/dashboard");
}
