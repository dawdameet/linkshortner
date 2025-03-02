import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function RedirectPage({
  params,
}: {
  params: { short: string };
}) {
  const { data } = await supabase
    .from("links")
    .select("long")
    .eq("short", params.short)
    .single();

  if (data?.long) redirect(data.long);
  return <h1>Invalid Link</h1>;
}
