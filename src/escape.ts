/**
 * RTD replaces '/' with '-' in the branch name.
 */
export default function escape(name: string): string {
  if (name.indexOf("?") >= 0) {
    throw new Error(`name should not contains ? mark, but it was "${name}"`);
  }
  return name.replace(/\//g, "-");
}
