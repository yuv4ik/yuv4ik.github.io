import path from "node:path";

export const POST_FILE = /^(\d{4})-(\d{2})-(\d{2})-(.+)\.md$/;

// /:year/:month/:day/:title/ from "YYYY-MM-DD-title.md", exactly like Jekyll.
export function postUrlFromFile(file) {
  const m = POST_FILE.exec(path.basename(file));
  if (!m) throw new Error(`Post file name must be YYYY-MM-DD-title.md: ${file}`);
  return `/${m[1]}/${m[2]}/${m[3]}/${m[4]}/`;
}
