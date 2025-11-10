import type { Route } from "./+types/routes/_app/_index";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";


export function meta({}: Route.MetaArgs) {
  return [
    { title: "JU Can Eat" },
    { name: "description", content: "Welcome to JU Can Eat/ObiadUJ!" },
  ];
}

export default function MainUI() {
    return (
      <Outlet />
  );
}