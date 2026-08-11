/**
 * Trim a string to `length` characters without cutting a word in half, then
 * append `appendix` (e.g. " ...").
 */
export const smartTrim = (
  str: string,
  length: number,
  delim: string,
  appendix: string
): string => {
  if (str.length <= length) return str;

  let trimmedStr = str.substr(0, length + delim.length);

  const lastDelimIndex = trimmedStr.lastIndexOf(delim);
  if (lastDelimIndex >= 0) trimmedStr = trimmedStr.substr(0, lastDelimIndex);

  if (trimmedStr) trimmedStr += appendix;
  return trimmedStr;
};

const NAMED_ENTITIES: Record<string, string> = {
  nbsp: " ",
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  hellip: "…",
  mdash: "—",
  ndash: "–",
  rsquo: "’",
  lsquo: "‘",
  ldquo: "“",
  rdquo: "”",
};

/** Decode common HTML entities (e.g. `&nbsp;`, `&#39;`) into their characters. */
export const decodeEntities = (input: string): string => {
  return input.replace(
    /&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g,
    (match, code: string) => {
      if (code[0] === "#") {
        const num =
          code[1] === "x" || code[1] === "X"
            ? parseInt(code.slice(2), 16)
            : parseInt(code.slice(1), 10);
        try {
          return Number.isFinite(num) ? String.fromCodePoint(num) : match;
        } catch {
          return match;
        }
      }
      return NAMED_ENTITIES[code] ?? match;
    }
  );
};

/**
 * Strip HTML to clean plain text: remove tags, decode entities and collapse
 * whitespace. Used to build excerpts and meta descriptions from the editor's
 * HTML output.
 */
export const stripHtml = (str: string): string => {
  return decodeEntities(str.replace(/<[^>]*>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
};
