// app/[short]/page.tsx
import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface PageProps {
  params: Promise<{
    short: string;
  }>;
}

export default async function RedirectPage({ params }: PageProps) {
  const resolvedParams = await params;
  const { data, error } = await supabase
    .from("links")
    .select("long")
    .eq("short", resolvedParams.short)
    .single();

  if (error || !data?.long) {
    return <h1 className="text-center mt-20 text-2xl">Invalid or expired link</h1>;
  }

  redirect(data.long);
}