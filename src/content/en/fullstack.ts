// src/content/en/fullstack.ts
import type { Track, Course, Section, Lesson } from "../../utils/curriculumTypes";
import { tracks as generated } from "./index";

/* ============ helpers ============ */
function collectLessons(opts?: {
  superblockIdIncludes?: string[]; // filtra por superblocks
  blockIdIncludes?: string[];      // palavras que DEVEM aparecer no id do block
  blockIdExcludes?: string[];      // palavras a excluir do id do block
}): Lesson[] {
  const {
    superblockIdIncludes = [],
    blockIdIncludes = [],
    blockIdExcludes = [],
  } = opts ?? {};

  const chosenSB = generated.filter((sb) => {
    const id = (sb.id || "").toLowerCase();
    if (!superblockIdIncludes.length) return true;
    return superblockIdIncludes.some((p) => id.includes(p.toLowerCase()));
  });

  const out: Lesson[] = [];
  for (const sb of chosenSB) {
    for (const course of sb.courses ?? []) {
      const bid = (course.id || "").toLowerCase();

      const incOK =
        !blockIdIncludes.length ||
        blockIdIncludes.some((p) => bid.includes(p.toLowerCase()));
      const excOK =
        !blockIdExcludes.length ||
        !blockIdExcludes.some((p) => bid.includes(p.toLowerCase()));

      if (!incOK || !excOK) continue;

      const ls = course.sections?.flatMap((s) => s.lessons ?? []) ?? [];
      out.push(...ls);
    }
  }

  // dedup por id
  const seen = new Set<string>();
  return out.filter((l) => !seen.has(l.id) && seen.add(l.id));
}

const id = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-");
const section = (title: string, lessons: Lesson[]): Section => ({ id: id(title), title, lessons });
const course   = (title: string, sections: Section[]): Course => ({ id: id(title), title, sections });

/* ============ matérias e seções ============ */
/* ---------- HTML ---------- */
const html = course("HTML", [
  section("Basic HTML", collectLessons({
    superblockIdIncludes: ["responsive-web-design", "responsive-web-design-22"],
    blockIdIncludes: ["basic-html", "html-"],
    blockIdExcludes: ["semantic", "form", "table", "accessib"],
  })),
  // <-- ajuste: só pelo superblock 'semantic-html' (sem includes restritivos)
  section("Semantic HTML", collectLessons({
    superblockIdIncludes: ["semantic-html"],
  })),
  section("Forms and Tables", collectLessons({
    superblockIdIncludes: ["responsive-web-design", "responsive-web-design-22", "semantic-html"],
    blockIdIncludes: ["form", "forms", "table", "tables"],
  })),
  section("Accessibility", collectLessons({
    superblockIdIncludes: ["responsive-web-design", "responsive-web-design-22", "semantic-html"],
    blockIdIncludes: ["accessib", "aria"],
  })),
]);

/* ---------- CSS ---------- */
const css = course("CSS", [
  section("Computer Basics", collectLessons({
    superblockIdIncludes: ["responsive-web-design-22", "the-odin-project", "dev-playground"],
    blockIdIncludes: ["computer", "browsing-the-web", "basics", "introduction"],
  })),
  section("Basic CSS", collectLessons({
    superblockIdIncludes: ["responsive-web-design", "responsive-web-design-22"],
    blockIdIncludes: ["basic-css", "css-foundations", "what-is-css"],
  })),
  section("Design", collectLessons({
    blockIdIncludes: ["design", "ui", "user-interface"],
  })),
  section("Absolute and Relative Units", collectLessons({
    blockIdIncludes: ["relative-and-absolute-units", "relative", "absolute", "units"],
  })),
  section("Pseudo Classes and Elements", collectLessons({
    blockIdIncludes: ["pseudo-classes", "pseudo-elements", "pseudo"],
  })),
  section("Colors", collectLessons({
    blockIdIncludes: ["color", "colors"],
  })),
  section("Styling Forms", collectLessons({
    blockIdIncludes: ["styling-forms"],
  })),
  section("The Box Model", collectLessons({
    blockIdIncludes: ["box-model"],
  })),
  section("Flexbox", collectLessons({
    blockIdIncludes: ["flexbox"],
  })),
  section("Typography", collectLessons({
    blockIdIncludes: ["typograph"],
  })),
  section("Accessibility", collectLessons({
    superblockIdIncludes: ["responsive-web-design", "responsive-web-design-22"],
    blockIdIncludes: ["accessib"],
  })),
  section("Positioning", collectLessons({
    blockIdIncludes: ["position"],
  })),
  section("Attribute Selectors", collectLessons({
    blockIdIncludes: ["attribute-selectors"],
  })),
  section("Responsive Design", collectLessons({
    blockIdIncludes: ["responsive-web-design-principles", "responsive-design", "learn-responsive-web-design"],
  })),
  section("Variables", collectLessons({
    blockIdIncludes: ["variables", "css-variables"],
  })),
  section("Grid", collectLessons({
    blockIdIncludes: ["grid"],
  })),
  section("Animations", collectLessons({
    blockIdIncludes: ["animation", "animations", "transforms"],
  })),
  section("CSS Review", collectLessons({
    blockIdIncludes: ["css-review", "review-css", "review-responsive-web-design"],
  })),
]);

/* ---------- JavaScript ---------- */
const js = course("JavaScript", [
  section("Code Editors", collectLessons({
    blockIdIncludes: ["code-editors", "ides", "editor"],
  })),
  section("Variables and Strings", collectLessons({
    blockIdIncludes: ["variables", "strings"],
  })),
  section("Booleans and Numbers", collectLessons({
    blockIdIncludes: ["booleans", "numbers", "math"],
  })),
  section("Functions", collectLessons({
    blockIdIncludes: ["functions"],
  })),
  section("Arrays", collectLessons({
    blockIdIncludes: ["arrays"],
  })),
  section("Objects", collectLessons({
    blockIdIncludes: ["objects"],
  })),
  section("Loops", collectLessons({
    blockIdIncludes: ["loops"],
  })),
  section("JavaScript Fundamentals Review", collectLessons({
    blockIdIncludes: ["javascript-fundamentals", "js-fundamentals", "review-javascript", "review-dom-manipulation"],
  })),
  section("Higher Order Functions and Callbacks", collectLessons({
    blockIdIncludes: ["higher-order-functions", "callbacks"],
  })),
  section("DOM Manipulation and Events", collectLessons({
    blockIdIncludes: ["dom", "events"],
  })),
  section("JavaScript and Accessibility", collectLessons({
    blockIdIncludes: ["js-a11y", "accessib"],
  })),
  section("Debugging", collectLessons({
    blockIdIncludes: ["debugg"],
  })),
  section("Basic Regex", collectLessons({
    blockIdIncludes: ["regex", "regular-expressions"],
  })),
  section("Form Validation", collectLessons({
    blockIdIncludes: ["form-validation"],
  })),
  section("Dates", collectLessons({
    blockIdIncludes: ["dates", "date-"],
  })),
  section("Audio and Video Events", collectLessons({
    blockIdIncludes: ["audio", "video", "media"],
  })),
  section("Maps and Sets", collectLessons({
    blockIdIncludes: ["maps-and-sets", "maps", "sets"],
  })),
  section("localStorage and CRUD Operations", collectLessons({
    blockIdIncludes: ["localstorage", "crud"],
  })),
  section("Classes", collectLessons({
    blockIdIncludes: ["classes"],
  })),
  section("Recursion", collectLessons({
    blockIdIncludes: ["recursion"],
  })),
  section("Functional Programming", collectLessons({
    blockIdIncludes: ["functional-programming"],
  })),
  section("Asynchronous JavaScript", collectLessons({
    blockIdIncludes: ["async", "asynchron", "promises", "fetch"],
  })),
  section("JavaScript Review", collectLessons({
    blockIdIncludes: ["review-javascript", "javascript-review"],
  })),
]);

/* ---------- Front End Libraries ---------- */
const feLibs = course("Front End Libraries", [
  section("React Fundamentals", collectLessons({
    superblockIdIncludes: ["front-end-development-libraries"],
    blockIdIncludes: ["react"],
    blockIdExcludes: ["hooks", "routing", "state"],
  })),
  section("React State, Hooks, and Routing", collectLessons({
    superblockIdIncludes: ["front-end-development-libraries"],
    blockIdIncludes: ["hooks", "routing", "state", "forms", "data-fetching"],
  })),
  section("Performance", collectLessons({
    blockIdIncludes: ["performance", "web-performance", "review-web-performance"],
  })),
  section("Testing", collectLessons({
    blockIdIncludes: ["testing"],
  })),
  section("CSS Libraries and Frameworks", collectLessons({
    blockIdIncludes: ["css-libraries", "frameworks", "bootstrap", "tailwind"],
  })),
  section("TypeScript Fundamentals", collectLessons({
    blockIdIncludes: ["typescript"],
  })),
]);

/* ---------- Python ---------- */
const python = course("Python", [
  section("Python Basics", collectLessons({
    superblockIdIncludes: ["python-for-everybody", "scientific-computing-with-python"],
    blockIdIncludes: ["python-basics", "introduction-to-python", "introduction-to-strings", "numpy"],
  })),
  section("Loops and Sequences", collectLessons({
    blockIdIncludes: ["loops", "sequences"],
  })),
  section("Dictionaries and Sets", collectLessons({
    blockIdIncludes: ["dictionaries-and-sets"],
  })),
  section("Error Handling", collectLessons({
    blockIdIncludes: ["error-handling"],
  })),
  section("Classes and Objects", collectLessons({
    blockIdIncludes: ["classes-and-objects", "classes"],
  })),
  section("Object-Oriented Programming (OOP)", collectLessons({
    blockIdIncludes: ["object-oriented-programming", "oop"],
  })),
  section("Linear Data Structures", collectLessons({
    blockIdIncludes: ["linear-data-structures"],
  })),
  section("Algorithms", collectLessons({
    blockIdIncludes: ["algorithms"],
  })),
  section("Graphs and Trees", collectLessons({
    blockIdIncludes: ["graphs", "trees"],
  })),
  section("Dynamic Programming", collectLessons({
    blockIdIncludes: ["dynamic-programming"],
  })),
]);

/* ---------- Relational Databases ---------- */
const rdb = course("Relational Databases", [
  section("Bash Fundamentals", collectLessons({
    superblockIdIncludes: ["relational-databases"],
    blockIdIncludes: ["bash-fundamentals", "bash-commands", "bash-boilerplate", "bash-five-programs"],
  })),
  section("Relational Databases", collectLessons({
    superblockIdIncludes: ["relational-databases"],
    blockIdIncludes: ["relational-database", "relational-databases", "sql-and-bash"],
  })),
  section("Bash Scripting", collectLessons({
    superblockIdIncludes: ["relational-databases"],
    blockIdIncludes: ["bash-scripting"],
  })),
  section("SQL and Bash", collectLessons({
    superblockIdIncludes: ["relational-databases"],
    blockIdIncludes: ["sql", "postgres", "student-database"],
  })),
  section("Git", collectLessons({
    blockIdIncludes: ["git"],
  })),
]);

/* ---------- Backend JavaScript ---------- */
const backend = course("Backend JavaScript", [
  section("Node.js Core Libraries", collectLessons({
    superblockIdIncludes: ["back-end-development-and-apis"],
    blockIdIncludes: ["node-core", "node", "modules"],
  })),
  section("Node Package Manager", collectLessons({
    superblockIdIncludes: ["back-end-development-and-apis"],
    blockIdIncludes: ["npm", "managing-packages"],
  })),
  section("HTTP and the Web Standards Model", collectLessons({
    superblockIdIncludes: ["back-end-development-and-apis"],
    blockIdIncludes: ["http", "web-standards"],
  })),
  section("REST API and Web Services", collectLessons({
    superblockIdIncludes: ["back-end-development-and-apis"],
    blockIdIncludes: ["rest", "api", "web-services"],
  })),
  section("Introduction to Express", collectLessons({
    superblockIdIncludes: ["back-end-development-and-apis"],
    blockIdIncludes: ["express", "introduction-to-express"],
    blockIdExcludes: ["middleware"],
  })),
  section("Express Middleware", collectLessons({
    superblockIdIncludes: ["back-end-development-and-apis"],
    blockIdIncludes: ["middleware"],
  })),
  section("Error Handling in Express", collectLessons({
    superblockIdIncludes: ["back-end-development-and-apis"],
    blockIdIncludes: ["error-handling", "express"],
  })),
  section("WebSockets", collectLessons({
    superblockIdIncludes: ["back-end-development-and-apis"],
    blockIdIncludes: ["websocket", "websockets"],
  })),
  section("Node and SQL", collectLessons({
    superblockIdIncludes: ["back-end-development-and-apis", "relational-databases"],
    blockIdIncludes: ["node-and-sql"],
  })),
  section("Security and Privacy", collectLessons({
    superblockIdIncludes: ["back-end-development-and-apis", "information-security"],
    blockIdIncludes: ["security", "privacy", "helmet"],
  })),
  section("Authentication", collectLessons({
    superblockIdIncludes: ["back-end-development-and-apis", "information-security"],
    blockIdIncludes: ["auth"],
  })),
  section("Tooling and Deployment", collectLessons({
    superblockIdIncludes: ["back-end-development-and-apis"],
    blockIdIncludes: ["tooling", "deployment"],
  })),
]);

/* ---------- Career ---------- */
const career = course("Career", [
  section("How to Get a Developer Job", collectLessons({
    blockIdIncludes: ["how-to-get-a-developer-job"],
  })),
  section("Capstone Project", collectLessons({
    blockIdIncludes: ["capstone"],
  })),
  section("Certified Full Stack Developer Exam", collectLessons({
    blockIdIncludes: ["exam-certified-full-stack", "certified-full-stack-developer", "certified-full-stack"],
  })),
]);

export const tracks: Track[] = [
  {
    id: "full-stack",
    title: "Full Stack Developer",
    courses: [html, css, js, feLibs, python, rdb, backend, career],
  },
];

export default tracks;
