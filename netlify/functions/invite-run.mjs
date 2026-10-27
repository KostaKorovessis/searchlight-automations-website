// Shared check-off list for the invite run page. One record per stop, so two phones never overwrite each other.
import { getStore } from "@netlify/blobs";

// The team code lives in a Netlify environment variable, never in this public repo.
const RUN_KEY = (globalThis.Netlify?.env?.get("INVITE_RUN_CODE")) || process.env.INVITE_RUN_CODE || "";
const STORE = "invite-run-2026-10-28";
const IDS = new Set(["art-science-physio", "bannon-tax", "benjamin-moore-valley-paint", "benson-auto-parts", "best-western-smiths-falls", "blue-door-spa", "bmo-beckwith", "boston-pizza", "broadview-nursing-home-new", "burger-king-beckwith", "canadian-tire-store", "canopy-growth-lorne", "chartwell-van-horne", "chimo-elementary", "cibc-beckwith", "core-industrial-gases", "dairy-queen-lombard", "dentistry-at-smiths-falls", "diluca-fine-foods", "ds-cpa", "duncan-j-schoular", "fcs-llg-smiths-falls", "food-basics", "gemmells-flowers", "ger-bos", "giant-tiger", "howard-kelford-llp", "iron-forge", "kawartha-cu-smiths-falls", "kirkland-murphy-kennedy", "lanark-paramedic-hq", "lgl-health-unit-smiths-falls", "lighthouse-cafe", "maple-dental", "matty-osheas", "mcdonalds-lombard", "modern-thymes", "napa-smiths-falls", "olympia-cannabis", "opp-east-region-hq", "perfect-thyming", "pizza-pizza-beckwith", "popeyes-lombard", "psfdh-smiths-falls", "rbc-beckwith", "remedysrx-settlers-ridge", "rental-village", "revive-hair-studio", "rexall-beckwith", "rideau-orthodontic", "robbie-wood-cpa", "rona-smiths-falls", "royal-lepage-advantage", "sf-child-development-centre", "sf-optometric-centre", "sf-police-service", "sf-town-hall", "sfdci", "shoppers-drug-mart", "smiths-falls-drug-mart-ida", "smiths-falls-transmission", "st-francis-de-sales", "st-james-cec", "st-luke-chs", "starbucks-lombard", "strands-salon", "studio-16-barbering", "t-cannabis", "tamco", "td-beckwith", "tim-hortons-beckwith", "transition-salon", "vault-eatery", "walmart-supercentre", "wendys-lombard", "wills-transfer", "your-independent-grocer", "yukihana-sushi", "yvonne-lee-law"]);
const STATUSES = new Set(["done", "staff", "closed", "skip"]);
const WHO = new Set(["kosta", "om"]);

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });

export default async (req) => {
  if (!RUN_KEY) return json({ error: "team code not set" }, 503);
  if (req.headers.get("x-run-key") !== RUN_KEY) return json({ error: "wrong team code" }, 403);
  const store = getStore({ name: STORE, consistency: "strong" });

  if (req.method === "GET") {
    const { blobs } = await store.list({ prefix: "v/" });
    const pairs = await Promise.all(
      blobs.map((b) => store.get(b.key, { type: "json" }).then((v) => [b.key.slice(2), v]))
    );
    const visits = {};
    for (const [id, v] of pairs) if (v && IDS.has(id)) visits[id] = v;
    return json({ visits, now: new Date().toISOString() });
  }

  if (req.method === "POST") {
    let body;
    try { body = await req.json(); } catch { return json({ error: "bad json" }, 400); }
    const id = String(body?.id || "");
    if (!IDS.has(id)) return json({ error: "unknown stop" }, 400);
    if (body.v === null) {
      await store.delete("v/" + id);
      return json({ ok: true, id, v: null });
    }
    const v = body.v || {};
    if (!STATUSES.has(v.s)) return json({ error: "bad status" }, 400);
    const clean = {
      s: v.s,
      c: Math.max(0, Math.min(500, parseInt(v.c, 10) || 0)),
      note: String(v.note || "").slice(0, 300),
      by: WHO.has(v.by) ? v.by : "",
      at: new Date().toISOString(),
    };
    await store.setJSON("v/" + id, clean);
    return json({ ok: true, id, v: clean });
  }

  return json({ error: "method not allowed" }, 405);
};

export const config = { path: "/api/invite-run" };
