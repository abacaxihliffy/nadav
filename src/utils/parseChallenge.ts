export function parseChallenge(raw: string) {
  const sections = raw.split(/^# --/m); // separa pelas seções
  const challenge: any = {};

  sections.forEach((sec) => {
    if (sec.startsWith("description--")) {
      challenge.description = sec.replace("description--", "").trim();
    } else if (sec.startsWith("instructions--")) {
      challenge.instructions = sec.replace("instructions--", "").trim();
    } else if (sec.startsWith("hints--")) {
      challenge.hints = sec.replace("hints--", "").trim();
    } else if (sec.startsWith("seed--")) {
      challenge.seed = sec.replace("seed--", "").trim();
    } else if (sec.startsWith("solutions--")) {
      challenge.solutions = sec.replace("solutions--", "").trim();
    }
  });

  return challenge;
}
