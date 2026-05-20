const siteImagePrefixes = ["/images/home/", "/images/travels/"] as const;

function siteImageBaseUrl() {
  return process.env.NEXT_PUBLIC_SITE_IMAGE_BASE_URL?.replace(/\/+$/, "") ?? "";
}

function isSiteImagePath(src: string) {
  return siteImagePrefixes.some((prefix) => src.startsWith(prefix));
}

function storagePathFromSitePath(src: string) {
  if (src.startsWith("/images/home/")) return src.replace("/images/", "");
  if (src.startsWith("/images/travels/")) return src.replace("/images/", "");
  return "";
}

export function normalizeSiteImagePath(src: string) {
  let candidate = src.trim();
  if (!candidate) return "";

  try {
    candidate = decodeURIComponent(candidate);
  } catch {
    return "";
  }

  if (isSiteImagePath(candidate)) return candidate;

  try {
    const url = new URL(candidate, "http://local.site");
    const encodedPath = url.pathname === "/_next/image" ? url.searchParams.get("url") : null;

    if (encodedPath) {
      candidate = decodeURIComponent(encodedPath);
    } else if (url.origin === "http://local.site") {
      candidate = url.pathname;
    } else {
      candidate = `${url.origin}${url.pathname}`;
    }
  } catch {
    return "";
  }

  if (isSiteImagePath(candidate)) return candidate;

  const baseUrl = siteImageBaseUrl();
  if (!baseUrl || !candidate.startsWith(`${baseUrl}/`)) return "";

  const storagePath = candidate.slice(baseUrl.length + 1);
  if (storagePath.startsWith("home/") || storagePath.startsWith("travels/")) {
    return `/images/${storagePath}`;
  }

  return "";
}

export function resolveSiteImageSrc(src: string) {
  const sitePath = normalizeSiteImagePath(src);
  if (!sitePath) return src;

  const baseUrl = siteImageBaseUrl();
  if (!baseUrl) return sitePath;

  return `${baseUrl}/${storagePathFromSitePath(sitePath)}`;
}
