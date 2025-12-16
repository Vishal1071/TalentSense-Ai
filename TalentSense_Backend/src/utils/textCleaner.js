export const cleanResumeText = (text) => {
  return text
    .replace(/\r\n|\n|\r/g, " ")
    .replace(/\s+/g, " ")
    .replace(/•/g, "")
    .replace(/[^\x00-\x7F]/g, "")
    .trim();
};
