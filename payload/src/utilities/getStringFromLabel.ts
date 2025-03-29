import { StaticLabel } from "payload";

/**
 * Converts a StaticLabel to a string
 * @param label - The StaticLabel to convert
 * @param defaultLang - The default language code (defaults to 'en')
 * @returns A string representation of the label
 */
export const getStringFromLabel = (
  label: StaticLabel,
  defaultLang: string = "en",
): string => {
  if (typeof label === "string") return label;

  // Try to get the label in the default language
  if (label[defaultLang]) return label[defaultLang];

  // If the default language isn't available, take the first value
  return Object.values(label)[0] || "";
};
