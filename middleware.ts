import { match as matchLocale } from "@formatjs/intl-localematcher";

import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";
import Negotiator from "negotiator";
import { i18n, localeCookieName } from "@/i18n-config";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Create a Supabase client configured to use cookies
  const supabase = createMiddlewareClient({ req, res });

  // Refresh session if expired - required for Server Components
  await supabase.auth.getSession();

  // Check if there is any supported locale in the pathname
  const pathname = req.nextUrl.href.replace(req.nextUrl.origin, "");

  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}`),
  );
  console.log(pathnameIsMissingLocale, pathname, i18n.locales);
  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = getLocale(req);

    // e.g. incoming request is /products
    // The new URL is now /en-US/products
    return NextResponse.redirect(new URL(`/${locale}${pathname}`, req.url));
  }

  // Redirect if there is no locale

  // e.g. incoming request is /products
  // The new URL is now /en-US/products
  return res;
}

// Ensure the middleware is only called for relevant paths.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|api|auth|public|assets|background|.*.png|.*.webp|.*.ttf|.*.oft|.*.woff2|.*.scss).*)",
  ],
};

let locales = ["ko", "en", "ja"];
let defaultLocale = "ko";

// Get the preferred locale, similar to the above or using a library
function getLocale(request: NextRequest): string | undefined {
  // Negotiator expects plain object so we need to transform headers
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  // Use negotiator and intl-localematcher to get best locale
  let languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  // @ts-ignore locales are readonly
  const locales: string[] = i18n.locales;

  const cookieLocale = request.cookies.get(localeCookieName);
  const requestLocales = cookieLocale?.value
    ? [cookieLocale.value, ...languages]
    : languages;

  try {
    return matchLocale(requestLocales, locales, i18n.defaultLocale);
  } catch {
    return i18n.defaultLocale;
  }
}
