import type { Route } from "./+types/routes/_app/_index";
import { OverviewComponent } from "~/overview/overview";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

export default function Overview() {
    return <OverviewComponent />;
}
