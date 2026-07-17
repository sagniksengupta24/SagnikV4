/**
 * Resolves public asset paths dynamically to support GitHub Pages subpaths.
 * It prepends process.env.NEXT_PUBLIC_BASE_PATH when built for production.
 */
export function resolveAsset(path: string): string {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  // Ensure basePath starts with a slash and does not have a trailing slash
  const cleanBasePath = basePath === "/" ? "" : basePath.replace(/\/$/, "");
  // Ensure path starts with a slash
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${cleanBasePath}${cleanPath}`;
}
