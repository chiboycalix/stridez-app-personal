export const generalHelpers = {
  convertToSlug: (sentence: string) => {
    return sentence
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_]+/g, "-");
  },
  convertFromSlug: (slug: string) => {
    return slug
      .replace(/-/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  },
};
