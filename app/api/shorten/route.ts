import { createClient } from "@supabase/supabase-js";
import { nanoid } from "nanoid";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  const { longUrl } = await req.json();
  if (!longUrl) return new Response("Missing URL", { status: 400 });

  const shortId = nanoid(6); // Generate a unique ID

  const { data, error } = await supabase
    .from("links")
    .insert([{ short: shortId, long: longUrl }]);

  if (error) return new Response(error.message, { status: 500 });

  return new Response(JSON.stringify({ shortUrl: `${shortId}` }), {
    status: 200,
  });
}
