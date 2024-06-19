//app/root.tsx
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  json,
  redirect,
  useLoaderData,
} from "@remix-run/react";

import type { LinksFunction } from "@remix-run/node";

import { ReactNode } from "react";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: "/style.css" },
];
export function Layout({ children }: { children: ReactNode }) {
  return (
    <html>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
        <Meta />
        <Links />
      </head>
      <body className="w-screen h-screen overflow-hidden">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

export default function Route() {
  return <Outlet />
}