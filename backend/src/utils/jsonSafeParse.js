export const safeJsonParse = (raw) => {
  try {
    const jsonStart = raw.indexOf("{");
    const jsonEnd = raw.lastIndexOf("}");
    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error("No JSON found");
    }
    const cleaned = raw.slice(jsonStart, jsonEnd + 1);
    return JSON.parse(cleaned);

  } catch (err) {
    throw new Error("AI returned invalid JSON");
  }
};
