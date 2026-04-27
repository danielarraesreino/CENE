import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;

    // Redirecionamentos de compatibilidade para novas rotas canônicas
    if (pathname === "/hub") {
      return NextResponse.redirect(new URL("/portal/paciente", req.url));
    }
    if (pathname === "/sos") {
      return NextResponse.redirect(new URL("/portal/paciente/sos", req.url));
    }
    if (pathname.startsWith("/clinical")) {
      const subPath = pathname.replace("/clinical", "");
      return NextResponse.redirect(
        new URL(`/portal/paciente/clinical${subPath}`, req.url)
      );
    }

    return NextResponse.next();
  },
  {
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: [
    "/hub/:path*",
    "/trilha/:path*",
    "/clinical/:path*",
    "/sos",
    "/progresso",
    "/profile",
    "/portal/:path*",
    "/escola/:path*",
    "/chat",
    "/diario",
  ],
};
