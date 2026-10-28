// Shared data for the invite run page.
// RUN store: this run's ticks, one record per stop.
// LIST store: feedback, added businesses and next-time flags. It outlives the run, so the list grows.
import { getStore } from "@netlify/blobs";

const RUN = "invite-run-2026-10-28";
const LIST = "invite-list";
const STOP_IDS = new Set(["art-science-physio", "bannon-tax", "benjamin-moore-valley-paint", "benson-auto-parts", "best-western-smiths-falls", "blue-door-spa", "bmo-beckwith", "boston-pizza", "broadview-nursing-home-new", "burger-king-beckwith", "canadian-tire-store", "canopy-growth-lorne", "chartwell-van-horne", "chimo-elementary", "cibc-beckwith", "core-industrial-gases", "dairy-queen-lombard", "dentistry-at-smiths-falls", "diluca-fine-foods", "ds-cpa", "duncan-j-schoular", "fcs-llg-smiths-falls", "food-basics", "gemmells-flowers", "ger-bos", "giant-tiger", "howard-kelford-llp", "iron-forge", "kawartha-cu-smiths-falls", "kirkland-murphy-kennedy", "lanark-paramedic-hq", "lgl-health-unit-smiths-falls", "lighthouse-cafe", "maple-dental", "matty-osheas", "mcdonalds-lombard", "modern-thymes", "napa-smiths-falls", "olympia-cannabis", "opp-east-region-hq", "perfect-thyming", "pizza-pizza-beckwith", "popeyes-lombard", "psfdh-smiths-falls", "rbc-beckwith", "remedysrx-settlers-ridge", "rental-village", "revive-hair-studio", "rexall-beckwith", "rideau-orthodontic", "robbie-wood-cpa", "rona-smiths-falls", "royal-lepage-advantage", "sf-child-development-centre", "sf-optometric-centre", "sf-police-service", "sf-town-hall", "sfdci", "shoppers-drug-mart", "smiths-falls-drug-mart-ida", "smiths-falls-transmission", "st-francis-de-sales", "st-james-cec", "st-luke-chs", "starbucks-lombard", "strands-salon", "studio-16-barbering", "t-cannabis", "tamco", "td-beckwith", "tim-hortons-beckwith", "transition-salon", "vault-eatery", "walmart-supercentre", "wendys-lombard", "wills-transfer", "your-independent-grocer", "yukihana-sushi", "yvonne-lee-law"]);   // stops on this run's routes
const POOL_IDS = new Set(["a-buck-or-two", "amaya-cafe-bakery", "art-science-physio", "aw-lombard", "bannon-tax", "barburrito-lombard", "bbbs-lanark", "bdo-russell", "beesley-gahrns", "bell-store", "benjamin-moore-valley-paint", "benson-auto-parts", "best-inn-motel", "best-western-smiths-falls", "blair-and-son", "blue-door-spa", "bmo-beckwith", "boomtown-fusion", "boston-pizza", "broadview-nursing-home-new", "burger-king-beckwith", "c-est-tout-bakery", "canada-post-smiths-falls", "canadian-tire-store", "canopy-growth-lorne", "chartwell-van-horne", "chimo-elementary", "chuckles-jack", "cibc-beckwith", "circle-k-main", "circle-k-ultramar-brockville", "community-living-sf", "cooperators-dakers", "core-industrial-gases", "cornelia-court-medical", "costellos-towing", "country-diner", "court-services-chambers", "cpkc-smiths-falls", "crosbie-electric", "croxall-macdonald-law", "dairy-queen-lombard", "denoco-energy", "dentistry-at-smiths-falls", "diluca-fine-foods", "dollar-tree", "dollarama", "dominos-lombard", "drugstore-pharmacy-yig", "drummonds-gas", "ds-cpa", "duncan-j-schoular", "easyhome", "econo-lodge", "esso-96-lombard", "esso-quickie-beckwith", "explorer-realty", "fat-bastard-burrito", "fcs-llg-smiths-falls", "first-choice-haircutters-brockville", "food-basics", "four-degrees-brewing", "g-c-hydraulic", "gemmells-flowers", "ger-bos", "giant-tiger", "golden-triangle-heating", "greater-good-thrift", "guildline-instruments", "guy-saumure-sons", "hair-say", "hanks-tirecraft", "harveys-lombard", "healey-transportation", "howard-kelford-llp", "impression-printing", "iron-forge", "jersey-joes", "kawartha-cu-smiths-falls", "kaycan-weatherstrong", "kfc-lombard", "kilmarnock-enterprise", "king-star-buffet", "kirkland-murphy-kennedy", "kitley-collision", "laceys-furniture", "lanark-county-mental-health", "lanark-county-support-services", "lanark-ontario-works-smiths-falls", "lanark-paramedic-hq", "lannin-funeral-home", "lcbo-70", "lee-tavern", "legion-branch-95", "leisure-days-rv", "lgl-health-unit-smiths-falls", "lifelabs-smiths-falls", "lighthouse-cafe", "little-caesars-brockville", "lockmasters-taphouse", "macewen-scotts-beckwith", "maple-dental", "matty-osheas", "mcdonalds-lombard", "mike-fair-gm", "milano-pizzeria", "mm-food-market", "mobil-waypoint-union", "modern-thymes", "mr-gas-lombard", "my-place-restaurant", "napa-smiths-falls", "national-rent-to-own", "nursery-rhyme-day-care", "olympia-cannabis", "ontario-health-athome-smiths-falls", "open-doors-lanark-sf", "opp-east-region-hq", "otter-creek-dental", "parks-canada-rideau-canal-office", "perfect-thyming", "pet-valu", "phoenix-disaster-control", "pickled-pig", "pizza-hut-lombard", "pizza-pizza-beckwith", "popeyes-lombard", "psfdh-smiths-falls", "quattrocchi", "rbc-beckwith", "remax-affiliates", "remedysrx-settlers-ridge", "rental-village", "revive-hair-studio", "rexall-beckwith", "rexall-cornelia", "rideau-child-care-centre", "rideau-chs-smiths-falls", "rideau-cleaners", "rideau-home-hardware", "rideau-orthodontic", "rideau-valley-diabetes", "rob-roys", "robbie-wood-cpa", "rogers-motel", "rona-smiths-falls", "ross-cooke-cpa", "royal-lepage-advantage", "sagar-indian", "salon-aurora", "scotiabank-lombard", "service-canada-smiths-falls", "serviceontario-smiths-falls", "sf-child-development-centre", "sf-memorial-community-centre", "sf-np-led-clinic", "sf-optometric-centre", "sf-physiotherapy", "sf-police-service", "sf-public-library", "sf-town-hall", "sfdci", "shawarma-on-the-falls", "shoppers-drug-mart", "sip-bistro", "smiths-falls-drug-mart-ida", "smiths-falls-family-pharmacy", "smiths-falls-ford", "smiths-falls-hyundai", "smiths-falls-kia", "smiths-falls-nissan", "smiths-falls-transmission", "st-francis-de-sales", "st-james-cec", "st-luke-chs", "starbucks-lombard", "strands-salon", "studio-16-barbering", "subway-beckwith", "subway-lombard", "t-cannabis", "tamco", "td-beckwith", "the-beer-store", "the-score", "tim-hortons-beckwith", "tim-hortons-lombard", "tim-hortons-toulon", "town-country-chrysler", "tr-leger-smiths-falls", "transition-salon", "trucktown", "ultramar-cornelia", "union-street-bar-grill", "valley-custom-cutting", "vault-eatery", "victoria-house", "walmart-supercentre", "wendys-lombard", "weso-products", "westburne", "wills-transfer", "your-independent-grocer", "yukihana-sushi", "yvonne-lee-law"]);   // every business in the base list
const ROUTES = new Set(["r1", "r2", ""]);
const MAX_FEEDBACK = 600, MAX_ADDED = 400;

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), { status, headers: { "content-type": "application/json", "cache-control": "no-store" } });
const str = (v, n) => String(v ?? "").trim().slice(0, n);
const newId = (p) => p + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

async function readAll(store, prefix) {
  const { blobs } = await store.list({ prefix });
  const pairs = await Promise.all(blobs.map((b) => store.get(b.key, { type: "json" }).then((v) => [b.key.slice(prefix.length), v])));
  return pairs.filter(([, v]) => v);
}

export default async (req) => {
  const run = getStore({ name: RUN, consistency: "strong" });
  const list = getStore({ name: LIST, consistency: "strong" });

  if (req.method === "GET") {
    const [v, f, b, g] = await Promise.all([readAll(run, "v/"), readAll(list, "fb/"), readAll(list, "biz/"), readAll(list, "flag/")]);
    const visits = {}; for (const [id, x] of v) if (STOP_IDS.has(id)) visits[id] = x;
    const flags = {}; for (const [id, x] of g) flags[id] = x;
    return json({
      visits, flags,
      feedback: f.map(([id, x]) => ({ id, ...x })).sort((a, c) => (a.at < c.at ? 1 : -1)),
      added: b.map(([id, x]) => ({ id, ...x })).sort((a, c) => (a.at < c.at ? 1 : -1)),
      now: new Date().toISOString(),
    });
  }
  if (req.method !== "POST") return json({ error: "method not allowed" }, 405);

  let body;
  try { body = await req.json(); } catch { return json({ error: "bad json" }, 400); }
  const at = new Date().toISOString();

  if (body.kind === "visit") {
    const id = str(body.id, 80);
    if (!STOP_IDS.has(id)) return json({ error: "unknown stop" }, 400);
    if (body.v === null) { await run.delete("v/" + id); return json({ ok: true }); }
    const s = body.v?.s;
    if (s !== "done" && s !== "skip") return json({ error: "bad status" }, 400);
    const v = { s, by: ROUTES.has(body.v.by) ? body.v.by : "", at };
    await run.setJSON("v/" + id, v);
    return json({ ok: true, v });
  }

  if (body.kind === "feedback") {
    if (body.del) { await list.delete("fb/" + str(body.del, 40)); return json({ ok: true }); }
    const text = str(body.text, 600);
    if (!text) return json({ error: "empty" }, 400);
    const { blobs } = await list.list({ prefix: "fb/" });
    if (blobs.length >= MAX_FEEDBACK) return json({ error: "feedback list is full" }, 400);
    const stop = str(body.stop, 80);
    const item = { text, route: ROUTES.has(body.route) ? body.route : "", stop: POOL_IDS.has(stop) || stop.startsWith("b") ? stop : "", at };
    const id = newId("f");
    await list.setJSON("fb/" + id, item);
    return json({ ok: true, item: { id, ...item } });
  }

  if (body.kind === "biz") {
    if (body.del) { await list.delete("biz/" + str(body.del, 40)); return json({ ok: true }); }
    if (body.id) { // change "hit today" / "next time"
      const id = str(body.id, 40);
      const cur = await list.get("biz/" + id, { type: "json" });
      if (!cur) return json({ error: "not found" }, 404);
      const next = { ...cur, when: body.when === "today" ? "today" : "next", at: cur.at };
      await list.setJSON("biz/" + id, next);
      return json({ ok: true, item: { id, ...next } });
    }
    const name = str(body.name, 90);
    if (!name) return json({ error: "a name is needed" }, 400);
    const { blobs } = await list.list({ prefix: "biz/" });
    if (blobs.length >= MAX_ADDED) return json({ error: "added list is full" }, 400);
    const staff = Math.max(0, Math.min(5000, parseInt(body.staff, 10) || 0));
    const item = { name, address: str(body.address, 140), staff, when: body.when === "today" ? "today" : "next",
                   note: str(body.note, 400), route: ROUTES.has(body.route) ? body.route : "", at };
    const id = newId("b");
    await list.setJSON("biz/" + id, item);
    return json({ ok: true, item: { id, ...item } });
  }

  if (body.kind === "flag") {
    const id = str(body.id, 80);
    if (!POOL_IDS.has(id)) return json({ error: "unknown business" }, 400);
    const flag = { next: !!body.next, drop: !!body.drop, at };
    if (!flag.next && !flag.drop) { await list.delete("flag/" + id); return json({ ok: true, flag: null }); }
    await list.setJSON("flag/" + id, flag);
    return json({ ok: true, flag });
  }

  return json({ error: "unknown kind" }, 400);
};

export const config = { path: "/api/invite-run" };
