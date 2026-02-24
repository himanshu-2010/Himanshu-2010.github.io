export const USERS = [
  { username: "himanshu", password: "robo2010" },
  { username: "admin",    password: "secret123" },
  { username: "guest",    password: "letmein" },
];

export const SECRET_KEYWORD = "arch";

// ─────────────────────────────────────────────────────────────
//  WAIFU.IM — 17 verified live tags (api.waifu.im/tags)
// ─────────────────────────────────────────────────────────────
export const WAIFU_IM_TAGS = {
  sfw: [
    { slug: "waifu",          label: "Waifu",          imageCount: 4248 },
    { slug: "uniform",        label: "Uniform",        imageCount: 445  },
    { slug: "maid",           label: "Maid",           imageCount: 272  },
    { slug: "selfies",        label: "Selfies",        imageCount: 180  },
    { slug: "genshin-impact", label: "Genshin Impact", imageCount: 83   },
    { slug: "raiden-shogun",  label: "Raiden Shogun",  imageCount: 69   },
    { slug: "marin-kitagawa", label: "Marin Kitagawa", imageCount: 38   },
    { slug: "mori-calliope",  label: "Mori Calliope",  imageCount: 26   },
    { slug: "kamisato-ayaka", label: "Kamisato Ayaka", imageCount: 14   },
  ],
  nsfw: [
    { slug: "ero",     label: "Ero",     imageCount: 2999 },
    { slug: "ecchi",   label: "Ecchi",   imageCount: 2120 },
    { slug: "oppai",   label: "Oppai",   imageCount: 1071 },
    { slug: "hentai",  label: "Hentai",  imageCount: 883  },
    { slug: "milf",    label: "MILF",    imageCount: 466  },
    { slug: "ass",     label: "Ass",     imageCount: 412  },
    { slug: "oral",    label: "Oral",    imageCount: 146  },
    { slug: "paizuri", label: "Paizuri", imageCount: 146  },
  ],
};

const waifuImFetchFn = async (opts, count) => {
  const includedTags = typeof opts === "string" ? [opts] : (opts?.includedTags || []);
  const excludedTags = typeof opts === "string" ? []    : (opts?.excludedTags  || []);
  const isNsfw       = typeof opts === "string" ? "False" : (opts?.isNsfw     || "False");
  const params = new URLSearchParams();
  includedTags.forEach(t => params.append("IncludedTags", t));
  excludedTags.forEach(t => params.append("ExcludedTags", t));
  params.set("IsNsfw",   isNsfw);
  params.set("PageSize", Math.min(count, 30));
  params.set("Page",     1);
  const res  = await fetch(`https://api.waifu.im/images?${params}`);
  if (!res.ok) throw new Error(`Waifu.im ${res.status}`);
  const data = await res.json();
  if (!data.items?.length) throw new Error("No images found");
  return data.items.map(i => i.url).filter(Boolean).slice(0, count);
};

// ─────────────────────────────────────────────────────────────
//  ROBOHASH sets
// ─────────────────────────────────────────────────────────────
export const ROBOHASH_SETS = {
  "Robots":      { set: "set1", bgset: "bg1" },
  "Monsters":    { set: "set2", bgset: "bg2" },
  "Robot Heads": { set: "set3", bgset: "bg1" },
  "Cats":        { set: "set4", bgset: "bg2" },
  "Humans":      { set: "set5", bgset: "bg1" },
};

// ─────────────────────────────────────────────────────────────
//  THE CAT API breed map
// ─────────────────────────────────────────────────────────────
export const CAT_BREEDS = {
  "Any":            "",
  "Abyssinian":     "abys", "Bengal":          "beng", "Birman":        "birm",
  "Burmese":        "bura", "Chartreux":        "char", "Devon Rex":    "devo",
  "Egyptian Mau":   "egyp", "Maine Coon":       "mcoo", "Munchkin":     "munc",
  "Norwegian Forest":"norw","Persian":          "pers", "Ragdoll":      "rblu",
  "Scottish Fold":  "sfol", "Siamese":          "siam", "Siberian":     "sibe",
  "Somali":         "soma", "Sphynx":           "sphy", "Turkish Van":  "tvan",
};

// ─────────────────────────────────────────────────────────────
//  DOG API — 120+ breeds
// ─────────────────────────────────────────────────────────────
const DOG_BREEDS_FLAT = [
  "random","affenpinscher","african","airedale","akita","appenzeller",
  "australian/shepherd","basenji","beagle","bluetick","borzoi","bouvier",
  "boxer","briard","bulldog/boston","bulldog/english","bulldog/french",
  "bullterrier/staffordshire","cairn","cattledog/australian","chihuahua",
  "chow","clumber","cockapoo","collie/border","coonhound","corgi/cardigan",
  "cotondetulear","dachshund","dalmatian","dane/great","deerhound/scottish",
  "doberman","elkhound/norwegian","entlebucher","eskimo","finnish/lapphund",
  "frise/bichon","germanshepherd","greyhound/italian","greyhound/spanish",
  "groenendael","havanese","hound/afghan","hound/basset","hound/blood",
  "hound/ibizan","hound/walker","husky","keeshond","kelpie","komondor",
  "kuvasz","labrador","leonberg","lhasa","malamute","malinois","maltese",
  "mastiff/bull","mastiff/english","mastiff/tibetan","mexicanhairless",
  "mix","mountain/bernese","mountain/swiss","newfoundland","otterhound",
  "papillon","pekinese","pembroke","pinscher/miniature","pitbull",
  "pointer/german","pomeranian","poodle/miniature","poodle/standard",
  "poodle/toy","pug","puggle","pyrenees","redbone","retriever/chesapeake",
  "retriever/curly","retriever/flatcoated","retriever/golden",
  "ridgeback/rhodesian","rottweiler","saluki","samoyed","schipperke",
  "schnauzer/giant","schnauzer/miniature","setter/english","setter/gordon",
  "setter/irish","sharpei","sheepdog/english","sheepdog/shetland",
  "shiba","shihtzu","spaniel/blenheim","spaniel/brittany","spaniel/cocker",
  "spaniel/irish","spaniel/japanese","spaniel/sussex","spaniel/welsh",
  "springer/english","stbernard","terrier/american","terrier/australian",
  "terrier/bedlington","terrier/border","terrier/cairn","terrier/dandie",
  "terrier/fox","terrier/irish","terrier/kerryblue","terrier/lakeland",
  "terrier/norfolk","terrier/norwich","terrier/russell","terrier/scottish",
  "terrier/sealyham","terrier/silky","terrier/tibetan","terrier/toy",
  "terrier/welsh","terrier/westhighland","terrier/wheaten","terrier/yorkshire",
  "vizsla","weimaraner","whippet","wolfhound/irish",
];

export const APIS = [

  // ══════════════════════════════════════════════════════════════
  //  🌸 WAIFU.PICS SFW
  // ══════════════════════════════════════════════════════════════
  {
    id: "waifu",
    name: "Waifu.pics",
    icon: "🌸",
    description: "30 SFW anime categories — images & reaction GIFs",
    categories: [
      "waifu","neko","shinobu","megumin","bully","cuddle","cry","hug","awoo",
      "kiss","lick","pat","smug","bonk","yeet","blush","smile","wave",
      "highfive","handhold","nom","bite","glomp","slap","kill","kick",
      "happy","wink","poke","dance","cringe",
    ],
    fetchFn: async (category, count) => {
      if (count === 1) {
        const r = await fetch(`https://api.waifu.pics/sfw/${category}`);
        if (!r.ok) throw new Error(`waifu.pics ${r.status}`);
        return [(await r.json()).url];
      }
      const r = await fetch(`https://api.waifu.pics/many/sfw/${category}`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: "{}",
      });
      if (!r.ok) throw new Error(`waifu.pics many ${r.status}`);
      return ((await r.json()).files || []).slice(0, count);
    },
  },

  // ══════════════════════════════════════════════════════════════
  //  🔞 WAIFU.PICS NSFW
  // ══════════════════════════════════════════════════════════════
  {
    id: "waifu-nsfw",
    name: "Waifu.pics NSFW",
    icon: "🔞",
    description: "NSFW anime — 4 categories (may be spotty in 2026)",
    categories: ["waifu","neko","trap","blowjob"],
    nsfw: true,
    fetchFn: async (category, count) => {
      if (count === 1) {
        const r = await fetch(`https://api.waifu.pics/nsfw/${category}`);
        if (!r.ok) throw new Error(`waifu.pics NSFW ${r.status}`);
        return [(await r.json()).url];
      }
      const r = await fetch(`https://api.waifu.pics/many/nsfw/${category}`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: "{}",
      });
      if (!r.ok) throw new Error(`waifu.pics NSFW many ${r.status}`);
      return ((await r.json()).files || []).slice(0, count);
    },
  },

  // ══════════════════════════════════════════════════════════════
  //  🌟 WAIFU.IM — Full tag toggle UI (17 live tags)
  // ══════════════════════════════════════════════════════════════
  {
    id: "waifu-im",
    name: "Waifu.im",
    icon: "🌟",
    description: "17 live tags · SFW/NSFW toggle · include + exclude · 30 per batch",
    categories: WAIFU_IM_TAGS.sfw.map(t => t.slug),
    waifuImTags: WAIFU_IM_TAGS,
    advancedTagPicker: true,
    fetchFn: waifuImFetchFn,
  },

  // ══════════════════════════════════════════════════════════════
  //  😻 NEKOS.BEST — SFW + GIFs with artist credits
  // ══════════════════════════════════════════════════════════════
  {
    id: "nekos-best",
    name: "Nekos.best",
    icon: "😻",
    description: "SFW anime images & roleplay GIFs with artist credits",
    categories: [
      "neko","kitsune","waifu","husbando","shinobu","megumin",
      "hug","pat","kiss","cuddle","wave","poke","slap","kick",
      "bite","blush","smile","wink","dance","cringe","yeet",
      "happy","cry","nom","handhold","highfive","bonk","thumbsup",
      "baka","stare","nod","nope","sleep","facepalm","shrug","lick",
    ],
    fetchFn: async (category, count) => {
      const res = await fetch(`https://nekos.best/api/v2/${category}?amount=${Math.min(count, 20)}`);
      if (!res.ok) throw new Error(`nekos.best ${res.status}`);
      return ((await res.json()).results || []).map(i => i.url).filter(Boolean).slice(0, count);
    },
  },

  // ══════════════════════════════════════════════════════════════
  //  😺 NEKOSIA — 100% SFW, 28 categories, tag blacklist
  // ══════════════════════════════════════════════════════════════
  {
    id: "nekosia",
    name: "Nekosia",
    icon: "😺",
    description: "100% SFW · 28 categories · additionalTags / blacklistedTags · up to 48",
    categories: [
      "catgirl","foxgirl","wolfgirl","random","animal-ears","tail","cute",
      "maid","vtuber","uniform","sailor-uniform","headphones","hoodie",
      "wink","valentine","white-hair","blue-hair","long-hair","blonde",
      "blue-eyes","purple-eyes","thigh-high-socks","knee-high-socks",
      "white-tights","ribbon","w-sitting","lying-down","hands-forming-a-heart",
    ],
    nekosiaAdvanced: true,
    fetchFn: async (opts, count) => {
      const category        = typeof opts === "string" ? opts : (opts?.category        || "catgirl");
      const additionalTags  = typeof opts === "object" ? (opts?.additionalTags  || []) : [];
      const blacklistedTags = typeof opts === "object" ? (opts?.blacklistedTags || []) : [];
      const rating          = typeof opts === "object" ? (opts?.rating          || "safe") : "safe";
      const params = new URLSearchParams({ count: Math.min(count, 48), rating });
      if (additionalTags.length)  params.set("additionalTags",  additionalTags.join(","));
      if (blacklistedTags.length) params.set("blacklistedTags", blacklistedTags.join(","));
      const res  = await fetch(`https://api.nekosia.cat/api/v1/images/${category}?${params}`);
      if (!res.ok) throw new Error(`nekosia ${res.status}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "No images");
      const items = data.images || [data];
      return items.map(i => i?.image?.compressed?.url || i?.image?.original?.url).filter(Boolean).slice(0, count);
    },
  },

  // ══════════════════════════════════════════════════════════════
  //  � CATAAS — Cats as a Service (text overlay + GIF)
  // ══════════════════════════════════════════════════════════════
  {
    id: "cataas",
    name: "Cataas",
    icon: "😹",
    description: "Cats as a Service — photo/GIF + custom text overlay",
    categories: ["photo","gif","says hello","says meow","says nya","says bruh","says uwu","says lol"],
    fetchFn: async (category, count) => {
      return Array.from({ length: count }, (_, i) => {
        const isGif = category === "gif";
        const text  = category.startsWith("says ") ? encodeURIComponent(category.replace("says ", "")) : null;
        let url = "https://cataas.com/cat";
        if (isGif) url += "/gif";
        if (text)  url += `/says/${text}`;
        url += `?t=${Date.now() + i}`;
        return url;
      });
    },
  },

  // ══════════════════════════════════════════════════════════════
  //  🐱 THE CAT API — 60 breeds, breed images, GIF mode
  // ══════════════════════════════════════════════════════════════
  {
    id: "thecatapi",
    name: "The Cat API",
    icon: "🐈",
    description: "60k+ cat photos · 18 breeds · photo/GIF filter · no key for basic use",
    categories: Object.keys(CAT_BREEDS),
    catBreeds: CAT_BREEDS,
    thecatAdvanced: true,
    fetchFn: async (opts, count) => {
      const breedKey = typeof opts === "string" ? opts : (opts?.breed || "Any");
      const breedId  = CAT_BREEDS[breedKey] || "";
      const gif      = typeof opts === "object" ? !!opts?.gif : false;
      const params   = new URLSearchParams({ limit: Math.min(count, 25), order: "RANDOM", size: "med" });
      if (breedId) params.set("breed_ids", breedId);
      if (gif)     params.set("mime_types", "gif");
      const res  = await fetch(`https://api.thecatapi.com/v1/images/search?${params}`);
      if (!res.ok) throw new Error(`TheCatAPI ${res.status}`);
      return (await res.json()).map(i => i.url).filter(Boolean).slice(0, count);
    },
  },

  // ══════════════════════════════════════════════════════════════
  //  🐕 DOG API — 120+ breeds (dog.ceo)
  // ══════════════════════════════════════════════════════════════
  {
    id: "dog",
    name: "Random Dog",
    icon: "🐕",
    description: "120+ breeds from dog.ceo — complete official breed list",
    categories: DOG_BREEDS_FLAT,
    fetchFn: async (category, count) => {
      const breed = category === "random" ? "" : `breed/${category}/`;
      const r = await fetch(`https://dog.ceo/api/${breed}images/random/${Math.min(count, 50)}`);
      if (!r.ok) throw new Error(`dog.ceo ${r.status}`);
      const d = await r.json();
      return (Array.isArray(d.message) ? d.message : [d.message]).slice(0, count);
    },
  },

  // ══════════════════════════════════════════════════════════════
  //  🦊 RANDOM FOX
  // ══════════════════════════════════════════════════════════════
  {
    id: "fox",
    name: "Random Fox",
    icon: "🦊",
    description: "High quality wild fox photos",
    categories: ["any"],
    fetchFn: async (_c, count) => {
      const r = await Promise.all(Array.from({ length: count }, () =>
        fetch("https://randomfox.ca/floof/").then(r => r.json()).then(d => d.image).catch(() => null)
      ));
      return r.filter(Boolean);
    },
  },

  // ══════════════════════════════════════════════════════════════
  //  🦆 RANDOM DUCK
  // ══════════════════════════════════════════════════════════════
  {
    id: "duck",
    name: "Random Duck",
    icon: "🦆",
    description: "Adorable duck photos",
    categories: ["any"],
    fetchFn: async (_c, count) => {
      const r = await Promise.all(Array.from({ length: count }, () =>
        fetch("https://random-d.uk/api/random").then(r => r.json()).then(d => d.url).catch(() => null)
      ));
      return r.filter(Boolean);
    },
  },

  // ══════════════════════════════════════════════════════════════
  //  🦁 WILD ANIMALS — bear, lizard, koala, panda, rabbit + more
  // ══════════════════════════════════════════════════════════════
  {
    id: "animals",
    name: "Wild Animals",
    icon: "🦁",
    description: "Bears, lizards, koalas, pandas, rabbits & more — multiple free endpoints",
    categories: ["bear","lizard","kangaroo","koala","panda","rabbit","raccoon","bird","whale"],
    fetchFn: async (category, count) => {
      const sra = (type) => Array.from({ length: count }, () =>
        fetch(`https://some-random-api.com/animal/${type}`).then(r => r.json()).then(d => d.image).catch(() => null)
      );
      const routeMap = {
        bear:     () => Array.from({ length: count }, (_, i) => `https://placebear.com/g/400/300?t=${Date.now()+i}`),
        lizard:   () => Array.from({ length: count }, () => fetch("https://nekos.life/api/v2/img/lizard").then(r=>r.json()).then(d=>d.url).catch(()=>null)),
        kangaroo: () => sra("kangaroo"),
        koala:    () => sra("koala"),
        panda:    () => sra("panda"),
        rabbit:   () => sra("rabbit"),
        raccoon:  () => sra("raccoon"),
        bird:     () => sra("bird"),
        whale:    () => Array.from({ length: count }, (_, i) => `https://picsum.photos/seed/whale${i+Date.now()}/700/480`),
      };
      const fn = routeMap[category];
      if (!fn) throw new Error(`Unknown animal: ${category}`);
      const result = await Promise.all(fn());
      return result.filter(Boolean).slice(0, count);
    },
  },

  // ══════════════════════════════════════════════════════════════
  //  🚀 NASA — APOD gallery + Mars Rovers (DEMO_KEY = 50 req/day)
  // ══════════════════════════════════════════════════════════════
  {
    id: "nasa",
    name: "NASA",
    icon: "🚀",
    description: "Real space photos — APOD + Mars Rover cameras · DEMO_KEY (50 req/day)",
    categories: [
      "apod-random",
      "curiosity-FHAZ","curiosity-RHAZ","curiosity-MAST","curiosity-CHEMCAM",
      "curiosity-MAHLI","curiosity-NAVCAM",
      "perseverance-NAVCAM_LEFT","perseverance-NAVCAM_RIGHT",
      "perseverance-MCZ_LEFT","perseverance-FRONT_HAZCAM_LEFT_A",
      "perseverance-SHERLOC_WATSON",
      "opportunity-FHAZ","opportunity-RHAZ","opportunity-NAVCAM","opportunity-PANCAM",
    ],
    fetchFn: async (category, count) => {
      const KEY = "DEMO_KEY";
      if (category === "apod-random") {
        const res  = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${KEY}&count=${Math.min(count, 10)}`);
        if (!res.ok) throw new Error(`NASA APOD ${res.status}`);
        const data = await res.json();
        return (Array.isArray(data) ? data : [data])
          .filter(i => i.media_type === "image")
          .map(i => i.hdurl || i.url)
          .filter(Boolean)
          .slice(0, count);
      }
      const [rover, camera] = category.split("-");
      const solRanges = { curiosity: [1,4000], perseverance: [1,1200], opportunity: [1,5111] };
      const [mn, mx] = solRanges[rover] || [1, 1000];
      const sol  = Math.floor(Math.random() * (mx - mn)) + mn;
      const res  = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?sol=${sol}&camera=${camera}&api_key=${KEY}&page=1`);
      if (!res.ok) throw new Error(`NASA Mars ${res.status}`);
      const data = await res.json();
      let photos  = data.photos || [];
      if (!photos.length) {
        const fb = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/latest_photos?api_key=${KEY}`);
        if (!fb.ok) throw new Error(`NASA fallback ${fb.status}`);
        photos = (await fb.json()).latest_photos || [];
      }
      for (let i = photos.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [photos[i], photos[j]] = [photos[j], photos[i]];
      }
      return photos.slice(0, count).map(p => p.img_src).filter(Boolean);
    },
  },

  // ══════════════════════════════════════════════════════════════
  //  🌱 STUDIO GHIBLI — official posters + banners (21 films)
  // ══════════════════════════════════════════════════════════════
  {
    id: "ghibli",
    name: "Studio Ghibli",
    icon: "🌱",
    description: "Official posters & banners from all 21 Ghibli films",
    categories: [
      "all","Spirited Away","My Neighbor Totoro","Howl's Moving Castle",
      "Princess Mononoke","Kiki's Delivery Service","Ponyo",
      "Castle in the Sky","Grave of the Fireflies","Porco Rosso",
      "Nausicaa","The Wind Rises","When Marnie Was There",
      "Tale of the Princess Kaguya","The Red Turtle","Only Yesterday",
      "My Neighbors the Yamadas","Pom Poko","Whisper of the Heart",
    ],
    fetchFn: async (category, count) => {
      const res   = await fetch("https://ghibliapi.vercel.app/films");
      if (!res.ok) throw new Error(`Ghibli ${res.status}`);
      const films = await res.json();
      const src   = category === "all" ? films : (films.filter(f => f.title?.toLowerCase().includes(category.toLowerCase())) || films);
      const urls  = (src.length ? src : films).flatMap(f => [f.movie_banner, f.image].filter(Boolean));
      for (let i = urls.length - 1; i > 0; i--) { const j = Math.floor(Math.random()*(i+1)); [urls[i],urls[j]]=[urls[j],urls[i]]; }
      return urls.slice(0, count);
    },
  },

  // ══════════════════════════════════════════════════════════════
  //  ⚔️ ANIME CHARACTERS — Jikan / MyAnimeList
  // ══════════════════════════════════════════════════════════════
  {
    id: "jikan",
    name: "Anime Characters",
    icon: "⚔️",
    description: "Character art via MAL/Jikan — search any anime title or use 'top'",
    categories: [
      "top","naruto","one piece","demon slayer","attack on titan",
      "sword art online","dragon ball","bleach","my hero academia",
      "fullmetal alchemist","death note","fairy tail","hunter x hunter",
      "re zero","overlord","konosuba","shield hero","evangelion",
      "jujutsu kaisen","chainsaw man","vinland saga","black clover",
    ],
    fetchFn: async (category, count) => {
      if (category === "top") {
        const res  = await fetch(`https://api.jikan.moe/v4/top/characters?limit=${Math.min(count,25)}`);
        if (!res.ok) throw new Error(`Jikan ${res.status}`);
        return ((await res.json()).data || []).map(c => c.images?.jpg?.image_url).filter(Boolean).slice(0, count);
      }
      const sr = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(category)}&limit=1`);
      if (!sr.ok) throw new Error(`Jikan search ${sr.status}`);
      const sd = await sr.json();
      if (!sd.data?.length) throw new Error(`No anime: ${category}`);
      const cr = await fetch(`https://api.jikan.moe/v4/anime/${sd.data[0].mal_id}/characters`);
      if (!cr.ok) throw new Error(`Jikan chars ${cr.status}`);
      return ((await cr.json()).data || []).slice(0, count).map(c => c.character?.images?.jpg?.image_url).filter(Boolean);
    },
  },

  // ══════════════════════════════════════════════════════════════
  //  🖼️ LOREM PICSUM — ENHANCED: /v2/list + grayscale + blur + WebP
  // ══════════════════════════════════════════════════════════════
  {
    id: "picsum",
    name: "Lorem Picsum",
    icon: "🖼️",
    description: "HD stock photos · grayscale · blur 1–10 · WebP · seeded · no auth",
    categories: ["random","grayscale","blur-light","blur-heavy","grayscale+blur","webp"],
    picsumAdvanced: true,
    fetchFn: async (opts, count) => {
      const category  = typeof opts === "string" ? opts : (opts?.category || "random");
      const grayscale = ["grayscale","grayscale+blur"].includes(category) || (typeof opts === "object" && !!opts?.grayscale);
      const blur      = category === "blur-light" ? 3 : category === "blur-heavy" ? 8 : category === "grayscale+blur" ? 5 : (typeof opts === "object" ? (opts?.blur || 0) : 0);
      const webp      = category === "webp";
      const page      = Math.floor(Math.random() * 25) + 1;
      const res       = await fetch(`https://picsum.photos/v2/list?page=${page}&limit=${Math.min(count * 2, 100)}`);
      if (!res.ok) throw new Error(`Picsum ${res.status}`);
      const list = (await res.json()).sort(() => Math.random() - 0.5).slice(0, count);
      return list.map(img => {
        const ext = webp ? ".webp" : "";
        const base = `https://picsum.photos/id/${img.id}/700/480${ext}`;
        const qp = [...(grayscale ? ["grayscale"] : []), ...(blur > 0 ? [`blur=${blur}`] : [])];
        return qp.length ? `${base}?${qp.join("&")}` : base;
      });
    },
  },

  // ══════════════════════════════════════════════════════════════
  //  🤖 ROBOHASH — unique avatars from any text (5 styles)
  // ══════════════════════════════════════════════════════════════
  {
    id: "robohash",
    name: "RoboHash",
    icon: "🤖",
    description: "Generate unique avatars from any text seed — Robots, Monsters, Cats, Humans & more",
    categories: Object.keys(ROBOHASH_SETS),
    roboHashAdvanced: true,
    fetchFn: async (opts, count) => {
      const setName = typeof opts === "string" ? opts : (opts?.setName || "Robots");
      const seed    = typeof opts === "object"  ? (opts?.seed   || "") : "";
      const { set, bgset } = ROBOHASH_SETS[setName] || ROBOHASH_SETS["Robots"];
      return Array.from({ length: count }, (_, i) => {
        const s = seed ? `${seed}-${i}` : `${Date.now()}-${i}-${Math.random().toString(36).slice(2)}`;
        return `https://robohash.org/${encodeURIComponent(s)}?set=${set}&bgset=${bgset}&size=400x400`;
      });
    },
  },

  // ══════════════════════════════════════════════════════════════
  //  🎲 DICEBEAR — 30 avatar art styles, SVG/PNG, seed-based
  // ══════════════════════════════════════════════════════════════
  {
    id: "dicebear",
    name: "DiceBear Avatars",
    icon: "🎲",
    description: "30+ avatar art styles — seed-based deterministic PNG, no auth",
    categories: [
      "adventurer","adventurer-neutral","avataaars","avataaars-neutral",
      "big-ears","big-ears-neutral","big-smile","bottts","bottts-neutral",
      "croodles","croodles-neutral","dylan","fun-emoji","glass","icons",
      "identicon","lorelei","lorelei-neutral","micah","miniavs",
      "notionists","notionists-neutral","open-peeps","personas",
      "pixel-art","pixel-art-neutral","rings","shapes","thumbs",
    ],
    fetchFn: async (style, count) => {
      return Array.from({ length: count }, (_, i) => {
        const seed = `${Date.now()}-${i}-${Math.random().toString(36).slice(2)}`;
        return `https://api.dicebear.com/9.x/${style}/png?seed=${seed}&size=256`;
      });
    },
  },

  // ══════════════════════════════════════════════════════════════
  //  🧑 RANDOM USER AVATARS — male / female / pixel (xsgames)
  // ══════════════════════════════════════════════════════════════
  {
    id: "avatars",
    name: "Random Avatars",
    icon: "🧑",
    description: "Human-style avatars by gender or pixel art — no auth",
    categories: ["male","female","pixel"],
    fetchFn: async (category, count) => {
      return Array.from({ length: count }, (_, i) =>
        `https://xsgames.co/randomusers/avatar.php?g=${category}&t=${Date.now() + i}`
      );
    },
  },

  // ══════════════════════════════════════════════════════════════
  //  🏛️ THE MET MUSEUM — 500k+ public domain artworks, no auth
  // ══════════════════════════════════════════════════════════════
  {
    id: "met-museum",
    name: "The Met Museum",
    icon: "🏛️",
    description: "500k+ public domain artworks — paintings, sculptures, photography & more",
    categories: [
      "any","paintings","photographs","sculpture","ceramics",
      "arms-and-armor","japanese-art","greek-roman","egyptian",
      "medieval","american","islamic","african","drawings",
    ],
    metAdvanced: true,
    fetchFn: async (opts, count) => {
      const category = typeof opts === "string" ? opts : (opts?.category || "any");
      const deptMap  = {
        paintings: 11, photographs: 19, sculpture: 12, ceramics: 13,
        "arms-and-armor": 4, "japanese-art": 6, "greek-roman": 13,
        egyptian: 10, medieval: 17, american: 1, islamic: 14, african: 5, drawings: 9,
      };
      const deptId = deptMap[category];
      const params = new URLSearchParams({ hasImages: true, isPublicDomain: true, ...(deptId ? { departmentId: deptId } : {}), q: "art" });
      const sr   = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/search?${params}`);
      if (!sr.ok) throw new Error(`Met search ${sr.status}`);
      const sd   = await sr.json();
      const ids  = (sd.objectIDs || []).sort(() => Math.random() - 0.5).slice(0, Math.min(count * 3, 30));
      const res  = await Promise.allSettled(
        ids.map(id =>
          fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`)
            .then(r => r.json()).then(d => d.primaryImageSmall || d.primaryImage || null)
        )
      );
      return res.filter(r => r.status === "fulfilled" && r.value).map(r => r.value).slice(0, count);
    },
  },

  // ══════════════════════════════════════════════════════════════
  //  🎨 RIJKSMUSEUM — Dutch masters + 150k+ public artworks
  //  Free demo API key bundled (rijksmuseum.nl)
  // ══════════════════════════════════════════════════════════════
  {
    id: "rijksmuseum",
    name: "Rijksmuseum",
    icon: "🎨",
    description: "Dutch masters & 150k+ artworks — Rembrandt, Vermeer, Van Gogh & more",
    categories: [
      "any","Rembrandt","Vermeer","Hals","Steen","Van Gogh","Monet",
      "oil painting","watercolor","drawing","print","tapestry",
      "Dutch","French","Italian","Flemish","portrait","landscape","still life",
    ],
    fetchFn: async (category, count) => {
      const KEY    = "0fiuZFh4";
      const params = new URLSearchParams({
        key: KEY, format: "json",
        ps: Math.min(count * 3, 50),
        imgonly: true,
        q: category === "any" ? "painting" : category,
      });
      const res  = await fetch(`https://www.rijksmuseum.nl/api/en/collection?${params}`);
      if (!res.ok) throw new Error(`Rijks ${res.status}`);
      const data = await res.json();
      const arts = (data.artObjects || []).filter(a => a.webImage?.url);
      if (!arts.length) throw new Error("No artworks found");
      return arts.sort(() => Math.random() - 0.5).slice(0, count).map(a =>
        (a.webImage.url || "").replace("=s0", "=s800")
      );
    },
  },

  // ══════════════════════════════════════════════════════════════
  //  📷 UNSPLASH SOURCE — million+ HD photos, topic-based, no key
  // ══════════════════════════════════════════════════════════════
  {
    id: "unsplash-source",
    name: "Unsplash",
    icon: "📷",
    description: "1M+ HD stock photos by topic — no API key required",
    categories: [
      "nature","architecture","technology","food","travel","people","animals",
      "city","abstract","space","ocean","mountains","forest","flowers","vintage",
      "minimal","dark","neon","sunset","winter","summer","rain","street",
    ],
    fetchFn: async (category, count) => {
      return Array.from({ length: count }, (_, i) =>
        `https://source.unsplash.com/featured/800x600/?${encodeURIComponent(category)}&sig=${Date.now() + i}`
      );
    },
  },

  // ══════════════════════════════════════════════════════════════
  //  🐱 NEKOS.LIFE — anime avatar + neko + reaction endpoints
  // ══════════════════════════════════════════════════════════════
  {
    id: "nekos-life",
    name: "Nekos.life",
    icon: "🐾",
    description: "Anime avatar, neko & reaction images — 16 categories",
    categories: [
      "neko","avatar","waifu","hug","kiss","pat","feed","cuddle",
      "slap","tickle","smug","poke","wink","cry","ngif","lewd",
    ],
    fetchFn: async (category, count) => {
      const r = await Promise.all(
        Array.from({ length: Math.min(count, 10) }, () =>
          fetch(`https://nekos.life/api/v2/img/${category}`)
            .then(r => r.ok ? r.json() : null).then(d => d?.url || null).catch(() => null)
        )
      );
      const urls = r.filter(Boolean);
      if (!urls.length) throw new Error("nekos.life returned nothing");
      return urls.slice(0, count);
    },
  },

];