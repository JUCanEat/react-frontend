import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "JU Can Eat" },
    { name: "description", content: "Welcome to ObiadUJ/JU Can Eat!" },
  ];
}

export default function Home() {
  return <Welcome />;
}
