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

/**
 * Strip HTML tags from a string. Small dependency-free replacement for the old
 * `string-strip-html` package - enough for building meta descriptions.
 */
export const stripHtml = (str: string): string => {
  return str.replace(/<[^>]*>/g, "").trim();
};
