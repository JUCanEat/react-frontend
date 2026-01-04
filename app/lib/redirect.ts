export function redirectToMap() {
  if (typeof window !== "undefined") {
    window.location.replace("/map");
  }
}
