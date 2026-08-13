import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isStaffRole } from "@/lib/roles";

// প্রতিটা request-এ session refresh করে (Supabase Auth-এর জন্য জরুরি)
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder",
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // getUser কল করা হচ্ছে যাতে session রিফ্রেশ হয়
  const { data: { user } } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;
  if (user && (path === "/admin" || path.startsWith("/admin/"))) {
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
    if (!profile || !isStaffRole(profile.role)) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  } else if (!user && (path === "/admin" || path.startsWith("/admin/"))) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return supabaseResponse;
}
