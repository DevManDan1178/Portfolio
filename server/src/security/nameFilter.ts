import { Profanity } from "@2toad/profanity";
import { RegExpMatcher, englishDataset } from "obscenity";
import { checkProfanity, ProfanityCheckerConfig } from "glin-profanity";
import { maxNameLength } from "../../../shared/constants/api/globalBoards";

/* Bypassed bad words but for profanity checker. >:( */
const bypassedCurseWords: string[] = [
    // shortened / altered profanity
  "btch",
  "bich",
  "fuq",
  "phuk",
  "fuk",

  // altered spellings
  "fggot",
  "phaggot",
  "niggr",
  "ngger",
  "niggre",
  "niggah",
  "niggar",

  // compact username-style variants
  "dickhed",
  "dckhead",
  "azzhole",
  "cuntz",
  "slutz",
];



/* Profanity */
const profanity = new Profanity();
profanity.addWords(bypassedCurseWords);

/* Obscenity */
const obscenityProfanityMatcher = new RegExpMatcher({
  ...englishDataset.build(),
});

/* Glin */
const glinProfanityConfig: ProfanityCheckerConfig = {
  detectLeetspeak: true,
  allLanguages: true,
  customWords: bypassedCurseWords,
};

export default function checkNameValid(rawName: string | undefined): boolean {
  if (rawName == undefined || rawName.trim().length === 0) {
    return false;
  }

  // Check original input first (leet/symbol detection)
  if (checkProfanity(rawName, glinProfanityConfig).containsProfanity) {
    console.log("glin detected", rawName);
    return false;
  }

  const name = rawName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .replace(/(.)\1+/g, "$1");

  if (name.length > maxNameLength) {
    return false;
  }

  if (profanity.exists(name)) {
    console.log("profanity detected", name);
    return false;
  }

  if (obscenityProfanityMatcher.hasMatch(name)) {
    console.log("obscenity detected", name);
    return false;
  }

  if (containsCloseCurseWord(name)) {
    console.log("levenshtein detected", name);
    return false;
  }

  return true;
}

/* Bad words but for similarity checker. >:( */
const curseWords : string[] = [
    // insult combinations
  "dickhead",
  "asshole",
  "azzhole",
  "bullshit",
  "dipshit",
  "jackass",

  // slur roots / common evasions,
  "faggot",
  "nigger",
  "nigga",
]

/* Check close matches */
function containsCloseCurseWord(name: string): boolean {
  return curseWords.some((word) => {
    // Prevent short words causing false positives
    if (word.length < 4) {
      return false;
    }

    return levenshtein(name, word) <= 1;
  });
}

/* Levenshtein distance */
function levenshtein(a: string, b: string): number {
  const matrix: number[][] = Array.from(
    { length: b.length + 1 },
    () => Array(a.length + 1).fill(0)
  );

  for (let i = 0; i <= b.length; i++) {
    matrix[i][0] = i;
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b[i - 1] === a[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
}