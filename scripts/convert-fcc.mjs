/* scripts/convert-fcc.mjs (v7 — lê superblocks/*.json + blocks/*.json)
   Uso (PowerShell):
     $env:FCC_CURR="$PWD\curriculum"
     node .\scripts\convert-fcc.mjs
*/
import { promises as fs } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const ENV_CURR = process.env.FCC_CURR;
const DEFAULT_VENDOR_CURR = path.join(ROOT, "vendor", "freecodecamp", "curriculum");
const DEFAULT_ROOT_CURR   = path.join(ROOT, "curriculum");

async function exists(p){ try{ await fs.stat(p); return true; } catch{ return false; } }
const isDir = async p => (await exists(p)) && (await fs.stat(p)).isDirectory();

const FCC_CURR = ENV_CURR || (await exists(DEFAULT_VENDOR_CURR) ? DEFAULT_VENDOR_CURR : DEFAULT_ROOT_CURR);
const STRUCTURE_DIR = path.join(FCC_CURR, "structure");
const SB_DIR = path.join(STRUCTURE_DIR, "superblocks");
const BLK_DIR = path.join(STRUCTURE_DIR, "blocks");
const CURRICULUM_JSON = path.join(STRUCTURE_DIR, "curriculum.json");
const FALLBACK_BLOCKS_DIR = path.join(FCC_CURR, "challenges", "english", "blocks");

const OUT_DIR = path.join(ROOT, "src", "content", "en");
const OUT_FILE = path.join(OUT_DIR, "index.ts");

const slugify = (s) => (s??"").toString().normalize("NFD").replace(/[\u0300-\u036f]/g,"")
  .toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"");

const titleFromDashed = (d) => (d??"").toString().split("-").map((w,i)=>{
  if (["a","an","the","and","of","in","to","by","with","for"].includes(w)&&i!==0) return w;
  const U=w.toUpperCase(); if (["SQL","CSS","JS","API","OOP","D3"].includes(U)) return U;
  return w.charAt(0).toUpperCase()+w.slice(1);
}).join(" ");

async function readJSON(file){
  const raw = await fs.readFile(file, "utf8");
  return JSON.parse(raw);
}

function normalizeChallenge(ch, idx=0){
  if (!ch) return null;
  if (typeof ch === "string") return slugify(ch);
  if (Array.isArray(ch)) return slugify(ch[0] || `challenge-${idx}`);
  const dashed = ch.dashedName || ch.slug || ch.kebab || ch.name || ch.title || ch.id;
  return dashed ? slugify(dashed) : `challenge-${idx}`;
}

function lessonsFromBlockLike(block){
  let arr = block.challengeOrder || block.challenges || block.items || block.children || [];
  const lessons = [];
  for (let i=0;i<arr.length;i++){
    const dashed = normalizeChallenge(arr[i], i);
    if (!dashed) continue;
    lessons.push({ id: dashed, title: titleFromDashed(dashed) });
  }
  return lessons;
}

async function listJson(dir){
  if (!(await isDir(dir))) return [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  return entries.filter(e => e.isFile() && e.name.endsWith(".json")).map(e => path.join(dir, e.name));
}

// ---------- superblocks/*.json -> blocks/*.json ----------
async function buildFromSuperblocks(){
  if (!(await isDir(SB_DIR)) || !(await isDir(BLK_DIR))) return null;

  const sbFiles = await listJson(SB_DIR);
  if (!sbFiles.length) return null;

  const tracks = [];

  for (const sbFile of sbFiles){
    const sb = await readJSON(sbFile);
    const sbIdRaw = sb.superBlock || sb.superblock || sb.id || sb.slug || sb.name || path.basename(sbFile, ".json");
    const sbId = slugify(sbIdRaw);
    const sbTitle = sb.title || sb.name || titleFromDashed(sbId);

    let blocksList = sb.blocks || sb.children || sb.items || [];
    if (!Array.isArray(blocksList) && blocksList && typeof blocksList === "object"){
      blocksList = Object.values(blocksList);
    }
    if (!Array.isArray(blocksList)) blocksList = [];

    const courses = [];

    for (const b of blocksList){
      const bSlug = typeof b === "string"
        ? slugify(b)
        : slugify(b?.dashedName || b?.block || b?.name || b?.title);

      const bTitle = (typeof b === "string")
        ? titleFromDashed(bSlug)
        : (b?.title || b?.name || b?.block || titleFromDashed(bSlug));

      let lessons = [];
      if (b && typeof b === "object") lessons = lessonsFromBlockLike(b);
      if (!lessons.length) {
        const blockFile = path.join(BLK_DIR, `${bSlug}.json`);
        if (await exists(blockFile)){
          const bData = await readJSON(blockFile);
          lessons = lessonsFromBlockLike(bData);
        }
      }
      if (!lessons.length) continue;
      courses.push({
        id: bSlug,
        title: bTitle,
        sections: [{ id: "modules", title: "Modules", lessons }]
      });
    }

    if (courses.length){
      tracks.push({ id: sbId, title: sbTitle, courses });
    }
  }

  return tracks.length ? tracks : null;
}

// ---------- curriculum.json + blocks/*.json ----------
async function buildFromCurriculumJson(){
  if (!(await exists(CURRICULUM_JSON)) || !(await isDir(BLK_DIR))) return null;
  const curr = await readJSON(CURRICULUM_JSON);
  const sbIds = Array.isArray(curr?.superblocks) ? curr.superblocks : [];
  if (!sbIds.length) return null;

  const tracks = [];
  for (const sbIdRaw of sbIds){
    const sbId = slugify(sbIdRaw);
    let sbTitle = titleFromDashed(sbId);
    const guessSbFile = path.join(SB_DIR, `${sbIdRaw}.json`);
    if (await exists(guessSbFile)){
      try {
        const sb = await readJSON(guessSbFile);
        sbTitle = sb.title || sb.name || sb.superBlock || sbTitle;
      } catch {}
    }

    let blocksList = [];
    if (await exists(guessSbFile)){
      try {
        const sb = await readJSON(guessSbFile);
        blocksList = sb.blocks || sb.children || sb.items || [];
        if (!Array.isArray(blocksList) && blocksList && typeof blocksList === "object"){
          blocksList = Object.values(blocksList);
        }
        if (!Array.isArray(blocksList)) blocksList = [];
      } catch {}
    }

    if (!blocksList.length){
      const blkFiles = await listJson(BLK_DIR);
      for (const f of blkFiles){
        const data = await readJSON(f);
        const sbField = (data.superBlock || data.superblock || "").toString().toLowerCase();
        if (sbField && (sbField === sbIdRaw.toString().toLowerCase() || sbField === sbId)){
          const bSlug = slugify(data.dashedName || data.block || path.basename(f, ".json"));
          blocksList.push(bSlug);
        }
      }
      blocksList = blocksList.filter((v,i,a)=>a.indexOf(v)===i);
    }

    const courses = [];
    for (const b of blocksList){
      const bSlug = typeof b === "string" ? slugify(b) : slugify(b?.dashedName || b?.block || b?.name || b?.title);
      const bTitle = typeof b === "string" ? titleFromDashed(bSlug) : (b?.title || b?.name || b?.block || titleFromDashed(bSlug));

      let lessons = [];
      if (b && typeof b === "object") lessons = lessonsFromBlockLike(b);
      if (!lessons.length){
        const blockFile = path.join(BLK_DIR, `${bSlug}.json`);
        if (await exists(blockFile)){
          const bData = await readJSON(blockFile);
          lessons = lessonsFromBlockLike(bData);
        }
      }
      if (!lessons.length) continue;
      courses.push({ id: bSlug, title: bTitle, sections: [{ id: "modules", title: "Modules", lessons }] });
    }

    if (courses.length) tracks.push({ id: sbId, title: sbTitle, courses });
  }

  return tracks.length ? tracks : null;
}

// ---------- fallback: challenges/english/blocks ----------
function subjectFromSlug(s) {
  if (/\bhtml\b|semantic|forms?|tables?|a11y|accessibilit|links?|images?|media|iframe|svg|responsive-web-design|technical-documentation|tribute|product-landing|survey-form|portfolio|cat-photo|recipe|newspaper|magazine|nutrition-label|balance-sheet|piano/i.test(s)) return ["html","HTML"];
  if (/\bcss\b|flexbox|grid|typograph|color|variable|selector|position|box-model|responsive[- ]design|animation|sass|bootstrap|backgrounds?|borders?|rothko|city-skyline|castle|penguin|markers|magazine/i.test(s)) return ["css","CSS"];
  if (/javascript|^js-|es6|dom|regex|asynch|promise|fetch|function|array|object|loop|class|recursion|functional-programming|debugg|validation|dates?|maps?|sets?|localstorage|crud|event|hoisting|module|import|export|operator|math|conditionals?/i.test(s)) return ["javascript","JavaScript"];
  if (/react|redux|jquery|d3|front-end-development-libraries|web-performance/i.test(s)) return ["fe-libs","Front End Libraries"];
  if (/python|numpy|tensorflow|machine-learning|data-analysis-with-python/i.test(s)) return ["python","Python"];
  if (/relational.*database|sql|postgres|mongodb|mongoose|bash.*sql|student-database|world-cup-database|periodic-table|celestial-bodies|salon-appointment/i.test(s)) return ["relational-db","Relational Databases"];
  if (/node|express|api(s)?|helmet|information-security|quality-assurance|chai|websocket|managing-packages-with-npm|json-apis/i.test(s)) return ["backend-js","Backend JavaScript"];
  if (/how-to-get-a-developer-job|capstone|exam|certified[- ]full[- ]stack/i.test(s)) return ["career","Career"];
  return ["extra","Extra"];
}
const sectionFor = (slug) => slug.startsWith("workshop-") ? "Workshops"
  : slug.startsWith("lab-") ? "Labs"
  : slug.startsWith("lecture-") ? "Lectures"
  : slug.startsWith("quiz-") ? "Quizzes"
  : slug.startsWith("review-") ? "Reviews"
  : (slug.startsWith("build-") || /-projects?$/.test(slug)) ? "Projects" : "Modules";

async function fallbackFromBlocks(blocksDir){
  if (!(await isDir(blocksDir))) return null;
  const entries = await fs.readdir(blocksDir, { withFileTypes: true });
  const slugs = entries.filter(e => e.isDirectory()).map(e => e.name);

  const buckets = new Map();
  for (const s of slugs){
    const [sid, title] = subjectFromSlug(s);
    if (!buckets.has(sid)) buckets.set(sid, { title, items: [] });
    buckets.get(sid).items.push(s);
  }

  const order = ["Modules","Lectures","Workshops","Labs","Projects","Quizzes","Reviews"];
  const tracks = [];
  for (const [sid, { title, items }] of buckets.entries()){
    const bySection = new Map();
    for (const slug of items){
      const sec = sectionFor(slug);
      if (!bySection.has(sec)) bySection.set(sec, []);
      bySection.get(sec).push({ id: slugify(slug), title: titleFromDashed(slug) });
    }
    const sections = Array.from(bySection.entries())
      .sort((a,b) => order.indexOf(a[0]) - order.indexOf(b[0]))
      .map(([name, lessons]) => ({ id: slugify(name), title: name, lessons }));

    tracks.push({ id: sid, title, courses: [{ id: sid, title, sections }] });
  }
  return tracks.length ? tracks : null;
}

function serializeTracks(tracks){
  const header = `// AUTO-GERADO por scripts/convert-fcc.mjs (v7)
import type { Track } from "../../utils/curriculumTypes";

export const tracks: Track[] = `;
  const payload = JSON.stringify(tracks, null, 2)
    .replace(/"id":/g, 'id:')
    .replace(/"title":/g, 'title:')
    .replace(/"courses":/g, 'courses:')
    .replace(/"sections":/g, 'sections:')
    .replace(/"lessons":/g, 'lessons:');
  const footer = ` as unknown as Track[];\n`;
  return header + payload + footer;
}

async function main(){
  await fs.mkdir(OUT_DIR, { recursive: true });

  console.log("v7 | FCC_CURR:", FCC_CURR);

  let tracks = await buildFromSuperblocks();
  if (!tracks) {
    console.log("• superblocks/*.json não disponível — tentando curriculum.json");
    tracks = await buildFromCurriculumJson();
  }
  if (!tracks) {
    console.log("• curriculum.json não resolveu — fallback challenges/english/blocks");
    tracks = await fallbackFromBlocks(FALLBACK_BLOCKS_DIR);
  }
  if (!tracks || !tracks.length) throw new Error("Nada gerado — verifique a pasta FCC_CURR.");

  await fs.writeFile(OUT_FILE, serializeTracks(tracks), "utf8");
  console.log(`? Gerado: ${OUT_FILE}`);
  console.log(`Tracks: ${tracks.length}`);
  for (const t of tracks) console.log(` - ${t.title} (${t.id}) | blocks: ${t.courses?.length ?? 0}`);
}

main().catch(e => { console.error("ERRO:", e.message || e); process.exit(1); });
