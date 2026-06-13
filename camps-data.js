// ============================================================
// Greater Boston Camp Finder — Camp Data & Configuration
// Summer 2026 — Greater Boston
// ============================================================

// ── School Districts ──
const SCHOOL_DISTRICTS = {
  "norwood":   { label: "Norwood Public Schools",    lastDay: "2026-06-19", firstDay: "2026-09-03" },
  "dedham":    { label: "Dedham Public Schools",     lastDay: "2026-06-19", firstDay: "2026-09-03" },
  "canton":    { label: "Canton Public Schools",     lastDay: "2026-06-20", firstDay: "2026-09-04" },
  "needham":   { label: "Needham Public Schools",    lastDay: "2026-06-18", firstDay: "2026-09-02" },
  "wellesley": { label: "Wellesley Public Schools",  lastDay: "2026-06-19", firstDay: "2026-09-03" },
  "sharon":    { label: "Sharon Public Schools",     lastDay: "2026-06-20", firstDay: "2026-09-04" },
  "franklin":  { label: "Franklin Public Schools",   lastDay: "2026-06-18", firstDay: "2026-09-02" },
  "stoughton": { label: "Stoughton Public Schools",  lastDay: "2026-06-19", firstDay: "2026-09-03" },
  "quincy":    { label: "Quincy Public Schools",     lastDay: "2026-06-20", firstDay: "2026-09-04" },
  "brookline": { label: "Brookline Public Schools",  lastDay: "2026-06-18", firstDay: "2026-09-02" },
  
  "ashland":   { label: "Ashland Public Schools",    lastDay: "2026-06-19", firstDay: "2026-09-03" },
  "framingham":{ label: "Framingham Public Schools", lastDay: "2026-06-19", firstDay: "2026-09-03" },
  "natick":    { label: "Natick Public Schools",     lastDay: "2026-06-19", firstDay: "2026-09-03" },
  "hopkinton": { label: "Hopkinton Public Schools",  lastDay: "2026-06-19", firstDay: "2026-09-03" },
  "boston":    { label: "Boston Public Schools",     lastDay: "2026-06-19", firstDay: "2026-09-03" },
  "hingham":   { label: "Hingham Public Schools",    lastDay: "2026-06-19", firstDay: "2026-09-03" },
  "scituate":  { label: "Scituate Public Schools",   lastDay: "2026-06-19", firstDay: "2026-09-03" },
  "other":     { label: "Other (enter dates manually)", lastDay: null, firstDay: null }
};

// ── Dynamic Summer Weeks Generation ──
let SUMMER_WEEKS = [];

function formatDate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function formatShortDate(d) {
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${months[d.getMonth()]} ${d.getDate()}`;
}

function formatWeekLabel(mon, fri) {
  const ms = formatShortDate(mon);
  const fs = formatShortDate(fri);
  if (mon.getMonth() === fri.getMonth()) {
    return `${ms}\u2013${fri.getDate()}`;
  }
  return `${ms}\u2013${fs}`;
}

function generateSummerWeeks(lastDayStr, firstDayStr) {
  if (!lastDayStr || !firstDayStr) { SUMMER_WEEKS = []; return SUMMER_WEEKS; }
  const lastDay = new Date(lastDayStr + "T00:00:00");
  const firstDay = new Date(firstDayStr + "T00:00:00");
  const dow = lastDay.getDay();
  let monday = new Date(lastDay);
  if (dow === 0) monday.setDate(monday.getDate() + 1);
  else if (dow === 5) monday.setDate(monday.getDate() + 3);
  else if (dow === 6) monday.setDate(monday.getDate() + 2);
  else monday.setDate(monday.getDate() - (dow - 1));
  const weeks = [];
  let weekNum = 1;
  while (monday < firstDay) {
    const fri = new Date(monday);
    fri.setDate(fri.getDate() + 4);
    const id = "w" + String(weekNum).padStart(2, "0");
    const label = formatWeekLabel(monday, fri);
    const week = { id, label, start: formatDate(monday), end: formatDate(fri) };
    if (weekNum === 1) week.note = "School ends " + formatShortDate(lastDay);
    if (fri >= firstDay || (monday < firstDay && new Date(monday.getTime() + 7 * 86400000) >= firstDay)) {
      week.note = "School starts ~" + formatShortDate(firstDay);
    }
    if (weekNum === 1 && fri >= firstDay) {
      week.note = "School ends " + formatShortDate(lastDay) + " / starts ~" + formatShortDate(firstDay);
    }
    weeks.push(week);
    monday = new Date(monday);
    monday.setDate(monday.getDate() + 7);
    weekNum++;
  }
  SUMMER_WEEKS = weeks;
  return weeks;
}

// Initialize with Norwood dates (user will update based on their district)
generateSummerWeeks("2026-06-19", "2026-09-03");

// ── Adjacency Map (for "New Things to Try") ──
const ADJACENCY_MAP = {
  "field-sports":      ["court-sports", "multi-sport"],
  "court-sports":      ["field-sports", "multi-sport"],
  "water-sports":      ["high-adrenaline", "outdoor-survival"],
  "individual-combat": ["multi-sport", "high-adrenaline"],
  "multi-sport":       ["field-sports", "court-sports", "high-adrenaline"],
  "theater":           ["dance", "music", "digital-arts"],
  "dance":             ["theater", "music"],
  "music":             ["theater", "dance", "digital-arts"],
  "visual-arts":       ["digital-arts", "culinary"],
  "digital-arts":      ["coding", "visual-arts", "theater"],
  "coding":            ["engineering", "digital-arts"],
  "natural-sciences":  ["nature-study", "engineering", "outdoor-survival"],
  "engineering":       ["coding", "natural-sciences"],
  "humanities":        ["theater", "leadership"],
  "outdoor-survival":  ["high-adrenaline", "nature-study", "sleepaway"],
  "high-adrenaline":   ["outdoor-survival", "water-sports", "individual-combat"],
  "nature-study":      ["outdoor-survival", "natural-sciences"],
  "sleepaway":         ["outdoor-survival", "high-adrenaline", "nature-study"],
  "culinary":          ["visual-arts", "leadership"],
  "leadership":        ["humanities", "culinary"],
  "special-needs":     ["multi-sport", "nature-study"]
};

// ── Neighborhood Areas ──
const NEIGHBORHOOD_AREAS = [
  {
    area: "Metro West",
    neighborhoods: [
      { id: "ashland", label: "Ashland" },
      { id: "framingham", label: "Framingham" },
      { id: "natick", label: "Natick" },
      { id: "hopkinton", label: "Hopkinton" },
      { id: "southborough", label: "Southborough" },
      { id: "sherborn", label: "Sherborn" },
      { id: "holliston", label: "Holliston" },
      { id: "millis", label: "Millis" },
      { id: "medway", label: "Medway" },
      { id: "milford", label: "Milford" },
      { id: "franklin", label: "Franklin" },
      { id: "bellingham", label: "Bellingham" },
      { id: "plainville", label: "Plainville" }
    ]
  },
  {
    area: "North / Boston",
    neighborhoods: [
      { id: "needham", label: "Needham" },
      { id: "wellesley", label: "Wellesley" },
      { id: "brookline", label: "Brookline" },
      { id: "boston", label: "Boston" }
    ]
  },
  {
    area: "South",
    neighborhoods: [
      { id: "norwood", label: "Norwood" },
      { id: "westwood", label: "Westwood" },
      { id: "dedham", label: "Dedham" },
      { id: "canton", label: "Canton" },
      { id: "walpole", label: "Walpole" },
      { id: "dover", label: "Dover" },
      { id: "medfield", label: "Medfield" },
      { id: "sharon", label: "Sharon" },
      { id: "stoughton", label: "Stoughton" },
      { id: "easton", label: "Easton" },
      { id: "mansfield", label: "Mansfield" },
      { id: "foxborough", label: "Foxborough" },
      { id: "norfolk", label: "Norfolk" },
      { id: "wrentham", label: "Wrentham" }
    ]
  },
  {
    area: "South Shore",
    neighborhoods: [
      { id: "quincy", label: "Quincy" },
      { id: "milton", label: "Milton" },
      { id: "braintree", label: "Braintree" },
      { id: "weymouth", label: "Weymouth" },
      { id: "randolph", label: "Randolph" },
      { id: "hingham", label: "Hingham" },
      { id: "cohasset", label: "Cohasset" },
      { id: "scituate", label: "Scituate" },
      { id: "norwell", label: "Norwell" },
      { id: "hull", label: "Hull" },
      { id: "rockland", label: "Rockland" },
      { id: "holbrook", label: "Holbrook" },
      { id: "avon", label: "Avon" }
    ]
  }
];

// ── Main Categories ──
const CATEGORIES = [
  { id: "sports",    label: "Sports & Athletics",         icon: "\u26BD", color: "#C84B31" },
  { id: "arts",      label: "Arts & Creative Expression", icon: "\uD83C\uDFA8", color: "#8B4E8B" },
  { id: "stem",      label: "STEM & Academic",            icon: "\uD83E\uDDEA", color: "#2A6F6F" },
  { id: "adventure", label: "Adventure & Wilderness",     icon: "\uD83C\uDF32", color: "#3E6B48" },
  { id: "life",      label: "Life Skills & Specialized",  icon: "\uD83D\uDEE0\uFE0F", color: "#D4A843" }
];

// ── Subcategories ──
const SUBCATEGORIES = {
  sports: [
    { id: "field-sports",      label: "Field Sports",        icon: "\u26BD" },
    { id: "court-sports",      label: "Court Sports",        icon: "\uD83C\uDFC0" },
    { id: "water-sports",      label: "Water Sports",        icon: "\uD83C\uDFCA" },
    { id: "individual-combat", label: "Individual & Combat", icon: "\uD83E\uDD4A" },
    { id: "multi-sport",       label: "Multi-Sport",         icon: "\uD83C\uDFC5" }
  ],
  arts: [
    { id: "theater",      label: "Theater",      icon: "\uD83C\uDFAD" },
    { id: "dance",        label: "Dance",         icon: "\uD83D\uDC83" },
    { id: "music",        label: "Music",         icon: "\uD83C\uDFB5" },
    { id: "visual-arts",  label: "Visual Arts",   icon: "\uD83D\uDD8C\uFE0F" },
    { id: "digital-arts", label: "Digital Arts",  icon: "\uD83C\uDFAC" }
  ],
  stem: [
    { id: "coding",           label: "Technology & Coding", icon: "\uD83D\uDCBB" },
    { id: "natural-sciences", label: "Natural Sciences",    icon: "\uD83D\uDD2C" },
    { id: "engineering",      label: "Engineering",         icon: "\u2699\uFE0F" },
    { id: "humanities",       label: "Humanities & Logic",  icon: "\u265F\uFE0F" }
  ],
  adventure: [
    { id: "outdoor-survival", label: "Outdoor Survival", icon: "\uD83D\uDD25" },
    { id: "high-adrenaline",  label: "High-Adrenaline",  icon: "\uD83E\uDDD7" },
    { id: "nature-study",     label: "Nature Study",     icon: "\uD83C\uDF3F" },
    { id: "sleepaway",        label: "Sleepaway",        icon: "\uD83C\uDFD5\uFE0F" }
  ],
  life: [
    { id: "culinary",      label: "Culinary",               icon: "\uD83C\uDF73" },
    { id: "leadership",    label: "Leadership & Business",   icon: "\uD83D\uDCBC" },
    { id: "special-needs", label: "Special Needs",           icon: "\uD83D\uDC9A" }
  ]
};

const SUBCATEGORY_MAP = {};
Object.values(SUBCATEGORIES).flat().forEach(sc => { SUBCATEGORY_MAP[sc.id] = sc; });

// ── Camp Catalog ──
const CAMPS = 

[
  {
    "id": "canton-soccer-school-canton-soccer-school",
    "name": "Canton Soccer School",
    "provider": "Canton Soccer School",
    "category": "sports",
    "subcategory": "field-sports",
    "tags": [
      "soccer",
      "field-sports",
      "youth",
      "all-levels",
      "summer-camp"
    ],
    "neighborhood": "canton",
    "description": "Canton Soccer School is a four-day camp (Monday-Thursday with a Friday make-up day) offering soccer training and games for players of all levels, from beginners to those with high school and college aspirations. The camp brings together the vibrant Canton soccer community while creating a developmental link between youth players and the Canton High School Soccer Program. Campers enjoy a week of passion, friendship, and competition in the world's game.",
    "sentiment": "",
    "ageRange": "5-9",
    "cost": "Check website",
    "location": "Canton",
    "url": "http://www.cantonsoccerschool.com/",
    "registrationDeadline": "January 1, 2026",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w07"
    ]
  },
  {
    "id": "new-england-surf-soccer-summer-camps-metro-south-region-new-",
    "name": "New England Surf Soccer Summer Camps – Metro South Region",
    "provider": "New England Surf",
    "category": "sports",
    "subcategory": "field-sports",
    "tags": [
      "soccer",
      "summer camp",
      "Nike Sports Camps",
      "all skill levels",
      "Metro South",
      "youth soccer"
    ],
    "neighborhood": "dedham",
    "description": "New England Surf Summer Camps offer a fun, safe, and developmentally appropriate soccer experience for players of all levels. Campers build confidence, improve skills, and form lasting friendships through four action-packed days of soccer, strength, and movement-based activities tailored to their skill level. Options include morning (9am-12pm), afternoon (12pm-3pm), or full-day (9am-3pm) sessions with engaging drills, small-sided games, and team challenges.",
    "sentiment": "",
    "ageRange": "7-15",
    "cost": "Check website",
    "location": "Dedham",
    "url": "https://newenglandsurf.com/event/metro-south-summer-camp/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w04",
      "w06",
      "w07",
      "w09"
    ]
  },
  {
    "id": "gymnastic-academy-of-boston-gymnastic-academy-of-boston",
    "name": "Gymnastic Academy of Boston",
    "provider": "Gymnastic Academy of Boston",
    "category": "sports",
    "subcategory": "multi-sport",
    "tags": [
      "gymnastics",
      "summer camp",
      "swimming",
      "sports",
      "day camp",
      "Norwood"
    ],
    "neighborhood": "norwood",
    "description": "Gymnastic Academy of Boston offers two summer camp options: Preschool Summer Camp for 4-year-olds featuring gymnastics instruction, swimming in their in-ground pool, arts and crafts, and theme weeks; and The Ultimate Grade School Summer Day Camp for ages 5+ combining rigorous gymnastic training with swimming, team building activities, obstacle courses, and open gym time in a fully air-conditioned facility.",
    "sentiment": "The teachers at G.A.B. always have control of the class, keep the children engaged, and have them showing steady improvements.",
    "ageRange": "4-18",
    "cost": "Check website",
    "location": "Norwood",
    "url": "https://gymnasticsacademyofboston.com/norwood/camps/summer-camps/",
    "registrationDeadline": "Rolling admission",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "mini-athletes-mini-athletes",
    "name": "Mini Athletes",
    "provider": "Mini Athletes",
    "category": "sports",
    "subcategory": "multi-sport",
    "tags": [
      "multi-sport",
      "youth",
      "soccer",
      "football",
      "basketball",
      "baseball"
    ],
    "neighborhood": "norwood",
    "description": "Mini Athletes offers sports programs for children ages 2 to 6, featuring introduction classes in soccer, football, basketball, and baseball. With a positive 'chin up, shoulders back' philosophy, the program promotes self-confidence, self-discipline, and healthy physical activity for young athletes.",
    "sentiment": "",
    "ageRange": "2-6",
    "cost": "Check website",
    "location": "Norwood",
    "url": "https://mini-athletes.com/",
    "registrationDeadline": "Rolling admission",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "cheer-advantage-cheer-advantage",
    "name": "Cheer Advantage",
    "provider": "Cheer Advantage",
    "category": "sports",
    "subcategory": "court-sports",
    "tags": [
      "cheerleading",
      "tumbling",
      "all-star",
      "youth sports",
      "Norwood"
    ],
    "neighborhood": "norwood",
    "description": "Cheer Advantage offers premier cheerleading and tumbling programs for all ages, from preschool through competitive all-star teams. The gym features classes in recreational cheer, novice cheer, half-year programs, and specialized tumbling instruction in a state-of-the-art Norwood facility.",
    "sentiment": "",
    "ageRange": "6-18",
    "cost": "Check website",
    "location": "Norwood",
    "url": "https://www.cheeradvantageallstars.com/",
    "registrationDeadline": "Rolling admission",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w03",
      "w04",
      "w05",
      "w06",
      "w07"
    ]
  },
  {
    "id": "action-norwood-action-norwood",
    "name": "Action Norwood",
    "provider": "Action Norwood",
    "category": "sports",
    "subcategory": "multi-sport",
    "tags": [
      "ninja",
      "parkour",
      "obstacle-course",
      "fitness",
      "athletics",
      "multi-sport"
    ],
    "neighborhood": "norwood",
    "description": "A summer focused on overcoming obstacles through ninja, sports, fitness, games, and fun! Experience different activities daily including parkour, swinging, climbing, balance, agility and more. Participate in group and individual challenges to build strength, coordination, and teamwork.",
    "sentiment": "",
    "ageRange": "5-18",
    "cost": "Check website",
    "location": "Norwood",
    "url": "https://www.action-athletics.com/norwood-summer-program.html",
    "registrationDeadline": "Rolling admission",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "skating-club-of-boston-skating-club-of-boston",
    "name": "Skating Club of Boston",
    "provider": "Skating Club of Boston",
    "category": "sports",
    "subcategory": "individual-combat",
    "tags": [
      "ice skating",
      "learn-to-skate",
      "all ages",
      "multiple locations",
      "competitive progression",
      "hockey"
    ],
    "neighborhood": "norwood",
    "description": "The Skating Academy offers fun and inclusive ice skating classes for all ages and skill levels, following the official Learn to Skate USA curriculum endorsed by U.S. Figure Skating, USA Hockey, and US Speedskating. Students build confidence and technique on the ice while making new friends in small-group lessons with quality coaching. Multiple campuses throughout eastern Massachusetts provide diverse programs including beginner, advanced, hockey, and adaptive skating options.",
    "sentiment": "",
    "ageRange": "7-17",
    "cost": "$256/8-week class",
    "location": "Norwood",
    "url": "https://skatingacademy.org/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w05"
    ]
  },
  {
    "id": "walpole-recreation-s-summer-on-stone-walpole-recreation",
    "name": "Walpole Recreation's Summer on Stone",
    "provider": "Walpole Recreation",
    "category": "sports",
    "subcategory": "multi-sport",
    "tags": [],
    "neighborhood": "walpole",
    "description": "Check website",
    "sentiment": "",
    "ageRange": "4-7",
    "cost": "Check website",
    "location": "Walpole",
    "url": "http://walpolerecreation.com/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07"
    ]
  },
  {
    "id": "walpole-recreation-s-walpole-woods-walpole-recreation",
    "name": "Walpole Recreation's Walpole Woods",
    "provider": "Walpole Recreation",
    "category": "sports",
    "subcategory": "multi-sport",
    "tags": [],
    "neighborhood": "walpole",
    "description": "Check website",
    "sentiment": "",
    "ageRange": "8-12",
    "cost": "Check website",
    "location": "Walpole",
    "url": "http://walpolerecreation.com/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07"
    ]
  },
  {
    "id": "rbi-academy-summer-day-camps-rbi-academy",
    "name": "RBI Academy Summer Day Camps",
    "provider": "RBI Academy",
    "category": "sports",
    "subcategory": "field-sports",
    "tags": [
      "baseball",
      "sports",
      "youth",
      "fundamentals",
      "coaching",
      "day-camp"
    ],
    "neighborhood": "walpole",
    "description": "Three days of top-level baseball instruction covering all fundamentals with daily games and drills led by experienced professional staff including college and former professional players. Campers train at RBI's spacious outdoor complex with multiple fields and benefit from a low participant-to-instructor ratio.",
    "sentiment": "",
    "ageRange": "5-12",
    "cost": "Check website",
    "location": "Walpole",
    "url": "https://www.rbiacademy.com/summerclinics",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w02",
      "w03"
    ]
  },
  {
    "id": "tracy-mclean-sports-play-camps-play-camp-tracy-mclean",
    "name": "Tracy McLean Sports & Play Camps - Play Camp",
    "provider": "Tracy McLean",
    "category": "sports",
    "subcategory": "multi-sport",
    "tags": [
      "sports",
      "play-based",
      "flexible-hours",
      "multi-activity",
      "outdoor-games",
      "summer-camp"
    ],
    "neighborhood": "walpole",
    "description": "Tracy McLean's Play Camp offers flexible, hourly drop-in sessions featuring outdoor sports, arts and crafts, water games, and daily themed activities. Kids can attend for a few hours or spend the full day (8:00-4:00) at Blessed Sacrament School, with programming designed to keep children active and engaged across multiple summer weeks.",
    "sentiment": "",
    "ageRange": "4-12",
    "cost": "$15/hour for 1 child, $20/hour for 2 children, $25/hour for 3+ children",
    "location": "Walpole",
    "url": "https://tmaclean8.wixsite.com/camps",
    "registrationDeadline": "Rolling admission",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w03",
      "w05",
      "w06",
      "w07",
      "w08"
    ]
  },
  {
    "id": "tracy-mclean-sports-play-camps-future-soccer-stars-soccer-ca",
    "name": "Tracy McLean Sports & Play Camps - Future Soccer Stars Soccer Camp",
    "provider": "Tracy McLean",
    "category": "sports",
    "subcategory": "multi-sport",
    "tags": [
      "sports",
      "play-based",
      "flexible-hours",
      "multi-activity",
      "outdoor-games",
      "summer-camp"
    ],
    "neighborhood": "norwood",
    "description": "Tracy McLean's Play Camp offers flexible, hourly drop-in sessions featuring outdoor sports, arts and crafts, water games, and daily themed activities. Kids can attend for a few hours or spend the full day (8:00-4:00) at Blessed Sacrament School, with programming designed to keep children active and engaged across multiple summer weeks.",
    "sentiment": "",
    "ageRange": "4-14",
    "cost": "$15/hour for 1 child, $20/hour for 2 children, $25/hour for 3+ children",
    "location": "Norwood",
    "url": "https://tmaclean8.wixsite.com/camps",
    "registrationDeadline": "Rolling admission",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01"
    ]
  },
  {
    "id": "tracy-mclean-sports-play-camps-future-stars-basketball-camp-",
    "name": "Tracy McLean Sports & Play Camps - Future Stars Basketball Camp",
    "provider": "Tracy McLean",
    "category": "sports",
    "subcategory": "multi-sport",
    "tags": [
      "sports",
      "play-based",
      "flexible-hours",
      "multi-activity",
      "outdoor-games",
      "summer-camp"
    ],
    "neighborhood": "walpole",
    "description": "Tracy McLean's Play Camp offers flexible, hourly drop-in sessions featuring outdoor sports, arts and crafts, water games, and daily themed activities. Kids can attend for a few hours or spend the full day (8:00-4:00) at Blessed Sacrament School, with programming designed to keep children active and engaged across multiple summer weeks.",
    "sentiment": "",
    "ageRange": "4-14",
    "cost": "$15/hour for 1 child, $20/hour for 2 children, $25/hour for 3+ children",
    "location": "Walpole",
    "url": "https://tmaclean8.wixsite.com/camps",
    "registrationDeadline": "Rolling admission",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w04"
    ]
  },
  {
    "id": "ne-surf-soccer-camp-norfolk-aggie-new-england-surf",
    "name": "NE Surf Soccer Camp @ Norfolk Aggie",
    "provider": "New England Surf",
    "category": "sports",
    "subcategory": "field-sports",
    "tags": [
      "soccer",
      "summer camp",
      "youth sports",
      "skill development",
      "team training",
      "multi-week sessions"
    ],
    "neighborhood": "walpole",
    "description": "New England Surf offers multiple summer soccer camps including full-day, AM, and PM options designed for fun and player development. Programs range from the Junior Academy for young players (U5-U8) to elite residential camps featuring 5 days of training, coaching, and competitions with top Northeast players.",
    "sentiment": "",
    "ageRange": "7-15",
    "cost": "Check website",
    "location": "Walpole",
    "url": "https://newenglandsurf.com/camps-and-clinics/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w09"
    ]
  },
  {
    "id": "challenger-sports-soccer-camp-challenger-sports",
    "name": "Challenger Sports' Soccer Camp",
    "provider": "Challenger Sports",
    "category": "sports",
    "subcategory": "field-sports",
    "tags": [
      "soccer",
      "skills-based",
      "youth",
      "summer camp",
      "field-sports"
    ],
    "neighborhood": "walpole",
    "description": "Challenger Sports offers soccer camps including Foundational Skills for ages 6-12, Creative Skills for ages 6-12, Elite programs for ages 11+, and TinyTykes for ages 2-5. Programs are designed to develop soccer skills through engaging coaching and skill-building activities.",
    "sentiment": "",
    "ageRange": "3-14",
    "cost": "Check website",
    "location": "Walpole",
    "url": "https://challenger.configio.com/orglandingpage?org=109257",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w06"
    ]
  },
  {
    "id": "icon-tennis-camp-icon-tennis",
    "name": "ICON Tennis Camp",
    "provider": "ICON Tennis",
    "category": "sports",
    "subcategory": "court-sports",
    "tags": [
      "tennis",
      "court-sports",
      "all-levels",
      "summer-camp",
      "instruction"
    ],
    "neighborhood": "walpole",
    "description": "ICON Tennis Camp offers instruction in tennis fundamentals for all levels at Walpole High School. Campers are divided into Red Ball (beginners) and Orange/Green Ball (intermediate/advanced) courts, with lessons tailored to each group's skill level and interests.",
    "sentiment": "",
    "ageRange": "5-13",
    "cost": "$65/day or $300/week",
    "location": "Walpole",
    "url": "https://icontennispickle.com/pages/2025-summer-tennis-camp-signup",
    "registrationDeadline": "Rolling admission",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "greg-carter-hockey-camp-greg-carter-hockey",
    "name": "Greg Carter Hockey Camp",
    "provider": "Greg Carter Hockey",
    "category": "sports",
    "subcategory": "court-sports",
    "tags": [
      "hockey",
      "ice-sports",
      "skills-training",
      "summer-camp",
      "massachusetts"
    ],
    "neighborhood": "canton",
    "description": "Check website",
    "sentiment": "",
    "ageRange": "5-12",
    "cost": "Check website",
    "location": "Canton",
    "url": "https://gchockey.com/camps/massachusetts/canton-ice-house",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w03",
      "w09"
    ]
  },
  {
    "id": "stoughton-rec-stoughton-rec",
    "name": "Stoughton Rec",
    "provider": "Stoughton Rec",
    "category": "sports",
    "subcategory": "multi-sport",
    "tags": [],
    "neighborhood": "stoughton",
    "description": "Check website",
    "sentiment": "",
    "ageRange": "3-6",
    "cost": "Check website",
    "location": "Stoughton",
    "url": "https://stoughtonma.myrec.com/info/default.aspx",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07"
    ]
  },
  {
    "id": "victory-stables-victory-stables",
    "name": "Victory Stables",
    "provider": "Victory Stables",
    "category": "sports",
    "subcategory": "individual-combat",
    "tags": [
      "horse-riding",
      "hunter-seat",
      "equestrian",
      "day-camp",
      "ages-6-16",
      "english-riding"
    ],
    "neighborhood": "stoughton",
    "description": "Day summer programs for ages 6-16 featuring quality English hunter seat riding instruction with small groups of similar skill levels. Each day includes horse care activities like feeding, grooming, saddling, and bathing, plus riding lessons and fun activities such as obstacle courses, culminating in a schooling horse show with ribbons and prizes on the final day.",
    "sentiment": "",
    "ageRange": "6-16",
    "cost": "$725/session",
    "location": "Stoughton",
    "url": "https://www.victorystablesinc.com/summer.html",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w03",
      "w04",
      "w07"
    ]
  },
  {
    "id": "d-bat-metro-south-d-bat",
    "name": "D-BAT Metro South",
    "provider": "D-BAT",
    "category": "sports",
    "subcategory": "field-sports",
    "tags": [
      "baseball",
      "softball",
      "sports",
      "lessons",
      "indoor"
    ],
    "neighborhood": "stoughton",
    "description": "D-BAT Metro South offers baseball and softball instruction at a state-of-the-art, climate-controlled indoor facility. Kids can participate in private lessons, camps, clinics, and batting cage sessions with professional instructors using real baseballs and softballs.",
    "sentiment": "",
    "ageRange": "6-13",
    "cost": "Check website",
    "location": "Stoughton",
    "url": "https://www.dbatmetrosouth.com/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09"
    ]
  },
  {
    "id": "avon-recreation-department-avon-recreation",
    "name": "Avon Recreation Department",
    "provider": "Avon Recreation",
    "category": "sports",
    "subcategory": "multi-sport",
    "tags": [],
    "neighborhood": "avon",
    "description": "Check website",
    "sentiment": "",
    "ageRange": "6-5",
    "cost": "Check website",
    "location": "Avon",
    "url": "https://unipaygold.unibank.com/customerinfo.aspx",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08"
    ]
  },
  {
    "id": "central-rock-gym-central-rock-gym",
    "name": "Central Rock Gym",
    "provider": "Central Rock Gym",
    "category": "sports",
    "subcategory": "individual-combat",
    "tags": [
      "rock climbing",
      "youth programs",
      "summer camp",
      "indoor climbing",
      "skill development",
      "ages 3.5-18"
    ],
    "neighborhood": "randolph",
    "description": "Central Rock Gym's Summer Camp provides kids with a valuable out-of-school experience through weeklong programs designed for both new climbers and returning participants. The camp offers a safe and fun climbing environment for all skill levels, helping children develop fundamental climbing skills while enjoying expert instruction.",
    "sentiment": "",
    "ageRange": "4-13",
    "cost": "Check website",
    "location": "Randolph",
    "url": "https://centralrockgym.com/randolph/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09"
    ]
  },
  {
    "id": "flip-n-tumble-tumbling-camp-flip-n-tumble",
    "name": "Flip N' Tumble Tumbling Camp",
    "provider": "Flip N' Tumble",
    "category": "sports",
    "subcategory": "individual-combat",
    "tags": [
      "gymnastics",
      "tumbling",
      "physical-fitness",
      "skill-building",
      "youth-sports",
      "flexibility"
    ],
    "neighborhood": "easton",
    "description": "Flip N' Tumble offers tumbling and gymnastics instruction for children of various skill levels. The camp provides structured classes and skill assessments to help kids develop strength, coordination, and confidence through gymnastics.",
    "sentiment": "",
    "ageRange": "6-12",
    "cost": "Check website",
    "location": "Easton",
    "url": "http://www.flipntumble.com/schedule",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "mass-premier-courts-mass-premier-courts",
    "name": "Mass Premier Courts",
    "provider": "Mass Premier Courts",
    "category": "sports",
    "subcategory": "court-sports",
    "tags": [
      "basketball",
      "court-sports",
      "summer camps",
      "youth athletics",
      "skill development",
      "indoor sports"
    ],
    "neighborhood": "foxborough",
    "description": "Basketball youth camps and clinics designed to teach young players the fundamentals of basketball while improving their skills and fostering a love for the game. Programs include skill development, drills & exercises, game play, coaching, and character development.",
    "sentiment": "",
    "ageRange": "4-12",
    "cost": "Check website",
    "location": "Foxboro",
    "url": "https://masspremiercourts.com/basketball/camps/?la-state=OPEN_REGISTRATIONS&la-sport=Basketball&la-experienceLevel=Camps&la-type=CAMP&la-hasCustomFilters=true",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w04",
      "w05",
      "w06",
      "w07",
      "w08"
    ]
  },
  {
    "id": "behn-basketball-camp-behn-basketball-camp",
    "name": "Behn Basketball Camp",
    "provider": "Behn Basketball Camp",
    "category": "sports",
    "subcategory": "court-sports",
    "tags": [
      "basketball",
      "day camp",
      "skill development",
      "youth sports",
      "team play",
      "fundamentals"
    ],
    "neighborhood": "foxborough",
    "description": "Day basketball camps designed to help players of all abilities improve on the fundamentals of the game. Campers are grouped by gender, age, and ability, participating in 20-30 minute activities that focus on individual skills, team play, and agility enhancement with top coaches including high school and collegiate athletes.",
    "sentiment": "Thomas is always talking about things he learned in Behn camp. We sign up for your camps first and plan the rest of our summer around them.",
    "ageRange": "8-16",
    "cost": "Check website",
    "location": "Foxboro",
    "url": "http://www.behncamp.com/basketball/camps/day/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w05"
    ]
  },
  {
    "id": "rbi-baseball-academy-summer-day-camp-rbi-baseball-academy",
    "name": "RBI Baseball Academy Summer Day Camp",
    "provider": "RBI Baseball Academy",
    "category": "sports",
    "subcategory": "field-sports",
    "tags": [],
    "neighborhood": "foxborough",
    "description": "",
    "sentiment": "",
    "ageRange": "5-14",
    "cost": "Check website",
    "location": "Foxboro",
    "url": "https://www.rbiacademy.com/summerdaycamps",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w02",
      "w03",
      "w04",
      "w05"
    ]
  },
  {
    "id": "fore-kicks-fore-kicks",
    "name": "Fore Kicks",
    "provider": "Fore Kicks",
    "category": "sports",
    "subcategory": "field-sports",
    "tags": [
      "soccer",
      "multi-sport",
      "youth",
      "indoor",
      "skills-based",
      "rolling-admission"
    ],
    "neighborhood": "norfolk",
    "description": "Fore Kicks Norfolk offers an 85,000 sq. ft. indoor sports megaplex with Lil Kickers programs for ages 18 months to 9 years old and Skills Institute soccer classes for ages 5 to 12 years old. Kids enjoy multiple levels from beginner to advanced in a state-of-the-art facility with no membership fees required.",
    "sentiment": "",
    "ageRange": "4-15",
    "cost": "Check website",
    "location": "Norfolk",
    "url": "https://www.forekicks.com/norfolk/",
    "registrationDeadline": "Rolling admission",
    "documents": [
      "Online Waiver"
    ],
    "weeks": [
      "w01",
      "w03",
      "w04",
      "w05",
      "w07",
      "w09"
    ]
  },
  {
    "id": "arnold-s-gymnastics-academy-arnold-s-gymnastics-academy",
    "name": "Arnold's Gymnastics Academy",
    "provider": "Arnold's Gymnastics Academy",
    "category": "sports",
    "subcategory": "multi-sport",
    "tags": [
      "gymnastics",
      "ninja",
      "obstacle course",
      "motor skills",
      "athletic development",
      "themed weeks"
    ],
    "neighborhood": "mansfield",
    "description": "Arnold's Gymnastics Academy summer camp develops motor skills and athletic movement through obstacle courses, gymnastics instruction, ninja training, crafts, and games. Campers experience daily themed weeks like Olympic Champions, Disney Week, and S.T.E.A.M. exploration, with mornings focused on gymnastics and ninja skills and afternoons on athletic instruction.",
    "sentiment": "",
    "ageRange": "3-18",
    "cost": "$215/week half day, $395/week full day",
    "location": "Mansfield",
    "url": "http://www.arnoldsgymnastics.com/camps/summer-camp",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "capstone-farm-pony-pals-summer-experience-capstone-farm",
    "name": "Capstone Farm Pony Pals Summer Experience",
    "provider": "Capstone Farm",
    "category": "sports",
    "subcategory": "individual-combat",
    "tags": [
      "horseback riding",
      "equestrian",
      "horsemanship",
      "barn management",
      "summer camp"
    ],
    "neighborhood": "mansfield",
    "description": "Campers enjoy horseback riding, unmounted horsemanship, barn management, games, arts & crafts, and more during this half-day summer program. Open to rising 2nd through 12th graders, with specialized New Riders Week for beginners.",
    "sentiment": "",
    "ageRange": "7-17",
    "cost": "$560/week; $1,100 for 2 weeks; $1,650 for 3 weeks; $2,140 for 4 weeks; $535 for New Riders Week",
    "location": "Mansfield",
    "url": "https://www.ridecapstonefarm.com/summer-horsemanship-camp",
    "registrationDeadline": "April 15, 2026",
    "documents": [
      "Registration form"
    ],
    "weeks": [
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08"
    ]
  },
  {
    "id": "all-around-gymnastic-academy-summer-camp-all-around-gymnasti",
    "name": "All Around Gymnastic Academy Summer Camp",
    "provider": "All Around Gymnastic Academy",
    "category": "sports",
    "subcategory": "individual-combat",
    "tags": [
      "gymnastics",
      "summer camp",
      "arts and crafts",
      "water play",
      "team building",
      "daily gymnastics"
    ],
    "neighborhood": "plainville",
    "description": "At All Around, summer camp is where kids feel excited, included, and part of a true community. Campers build friendships, grow confident in their gymnastics through daily movement, and explore their creativity with games, crafts, and imaginative play. In their safe, clean, and air-conditioned facility, children feel comfortable and supported while enjoying structured gymnastics lessons, open gym exploration, creative crafts, outdoor water play, and yoga.",
    "sentiment": "",
    "ageRange": "5-18",
    "cost": "$48/day (half day) or $86/day (full day)",
    "location": "Plainville",
    "url": "https://www.allaroundgymnasticacademy.com/camps/",
    "registrationDeadline": "Check website",
    "documents": [
      "Current Physical Exam",
      "Up-To-Date Immunization Records",
      "Pick-Up Authorization Form",
      "Medication Administration Release Form",
      "Sunscreen Authorization Form",
      "Camp Consent Form"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09"
    ]
  },
  {
    "id": "summer-recreation-program-plainville-parks-and-recreation",
    "name": "Summer Recreation Program",
    "provider": "Plainville Parks and Recreation",
    "category": "sports",
    "subcategory": "multi-sport",
    "tags": [
      "summer recreation",
      "multi-sport",
      "field trips",
      "swimming",
      "arts and crafts"
    ],
    "neighborhood": "plainville",
    "description": "The Plainville Summer Recreation Program offers 8 weeks of full-day (8:30 AM–4 PM) activities for children entering 1st–8th grade, featuring daily sports, field games, swimming, arts and crafts, and weekly field trips to venues like bowling alleys, skating rinks, laser tag, and trampoline parks. Weekly cookouts and special events are included, with no additional charges for field trips or pool time.",
    "sentiment": "",
    "ageRange": "6-14",
    "cost": "$260/week for full-week sessions; $70/full day or $40/half day for daily sign-ups",
    "location": "Plainville",
    "url": "https://www.plainville.ma.us/281/Summer-Recreation-Program",
    "registrationDeadline": "May 2, 2025 (online registration opens); one week minimum notice required for weekly or daily registrations",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09"
    ]
  },
  {
    "id": "summer-recreation-program-plainville-recreation",
    "name": "Summer Recreation Program",
    "provider": "Plainville Recreation",
    "category": "sports",
    "subcategory": "multi-sport",
    "tags": [
      "summer recreation",
      "multi-sport",
      "field trips",
      "swimming",
      "arts and crafts"
    ],
    "neighborhood": "plainville",
    "description": "The Plainville Summer Recreation Program offers 8 weeks of full-day (8:30 AM–4 PM) activities for children entering 1st–8th grade, featuring daily sports, field games, swimming, arts and crafts, and weekly field trips to venues like bowling alleys, skating rinks, laser tag, and trampoline parks. Weekly cookouts and special events are included, with no additional charges for field trips or pool time.",
    "sentiment": "",
    "ageRange": "6-14",
    "cost": "$260/week for full-week sessions; $70/full day or $40/half day for daily sign-ups",
    "location": "Plainville",
    "url": "https://www.plainville.ma.us/281/Summer-Recreation-Program",
    "registrationDeadline": "May 2, 2025 (online registration opens); one week minimum notice required for weekly or daily registrations",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09"
    ]
  },
  {
    "id": "warrior-ice-arena-youth-hockey-camps-warrior-ice-arena",
    "name": "Warrior Ice Arena Youth Hockey Camps",
    "provider": "Warrior Ice Arena",
    "category": "sports",
    "subcategory": "water-sports",
    "tags": [
      "hockey",
      "ice-sports",
      "skill-development",
      "summer-camp",
      "multi-activity",
      "youth"
    ],
    "neighborhood": "norwood",
    "description": "Week-long hockey camps featuring two on-ice sessions daily focused on skill development, scrimmages, and game applications, plus off-ice activities including track and field games, bowling, and agility training at the TRACK at New Balance.",
    "sentiment": "",
    "ageRange": "5-14",
    "cost": "Check website",
    "location": "Allston-Brighton",
    "url": "https://www.warrioricearena.com/skating-hockey-programs/youth-hockey-camps/",
    "registrationDeadline": "Rolling admission",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09"
    ]
  },
  {
    "id": "sports-camp-jcc-greater-boston",
    "name": "Sports Camp",
    "provider": "JCC Greater Boston",
    "category": "sports",
    "subcategory": "multi-sport",
    "tags": [
      "multi-sport",
      "basketball",
      "baseball",
      "soccer",
      "summer camp",
      "outdoor"
    ],
    "neighborhood": "norwood",
    "description": "Sports Camp offers kids in grades K–6 a full summer of skill-building in basketball, baseball, soccer, tennis, football, and more, with daily outdoor swim and team games. The recreational program emphasizes teamwork, sampling a variety of sports, and developing confidence both on and off the field across age-based divisions tailored to each child's level.",
    "sentiment": "Sports Camp is for kids who love being active.",
    "ageRange": "5-12",
    "cost": "$888/week",
    "location": "Newton",
    "url": "https://www.bostonjcc.org/program/sports-camp/",
    "registrationDeadline": "Rolling admission",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09"
    ]
  },
  {
    "id": "viking-sports-viking-sports",
    "name": "Viking Sports",
    "provider": "Viking Sports",
    "category": "sports",
    "subcategory": "multi-sport",
    "tags": [
      "multi-sport",
      "baseball",
      "basketball",
      "soccer",
      "lacrosse",
      "tennis"
    ],
    "neighborhood": "brookline",
    "description": "Viking Sports offers multi-sport summer camps for ages 3-13, as well as specialized sport-specific camps in baseball, basketball, lacrosse, soccer, tennis, and more. Campers enjoy themed days, a CIT program for teens, and various locations throughout the Greater Boston area.",
    "sentiment": "",
    "ageRange": "3-13",
    "cost": "Check website",
    "location": "Brookline",
    "url": "https://www.vikingcamps.com/",
    "registrationDeadline": "Rolling admission",
    "documents": [
      "Health form",
      "Waiver",
      "Asthma Authorization Form",
      "Epipen Authorization Form",
      "Authorization to Give Medicine Form"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10",
      "w11"
    ]
  },
  {
    "id": "dexter-southfield-dexter-southfield",
    "name": "Dexter Southfield",
    "provider": "Dexter Southfield",
    "category": "sports",
    "subcategory": "multi-sport",
    "tags": [
      "multi-sport",
      "enrichment",
      "athletics",
      "summer camp",
      "Brookline MA",
      "ages 3.5-18"
    ],
    "neighborhood": "brookline",
    "description": "Dexter Summer offers three customizable camp experiences for children ages 3.5-18 in Brookline, MA: Classic Summer Camp with beloved traditions and activities, NEW Enrichment programs featuring specialty sessions like Strength Training and Astronomy, and NEW Premier Athletics for middle and high school ice hockey players. The camp runs June 15–August 14, 2026 with experienced staff including directors, activity specialists, and counselors dedicated to creating meaningful friendships and summer memories.",
    "sentiment": "",
    "ageRange": "3-18",
    "cost": "Check website",
    "location": "Brookline",
    "url": "https://www.dextersouthfield.org/summer/offerings",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08"
    ]
  },
  {
    "id": "oak-square-ymca-ymca-boston",
    "name": "Oak Square YMCA",
    "provider": "YMCA Boston",
    "category": "sports",
    "subcategory": "multi-sport",
    "tags": [
      "day camp",
      "sports",
      "swimming",
      "youth",
      "community"
    ],
    "neighborhood": "norwood",
    "description": "Oak Square YMCA offers day camps where kids are kept engaged, safe, healthy and learning. The Y focuses on top-notch sports and swimming instruction, community exploration, and developing lifelong friendships.",
    "sentiment": "",
    "ageRange": "3-15",
    "cost": "Check website",
    "location": "Allston-Brighton",
    "url": "https://ymcaboston.org/youth-and-family/camps/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "action-athletics-summer-program-action-athletics",
    "name": "Action Athletics Summer Program",
    "provider": "Action Athletics",
    "category": "sports",
    "subcategory": "multi-sport",
    "tags": [
      "ninja",
      "parkour",
      "fitness",
      "obstacle course",
      "multi-sport",
      "summer camp"
    ],
    "neighborhood": "norwood",
    "description": "A summer program focused on overcoming obstacles through ninja, sports, fitness, games, and fun! Kids experience different activities daily including parkour, swinging, climbing, balance, agility and more. Participants engage in group and individual challenges to build strength, coordination, and teamwork.",
    "sentiment": "",
    "ageRange": "5-18",
    "cost": "$50/day or $225/5-pack",
    "location": "Allston-Brighton",
    "url": "https://www.action-athletics.com/boston-summer-program.html",
    "registrationDeadline": "Rolling admission",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10",
      "w11"
    ]
  },
  {
    "id": "boston-university-boston-university",
    "name": "Boston University",
    "provider": "Boston University",
    "category": "sports",
    "subcategory": "multi-sport",
    "tags": [
      "multi-sport",
      "aquatics",
      "dance",
      "climbing",
      "tumbling",
      "family-friendly"
    ],
    "neighborhood": "norwood",
    "description": "FitRec offers a wide choice of classes and activities designed to get children of any age moving and learning. Programs range from splash time in warm, shallow pools for 6-month-old babies to energized 8-year-olds learning safety and gaining confidence on a 30-foot climbing wall.",
    "sentiment": "",
    "ageRange": "5-13",
    "cost": "Check website",
    "location": "Allston-Brighton",
    "url": "https://www.bu.edu/fitrec/what-we-offer/family-programs/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08"
    ]
  },
  {
    "id": "warrior-ice-arena-warrior-ice-arena",
    "name": "Warrior Ice Arena",
    "provider": "Warrior Ice Arena",
    "category": "sports",
    "subcategory": "court-sports",
    "tags": [
      "hockey",
      "skating",
      "ice-sports",
      "summer-camp",
      "youth-programs",
      "Boston-Bruins"
    ],
    "neighborhood": "norwood",
    "description": "Warrior Ice Arena offers hockey and recreational skating camps at their state-of-the-art facility, the official practice home of the Boston Bruins. Kids can learn to play and skate where the Bruins dominate, with both traditional hockey camps and a new recreational camp option available.",
    "sentiment": "",
    "ageRange": "5-14",
    "cost": "Check website",
    "location": "Allston-Brighton",
    "url": "https://www.warrioricearena.com/",
    "registrationDeadline": "Rolling admission",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09"
    ]
  },
  {
    "id": "technique-swim-academy-technique-swim-academy",
    "name": "Technique Swim Academy",
    "provider": "Technique Swim Academy",
    "category": "sports",
    "subcategory": "water-sports",
    "tags": [
      "swimming",
      "competitive",
      "technique",
      "advanced",
      "summer camp",
      "youth"
    ],
    "neighborhood": "norwood",
    "description": "An advanced swim camp for ages 9-16 with at least two years of team experience, focusing on technique through intensive drills with swimmers in the water for up to two hours at a time. Overseen by Harvard Coach Kevin Tyrrell and college/high school coaches, the program emphasizes race strategy and stroke improvement for competitive swimmers aiming to excel in high school, improve individual times, or qualify for championship meets.",
    "sentiment": "",
    "ageRange": "9-16",
    "cost": "Check website",
    "location": "Allston-Brighton",
    "url": "https://techniqueswimacademy.com/",
    "registrationDeadline": "Check website",
    "documents": [
      "Medical Forms"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07"
    ]
  },
  {
    "id": "jr-celtics-academy-new-balance-track-nba-boston-celtics",
    "name": "Jr. Celtics Academy @ New Balance Track",
    "provider": "NBA Boston Celtics",
    "category": "sports",
    "subcategory": "court-sports",
    "tags": [
      "basketball",
      "youth sports",
      "court-sports",
      "summer camp",
      "skill development",
      "teamwork"
    ],
    "neighborhood": "norwood",
    "description": "Jr. Celtics Academy provides youth basketball experiences where each child is treated like an MVP. The program offers 5-day summer camps with on-court skill development, teamwork building, and leadership activities for ages 7-14, plus 3-day spring training clinics featuring developmental sessions and healthy competition across New England locations.",
    "sentiment": "",
    "ageRange": "7-14",
    "cost": "Check website",
    "location": "Allston-Brighton",
    "url": "https://www.nba.com/celtics/jrceltics",
    "registrationDeadline": "Rolling admission",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w05",
      "w06",
      "w07"
    ]
  },
  {
    "id": "huntington-ave-ymca-ymca-boston",
    "name": "Huntington Ave YMCA",
    "provider": "YMCA Boston",
    "category": "sports",
    "subcategory": "multi-sport",
    "tags": [
      "day camp",
      "sports",
      "swimming",
      "youth",
      "community"
    ],
    "neighborhood": "norwood",
    "description": "Oak Square YMCA offers day camps where kids are kept engaged, safe, healthy and learning. The Y focuses on top-notch sports and swimming instruction, community exploration, and developing lifelong friendships.",
    "sentiment": "",
    "ageRange": "5-13",
    "cost": "Check website",
    "location": "Fenway-Kenmore",
    "url": "https://ymcaboston.org/youth-and-family/camps/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "franklin-soccer-school-franklin-soccer-school",
    "name": "Franklin Soccer School",
    "provider": "Franklin Soccer School",
    "category": "sports",
    "subcategory": "field-sports",
    "tags": [
      "soccer",
      "summer camp",
      "skill development",
      "indoor facility",
      "youth sports"
    ],
    "neighborhood": "franklin",
    "description": "Franklin Soccer School offers summer programs for multiple age groups held in July and August at Downtown Sports. Campers participate in fun skill games and technical training using the Smart Soccer World Cup theme, with instruction integrated into games rather than drills. All players receive a soccer ball and t-shirt.",
    "sentiment": "",
    "ageRange": "4-12",
    "cost": "Check website",
    "location": "Franklin",
    "url": "https://www.franklinsoccerschool.com/programs/summerprograms",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w07",
      "w09",
      "w10"
    ]
  },
  {
    "id": "united-sports-arena-cricket-camp-united-sports-arena",
    "name": "United Sports Arena: Cricket Camp",
    "provider": "United Sports Arena",
    "category": "sports",
    "subcategory": "field-sports",
    "tags": [
      "cricket",
      "indoor sports",
      "youth training",
      "elite coaching",
      "skill development",
      "facility-based"
    ],
    "neighborhood": "franklin",
    "description": "United Sports Arena is New England's premier indoor cricket destination, established in 2024, offering cutting-edge facilities and top-tier coaching focused on nurturing skilled, confident players ready to compete internationally. The academy features advanced cricket lanes with professional-grade nets, high-tech bowling machines with variable speed controls, video analysis technology, and comprehensive fitness training tailored specifically for cricketers.",
    "sentiment": "",
    "ageRange": "5-17",
    "cost": "Check website",
    "location": "Franklin",
    "url": "https://www.unitedsportsarena.com/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09"
    ]
  },
  {
    "id": "next9up-next9up",
    "name": "Next9Up",
    "provider": "Next9Up",
    "category": "sports",
    "subcategory": "multi-sport",
    "tags": [
      "baseball",
      "softball",
      "athletic training",
      "skill development",
      "leadership",
      "conditioning"
    ],
    "neighborhood": "franklin",
    "description": "Next9Up is an athletic training facility where student-athletes connect with expert coaches in a high-energy, supportive environment to build skills, confidence, and character. Programs combine advanced training methods and community support to help athletes perform at their best, whether they're chasing a roster spot or developing leadership skills. The facility emphasizes creating lifelong memories and character development alongside athletic improvement.",
    "sentiment": "It's not how you win the game, it's how you make memories.",
    "ageRange": "6-14",
    "cost": "Check website",
    "location": "Franklin",
    "url": "http://www.next9up.com/",
    "registrationDeadline": "Check website",
    "documents": [
      "Release form"
    ],
    "weeks": [
      "w02"
    ]
  },
  {
    "id": "greg-carter-hockey-camp-greg-carter-hockey-camp",
    "name": "Greg Carter Hockey Camp",
    "provider": "Greg Carter Hockey Camp",
    "category": "sports",
    "subcategory": "court-sports",
    "tags": [
      "hockey",
      "ice-hockey",
      "skills-training",
      "elite-coaching",
      "summer-camp",
      "massachusetts"
    ],
    "neighborhood": "franklin",
    "description": "Greg Carter Hockey offers elite hockey training camps at Pirelli Veterans Arena in Franklin, MA. Players develop their skills through the Carter Method, focusing on championship-level instruction and competitive results.",
    "sentiment": "",
    "ageRange": "6-15",
    "cost": "Check website",
    "location": "Franklin",
    "url": "https://gchockey.com/camps/massachusetts/pirelli-veterans-arena",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w07",
      "w09"
    ]
  },
  {
    "id": "fore-kicks-lil-sports-camper-fore-kicks",
    "name": "Fore Kicks - Lil Sports Camper",
    "provider": "Fore Kicks",
    "category": "sports",
    "subcategory": "field-sports",
    "tags": [
      "soccer",
      "multi-sport",
      "youth",
      "indoor",
      "skills-based",
      "rolling-admission"
    ],
    "neighborhood": "norfolk",
    "description": "Fore Kicks Norfolk offers an 85,000 sq. ft. indoor sports megaplex with Lil Kickers programs for ages 18 months to 9 years old and Skills Institute soccer classes for ages 5 to 12 years old. Kids enjoy multiple levels from beginner to advanced in a state-of-the-art facility with no membership fees required.",
    "sentiment": "",
    "ageRange": "5-7",
    "cost": "Check website",
    "location": "Norfolk",
    "url": "https://www.forekicks.com/norfolk/",
    "registrationDeadline": "Rolling admission",
    "documents": [
      "Online Waiver"
    ],
    "weeks": [
      "w03",
      "w04",
      "w05",
      "w07",
      "w09"
    ]
  },
  {
    "id": "fore-kicks-super-all-sports-fore-kicks",
    "name": "Fore Kicks - Super All Sports",
    "provider": "Fore Kicks",
    "category": "sports",
    "subcategory": "field-sports",
    "tags": [
      "soccer",
      "multi-sport",
      "youth",
      "indoor",
      "skills-based",
      "rolling-admission"
    ],
    "neighborhood": "norfolk",
    "description": "Fore Kicks Norfolk offers an 85,000 sq. ft. indoor sports megaplex with Lil Kickers programs for ages 18 months to 9 years old and Skills Institute soccer classes for ages 5 to 12 years old. Kids enjoy multiple levels from beginner to advanced in a state-of-the-art facility with no membership fees required.",
    "sentiment": "",
    "ageRange": "8-12",
    "cost": "Check website",
    "location": "Norfolk",
    "url": "https://www.forekicks.com/norfolk/",
    "registrationDeadline": "Rolling admission",
    "documents": [
      "Online Waiver"
    ],
    "weeks": [
      "w03",
      "w04",
      "w05",
      "w07",
      "w09"
    ]
  },
  {
    "id": "fore-kicks-soccer-skills-academy-fore-kicks",
    "name": "Fore Kicks - Soccer Skills Academy",
    "provider": "Fore Kicks",
    "category": "sports",
    "subcategory": "field-sports",
    "tags": [
      "soccer",
      "multi-sport",
      "youth",
      "indoor",
      "skills-based",
      "rolling-admission"
    ],
    "neighborhood": "norfolk",
    "description": "Fore Kicks Norfolk offers an 85,000 sq. ft. indoor sports megaplex with Lil Kickers programs for ages 18 months to 9 years old and Skills Institute soccer classes for ages 5 to 12 years old. Kids enjoy multiple levels from beginner to advanced in a state-of-the-art facility with no membership fees required.",
    "sentiment": "",
    "ageRange": "8-12",
    "cost": "Check website",
    "location": "Norfolk",
    "url": "https://www.forekicks.com/norfolk/",
    "registrationDeadline": "Rolling admission",
    "documents": [
      "Online Waiver"
    ],
    "weeks": [
      "w03",
      "w04",
      "w05",
      "w07",
      "w09"
    ]
  },
  {
    "id": "fore-kicks-golf-clinic-fore-kicks",
    "name": "Fore Kicks - Golf Clinic",
    "provider": "Fore Kicks",
    "category": "sports",
    "subcategory": "field-sports",
    "tags": [
      "soccer",
      "multi-sport",
      "youth",
      "indoor",
      "skills-based",
      "rolling-admission"
    ],
    "neighborhood": "norfolk",
    "description": "Fore Kicks Norfolk offers an 85,000 sq. ft. indoor sports megaplex with Lil Kickers programs for ages 18 months to 9 years old and Skills Institute soccer classes for ages 5 to 12 years old. Kids enjoy multiple levels from beginner to advanced in a state-of-the-art facility with no membership fees required.",
    "sentiment": "",
    "ageRange": "4-15",
    "cost": "Check website",
    "location": "Norfolk",
    "url": "https://www.forekicks.com/norfolk/",
    "registrationDeadline": "Rolling admission",
    "documents": [
      "Online Waiver"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09"
    ]
  },
  {
    "id": "summer-recreation-program-plainville-parks-recreation",
    "name": "Summer Recreation Program",
    "provider": "Plainville Parks & Recreation",
    "category": "sports",
    "subcategory": "multi-sport",
    "tags": [
      "summer recreation",
      "multi-sport",
      "field trips",
      "swimming",
      "arts and crafts"
    ],
    "neighborhood": "plainville",
    "description": "The Plainville Summer Recreation Program offers 8 weeks of full-day (8:30 AM–4 PM) activities for children entering 1st–8th grade, featuring daily sports, field games, swimming, arts and crafts, and weekly field trips to venues like bowling alleys, skating rinks, laser tag, and trampoline parks. Weekly cookouts and special events are included, with no additional charges for field trips or pool time.",
    "sentiment": "",
    "ageRange": "6-14",
    "cost": "$260/week for full-week sessions; $70/full day or $40/half day for daily sign-ups",
    "location": "Plainville",
    "url": "https://www.plainville.ma.us/281/Summer-Recreation-Program",
    "registrationDeadline": "May 2, 2025 (online registration opens); one week minimum notice required for weekly or daily registrations",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09"
    ]
  },
  {
    "id": "the-summer-club-dedham-health-athletic-complex",
    "name": "The Summer Club",
    "provider": "Dedham Health & Athletic Complex",
    "category": "sports",
    "subcategory": "multi-sport",
    "tags": [
      "pool",
      "waterpark",
      "unlimited access",
      "social events",
      "themed activities",
      "multi-sport",
      "water-sports",
      "day-camp"
    ],
    "neighborhood": "dedham",
    "description": "The Summer Club at Dedham Health & Athletic Complex offers three dynamic camp experiences: The Summer Club with unlimited pool access and social events, My First Camp (ages 4-6) with structured activities and playful exploration, and The Ultimate Day Camp (ages 7-14) featuring swimming, arts and crafts, sports, ropes courses, and themed days. Junior Tennis Academy Summer Camp (ages 6-16) provides personalized tennis instruction combined with swim breaks and off-court fun.",
    "sentiment": "Where lasting memories and lifelong friendships are made",
    "ageRange": "3-18",
    "cost": "Check website",
    "location": "Dedham Health & Athletic Complex, 200 Providence Highway, Dedham",
    "url": "https://summer.dedhamhealth.com/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "my-first-camp-dedham-health-athletic-complex",
    "name": "My First Camp",
    "provider": "Dedham Health & Athletic Complex",
    "category": "sports",
    "subcategory": "multi-sport",
    "tags": [
      "preschool",
      "early development",
      "structured activities",
      "playful exploration",
      "social growth",
      "multi-sport",
      "water-sports",
      "day-camp"
    ],
    "neighborhood": "dedham",
    "description": "The Summer Club at Dedham Health & Athletic Complex offers three dynamic camp experiences: The Summer Club with unlimited pool access and social events, My First Camp (ages 4-6) with structured activities and playful exploration, and The Ultimate Day Camp (ages 7-14) featuring swimming, arts and crafts, sports, ropes courses, and themed days. Junior Tennis Academy Summer Camp (ages 6-16) provides personalized tennis instruction combined with swim breaks and off-court fun.",
    "sentiment": "One of the best decisions you can make for their early development, social growth, and joyful experiences",
    "ageRange": "4-6",
    "cost": "Check website",
    "location": "Dedham Health & Athletic Complex, 200 Providence Highway, Dedham",
    "url": "https://summer.dedhamhealth.com/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "the-ultimate-day-camp-dedham-health-athletic-complex",
    "name": "The Ultimate Day Camp",
    "provider": "Dedham Health & Athletic Complex",
    "category": "sports",
    "subcategory": "multi-sport",
    "tags": [
      "full-day camp",
      "swimming",
      "arts and crafts",
      "sports",
      "ropes courses",
      "themed days",
      "lunch included",
      "extended hours"
    ],
    "neighborhood": "dedham",
    "description": "The Summer Club at Dedham Health & Athletic Complex offers three dynamic camp experiences: The Summer Club with unlimited pool access and social events, My First Camp (ages 4-6) with structured activities and playful exploration, and The Ultimate Day Camp (ages 7-14) featuring swimming, arts and crafts, sports, ropes courses, and themed days. Junior Tennis Academy Summer Camp (ages 6-16) provides personalized tennis instruction combined with swim breaks and off-court fun.",
    "sentiment": "Encourages teamwork, confidence, and lasting friendships",
    "ageRange": "7-14",
    "cost": "Check website",
    "location": "Dedham Health & Athletic Complex, 200 Providence Highway, Dedham",
    "url": "https://summer.dedhamhealth.com/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "junior-tennis-academy-summer-camp-dedham-health-athletic-com",
    "name": "Junior Tennis Academy Summer Camp",
    "provider": "Dedham Health & Athletic Complex",
    "category": "sports",
    "subcategory": "multi-sport",
    "tags": [
      "tennis",
      "skill-building",
      "fundamentals",
      "match strategy",
      "competitive games",
      "swim breaks",
      "multi-sport",
      "water-sports"
    ],
    "neighborhood": "dedham",
    "description": "The Summer Club at Dedham Health & Athletic Complex offers three dynamic camp experiences: The Summer Club with unlimited pool access and social events, My First Camp (ages 4-6) with structured activities and playful exploration, and The Ultimate Day Camp (ages 7-14) featuring swimming, arts and crafts, sports, ropes courses, and themed days. Junior Tennis Academy Summer Camp (ages 6-16) provides personalized tennis instruction combined with swim breaks and off-court fun.",
    "sentiment": "Players build skills without burnout, just confidence, big serves, great rallies, and serious summer fun",
    "ageRange": "6-16",
    "cost": "Check website",
    "location": "Dedham Health & Athletic Complex, 200 Providence Highway, Dedham",
    "url": "https://summer.dedhamhealth.com/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "nike-baseball-camp-at-milton-academy-nike-us-sports-camps",
    "name": "Nike Baseball Camp at Milton Academy",
    "provider": "Nike/US Sports Camps",
    "category": "sports",
    "subcategory": "field-sports",
    "tags": [
      "baseball",
      "elite coaches",
      "hitting",
      "fielding",
      "base running"
    ],
    "neighborhood": "milton",
    "description": "Youth athletes train with elite coaches at Nash Field, participating in baseball drills covering hitting, fielding, base running, and team fundamentals.",
    "sentiment": "",
    "ageRange": "9-16",
    "cost": "Check website",
    "location": "Milton Academy, Milton",
    "url": "Check website",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "nike-basketball-camp-at-milton-academy-nike-a-step-ahead-asa",
    "name": "Nike Basketball Camp at Milton Academy",
    "provider": "Nike/A Step Ahead (ASA)",
    "category": "sports",
    "subcategory": "court-sports",
    "tags": [
      "basketball",
      "skill development",
      "fundamental development",
      "shooting",
      "team play"
    ],
    "neighborhood": "milton",
    "description": "A Step Ahead Nike Basketball Camps designed for players looking to improve their game and basketball IQ with emphasis on fundamental development, shooting, and team play.",
    "sentiment": "",
    "ageRange": "6-16",
    "cost": "Check website",
    "location": "Milton Academy, Milton",
    "url": "Check website",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "nike-softball-camp-at-milton-academy-nike-coach-larry-miller",
    "name": "Nike Softball Camp at Milton Academy",
    "provider": "Nike/Coach Larry Miller",
    "category": "sports",
    "subcategory": "field-sports",
    "tags": [
      "softball",
      "elite coaches",
      "hitting",
      "fielding",
      "action-packed"
    ],
    "neighborhood": "milton",
    "description": "Youth athletes train with elite coaches including Coach Larry Miller, with daily drills covering hitting, fielding, and team fundamentals in action-packed sessions.",
    "sentiment": "",
    "ageRange": "9-16",
    "cost": "Check website",
    "location": "Milton Academy, Milton",
    "url": "Check website",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "nike-soccer-camp-at-milton-academy-nike-curry-college",
    "name": "Nike Soccer Camp at Milton Academy",
    "provider": "Nike/Curry College",
    "category": "sports",
    "subcategory": "field-sports",
    "tags": [
      "soccer",
      "training",
      "match game instruction",
      "goal-setting"
    ],
    "neighborhood": "milton",
    "description": "Curry and local premier club coaches offer outstanding training, match game instruction, and fun activities with emphasis on training hard, playing hard, and setting new goals.",
    "sentiment": "",
    "ageRange": "6-16",
    "cost": "Check website",
    "location": "Milton Academy, Milton",
    "url": "Check website",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "nike-softball-camp-milton-academy-nike-abby-duggan",
    "name": "Nike Softball Camp Milton Academy",
    "provider": "Nike/Abby Duggan",
    "category": "sports",
    "subcategory": "field-sports",
    "tags": [
      "softball",
      "elite coaches",
      "hitting",
      "fielding",
      "Assumption University"
    ],
    "neighborhood": "milton",
    "description": "Youth athletes train with elite coaches including former Assumption University star Abby Duggan in action-packed four-day sessions covering hitting, fielding, and fundamentals.",
    "sentiment": "",
    "ageRange": "9-16",
    "cost": "Check website",
    "location": "Milton Academy, Milton",
    "url": "Check website",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "nike-contact-football-camp-at-curry-college-nike-curry-colle",
    "name": "Nike Contact Football Camp at Curry College",
    "provider": "Nike/Curry College",
    "category": "sports",
    "subcategory": "field-sports",
    "tags": [
      "football",
      "contact football",
      "fundamental skills",
      "position-specific coaching"
    ],
    "neighborhood": "milton",
    "description": "Designed for players ages 10-16 to build a strong foundation in fundamental football skills with position-specific coaching for beginners and experienced players.",
    "sentiment": "",
    "ageRange": "10-16",
    "cost": "Check website",
    "location": "Curry College, Milton",
    "url": "Check website",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "nike-softball-camp-milton-academy-nike-chelsea-holden",
    "name": "Nike Softball Camp Milton Academy",
    "provider": "Nike/Chelsea Holden",
    "category": "sports",
    "subcategory": "field-sports",
    "tags": [
      "softball",
      "elite coaches",
      "hitting",
      "fielding",
      "daily drills"
    ],
    "neighborhood": "milton",
    "description": "Youth athletes train with elite coaches including Chelsea Holden in daily sessions covering softball drills, hitting, fielding, and fundamental skills.",
    "sentiment": "",
    "ageRange": "9-16",
    "cost": "Check website",
    "location": "Milton Academy, Milton",
    "url": "Check website",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "nike-boys-lacrosse-camp-at-curry-college-nike-ussc",
    "name": "Nike Boys Lacrosse Camp at Curry College",
    "provider": "Nike/USSC",
    "category": "sports",
    "subcategory": "field-sports",
    "tags": [
      "lacrosse",
      "boys lacrosse",
      "Boston",
      "Blue Hills Reservation"
    ],
    "neighborhood": "milton",
    "description": "USSC offers a Nike Lacrosse Camp at Curry College's 131-acre campus near the Blue Hills Reservation, seven miles from downtown Boston.",
    "sentiment": "",
    "ageRange": "8-16",
    "cost": "Check website",
    "location": "Curry College, Milton",
    "url": "Check website",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "nike-golf-camp-at-curry-college-nike-boost-sports",
    "name": "Nike Golf Camp at Curry College",
    "provider": "Nike/Boost Sports",
    "category": "sports",
    "subcategory": "individual-combat",
    "tags": [
      "golf",
      "all components of game",
      "skill improvement",
      "coaching"
    ],
    "neighborhood": "milton",
    "description": "Young athletes improve all components of golf with Boost Sports coaching staff at Curry College in Milton.",
    "sentiment": "",
    "ageRange": "8-16",
    "cost": "Check website",
    "location": "Curry College, Milton",
    "url": "Check website",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "nike-volleyball-camp-at-curry-college-nike",
    "name": "Nike Volleyball Camp at Curry College",
    "provider": "Nike",
    "category": "sports",
    "subcategory": "court-sports",
    "tags": [
      "volleyball",
      "individual skills",
      "position-specific",
      "team skills",
      "all skill levels"
    ],
    "neighborhood": "milton",
    "description": "Summer volleyball camps providing players with opportunities to work on individual, position-specific, and team skills for players of all skill levels.",
    "sentiment": "",
    "ageRange": "8-16",
    "cost": "Check website",
    "location": "Curry College, Milton",
    "url": "Check website",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "mass-premier-courts-basketball-and-volleyball-programs-mass-",
    "name": "Mass Premier Courts Basketball and Volleyball Programs",
    "provider": "Mass Premier Courts",
    "category": "sports",
    "subcategory": "court-sports",
    "tags": [
      "basketball",
      "volleyball",
      "pickleball",
      "open gym",
      "day-camp",
      "multi-sport",
      "swimming",
      "arts"
    ],
    "neighborhood": "foxborough",
    "description": "Hockomock Area YMCA offers comprehensive day camps and youth programs featuring swim lessons, sports, recreation, arts and enrichment activities. The camp includes specialty programs, academic enrichment, and leadership development for children of various ages throughout the summer.",
    "sentiment": "",
    "ageRange": "3-18",
    "cost": "Check website",
    "location": "Mass Premier Courts, 97 Green St, Foxborough, MA 02035",
    "url": "https://enrichment.kids/ma/foxborough/foxboro-day-camp",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "preschool-summer-camp-gymnastic-academy-of-boston",
    "name": "Preschool Summer Camp",
    "provider": "Gymnastic Academy of Boston",
    "category": "sports",
    "subcategory": "multi-sport",
    "tags": [
      "gymnastics",
      "swimming",
      "arts and crafts",
      "preschool",
      "summer camp",
      "sports",
      "day camp",
      "Norwood"
    ],
    "neighborhood": "norwood",
    "description": "Gymnastic Academy of Boston offers two summer camp options: Preschool Summer Camp for 4-year-olds featuring gymnastics instruction, swimming in their in-ground pool, arts and crafts, and theme weeks; and The Ultimate Grade School Summer Day Camp for ages 5+ combining rigorous gymnastic training with swimming, team building activities, obstacle courses, and open gym time in a fully air-conditioned facility.",
    "sentiment": "The teachers at G.A.B. always have control of the class, keep the children engaged, and have them showing steady improvements.",
    "ageRange": "5-14",
    "cost": "Check website",
    "location": "Gymnastic Academy of Boston, Norwood",
    "url": "https://gymnasticsacademyofboston.com/norwood/camps/summer-camps/",
    "registrationDeadline": "Rolling admission",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "ultimate-summer-gymnastic-camp-gymnastic-academy-of-boston",
    "name": "Ultimate Summer Gymnastic Camp",
    "provider": "Gymnastic Academy of Boston",
    "category": "sports",
    "subcategory": "multi-sport",
    "tags": [
      "gymnastics",
      "swimming",
      "obstacle courses",
      "team building",
      "grade school",
      "summer camp",
      "sports",
      "day camp"
    ],
    "neighborhood": "norwood",
    "description": "Gymnastic Academy of Boston offers two summer camp options: Preschool Summer Camp for 4-year-olds featuring gymnastics instruction, swimming in their in-ground pool, arts and crafts, and theme weeks; and The Ultimate Grade School Summer Day Camp for ages 5+ combining rigorous gymnastic training with swimming, team building activities, obstacle courses, and open gym time in a fully air-conditioned facility.",
    "sentiment": "The kids love it.",
    "ageRange": "5-18",
    "cost": "Check website",
    "location": "Gymnastic Academy of Boston, Norwood",
    "url": "https://gymnasticsacademyofboston.com/norwood/camps/summer-camps/",
    "registrationDeadline": "Rolling admission",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "maplewood-summer-camp-preschool-kindergarten-maplewood",
    "name": "Maplewood Summer Camp - Preschool & Kindergarten",
    "provider": "Maplewood",
    "category": "sports",
    "subcategory": "water-sports",
    "tags": [
      "swimming",
      "preschool",
      "kindergarten",
      "activities",
      "friendships",
      "water-sports",
      "enrichment",
      "South Easton"
    ],
    "neighborhood": "norwood",
    "description": "Maplewood's Preschool & Kindergarten Camp (ages 3-5) offers engaging activities that spark curiosity through swimming instruction, outdoor exploration, and creative play. With over 30,000 children having learned to swim since 1965, the camp emphasizes individual instruction and positive reinforcement in two heated pools. Children enjoy varied activities throughout the day including sports, dance, archery, and water activities in a warm, welcoming environment.",
    "sentiment": "Lucy loved every moment and begged to smell the fresh camp air each day. Parents report amazing experiences with growth in confidence, independence, and social skills.",
    "ageRange": "3-5",
    "cost": "Check website",
    "location": "South Easton, MA",
    "url": "https://www.maplewoodyearround.com",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "maplewood-summer-camp-1st-9th-grade-maplewood",
    "name": "Maplewood Summer Camp - 1st-9th Grade",
    "provider": "Maplewood",
    "category": "sports",
    "subcategory": "water-sports",
    "tags": [
      "swimming",
      "multi-activity",
      "friendships",
      "water-sports",
      "archery",
      "dance",
      "preschool",
      "kindergarten"
    ],
    "neighborhood": "norwood",
    "description": "Maplewood's Preschool & Kindergarten Camp (ages 3-5) offers engaging activities that spark curiosity through swimming instruction, outdoor exploration, and creative play. With over 30,000 children having learned to swim since 1965, the camp emphasizes individual instruction and positive reinforcement in two heated pools. Children enjoy varied activities throughout the day including sports, dance, archery, and water activities in a warm, welcoming environment.",
    "sentiment": "Parents consistently praise the amazing experience, professional counselors, and structured safe environment. Children come home excited daily with stories and visible progress in swimming.",
    "ageRange": "6-14",
    "cost": "Check website",
    "location": "South Easton, MA",
    "url": "https://www.maplewoodyearround.com",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "maplewood-teen-leadership-c-i-t-program-maplewood",
    "name": "Maplewood Teen Leadership (C.I.T.) Program",
    "provider": "Maplewood",
    "category": "sports",
    "subcategory": "water-sports",
    "tags": [
      "counselor-in-training",
      "teen",
      "leadership",
      "swimming",
      "preschool",
      "kindergarten",
      "water-sports",
      "enrichment"
    ],
    "neighborhood": "norwood",
    "description": "Maplewood's Preschool & Kindergarten Camp (ages 3-5) offers engaging activities that spark curiosity through swimming instruction, outdoor exploration, and creative play. With over 30,000 children having learned to swim since 1965, the camp emphasizes individual instruction and positive reinforcement in two heated pools. Children enjoy varied activities throughout the day including sports, dance, archery, and water activities in a warm, welcoming environment.",
    "sentiment": "Former staff members report the program provided amazing opportunities and lasting friendships, calling it the best summers of their lives.",
    "ageRange": "14-18",
    "cost": "Check website",
    "location": "South Easton, MA",
    "url": "https://www.maplewoodyearround.com",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "multi-sports-summer-camp-viking-sports",
    "name": "Multi-Sports Summer Camp",
    "provider": "Viking Sports",
    "category": "sports",
    "subcategory": "multi-sport",
    "tags": [
      "summer camp",
      "multiple sports",
      "theme days",
      "tournament day",
      "multi-sport",
      "brookline",
      "sports clinics",
      "youth sports"
    ],
    "neighborhood": "brookline",
    "description": "Viking's Multi-Sports Summer Camp offers a fun-filled experience with Theme Days and their famous Tournament Day. Campers participate in various sports including soccer, baseball, flag football, and basketball across multiple field and gymnasium locations in Brookline, with access to the entire Cypress Field complex and indoor facilities.",
    "sentiment": "",
    "ageRange": "3-18",
    "cost": "Check website",
    "location": "Brookline High School, 66 Tappan St., Brookline",
    "url": "https://www.vikingcamps.com/locations/brookline/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "soccer-camp-viking-sports",
    "name": "Soccer Camp",
    "provider": "Viking Sports",
    "category": "sports",
    "subcategory": "multi-sport",
    "tags": [
      "soccer",
      "summer camp",
      "multi-sport",
      "brookline",
      "sports clinics",
      "youth sports",
      "team sports"
    ],
    "neighborhood": "brookline",
    "description": "Viking's Multi-Sports Summer Camp offers a fun-filled experience with Theme Days and their famous Tournament Day. Campers participate in various sports including soccer, baseball, flag football, and basketball across multiple field and gymnasium locations in Brookline, with access to the entire Cypress Field complex and indoor facilities.",
    "sentiment": "",
    "ageRange": "3-18",
    "cost": "Check website",
    "location": "Brookline High School, 66 Tappan St., Brookline",
    "url": "https://www.vikingcamps.com/locations/brookline/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "baseball-camp-viking-sports",
    "name": "Baseball Camp",
    "provider": "Viking Sports",
    "category": "sports",
    "subcategory": "multi-sport",
    "tags": [
      "baseball",
      "summer camp",
      "multi-sport",
      "brookline",
      "sports clinics",
      "youth sports",
      "team sports"
    ],
    "neighborhood": "brookline",
    "description": "Viking's Multi-Sports Summer Camp offers a fun-filled experience with Theme Days and their famous Tournament Day. Campers participate in various sports including soccer, baseball, flag football, and basketball across multiple field and gymnasium locations in Brookline, with access to the entire Cypress Field complex and indoor facilities.",
    "sentiment": "",
    "ageRange": "3-18",
    "cost": "Check website",
    "location": "Brookline High School, 66 Tappan St., Brookline",
    "url": "https://www.vikingcamps.com/locations/brookline/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "flag-football-camp-viking-sports",
    "name": "Flag Football Camp",
    "provider": "Viking Sports",
    "category": "sports",
    "subcategory": "multi-sport",
    "tags": [
      "flag football",
      "summer camp",
      "multi-sport",
      "brookline",
      "sports clinics",
      "youth sports",
      "team sports"
    ],
    "neighborhood": "brookline",
    "description": "Viking's Multi-Sports Summer Camp offers a fun-filled experience with Theme Days and their famous Tournament Day. Campers participate in various sports including soccer, baseball, flag football, and basketball across multiple field and gymnasium locations in Brookline, with access to the entire Cypress Field complex and indoor facilities.",
    "sentiment": "",
    "ageRange": "3-18",
    "cost": "Check website",
    "location": "Brookline High School, 66 Tappan St., Brookline",
    "url": "https://www.vikingcamps.com/locations/brookline/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "basketball-camp-viking-sports",
    "name": "Basketball Camp",
    "provider": "Viking Sports",
    "category": "sports",
    "subcategory": "multi-sport",
    "tags": [
      "basketball",
      "summer camp",
      "multi-sport",
      "brookline",
      "sports clinics",
      "youth sports",
      "team sports"
    ],
    "neighborhood": "brookline",
    "description": "Viking's Multi-Sports Summer Camp offers a fun-filled experience with Theme Days and their famous Tournament Day. Campers participate in various sports including soccer, baseball, flag football, and basketball across multiple field and gymnasium locations in Brookline, with access to the entire Cypress Field complex and indoor facilities.",
    "sentiment": "",
    "ageRange": "3-18",
    "cost": "Check website",
    "location": "Brookline Teen Center, 40 Aspinwall Ave., Brookline",
    "url": "https://www.vikingcamps.com/locations/brookline/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "soccer-academy-viking-sports",
    "name": "Soccer Academy",
    "provider": "Viking Sports",
    "category": "sports",
    "subcategory": "multi-sport",
    "tags": [
      "soccer",
      "academy",
      "advanced training",
      "multi-sport",
      "summer camp",
      "brookline",
      "sports clinics",
      "youth sports"
    ],
    "neighborhood": "brookline",
    "description": "Viking's Multi-Sports Summer Camp offers a fun-filled experience with Theme Days and their famous Tournament Day. Campers participate in various sports including soccer, baseball, flag football, and basketball across multiple field and gymnasium locations in Brookline, with access to the entire Cypress Field complex and indoor facilities.",
    "sentiment": "",
    "ageRange": "3-18",
    "cost": "Check website",
    "location": "Brookline High School, 66 Tappan St., Brookline",
    "url": "https://www.vikingcamps.com/locations/brookline/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "pre-k-half-day-multi-sports-camp-viking-sports",
    "name": "Pre-K Half-Day Multi-Sports Camp",
    "provider": "Viking Sports",
    "category": "sports",
    "subcategory": "multi-sport",
    "tags": [
      "pre-K",
      "half-day",
      "multi-sport",
      "summer camp",
      "brookline",
      "sports clinics",
      "youth sports",
      "team sports"
    ],
    "neighborhood": "brookline",
    "description": "Viking's Multi-Sports Summer Camp offers a fun-filled experience with Theme Days and their famous Tournament Day. Campers participate in various sports including soccer, baseball, flag football, and basketball across multiple field and gymnasium locations in Brookline, with access to the entire Cypress Field complex and indoor facilities.",
    "sentiment": "",
    "ageRange": "5-14",
    "cost": "Check website",
    "location": "Brookline High School, 66 Tappan St., Brookline",
    "url": "https://www.vikingcamps.com/locations/brookline/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "preschool-half-day-multi-sports-camp-viking-sports",
    "name": "Preschool Half-Day Multi-Sports Camp",
    "provider": "Viking Sports",
    "category": "sports",
    "subcategory": "multi-sport",
    "tags": [
      "preschool",
      "half-day",
      "multi-sport",
      "summer camp",
      "brookline",
      "sports clinics",
      "youth sports",
      "team sports"
    ],
    "neighborhood": "brookline",
    "description": "Viking's Multi-Sports Summer Camp offers a fun-filled experience with Theme Days and their famous Tournament Day. Campers participate in various sports including soccer, baseball, flag football, and basketball across multiple field and gymnasium locations in Brookline, with access to the entire Cypress Field complex and indoor facilities.",
    "sentiment": "",
    "ageRange": "5-14",
    "cost": "Check website",
    "location": "Brookline High School, 66 Tappan St., Brookline",
    "url": "https://www.vikingcamps.com/locations/brookline/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "school-vacation-multi-sports-camp-viking-sports",
    "name": "School Vacation Multi-Sports Camp",
    "provider": "Viking Sports",
    "category": "sports",
    "subcategory": "multi-sport",
    "tags": [
      "school vacation",
      "multi-sport",
      "indoor",
      "summer camp",
      "brookline",
      "sports clinics",
      "youth sports",
      "team sports"
    ],
    "neighborhood": "brookline",
    "description": "Viking's Multi-Sports Summer Camp offers a fun-filled experience with Theme Days and their famous Tournament Day. Campers participate in various sports including soccer, baseball, flag football, and basketball across multiple field and gymnasium locations in Brookline, with access to the entire Cypress Field complex and indoor facilities.",
    "sentiment": "",
    "ageRange": "3-18",
    "cost": "Check website",
    "location": "Brookline High School, 66 Tappan St., Brookline",
    "url": "https://www.vikingcamps.com/locations/brookline/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "viking-ninja-warrior-camp-viking-sports",
    "name": "Viking Ninja Warrior Camp",
    "provider": "Viking Sports",
    "category": "sports",
    "subcategory": "multi-sport",
    "tags": [
      "ninja warrior",
      "obstacles",
      "agility",
      "strength",
      "balance",
      "multi-sport",
      "summer camp",
      "brookline"
    ],
    "neighborhood": "brookline",
    "description": "Viking's Multi-Sports Summer Camp offers a fun-filled experience with Theme Days and their famous Tournament Day. Campers participate in various sports including soccer, baseball, flag football, and basketball across multiple field and gymnasium locations in Brookline, with access to the entire Cypress Field complex and indoor facilities.",
    "sentiment": "",
    "ageRange": "3-18",
    "cost": "Check website",
    "location": "Brookline Teen Center, 40 Aspinwall Ave., Brookline",
    "url": "https://www.vikingcamps.com/locations/brookline/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "the-dance-force-the-dance-force",
    "name": "The Dance Force",
    "provider": "The Dance Force",
    "category": "arts",
    "subcategory": "dance",
    "tags": [
      "dance",
      "summer camp",
      "themed weeks",
      "multiple styles",
      "Norwood MA",
      "youth"
    ],
    "neighborhood": "norwood",
    "description": "The Dance Force offers week-long themed dance programs and five-week summer dance class sessions for children. Students participate in dance instruction across various styles including ballet, hip-hop, tap, and modern dance, with themed activities and entertainment throughout each week.",
    "sentiment": "",
    "ageRange": "3-10",
    "cost": "Check website",
    "location": "Norwood",
    "url": "https://www.thedanceforce.com/",
    "registrationDeadline": "Rolling admission",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w04",
      "w05",
      "w06"
    ]
  },
  {
    "id": "ensemble-performing-arts-studio-willy-wonka-jr-ensemble-perf",
    "name": "Ensemble Performing Arts Studio - Willy Wonka Jr.",
    "provider": "Ensemble Performing Arts Studio",
    "category": "arts",
    "subcategory": "theater",
    "tags": [
      "theater",
      "summer camp",
      "performing arts",
      "dance",
      "musical theater",
      "ensemble"
    ],
    "neighborhood": "walpole",
    "description": "Ensemble Performing Arts Studio offers summer performance arts programs including Willy Wonka Jr. and other theater and dance classes. Students work with expert instructors in a fun yet focused environment that emphasizes proper technique, incremental growth, and collaborative ensemble work.",
    "sentiment": "",
    "ageRange": "5-12",
    "cost": "Check website",
    "location": "Walpole",
    "url": "https://ensemblepas.com/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w03",
      "w04"
    ]
  },
  {
    "id": "ensemble-performing-arts-studio-peter-pan-jr-ensemble-perfor",
    "name": "Ensemble Performing Arts Studio - Peter Pan, Jr.",
    "provider": "Ensemble Performing Arts Studio",
    "category": "arts",
    "subcategory": "theater",
    "tags": [
      "theater",
      "summer camp",
      "performing arts",
      "dance",
      "musical theater",
      "ensemble"
    ],
    "neighborhood": "walpole",
    "description": "Ensemble Performing Arts Studio offers summer performance arts programs including Willy Wonka Jr. and other theater and dance classes. Students work with expert instructors in a fun yet focused environment that emphasizes proper technique, incremental growth, and collaborative ensemble work.",
    "sentiment": "",
    "ageRange": "5-12",
    "cost": "Check website",
    "location": "Walpole",
    "url": "https://ensemblepas.com/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w05",
      "w06"
    ]
  },
  {
    "id": "ensemble-performing-arts-studio-the-25th-annual-putnam-count",
    "name": "Ensemble Performing Arts Studio - The 25th Annual Putnam County Spelling Bee",
    "provider": "Ensemble Performing Arts Studio",
    "category": "arts",
    "subcategory": "theater",
    "tags": [
      "theater",
      "summer camp",
      "performing arts",
      "dance",
      "musical theater",
      "ensemble"
    ],
    "neighborhood": "walpole",
    "description": "Ensemble Performing Arts Studio offers summer performance arts programs including Willy Wonka Jr. and other theater and dance classes. Students work with expert instructors in a fun yet focused environment that emphasizes proper technique, incremental growth, and collaborative ensemble work.",
    "sentiment": "",
    "ageRange": "12-12",
    "cost": "Check website",
    "location": "Walpole",
    "url": "https://ensemblepas.com/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w07",
      "w08"
    ]
  },
  {
    "id": "summer-stage-fun-with-theatre-summer-stage",
    "name": "Summer Stage - Fun with Theatre",
    "provider": "Summer Stage",
    "category": "arts",
    "subcategory": "theater",
    "tags": [
      "theater",
      "drama",
      "performance",
      "youth",
      "creative",
      "confidence-building"
    ],
    "neighborhood": "walpole",
    "description": "Summer Stage offers quality theater education where students learn, grow, and have fun through games, exercises, and activities with equal opportunities for all performers. Students perform fun and dramatic works for friends and family on the final Friday of each session. The camp provides a welcoming place for young performers to build self-confidence, discover the wonders of theater, and feel part of a strong social group.",
    "sentiment": "Summer Stage has always given young performers a place to be themselves, feel part of a strong social group, build their self-confidence and discover all the wonders of theater.",
    "ageRange": "7-12",
    "cost": "Check website",
    "location": "Walpole",
    "url": "https://thesummerstage.com/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01"
    ]
  },
  {
    "id": "summer-stage-fairy-tale-a-go-go-summer-stage",
    "name": "Summer Stage - Fairy Tale A Go-Go",
    "provider": "Summer Stage",
    "category": "arts",
    "subcategory": "theater",
    "tags": [
      "theater",
      "drama",
      "performance",
      "youth",
      "creative",
      "confidence-building"
    ],
    "neighborhood": "walpole",
    "description": "Summer Stage offers quality theater education where students learn, grow, and have fun through games, exercises, and activities with equal opportunities for all performers. Students perform fun and dramatic works for friends and family on the final Friday of each session. The camp provides a welcoming place for young performers to build self-confidence, discover the wonders of theater, and feel part of a strong social group.",
    "sentiment": "Summer Stage has always given young performers a place to be themselves, feel part of a strong social group, build their self-confidence and discover all the wonders of theater.",
    "ageRange": "7-12",
    "cost": "Check website",
    "location": "Walpole",
    "url": "https://thesummerstage.com/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w02",
      "w03"
    ]
  },
  {
    "id": "summer-stage-how-to-get-away-with-a-murder-mystery-summer-st",
    "name": "Summer Stage - How to Get Away with a Murder Mystery",
    "provider": "Summer Stage",
    "category": "arts",
    "subcategory": "theater",
    "tags": [
      "theater",
      "drama",
      "performance",
      "youth",
      "creative",
      "confidence-building"
    ],
    "neighborhood": "walpole",
    "description": "Summer Stage offers quality theater education where students learn, grow, and have fun through games, exercises, and activities with equal opportunities for all performers. Students perform fun and dramatic works for friends and family on the final Friday of each session. The camp provides a welcoming place for young performers to build self-confidence, discover the wonders of theater, and feel part of a strong social group.",
    "sentiment": "Summer Stage has always given young performers a place to be themselves, feel part of a strong social group, build their self-confidence and discover all the wonders of theater.",
    "ageRange": "11-17",
    "cost": "Check website",
    "location": "Walpole",
    "url": "https://thesummerstage.com/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w04",
      "w05",
      "w06"
    ]
  },
  {
    "id": "summer-stage-disney-s-the-little-mermaid-jr-summer-stage",
    "name": "Summer Stage - Disney's The Little Mermaid Jr.",
    "provider": "Summer Stage",
    "category": "arts",
    "subcategory": "theater",
    "tags": [
      "theater",
      "drama",
      "performance",
      "youth",
      "creative",
      "confidence-building"
    ],
    "neighborhood": "walpole",
    "description": "Summer Stage offers quality theater education where students learn, grow, and have fun through games, exercises, and activities with equal opportunities for all performers. Students perform fun and dramatic works for friends and family on the final Friday of each session. The camp provides a welcoming place for young performers to build self-confidence, discover the wonders of theater, and feel part of a strong social group.",
    "sentiment": "Summer Stage has always given young performers a place to be themselves, feel part of a strong social group, build their self-confidence and discover all the wonders of theater.",
    "ageRange": "11-17",
    "cost": "Check website",
    "location": "Walpole",
    "url": "https://thesummerstage.com/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w06",
      "w07",
      "w08"
    ]
  },
  {
    "id": "heartwork-studio-heartwork-studio",
    "name": "Heartwork Studio",
    "provider": "Heartwork Studio",
    "category": "arts",
    "subcategory": "visual-arts",
    "tags": [],
    "neighborhood": "walpole",
    "description": "",
    "sentiment": "",
    "ageRange": "5-12",
    "cost": "Check website",
    "location": "Walpole",
    "url": "https://www.facebook.com/heartworkstudiowalpole/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "art-smart-art-smart",
    "name": "Art Smart",
    "provider": "Art Smart",
    "category": "arts",
    "subcategory": "visual-arts",
    "tags": [
      "visual-arts",
      "painting",
      "ceramics",
      "creative-expression",
      "summer-camp",
      "hands-on"
    ],
    "neighborhood": "walpole",
    "description": "Art Smart Program offers creative summer vacation camps where kids explore painting, drawing, ceramics, and culinary arts in a welcoming studio environment. Children engage in hands-on art-making projects designed to foster self-expression, personal growth, and artistic skill development. The program emphasizes individual creativity while building connections with other young artists in a supportive, professionally-guided setting.",
    "sentiment": "My 7 year old son went to summer camp for a week & loved it! We're sending him back this year!",
    "ageRange": "5-14",
    "cost": "Check website",
    "location": "Walpole",
    "url": "https://artsmartprogram.com/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09"
    ]
  },
  {
    "id": "rosemarie-morelli-art-studio-rosemarie-morelli-art-studio",
    "name": "Rosemarie Morelli Art Studio",
    "provider": "Rosemarie Morelli Art Studio",
    "category": "arts",
    "subcategory": "visual-arts",
    "tags": [
      "visual-arts",
      "painting",
      "drawing",
      "illustration",
      "teen-week",
      "plein-air"
    ],
    "neighborhood": "walpole",
    "description": "Children and teens ages 8-18 enjoy painting, drawing, and illustrating in a relaxed-structured studio environment where students work on projects of their choosing while learning fundamentals of form, shape correction, and color mixing. Daily group sketch studies develop skills in portraiture, anatomy, and landscape elements across various media including oils, acrylics, watercolors, pastels, and more. Teen Week includes 3 days of in-studio art and 2 days of plein air landscape painting at local Walpole sites.",
    "sentiment": "",
    "ageRange": "8-18",
    "cost": "$275/5-day week (Weeks 1, 2, 3, 5, & 6); $300 Teen Week (Week 4); $55-65/day for partial weeks",
    "location": "Walpole",
    "url": "https://rosemariemorelliartstudio.com/summer-classes/",
    "registrationDeadline": "Rolling admission",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06"
    ]
  },
  {
    "id": "museum-of-american-bird-art-mass-audubon",
    "name": "Museum of American Bird Art",
    "provider": "Mass Audubon",
    "category": "arts",
    "subcategory": "visual-arts",
    "tags": [
      "nature",
      "art",
      "pottery",
      "painting",
      "wildlife",
      "outdoor"
    ],
    "neighborhood": "canton",
    "description": "At Wild at Art Nature Camp, children ages 4.5–14 explore nature and create art with naturalists and teaching artists in a unique setting that combines a wildlife sanctuary with a makerspace. Campers engage in outdoor explorations and creative projects including kiln-fired pottery, painting, mixed media, and printmaking while building lasting friendships.",
    "sentiment": "Everything about the camp is positive...why wouldn't you send your kids there??",
    "ageRange": "5-14",
    "cost": "Check website",
    "location": "Canton",
    "url": "https://www.massaudubon.org/places-to-explore/wildlife-sanctuaries/maba-education-center/camp",
    "registrationDeadline": "Rolling admission",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08"
    ]
  },
  {
    "id": "learning-circle-preschool-learning-circle-preschool",
    "name": "Learning Circle Preschool",
    "provider": "Learning Circle Preschool",
    "category": "arts",
    "subcategory": "visual-arts",
    "tags": [
      "preschool",
      "arts",
      "nature-study",
      "outdoor-play",
      "music",
      "creative-movement"
    ],
    "neighborhood": "canton",
    "description": "Learning Circle Preschool's six-week summer program features an integrated arts curriculum focused on natural sciences, visual arts, music, and creative movement. Children explore the natural environment through gardening projects, outdoor construction play, visits to nearby Brookwood Farm, and hands-on investigations with natural materials. The program maintains small groups of up to 15 children with experienced teachers guiding relaxed exploration, free play, snack time, and outdoor activities.",
    "sentiment": "",
    "ageRange": "3-7",
    "cost": "Check website",
    "location": "Canton",
    "url": "https://learningcirclepreschool.org/programs/summer-program/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04"
    ]
  },
  {
    "id": "modern-party-art-camp-modern-party-art",
    "name": "Modern Party Art Camp",
    "provider": "Modern Party Art",
    "category": "arts",
    "subcategory": "visual-arts",
    "tags": [
      "art",
      "visual-arts",
      "summer-camp",
      "creative",
      "canton-ma",
      "youth"
    ],
    "neighborhood": "canton",
    "description": "Modern Party Art's Summer Art Academy offers creative art instruction for kids in a fun, engaging environment. Students explore various art techniques and mediums while developing their artistic skills and self-expression.",
    "sentiment": "",
    "ageRange": "5-6",
    "cost": "Check website",
    "location": "Canton",
    "url": "https://www.modernpartyart.com/summer",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w03",
      "w04",
      "w05",
      "w06"
    ]
  },
  {
    "id": "dance-with-spirit-dance-with-spirit",
    "name": "Dance with Spirit",
    "provider": "Dance with Spirit",
    "category": "arts",
    "subcategory": "dance",
    "tags": [
      "dance",
      "summer camp",
      "youth dance",
      "movement",
      "skill development"
    ],
    "neighborhood": "canton",
    "description": "Dance with Spirit offers a unique conceptual, brain-based learning experience dedicated to developing dancers. Their summer camps provide movement exploration and skill development in a supportive environment where each student feels confident as both a dancer and a person.",
    "sentiment": "",
    "ageRange": "3-14",
    "cost": "Check website",
    "location": "Canton",
    "url": "https://www.dancewithspiritcantonma.com/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08"
    ]
  },
  {
    "id": "summer-sage-summer-sage",
    "name": "Summer Sage",
    "provider": "Summer Sage",
    "category": "arts",
    "subcategory": "theater",
    "tags": [
      "summer camp",
      "enrichment",
      "creative learning",
      "multi-age program",
      "discovery-based",
      "themed weeks"
    ],
    "neighborhood": "foxborough",
    "description": "Summer Sage offers a reimagined summer experience blending imagination with purpose, inviting children to explore big ideas, build skills, and grow with confidence through weekly themed programs like Stage, Studio & Beyond, Real World Skills Summit, Passages & Pathways, Secret Agent Summer School, Game On!, and Portal to the Realms. Children participate in small groups across age divisions (K-1, 2-3, 4-5) with enriching activities designed to inspire curiosity and discovery in a joyful setting.",
    "sentiment": "We are so grateful to have been able to participate even though they are not students at Sage - they felt included, welcomed, and so engaged in the activities. Thank you for offering some alternatives to the sports camps and general day camps. They loved learning something new that they got to choose and that fills my heart.",
    "ageRange": "3-12",
    "cost": "Check website",
    "location": "Foxboro",
    "url": "https://sageschool.org/program/summer-sage/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06"
    ]
  },
  {
    "id": "broadway-kids-broadway-kids",
    "name": "Broadway Kids",
    "provider": "Broadway Kids",
    "category": "arts",
    "subcategory": "theater",
    "tags": [
      "theater",
      "performing arts",
      "acting",
      "dance",
      "singing",
      "youth"
    ],
    "neighborhood": "foxborough",
    "description": "Broadway Kids invites children ages 5-9 to explore performing arts through acting, dancing, and singing in an engaging, encouraging setting. With a focus on creativity and self-expression, young artists develop new skills and build confidence while working toward a special performance for family and friends.",
    "sentiment": "I am so excited to start another session of Broadway Kids! I love helping kids build confidence, creativity, and a love of the stage.",
    "ageRange": "5-8",
    "cost": "$300/week (April session) or $500/two weeks (Summer session)",
    "location": "Foxboro",
    "url": "https://mrpac.art/broadway-kids",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w07",
      "w08"
    ]
  },
  {
    "id": "theater-with-laura-canfield-theater-with-laura-canfield",
    "name": "Theater with Laura Canfield",
    "provider": "Theater with Laura Canfield",
    "category": "arts",
    "subcategory": "theater",
    "tags": [
      "musical theater",
      "teen program",
      "performance",
      "confidence-building",
      "professional production"
    ],
    "neighborhood": "foxborough",
    "description": "LRC Stage Productions offers high-quality musical theater enrichment that ignites imagination and fosters a love for the performing arts. Students bring stories to life on stage through professionally directed productions like Chicago: Teen Edition, learning acting, singing, and dancing in a supportive environment where everyone feels like a star.",
    "sentiment": "\"It is incredible how much my daughter's confidence has been built. She has always been a little bit on the shy side but I barely recognize her now when she hits the stage.\" - Linda P.",
    "ageRange": "12-18",
    "cost": "Check website",
    "location": "Foxboro",
    "url": "https://lrcstageproductions.com/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w05"
    ]
  },
  {
    "id": "showcase-dance-productions-showcase-dance-productions",
    "name": "Showcase Dance Productions",
    "provider": "Showcase Dance Productions",
    "category": "arts",
    "subcategory": "dance",
    "tags": [
      "dance",
      "ballet",
      "hip-hop",
      "Irish step",
      "summer camps",
      "multi-style"
    ],
    "neighborhood": "wrentham",
    "description": "Showcase Dance Productions offers summer dance camps for ages 4 and up, featuring ballet, Irish step, hip-hop, breakdance, jazz, contemporary, and themed camps inspired by popular movies and music. Students learn new dance styles, build confidence, maintain technique, make friends, and unleash their creativity in a supportive environment.",
    "sentiment": "",
    "ageRange": "3-18",
    "cost": "$25-$289 depending on camp",
    "location": "Wrentham",
    "url": "http://www.showcasedanceproductions.com/summerprograms.htm",
    "registrationDeadline": "March 1, 2026",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08"
    ]
  },
  {
    "id": "exhale-school-of-dance-exhale-school-of-dance",
    "name": "Exhale School of Dance",
    "provider": "Exhale School of Dance",
    "category": "arts",
    "subcategory": "dance",
    "tags": [
      "non-competitive",
      "dance education",
      "nurturing",
      "all-ages",
      "inclusive",
      "well-being"
    ],
    "neighborhood": "norfolk",
    "description": "Exhale Dance offers non-competitive, nurturing dance education for all ages and levels in Norfolk, Massachusetts. Students learn to be 'their best' and not 'the best' in an environment that prioritizes well-being, appropriate training, and inclusivity. Classes range from two-year-olds to adults, with programming designed to serve all bodies and create a lasting love of dance.",
    "sentiment": "Jen's passion for dance and commitment to kindness changed my life. She worked to create a community of love and support among all dancers and staff. She taught us that not only is dance a blessing, but each day is a blessing as well.",
    "ageRange": "3-12",
    "cost": "Check website",
    "location": "Norfolk",
    "url": "https://exhaledance.com/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w04",
      "w05",
      "w06"
    ]
  },
  {
    "id": "mass-music-arts-society-mmas-mass-music-arts-society",
    "name": "Mass Music & Arts Society (MMAS)",
    "provider": "Mass Music & Arts Society",
    "category": "arts",
    "subcategory": "theater",
    "tags": [
      "musical theatre",
      "Broadway",
      "summer intensive",
      "performance",
      "ages 8-17",
      "showcase"
    ],
    "neighborhood": "mansfield",
    "description": "Mass Arts Center offers two summer theatre intensives for young performers. Defying Gravity (ages 8-17) is a three-week musical theatre program drawing from the Broadway hit Wicked, where students act, sing, and dance while improving their performative skills and culminating in a final showcase. Broadway Mash-up (ages 8-11) is a one-week intensive featuring contemporary musicals like Six and Mamma Mia, where participants tell stories through song and dance with a final performance for family and friends.",
    "sentiment": "",
    "ageRange": "8-17",
    "cost": "$995-$1,125 for Defying Gravity (3 weeks); $399 for Broadway Mash-up (1 week)",
    "location": "Mansfield",
    "url": "https://massartscenter.org/summer-program/",
    "registrationDeadline": "Rolling admission; Early bird pricing through March 31 for Defying Gravity",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w02",
      "w03",
      "w06"
    ]
  },
  {
    "id": "theatre-camp-at-mansfield-arts-and-education-ymca-mansfield-",
    "name": "Theatre Camp at Mansfield Arts and Education YMCA",
    "provider": "Mansfield YMCA",
    "category": "arts",
    "subcategory": "theater",
    "tags": [
      "theater",
      "drama",
      "performance",
      "arts",
      "youth",
      "summer-camp"
    ],
    "neighborhood": "mansfield",
    "description": "Theatre Camp offers children an immersive experience in acting, drama, and performance. Campers explore the wonders of theatrical arts in a creative environment at the Mansfield Arts & Education Center.",
    "sentiment": "",
    "ageRange": "3-16",
    "cost": "Check website",
    "location": "Mansfield",
    "url": "https://www.hockymca.org/mansfield/programs/theatre-camp/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09"
    ]
  },
  {
    "id": "kid-town-nursery-school-summer-session-kid-town-nursery-scho",
    "name": "Kid Town Nursery School Summer Session",
    "provider": "Kid Town Nursery School",
    "category": "arts",
    "subcategory": "visual-arts",
    "tags": [
      "outdoor-learning",
      "nature-exploration",
      "reggio-inspired",
      "preschool",
      "sensory-play",
      "themed-weeks"
    ],
    "neighborhood": "mansfield",
    "description": "Kid Town offers half or full day summer sessions Monday through Thursdays featuring unique weekly explorations in outdoor classrooms. Children investigate mud kitchens, sensory tables, wading pools, and engage in Reggio-inspired projects with themes like Dino Week, Ocean Explorers, and Music and Movement.",
    "sentiment": "",
    "ageRange": "1-8",
    "cost": "Half day $100/day or $195/4 days; Full day $160/day or $295/4 days",
    "location": "Mansfield",
    "url": "https://kidtownnurseryscho.wixsite.com/kid-town-nursery-sch/summer-sessions",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "theater-with-laura-canfield-laura-canfield-stage-productions",
    "name": "Theater with Laura Canfield",
    "provider": "Laura Canfield Stage Productions",
    "category": "arts",
    "subcategory": "theater",
    "tags": [
      "musical theater",
      "teen program",
      "performance",
      "confidence-building",
      "professional production"
    ],
    "neighborhood": "foxborough",
    "description": "LRC Stage Productions offers high-quality musical theater enrichment that ignites imagination and fosters a love for the performing arts. Students bring stories to life on stage through professionally directed productions like Chicago: Teen Edition, learning acting, singing, and dancing in a supportive environment where everyone feels like a star.",
    "sentiment": "\"It is incredible how much my daughter's confidence has been built. She has always been a little bit on the shy side but I barely recognize her now when she hits the stage.\" - Linda P.",
    "ageRange": "11-18",
    "cost": "Check website",
    "location": "Foxboro",
    "url": "https://lrcstageproductions.com/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w05"
    ]
  },
  {
    "id": "boston-ballet-school-summer-programs-boston-ballet-school",
    "name": "Boston Ballet School Summer Programs",
    "provider": "Boston Ballet School",
    "category": "arts",
    "subcategory": "dance",
    "tags": [
      "ballet",
      "dance",
      "summer camp",
      "ages 2-9",
      "Boston",
      "classical ballet"
    ],
    "neighborhood": "brookline",
    "description": "Boston Ballet School's summer camps for ages 2-9 blend classical ballet technique with creative movement enrichment in a fun, supportive environment. Students explore musical and spatial awareness, storytelling, and dance fundamentals through comprehensive programs ranging from Summer Sessions to Foundations Workshop. Expert faculty guide young dancers to elevate their knowledge and discover new genres of movement.",
    "sentiment": "",
    "ageRange": "2-9",
    "cost": "Check website",
    "location": "Brookline",
    "url": "https://www.bostonballet.org/education-artical/summer-camps/?utm_source=communitykangeroo&utm_medium=display&utm_campaign=nonres26&utm_term=campfeature",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "hipstitch-hipstitch",
    "name": "Hipstitch",
    "provider": "Hipstitch",
    "category": "arts",
    "subcategory": "visual-arts",
    "tags": [
      "sewing",
      "arts",
      "crafts",
      "fiber-arts",
      "day-camp",
      "multiple-locations"
    ],
    "neighborhood": "brookline",
    "description": "Hipstitch offers summer camps at multiple Massachusetts studios (Newton, Wellesley, Brookline, Arlington) where children learn sewing, crafting, and creative fiber arts. Campers work on hands-on projects, develop their artistic skills, and connect with other young creators in a fun, supportive studio environment.",
    "sentiment": "",
    "ageRange": "5-18",
    "cost": "Check website",
    "location": "Brookline",
    "url": "https://www.hipstitchers.com/",
    "registrationDeadline": "Rolling admission",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10",
      "w11"
    ]
  },
  {
    "id": "tongwood-tongwood",
    "name": "Tongwood",
    "provider": "Tongwood",
    "category": "arts",
    "subcategory": "visual-arts",
    "tags": [
      "visual arts",
      "painting",
      "drawing",
      "creative",
      "kids",
      "teens"
    ],
    "neighborhood": "brookline",
    "description": "TONGWOOD Art Center offers kids and teens art classes in painting, drawing, and creative media at their Brookline and Quincy locations. They provide both regular weekly classes and vacation camps throughout the year.",
    "sentiment": "",
    "ageRange": "4-12",
    "cost": "Check website",
    "location": "Brookline",
    "url": "https://www.tongwood.com/",
    "registrationDeadline": "Check website",
    "documents": [
      "Waiver"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "brookline-arts-center-brookline-arts-center",
    "name": "Brookline Arts Center",
    "provider": "Brookline Arts Center",
    "category": "arts",
    "subcategory": "visual-arts",
    "tags": [
      "visual-arts",
      "workshops",
      "painting",
      "printmaking",
      "ceramics",
      "art-classes"
    ],
    "neighborhood": "brookline",
    "description": "Brookline Arts Center offers classes, workshops, and programs in visual arts including wheelthrowing, printmaking, oil painting, and ink work. The center provides opportunities for artists of all levels to explore various artistic mediums and techniques.",
    "sentiment": "",
    "ageRange": "5-17",
    "cost": "Check website",
    "location": "Brookline",
    "url": "https://brooklineartscenter.org/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "school-of-rock-school-of-rock",
    "name": "School of Rock",
    "provider": "School of Rock",
    "category": "arts",
    "subcategory": "visual-arts",
    "tags": [
      "music",
      "performance-based learning",
      "rock music",
      "band experience",
      "all ages",
      "live performances"
    ],
    "neighborhood": "brookline",
    "description": "School of Rock Brookline combines one-on-one music instruction with group band rehearsals using a performance-based approach. Students learn by playing iconic rock songs suited to their age and ability level, with the goal of performing live at local Brookline venues.",
    "sentiment": "96.2% of parents saw a boost in their child's self-confidence and 95.9% reported improved teamwork skills after joining our programs.",
    "ageRange": "7-17",
    "cost": "Check website",
    "location": "Brookline",
    "url": "https://www.schoolofrock.com/locations/brookline",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "plein-air-art-academy-plein-air-art-academy",
    "name": "Plein-Air Art Academy",
    "provider": "Plein-Air Art Academy",
    "category": "arts",
    "subcategory": "visual-arts",
    "tags": [
      "visual-arts",
      "painting",
      "sculpture",
      "art-history",
      "creative-expression",
      "museum-trips"
    ],
    "neighborhood": "brookline",
    "description": "Plein-Air Art Academy offers a Best of Boston summer camp program exploring varied themes in the art world and introducing an array of materials to young artists of all levels. Students are exposed to art history stories, introduced to new materials each week including clay, watercolor, tempera paints, and collage, and have dedicated time for free drawing. Each summer ends with a field trip to an art museum to see artworks in person.",
    "sentiment": "",
    "ageRange": "7-13",
    "cost": "Check website",
    "location": "Brookline",
    "url": "https://www.dianastelin.com/plein-air-art-academy",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w03",
      "w05",
      "w06",
      "w07",
      "w09",
      "w10"
    ]
  },
  {
    "id": "artbarn-artbarn",
    "name": "ArtBarn",
    "provider": "ArtBarn",
    "category": "arts",
    "subcategory": "theater",
    "tags": [
      "theater",
      "musical",
      "performance",
      "acting",
      "dance",
      "grades-2-8"
    ],
    "neighborhood": "brookline",
    "description": "Summer at The Barn offers two distinct three-week theater sessions where students explore acting technique, character creation, music, dance, improvisation, playwriting, stage combat, and design while creating a fully staged musical production. Each day includes theater workshops, performance rehearsals, and outdoor time with group games and free play.",
    "sentiment": "",
    "ageRange": "7-13",
    "cost": "$1,800/3-week session",
    "location": "Brookline",
    "url": "https://artbarn.org/what-we-do/our-programs/summer-at-the-barn/",
    "registrationDeadline": "12/31/25 for Early Bird discount; Rolling admission after",
    "documents": [
      "Tuition Assistance Application"
    ],
    "weeks": [
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08"
    ]
  },
  {
    "id": "boston-ballet-school-boston-ballet-school",
    "name": "Boston Ballet School",
    "provider": "Boston Ballet School",
    "category": "arts",
    "subcategory": "dance",
    "tags": [
      "ballet",
      "dance",
      "summer camp",
      "ages 2-9",
      "classical ballet",
      "creative movement"
    ],
    "neighborhood": "brookline",
    "description": "Boston Ballet School's summer camps for ages 2-9 blend classical ballet technique with creative movement and enrichment activities. Students in a fun, supportive environment explore dance fundamentals, storytelling, music awareness, and specialized workshops covering topics like dance history, ballet mime, and modern dance based on their age and level.",
    "sentiment": "",
    "ageRange": "5-9",
    "cost": "Check website",
    "location": "Brookline",
    "url": "https://www.bostonballet.org/education-artical/summer-camps/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w02",
      "w03",
      "w04",
      "w05",
      "w07",
      "w08"
    ]
  },
  {
    "id": "creative-arts-at-park-creative-arts-at-park",
    "name": "Creative Arts at Park",
    "provider": "Creative Arts at Park",
    "category": "arts",
    "subcategory": "visual-arts",
    "tags": [
      "arts",
      "visual-arts",
      "performing-arts",
      "sports",
      "ages-7-15",
      "Brookline"
    ],
    "neighborhood": "brookline",
    "description": "Creative Arts at Park provides children ages 7-15 with opportunities to explore visual and performing arts and sports under the guidance of professional artists. The performance-oriented program emphasizes an integral approach to the arts and creates a spirit of cooperation, helping students discover talents and develop skills for lifelong enjoyment.",
    "sentiment": "",
    "ageRange": "7-15",
    "cost": "$4,250 for 5-week session (6/29-7/31) or $2,655 for 3-week session (7/13-7/31)",
    "location": "Brookline",
    "url": "https://www.creativeartsatpark.org/",
    "registrationDeadline": "December 3rd (returning families) or December 5th (new families)",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w02",
      "w03",
      "w04",
      "w05",
      "w06"
    ]
  },
  {
    "id": "the-clayroom-the-clayroom",
    "name": "The Clayroom",
    "provider": "The Clayroom",
    "category": "arts",
    "subcategory": "visual-arts",
    "tags": [
      "pottery",
      "visual arts",
      "summer camp",
      "kids",
      "creative",
      "Brookline"
    ],
    "neighborhood": "brookline",
    "description": "Clay Days Summer Program offers children ages 5-12 fun, engaging art activities, games, and creative projects. The program runs daily from 9 am to 2 pm and includes lunch and snacks.",
    "sentiment": "I love this place so much, it was so much fun! The staff here are amazing, they're so friendly and helpful!",
    "ageRange": "5-12",
    "cost": "$642",
    "location": "Brookline",
    "url": "https://clayroom.com/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w09",
      "w10",
      "w11"
    ]
  },
  {
    "id": "puppet-showplace-theatre-puppet-showplace-theatre",
    "name": "Puppet Showplace Theatre",
    "provider": "Puppet Showplace Theatre",
    "category": "arts",
    "subcategory": "theater",
    "tags": [
      "puppetry",
      "theater",
      "arts",
      "summer camp",
      "vacation week",
      "hands-on"
    ],
    "neighborhood": "brookline",
    "description": "Kids dive into hands-on puppetry techniques including shadow puppets, sock puppets, marionettes, and more while learning to build puppets, practice performance, and develop storytelling skills. Programs run for one week during school breaks and summer, with experienced puppeteers and resident artists leading creative sessions.",
    "sentiment": "",
    "ageRange": "7-12",
    "cost": "Check website",
    "location": "Brookline",
    "url": "https://www.puppetshowplace.org/kids-vacation-programs",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w09",
      "w10"
    ]
  },
  {
    "id": "broadway-at-brookline-music-school-brookline-music-school",
    "name": "Broadway at Brookline Music School",
    "provider": "Brookline Music School",
    "category": "arts",
    "subcategory": "theater",
    "tags": [
      "theater",
      "musical-theater",
      "singing",
      "acting",
      "teen-camp",
      "intensive"
    ],
    "neighborhood": "brookline",
    "description": "Broadway at Brookline engages students ages 12-16 in a weeklong intensive exploring creativity through acting, singing, and movement. Students learn all aspects of theatre including private coachings, solo and ensemble singing, character development, and song analysis, culminating in a recorded mock audition and cabaret showcase performance.",
    "sentiment": "Broadway at Brookline was a great experience; it was both exciting and fun, and improved my singing and acting. The instructors were comforting, but also honest and helpful. - Rynn, 14",
    "ageRange": "12-16",
    "cost": "Check website",
    "location": "Brookline",
    "url": "https://bmsmusic.org/summer/broadway-at-brookline/",
    "registrationDeadline": "March 14, 2026",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w08"
    ]
  },
  {
    "id": "meet-the-instruments-at-brookline-music-school-brookline-mus",
    "name": "Meet the Instruments at Brookline Music School",
    "provider": "Brookline Music School",
    "category": "arts",
    "subcategory": "music",
    "tags": [
      "music",
      "instruments",
      "summer camp",
      "young children",
      "music education",
      "brookline"
    ],
    "neighborhood": "brookline",
    "description": "Meet the Instruments is a summer music class for ages 6-9 at Brookline Music School where children explore and discover various musical instruments in an engaging group setting.",
    "sentiment": "",
    "ageRange": "6-9",
    "cost": "Check website",
    "location": "Brookline",
    "url": "https://bmsmusic.org/summer/#classes",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w10"
    ]
  },
  {
    "id": "jazzlab-at-brookline-music-school-brookline-music-school",
    "name": "JazzLab at Brookline Music School",
    "provider": "Brookline Music School",
    "category": "arts",
    "subcategory": "music",
    "tags": [
      "jazz",
      "music",
      "ensemble",
      "youth",
      "summer",
      "intensive"
    ],
    "neighborhood": "brookline",
    "description": "JazzLab is an intensive jazz program for young musicians ages 10-18 at Brookline Music School. Students explore jazz history, theory, and ensemble performance through hands-on learning with experienced instructors.",
    "sentiment": "",
    "ageRange": "10-17",
    "cost": "Check website",
    "location": "Brookline",
    "url": "https://bmsmusic.org/summer/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w09"
    ]
  },
  {
    "id": "brookline-music-school-brookline-music-school",
    "name": "Brookline Music School",
    "provider": "Brookline Music School",
    "category": "arts",
    "subcategory": "music",
    "tags": [
      "jazz",
      "music",
      "ensemble",
      "youth",
      "summer",
      "intensive"
    ],
    "neighborhood": "brookline",
    "description": "JazzLab is an intensive jazz program for young musicians ages 10-18 at Brookline Music School. Students explore jazz history, theory, and ensemble performance through hands-on learning with experienced instructors.",
    "sentiment": "",
    "ageRange": "4-18",
    "cost": "Check website",
    "location": "Brookline",
    "url": "https://bmsmusic.org/summer/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10",
      "w11"
    ]
  },
  {
    "id": "mass-motion-dance-mass-motion-dance",
    "name": "Mass Motion Dance",
    "provider": "Mass Motion Dance",
    "category": "arts",
    "subcategory": "dance",
    "tags": [
      "dance",
      "arts",
      "youth-dance",
      "community-dance",
      "multiple-locations",
      "performing-arts"
    ],
    "neighborhood": "norwood",
    "description": "Mass Motion Dance Studios offers dance instruction in a nurturing, family-oriented environment where education and creativity thrive together. Students explore various dance styles while being inspired to chase their dreams through the arts. With locations in Boston, Medfield, and Sturbridge, the studios celebrate the joy of dance for all ages.",
    "sentiment": "",
    "ageRange": "3-12",
    "cost": "Check website",
    "location": "Allston-Brighton",
    "url": "https://www.massmotiondance.com/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w03",
      "w05",
      "w06",
      "w08",
      "w10",
      "w11"
    ]
  },
  {
    "id": "all-hands-allston-all-hands-allston",
    "name": "All Hands Allston",
    "provider": "All Hands Allston",
    "category": "arts",
    "subcategory": "visual-arts",
    "tags": [],
    "neighborhood": "norwood",
    "description": "Unable to retrieve camp information due to 404 error on website.",
    "sentiment": "",
    "ageRange": "5-12",
    "cost": "Check website",
    "location": "Allston-Brighton",
    "url": "https://allhandsallston.com/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w04",
      "w05",
      "w06",
      "w07",
      "w08"
    ]
  },
  {
    "id": "museum-of-fine-arts-museum-of-fine-arts",
    "name": "Museum of Fine Arts",
    "provider": "Museum of Fine Arts",
    "category": "arts",
    "subcategory": "visual-arts",
    "tags": [
      "visual-arts",
      "museum-based",
      "art-classes",
      "weekend-programs",
      "summer-camp",
      "school-vacation"
    ],
    "neighborhood": "norwood",
    "description": "Kids ages 5–11 explore the Museum's art collection and create through drawing, painting, sculpture, collage, and printmaking in weekly classes. Summer programs feature full-day sessions organized by age with new weekly themes like The Art of Play and Making Waves. School vacation week classes offer Tuesday–Friday sessions with small class sizes focused on specific artistic themes.",
    "sentiment": "",
    "ageRange": "5-17",
    "cost": "Check website",
    "location": "Fenway-Kenmore",
    "url": "https://www.mfa.org/programs/studio-art-classes/kids",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09"
    ]
  },
  {
    "id": "wheelock-family-theatre-wheelock-family-theatre",
    "name": "Wheelock Family Theatre",
    "provider": "Wheelock Family Theatre",
    "category": "arts",
    "subcategory": "theater",
    "tags": [
      "theater",
      "professional",
      "family-friendly",
      "boston",
      "arts",
      "education"
    ],
    "neighborhood": "norwood",
    "description": "Wheelock Family Theatre is a professional theatre company with a 45-year legacy in Greater Boston dedicated to bringing transformative stories to audiences of all ages. Their programs nurture creativity, community, and confidence through theatrical performances and education classes grounded in access, equity, and inclusion.",
    "sentiment": "",
    "ageRange": "4-17",
    "cost": "Check website",
    "location": "Fenway-Kenmore",
    "url": "https://www.wheelockfamilytheatre.org/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08"
    ]
  },
  {
    "id": "boston-conservatory-at-berklee-boston-conservatory-at-berkle",
    "name": "Boston Conservatory at Berklee",
    "provider": "Boston Conservatory at Berklee",
    "category": "arts",
    "subcategory": "visual-arts",
    "tags": [
      "music",
      "dance",
      "theater",
      "intensive",
      "summer",
      "performing-arts"
    ],
    "neighborhood": "norwood",
    "description": "Boston Conservatory at Berklee offers multiple summer programs in dance, music, and theater. Students train with renowned faculty and peers, exploring intensive programs like Commercial Dance, Musical Theater, Vocal/Choral studies, and Composition to take their artistry to the next level.",
    "sentiment": "",
    "ageRange": "12-18",
    "cost": "Check website",
    "location": "Fenway-Kenmore",
    "url": "https://bostonconservatory.berklee.edu/summer",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06"
    ]
  },
  {
    "id": "express-dance-and-acrobatics-summer-camp-express-dance-and-a",
    "name": "Express Dance and Acrobatics Summer Camp",
    "provider": "Express Dance and Acrobatics",
    "category": "arts",
    "subcategory": "dance",
    "tags": [
      "dance",
      "acrobatics",
      "summer camp",
      "multi-activity",
      "themed camps",
      "family discount"
    ],
    "neighborhood": "milford",
    "description": "Campers will have a blast with dancing, acrobatics, gym obstacle courses, crafts, games and more! Each week features themed camps like Taylor Swift, K-Pop Demon Hunters, Disney, and Beach Party. Available in half-day (9am-12pm) and full-day (9am-3pm) sessions.",
    "sentiment": "",
    "ageRange": "4-13",
    "cost": "$150/week (half day) or $250/week (full day); $40/day (half day) or $60/day (full day)",
    "location": "Milford",
    "url": "https://www.expressdanceandacro.com/express_summer.htm",
    "registrationDeadline": "Rolling admission",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04"
    ]
  },
  {
    "id": "franklin-lifelong-learning-franklin-lifelong-learning",
    "name": "Franklin Lifelong Learning",
    "provider": "Franklin Lifelong Learning",
    "category": "arts",
    "subcategory": "music",
    "tags": [
      "music",
      "arts",
      "stem",
      "summer-camp",
      "franklin-ma",
      "youth-programs"
    ],
    "neighborhood": "franklin",
    "description": "Franklin Lifelong Learning offers diverse summer programs including the Summer Music Academy (July 20-31), Solutions Summer Adventure with art and science activities, Summer STAR classes for grades K-5, and STEAM engineering camps. Students can explore music, visual arts, nature, and educational topics while enjoying five weeks of engaging activities.",
    "sentiment": "",
    "ageRange": "5-17",
    "cost": "Check website",
    "location": "Franklin",
    "url": "https://www.franklinlifelonglearning.com/",
    "registrationDeadline": "Rolling admission",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w03",
      "w04",
      "w05",
      "w06",
      "w07"
    ]
  },
  {
    "id": "creative-corner-art-studio-creative-corner-art-studio",
    "name": "Creative Corner Art Studio",
    "provider": "Creative Corner Art Studio",
    "category": "arts",
    "subcategory": "visual-arts",
    "tags": [
      "visual-arts",
      "summer-camp",
      "movie-making",
      "creative-expression",
      "youth-art"
    ],
    "neighborhood": "franklin",
    "description": "Creative Corner Art Studio offers summer art club with a new theme each week, including a special two-week movie making experience where kids star, film, and produce their own K-pop Demon Hunters movie that will be shown in Franklin. The studio fosters creative self-expression and helps children develop their artistic talents through hands-on art activities.",
    "sentiment": "\"You can't use up CREATIVITY the more you use the more you have.\" - Maya Angelou",
    "ageRange": "5-11",
    "cost": "Check website",
    "location": "Franklin",
    "url": "https://www.creativecornerartstudiofranklin.com/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w02",
      "w03",
      "w04",
      "w05",
      "w07",
      "w09"
    ]
  },
  {
    "id": "feet-in-motion-dance-feet-in-motion-dance",
    "name": "Feet in Motion Dance",
    "provider": "Feet in Motion Dance",
    "category": "arts",
    "subcategory": "dance",
    "tags": [
      "dance",
      "recital",
      "performance",
      "Franklin MA",
      "youth dance",
      "community"
    ],
    "neighborhood": "franklin",
    "description": "Feet in Motion Dance Studio offers dance classes for the 2025-2026 season running from September through May, culminating in an Annual Recital at Medway High School. Students participate in various dance styles with opportunities for performance and community events like the FIM Family Halloween Dance Party.",
    "sentiment": "",
    "ageRange": "3-9",
    "cost": "Check website",
    "location": "Franklin",
    "url": "https://www.feetinmotiondance.com/",
    "registrationDeadline": "Mid November",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w05",
      "w06",
      "w07",
      "w08"
    ]
  },
  {
    "id": "express-dance-acro-express-dance-acro",
    "name": "Express Dance & Acro",
    "provider": "Express Dance & Acro",
    "category": "arts",
    "subcategory": "dance",
    "tags": [
      "dance",
      "acrobatics",
      "cheer",
      "tumbling",
      "summer camps",
      "recreational"
    ],
    "neighborhood": "milford",
    "description": "Express Dance & Acro offers summer camps and classes featuring dance, acrobatics, tumbling, and cheer. Students can participate in recreational classes, competitive team training, and open gym sessions using tumble tracks and spring floors to develop their skills.",
    "sentiment": "",
    "ageRange": "4-13",
    "cost": "Check website",
    "location": "Milford",
    "url": "http://www.expressdanceandacro.com/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w03",
      "w04",
      "w05",
      "w08"
    ]
  },
  {
    "id": "summer-sage-sage-school",
    "name": "Summer Sage",
    "provider": "Sage School",
    "category": "arts",
    "subcategory": "theater",
    "tags": [
      "summer camp",
      "enrichment",
      "creative learning",
      "multi-age program",
      "discovery-based",
      "themed weeks"
    ],
    "neighborhood": "foxborough",
    "description": "Summer Sage offers a reimagined summer experience blending imagination with purpose, inviting children to explore big ideas, build skills, and grow with confidence through weekly themed programs like Stage, Studio & Beyond, Real World Skills Summit, Passages & Pathways, Secret Agent Summer School, Game On!, and Portal to the Realms. Children participate in small groups across age divisions (K-1, 2-3, 4-5) with enriching activities designed to inspire curiosity and discovery in a joyful setting.",
    "sentiment": "We are so grateful to have been able to participate even though they are not students at Sage - they felt included, welcomed, and so engaged in the activities. Thank you for offering some alternatives to the sports camps and general day camps. They loved learning something new that they got to choose and that fills my heart.",
    "ageRange": "3-12",
    "cost": "Check website",
    "location": "Foxboro",
    "url": "https://sageschool.org/program/summer-sage/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06"
    ]
  },
  {
    "id": "mass-music-arts-society-mmas-princess-pirate-week-mass-music",
    "name": "Mass Music & Arts Society (MMAS) - Princess & Pirate Week",
    "provider": "Mass Music & Arts Society",
    "category": "arts",
    "subcategory": "theater",
    "tags": [
      "musical theatre",
      "Broadway",
      "summer intensive",
      "performance",
      "ages 8-17",
      "showcase"
    ],
    "neighborhood": "norwood",
    "description": "Mass Arts Center offers two summer theatre intensives for young performers. Defying Gravity (ages 8-17) is a three-week musical theatre program drawing from the Broadway hit Wicked, where students act, sing, and dance while improving their performative skills and culminating in a final showcase. Broadway Mash-up (ages 8-11) is a one-week intensive featuring contemporary musicals like Six and Mamma Mia, where participants tell stories through song and dance with a final performance for family and friends.",
    "sentiment": "",
    "ageRange": "8-17",
    "cost": "$995-$1,125 for Defying Gravity (3 weeks); $399 for Broadway Mash-up (1 week)",
    "location": "Mansfield",
    "url": "https://massartscenter.org/summer-program/",
    "registrationDeadline": "Rolling admission; Early bird pricing through March 31 for Defying Gravity",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w02"
    ]
  },
  {
    "id": "mass-music-arts-society-mmas-big-blue-world-mass-music-arts-",
    "name": "Mass Music & Arts Society (MMAS) - Big Blue World",
    "provider": "Mass Music & Arts Society",
    "category": "arts",
    "subcategory": "theater",
    "tags": [
      "musical theatre",
      "Broadway",
      "summer intensive",
      "performance",
      "ages 8-17",
      "showcase"
    ],
    "neighborhood": "norwood",
    "description": "Mass Arts Center offers two summer theatre intensives for young performers. Defying Gravity (ages 8-17) is a three-week musical theatre program drawing from the Broadway hit Wicked, where students act, sing, and dance while improving their performative skills and culminating in a final showcase. Broadway Mash-up (ages 8-11) is a one-week intensive featuring contemporary musicals like Six and Mamma Mia, where participants tell stories through song and dance with a final performance for family and friends.",
    "sentiment": "",
    "ageRange": "8-17",
    "cost": "$995-$1,125 for Defying Gravity (3 weeks); $399 for Broadway Mash-up (1 week)",
    "location": "Mansfield",
    "url": "https://massartscenter.org/summer-program/",
    "registrationDeadline": "Rolling admission; Early bird pricing through March 31 for Defying Gravity",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w03"
    ]
  },
  {
    "id": "mass-music-arts-society-mmas-madagascar-mass-music-arts-soci",
    "name": "Mass Music & Arts Society (MMAS) - Madagascar",
    "provider": "Mass Music & Arts Society",
    "category": "arts",
    "subcategory": "theater",
    "tags": [
      "musical theatre",
      "Broadway",
      "summer intensive",
      "performance",
      "ages 8-17",
      "showcase"
    ],
    "neighborhood": "norwood",
    "description": "Mass Arts Center offers two summer theatre intensives for young performers. Defying Gravity (ages 8-17) is a three-week musical theatre program drawing from the Broadway hit Wicked, where students act, sing, and dance while improving their performative skills and culminating in a final showcase. Broadway Mash-up (ages 8-11) is a one-week intensive featuring contemporary musicals like Six and Mamma Mia, where participants tell stories through song and dance with a final performance for family and friends.",
    "sentiment": "",
    "ageRange": "8-17",
    "cost": "$995-$1,125 for Defying Gravity (3 weeks); $399 for Broadway Mash-up (1 week)",
    "location": "Mansfield",
    "url": "https://massartscenter.org/summer-program/",
    "registrationDeadline": "Rolling admission; Early bird pricing through March 31 for Defying Gravity",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w06"
    ]
  },
  {
    "id": "theatre-camp-at-mansfield-arts-and-education-ymca-frozen-jun",
    "name": "Theatre Camp at Mansfield Arts and Education YMCA - Frozen Junior",
    "provider": "Mansfield Arts and Education YMCA",
    "category": "arts",
    "subcategory": "theater",
    "tags": [
      "theater",
      "drama",
      "performance",
      "arts",
      "youth",
      "summer-camp"
    ],
    "neighborhood": "norwood",
    "description": "Theatre Camp offers children an immersive experience in acting, drama, and performance. Campers explore the wonders of theatrical arts in a creative environment at the Mansfield Arts & Education Center.",
    "sentiment": "",
    "ageRange": "7-15",
    "cost": "Check website",
    "location": "Mansfield",
    "url": "https://www.hockymca.org/mansfield/programs/theatre-camp/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w02",
      "w03"
    ]
  },
  {
    "id": "theatre-camp-at-mansfield-arts-and-education-ymca-wizard-of-",
    "name": "Theatre Camp at Mansfield Arts and Education YMCA - Wizard of Oz",
    "provider": "Mansfield Arts and Education YMCA",
    "category": "arts",
    "subcategory": "theater",
    "tags": [
      "theater",
      "drama",
      "performance",
      "arts",
      "youth",
      "summer-camp"
    ],
    "neighborhood": "norwood",
    "description": "Theatre Camp offers children an immersive experience in acting, drama, and performance. Campers explore the wonders of theatrical arts in a creative environment at the Mansfield Arts & Education Center.",
    "sentiment": "",
    "ageRange": "7-15",
    "cost": "Check website",
    "location": "Mansfield",
    "url": "https://www.hockymca.org/mansfield/programs/theatre-camp/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w04",
      "w05"
    ]
  },
  {
    "id": "theatre-camp-at-mansfield-arts-and-education-ymca-disney-s-d",
    "name": "Theatre Camp at Mansfield Arts and Education YMCA - Disney's Descendants: The Musical",
    "provider": "Mansfield Arts and Education YMCA",
    "category": "arts",
    "subcategory": "theater",
    "tags": [
      "theater",
      "drama",
      "performance",
      "arts",
      "youth",
      "summer-camp"
    ],
    "neighborhood": "norwood",
    "description": "Theatre Camp offers children an immersive experience in acting, drama, and performance. Campers explore the wonders of theatrical arts in a creative environment at the Mansfield Arts & Education Center.",
    "sentiment": "",
    "ageRange": "7-15",
    "cost": "Check website",
    "location": "Mansfield",
    "url": "https://www.hockymca.org/mansfield/programs/theatre-camp/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w06",
      "w07",
      "w08"
    ]
  },
  {
    "id": "theatre-camp-at-mansfield-arts-and-education-ymca-story-expl",
    "name": "Theatre Camp at Mansfield Arts and Education YMCA - Story Explorers",
    "provider": "Mansfield Arts and Education YMCA",
    "category": "arts",
    "subcategory": "theater",
    "tags": [
      "theater",
      "drama",
      "performance",
      "arts",
      "youth",
      "summer-camp"
    ],
    "neighborhood": "norwood",
    "description": "Theatre Camp offers children an immersive experience in acting, drama, and performance. Campers explore the wonders of theatrical arts in a creative environment at the Mansfield Arts & Education Center.",
    "sentiment": "",
    "ageRange": "3-5",
    "cost": "Check website",
    "location": "Mansfield",
    "url": "https://www.hockymca.org/mansfield/programs/theatre-camp/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w09"
    ]
  },
  {
    "id": "taste-of-broadway-weymouth-parks-and-recreation-department",
    "name": "Taste of Broadway",
    "provider": "Weymouth Parks and Recreation Department",
    "category": "arts",
    "subcategory": "theater",
    "tags": [
      "day camp",
      "theater",
      "arts",
      "Weymouth residents only"
    ],
    "neighborhood": "weymouth",
    "description": "A theater and performing arts camp offering Broadway-themed activities for children.",
    "sentiment": "",
    "ageRange": "5-14",
    "cost": "Check website",
    "location": "Weymouth",
    "url": "https://www.weymouth.ma.us/1960/Weymouth-Recreation-Summer-Day-Camps",
    "registrationDeadline": "March 25, 2026",
    "documents": [
      "Health Form"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "norwood-montessori-school-summer-camp-norwood-montessori-sch",
    "name": "Norwood Montessori School Summer Camp",
    "provider": "Norwood Montessori School",
    "category": "arts",
    "subcategory": "visual-arts",
    "tags": [
      "Montessori",
      "educational",
      "multi-activity",
      "themes",
      "art",
      "science",
      "music",
      "technology"
    ],
    "neighborhood": "norwood",
    "description": "Norwood Montessori School's summer program offers age-appropriate sessions in Art, Science, Music, Technology, and Classroom Works, with themed weeks like Space, Renaissance, and Community Exploration. Children learn and explore in a familiar Montessori environment while having fun with friends, with flexible scheduling options from half-day to extended care.",
    "sentiment": "All the children who come have a great time while learning lots of new information!",
    "ageRange": "2-14",
    "cost": "$50/week deposit, balance due two weeks before start",
    "location": "Norwood Montessori School, Norwood",
    "url": "https://www.norwoodmontessorischool.com/summer-camp",
    "registrationDeadline": "ASAP to secure spot; Balance due June 2nd",
    "documents": [
      "Summer Camp Application",
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "creative-arts-at-park-caap-the-park-school",
    "name": "Creative Arts at Park (CAAP)",
    "provider": "The Park School",
    "category": "arts",
    "subcategory": "visual-arts",
    "tags": [
      "visual arts",
      "dance",
      "theater",
      "music",
      "video",
      "film",
      "photography",
      "creative writing"
    ],
    "neighborhood": "brookline",
    "description": "Creative Arts at Park (CAAP) is an unforgettable arts experience for campers ages 7-15 where children grow, find friendships, and have fun creating their own schedules from offerings in visual arts, dance, theater, music, video/film, computers, photography, creative writing, martial arts, and sports. Under the guidance of professional artists and educators, campers discover talents and develop skills that provide life-long enjoyment.",
    "sentiment": "",
    "ageRange": "7-15",
    "cost": "Check website",
    "location": "The Park School, 34-acre campus, Brookline",
    "url": "https://www.parkschool.org/community/summer-programs",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "summer-at-park-the-park-school",
    "name": "Summer at Park",
    "provider": "The Park School",
    "category": "arts",
    "subcategory": "visual-arts",
    "tags": [
      "art",
      "science",
      "cooking",
      "leadership",
      "outdoor adventures",
      "sports",
      "day camp",
      "ACA-accredited"
    ],
    "neighborhood": "brookline",
    "description": "Creative Arts at Park (CAAP) is an unforgettable arts experience for campers ages 7-15 where children grow, find friendships, and have fun creating their own schedules from offerings in visual arts, dance, theater, music, video/film, computers, photography, creative writing, martial arts, and sports. Under the guidance of professional artists and educators, campers discover talents and develop skills that provide life-long enjoyment.",
    "sentiment": "",
    "ageRange": "4-15",
    "cost": "Check website",
    "location": "The Park School, 34-acre campus, Brookline",
    "url": "https://www.parkschool.org/community/summer-programs",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "summer-art-camp-at-milton-art-center-milton-art-center",
    "name": "Summer Art Camp at Milton Art Center",
    "provider": "Milton Art Center",
    "category": "arts",
    "subcategory": "visual-arts",
    "tags": [
      "art",
      "creative expression",
      "small groups",
      "experienced instructors"
    ],
    "neighborhood": "milton",
    "description": "A joyful summer art camp where children explore creativity, make friends, and discover the fun of artistic expression with small groups and experienced teaching artists.",
    "sentiment": "",
    "ageRange": "4-12",
    "cost": "Check website",
    "location": "Milton Art Center, Milton",
    "url": "Check website",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "creative-arts-at-park-summer-camp-creative-arts-at-park",
    "name": "Creative Arts at Park Summer Camp",
    "provider": "Creative Arts at Park",
    "category": "arts",
    "subcategory": "visual-arts",
    "tags": [
      "visual arts",
      "performing arts",
      "sports",
      "professional instruction",
      "arts",
      "visual-arts",
      "performing-arts",
      "ages-7-15"
    ],
    "neighborhood": "brookline",
    "description": "Creative Arts at Park provides children ages 7-15 with opportunities to explore visual and performing arts and sports under the guidance of professional artists. The performance-oriented program emphasizes an integral approach to the arts and creates a spirit of cooperation, helping students discover talents and develop skills for lifelong enjoyment.",
    "sentiment": "Celebrating 45th summer in 2026 - long-standing community program",
    "ageRange": "7-15",
    "cost": "$4,250 for 5-week session (6/29-7/31) or $2,655 for 3-week session (7/13-7/31)",
    "location": "171 Goddard Ave, Brookline, MA 02445",
    "url": "https://www.creativeartsatpark.org/",
    "registrationDeadline": "December 3rd (returning families) or December 5th (new families)",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "camp-viva-camp-viva",
    "name": "Camp Viva",
    "provider": "Camp Viva",
    "category": "arts",
    "subcategory": "visual-arts",
    "tags": [
      "specialty-based",
      "electives",
      "arts",
      "sports",
      "STEAM",
      "flexible",
      "day camp",
      "multi-activity"
    ],
    "neighborhood": "braintree",
    "description": "Camp Viva empowers kids to craft their own summer week by choosing a specialty (like theater, arts, sports, or STEAM) they explore for 2 hours daily, plus selecting from over 90 electives ranging from Gaga Ball to cupcake decorating. With a flexible mix of structured activities and creative exploration, every child finds their perfect camp experience across grades K-6.",
    "sentiment": "",
    "ageRange": "5-14",
    "cost": "Check website",
    "location": "South Middle School, Braintree, MA",
    "url": "http://www.campviva.com/about-the-camp",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "code-ninjas-medfield-code-ninjas",
    "name": "Code Ninjas Medfield",
    "provider": "Code Ninjas",
    "category": "stem",
    "subcategory": "coding",
    "tags": [
      "coding",
      "game-design",
      "robotics",
      "video-editing",
      "animation",
      "cybersecurity"
    ],
    "neighborhood": "medfield",
    "description": "Code Ninjas Camps offer hands-on learning experiences for kids ages 5-14 guided by Code Senseis. Campers gain valuable tech skills through themed camps including game coding, Roblox world building, video editing, animation, robotics, and cybersecurity while making new friends in a fun, engaging environment.",
    "sentiment": "",
    "ageRange": "5-14",
    "cost": "$410-$460/week",
    "location": "Medfield",
    "url": "https://www.codeninjas.com/ma-medfield/camps",
    "registrationDeadline": "Rolling admission",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09"
    ]
  },
  {
    "id": "walpole-robotics-academy-walpole-robotics-academy",
    "name": "Walpole Robotics Academy",
    "provider": "Walpole Robotics Academy",
    "category": "stem",
    "subcategory": "engineering",
    "tags": [
      "robotics",
      "STEM",
      "coding",
      "engineering",
      "hands-on-learning",
      "summer-camp"
    ],
    "neighborhood": "walpole",
    "description": "Walpole Robotics Academy offers hands-on robotics and STEM learning with weekly themed programs designed for different age groups. Each class features age-appropriate activities that build creative problem-solving skills and confidence through engaging, interactive learning experiences. With a 4:1 counselor-to-camper ratio, students receive personalized instruction while exploring robotics concepts they can continue exploring at home.",
    "sentiment": "",
    "ageRange": "8-12",
    "cost": "Check website",
    "location": "Walpole",
    "url": "https://www.walpoleroboticsacademy.com/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "study-buddies-summer-club-kindergarten-prep-study-buddies",
    "name": "Study Buddies - Summer Club & Kindergarten Prep",
    "provider": "Study Buddies",
    "category": "stem",
    "subcategory": "humanities",
    "tags": [
      "tutoring",
      "enrichment",
      "personalized learning",
      "academic support",
      "pre-K through 12"
    ],
    "neighborhood": "walpole",
    "description": "Study Buddies provides personalized and individualized tutoring and enrichment services for students in preschool through high school. Their experienced teachers offer private tutoring and small group lessons delivered in-person at home or local libraries, or virtually online, supporting children working above, below, and at grade-level.",
    "sentiment": "I strive to help each student find the tools they need to succeed and develop a love for learning.",
    "ageRange": "5-8",
    "cost": "Check website",
    "location": "Walpole",
    "url": "https://studybuddiesma.com/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "study-buddies-preschool-learn-play-study-buddies",
    "name": "Study Buddies - Preschool Learn & Play",
    "provider": "Study Buddies",
    "category": "stem",
    "subcategory": "humanities",
    "tags": [
      "tutoring",
      "enrichment",
      "personalized learning",
      "academic support",
      "pre-K through 12"
    ],
    "neighborhood": "walpole",
    "description": "Study Buddies provides personalized and individualized tutoring and enrichment services for students in preschool through high school. Their experienced teachers offer private tutoring and small group lessons delivered in-person at home or local libraries, or virtually online, supporting children working above, below, and at grade-level.",
    "sentiment": "I strive to help each student find the tools they need to succeed and develop a love for learning.",
    "ageRange": "3-5",
    "cost": "Check website",
    "location": "Walpole",
    "url": "https://studybuddiesma.com/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "lego-stem-camp-lego-stem-camp",
    "name": "LEGO STEM Camp",
    "provider": "LEGO STEM Camp",
    "category": "stem",
    "subcategory": "coding",
    "tags": [
      "LEGO",
      "robotics",
      "coding",
      "STEM",
      "stop-motion animation",
      "Minecraft"
    ],
    "neighborhood": "walpole",
    "description": "LetGoYourMind's STEM LEGO & Robotics Summer Camp introduces children to STEM through hands-on LEGO building, coding, and animation projects. Campers construct motorized LEGO builds, program robots using drag-and-drop interfaces, create stop-motion animations, and explore Minecraft Command Generators—all while collaborating on themed challenges inspired by popular video games and characters.",
    "sentiment": "",
    "ageRange": "4-13",
    "cost": "Check website",
    "location": "Walpole",
    "url": "https://www.letgoyourmind.com/locations/ma/walpole",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03"
    ]
  },
  {
    "id": "code-ninjas-code-ninjas",
    "name": "Code Ninjas",
    "provider": "Code Ninjas",
    "category": "stem",
    "subcategory": "coding",
    "tags": [
      "coding",
      "game-design",
      "robotics",
      "3D-printing",
      "STEM",
      "video-creation"
    ],
    "neighborhood": "canton",
    "description": "Code Ninjas offers innovative summer camps where kids ages 5-14 learn game design, coding, robotics, and 3D printing guided by expert Code Senseis. Campers create their own Minecraft worlds, Roblox games, LEGO robots, and YouTube content in a fun, collaborative environment with camper showcases on the final day.",
    "sentiment": "",
    "ageRange": "5-14",
    "cost": "$279/week - $619/week",
    "location": "Canton",
    "url": "https://www.codeninjas.com/ma-canton/camps",
    "registrationDeadline": "Rolling admission",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "camp-invention-camp-invention",
    "name": "Camp Invention",
    "provider": "Camp Invention",
    "category": "stem",
    "subcategory": "engineering",
    "tags": [
      "STEM",
      "invention",
      "hands-on learning",
      "problem-solving",
      "creativity",
      "engineering"
    ],
    "neighborhood": "mansfield",
    "description": "Camp Invention is a hands-on STEM day camp for kids in grades K-6 led by qualified local educators. Campers explore four exciting new 2026 programs—Spark, The Infringers™, Fur-ensics™, Make Waves™, and Space Morphers™—featuring creative problem-solving, invention challenges, and collaborative team activities designed to spark joy and build persistence, adaptability, and confidence.",
    "sentiment": "\"My daughter came home beaming with excitement, eager to share all the amazing things she was learning. It's been beautiful to see her confidence and love for learning blossom.\" - Sonia S., Durham, NC",
    "ageRange": "6-12",
    "cost": "$285+/week or ~$9/hour. Payment plans available.",
    "location": "Mansfield",
    "url": "https://www.invent.org/programs/camp-invention",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w07"
    ]
  },
  {
    "id": "icode-of-brookline-steam-day-camp-icode",
    "name": "iCode Of Brookline STEAM Day Camp",
    "provider": "iCode",
    "category": "stem",
    "subcategory": "coding",
    "tags": [
      "coding",
      "robotics",
      "STEM",
      "summer camp",
      "Brookline MA",
      "hands-on learning"
    ],
    "neighborhood": "brookline",
    "description": "iCode STEM camps offer hands-on coding and robotics instruction during summer and school holidays. Each camp begins with Digital Citizenship training and includes a daily one-hour Personal Project Lab where students create unique projects using AI tools and coding skills.",
    "sentiment": "",
    "ageRange": "5-18",
    "cost": "Check website",
    "location": "Brookline",
    "url": "https://icodeschool.com/brookline-ma/camps/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "icode-brookline-icode",
    "name": "iCode Brookline",
    "provider": "iCode",
    "category": "stem",
    "subcategory": "coding",
    "tags": [
      "coding",
      "robotics",
      "STEM",
      "summer camp",
      "Brookline MA",
      "hands-on learning"
    ],
    "neighborhood": "brookline",
    "description": "iCode STEM camps offer hands-on coding and robotics instruction during summer and school holidays. Each camp begins with Digital Citizenship training and includes a daily one-hour Personal Project Lab where students create unique projects using AI tools and coding skills.",
    "sentiment": "",
    "ageRange": "5-16",
    "cost": "Check website",
    "location": "Brookline",
    "url": "https://icodeschool.com/brookline-ma/camps/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10",
      "w11"
    ]
  },
  {
    "id": "brookline-smartprograms-brookline-adult-education",
    "name": "Brookline SmartPrograms",
    "provider": "Brookline Adult Education",
    "category": "stem",
    "subcategory": "coding",
    "tags": [],
    "neighborhood": "brookline",
    "description": "",
    "sentiment": "",
    "ageRange": "5-13",
    "cost": "Check website",
    "location": "Brookline",
    "url": "https://brooklineadulted.org/smart-programs/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09"
    ]
  },
  {
    "id": "brains-motion-at-baker-school-brains-motion",
    "name": "Brains & Motion at Baker School",
    "provider": "Brains & Motion",
    "category": "stem",
    "subcategory": "coding",
    "tags": [
      "STEAM",
      "sports",
      "SEL",
      "enrichment",
      "summer camps",
      "after-school"
    ],
    "neighborhood": "brookline",
    "description": "Brains & Motion offers STEAM, sports, and SEL-powered programs for grades TK-8 that spark kids' lifelong love of learning. Their hands-on adventures blend STEAM activities, movement, communication, and collaboration in developmentally rich ways. Every lesson is crafted to build 21st-century competencies while supporting academic growth, emotional well-being, social development, and physical health.",
    "sentiment": "",
    "ageRange": "5-13",
    "cost": "Check website",
    "location": "Brookline",
    "url": "https://www.brains-and-motion.com/",
    "registrationDeadline": "Check website",
    "documents": [
      "Waiver"
    ],
    "weeks": [
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07"
    ]
  },
  {
    "id": "tech-revolution-lavner-camps-and-programs",
    "name": "Tech Revolution",
    "provider": "Lavner Camps and Programs",
    "category": "stem",
    "subcategory": "coding",
    "tags": [
      "STEM",
      "coding",
      "robotics",
      "tech camps",
      "game design",
      "video production"
    ],
    "neighborhood": "norwood",
    "description": "Tech Revolution offers 60+ cutting-edge weekly STEM camps featuring robotics, coding, game design, video production, digital art, and more. Students learn from passionate instructors from top universities at 50+ world-class locations including UPenn, UCLA, Rice, NYU, and Harvard.",
    "sentiment": "",
    "ageRange": "6-14",
    "cost": "Check website",
    "location": "Allston-Brighton",
    "url": "https://www.lavnercampsandprograms.com/",
    "registrationDeadline": "April 24, 2026",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08"
    ]
  },
  {
    "id": "tri-county-camps-tri-county-camps",
    "name": "Tri-County Camps",
    "provider": "Tri-County Camps",
    "category": "stem",
    "subcategory": "coding",
    "tags": [
      "vocational",
      "trades",
      "plumbing",
      "cosmetology",
      "coding",
      "middle-school"
    ],
    "neighborhood": "franklin",
    "description": "Tri-County Regional Vocational Technical High School offers summer camps for students entering grades 6-8, featuring hands-on exploration of skilled trades including plumbing, cosmetology, and computer information services. Students get to experience real vocational training in week-long sessions during July.",
    "sentiment": "",
    "ageRange": "11-14",
    "cost": "Check website",
    "location": "Franklin",
    "url": "https://www.tri-county.us/page/summer-camps",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w05",
      "w06",
      "w07"
    ]
  },
  {
    "id": "camp-invention-bellingham-memorial-school-camp-invention",
    "name": "Camp Invention-Bellingham Memorial School",
    "provider": "Camp Invention",
    "category": "stem",
    "subcategory": "engineering",
    "tags": [
      "STEM",
      "invention",
      "hands-on learning",
      "problem-solving",
      "creativity",
      "engineering"
    ],
    "neighborhood": "bellingham",
    "description": "Camp Invention is a hands-on STEM day camp for kids in grades K-6 led by qualified local educators. Campers explore four exciting new 2026 programs—Spark, The Infringers™, Fur-ensics™, Make Waves™, and Space Morphers™—featuring creative problem-solving, invention challenges, and collaborative team activities designed to spark joy and build persistence, adaptability, and confidence.",
    "sentiment": "\"My daughter came home beaming with excitement, eager to share all the amazing things she was learning. It's been beautiful to see her confidence and love for learning blossom.\" - Sonia S., Durham, NC",
    "ageRange": "5-11",
    "cost": "$285+/week or ~$9/hour. Payment plans available.",
    "location": "Bellingham",
    "url": "https://www.invent.org/programs/camp-invention",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01"
    ]
  },
  {
    "id": "children-across-america-children-across-america",
    "name": "Children Across America",
    "provider": "Children Across America",
    "category": "stem",
    "subcategory": "coding",
    "tags": [
      "STEM",
      "coding",
      "free",
      "summer",
      "hands-on learning",
      "creative"
    ],
    "neighborhood": "milford",
    "description": "Children Across America offers free STEM and STREAM programs including Girls Love to Code for grades K-5, Saturday STREAM Club during the school year, and Summer STREAM Club with hands-on activities in science, technology, reading, engineering, arts, and math. Programs run at locations in Milford and Brockton/Bridgewater with interactive learning that fosters problem-solving and teamwork skills.",
    "sentiment": "My son was failing second grade. He was getting Ds and Fs in reading and math as English is not our first language. I took him to Children Across America's Summer STREAM Club and he loved it. He started understanding English and math while having fun. The new school year, he is getting Bs in both subjects and is no longer in ELL. Now he wants to be a teacher. Thank you so much for all you did and you never asked me for anything. You changed my sons life.",
    "ageRange": "5-11",
    "cost": "Free",
    "location": "Milford",
    "url": "https://childrenacrossamerica.org/programs/education-programs/",
    "registrationDeadline": "Rolling admission",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "id-tech-camps-held-at-curry-college-id-tech",
    "name": "iD Tech Camps Held at Curry College",
    "provider": "iD Tech",
    "category": "stem",
    "subcategory": "coding",
    "tags": [
      "technology",
      "STEM",
      "coding",
      "summer 2026"
    ],
    "neighborhood": "milton",
    "description": "Children explore and master new STEM skills on a prestigious campus, joining a community of over 600,000 alumni using tech skills to accomplish big things.",
    "sentiment": "",
    "ageRange": "6-18",
    "cost": "Check website",
    "location": "Curry College, Milton",
    "url": "Check website",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "simple-motorized-lego-builds-letgoyourmind",
    "name": "Simple motorized LEGO builds",
    "provider": "LetGoYourMind",
    "category": "stem",
    "subcategory": "coding",
    "tags": [
      "LEGO",
      "robotics",
      "motorized builds",
      "STEM",
      "coding",
      "animation",
      "engineering"
    ],
    "neighborhood": "westwood",
    "description": "Students explore STEM through motorized LEGO builds, coding, and stop-motion animation. Young campers (ages 4-5) construct cartoon-inspired creations with motors and gears, while older students (ages 6-13) engage in video game-themed challenges, program EV3 robots, and produce professional stop-motion films.",
    "sentiment": "",
    "ageRange": "4-5",
    "cost": "Check website",
    "location": "Xaverian Brothers High School, Westwood",
    "url": "https://www.letgoyourmind.com/locations/ma/westwood",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "game-on-lego-building-coding-and-stop-motion-animation-letgo",
    "name": "Game On: LEGO building, coding, and stop motion animation",
    "provider": "LetGoYourMind",
    "category": "stem",
    "subcategory": "coding",
    "tags": [
      "LEGO",
      "coding",
      "stop motion",
      "animation",
      "robotics",
      "STEM",
      "engineering"
    ],
    "neighborhood": "westwood",
    "description": "Students explore STEM through motorized LEGO builds, coding, and stop-motion animation. Young campers (ages 4-5) construct cartoon-inspired creations with motors and gears, while older students (ages 6-13) engage in video game-themed challenges, program EV3 robots, and produce professional stop-motion films.",
    "sentiment": "",
    "ageRange": "6-8",
    "cost": "Check website",
    "location": "Xaverian Brothers High School, Westwood",
    "url": "https://www.letgoyourmind.com/locations/ma/westwood",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "ready-set-game-lego-building-coding-and-stop-motion-animatio",
    "name": "Ready, Set, Game: LEGO building, coding, and stop motion animation",
    "provider": "LetGoYourMind",
    "category": "stem",
    "subcategory": "coding",
    "tags": [
      "LEGO",
      "coding",
      "stop motion",
      "animation",
      "robotics",
      "STEM",
      "engineering"
    ],
    "neighborhood": "westwood",
    "description": "Students explore STEM through motorized LEGO builds, coding, and stop-motion animation. Young campers (ages 4-5) construct cartoon-inspired creations with motors and gears, while older students (ages 6-13) engage in video game-themed challenges, program EV3 robots, and produce professional stop-motion films.",
    "sentiment": "",
    "ageRange": "6-8",
    "cost": "Check website",
    "location": "Xaverian Brothers High School, Westwood",
    "url": "https://www.letgoyourmind.com/locations/ma/westwood",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "ready-player-one-lego-robotics-stop-motion-animation-and-min",
    "name": "Ready Player One: LEGO robotics, stop motion animation, and Minecraft",
    "provider": "LetGoYourMind",
    "category": "stem",
    "subcategory": "coding",
    "tags": [
      "LEGO",
      "robotics",
      "MINDSTORMS",
      "Minecraft",
      "stop motion",
      "coding",
      "STEM",
      "animation"
    ],
    "neighborhood": "westwood",
    "description": "Students explore STEM through motorized LEGO builds, coding, and stop-motion animation. Young campers (ages 4-5) construct cartoon-inspired creations with motors and gears, while older students (ages 6-13) engage in video game-themed challenges, program EV3 robots, and produce professional stop-motion films.",
    "sentiment": "",
    "ageRange": "9-13",
    "cost": "Check website",
    "location": "Xaverian Brothers High School, Westwood",
    "url": "https://www.letgoyourmind.com/locations/ma/westwood",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "level-up-player-lego-robotics-stop-motion-animation-and-mine",
    "name": "Level Up Player: LEGO robotics, stop motion animation, and Minecraft",
    "provider": "LetGoYourMind",
    "category": "stem",
    "subcategory": "coding",
    "tags": [
      "LEGO",
      "robotics",
      "MINDSTORMS",
      "Minecraft",
      "stop motion",
      "coding",
      "STEM",
      "animation"
    ],
    "neighborhood": "westwood",
    "description": "Students explore STEM through motorized LEGO builds, coding, and stop-motion animation. Young campers (ages 4-5) construct cartoon-inspired creations with motors and gears, while older students (ages 6-13) engage in video game-themed challenges, program EV3 robots, and produce professional stop-motion films.",
    "sentiment": "",
    "ageRange": "9-13",
    "cost": "Check website",
    "location": "Xaverian Brothers High School, Westwood",
    "url": "https://www.letgoyourmind.com/locations/ma/westwood",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "snapology-robotics-stem-summer-camps-snapology",
    "name": "Snapology Robotics & STEM Summer Camps",
    "provider": "Snapology",
    "category": "stem",
    "subcategory": "coding",
    "tags": [
      "robotics",
      "LEGO",
      "programming",
      "engineering",
      "hands-on learning",
      "coding",
      "STEM",
      "STEAM"
    ],
    "neighborhood": "westwood",
    "description": "Snapology offers weekly STEM/STEAM summer camps using LEGO® bricks, K'Nex, and technology where kids build robots, create stop-motion movies, design video games, and explore coding and robotics. Children engage in hands-on projects across robotics, technology & coding, STEAM/STEM, and themed science camps, developing problem-solving skills and creativity through playful learning.",
    "sentiment": "",
    "ageRange": "5-12",
    "cost": "Check website",
    "location": "Westwood, MA",
    "url": "https://www.snapology.com/massachusetts-westwood/camps/",
    "registrationDeadline": "Rolling admission",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "snapology-technology-coding-camps-snapology",
    "name": "Snapology Technology & Coding Camps",
    "provider": "Snapology",
    "category": "stem",
    "subcategory": "coding",
    "tags": [
      "coding",
      "technology",
      "video game design",
      "stop motion",
      "programming",
      "robotics",
      "STEM",
      "STEAM"
    ],
    "neighborhood": "westwood",
    "description": "Snapology offers weekly STEM/STEAM summer camps using LEGO® bricks, K'Nex, and technology where kids build robots, create stop-motion movies, design video games, and explore coding and robotics. Children engage in hands-on projects across robotics, technology & coding, STEAM/STEM, and themed science camps, developing problem-solving skills and creativity through playful learning.",
    "sentiment": "",
    "ageRange": "5-12",
    "cost": "Check website",
    "location": "Westwood, MA",
    "url": "https://www.snapology.com/massachusetts-westwood/camps/",
    "registrationDeadline": "Rolling admission",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "snapology-themed-science-camps-snapology",
    "name": "Snapology Themed Science Camps",
    "provider": "Snapology",
    "category": "stem",
    "subcategory": "coding",
    "tags": [
      "science",
      "themed activities",
      "character-based learning",
      "creative play",
      "robotics",
      "coding",
      "STEM",
      "STEAM"
    ],
    "neighborhood": "westwood",
    "description": "Snapology offers weekly STEM/STEAM summer camps using LEGO® bricks, K'Nex, and technology where kids build robots, create stop-motion movies, design video games, and explore coding and robotics. Children engage in hands-on projects across robotics, technology & coding, STEAM/STEM, and themed science camps, developing problem-solving skills and creativity through playful learning.",
    "sentiment": "",
    "ageRange": "5-12",
    "cost": "Check website",
    "location": "Westwood, MA",
    "url": "https://www.snapology.com/massachusetts-westwood/camps/",
    "registrationDeadline": "Rolling admission",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "snapology-one-day-steam-workshops-snapology",
    "name": "Snapology One-Day STEAM Workshops",
    "provider": "Snapology",
    "category": "stem",
    "subcategory": "coding",
    "tags": [
      "workshops",
      "STEAM",
      "hands-on learning",
      "holiday programs",
      "teacher workshop days",
      "robotics",
      "coding",
      "STEM"
    ],
    "neighborhood": "westwood",
    "description": "Snapology offers weekly STEM/STEAM summer camps using LEGO® bricks, K'Nex, and technology where kids build robots, create stop-motion movies, design video games, and explore coding and robotics. Children engage in hands-on projects across robotics, technology & coding, STEAM/STEM, and themed science camps, developing problem-solving skills and creativity through playful learning.",
    "sentiment": "",
    "ageRange": "5-12",
    "cost": "Check website",
    "location": "Westwood, MA",
    "url": "https://www.snapology.com/massachusetts-westwood/camps/",
    "registrationDeadline": "Rolling admission",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "walpole-robotics-academy-summer-camp-walpole-robotics-academ",
    "name": "Walpole Robotics Academy Summer Camp",
    "provider": "Walpole Robotics Academy",
    "category": "stem",
    "subcategory": "engineering",
    "tags": [
      "robotics",
      "STEM",
      "programming",
      "Lego",
      "building",
      "summer camp"
    ],
    "neighborhood": "walpole",
    "description": "At WRA Summer Camps, kids ages 8-12 unleash their creativity and learn new STEM skills by building amazing robots with Lego that bring their imagination to life. The program provides immersive, focused curriculum to help children develop skills in building and programming robots.",
    "sentiment": "",
    "ageRange": "8-12",
    "cost": "$515.00/week",
    "location": "Walpole Robotics Academy, Walpole",
    "url": "https://www.walpoleroboticsacademy.com/programs-1",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "walpole-robotics-academy-weekly-classes-walpole-robotics-aca",
    "name": "Walpole Robotics Academy Weekly Classes",
    "provider": "Walpole Robotics Academy",
    "category": "stem",
    "subcategory": "engineering",
    "tags": [
      "robotics",
      "STEM",
      "programming",
      "Lego",
      "building",
      "classes",
      "summer camp"
    ],
    "neighborhood": "walpole",
    "description": "At WRA Summer Camps, kids ages 8-12 unleash their creativity and learn new STEM skills by building amazing robots with Lego that bring their imagination to life. The program provides immersive, focused curriculum to help children develop skills in building and programming robots.",
    "sentiment": "",
    "ageRange": "6-12",
    "cost": "$515.00/week",
    "location": "Walpole Robotics Academy, Walpole",
    "url": "https://www.walpoleroboticsacademy.com/programs-1",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "puddlestompers-drop-off-summer-camp-town-of-needham-communit",
    "name": "Puddlestompers Drop-Off Summer Camp",
    "provider": "Town of Needham - Community Programming",
    "category": "stem",
    "subcategory": "natural-sciences",
    "tags": [
      "nature exploration",
      "hands-on learning",
      "STEM activities",
      "outdoor education",
      "local trails",
      "habitats",
      "pollinators",
      "aquatic life"
    ],
    "neighborhood": "needham",
    "description": "Puddlestompers Nature Exploration is a weekly day camp where children explore and learn about the natural world guided by experienced teacher-naturalists. Campers discover exciting nature-based topics through hands-on exploration and STEM-based activities, including habitats along forest floors, pollinators in meadows, and aquatic life in local streams and ponds.",
    "sentiment": "\"It's Just So Good To Be Outside!\"",
    "ageRange": "3-7",
    "cost": "$508-$635/week",
    "location": "Mitchell School, Needham",
    "url": "https://needhamprograms.myrec.com/info/activities/program_details.aspx?ProgramID=30341",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "maplewood-day-camp-maplewood-day-camp",
    "name": "Maplewood Day Camp",
    "provider": "Maplewood Day Camp",
    "category": "adventure",
    "subcategory": "nature-study",
    "tags": [
      "swim-focused",
      "multi-sport",
      "arts-and-drama",
      "nature-immersion",
      "all-ages",
      "professional-staff"
    ],
    "neighborhood": "easton",
    "description": "Maplewood Country Day Camp offers programs for ages 3-14 with a focus on immersing children in nature, building friendships, and creating unforgettable memories. With a 3:1 child-to-counselor ratio and educators leading camp groups, campers enjoy twice-daily swim lessons in heated Olympic pools, Club Day electives, and structured activities from sports to arts and drama. The camp emphasizes personal growth, adventure, and individual attention in a nurturing environment.",
    "sentiment": "When we saw Lucy jump into the deep end and comfortably swim with friends in the deep end all weekend, there were literally tears of joy and gratitude. We're truly appreciative of her swim instructor, Rachel.",
    "ageRange": "3-14",
    "cost": "Check website",
    "location": "Easton",
    "url": "https://www.maplewoodyearround.com/summer-camp",
    "registrationDeadline": "Check website",
    "documents": [
      "Camper Application Form"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "farmer-forester-chef-the-trustees",
    "name": "Farmer, Forester, Chef!",
    "provider": "The Trustees",
    "category": "adventure",
    "subcategory": "nature-study",
    "tags": [
      "farm",
      "nature",
      "cooking",
      "outdoor",
      "animals",
      "ages 6-14"
    ],
    "neighborhood": "dover",
    "description": "Campers become farmers, foresters, and chefs at this 109-acre working farm in Dover. They participate in farm activities like composting and harvesting, care for livestock, prepare farm-fresh recipes in a teaching kitchen, and explore nature trails at Powisset Farm and neighboring Noanet Woodlands.",
    "sentiment": "",
    "ageRange": "6-14",
    "cost": "$625/week (Trustees Member) or $705/week (Nonmember)",
    "location": "Dover",
    "url": "https://thetrustees.org/program/farmer-forester-chef/",
    "registrationDeadline": "Rolling admission",
    "documents": [
      "Annual physical and immunization forms",
      "Emergency and pick up contact info",
      "Camper insurance policy and doctor contact"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08"
    ]
  },
  {
    "id": "hale-education-day-camp-hale-education",
    "name": "Hale Education Day Camp",
    "provider": "Hale Education",
    "category": "adventure",
    "subcategory": "nature-study",
    "tags": [
      "day camp",
      "outdoor learning",
      "multi-activity",
      "swimming",
      "adventure",
      "nature"
    ],
    "neighborhood": "westwood",
    "description": "Hale Education Day Camp is a signature day camp experience starting at age 4 that includes classic activities like swimming, boating, archery, arts and crafts, and field games. The camp offers multiple program options including Hale Day Camp, Adventure Camp, and Mountain Biking Camp across different age groups. Open enrollment begins November 1 and sessions fill quickly.",
    "sentiment": "",
    "ageRange": "4-15",
    "cost": "Check website",
    "location": "Westwood",
    "url": "https://hale.education/programs/",
    "registrationDeadline": "Rolling admission",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09"
    ]
  },
  {
    "id": "norfolk-aggie-norfolk-aggie",
    "name": "Norfolk Aggie",
    "provider": "Norfolk Aggie",
    "category": "adventure",
    "subcategory": "nature-study",
    "tags": [],
    "neighborhood": "walpole",
    "description": "",
    "sentiment": "",
    "ageRange": "7-13",
    "cost": "Check website",
    "location": "Walpole",
    "url": "https://docs.google.com/document/d/1rWCV8nVPYnd3UUU5q6GYkTU3wES55jdBE32fbKTiJBI/edit?tab=t.0",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w03",
      "w04"
    ]
  },
  {
    "id": "st-gerard-kids-camp-st-gerard",
    "name": "St. Gerard Kids Camp",
    "provider": "St. Gerard",
    "category": "adventure",
    "subcategory": "nature-study",
    "tags": [
      "day camp",
      "multi-sport",
      "arts and crafts",
      "water games",
      "family activities",
      "parish-based"
    ],
    "neighborhood": "canton",
    "description": "Kids Camp is a week full of fun activities including sports, water games, and arts and crafts during the day, plus evening family activities. Celebrating its 37th year, the camp offers campers an exciting experience with themed programming and community engagement.",
    "sentiment": "",
    "ageRange": "5-12",
    "cost": "Check website",
    "location": "Canton",
    "url": "https://www.cantoncatholic.org/kids-camp",
    "registrationDeadline": "June 8, 2026",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w04"
    ]
  },
  {
    "id": "moose-hill-mass-audubon",
    "name": "Moose Hill",
    "provider": "Mass Audubon",
    "category": "adventure",
    "subcategory": "nature-study",
    "tags": [
      "nature-study",
      "outdoor-exploration",
      "multi-age",
      "wildlife",
      "hands-on-learning",
      "sanctuary-based"
    ],
    "neighborhood": "sharon",
    "description": "Campers ages 4.5–16 get outdoors and learn about nature through trail explorations, hands-on activities, themed games, and more. During each weekly session, campers explore the sanctuary, have free choice time, catch insects in the camp yard, experiment with science, dabble in art, and venture to new places.",
    "sentiment": "Our kids love Moose Hill Camp! It has been especially good for them to get out of the house. Thank you for making all the kids feel welcome and like they fit right in!",
    "ageRange": "5-16",
    "cost": "Check website",
    "location": "Sharon",
    "url": "https://www.massaudubon.org/places-to-explore/wildlife-sanctuaries/moose-hill/camp",
    "registrationDeadline": "January 14, 2026",
    "documents": [
      "Health form"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09"
    ]
  },
  {
    "id": "everwood-day-everwood-day-camp",
    "name": "Everwood Day",
    "provider": "Everwood Day Camp",
    "category": "adventure",
    "subcategory": "nature-study",
    "tags": [
      "day camp",
      "multi-activity",
      "ages 4-15",
      "Sharon MA",
      "waterfront",
      "adventure"
    ],
    "neighborhood": "sharon",
    "description": "Everwood Day Camp offers a progressive program for ages 4-15 with activities spanning athletics, arts, STEAM, waterfront instruction, and outdoor adventure. Campers build lifelong friendships while developing social-emotional skills through the camp's Five Star Points: friendship, independence, integrity, inspiration, and teamwork.",
    "sentiment": "My son couldn't wait to get back! My son attended Everwood for the entire 9 weeks, even though I had originally signed him up for 5!",
    "ageRange": "3-10",
    "cost": "Check website",
    "location": "Sharon",
    "url": "https://everwooddaycamp.com/?gclid=CjwKCAjw5_GmBhBIEiwA5QSMxI4lvW05Tpl8LZfgRMfkD7eMWbP0CPEW13pUaLU_Rw5xzFw2z5lTgRoCkZ0QAvD_BwE",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08"
    ]
  },
  {
    "id": "stoughton-extended-day-stoughton-extended-day",
    "name": "Stoughton Extended Day",
    "provider": "Stoughton Extended Day",
    "category": "adventure",
    "subcategory": "nature-study",
    "tags": [
      "summer camp",
      "field trips",
      "grades K-8",
      "flexible schedule",
      "arts and recreation",
      "outdoor activities"
    ],
    "neighborhood": "stoughton",
    "description": "Stoughton Extended Day's Summer Camp 2026 serves children entering grades K-8 with a flexible schedule where families select their own days. The all-inclusive program runs 7:30am-6:00pm and features daily field trips throughout eastern Massachusetts to destinations like zoos, aquariums, parks, and museums, plus on-site activities including art projects, games, sports, music, and dancing.",
    "sentiment": "",
    "ageRange": "5-8",
    "cost": "Check website",
    "location": "Stoughton",
    "url": "https://www.stoughtonextendedday.org/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "kidsports-kidsports",
    "name": "Kidsports",
    "provider": "Kidsports",
    "category": "adventure",
    "subcategory": "nature-study",
    "tags": [
      "multi-sport",
      "indoor-play",
      "field-trips",
      "arts",
      "swimming",
      "ages-5-14"
    ],
    "neighborhood": "stoughton",
    "description": "Kidsports Summer Program offers 11 weeks of dynamic activities for kids ages 5-14, featuring active play, artistic pursuits, indoor and outdoor adventures, swimming, dancing, and field trips to destinations like Legoland, Museum of Science, and local farms. Kids enjoy a mix of physical activities, creative learning, and exploration in a state-licensed facility.",
    "sentiment": "",
    "ageRange": "2-14",
    "cost": "Check website",
    "location": "Stoughton",
    "url": "https://kidsportsfun.com/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "stoughton-ymca-old-colony-ymca",
    "name": "Stoughton YMCA",
    "provider": "Old Colony YMCA",
    "category": "adventure",
    "subcategory": "outdoor-survival",
    "tags": [
      "ropes-course",
      "swimming",
      "archery",
      "sports",
      "arts-crafts",
      "outdoor-adventure"
    ],
    "neighborhood": "stoughton",
    "description": "Camp Christina blends outdoor adventure, creativity, and classic Y fun with an outdoor pool, splash park, arts and crafts, sports, and environmental exploration. Campers experience high and low ropes courses, swimming, archery, and hands-on activities designed to build confidence, teamwork, and summer memories in a supportive environment.",
    "sentiment": "",
    "ageRange": "4-10",
    "cost": "$345/week for members, $415/week for non-members",
    "location": "Stoughton",
    "url": "https://www.oldcolonyymca.org/child-care-camps/camps/camp-christina",
    "registrationDeadline": "Check website",
    "documents": [
      "Family Handbook",
      "Safety Plan"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09"
    ]
  },
  {
    "id": "camp-west-woods-camp-west-woods",
    "name": "Camp West Woods",
    "provider": "Camp West Woods",
    "category": "adventure",
    "subcategory": "nature-study",
    "tags": [
      "multi-sport",
      "arts",
      "nature",
      "swimming",
      "team-building",
      "day-camp"
    ],
    "neighborhood": "stoughton",
    "description": "Camp West Woods offers an unforgettable summer experience on 10 beautiful acres in Stoughton, MA, with eight 40-minute activity periods daily including swim instruction, free swim, lunch, and rotating workshops. Campers participate in sports, creative arts, nature exploration, and team-building games, with special theme weeks and guest speakers designed to build skills, self-esteem, and respect for others.",
    "sentiment": "",
    "ageRange": "4-7",
    "cost": "Check website",
    "location": "Stoughton",
    "url": "https://www.campwestwoods.com/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09"
    ]
  },
  {
    "id": "extended-arms-south-shore-stars",
    "name": "Extended Arms",
    "provider": "South Shore Stars",
    "category": "adventure",
    "subcategory": "nature-study",
    "tags": [
      "summer camp",
      "day camp",
      "grades 1-6",
      "outdoor adventure",
      "arts and crafts",
      "multi-activity"
    ],
    "neighborhood": "randolph",
    "description": "Stars Summer Programs and Day Camp offer children entering grades 1-6 days filled with outdoor adventure, creativity, and hands-on learning. Campers participate in athletics, arts and crafts, nature exploration, swimming, and weekly themed experiences that spark imagination and curiosity. With opportunities to stay active, try new things, and build confidence, every day offers something exciting to discover.",
    "sentiment": "",
    "ageRange": "5-6",
    "cost": "Check website",
    "location": "Randolph",
    "url": "https://southshorestars.org/programs/summer/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09"
    ]
  },
  {
    "id": "norton-ninja-s-summer-camp-usa-ninja-challenge",
    "name": "Norton Ninja's Summer Camp",
    "provider": "USA Ninja Challenge",
    "category": "adventure",
    "subcategory": "high-adrenaline",
    "tags": [
      "ninja",
      "obstacle course",
      "fitness",
      "summer camp",
      "ages 5+",
      "skill-building"
    ],
    "neighborhood": "norwood",
    "description": "Norton Ninja's Summer Camp offers an exciting week of ninja training and obstacle course challenges for kids. Participants develop strength, agility, and coordination while learning ninja techniques in a fun, supportive environment. The camp runs daily from 9:00 AM to 2:30 PM at USA Ninja Challenge Norton.",
    "sentiment": "",
    "ageRange": "6-15",
    "cost": "Check website",
    "location": "Norton",
    "url": "https://portal.iclasspro.com/usaninjanorton/camps/1?sortBy=time?KKFC",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w08"
    ]
  },
  {
    "id": "summer-playground-wrentham-recreation-department",
    "name": "Summer Playground",
    "provider": "Wrentham Recreation Department",
    "category": "adventure",
    "subcategory": "nature-study",
    "tags": [
      "summer camp",
      "playground",
      "recreation",
      "K-8",
      "full-day",
      "half-day option"
    ],
    "neighborhood": "wrentham",
    "description": "Summer Playground is a full-day camp running Monday through Friday from 9am-3pm (with half-day option 9am-12pm) for children in kindergarten through 8th grade. The program offers a variety of recreational activities and play-based learning opportunities throughout the summer.",
    "sentiment": "",
    "ageRange": "5-13",
    "cost": "Check website",
    "location": "Wrentham",
    "url": "https://wrenthamma.myrec.com/info/default.aspx",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09"
    ]
  },
  {
    "id": "sports-camps-wrentham-recreation-department",
    "name": "Sports Camps",
    "provider": "Wrentham Recreation Department",
    "category": "adventure",
    "subcategory": "nature-study",
    "tags": [
      "summer camp",
      "playground",
      "recreation",
      "K-8",
      "full-day",
      "half-day option"
    ],
    "neighborhood": "wrentham",
    "description": "Summer Playground is a full-day camp running Monday through Friday from 9am-3pm (with half-day option 9am-12pm) for children in kindergarten through 8th grade. The program offers a variety of recreational activities and play-based learning opportunities throughout the summer.",
    "sentiment": "",
    "ageRange": "7-13",
    "cost": "Check website",
    "location": "Wrentham",
    "url": "https://wrenthamma.myrec.com/info/default.aspx",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w02",
      "w07"
    ]
  },
  {
    "id": "stony-brook-wildlife-sanctuary-nature-camp-mass-audubon",
    "name": "Stony Brook Wildlife Sanctuary Nature Camp",
    "provider": "Mass Audubon",
    "category": "adventure",
    "subcategory": "nature-study",
    "tags": [
      "nature",
      "outdoor education",
      "wildlife",
      "day camp",
      "nature exploration"
    ],
    "neighborhood": "norfolk",
    "description": "Children discover local habitats, connect with nature, and develop friendships through outdoor exploration. Each day, campers spend time outdoors discovering the natural world, meet new friends, play noncompetitive games and have fun. A tradition of nature education for ages 4-17 since 1956.",
    "sentiment": "",
    "ageRange": "4-15",
    "cost": "Check website",
    "location": "Norfolk",
    "url": "https://www.massaudubon.org/programs-events/nature-camps",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09"
    ]
  },
  {
    "id": "summer-playground-wrentham-recreation",
    "name": "Summer Playground",
    "provider": "Wrentham Recreation",
    "category": "adventure",
    "subcategory": "nature-study",
    "tags": [
      "summer camp",
      "playground",
      "recreation",
      "K-8",
      "full-day",
      "half-day option"
    ],
    "neighborhood": "wrentham",
    "description": "Summer Playground is a full-day camp running Monday through Friday from 9am-3pm (with half-day option 9am-12pm) for children in kindergarten through 8th grade. The program offers a variety of recreational activities and play-based learning opportunities throughout the summer.",
    "sentiment": "",
    "ageRange": "5-13",
    "cost": "Check website",
    "location": "Wrentham",
    "url": "https://wrenthamma.myrec.com/info/default.aspx",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09"
    ]
  },
  {
    "id": "sports-camps-wrentham-recreation",
    "name": "Sports Camps",
    "provider": "Wrentham Recreation",
    "category": "adventure",
    "subcategory": "nature-study",
    "tags": [
      "summer camp",
      "playground",
      "recreation",
      "K-8",
      "full-day",
      "half-day option"
    ],
    "neighborhood": "wrentham",
    "description": "Summer Playground is a full-day camp running Monday through Friday from 9am-3pm (with half-day option 9am-12pm) for children in kindergarten through 8th grade. The program offers a variety of recreational activities and play-based learning opportunities throughout the summer.",
    "sentiment": "",
    "ageRange": "7-13",
    "cost": "Check website",
    "location": "Wrentham",
    "url": "https://wrenthamma.myrec.com/info/default.aspx",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w02",
      "w07"
    ]
  },
  {
    "id": "stony-brook-wildlife-sanctuary-nature-camp-massachusetts-aud",
    "name": "Stony Brook Wildlife Sanctuary Nature Camp",
    "provider": "Massachusetts Audubon Society",
    "category": "adventure",
    "subcategory": "nature-study",
    "tags": [
      "nature",
      "outdoor education",
      "wildlife",
      "day camp",
      "nature exploration"
    ],
    "neighborhood": "norfolk",
    "description": "Children discover local habitats, connect with nature, and develop friendships through outdoor exploration. Each day, campers spend time outdoors discovering the natural world, meet new friends, play noncompetitive games and have fun. A tradition of nature education for ages 4-17 since 1956.",
    "sentiment": "",
    "ageRange": "4-15",
    "cost": "Check website",
    "location": "Norfolk",
    "url": "https://www.massaudubon.org/programs-events/nature-camps",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09"
    ]
  },
  {
    "id": "rock-spot-climbing-rock-spot-climbing",
    "name": "Rock Spot Climbing",
    "provider": "Rock Spot Climbing",
    "category": "adventure",
    "subcategory": "nature-study",
    "tags": [
      "climbing",
      "indoor-sports",
      "youth-programs",
      "skill-building",
      "adventure",
      "fitness"
    ],
    "neighborhood": "brookline",
    "description": "Rock Spot Climbing offers youth vacation programs at their Brookline location featuring indoor climbing with over 1,000 boulder problems, fully adjustable training boards, and auto belay stations. New climbers receive guided orientations to feel confident before starting, with professional staff instruction available.",
    "sentiment": "",
    "ageRange": "6-18",
    "cost": "Check website",
    "location": "Brookline",
    "url": "https://brookline.rockspotclimbing.com/youth/vacation-programs/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "allandale-farm-allandale-farm",
    "name": "Allandale Farm",
    "provider": "Allandale Farm",
    "category": "adventure",
    "subcategory": "nature-study",
    "tags": [
      "farm",
      "nature-study",
      "gardening",
      "outdoor-learning",
      "ages-4-12",
      "boston"
    ],
    "neighborhood": "brookline",
    "description": "Allandale Farm's Outdoor Summer Program gives children ages 4-12 comprehensive exposure to outdoor fun and learning on a working farm. The program focuses on gardening, composting, bird and plant identification, walking, farm animals and outdoor games in the natural environment of the farm. Both regular and extended day programs are available.",
    "sentiment": "",
    "ageRange": "4-12",
    "cost": "Check website",
    "location": "Brookline",
    "url": "https://allandalefarm.com/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07"
    ]
  },
  {
    "id": "creativentures-collective-creativentures-collective",
    "name": "CreatiVentures Collective",
    "provider": "CreatiVentures Collective",
    "category": "adventure",
    "subcategory": "nature-study",
    "tags": [
      "inclusive",
      "neuro-affirming",
      "outdoor-nature",
      "arts-based",
      "special-needs",
      "adaptive"
    ],
    "neighborhood": "brookline",
    "description": "CreatiVentures Collective is an inclusive, neuro-affirming summer program offering child-centered outdoor adventures and creative activities at Harry Downs Playground and the Arnold Arboretum in Jamaica Plain. The program uses universal design principles, adaptive strategies, and multi-sensory learning to ensure all campers can meaningfully participate in nature exploration, arts integration, and social-emotional skill building.",
    "sentiment": "My child is neuro-quirky and use non-verbal communication? Can they attend? YES! YES! YES! We use UDL and adaptive learning models.",
    "ageRange": "4-10",
    "cost": "Check website",
    "location": "Brookline",
    "url": "https://learnersatthecenter.weebly.com/creativenturescollective.html",
    "registrationDeadline": "March 31, 2026",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "east-coast-divers-east-coast-divers",
    "name": "East Coast Divers",
    "provider": "East Coast Divers",
    "category": "adventure",
    "subcategory": "nature-study",
    "tags": [
      "scuba",
      "water-sports",
      "certification",
      "kids",
      "diving",
      "open-water"
    ],
    "neighborhood": "brookline",
    "description": "Kids Week is a week-long Open Water Referral Diver course combining classroom learning and hands-on pool training at MIT Alumni Pool. Students learn dive safety, equipment use, physics of diving, marine environment education, and master underwater movement and buoyancy control, earning Referral Diver certification upon completion.",
    "sentiment": "Our course is staffed by scuba instructors who are passionate about and experienced working with kids. Students, instructors we send referrals to and dive operators consistently praise the skill level and comfort of the open water divers we've trained.",
    "ageRange": "10-18",
    "cost": "$825/week plus $100 (SSI) or $251 (PADI) for online materials",
    "location": "Brookline",
    "url": "https://ecdivers.com/ecd_class/scuba-camp-pool-classroom",
    "registrationDeadline": "Check website",
    "documents": [
      "Diver Medical Statement Participant Questionnaire"
    ],
    "weeks": [
      "w01"
    ]
  },
  {
    "id": "adirondack-club-adirondack-club",
    "name": "Adirondack Club",
    "provider": "Adirondack Club",
    "category": "adventure",
    "subcategory": "nature-study",
    "tags": [
      "multi-sport",
      "adventure",
      "arts",
      "summer camp",
      "flexible weeks",
      "age groups"
    ],
    "neighborhood": "franklin",
    "description": "The Adirondack Club offers award-winning summer camps including Adventure Camp, Sports Camp, and Arts Camp designed to match each camper's passions and interests. Children explore, grow, and thrive in safe and energetic environments with flexible week-long sessions throughout the summer.",
    "sentiment": "",
    "ageRange": "3-13",
    "cost": "Check website",
    "location": "Franklin",
    "url": "https://www.adirondackclub.com/camps",
    "registrationDeadline": "Rolling admission",
    "documents": [
      "Waiver",
      "Medication Waiver"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09"
    ]
  },
  {
    "id": "franklin-recreation-franklin-recreation",
    "name": "Franklin Recreation",
    "provider": "Franklin Recreation",
    "category": "adventure",
    "subcategory": "nature-study",
    "tags": [
      "summer camp",
      "Franklin MA",
      "recreation",
      "youth programs"
    ],
    "neighborhood": "franklin",
    "description": "Franklin Recreation offers summer camp programs for residents. The department provides quality recreational programs and facilities, with camps detailed in their Summer Camps Brochure 2026.",
    "sentiment": "",
    "ageRange": "2-14",
    "cost": "Check website",
    "location": "Franklin",
    "url": "https://www.franklinma.gov/331/Recreation",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09"
    ]
  },
  {
    "id": "franklin-country-day-camp-franklin-country-day-camp",
    "name": "Franklin Country Day Camp",
    "provider": "Franklin Country Day Camp",
    "category": "adventure",
    "subcategory": "nature-study",
    "tags": [
      "day camp",
      "multi-activity",
      "outdoor",
      "arts",
      "adventure",
      "water activities"
    ],
    "neighborhood": "franklin",
    "description": "Franklin Country Day Camp offers campers 250 acres of trailed forest, vast fields, and natural water features with activities including archery, boating, swimming, theater arts, woodworking, ceramics, and creative music. The camp provides a positive environment where children engage in well-planned programs without cell phones and gaming devices, fostering self-worth, friendships, and outdoor appreciation.",
    "sentiment": "",
    "ageRange": "4-12",
    "cost": "Check website",
    "location": "Franklin",
    "url": "http://www.franklincountrydaycamp.com/",
    "registrationDeadline": "Rolling admission",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08"
    ]
  },
  {
    "id": "night-owl-farm-night-owl-farm",
    "name": "Night Owl Farm",
    "provider": "Night Owl Farm",
    "category": "adventure",
    "subcategory": "nature-study",
    "tags": [
      "farm",
      "kids-programs",
      "nature",
      "agriculture",
      "outdoor",
      "educational"
    ],
    "neighborhood": "franklin",
    "description": "Check website",
    "sentiment": "",
    "ageRange": "3-9",
    "cost": "Check website",
    "location": "Franklin",
    "url": "https://night-owl-farm.square.site/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09"
    ]
  },
  {
    "id": "strive-ninja-fitness-strive-ninja-fitness",
    "name": "Strive Ninja Fitness",
    "provider": "Strive Ninja Fitness",
    "category": "adventure",
    "subcategory": "high-adrenaline",
    "tags": [
      "ninja",
      "obstacle-course",
      "summer-camp",
      "games",
      "fitness",
      "weekday-program"
    ],
    "neighborhood": "franklin",
    "description": "Kids ages 5-12 enjoy 3.5 hours of ninja skills, games, and challenges with new obstacles each week including Warped Wall knockout, Domino School, Floor is Lava, Hide-n-seek, Messy Backyard, and craft time. The program runs on weekdays throughout the summer with no long-term commitments required—sign up for individual days that work for your family.",
    "sentiment": "Amazing value... you get 3.5 hours for $45!!",
    "ageRange": "5-12",
    "cost": "$45/day",
    "location": "Franklin",
    "url": "https://striveninja.com/summer-programs",
    "registrationDeadline": "Rolling admission",
    "documents": [
      "Waiver"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "fairmount-fruit-farm-fairmount-fruit-farm",
    "name": "Fairmount Fruit Farm",
    "provider": "Fairmount Fruit Farm",
    "category": "adventure",
    "subcategory": "nature-study",
    "tags": [
      "farm",
      "agriculture",
      "nature-study",
      "hands-on",
      "seasonal",
      "family-friendly"
    ],
    "neighborhood": "franklin",
    "description": "Fairmount Fruit Farm offers engaging kids' programs with hands-on experiences in planting, harvesting, and understanding sustainable agriculture. Children connect with the source of their food through educational initiatives at this 100+ year old family farm in Franklin, MA.",
    "sentiment": "",
    "ageRange": "5-10",
    "cost": "Check website",
    "location": "Franklin",
    "url": "https://www.fairmountfruit.com/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w03",
      "w04",
      "w05",
      "w06",
      "w07"
    ]
  },
  {
    "id": "magical-beginnings-magical-beginnings",
    "name": "Magical Beginnings",
    "provider": "Magical Beginnings",
    "category": "adventure",
    "subcategory": "nature-study",
    "tags": [
      "summer-camp",
      "water-play",
      "arts-crafts",
      "sports",
      "recreation",
      "preschool-friendly"
    ],
    "neighborhood": "bellingham",
    "description": "Magical Beginnings offers a summer program filled with water play in their in-ground pools, arts and crafts, sports, and recreation activities. Children enjoy weekly treats like water slides, moonwalks, cotton candy, and magic shows—all designed to keep kids active, happy, and learning through play.",
    "sentiment": "",
    "ageRange": "5-14",
    "cost": "Check website",
    "location": "Bellingham",
    "url": "https://www.magicalbeginnings.com/location/daycare-bellingham/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "summer-playground-via-rec-dept-wrentham-recreation",
    "name": "Summer Playground (via Rec Dept)",
    "provider": "Wrentham Recreation",
    "category": "adventure",
    "subcategory": "nature-study",
    "tags": [
      "summer camp",
      "playground",
      "recreation",
      "K-8",
      "full-day",
      "half-day option"
    ],
    "neighborhood": "wrentham",
    "description": "Summer Playground is a full-day camp running Monday through Friday from 9am-3pm (with half-day option 9am-12pm) for children in kindergarten through 8th grade. The program offers a variety of recreational activities and play-based learning opportunities throughout the summer.",
    "sentiment": "",
    "ageRange": "5-13",
    "cost": "Check website",
    "location": "Wrentham",
    "url": "https://wrenthamma.myrec.com/info/default.aspx",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09"
    ]
  },
  {
    "id": "kp-warrior-summer-baseball-club-wrentham-recreation",
    "name": "KP Warrior Summer Baseball Club",
    "provider": "Wrentham Recreation",
    "category": "adventure",
    "subcategory": "nature-study",
    "tags": [
      "summer camp",
      "playground",
      "recreation",
      "K-8",
      "full-day",
      "half-day option"
    ],
    "neighborhood": "wrentham",
    "description": "Summer Playground is a full-day camp running Monday through Friday from 9am-3pm (with half-day option 9am-12pm) for children in kindergarten through 8th grade. The program offers a variety of recreational activities and play-based learning opportunities throughout the summer.",
    "sentiment": "",
    "ageRange": "7-13",
    "cost": "Check website",
    "location": "Wrentham",
    "url": "https://wrenthamma.myrec.com/info/default.aspx",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w02"
    ]
  },
  {
    "id": "tennis-pickleball-camp-wrentham-recreation",
    "name": "Tennis & Pickleball Camp",
    "provider": "Wrentham Recreation",
    "category": "adventure",
    "subcategory": "nature-study",
    "tags": [
      "summer camp",
      "playground",
      "recreation",
      "K-8",
      "full-day",
      "half-day option"
    ],
    "neighborhood": "wrentham",
    "description": "Summer Playground is a full-day camp running Monday through Friday from 9am-3pm (with half-day option 9am-12pm) for children in kindergarten through 8th grade. The program offers a variety of recreational activities and play-based learning opportunities throughout the summer.",
    "sentiment": "",
    "ageRange": "7-13",
    "cost": "Check website",
    "location": "Wrentham",
    "url": "https://wrenthamma.myrec.com/info/default.aspx",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w02",
      "w07"
    ]
  },
  {
    "id": "norton-ninja-s-summer-camp-usanc",
    "name": "Norton Ninja's Summer Camp",
    "provider": "USANC",
    "category": "adventure",
    "subcategory": "high-adrenaline",
    "tags": [
      "ninja",
      "obstacle course",
      "fitness",
      "summer camp",
      "ages 5+",
      "skill-building"
    ],
    "neighborhood": "norwood",
    "description": "Norton Ninja's Summer Camp offers an exciting week of ninja training and obstacle course challenges for kids. Participants develop strength, agility, and coordination while learning ninja techniques in a fun, supportive environment. The camp runs daily from 9:00 AM to 2:30 PM at USA Ninja Challenge Norton.",
    "sentiment": "",
    "ageRange": "6-15",
    "cost": "Check website",
    "location": "Norton",
    "url": "https://portal.iclasspro.com/usaninjanorton/camps/1?sortBy=time?KKFC",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w08"
    ]
  },
  {
    "id": "sports-camps-via-rec-dept-wrentham-recreation",
    "name": "Sports Camps (via Rec Dept)",
    "provider": "Wrentham Recreation",
    "category": "adventure",
    "subcategory": "nature-study",
    "tags": [
      "summer camp",
      "playground",
      "recreation",
      "K-8",
      "full-day",
      "half-day option"
    ],
    "neighborhood": "wrentham",
    "description": "Summer Playground is a full-day camp running Monday through Friday from 9am-3pm (with half-day option 9am-12pm) for children in kindergarten through 8th grade. The program offers a variety of recreational activities and play-based learning opportunities throughout the summer.",
    "sentiment": "",
    "ageRange": "7-13",
    "cost": "Check website",
    "location": "Wrentham",
    "url": "https://wrenthamma.myrec.com/info/default.aspx",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w02",
      "w07"
    ]
  },
  {
    "id": "esker-adventure-program-weymouth-parks-and-recreation-depart",
    "name": "Esker Adventure Program",
    "provider": "Weymouth Parks and Recreation Department",
    "category": "adventure",
    "subcategory": "outdoor-survival",
    "tags": [
      "day camp",
      "adventure",
      "outdoor"
    ],
    "neighborhood": "weymouth",
    "description": "An adventure-focused program at Great Esker Park offering outdoor activities and experiences.",
    "sentiment": "",
    "ageRange": "5-14",
    "cost": "Check website",
    "location": "Great Esker Park, 0 Elva Road N, Weymouth",
    "url": "https://www.weymouth.ma.us/1960/Weymouth-Recreation-Summer-Day-Camps",
    "registrationDeadline": "March 4, 2026 for Weymouth residents; April 8, 2026 for non-residents",
    "documents": [
      "Health Form"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "camp-west-woods-lower-camp-camp-west-woods",
    "name": "Camp West Woods - Lower Camp",
    "provider": "Camp West Woods",
    "category": "adventure",
    "subcategory": "nature-study",
    "tags": [
      "day camp",
      "swimming",
      "sports",
      "arts",
      "nature exploration",
      "team-building",
      "day-camp",
      "multi-activity"
    ],
    "neighborhood": "stoughton",
    "description": "Camp West Woods offers a day camp experience on 10 beautiful acres in Stoughton where children participate in eight 40-minute activity periods daily. Campers enjoy daily swim instruction, free swim, lunch, and rotating activities including sports, creative arts, nature exploration, and team-building games. The camp creates a fun, engaging environment where children grow their skills, boost self-esteem, and build respect for others.",
    "sentiment": "Trusted by Parents for Over 50 Years",
    "ageRange": "4-5",
    "cost": "Check website",
    "location": "Camp West Woods, Stoughton, MA",
    "url": "https://campwestwoods.com/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "camp-west-woods-middle-camp-camp-west-woods",
    "name": "Camp West Woods - Middle Camp",
    "provider": "Camp West Woods",
    "category": "adventure",
    "subcategory": "nature-study",
    "tags": [
      "day camp",
      "swimming",
      "sports",
      "arts",
      "nature exploration",
      "team-building",
      "day-camp",
      "multi-activity"
    ],
    "neighborhood": "stoughton",
    "description": "Camp West Woods offers a day camp experience on 10 beautiful acres in Stoughton where children participate in eight 40-minute activity periods daily. Campers enjoy daily swim instruction, free swim, lunch, and rotating activities including sports, creative arts, nature exploration, and team-building games. The camp creates a fun, engaging environment where children grow their skills, boost self-esteem, and build respect for others.",
    "sentiment": "Trusted by Parents for Over 50 Years",
    "ageRange": "6-11",
    "cost": "Check website",
    "location": "Camp West Woods, Stoughton, MA",
    "url": "https://campwestwoods.com/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "camp-west-woods-upper-camp-camp-west-woods",
    "name": "Camp West Woods - Upper Camp",
    "provider": "Camp West Woods",
    "category": "adventure",
    "subcategory": "nature-study",
    "tags": [
      "day camp",
      "swimming",
      "sports",
      "arts",
      "nature exploration",
      "team-building",
      "day-camp",
      "multi-activity"
    ],
    "neighborhood": "stoughton",
    "description": "Camp West Woods offers a day camp experience on 10 beautiful acres in Stoughton where children participate in eight 40-minute activity periods daily. Campers enjoy daily swim instruction, free swim, lunch, and rotating activities including sports, creative arts, nature exploration, and team-building games. The camp creates a fun, engaging environment where children grow their skills, boost self-esteem, and build respect for others.",
    "sentiment": "Trusted by Parents for Over 50 Years",
    "ageRange": "11-14",
    "cost": "Check website",
    "location": "Camp West Woods, Stoughton, MA",
    "url": "https://campwestwoods.com/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "camp-west-woods-gymnastics-camp-camp-west-woods",
    "name": "Camp West Woods - Gymnastics Camp",
    "provider": "Camp West Woods",
    "category": "adventure",
    "subcategory": "nature-study",
    "tags": [
      "gymnastics",
      "day camp",
      "summer camp",
      "day-camp",
      "multi-activity",
      "swimming",
      "arts",
      "sports"
    ],
    "neighborhood": "stoughton",
    "description": "Camp West Woods offers a day camp experience on 10 beautiful acres in Stoughton where children participate in eight 40-minute activity periods daily. Campers enjoy daily swim instruction, free swim, lunch, and rotating activities including sports, creative arts, nature exploration, and team-building games. The camp creates a fun, engaging environment where children grow their skills, boost self-esteem, and build respect for others.",
    "sentiment": "Trusted by Parents for Over 50 Years",
    "ageRange": "4-14",
    "cost": "Check website",
    "location": "Camp West Woods, Stoughton, MA",
    "url": "https://campwestwoods.com/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "camp-west-woods-science-camp-camp-west-woods",
    "name": "Camp West Woods - Science Camp",
    "provider": "Camp West Woods",
    "category": "adventure",
    "subcategory": "nature-study",
    "tags": [
      "science",
      "day camp",
      "summer camp",
      "day-camp",
      "multi-activity",
      "swimming",
      "arts",
      "sports"
    ],
    "neighborhood": "stoughton",
    "description": "Camp West Woods offers a day camp experience on 10 beautiful acres in Stoughton where children participate in eight 40-minute activity periods daily. Campers enjoy daily swim instruction, free swim, lunch, and rotating activities including sports, creative arts, nature exploration, and team-building games. The camp creates a fun, engaging environment where children grow their skills, boost self-esteem, and build respect for others.",
    "sentiment": "Trusted by Parents for Over 50 Years",
    "ageRange": "4-14",
    "cost": "Check website",
    "location": "Camp West Woods, Stoughton, MA",
    "url": "https://campwestwoods.com/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "camp-grossman-jcc-greater-boston",
    "name": "Camp Grossman",
    "provider": "JCC Greater Boston",
    "category": "adventure",
    "subcategory": "nature-study",
    "tags": [
      "traditional day camp",
      "waterfront",
      "outdoor adventure",
      "sports",
      "arts",
      "music",
      "drama",
      "Jewish culture"
    ],
    "neighborhood": "dover",
    "description": "Camp Grossman is a traditional outdoor day camp on 75 wooded acres in Dover featuring lakefront swimming, sports, arts, drama, music, nature activities, and meaningful Jewish community experiences. Campers enjoy instructional and free swim, rock climbing, zip lines, mountain biking, ropes courses, archery, gymnastics, basketball, soccer, and creative pursuits like ceramics and video production. The camp serves 1,400+ campers with age-appropriate programming from Kindergarten through 10th grade, including a special Kibbutz program for 8th-9th graders and a CIT program for rising 10th graders.",
    "sentiment": "Campers go 'gaga for Grossman' every summer. Parents appreciate the 75% counselor alumni rate and strong camp spirit. Kibbutz campers remember their 'Final Presentation' for years and cite Maccabiah as a highlight.",
    "ageRange": "5-15",
    "cost": "$800/week | 2-week sessions starting at $1,594",
    "location": "294 Powissett Street, Dover",
    "url": "https://www.bostonjcc.org/program/camp-grossman/",
    "registrationDeadline": "Rolling admission",
    "documents": [
      "Health form",
      "Waiver"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "charles-river-ymca-day-camp-ymca-of-greater-boston",
    "name": "Charles River YMCA Day Camp",
    "provider": "YMCA of Greater Boston",
    "category": "adventure",
    "subcategory": "nature-study",
    "tags": [
      "swimming",
      "STEM",
      "creative exploration",
      "leadership",
      "character building",
      "day-camp",
      "field-trips",
      "multi-sport"
    ],
    "neighborhood": "needham",
    "description": "Charles River YMCA Day Camp blends fun with purpose through exciting group games, swimming, STEM activities, and creative exploration, helping campers build independence, leadership, and confidence. The Voyagers program (ages 7-13) features weekly field trips including Physical Challenge Week with hiking and kayaking, Fun & Games Week with go-kart racing and arcade adventures, and Beach Week at Massachusetts coastal spots.",
    "sentiment": "Our campers don't just have fun—they grow into their best selves.",
    "ageRange": "3-13",
    "cost": "$400-$525/week",
    "location": "863 Great Plain Avenue, Needham, MA",
    "url": "https://ymcaboston.org/youth-and-family/camps/day-camps/cr-camp-guide/",
    "registrationDeadline": "Rolling admission",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "charles-river-voyagers-camp-ymca-of-greater-boston",
    "name": "Charles River Voyagers Camp",
    "provider": "YMCA of Greater Boston",
    "category": "adventure",
    "subcategory": "nature-study",
    "tags": [
      "field trips",
      "hiking",
      "kayaking",
      "beach",
      "nature exploration",
      "day-camp",
      "swimming",
      "STEM"
    ],
    "neighborhood": "needham",
    "description": "Charles River YMCA Day Camp blends fun with purpose through exciting group games, swimming, STEM activities, and creative exploration, helping campers build independence, leadership, and confidence. The Voyagers program (ages 7-13) features weekly field trips including Physical Challenge Week with hiking and kayaking, Fun & Games Week with go-kart racing and arcade adventures, and Beach Week at Massachusetts coastal spots.",
    "sentiment": "Our campers don't just have fun—they grow into their best selves.",
    "ageRange": "7-13",
    "cost": "$400-$525/week",
    "location": "863 Great Plain Avenue, Needham, MA",
    "url": "https://ymcaboston.org/youth-and-family/camps/day-camps/cr-camp-guide/",
    "registrationDeadline": "Rolling admission",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "camp-quirk-day-camp-south-shore-ymca",
    "name": "Camp Quirk – Day Camp",
    "provider": "South Shore YMCA",
    "category": "adventure",
    "subcategory": "nature-study",
    "tags": [
      "traditional day camp",
      "outdoor activity",
      "character building",
      "friendship",
      "day camp",
      "traditional camp",
      "ages 5-15",
      "outdoor activities"
    ],
    "neighborhood": "quincy",
    "description": "Camp Quirk is a traditional Y summer day camp where children ages 5-15 build memories, make friends, and actively explore their imagination through an extensive variety of programs. Located at the Hale Family YMCA and Quincy High School, campers enjoy outdoor activities and character-building experiences in a safe, welcoming environment with positive role models and enthusiastic counselors.",
    "sentiment": "My girls had fun, felt safe, and made friends. The counselors create a positive environment for the kids. They connect well with the children and have a lot of energy.",
    "ageRange": "5-15",
    "cost": "Check website",
    "location": "Hale Family YMCA, 79 Coddington Street, Quincy, MA and Quincy High School, 100 Coddington St, Quincy, MA",
    "url": "https://ssymca.org/program/camp/camp-quirk/",
    "registrationDeadline": "Rolling admission",
    "documents": [
      "Physical exam form",
      "Health form",
      "Multiple registration forms"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "energy-center-camp-weymouth-club",
    "name": "Energy Center Camp",
    "provider": "Weymouth Club",
    "category": "adventure",
    "subcategory": "nature-study",
    "tags": [
      "child care",
      "enrichment",
      "physical activity",
      "play-based learning",
      "early-childhood",
      "multi-sport",
      "playcentered",
      "daycare"
    ],
    "neighborhood": "weymouth",
    "description": "Energy Center Camp for ages 4-6 offers two hours of daily child care and enrichment activities guided by learning through play philosophy. Kids enjoy physical activity, fun programs, and age-appropriate Xcitement activities at the Weymouth Club's specially designed Energy Center facility.",
    "sentiment": "",
    "ageRange": "4-6",
    "cost": "Check website",
    "location": "75 Finnell Drive, Weymouth",
    "url": "https://www.weymouthclub.com/camps/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "tfa-camp-traditional-track-weymouth-club",
    "name": "TFA Camp: Traditional Track",
    "provider": "Weymouth Club",
    "category": "adventure",
    "subcategory": "nature-study",
    "tags": [
      "traditional activities",
      "summer camp",
      "early-childhood",
      "multi-sport",
      "enrichment",
      "playcentered",
      "daycare",
      "Weymouth"
    ],
    "neighborhood": "weymouth",
    "description": "Energy Center Camp for ages 4-6 offers two hours of daily child care and enrichment activities guided by learning through play philosophy. Kids enjoy physical activity, fun programs, and age-appropriate Xcitement activities at the Weymouth Club's specially designed Energy Center facility.",
    "sentiment": "",
    "ageRange": "6-13",
    "cost": "Check website",
    "location": "75 Finnell Drive, Weymouth",
    "url": "https://www.weymouthclub.com/camps/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "tfa-camp-dance-track-weymouth-club",
    "name": "TFA Camp: Dance Track",
    "provider": "Weymouth Club",
    "category": "adventure",
    "subcategory": "nature-study",
    "tags": [
      "dance",
      "summer camp",
      "performing arts",
      "early-childhood",
      "multi-sport",
      "enrichment",
      "playcentered",
      "daycare"
    ],
    "neighborhood": "weymouth",
    "description": "Energy Center Camp for ages 4-6 offers two hours of daily child care and enrichment activities guided by learning through play philosophy. Kids enjoy physical activity, fun programs, and age-appropriate Xcitement activities at the Weymouth Club's specially designed Energy Center facility.",
    "sentiment": "",
    "ageRange": "6-13",
    "cost": "Check website",
    "location": "75 Finnell Drive, Weymouth",
    "url": "https://www.weymouthclub.com/camps/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "tfa-camp-musical-theater-track-weymouth-club",
    "name": "TFA Camp: Musical Theater Track",
    "provider": "Weymouth Club",
    "category": "adventure",
    "subcategory": "nature-study",
    "tags": [
      "musical theater",
      "summer camp",
      "performing arts",
      "early-childhood",
      "multi-sport",
      "enrichment",
      "playcentered",
      "daycare"
    ],
    "neighborhood": "weymouth",
    "description": "Energy Center Camp for ages 4-6 offers two hours of daily child care and enrichment activities guided by learning through play philosophy. Kids enjoy physical activity, fun programs, and age-appropriate Xcitement activities at the Weymouth Club's specially designed Energy Center facility.",
    "sentiment": "",
    "ageRange": "6-13",
    "cost": "Check website",
    "location": "75 Finnell Drive, Weymouth",
    "url": "https://www.weymouthclub.com/camps/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "tennis-academy-weymouth-club",
    "name": "Tennis Academy",
    "provider": "Weymouth Club",
    "category": "adventure",
    "subcategory": "nature-study",
    "tags": [
      "tennis",
      "academy",
      "instruction",
      "early-childhood",
      "multi-sport",
      "enrichment",
      "playcentered",
      "daycare"
    ],
    "neighborhood": "weymouth",
    "description": "Energy Center Camp for ages 4-6 offers two hours of daily child care and enrichment activities guided by learning through play philosophy. Kids enjoy physical activity, fun programs, and age-appropriate Xcitement activities at the Weymouth Club's specially designed Energy Center facility.",
    "sentiment": "",
    "ageRange": "11-18",
    "cost": "Check website",
    "location": "75 Finnell Drive, Weymouth",
    "url": "https://www.weymouthclub.com/camps/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "ecojustice-camp-first-parish-in-cohasset",
    "name": "Ecojustice Camp",
    "provider": "First Parish in Cohasset",
    "category": "adventure",
    "subcategory": "outdoor-survival",
    "tags": [
      "ecology",
      "outdoor skills",
      "nature hike",
      "camping",
      "conservation",
      "environmental justice",
      "nature-study",
      "outdoor-skills"
    ],
    "neighborhood": "cohasset",
    "description": "Ecojustice Camp offers full-day outdoor learning experiences for elementary and middle school students, featuring nature hikes, field trips to local conservation areas, and overnight camping at Wompatuck State Park. Campers build fairy houses, observe native plants and animals, and connect with the natural world through hands-on activities and campfire experiences.",
    "sentiment": "",
    "ageRange": "7-14",
    "cost": "Check website",
    "location": "First Parish in Cohasset, 23 N. Main St., Cohasset, MA 02025",
    "url": "https://ecojusticecampsouthshore.org/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "camp-westwood-day-camp-traditional-day-camp-ymca-of-pawtucke",
    "name": "Camp Westwood Day Camp - Traditional Day Camp",
    "provider": "YMCA of Pawtucket",
    "category": "adventure",
    "subcategory": "nature-study",
    "tags": [
      "multi-sport",
      "swimming",
      "arts and crafts",
      "outdoor recreation",
      "team building",
      "arts",
      "adventure",
      "water activities"
    ],
    "neighborhood": "norwood",
    "description": "YMCA Camp Westwood offers traditional day camp, immersive themed camps (Star Wars, Percy Jackson, Harry Potter, Survivor), and specialty camps (Pirate Adventure, Art Explosion, Culinary, Sports Medley) across 80 acres of woodlands and a 300-acre reservoir. Campers ages 4-16 participate in over 70 activities including swimming, sports, arts and crafts, high ropes courses, and themed weekly programs with challenge-by-choice opportunities.",
    "sentiment": "",
    "ageRange": "4-13",
    "cost": "$355/week for Traditional Camp; $375/week for Immersive and Specialty Camps; $260/week for Half-Day Camp; Free for Race 4 Chase",
    "location": "Camp Westwood, Coventry, RI",
    "url": "https://ymcapawtucket.org/camps/camp-westwood/day-camp",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "camp-westwood-day-camp-half-day-camp-ymca-of-pawtucket",
    "name": "Camp Westwood Day Camp - Half-Day Camp",
    "provider": "YMCA of Pawtucket",
    "category": "adventure",
    "subcategory": "nature-study",
    "tags": [
      "multi-sport",
      "swimming",
      "arts and crafts",
      "half-day program",
      "arts",
      "adventure",
      "water activities",
      "themed camps"
    ],
    "neighborhood": "norwood",
    "description": "YMCA Camp Westwood offers traditional day camp, immersive themed camps (Star Wars, Percy Jackson, Harry Potter, Survivor), and specialty camps (Pirate Adventure, Art Explosion, Culinary, Sports Medley) across 80 acres of woodlands and a 300-acre reservoir. Campers ages 4-16 participate in over 70 activities including swimming, sports, arts and crafts, high ropes courses, and themed weekly programs with challenge-by-choice opportunities.",
    "sentiment": "",
    "ageRange": "4-6",
    "cost": "$355/week for Traditional Camp; $375/week for Immersive and Specialty Camps; $260/week for Half-Day Camp; Free for Race 4 Chase",
    "location": "Camp Westwood, Coventry, RI",
    "url": "https://ymcapawtucket.org/camps/camp-westwood/day-camp",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "camp-westwood-day-camp-star-wars-immersive-camp-ymca-of-pawt",
    "name": "Camp Westwood Day Camp - Star Wars Immersive Camp",
    "provider": "YMCA of Pawtucket",
    "category": "adventure",
    "subcategory": "nature-study",
    "tags": [
      "immersive",
      "themed",
      "lightsaber training",
      "costume",
      "multi-sport",
      "arts",
      "adventure",
      "water activities"
    ],
    "neighborhood": "norwood",
    "description": "YMCA Camp Westwood offers traditional day camp, immersive themed camps (Star Wars, Percy Jackson, Harry Potter, Survivor), and specialty camps (Pirate Adventure, Art Explosion, Culinary, Sports Medley) across 80 acres of woodlands and a 300-acre reservoir. Campers ages 4-16 participate in over 70 activities including swimming, sports, arts and crafts, high ropes courses, and themed weekly programs with challenge-by-choice opportunities.",
    "sentiment": "",
    "ageRange": "9-13",
    "cost": "$355/week for Traditional Camp; $375/week for Immersive and Specialty Camps; $260/week for Half-Day Camp; Free for Race 4 Chase",
    "location": "Camp Westwood, Coventry, RI",
    "url": "https://ymcapawtucket.org/camps/camp-westwood/day-camp",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "camp-westwood-day-camp-percy-jackson-immersive-camp-ymca-of-",
    "name": "Camp Westwood Day Camp - Percy Jackson Immersive Camp",
    "provider": "YMCA of Pawtucket",
    "category": "adventure",
    "subcategory": "nature-study",
    "tags": [
      "immersive",
      "themed",
      "quest",
      "costume",
      "multi-sport",
      "arts",
      "adventure",
      "water activities"
    ],
    "neighborhood": "norwood",
    "description": "YMCA Camp Westwood offers traditional day camp, immersive themed camps (Star Wars, Percy Jackson, Harry Potter, Survivor), and specialty camps (Pirate Adventure, Art Explosion, Culinary, Sports Medley) across 80 acres of woodlands and a 300-acre reservoir. Campers ages 4-16 participate in over 70 activities including swimming, sports, arts and crafts, high ropes courses, and themed weekly programs with challenge-by-choice opportunities.",
    "sentiment": "",
    "ageRange": "9-12",
    "cost": "$355/week for Traditional Camp; $375/week for Immersive and Specialty Camps; $260/week for Half-Day Camp; Free for Race 4 Chase",
    "location": "Camp Westwood, Coventry, RI",
    "url": "https://ymcapawtucket.org/camps/camp-westwood/day-camp",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "camp-westwood-day-camp-harry-potter-immersive-camp-ymca-of-p",
    "name": "Camp Westwood Day Camp - Harry Potter Immersive Camp",
    "provider": "YMCA of Pawtucket",
    "category": "adventure",
    "subcategory": "nature-study",
    "tags": [
      "immersive",
      "themed",
      "Hogwarts",
      "costume",
      "multi-sport",
      "arts",
      "adventure",
      "water activities"
    ],
    "neighborhood": "norwood",
    "description": "YMCA Camp Westwood offers traditional day camp, immersive themed camps (Star Wars, Percy Jackson, Harry Potter, Survivor), and specialty camps (Pirate Adventure, Art Explosion, Culinary, Sports Medley) across 80 acres of woodlands and a 300-acre reservoir. Campers ages 4-16 participate in over 70 activities including swimming, sports, arts and crafts, high ropes courses, and themed weekly programs with challenge-by-choice opportunities.",
    "sentiment": "",
    "ageRange": "9-13",
    "cost": "$355/week for Traditional Camp; $375/week for Immersive and Specialty Camps; $260/week for Half-Day Camp; Free for Race 4 Chase",
    "location": "Camp Westwood, Coventry, RI",
    "url": "https://ymcapawtucket.org/camps/camp-westwood/day-camp",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "camp-westwood-day-camp-survivor-immersive-camp-ymca-of-pawtu",
    "name": "Camp Westwood Day Camp - Survivor Immersive Camp",
    "provider": "YMCA of Pawtucket",
    "category": "adventure",
    "subcategory": "nature-study",
    "tags": [
      "immersive",
      "themed",
      "competition",
      "challenges",
      "multi-sport",
      "arts",
      "adventure",
      "water activities"
    ],
    "neighborhood": "norwood",
    "description": "YMCA Camp Westwood offers traditional day camp, immersive themed camps (Star Wars, Percy Jackson, Harry Potter, Survivor), and specialty camps (Pirate Adventure, Art Explosion, Culinary, Sports Medley) across 80 acres of woodlands and a 300-acre reservoir. Campers ages 4-16 participate in over 70 activities including swimming, sports, arts and crafts, high ropes courses, and themed weekly programs with challenge-by-choice opportunities.",
    "sentiment": "",
    "ageRange": "12-15",
    "cost": "$355/week for Traditional Camp; $375/week for Immersive and Specialty Camps; $260/week for Half-Day Camp; Free for Race 4 Chase",
    "location": "Camp Westwood, Coventry, RI",
    "url": "https://ymcapawtucket.org/camps/camp-westwood/day-camp",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "camp-westwood-day-camp-pirate-adventure-ymca-of-pawtucket",
    "name": "Camp Westwood Day Camp - Pirate Adventure",
    "provider": "YMCA of Pawtucket",
    "category": "adventure",
    "subcategory": "nature-study",
    "tags": [
      "water-sports",
      "sailing",
      "treasure hunt",
      "adventure",
      "multi-sport",
      "arts",
      "water activities",
      "themed camps"
    ],
    "neighborhood": "norwood",
    "description": "YMCA Camp Westwood offers traditional day camp, immersive themed camps (Star Wars, Percy Jackson, Harry Potter, Survivor), and specialty camps (Pirate Adventure, Art Explosion, Culinary, Sports Medley) across 80 acres of woodlands and a 300-acre reservoir. Campers ages 4-16 participate in over 70 activities including swimming, sports, arts and crafts, high ropes courses, and themed weekly programs with challenge-by-choice opportunities.",
    "sentiment": "",
    "ageRange": "7-12",
    "cost": "$355/week for Traditional Camp; $375/week for Immersive and Specialty Camps; $260/week for Half-Day Camp; Free for Race 4 Chase",
    "location": "Camp Westwood, Coventry, RI",
    "url": "https://ymcapawtucket.org/camps/camp-westwood/day-camp",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "camp-westwood-day-camp-art-explosion-ymca-of-pawtucket",
    "name": "Camp Westwood Day Camp - Art Explosion",
    "provider": "YMCA of Pawtucket",
    "category": "adventure",
    "subcategory": "nature-study",
    "tags": [
      "visual arts",
      "expanded art program",
      "multiple mediums",
      "multi-sport",
      "arts",
      "adventure",
      "water activities",
      "themed camps"
    ],
    "neighborhood": "norwood",
    "description": "YMCA Camp Westwood offers traditional day camp, immersive themed camps (Star Wars, Percy Jackson, Harry Potter, Survivor), and specialty camps (Pirate Adventure, Art Explosion, Culinary, Sports Medley) across 80 acres of woodlands and a 300-acre reservoir. Campers ages 4-16 participate in over 70 activities including swimming, sports, arts and crafts, high ropes courses, and themed weekly programs with challenge-by-choice opportunities.",
    "sentiment": "",
    "ageRange": "5-12",
    "cost": "$355/week for Traditional Camp; $375/week for Immersive and Specialty Camps; $260/week for Half-Day Camp; Free for Race 4 Chase",
    "location": "Camp Westwood, Coventry, RI",
    "url": "https://ymcapawtucket.org/camps/camp-westwood/day-camp",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "camp-westwood-day-camp-culinary-camp-ymca-of-pawtucket",
    "name": "Camp Westwood Day Camp - Culinary Camp",
    "provider": "YMCA of Pawtucket",
    "category": "adventure",
    "subcategory": "nature-study",
    "tags": [
      "cooking",
      "indoor and outdoor cooking",
      "cooking competitions",
      "multi-sport",
      "arts",
      "adventure",
      "water activities",
      "themed camps"
    ],
    "neighborhood": "norwood",
    "description": "YMCA Camp Westwood offers traditional day camp, immersive themed camps (Star Wars, Percy Jackson, Harry Potter, Survivor), and specialty camps (Pirate Adventure, Art Explosion, Culinary, Sports Medley) across 80 acres of woodlands and a 300-acre reservoir. Campers ages 4-16 participate in over 70 activities including swimming, sports, arts and crafts, high ropes courses, and themed weekly programs with challenge-by-choice opportunities.",
    "sentiment": "",
    "ageRange": "10-15",
    "cost": "$355/week for Traditional Camp; $375/week for Immersive and Specialty Camps; $260/week for Half-Day Camp; Free for Race 4 Chase",
    "location": "Camp Westwood, Coventry, RI",
    "url": "https://ymcapawtucket.org/camps/camp-westwood/day-camp",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "camp-westwood-day-camp-alien-invasion-ymca-of-pawtucket",
    "name": "Camp Westwood Day Camp - Alien Invasion",
    "provider": "YMCA of Pawtucket",
    "category": "adventure",
    "subcategory": "nature-study",
    "tags": [
      "themed",
      "teamwork",
      "challenges",
      "competition",
      "multi-sport",
      "arts",
      "adventure",
      "water activities"
    ],
    "neighborhood": "norwood",
    "description": "YMCA Camp Westwood offers traditional day camp, immersive themed camps (Star Wars, Percy Jackson, Harry Potter, Survivor), and specialty camps (Pirate Adventure, Art Explosion, Culinary, Sports Medley) across 80 acres of woodlands and a 300-acre reservoir. Campers ages 4-16 participate in over 70 activities including swimming, sports, arts and crafts, high ropes courses, and themed weekly programs with challenge-by-choice opportunities.",
    "sentiment": "",
    "ageRange": "10-13",
    "cost": "$355/week for Traditional Camp; $375/week for Immersive and Specialty Camps; $260/week for Half-Day Camp; Free for Race 4 Chase",
    "location": "Camp Westwood, Coventry, RI",
    "url": "https://ymcapawtucket.org/camps/camp-westwood/day-camp",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "camp-westwood-day-camp-sports-medley-ymca-of-pawtucket",
    "name": "Camp Westwood Day Camp - Sports Medley",
    "provider": "YMCA of Pawtucket",
    "category": "adventure",
    "subcategory": "nature-study",
    "tags": [
      "multi-sport",
      "flag football",
      "soccer",
      "basketball",
      "skill-building",
      "arts",
      "adventure",
      "water activities"
    ],
    "neighborhood": "norwood",
    "description": "YMCA Camp Westwood offers traditional day camp, immersive themed camps (Star Wars, Percy Jackson, Harry Potter, Survivor), and specialty camps (Pirate Adventure, Art Explosion, Culinary, Sports Medley) across 80 acres of woodlands and a 300-acre reservoir. Campers ages 4-16 participate in over 70 activities including swimming, sports, arts and crafts, high ropes courses, and themed weekly programs with challenge-by-choice opportunities.",
    "sentiment": "",
    "ageRange": "5-9",
    "cost": "$355/week for Traditional Camp; $375/week for Immersive and Specialty Camps; $260/week for Half-Day Camp; Free for Race 4 Chase",
    "location": "Camp Westwood, Coventry, RI",
    "url": "https://ymcapawtucket.org/camps/camp-westwood/day-camp",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "camp-westwood-leaders-in-training-lit-ymca-of-pawtucket",
    "name": "Camp Westwood Leaders in Training (LIT)",
    "provider": "YMCA of Pawtucket",
    "category": "adventure",
    "subcategory": "nature-study",
    "tags": [
      "leadership development",
      "communication",
      "youth development",
      "teamwork",
      "multi-sport",
      "arts",
      "adventure",
      "water activities"
    ],
    "neighborhood": "norwood",
    "description": "YMCA Camp Westwood offers traditional day camp, immersive themed camps (Star Wars, Percy Jackson, Harry Potter, Survivor), and specialty camps (Pirate Adventure, Art Explosion, Culinary, Sports Medley) across 80 acres of woodlands and a 300-acre reservoir. Campers ages 4-16 participate in over 70 activities including swimming, sports, arts and crafts, high ropes courses, and themed weekly programs with challenge-by-choice opportunities.",
    "sentiment": "",
    "ageRange": "13-16",
    "cost": "$355/week for Traditional Camp; $375/week for Immersive and Specialty Camps; $260/week for Half-Day Camp; Free for Race 4 Chase",
    "location": "Camp Westwood, Coventry, RI",
    "url": "https://ymcapawtucket.org/camps/camp-westwood/day-camp",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "race-4-chase-ymca-of-pawtucket",
    "name": "Race 4 Chase",
    "provider": "YMCA of Pawtucket",
    "category": "adventure",
    "subcategory": "nature-study",
    "tags": [
      "triathlon training",
      "swimming",
      "running",
      "biking",
      "free program",
      "multi-sport",
      "arts",
      "adventure"
    ],
    "neighborhood": "norwood",
    "description": "YMCA Camp Westwood offers traditional day camp, immersive themed camps (Star Wars, Percy Jackson, Harry Potter, Survivor), and specialty camps (Pirate Adventure, Art Explosion, Culinary, Sports Medley) across 80 acres of woodlands and a 300-acre reservoir. Campers ages 4-16 participate in over 70 activities including swimming, sports, arts and crafts, high ropes courses, and themed weekly programs with challenge-by-choice opportunities.",
    "sentiment": "",
    "ageRange": "5-16",
    "cost": "$355/week for Traditional Camp; $375/week for Immersive and Specialty Camps; $260/week for Half-Day Camp; Free for Race 4 Chase",
    "location": "Camp Westwood, Coventry, RI",
    "url": "https://ymcapawtucket.org/camps/camp-westwood/day-camp",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "dedham-country-day-camp-dedham-country-day-school",
    "name": "Dedham Country Day Camp",
    "provider": "Dedham Country Day School",
    "category": "adventure",
    "subcategory": "nature-study",
    "tags": [
      "multi-activity",
      "small group",
      "swimming",
      "archery",
      "outdoor play",
      "arts and crafts",
      "day camp",
      "ages 3-8"
    ],
    "neighborhood": "dedham",
    "description": "Dedham Country Day Camp offers summer experiences for children ages 3 through entering 8th grade, featuring a broad range of activities from archery and beading to swimming and sports. The camp emphasizes small group sizes allowing individual attention, with programs designed to reinforce the wonders of childhood and the joy of friendship while providing time for free play like catching frogs, climbing trees, and building forts.",
    "sentiment": "My son is absolutely loving camp; it is such a positive experience for him. You and your team do a fantastic job; I am beyond grateful!",
    "ageRange": "3-13",
    "cost": "Check website",
    "location": "Dedham Country Day School, Dedham, MA",
    "url": "https://www.dedhamcountryday.org/summer-camp/",
    "registrationDeadline": "Check website",
    "documents": [
      "Health form",
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "puddlestompers-summer-symphony-puddlestompers",
    "name": "PUDDLESTOMPERS Summer Symphony!",
    "provider": "PUDDLESTOMPERS",
    "category": "adventure",
    "subcategory": "nature-study",
    "tags": [
      "nature exploration",
      "outdoor learning",
      "hands-on",
      "weekly themes",
      "nature-study",
      "outdoor-exploration",
      "hands-on learning",
      "ages 3-7"
    ],
    "neighborhood": "needham",
    "description": "PUDDLESTOMPERS Summer Camp offers hands-on nature exploration for young naturalists aged 3 years 9 months to 7 years old. Following weekly themes, children investigate different nature topics through hands-on exploration, active outdoor play, crafts, stories, and songs guided by experienced teacher naturalists. Programs run 4.5 hours daily (9:00 am-1:30 pm) with optional early drop-off and extended day options available.",
    "sentiment": "",
    "ageRange": "3-7",
    "cost": "$635/week",
    "location": "Mitchell Elementary School, 187 Brookline St, Needham, MA 02492",
    "url": "https://www.puddlestompers.com/needham",
    "registrationDeadline": "Rolling admission",
    "documents": [
      "Health form",
      "Consent form",
      "Waiver of liability"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "puddlestompers-nature-in-the-city-puddlestompers",
    "name": "PUDDLESTOMPERS Nature in the City!",
    "provider": "PUDDLESTOMPERS",
    "category": "adventure",
    "subcategory": "nature-study",
    "tags": [
      "nature exploration",
      "urban nature",
      "outdoor learning",
      "hands-on",
      "nature-study",
      "outdoor-exploration",
      "hands-on learning",
      "weekly themes"
    ],
    "neighborhood": "needham",
    "description": "PUDDLESTOMPERS Summer Camp offers hands-on nature exploration for young naturalists aged 3 years 9 months to 7 years old. Following weekly themes, children investigate different nature topics through hands-on exploration, active outdoor play, crafts, stories, and songs guided by experienced teacher naturalists. Programs run 4.5 hours daily (9:00 am-1:30 pm) with optional early drop-off and extended day options available.",
    "sentiment": "",
    "ageRange": "3-7",
    "cost": "$635/week",
    "location": "Mitchell Elementary School, 187 Brookline St, Needham, MA 02492",
    "url": "https://www.puddlestompers.com/needham",
    "registrationDeadline": "Rolling admission",
    "documents": [
      "Health form",
      "Consent form",
      "Waiver of liability"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "puddlestompers-construction-critters-puddlestompers",
    "name": "PUDDLESTOMPERS Construction Critters!",
    "provider": "PUDDLESTOMPERS",
    "category": "adventure",
    "subcategory": "nature-study",
    "tags": [
      "nature exploration",
      "animal behavior",
      "outdoor learning",
      "hands-on",
      "nature-study",
      "outdoor-exploration",
      "hands-on learning",
      "weekly themes"
    ],
    "neighborhood": "needham",
    "description": "PUDDLESTOMPERS Summer Camp offers hands-on nature exploration for young naturalists aged 3 years 9 months to 7 years old. Following weekly themes, children investigate different nature topics through hands-on exploration, active outdoor play, crafts, stories, and songs guided by experienced teacher naturalists. Programs run 4.5 hours daily (9:00 am-1:30 pm) with optional early drop-off and extended day options available.",
    "sentiment": "",
    "ageRange": "3-7",
    "cost": "$635/week",
    "location": "Mitchell Elementary School, 187 Brookline St, Needham, MA 02492",
    "url": "https://www.puddlestompers.com/needham",
    "registrationDeadline": "Rolling admission",
    "documents": [
      "Health form",
      "Consent form",
      "Waiver of liability"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "puddlestompers-nature-magical-puddlestompers",
    "name": "PUDDLESTOMPERS Nature & Magical!",
    "provider": "PUDDLESTOMPERS",
    "category": "adventure",
    "subcategory": "nature-study",
    "tags": [
      "nature exploration",
      "metamorphosis",
      "camouflage",
      "outdoor learning",
      "nature-study",
      "outdoor-exploration",
      "hands-on learning",
      "weekly themes"
    ],
    "neighborhood": "needham",
    "description": "PUDDLESTOMPERS Summer Camp offers hands-on nature exploration for young naturalists aged 3 years 9 months to 7 years old. Following weekly themes, children investigate different nature topics through hands-on exploration, active outdoor play, crafts, stories, and songs guided by experienced teacher naturalists. Programs run 4.5 hours daily (9:00 am-1:30 pm) with optional early drop-off and extended day options available.",
    "sentiment": "",
    "ageRange": "3-7",
    "cost": "$635/week",
    "location": "Mitchell Elementary School, 187 Brookline St, Needham, MA 02492",
    "url": "https://www.puddlestompers.com/needham",
    "registrationDeadline": "Rolling admission",
    "documents": [
      "Health form",
      "Consent form",
      "Waiver of liability"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "puddlestompers-hiss-croak-snap-puddlestompers",
    "name": "PUDDLESTOMPERS Hiss, Croak, & Snap!",
    "provider": "PUDDLESTOMPERS",
    "category": "adventure",
    "subcategory": "nature-study",
    "tags": [
      "nature exploration",
      "reptiles",
      "amphibians",
      "outdoor learning",
      "nature-study",
      "outdoor-exploration",
      "hands-on learning",
      "weekly themes"
    ],
    "neighborhood": "needham",
    "description": "PUDDLESTOMPERS Summer Camp offers hands-on nature exploration for young naturalists aged 3 years 9 months to 7 years old. Following weekly themes, children investigate different nature topics through hands-on exploration, active outdoor play, crafts, stories, and songs guided by experienced teacher naturalists. Programs run 4.5 hours daily (9:00 am-1:30 pm) with optional early drop-off and extended day options available.",
    "sentiment": "",
    "ageRange": "3-7",
    "cost": "$635/week",
    "location": "Mitchell Elementary School, 187 Brookline St, Needham, MA 02492",
    "url": "https://www.puddlestompers.com/needham",
    "registrationDeadline": "Rolling admission",
    "documents": [
      "Health form",
      "Consent form",
      "Waiver of liability"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "puddlestompers-carnivore-kitchen-puddlestompers",
    "name": "PUDDLESTOMPERS Carnivore Kitchen!",
    "provider": "PUDDLESTOMPERS",
    "category": "adventure",
    "subcategory": "nature-study",
    "tags": [
      "nature exploration",
      "predators",
      "animal behavior",
      "outdoor learning",
      "nature-study",
      "outdoor-exploration",
      "hands-on learning",
      "weekly themes"
    ],
    "neighborhood": "needham",
    "description": "PUDDLESTOMPERS Summer Camp offers hands-on nature exploration for young naturalists aged 3 years 9 months to 7 years old. Following weekly themes, children investigate different nature topics through hands-on exploration, active outdoor play, crafts, stories, and songs guided by experienced teacher naturalists. Programs run 4.5 hours daily (9:00 am-1:30 pm) with optional early drop-off and extended day options available.",
    "sentiment": "",
    "ageRange": "3-7",
    "cost": "$635/week",
    "location": "Mitchell Elementary School, 187 Brookline St, Needham, MA 02492",
    "url": "https://www.puddlestompers.com/needham",
    "registrationDeadline": "Rolling admission",
    "documents": [
      "Health form",
      "Consent form",
      "Waiver of liability"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "puddlestompers-can-you-dig-it-puddlestompers",
    "name": "PUDDLESTOMPERS Can You Dig It?",
    "provider": "PUDDLESTOMPERS",
    "category": "adventure",
    "subcategory": "nature-study",
    "tags": [
      "nature exploration",
      "soil science",
      "animal habitats",
      "outdoor learning",
      "nature-study",
      "outdoor-exploration",
      "hands-on learning",
      "weekly themes"
    ],
    "neighborhood": "needham",
    "description": "PUDDLESTOMPERS Summer Camp offers hands-on nature exploration for young naturalists aged 3 years 9 months to 7 years old. Following weekly themes, children investigate different nature topics through hands-on exploration, active outdoor play, crafts, stories, and songs guided by experienced teacher naturalists. Programs run 4.5 hours daily (9:00 am-1:30 pm) with optional early drop-off and extended day options available.",
    "sentiment": "",
    "ageRange": "3-7",
    "cost": "$635/week",
    "location": "Mitchell Elementary School, 187 Brookline St, Needham, MA 02492",
    "url": "https://www.puddlestompers.com/needham",
    "registrationDeadline": "Rolling admission",
    "documents": [
      "Health form",
      "Consent form",
      "Waiver of liability"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "stars-summer-programs-south-shore-stars",
    "name": "Stars Summer Programs",
    "provider": "South Shore Stars",
    "category": "adventure",
    "subcategory": "nature-study",
    "tags": [
      "outdoor adventure",
      "arts and crafts",
      "nature exploration",
      "swimming",
      "themed activities",
      "summer camp",
      "day camp",
      "grades 1-6"
    ],
    "neighborhood": "quincy",
    "description": "Stars Summer Programs and Day Camp offer children entering grades 1-6 days filled with outdoor adventure, creativity, and hands-on learning. Campers participate in athletics, arts and crafts, nature exploration, swimming, and weekly themed experiences that spark imagination and curiosity. With opportunities to stay active, try new things, and build confidence, every day offers something exciting to discover.",
    "sentiment": "",
    "ageRange": "6-12",
    "cost": "Check website",
    "location": "Stars Afterschool Centers, Quincy",
    "url": "https://southshorestars.org/programs/summer/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "stars-summer-camp-at-hale-education-south-shore-stars",
    "name": "Stars Summer Camp at Hale Education",
    "provider": "South Shore Stars",
    "category": "adventure",
    "subcategory": "nature-study",
    "tags": [
      "outdoor adventure",
      "arts and crafts",
      "nature exploration",
      "swimming",
      "summer camp",
      "day camp",
      "grades 1-6",
      "multi-activity"
    ],
    "neighborhood": "westwood",
    "description": "Stars Summer Programs and Day Camp offer children entering grades 1-6 days filled with outdoor adventure, creativity, and hands-on learning. Campers participate in athletics, arts and crafts, nature exploration, swimming, and weekly themed experiences that spark imagination and curiosity. With opportunities to stay active, try new things, and build confidence, every day offers something exciting to discover.",
    "sentiment": "",
    "ageRange": "7-12",
    "cost": "Check website",
    "location": "80 Carby Street, Westwood",
    "url": "https://southshorestars.org/programs/summer/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "everwood-day-camp-everwood-day-camp",
    "name": "Everwood Day Camp",
    "provider": "Everwood Day Camp",
    "category": "life",
    "subcategory": "leadership",
    "tags": [
      "day-camp",
      "ages-4-15",
      "multi-activity",
      "social-emotional-learning",
      "Sharon-MA",
      "ACA-accredited"
    ],
    "neighborhood": "sharon",
    "description": "Everwood Day Camp offers a progressive program for ages 4-15 with activities across swimming, athletics, arts, STEAM, and outdoor adventure. Campers develop social-emotional skills through the Five Star Points (friendship, independence, integrity, inspiration, teamwork) integrated into daily activities, special events, and camp culture.",
    "sentiment": "Our son had an incredible summer of growth, fun in the sun, and happiness. You cannot imagine the comfort of letting your four year old go to camp when you realize every counselor on the grounds knows who he is and therefore must be looking out for him.",
    "ageRange": "4-15",
    "cost": "Check website",
    "location": "Sharon",
    "url": "http://www.everwooddaycamp.com/?listing",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "summer-playground-program-norwood-recreation",
    "name": "Summer Playground Program",
    "provider": "Norwood Recreation",
    "category": "life",
    "subcategory": "leadership",
    "tags": [],
    "neighborhood": "norwood",
    "description": "Check website",
    "sentiment": "",
    "ageRange": "5-13",
    "cost": "Check website",
    "location": "Norwood",
    "url": "https://norwoodma.myrec.com/info/default.aspx",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08"
    ]
  },
  {
    "id": "summer-tots-norwood-recreation",
    "name": "Summer Tots",
    "provider": "Norwood Recreation",
    "category": "life",
    "subcategory": "leadership",
    "tags": [],
    "neighborhood": "norwood",
    "description": "Check website",
    "sentiment": "",
    "ageRange": "3-4",
    "cost": "Check website",
    "location": "Norwood",
    "url": "https://norwoodma.myrec.com/info/default.aspx",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08"
    ]
  },
  {
    "id": "mustang-sports-norwood-recreation",
    "name": "Mustang Sports",
    "provider": "Norwood Recreation",
    "category": "life",
    "subcategory": "leadership",
    "tags": [],
    "neighborhood": "norwood",
    "description": "Check website",
    "sentiment": "",
    "ageRange": "8-12",
    "cost": "Check website",
    "location": "Norwood",
    "url": "https://norwoodma.myrec.com/info/default.aspx",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w09"
    ]
  },
  {
    "id": "mustang-mini-sports-norwood-recreation",
    "name": "Mustang Mini Sports",
    "provider": "Norwood Recreation",
    "category": "life",
    "subcategory": "leadership",
    "tags": [],
    "neighborhood": "norwood",
    "description": "Check website",
    "sentiment": "",
    "ageRange": "4-6",
    "cost": "Check website",
    "location": "Norwood",
    "url": "https://norwoodma.myrec.com/info/default.aspx",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w02",
      "w03",
      "w04"
    ]
  },
  {
    "id": "mustang-junior-sports-norwood-recreation",
    "name": "Mustang Junior Sports",
    "provider": "Norwood Recreation",
    "category": "life",
    "subcategory": "leadership",
    "tags": [],
    "neighborhood": "norwood",
    "description": "Check website",
    "sentiment": "",
    "ageRange": "5-8",
    "cost": "Check website",
    "location": "Norwood",
    "url": "https://norwoodma.myrec.com/info/default.aspx",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w02",
      "w03",
      "w06"
    ]
  },
  {
    "id": "fishing-camp-norwood-recreation",
    "name": "Fishing Camp",
    "provider": "Norwood Recreation",
    "category": "life",
    "subcategory": "leadership",
    "tags": [],
    "neighborhood": "norwood",
    "description": "Check website",
    "sentiment": "",
    "ageRange": "11-13",
    "cost": "Check website",
    "location": "Norwood",
    "url": "https://norwoodma.myrec.com/info/default.aspx",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w02",
      "w03",
      "w04",
      "w05"
    ]
  },
  {
    "id": "summer-dance-norwood-recreation",
    "name": "Summer Dance",
    "provider": "Norwood Recreation",
    "category": "life",
    "subcategory": "leadership",
    "tags": [],
    "neighborhood": "norwood",
    "description": "Check website",
    "sentiment": "",
    "ageRange": "3-11",
    "cost": "Check website",
    "location": "Norwood",
    "url": "https://norwoodma.myrec.com/info/default.aspx",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w03",
      "w04",
      "w07",
      "w08"
    ]
  },
  {
    "id": "mini-musical-theatre-norwood-recreation",
    "name": "Mini Musical Theatre",
    "provider": "Norwood Recreation",
    "category": "life",
    "subcategory": "leadership",
    "tags": [],
    "neighborhood": "norwood",
    "description": "Check website",
    "sentiment": "",
    "ageRange": "5-10",
    "cost": "Check website",
    "location": "Norwood",
    "url": "https://norwoodma.myrec.com/info/default.aspx",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w03",
      "w06"
    ]
  },
  {
    "id": "norwood-montessori-norwood-montessori",
    "name": "Norwood Montessori",
    "provider": "Norwood Montessori",
    "category": "life",
    "subcategory": "leadership",
    "tags": [
      "Montessori",
      "summer-camp",
      "child-development",
      "hands-on-learning",
      "student-centered",
      "Norwood-MA"
    ],
    "neighborhood": "norwood",
    "description": "Norwood Montessori School offers Montessori-based summer programs designed for fun, growth, and exploration. While specific summer camp details are referenced on their summer camp page, the main website emphasizes their commitment to student-centered education rooted in the Montessori philosophy.",
    "sentiment": "\"Norwood Montessori School is a true hidden gem! For me, one of the greatest feelings is to be able to leave my child with people whom I can trust completely. The teachers at NMS take the growth of the whole child into consideration.\" - Jackie",
    "ageRange": "2-14",
    "cost": "Check website",
    "location": "Norwood",
    "url": "http://norwoodmontessorischool.com/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09"
    ]
  },
  {
    "id": "westwood-recreation-camp-westwood-recreation",
    "name": "Westwood Recreation Camp",
    "provider": "Westwood Recreation",
    "category": "life",
    "subcategory": "leadership",
    "tags": [
      "recreation",
      "summer camp",
      "community",
      "all ages",
      "westwood",
      "ma"
    ],
    "neighborhood": "westwood",
    "description": "Westwood Recreation offers a broad variety of safe, exciting, and high-quality programs for participants of all ages and abilities. The department provides diverse recreational activities and events throughout the summer season.",
    "sentiment": "",
    "ageRange": "5-14",
    "cost": "Check website",
    "location": "Westwood",
    "url": "https://westwoodrec.activityreg.com/ClientPage_t2.wcs",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08"
    ]
  },
  {
    "id": "sunny-days-pre-k-recreation-camp-westwood-recreation",
    "name": "Sunny Days Pre-K Recreation Camp",
    "provider": "Westwood Recreation",
    "category": "life",
    "subcategory": "leadership",
    "tags": [
      "recreation",
      "summer camp",
      "community",
      "all ages",
      "westwood",
      "ma"
    ],
    "neighborhood": "westwood",
    "description": "Westwood Recreation offers a broad variety of safe, exciting, and high-quality programs for participants of all ages and abilities. The department provides diverse recreational activities and events throughout the summer season.",
    "sentiment": "",
    "ageRange": "3-5",
    "cost": "Check website",
    "location": "Westwood",
    "url": "https://westwoodrec.activityreg.com/ClientPage_t2.wcs",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08"
    ]
  },
  {
    "id": "minisports-westwood-recreation",
    "name": "Minisports",
    "provider": "Westwood Recreation",
    "category": "life",
    "subcategory": "leadership",
    "tags": [
      "recreation",
      "summer camp",
      "community",
      "all ages",
      "westwood",
      "ma"
    ],
    "neighborhood": "westwood",
    "description": "Westwood Recreation offers a broad variety of safe, exciting, and high-quality programs for participants of all ages and abilities. The department provides diverse recreational activities and events throughout the summer season.",
    "sentiment": "",
    "ageRange": "3-6",
    "cost": "Check website",
    "location": "Westwood",
    "url": "https://westwoodrec.activityreg.com/ClientPage_t2.wcs",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "canton-recreation-canton-recreation",
    "name": "Canton Recreation",
    "provider": "Canton Recreation",
    "category": "life",
    "subcategory": "leadership",
    "tags": [
      "summer camp",
      "multi-sport",
      "STEM",
      "arts",
      "Canton MA",
      "day camp"
    ],
    "neighborhood": "canton",
    "description": "Canton Parks and Recreation offers a diverse range of summer camps including full-day and half-day programs. Activities span sports camps (basketball, soccer, flag football, lacrosse), STEM programs (Circuit Lab, Snapology, Top Secret Science), arts programs (Drama Kids, painting), and specialty camps like Chess Wizards and Edge Camp.",
    "sentiment": "",
    "ageRange": "4-6",
    "cost": "Check website",
    "location": "Canton",
    "url": "https://cantonma.myrec.com/info/activities/default.aspx?type=activities",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08"
    ]
  },
  {
    "id": "camp-wonderland-camp-wonderland",
    "name": "Camp Wonderland",
    "provider": "Camp Wonderland",
    "category": "life",
    "subcategory": "leadership",
    "tags": [],
    "neighborhood": "sharon",
    "description": "Check website",
    "sentiment": "",
    "ageRange": "6-16",
    "cost": "Check website",
    "location": "Sharon",
    "url": "https://www.campwonderland.org/camp-schedule/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08"
    ]
  },
  {
    "id": "champions-at-john-kennedy-elementary-champions",
    "name": "Champions at John Kennedy Elementary",
    "provider": "Champions",
    "category": "life",
    "subcategory": "leadership",
    "tags": [
      "after-school care",
      "before-school care",
      "enrichment",
      "STEM",
      "arts"
    ],
    "neighborhood": "holbrook",
    "description": "Champions offers before and after-school care for grades K-6 with a balance of child-initiated and teacher-led activities in math, science, sports, art, and dramatic play. The program helps children continue learning and developing essential life skills while providing busy families the flexibility of extended care right inside their school.",
    "sentiment": "",
    "ageRange": "5-6",
    "cost": "Before-School: $40-$60/week (2025/2026); After-School: $60-$109/week (2025/2026). Summer: Check website",
    "location": "Holbrook",
    "url": "https://www.discoverchampions.com/our-locations/holbrook/ma/001349",
    "registrationDeadline": "Rolling admission",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09"
    ]
  },
  {
    "id": "foxboro-ymca-foxboro-ymca",
    "name": "Foxboro YMCA",
    "provider": "Foxboro YMCA",
    "category": "life",
    "subcategory": "leadership",
    "tags": [
      "day camp",
      "youth development",
      "YMCA",
      "summer camp",
      "nature exploration",
      "multi-activity"
    ],
    "neighborhood": "foxborough",
    "description": "The Foxboro YMCA offers overnight, day, and specialty camps where kids explore nature, discover new talents, try new activities, and gain independence while making lasting friendships and memories. Programs include Day Camp and School Break Camp options designed for discovery and fun.",
    "sentiment": "",
    "ageRange": "3-15",
    "cost": "Check website",
    "location": "Foxboro",
    "url": "https://www.hockymca.org/foxboro/youth-development/camp/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10",
      "w11"
    ]
  },
  {
    "id": "foxboro-recreation-s-booth-summer-camp-foxboro-recreation",
    "name": "Foxboro Recreation's Booth Summer Camp",
    "provider": "Foxboro Recreation",
    "category": "sports",
    "subcategory": "multi-sport",
    "tags": [],
    "neighborhood": "foxborough",
    "description": "",
    "sentiment": "",
    "ageRange": "5-11",
    "cost": "Check website",
    "location": "Foxboro",
    "url": "https://foxboroma.myrec.com/info/activities/default.aspx?type=activities",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "oak-hill-country-day-oak-hill-country-day",
    "name": "Oak Hill Country Day",
    "provider": "Oak Hill Country Day",
    "category": "life",
    "subcategory": "leadership",
    "tags": [
      "day camp",
      "summer camp",
      "traditional camp",
      "recreational activities"
    ],
    "neighborhood": "foxborough",
    "description": "Oak Hill Country Day Camp offers a traditional summer camp experience with activities and programs designed for children. The camp features various recreational and educational opportunities throughout the summer season.",
    "sentiment": "",
    "ageRange": "4-13",
    "cost": "Check website",
    "location": "Foxboro",
    "url": "https://www.oakhillcdc.com/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08"
    ]
  },
  {
    "id": "foxboro-public-schools-enrichment-program-foxboro-public-sch",
    "name": "Foxboro Public Schools Enrichment Program",
    "provider": "Foxboro Public Schools",
    "category": "life",
    "subcategory": "leadership",
    "tags": [
      "summer enrichment",
      "academic support",
      "multi-age",
      "enrichment",
      "July program"
    ],
    "neighborhood": "foxborough",
    "description": "The Summer Enrichment Program offers academic, physical, and social development opportunities for children ages 4-17 through three tracks: Kids Camp for preschool through first grade, Expanding Horizons for grades 2-8, and Summer School Enrichment for high school students.",
    "sentiment": "",
    "ageRange": "4-17",
    "cost": "Check website",
    "location": "Foxboro",
    "url": "https://foxborough.ss19.sharpschool.com/cms/one.aspx?portalId=1548092&pageId=3296729",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w03",
      "w04",
      "w05",
      "w06"
    ]
  },
  {
    "id": "dare-to-dream-dare-to-dream",
    "name": "Dare to Dream",
    "provider": "Dare to Dream",
    "category": "life",
    "subcategory": "leadership",
    "tags": [
      "day camp",
      "personal safety",
      "field trips",
      "arts and crafts",
      "multi-activity",
      "youth development"
    ],
    "neighborhood": "wrentham",
    "description": "Dare to Dream offers a comprehensive summer program emphasizing personal safety education alongside engaging field activities, arts and crafts, and exciting day trips. Children participate in rotating activities including safety demonstrations, visits to attractions like Southwick Zoo, Sweatt Beach, and Water Wizz, plus local sports events. The program combines entertainment with life skills development to help kids make responsible choices.",
    "sentiment": "",
    "ageRange": "8-12",
    "cost": "Check website",
    "location": "Wrentham",
    "url": "https://www.daretodreamsummer.com/",
    "registrationDeadline": "Rolling admission",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w04"
    ]
  },
  {
    "id": "norfolk-recreation-norfolk-recreation",
    "name": "Norfolk Recreation",
    "provider": "Norfolk Recreation",
    "category": "life",
    "subcategory": "leadership",
    "tags": [
      "community recreation",
      "youth programs",
      "athletic fields",
      "parks",
      "playgrounds"
    ],
    "neighborhood": "norfolk",
    "description": "Norfolk Recreation strives to serve the recreation needs for all ages in the community, providing recreational programming, community events, and managing athletic fields, community gardens, parks, and playgrounds.",
    "sentiment": "",
    "ageRange": "3-12",
    "cost": "Check website",
    "location": "Norfolk",
    "url": "http://norfolk.ma.us/departments/recreation/",
    "registrationDeadline": "Rolling admission",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08"
    ]
  },
  {
    "id": "mansfield-parks-recreation-mansfield-parks-recreation",
    "name": "Mansfield Parks & Recreation",
    "provider": "Mansfield Parks & Recreation",
    "category": "life",
    "subcategory": "leadership",
    "tags": [
      "summer camp",
      "youth programs",
      "recreation",
      "field trips",
      "leadership"
    ],
    "neighborhood": "mansfield",
    "description": "Mansfield Parks & Recreation offers a Summer Camp program for youth with various activities and options including Leader-in-Training opportunities. The camp provides field trips and post-camp care services to ensure a comprehensive summer experience for children of all interests.",
    "sentiment": "",
    "ageRange": "5-12",
    "cost": "Check website",
    "location": "Mansfield",
    "url": "https://www.mansfieldma.com/232/Parks-Recreation",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08"
    ]
  },
  {
    "id": "camp-lucky-ducky-camp-lucky-ducky",
    "name": "Camp Lucky Ducky",
    "provider": "Camp Lucky Ducky",
    "category": "life",
    "subcategory": "culinary",
    "tags": [
      "childcare",
      "daycare",
      "summer-program",
      "flexible-schedule",
      "licensed",
      "pre-k"
    ],
    "neighborhood": "plainville",
    "description": "Lucky Ducky Daycare offers licensed childcare for ages 12 and under, including infant care, pre-K learning, before and after school care, and a summer program. The program features small group sizes, flexible scheduling to meet family needs, and is open year-round including school vacation weeks and snow days.",
    "sentiment": "",
    "ageRange": "4-9",
    "cost": "Check website",
    "location": "Plainville",
    "url": "https://www.luckyduckydaycare.com/",
    "registrationDeadline": "Rolling admission",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "jackson-walnut-park-school-summer-fun-program-jackson-walnut",
    "name": "Jackson Walnut Park School – Summer Fun Program",
    "provider": "Jackson Walnut Park School",
    "category": "life",
    "subcategory": "leadership",
    "tags": [],
    "neighborhood": "norwood",
    "description": "Check website",
    "sentiment": "",
    "ageRange": "5-12",
    "cost": "Check website",
    "location": "Newton",
    "url": "https://jwpschools.campbrainregistration.com/?queueittoken=e_globalthrottle~ts_1772131485~ce_true~rt_safetynet~h_14e34edc22cda3a4f31def9c8ca3c25290cbc970fd4ae3b313fdcd1d1c0de4a7",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "fearless-friends-bravery-program-baker-center",
    "name": "Fearless Friends Bravery Program",
    "provider": "Baker Center",
    "category": "life",
    "subcategory": "special-needs",
    "tags": [
      "selective mutism",
      "social anxiety",
      "confidence building",
      "speech therapy",
      "therapeutic camp",
      "mental health"
    ],
    "neighborhood": "boston",
    "description": "Fearless Friends is an intensive summer program designed to help kids ages 3-9 overcome selective mutism and social anxiety through 25 hours of supported brave speaking practice in just one week. The program mimics a school setting with enjoyable activities, field trips, and a 1-1 counselor-to-child ratio, while parents receive live coaching to continue supporting their child's progress at home.",
    "sentiment": "",
    "ageRange": "3-9",
    "cost": "$2,500",
    "location": "Boston",
    "url": "https://www.bakercenter.org/fearlessfriends",
    "registrationDeadline": "April 30, 2026",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w08"
    ]
  },
  {
    "id": "golden-chickpea-center-golden-chickpea-center",
    "name": "Golden Chickpea Center",
    "provider": "Golden Chickpea Center",
    "category": "life",
    "subcategory": "leadership",
    "tags": [
      "afterschool",
      "summer camp",
      "brookline",
      "enrichment",
      "childcare"
    ],
    "neighborhood": "brookline",
    "description": "The Golden Chickpea Center offers both an afterschool program and a summer program for children. The center provides enrichment activities and care in a supportive learning environment located in Brookline, MA.",
    "sentiment": "",
    "ageRange": "5-11",
    "cost": "Check website",
    "location": "Brookline",
    "url": "https://www.thegoldenchickpea.com/",
    "registrationDeadline": "Rolling admission",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10",
      "w11"
    ]
  },
  {
    "id": "bright-horizons-at-brookline-bright-horizons",
    "name": "Bright Horizons at Brookline",
    "provider": "Bright Horizons",
    "category": "life",
    "subcategory": "special-needs",
    "tags": [
      "daycare",
      "preschool",
      "early-education",
      "year-round",
      "NAEYC-accredited",
      "summer-program"
    ],
    "neighborhood": "brookline",
    "description": "This is a year-round early education facility (not a summer camp) serving ages 1 month to 6 years. The center offers infant care, toddler/twos, preschool, kindergarten prep, and kindergarten programs with a research-backed discovery-driven curriculum. During summer, they operate all year with weekly investigative topics like Adventure in the Arts, Science Sleuth, Nature Explorer, and STEM activities.",
    "sentiment": "",
    "ageRange": "2-5",
    "cost": "Check website",
    "location": "Brookline",
    "url": "https://child-care-preschool.brighthorizons.com/ma/brookline/brookline",
    "registrationDeadline": "Rolling admission",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10",
      "w11"
    ]
  },
  {
    "id": "summer-at-park-summer-at-park",
    "name": "Summer at Park",
    "provider": "Summer at Park",
    "category": "life",
    "subcategory": "leadership",
    "tags": [
      "day-camp",
      "multi-activity",
      "arts",
      "swimming",
      "ages-preK-10",
      "ACA-accredited"
    ],
    "neighborhood": "brookline",
    "description": "Summer at Park offers over 35 general and specialty day camp programs for kids PreK through 10th grade on The Park School's beautiful 34-acre campus and throughout New England. Campers swim, sing, make lifelong friendships, and discover new interests in a safe, fun atmosphere led by professional educators, many of whom are Park teachers. ACA-accredited programs provide opportunities for social engagement, discovery, and joyful summer experiences.",
    "sentiment": "I wanted to first say thank you for a wonderful summer - my 6-year-old absolutely loved the camp. She made new friends, loved swimming outdoors, and brought home amazing projects.",
    "ageRange": "4-15",
    "cost": "Check website",
    "location": "Brookline",
    "url": "https://www.summeratpark.org/",
    "registrationDeadline": "Rolling admission",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08"
    ]
  },
  {
    "id": "beaver-summer-camp-beaver-summer-camp",
    "name": "Beaver Summer Camp",
    "provider": "Beaver Summer Camp",
    "category": "life",
    "subcategory": "leadership",
    "tags": [
      "day camp",
      "multi-activity",
      "arts",
      "sports",
      "nature",
      "ages 3-15"
    ],
    "neighborhood": "brookline",
    "description": "Beaver Summer Camp is a day camp in Chestnut Hill offering 2-week General Camp sessions and 1-2 week Specialty Camps for kids ages 3-15. Campers enjoy swimming, arts, sports, nature exploration, and theatrical performances in an environment where joy and community connection are centered.",
    "sentiment": "The team at Beaver makes summer what we most hope for our kids, and for that we thank you all for your hard work, careful planning, creativity, tireless positive energy, and commitment to creating a space where kids feel connected.",
    "ageRange": "4-13",
    "cost": "Check website",
    "location": "Brookline",
    "url": "https://bvrcamp.org/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08"
    ]
  },
  {
    "id": "brookline-recreation-vendor-programs-brookline-recreation",
    "name": "Brookline Recreation Vendor Programs",
    "provider": "Brookline Recreation",
    "category": "life",
    "subcategory": "leadership",
    "tags": [
      "recreation",
      "brookline",
      "vendor programs",
      "financial aid",
      "community"
    ],
    "neighborhood": "brookline",
    "description": "Brookline Recreation Department offers vendor programs and camps for children in the Brookline area. The department provides a range of recreational activities and programs with financial aid available on a rolling basis year-round.",
    "sentiment": "",
    "ageRange": "5-12",
    "cost": "Check website",
    "location": "Brookline",
    "url": "https://www.brooklinerec.com/",
    "registrationDeadline": "Rolling admission",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "brookline-recreation-nature-camp-brookline-recreation",
    "name": "Brookline Recreation Nature Camp",
    "provider": "Brookline Recreation",
    "category": "life",
    "subcategory": "leadership",
    "tags": [
      "recreation",
      "brookline",
      "vendor programs",
      "financial aid",
      "community"
    ],
    "neighborhood": "brookline",
    "description": "Brookline Recreation Department offers vendor programs and camps for children in the Brookline area. The department provides a range of recreational activities and programs with financial aid available on a rolling basis year-round.",
    "sentiment": "",
    "ageRange": "5-13",
    "cost": "Check website",
    "location": "Brookline",
    "url": "https://www.brooklinerec.com/",
    "registrationDeadline": "Rolling admission",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09"
    ]
  },
  {
    "id": "brookline-recreation-brookline-recreation",
    "name": "Brookline Recreation",
    "provider": "Brookline Recreation",
    "category": "life",
    "subcategory": "leadership",
    "tags": [
      "recreation",
      "brookline",
      "vendor programs",
      "financial aid",
      "community"
    ],
    "neighborhood": "brookline",
    "description": "Brookline Recreation Department offers vendor programs and camps for children in the Brookline area. The department provides a range of recreational activities and programs with financial aid available on a rolling basis year-round.",
    "sentiment": "",
    "ageRange": "5-13",
    "cost": "Check website",
    "location": "Brookline",
    "url": "https://www.brooklinerec.com/",
    "registrationDeadline": "Rolling admission",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08"
    ]
  },
  {
    "id": "summer-at-soule-early-childhood-center-soule-early-childhood",
    "name": "Summer at Soule Early Childhood Center",
    "provider": "Soule Early Childhood Center",
    "category": "life",
    "subcategory": "leadership",
    "tags": [],
    "neighborhood": "brookline",
    "description": "Check website",
    "sentiment": "",
    "ageRange": "1-5",
    "cost": "Check website",
    "location": "Brookline",
    "url": "https://www.register.brooklinerec.com/brookline/programs",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09"
    ]
  },
  {
    "id": "corner-co-op-nursery-school-corner-co-op-nursery-school",
    "name": "Corner Co-Op Nursery School",
    "provider": "Corner Co-Op Nursery School",
    "category": "life",
    "subcategory": "special-needs",
    "tags": [
      "preschool",
      "toddler",
      "play-based",
      "summer program",
      "cooperative",
      "early-childhood"
    ],
    "neighborhood": "brookline",
    "description": "Corner Co-op's Summer 2026 Program offers play-based learning for toddlers and preschoolers on Tuesdays, Wednesdays, and Thursdays in July and August. Children explore, play, and connect in a creative environment where students, parents, and teachers work together sharing and learning.",
    "sentiment": "",
    "ageRange": "1-7",
    "cost": "Check website",
    "location": "Brookline",
    "url": "https://cornercoop.org/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "theater-arts-summer-program-brookline-recreation",
    "name": "Theater Arts Summer Program",
    "provider": "Brookline Recreation",
    "category": "life",
    "subcategory": "leadership",
    "tags": [],
    "neighborhood": "brookline",
    "description": "Check website",
    "sentiment": "",
    "ageRange": "5-13",
    "cost": "Check website",
    "location": "Brookline",
    "url": "https://www.register.brooklinerec.com/brookline/programs",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08"
    ]
  },
  {
    "id": "gan-israel-shaloh-house-gan-israel",
    "name": "Gan Israel Shaloh House",
    "provider": "Gan Israel",
    "category": "life",
    "subcategory": "leadership",
    "tags": [
      "Jewish camp",
      "multi-activity",
      "values-based",
      "community",
      "summer program",
      "Boston"
    ],
    "neighborhood": "norwood",
    "description": "Gan Israel offers a comprehensive Jewish summer camp experience with separate divisions for preschool, girls, and boys. The program features daily activities, weekly special events, and themed academies that combine recreation, education, and Jewish values in a vibrant community setting.",
    "sentiment": "",
    "ageRange": "3-11",
    "cost": "Check website",
    "location": "Allston-Brighton",
    "url": "https://www.cgiboston.com/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07"
    ]
  },
  {
    "id": "german-international-school-german-international-school",
    "name": "German International School",
    "provider": "German International School",
    "category": "life",
    "subcategory": "leadership",
    "tags": [
      "bilingual",
      "German immersion",
      "international curriculum",
      "preschool-grade6",
      "summer program",
      "language learning"
    ],
    "neighborhood": "norwood",
    "description": "German International School Boston offers a bilingual summer program for kids in preschool to grade 6 with no German experience needed. Students engage in a German-immersion curriculum that inspires curiosity, imagination, and a lifelong love of learning while developing multilingual skills.",
    "sentiment": "We simply fell in love with the community and the environment at GISB!",
    "ageRange": "3-11",
    "cost": "Check website",
    "location": "Allston-Brighton",
    "url": "https://gisbos.org/en/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w02",
      "w03",
      "w04",
      "w05"
    ]
  },
  {
    "id": "the-baker-center-fearless-friends-bravery-program-baker-cent",
    "name": "The Baker Center: Fearless Friends Bravery Program",
    "provider": "Baker Center",
    "category": "life",
    "subcategory": "special-needs",
    "tags": [
      "selective mutism",
      "social anxiety",
      "confidence building",
      "speech therapy",
      "therapeutic camp",
      "mental health"
    ],
    "neighborhood": "norwood",
    "description": "Fearless Friends is an intensive summer program designed to help kids ages 3-9 overcome selective mutism and social anxiety through 25 hours of supported brave speaking practice in just one week. The program mimics a school setting with enjoyable activities, field trips, and a 1-1 counselor-to-child ratio, while parents receive live coaching to continue supporting their child's progress at home.",
    "sentiment": "",
    "ageRange": "3-9",
    "cost": "$2,500",
    "location": "Fenway-Kenmore",
    "url": "https://www.bakercenter.org/fearlessfriends",
    "registrationDeadline": "April 30, 2026",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w08"
    ]
  },
  {
    "id": "ruggles-baptist-church-ruggles-baptist-church",
    "name": "Ruggles Baptist Church",
    "provider": "Ruggles Baptist Church",
    "category": "life",
    "subcategory": "leadership",
    "tags": [],
    "neighborhood": "norwood",
    "description": "",
    "sentiment": "",
    "ageRange": "4-11",
    "cost": "Check website",
    "location": "Fenway-Kenmore",
    "url": "https://www.facebook.com/rugglesbaptist/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w04"
    ]
  },
  {
    "id": "franklin-ymca-franklin-ymca",
    "name": "Franklin YMCA",
    "provider": "Franklin YMCA",
    "category": "life",
    "subcategory": "leadership",
    "tags": [
      "ymca",
      "day camp",
      "discovery",
      "nature",
      "summer camp",
      "all ages"
    ],
    "neighborhood": "franklin",
    "description": "Kids explore nature, discover new talents, and try new activities while gaining independence and making lasting friendships at YMCA camps. The Y offers overnight, day, and specialty camps focused on discovery, fun, and memorable experiences.",
    "sentiment": "",
    "ageRange": "3-15",
    "cost": "Check website",
    "location": "Franklin",
    "url": "https://www.hockymca.org/franklin/youth-development/camp/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10",
      "w11"
    ]
  },
  {
    "id": "elemen-tree-house-elemen-tree-house",
    "name": "Elemen-Tree House",
    "provider": "Elemen-Tree House",
    "category": "life",
    "subcategory": "leadership",
    "tags": [
      "summer camp",
      "full-time",
      "field trips",
      "swimming",
      "arts and crafts"
    ],
    "neighborhood": "franklin",
    "description": "Camp LMNTREE offers a variety of weekly theme-based activities and field trips where campers engage in group games, free swim, arts and crafts, and age-appropriate outings. Children are encouraged to participate in planning their own unique camp experience, with a certified lifeguard on duty at all times to ensure safety and well-being.",
    "sentiment": "",
    "ageRange": "5-14",
    "cost": "Check website",
    "location": "Franklin",
    "url": "https://www.elementreehouse.com/summer-camp",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10",
      "w11"
    ]
  },
  {
    "id": "milford-community-school-use-program-milford-community-schoo",
    "name": "Milford Community School Use Program",
    "provider": "Milford Community School",
    "category": "life",
    "subcategory": "leadership",
    "tags": [
      "community-program",
      "year-round",
      "recreational",
      "educational",
      "multi-age"
    ],
    "neighborhood": "milford",
    "description": "The Milford Community School Use Program offers year-round recreational, educational and cultural activities for children, teens, adults and seniors. Programs are designed to meet varying needs and interests of local residents while utilizing the town's school buildings when school is not in session.",
    "sentiment": "",
    "ageRange": "5-17",
    "cost": "Check website",
    "location": "Milford",
    "url": "https://milfordcommunityprogram.activityreg.com/ClientPage_t2.wcs",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08"
    ]
  },
  {
    "id": "milford-youth-center-milford-youth-center",
    "name": "Milford Youth Center",
    "provider": "Milford Youth Center",
    "category": "life",
    "subcategory": "leadership",
    "tags": [
      "youth center",
      "summer camp",
      "community program",
      "ages 8-18",
      "multi-activity"
    ],
    "neighborhood": "milford",
    "description": "Milford Youth Center offers a summer camp program for youth ages 8-18 during the summer months. The facility provides a transition from the after-school program with activities and programming in a community-based youth center setting.",
    "sentiment": "",
    "ageRange": "8-14",
    "cost": "Check website",
    "location": "Milford",
    "url": "https://milfordyouthcenter.org/",
    "registrationDeadline": "Check website",
    "documents": [
      "Health Care Policy",
      "Weather Advisory",
      "Pick Up Policy"
    ],
    "weeks": [
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08"
    ]
  },
  {
    "id": "junior-day-camp-summer-at-norwood",
    "name": "Junior Day Camp",
    "provider": "Summer at Norwood",
    "category": "life",
    "subcategory": "leadership",
    "tags": [
      "day camp",
      "preschool",
      "early childhood",
      "junior day camp",
      "ages 3.5-5",
      "early learners",
      "summer program"
    ],
    "neighborhood": "norwood",
    "description": "Junior Day Camp serves children ages 3.5-5 years old, offering an engaging summer experience with activities designed for early learners. The camp is part of Summer at Norwood's comprehensive program options for children from preschool through rising 9th grade.",
    "sentiment": "",
    "ageRange": "5-14",
    "cost": "Check website",
    "location": "Norwood School, Norwood",
    "url": "https://www.summeratnorwood.org/programs",
    "registrationDeadline": "Rolling admission",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "day-camp-summer-at-norwood",
    "name": "Day Camp",
    "provider": "Summer at Norwood",
    "category": "life",
    "subcategory": "leadership",
    "tags": [
      "day camp",
      "elementary",
      "multi-activity",
      "junior day camp",
      "ages 3.5-5",
      "preschool",
      "early learners",
      "summer program"
    ],
    "neighborhood": "norwood",
    "description": "Junior Day Camp serves children ages 3.5-5 years old, offering an engaging summer experience with activities designed for early learners. The camp is part of Summer at Norwood's comprehensive program options for children from preschool through rising 9th grade.",
    "sentiment": "",
    "ageRange": "6-11",
    "cost": "Check website",
    "location": "Norwood School, Norwood",
    "url": "https://www.summeratnorwood.org/programs",
    "registrationDeadline": "Rolling admission",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "ms-academies-summer-at-norwood",
    "name": "MS Academies",
    "provider": "Summer at Norwood",
    "category": "life",
    "subcategory": "leadership",
    "tags": [
      "middle school",
      "academies",
      "enrichment",
      "junior day camp",
      "ages 3.5-5",
      "preschool",
      "day camp",
      "early learners"
    ],
    "neighborhood": "norwood",
    "description": "Junior Day Camp serves children ages 3.5-5 years old, offering an engaging summer experience with activities designed for early learners. The camp is part of Summer at Norwood's comprehensive program options for children from preschool through rising 9th grade.",
    "sentiment": "",
    "ageRange": "10-13",
    "cost": "Check website",
    "location": "Norwood School, Norwood",
    "url": "https://www.summeratnorwood.org/programs",
    "registrationDeadline": "Rolling admission",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "adventure-camp-summer-at-norwood",
    "name": "Adventure Camp",
    "provider": "Summer at Norwood",
    "category": "life",
    "subcategory": "leadership",
    "tags": [
      "adventure",
      "middle school",
      "outdoor",
      "junior day camp",
      "ages 3.5-5",
      "preschool",
      "day camp",
      "early learners"
    ],
    "neighborhood": "norwood",
    "description": "Junior Day Camp serves children ages 3.5-5 years old, offering an engaging summer experience with activities designed for early learners. The camp is part of Summer at Norwood's comprehensive program options for children from preschool through rising 9th grade.",
    "sentiment": "",
    "ageRange": "10-14",
    "cost": "Check website",
    "location": "Norwood School, Norwood",
    "url": "https://www.summeratnorwood.org/programs",
    "registrationDeadline": "Rolling admission",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "stony-brook-nature-camp-mass-audubon",
    "name": "Stony Brook Nature Camp",
    "provider": "Mass Audubon",
    "category": "life",
    "subcategory": "leadership",
    "tags": [
      "wildlife",
      "forest",
      "wetlands",
      "ecosystem",
      "outdoor exploration",
      "nature-study",
      "outdoor-exploration",
      "hands-on-learning"
    ],
    "neighborhood": "norfolk",
    "description": "At Stony Brook Nature Camp, children ages 4-15 explore the wildlife sanctuary's forest, fields, and wetlands during weekly sessions. Campers engage in trail explorations, hands-on activities, games, and crafts that provide full ecosystem immersion, supported by small group sizes that ensure a welcoming environment.",
    "sentiment": "I found the camp counselors so welcoming and warm to the campers. I am so pleased with this experience and will definitely sign up again next summer.",
    "ageRange": "4-15",
    "cost": "Varies",
    "location": "Stony Brook Wildlife Sanctuary, Norfolk, MA",
    "url": "https://www.massaudubon.org/places-to-explore/wildlife-sanctuaries/stony-brook/camp",
    "registrationDeadline": "January 21, 2026",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "camp-weyfun-wessagusset-weymouth-parks-and-recreation-depart",
    "name": "Camp WeyFun @ Wessagusset",
    "provider": "Weymouth Parks and Recreation Department",
    "category": "life",
    "subcategory": "leadership",
    "tags": [
      "day camp",
      "licensed camp",
      "state vouchers accepted"
    ],
    "neighborhood": "weymouth",
    "description": "A traditional day camp offering various activities and specialty programs for children ages 3-15 at Wessagusset Primary School.",
    "sentiment": "",
    "ageRange": "3-15",
    "cost": "$310/week",
    "location": "Wessagusset Primary School, 75 Pilgrim Road, Weymouth",
    "url": "https://www.weymouth.ma.us/1960/Weymouth-Recreation-Summer-Day-Camps",
    "registrationDeadline": "March 4, 2026 for Weymouth residents; April 8, 2026 for non-residents",
    "documents": [
      "Health Form"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "camp-weyfun-great-esker-park-weymouth-parks-and-recreation-d",
    "name": "Camp WeyFun @ Great Esker Park",
    "provider": "Weymouth Parks and Recreation Department",
    "category": "life",
    "subcategory": "leadership",
    "tags": [
      "day camp",
      "licensed camp",
      "state vouchers accepted"
    ],
    "neighborhood": "weymouth",
    "description": "A traditional day camp with various activities and specialty programs for children ages 4-15 at Great Esker Park.",
    "sentiment": "",
    "ageRange": "4-15",
    "cost": "$310/week",
    "location": "Great Esker Park, 0 Elva Road N, Weymouth",
    "url": "https://www.weymouth.ma.us/1960/Weymouth-Recreation-Summer-Day-Camps",
    "registrationDeadline": "March 4, 2026 for Weymouth residents; April 8, 2026 for non-residents",
    "documents": [
      "Health Form"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "great-esker-park-nature-camp-weymouth-parks-and-recreation-d",
    "name": "Great Esker Park Nature Camp",
    "provider": "Weymouth Parks and Recreation Department",
    "category": "life",
    "subcategory": "leadership",
    "tags": [
      "day camp",
      "nature",
      "licensed camp"
    ],
    "neighborhood": "weymouth",
    "description": "A nature-focused camp program at Great Esker Park for children ages 4-15.",
    "sentiment": "",
    "ageRange": "4-15",
    "cost": "$310/week",
    "location": "Great Esker Park, 0 Elva Road N, Weymouth",
    "url": "https://www.weymouth.ma.us/1960/Weymouth-Recreation-Summer-Day-Camps",
    "registrationDeadline": "March 4, 2026 for Weymouth residents; April 8, 2026 for non-residents",
    "documents": [
      "Health Form"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "pond-meadow-park-nature-program-weymouth-parks-and-recreatio",
    "name": "Pond Meadow Park Nature Program",
    "provider": "Weymouth Parks and Recreation Department",
    "category": "life",
    "subcategory": "leadership",
    "tags": [
      "day camp",
      "nature",
      "Weymouth and Braintree residents only"
    ],
    "neighborhood": "weymouth",
    "description": "A nature program at Pond Meadow Park for Weymouth and Braintree residents only.",
    "sentiment": "",
    "ageRange": "5-14",
    "cost": "Check website",
    "location": "Pond Meadow Park, Weymouth",
    "url": "https://www.weymouth.ma.us/1960/Weymouth-Recreation-Summer-Day-Camps",
    "registrationDeadline": "March 18, 2026",
    "documents": [
      "Health Form"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "weymouth-junior-police-academy-weymouth-parks-and-recreation",
    "name": "Weymouth Junior Police Academy",
    "provider": "Weymouth Parks and Recreation Department",
    "category": "life",
    "subcategory": "leadership",
    "tags": [
      "day camp",
      "police academy",
      "Weymouth residents only",
      "rolling registration"
    ],
    "neighborhood": "weymouth",
    "description": "A specialized program for fourth graders moving into fifth grade to learn about law enforcement and police work.",
    "sentiment": "",
    "ageRange": "9-10",
    "cost": "Check website",
    "location": "Weymouth",
    "url": "https://www.weymouth.ma.us/1960/Weymouth-Recreation-Summer-Day-Camps",
    "registrationDeadline": "Rolling registration beginning April 1, 2026",
    "documents": [
      "Camp ID required",
      "Health Form"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "day-camp-hockomock-area-ymca",
    "name": "Day Camp",
    "provider": "Hockomock Area YMCA",
    "category": "life",
    "subcategory": "leadership",
    "tags": [
      "day camp",
      "YMCA",
      "youth development",
      "summer camp",
      "nature exploration",
      "multi-activity"
    ],
    "neighborhood": "foxborough",
    "description": "The Foxboro YMCA offers overnight, day, and specialty camps where kids explore nature, discover new talents, try new activities, and gain independence while making lasting friendships and memories. Programs include Day Camp and School Break Camp options designed for discovery and fun.",
    "sentiment": "",
    "ageRange": "3-18",
    "cost": "Check website",
    "location": "67 Mechanic Street, Foxborough, MA",
    "url": "https://www.hockymca.org/foxboro/youth-development/camp/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "school-break-camp-hockomock-area-ymca",
    "name": "School Break Camp",
    "provider": "Hockomock Area YMCA",
    "category": "life",
    "subcategory": "leadership",
    "tags": [
      "school break camp",
      "YMCA",
      "youth development",
      "day camp",
      "summer camp",
      "nature exploration",
      "multi-activity"
    ],
    "neighborhood": "foxborough",
    "description": "The Foxboro YMCA offers overnight, day, and specialty camps where kids explore nature, discover new talents, try new activities, and gain independence while making lasting friendships and memories. Programs include Day Camp and School Break Camp options designed for discovery and fun.",
    "sentiment": "",
    "ageRange": "3-18",
    "cost": "Check website",
    "location": "67 Mechanic Street, Foxborough, MA",
    "url": "https://www.hockymca.org/foxboro/youth-development/camp/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "dch-summer-camp-dch-dedham-community-house",
    "name": "DCH Summer Camp",
    "provider": "DCH (Dedham Community House)",
    "category": "life",
    "subcategory": "leadership",
    "tags": [
      "traditional camp",
      "arts and crafts",
      "sports",
      "swimming",
      "drama",
      "games",
      "traditional-camp",
      "arts-crafts"
    ],
    "neighborhood": "dedham",
    "description": "DCH Summer Camp offers children entering Kindergarten through 6th grade the quintessential camp experience with traditional arts and crafts, sports, games, drama, swimming, and more on a gorgeous Dedham campus. Since 1924, the camp has brought together children from the local area for fun, safe, and enriching summer activities. The camp creates core memories, builds lifelong friendships, and helps children develop key life skills.",
    "sentiment": "You will hear the unmistakable laughter and happy shrieks of a bustling summer camp in action.",
    "ageRange": "5-11",
    "cost": "Check website",
    "location": "Dedham Square, Dedham",
    "url": "https://www.dchma.org/summer-camp",
    "registrationDeadline": "January 13, 2026",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "dch-cit-program-counselor-in-training-dch-dedham-community-h",
    "name": "DCH CIT Program (Counselor In Training)",
    "provider": "DCH (Dedham Community House)",
    "category": "life",
    "subcategory": "leadership",
    "tags": [
      "leadership",
      "teen program",
      "counselor training",
      "team-building",
      "life skills",
      "traditional-camp",
      "arts-crafts",
      "sports"
    ],
    "neighborhood": "dedham",
    "description": "DCH Summer Camp offers children entering Kindergarten through 6th grade the quintessential camp experience with traditional arts and crafts, sports, games, drama, swimming, and more on a gorgeous Dedham campus. Since 1924, the camp has brought together children from the local area for fun, safe, and enriching summer activities. The camp creates core memories, builds lifelong friendships, and helps children develop key life skills.",
    "sentiment": "If you drive by DCH on a hot summer day, you will hear the unmistakable laughter and happy shrieks of a bustling summer camp in action.",
    "ageRange": "14-15",
    "cost": "Check website",
    "location": "Dedham Square, Dedham",
    "url": "https://www.dchma.org/summer-camp",
    "registrationDeadline": "January 13, 2026",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "linx-camps-linx-camps",
    "name": "LINX Camps",
    "provider": "LINX Camps",
    "category": "life",
    "subcategory": "leadership",
    "tags": [
      "summer camp",
      "variety",
      "fun",
      "multi-activity",
      "arts",
      "sports",
      "STEAM",
      "adventure"
    ],
    "neighborhood": "wellesley",
    "description": "LINX Camps offers a variety of summer experiences including adventure, arts, general camp, junior programs, leadership, sports, and STEAM camps. Campers enjoy activities ranging from rock climbing and water games to Broadway theater and cupcake battles, with flexible scheduling across multiple weeks throughout the summer.",
    "sentiment": "",
    "ageRange": "3-18",
    "cost": "$879/week",
    "location": "Wellesley, MA",
    "url": "https://www.linxcamps.com/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "campus-camps-holbrook-rec-program-campus-camps",
    "name": "Campus Camps Holbrook Rec Program",
    "provider": "Campus Camps",
    "category": "life",
    "subcategory": "leadership",
    "tags": [
      "recreation",
      "flexible",
      "day camp",
      "multi-program",
      "flexible scheduling",
      "long-island",
      "day-camp",
      "academies"
    ],
    "neighborhood": "holbrook",
    "description": "Campus Camps offers flexible summer camp options including a Traditional Day Camp for K-8th graders, specialized Prep Program for ages 3-5, Graduate Travel Program for 7th-8th graders, CIT/PhD Training Program for 9th-10th graders, and specialized Academies in Culinary, Performing Arts, Photography, and Sports. With locations in Yaphank and Blue Point, there is something for every child's interests and age group.",
    "sentiment": "",
    "ageRange": "3-14",
    "cost": "Check website",
    "location": "Holbrook, MA",
    "url": "https://www.campus-camps.com/",
    "registrationDeadline": "Rolling admission",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "camp-wey-fun-wessagusset-weymouth-recreation",
    "name": "Camp Wey-Fun @ Wessagusset",
    "provider": "Weymouth Recreation",
    "category": "life",
    "subcategory": "leadership",
    "tags": [
      "water-sports",
      "beach",
      "soccer",
      "basketball",
      "kayaking",
      "paddle-boarding",
      "arts-and-crafts",
      "inclusive"
    ],
    "neighborhood": "weymouth",
    "description": "Camp Wey-Fun offers children ages 5-12 the unique ability to choose most of their activities every day across three primary locations: Wessagusset Beach (swimming, kayaking, stand-up paddle-boarding, beach games), O'Sullivan Park (soccer, street hockey, basketball, kickball, competitive sports), and Wessagusset Primary School (art projects, talent shows, tie-dying, board games). Children are grouped by age and cohorts following Massachusetts Camp guidelines and CDC/DPH protocols.",
    "sentiment": "",
    "ageRange": "3-15",
    "cost": "Check website",
    "location": "Wessagusset Beach, O'Sullivan Park, and Wessagusset Primary School, Weymouth",
    "url": "https://weymouthma.myrec.com/info/activities/program_details.aspx?ProgramID=28493",
    "registrationDeadline": "March 4, 2026",
    "documents": [
      "Health form"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "mass-audubon-stony-brook-day-camp-mass-audubon",
    "name": "Mass Audubon Stony Brook Day Camp",
    "provider": "Mass Audubon",
    "category": "life",
    "subcategory": "leadership",
    "tags": [
      "nature exploration",
      "wildlife",
      "outdoor learning",
      "hands-on activities",
      "sanctuary",
      "ecology",
      "nature-camp",
      "outdoor-learning"
    ],
    "neighborhood": "norfolk",
    "description": "A nature day camp where children ages 4-16 explore a 244-acre wildlife sanctuary through trail explorations, hands-on activities, games, and crafts. Campers investigate four varied habitats (pond, wetland, field, and forest) and learn to become young naturalists and junior scientists.",
    "sentiment": "ACA-accredited camp with well-trained, energetic staff and a one-of-a-kind summer experience in an extensive 244-acre sanctuary with unique boardwalk system.",
    "ageRange": "4-16",
    "cost": "Check website",
    "location": "108 North Street, Norfolk, Massachusetts 02056",
    "url": "https://www.massaudubon.org",
    "registrationDeadline": "Check website",
    "documents": [
      "Health form",
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "hockomock-area-ymca-youth-programs-and-camps-foxboro-day-cam",
    "name": "Hockomock Area YMCA Youth Programs and Camps - Foxboro Day Camp",
    "provider": "Hockomock Area YMCA",
    "category": "life",
    "subcategory": "leadership",
    "tags": [
      "soccer",
      "nature",
      "cooking",
      "swim",
      "sports",
      "arts",
      "enrichment",
      "leadership"
    ],
    "neighborhood": "foxborough",
    "description": "Hockomock Area YMCA offers comprehensive day camps and youth programs featuring swim lessons, sports, recreation, arts and enrichment activities. The camp includes specialty programs, academic enrichment, and leadership development for children of various ages throughout the summer.",
    "sentiment": "",
    "ageRange": "3-18",
    "cost": "Check website",
    "location": "Invensys Foxboro Branch – Hockomock Area YMCA, 67 Mechanic St, Foxborough, MA 02035",
    "url": "https://enrichment.kids/ma/foxborough/foxboro-day-camp",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "tenacre-summer-programs-day-camp-tenacre-country-day-school",
    "name": "Tenacre Summer Programs - Day Camp",
    "provider": "Tenacre Country Day School",
    "category": "life",
    "subcategory": "leadership",
    "tags": [
      "traditional camp",
      "sports",
      "crafts",
      "archery",
      "nature",
      "science",
      "music",
      "ropes course"
    ],
    "neighborhood": "wellesley",
    "description": "The Three's Program at Tenacre Summer is designed for three-year-olds and offers a nurturing, noncompetitive camp environment with traditional activities like sports, crafts, archery, nature, science, and music. Every camper receives a swimming lesson every day in a supportive setting that fosters self-esteem and individual accomplishments.",
    "sentiment": "I value the professionalism of the staff and the confidence I have that they are taking care of my child and ensuring his safety and opportunity to explore new things (especially swimming).",
    "ageRange": "3-12",
    "cost": "Check website",
    "location": "80 Benvenue Street, Wellesley",
    "url": "https://www.tenacrecds.org/summer-programs",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "tenacre-summer-programs-specialty-camps-tenacre-country-day-",
    "name": "Tenacre Summer Programs - Specialty Camps",
    "provider": "Tenacre Country Day School",
    "category": "life",
    "subcategory": "leadership",
    "tags": [
      "specialty programs",
      "two-week sessions",
      "interests-based",
      "day camp",
      "ages 3+",
      "traditional camp activities",
      "swimming lessons",
      "noncompetitive"
    ],
    "neighborhood": "wellesley",
    "description": "The Three's Program at Tenacre Summer is designed for three-year-olds and offers a nurturing, noncompetitive camp environment with traditional activities like sports, crafts, archery, nature, science, and music. Every camper receives a swimming lesson every day in a supportive setting that fosters self-esteem and individual accomplishments.",
    "sentiment": "I value the professionalism of the staff and the confidence I have that they are taking care of my child and ensuring his safety and opportunity to explore new things (especially swimming).",
    "ageRange": "3-6",
    "cost": "Check website",
    "location": "80 Benvenue Street, Wellesley",
    "url": "https://www.tenacrecds.org/summer-programs",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "tenacre-summer-programs-june-swim-lessons-tenacre-country-da",
    "name": "Tenacre Summer Programs - June Swim Lessons",
    "provider": "Tenacre Country Day School",
    "category": "life",
    "subcategory": "leadership",
    "tags": [
      "swim lessons",
      "30-minute lessons",
      "day camp",
      "ages 3+",
      "traditional camp activities",
      "swimming lessons",
      "noncompetitive"
    ],
    "neighborhood": "wellesley",
    "description": "The Three's Program at Tenacre Summer is designed for three-year-olds and offers a nurturing, noncompetitive camp environment with traditional activities like sports, crafts, archery, nature, science, and music. Every camper receives a swimming lesson every day in a supportive setting that fosters self-esteem and individual accomplishments.",
    "sentiment": "I value the professionalism of the staff and the confidence I have that they are taking care of my child and ensuring his safety and opportunity to explore new things (especially swimming).",
    "ageRange": "3-12",
    "cost": "Check website",
    "location": "80 Benvenue Street, Wellesley",
    "url": "https://www.tenacrecds.org/summer-programs",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "tenacre-summer-programs-rising-star-sports-tenacre-country-d",
    "name": "Tenacre Summer Programs - Rising Star Sports",
    "provider": "Tenacre Country Day School",
    "category": "life",
    "subcategory": "leadership",
    "tags": [
      "soccer",
      "t-ball",
      "baseball",
      "skills building",
      "confidence building",
      "day camp",
      "ages 3+",
      "traditional camp activities"
    ],
    "neighborhood": "wellesley",
    "description": "The Three's Program at Tenacre Summer is designed for three-year-olds and offers a nurturing, noncompetitive camp environment with traditional activities like sports, crafts, archery, nature, science, and music. Every camper receives a swimming lesson every day in a supportive setting that fosters self-esteem and individual accomplishments.",
    "sentiment": "I value the professionalism of the staff and the confidence I have that they are taking care of my child and ensuring his safety and opportunity to explore new things (especially swimming).",
    "ageRange": "3-7",
    "cost": "Check website",
    "location": "80 Benvenue Street, Wellesley",
    "url": "https://www.tenacrecds.org/summer-programs",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "summer-at-park-day-camp-the-park-school",
    "name": "Summer at Park - Day Camp",
    "provider": "The Park School",
    "category": "life",
    "subcategory": "leadership",
    "tags": [
      "general camp",
      "day camp",
      "PreK-10th grade",
      "ACA-accredited",
      "day-camp",
      "multi-activity",
      "arts",
      "swimming"
    ],
    "neighborhood": "brookline",
    "description": "Summer at Park offers over 35 general and specialty day camp programs for kids PreK through 10th grade on The Park School's beautiful 34-acre campus and throughout New England. Campers swim, sing, make lifelong friendships, and discover new interests in a safe, fun atmosphere led by professional educators, many of whom are Park teachers. ACA-accredited programs provide opportunities for social engagement, discovery, and joyful summer experiences.",
    "sentiment": "My 6-year-old absolutely loved the camp. She made new friends, loved swimming outdoors, and brought home amazing projects.",
    "ageRange": "3-15",
    "cost": "Check website",
    "location": "The Park School, Brookline, MA",
    "url": "https://www.summeratpark.org/",
    "registrationDeadline": "Rolling admission",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "summer-at-park-sports-camp-the-park-school",
    "name": "Summer at Park - Sports Camp",
    "provider": "The Park School",
    "category": "life",
    "subcategory": "leadership",
    "tags": [
      "sports",
      "day camp",
      "ACA-accredited",
      "day-camp",
      "multi-activity",
      "arts",
      "swimming",
      "ages-preK-10"
    ],
    "neighborhood": "brookline",
    "description": "Summer at Park offers over 35 general and specialty day camp programs for kids PreK through 10th grade on The Park School's beautiful 34-acre campus and throughout New England. Campers swim, sing, make lifelong friendships, and discover new interests in a safe, fun atmosphere led by professional educators, many of whom are Park teachers. ACA-accredited programs provide opportunities for social engagement, discovery, and joyful summer experiences.",
    "sentiment": "I wanted to first say thank you for a wonderful summer - my 6-year-old absolutely loved the camp. She made new friends, loved swimming outdoors, and brought home amazing projects.",
    "ageRange": "3-15",
    "cost": "Check website",
    "location": "The Park School, Brookline, MA",
    "url": "https://www.summeratpark.org/",
    "registrationDeadline": "Rolling admission",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "summer-at-park-science-technology-the-park-school",
    "name": "Summer at Park - Science & Technology",
    "provider": "The Park School",
    "category": "life",
    "subcategory": "leadership",
    "tags": [
      "science",
      "technology",
      "day camp",
      "ACA-accredited",
      "day-camp",
      "multi-activity",
      "arts",
      "swimming"
    ],
    "neighborhood": "brookline",
    "description": "Summer at Park offers over 35 general and specialty day camp programs for kids PreK through 10th grade on The Park School's beautiful 34-acre campus and throughout New England. Campers swim, sing, make lifelong friendships, and discover new interests in a safe, fun atmosphere led by professional educators, many of whom are Park teachers. ACA-accredited programs provide opportunities for social engagement, discovery, and joyful summer experiences.",
    "sentiment": "I wanted to first say thank you for a wonderful summer - my 6-year-old absolutely loved the camp. She made new friends, loved swimming outdoors, and brought home amazing projects.",
    "ageRange": "3-15",
    "cost": "Check website",
    "location": "The Park School, Brookline, MA",
    "url": "https://www.summeratpark.org/",
    "registrationDeadline": "Rolling admission",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "india-s-artventures-the-park-school",
    "name": "India's ARTventures",
    "provider": "The Park School",
    "category": "life",
    "subcategory": "leadership",
    "tags": [
      "arts",
      "specialty camp",
      "creative projects",
      "day-camp",
      "multi-activity",
      "swimming",
      "ages-preK-10",
      "ACA-accredited"
    ],
    "neighborhood": "brookline",
    "description": "Summer at Park offers over 35 general and specialty day camp programs for kids PreK through 10th grade on The Park School's beautiful 34-acre campus and throughout New England. Campers swim, sing, make lifelong friendships, and discover new interests in a safe, fun atmosphere led by professional educators, many of whom are Park teachers. ACA-accredited programs provide opportunities for social engagement, discovery, and joyful summer experiences.",
    "sentiment": "She loved India's ARTventures and brought home amazing projects.",
    "ageRange": "3-15",
    "cost": "Check website",
    "location": "The Park School, Brookline, MA",
    "url": "https://www.summeratpark.org/",
    "registrationDeadline": "Rolling admission",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "lily-pad-camp-the-park-school",
    "name": "Lily Pad Camp",
    "provider": "The Park School",
    "category": "life",
    "subcategory": "leadership",
    "tags": [
      "general camp",
      "day camp",
      "swimming",
      "day-camp",
      "multi-activity",
      "arts",
      "ages-preK-10",
      "ACA-accredited"
    ],
    "neighborhood": "brookline",
    "description": "Summer at Park offers over 35 general and specialty day camp programs for kids PreK through 10th grade on The Park School's beautiful 34-acre campus and throughout New England. Campers swim, sing, make lifelong friendships, and discover new interests in a safe, fun atmosphere led by professional educators, many of whom are Park teachers. ACA-accredited programs provide opportunities for social engagement, discovery, and joyful summer experiences.",
    "sentiment": "She loved the general Lily Pad camp - she said she wants to do the Lily Pad all next summer!!",
    "ageRange": "3-8",
    "cost": "Check website",
    "location": "The Park School, Brookline, MA",
    "url": "https://www.summeratpark.org/",
    "registrationDeadline": "Rolling admission",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "summer-at-park-counselors-in-training-the-park-school",
    "name": "Summer at Park - Counselors in Training",
    "provider": "The Park School",
    "category": "life",
    "subcategory": "leadership",
    "tags": [
      "CIT",
      "counselor training",
      "leadership development",
      "day-camp",
      "multi-activity",
      "arts",
      "swimming",
      "ages-preK-10"
    ],
    "neighborhood": "brookline",
    "description": "Summer at Park offers over 35 general and specialty day camp programs for kids PreK through 10th grade on The Park School's beautiful 34-acre campus and throughout New England. Campers swim, sing, make lifelong friendships, and discover new interests in a safe, fun atmosphere led by professional educators, many of whom are Park teachers. ACA-accredited programs provide opportunities for social engagement, discovery, and joyful summer experiences.",
    "sentiment": "I wanted to first say thank you for a wonderful summer - my 6-year-old absolutely loved the camp. She made new friends, loved swimming outdoors, and brought home amazing projects.",
    "ageRange": "13-18",
    "cost": "Check website",
    "location": "The Park School, Brookline, MA",
    "url": "https://www.summeratpark.org/",
    "registrationDeadline": "Rolling admission",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "camp-thayer-lower-camp-thayer-academy",
    "name": "Camp Thayer Lower Camp",
    "provider": "Thayer Academy",
    "category": "life",
    "subcategory": "leadership",
    "tags": [
      "general camp",
      "young children",
      "activities",
      "preschool",
      "day-camp",
      "ages-4-5",
      "swimming",
      "arts-crafts"
    ],
    "neighborhood": "dedham",
    "description": "Camp Thayer's Lower Camp features activities scaled to size for young children ages 3.9 to 5, with a staff-to-child ratio of 1:5. Kids enjoy a set schedule of activities and remain with their groups and counselors throughout the day, participating in swimming, arts & crafts, and age-appropriate recreational activities from 9 a.m. to 2 p.m.",
    "sentiment": "",
    "ageRange": "3-5",
    "cost": "$508/week",
    "location": "Thayer Academy, Dedham",
    "url": "https://www.thayer.org/camp-thayer/programs",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "camp-thayer-general-camp-thayer-academy",
    "name": "Camp Thayer General Camp",
    "provider": "Thayer Academy",
    "category": "life",
    "subcategory": "leadership",
    "tags": [
      "general camp",
      "multi-activity",
      "co-ed",
      "preschool",
      "day-camp",
      "ages-4-5",
      "swimming",
      "arts-crafts"
    ],
    "neighborhood": "dedham",
    "description": "Camp Thayer's Lower Camp features activities scaled to size for young children ages 3.9 to 5, with a staff-to-child ratio of 1:5. Kids enjoy a set schedule of activities and remain with their groups and counselors throughout the day, participating in swimming, arts & crafts, and age-appropriate recreational activities from 9 a.m. to 2 p.m.",
    "sentiment": "",
    "ageRange": "6-13",
    "cost": "$508/week",
    "location": "Thayer Academy, Dedham",
    "url": "https://www.thayer.org/camp-thayer/programs",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "camp-thayer-cit-program-thayer-academy",
    "name": "Camp Thayer CIT Program",
    "provider": "Thayer Academy",
    "category": "life",
    "subcategory": "leadership",
    "tags": [
      "leadership",
      "counselor training",
      "apprenticeship",
      "preschool",
      "day-camp",
      "ages-4-5",
      "swimming",
      "arts-crafts"
    ],
    "neighborhood": "dedham",
    "description": "Camp Thayer's Lower Camp features activities scaled to size for young children ages 3.9 to 5, with a staff-to-child ratio of 1:5. Kids enjoy a set schedule of activities and remain with their groups and counselors throughout the day, participating in swimming, arts & crafts, and age-appropriate recreational activities from 9 a.m. to 2 p.m.",
    "sentiment": "",
    "ageRange": "14-15",
    "cost": "$508/week",
    "location": "Thayer Academy, Dedham",
    "url": "https://www.thayer.org/camp-thayer/programs",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "camp-thayer-basketball-skills-drills-thayer-academy",
    "name": "Camp Thayer Basketball Skills & Drills",
    "provider": "Thayer Academy",
    "category": "life",
    "subcategory": "leadership",
    "tags": [
      "basketball",
      "skills",
      "non-competitive",
      "lunch included",
      "free swim",
      "preschool",
      "day-camp",
      "ages-4-5"
    ],
    "neighborhood": "dedham",
    "description": "Camp Thayer's Lower Camp features activities scaled to size for young children ages 3.9 to 5, with a staff-to-child ratio of 1:5. Kids enjoy a set schedule of activities and remain with their groups and counselors throughout the day, participating in swimming, arts & crafts, and age-appropriate recreational activities from 9 a.m. to 2 p.m.",
    "sentiment": "",
    "ageRange": "8-13",
    "cost": "$508/week",
    "location": "Thayer Academy, Dedham",
    "url": "https://www.thayer.org/camp-thayer/programs",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "camp-thayer-theater-camp-singin-in-the-rain-thayer-academy",
    "name": "Camp Thayer Theater Camp - Singin' in the Rain",
    "provider": "Thayer Academy",
    "category": "life",
    "subcategory": "leadership",
    "tags": [
      "theater",
      "musical",
      "singing",
      "dancing",
      "acting",
      "lunch included",
      "free swim",
      "preschool"
    ],
    "neighborhood": "dedham",
    "description": "Camp Thayer's Lower Camp features activities scaled to size for young children ages 3.9 to 5, with a staff-to-child ratio of 1:5. Kids enjoy a set schedule of activities and remain with their groups and counselors throughout the day, participating in swimming, arts & crafts, and age-appropriate recreational activities from 9 a.m. to 2 p.m.",
    "sentiment": "",
    "ageRange": "6-9",
    "cost": "$508/week",
    "location": "Thayer Academy, Dedham",
    "url": "https://www.thayer.org/camp-thayer/programs",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "camp-thayer-theater-camp-wizard-of-oz-thayer-academy",
    "name": "Camp Thayer Theater Camp - Wizard of Oz",
    "provider": "Thayer Academy",
    "category": "life",
    "subcategory": "leadership",
    "tags": [
      "theater",
      "musical",
      "singing",
      "dancing",
      "acting",
      "lunch included",
      "free swim",
      "preschool"
    ],
    "neighborhood": "dedham",
    "description": "Camp Thayer's Lower Camp features activities scaled to size for young children ages 3.9 to 5, with a staff-to-child ratio of 1:5. Kids enjoy a set schedule of activities and remain with their groups and counselors throughout the day, participating in swimming, arts & crafts, and age-appropriate recreational activities from 9 a.m. to 2 p.m.",
    "sentiment": "",
    "ageRange": "9-13",
    "cost": "$508/week",
    "location": "Thayer Academy, Dedham",
    "url": "https://www.thayer.org/camp-thayer/programs",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "camp-thayer-theater-camp-a-week-with-rodgers-and-hammerstein",
    "name": "Camp Thayer Theater Camp - A Week with Rodgers and Hammerstein",
    "provider": "Thayer Academy",
    "category": "life",
    "subcategory": "leadership",
    "tags": [
      "theater",
      "musical",
      "singing",
      "dancing",
      "acting",
      "lunch included",
      "free swim",
      "preschool"
    ],
    "neighborhood": "dedham",
    "description": "Camp Thayer's Lower Camp features activities scaled to size for young children ages 3.9 to 5, with a staff-to-child ratio of 1:5. Kids enjoy a set schedule of activities and remain with their groups and counselors throughout the day, participating in swimming, arts & crafts, and age-appropriate recreational activities from 9 a.m. to 2 p.m.",
    "sentiment": "",
    "ageRange": "6-9",
    "cost": "$508/week",
    "location": "Thayer Academy, Dedham",
    "url": "https://www.thayer.org/camp-thayer/programs",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "camp-thayer-theater-camp-honk-thayer-academy",
    "name": "Camp Thayer Theater Camp - Honk!",
    "provider": "Thayer Academy",
    "category": "life",
    "subcategory": "leadership",
    "tags": [
      "theater",
      "musical",
      "singing",
      "dancing",
      "acting",
      "lunch included",
      "free swim",
      "preschool"
    ],
    "neighborhood": "dedham",
    "description": "Camp Thayer's Lower Camp features activities scaled to size for young children ages 3.9 to 5, with a staff-to-child ratio of 1:5. Kids enjoy a set schedule of activities and remain with their groups and counselors throughout the day, participating in swimming, arts & crafts, and age-appropriate recreational activities from 9 a.m. to 2 p.m.",
    "sentiment": "",
    "ageRange": "9-13",
    "cost": "$508/week",
    "location": "Thayer Academy, Dedham",
    "url": "https://www.thayer.org/camp-thayer/programs",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "stoughton-rec-stoughton-recreation",
    "name": "Stoughton Rec",
    "provider": "Stoughton Recreation",
    "category": "sports",
    "subcategory": "multi-sport",
    "tags": [],
    "neighborhood": "stoughton",
    "description": "Check website",
    "sentiment": "",
    "ageRange": "4-6",
    "cost": "Check website",
    "location": "Stoughton",
    "url": "https://stoughtonma.myrec.com/info/default.aspx",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07"
    ]
  },
  {
    "id": "jr-celtics-academy-new-balance-track-nba-celtics",
    "name": "Jr. Celtics Academy @ New Balance Track",
    "provider": "NBA Celtics",
    "category": "sports",
    "subcategory": "court-sports",
    "tags": [
      "basketball",
      "youth sports",
      "court-sports",
      "summer camp",
      "skill development",
      "teamwork"
    ],
    "neighborhood": "norwood",
    "description": "Jr. Celtics Academy provides youth basketball experiences where each child is treated like an MVP. The program offers 5-day summer camps with on-court skill development, teamwork building, and leadership activities for ages 7-14, plus 3-day spring training clinics featuring developmental sessions and healthy competition across New England locations.",
    "sentiment": "",
    "ageRange": "7-13",
    "cost": "Check website",
    "location": "Allston-Brighton",
    "url": "https://www.nba.com/celtics/jrceltics",
    "registrationDeadline": "Rolling admission",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w05",
      "w06",
      "w07"
    ]
  },
  {
    "id": "starland-rec-program-basketball-day-program-starland-sports",
    "name": "Starland: Rec Program & Basketball Day Program",
    "provider": "Starland Sports",
    "category": "sports",
    "subcategory": "multi-sport",
    "tags": [
      "summer camp",
      "day program",
      "sports",
      "recreation",
      "ages 5-11",
      "South Shore"
    ],
    "neighborhood": "norwood",
    "description": "Starland's Youth Rec Program is a well-known school break and summer vacation day program on the South Shore featuring engaging activities and versatile options for kids ages 5-11. The program includes sports, games, and recreational activities with dining options and special events throughout the summer.",
    "sentiment": "",
    "ageRange": "5-14",
    "cost": "Check website",
    "location": "Hanover",
    "url": "https://starlandsports.com/",
    "registrationDeadline": "Rolling admission",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "mgc-summer-camp-mgc-massachusetts-gymnastics-center",
    "name": "MGC Summer Camp",
    "provider": "MGC (Massachusetts Gymnastics Center)",
    "category": "sports",
    "subcategory": "individual-combat",
    "tags": [],
    "neighborhood": "hingham",
    "description": "Check website",
    "sentiment": "",
    "ageRange": "5-17",
    "cost": "Check website",
    "location": "Hingham",
    "url": "https://massgymnastics.com/hingham/camp/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08"
    ]
  },
  {
    "id": "youth-sailing-club-hingham-maritime",
    "name": "Youth Sailing Club",
    "provider": "Hingham Maritime",
    "category": "sports",
    "subcategory": "water-sports",
    "tags": [
      "sailing",
      "water-sports",
      "rowing",
      "maritime-education",
      "youth-programs",
      "waterfront"
    ],
    "neighborhood": "hingham",
    "description": "Hingham Maritime Center offers sailing, rowing, and maritime education programs on beautiful Hingham Harbor. With over 50 years of experience teaching more than 10,000 participants, they foster self-reliance, teamwork, physical fitness, and environmental stewardship through waterfront access for all.",
    "sentiment": "",
    "ageRange": "7-17",
    "cost": "Check website",
    "location": "Hingham",
    "url": "https://www.hinghammaritime.org/",
    "registrationDeadline": "Rolling admission",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08"
    ]
  },
  {
    "id": "south-shore-baseball-club-south-shore-baseball-club",
    "name": "South Shore Baseball Club",
    "provider": "South Shore Baseball Club",
    "category": "sports",
    "subcategory": "field-sports",
    "tags": [
      "baseball",
      "summer camp",
      "instruction",
      "youth sports",
      "Hingham MA",
      "field-sports"
    ],
    "neighborhood": "hingham",
    "description": "The South Shore Baseball Club Summer Camps feature excellent staff and facilities, offering fundamental instruction for novices through specialized training for experienced players. Campers enjoy rewarding experiences while learning baseball in a fun, supportive environment led by experienced coaches.",
    "sentiment": "",
    "ageRange": "5-15",
    "cost": "Check website",
    "location": "Hingham",
    "url": "https://ssbc.com/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w03",
      "w04",
      "w05",
      "w06"
    ]
  },
  {
    "id": "mgc-preschool-camp-mgc-massachusetts-gymnastics-center",
    "name": "MGC Preschool Camp",
    "provider": "MGC (Massachusetts Gymnastics Center)",
    "category": "sports",
    "subcategory": "individual-combat",
    "tags": [],
    "neighborhood": "hingham",
    "description": "Check website",
    "sentiment": "",
    "ageRange": "3-5",
    "cost": "Check website",
    "location": "Hingham",
    "url": "https://massgymnastics.com/hingham/summer-preschool-camp/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w05",
      "w07"
    ]
  },
  {
    "id": "south-shore-selects-soccer-south-shore-selects",
    "name": "South Shore Selects Soccer",
    "provider": "South Shore Selects",
    "category": "sports",
    "subcategory": "field-sports",
    "tags": [
      "soccer",
      "summer camp",
      "youth sports",
      "clinics",
      "all ages",
      "South Shore"
    ],
    "neighborhood": "hingham",
    "description": "Select Soccer Club offers multiple summer camps and clinics across locations in Massachusetts and New Hampshire for ages 5-14. Programs feature expert coaching in a safe, structured environment with skill development, fun games, and confidence-building activities led by licensed, experienced staff.",
    "sentiment": "",
    "ageRange": "5-12",
    "cost": "Check website",
    "location": "Hingham",
    "url": "https://selectma.com/camps-clinics/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08"
    ]
  },
  {
    "id": "pilgrim-skating-arena-summer-black-blue-pilgrim-skating-aren",
    "name": "Pilgrim Skating Arena Summer Black & Blue",
    "provider": "Pilgrim Skating Arena",
    "category": "sports",
    "subcategory": "court-sports",
    "tags": [
      "hockey",
      "skating",
      "youth",
      "ice-sports",
      "summer-camp",
      "skill-building"
    ],
    "neighborhood": "hingham",
    "description": "This hockey camp for ages 6 and under features 50-minute sessions of drills and scrimmage play designed to help young skaters strengthen their edges, improve stick handling, and have fun playing in game situations throughout the summer.",
    "sentiment": "",
    "ageRange": "4-6",
    "cost": "$295.00/session",
    "location": "Hingham",
    "url": "https://www.skatepilgrim.com/black-and-blue",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "pilgrim-skating-arena-summer-3-on-3-pilgrim-skating-arena",
    "name": "Pilgrim Skating Arena Summer 3-on-3",
    "provider": "Pilgrim Skating Arena",
    "category": "sports",
    "subcategory": "court-sports",
    "tags": [
      "hockey",
      "3-on-3",
      "summer",
      "skating",
      "youth-sports",
      "ice-hockey"
    ],
    "neighborhood": "hingham",
    "description": "Divided into Mite, Squirt, and Pee Wee/Bantam levels, participants enjoy lots of puck touches, fast play, and fast thinking on the ice. A fun way to improve your game and become a better skater and hockey player. Full equipment required.",
    "sentiment": "",
    "ageRange": "5-14",
    "cost": "$295",
    "location": "Hingham",
    "url": "https://www.skatepilgrim.com/3-on-3-programs",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "pilgrim-skating-arena-rink-rats-summer-drop-in-pilgrim-skati",
    "name": "Pilgrim Skating Arena Rink Rats Summer Drop In",
    "provider": "Pilgrim Skating Arena",
    "category": "sports",
    "subcategory": "individual-combat",
    "tags": [],
    "neighborhood": "hingham",
    "description": "",
    "sentiment": "",
    "ageRange": "5-7",
    "cost": "Check website",
    "location": "Hingham",
    "url": "https://www.skatepilgrim.com/summer-programs",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "pilgrim-skating-arena-advanced-hockey-school-pilgrim-skating",
    "name": "Pilgrim Skating Arena Advanced Hockey School",
    "provider": "Pilgrim Skating Arena",
    "category": "sports",
    "subcategory": "individual-combat",
    "tags": [
      "hockey",
      "ice-skating",
      "youth-sports",
      "summer-program",
      "skills-training",
      "competitive"
    ],
    "neighborhood": "hingham",
    "description": "This intensive Saturday Advanced Hockey School utilizes all three rinks to focus on different fundamental skills: one rink concentrates on skills, another on power skating, and the third offers scrimmage opportunities. Players ages 7-14 are grouped by age and ability (Mites, Squirts, Pee Wee/Bantam) for 1 hour 45 minutes of constant motion with dedicated coaching staff.",
    "sentiment": "My son has attended the Advanced Hockey School for the past five summers. 1 hour and 45 minutes of constant motion, utilizing a rotation of all three rinks with a different focus on each sheet along with a dedicated, caring, focused coaching staff. It's a great value, at a great time of day – my son has definitely benefitted from this school. - Greg Apostol",
    "ageRange": "7-14",
    "cost": "$490/10-week program",
    "location": "Hingham",
    "url": "https://www.skatepilgrim.com/advanced-hockey-camp",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "summer-xtreme-cohasset-recreation",
    "name": "Summer Xtreme",
    "provider": "Cohasset Recreation",
    "category": "sports",
    "subcategory": "multi-sport",
    "tags": [],
    "neighborhood": "cohasset",
    "description": "",
    "sentiment": "",
    "ageRange": "10-13",
    "cost": "Check website",
    "location": "Cohasset",
    "url": "https://cohassetrecma.myrec.com/info/default.aspx",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08"
    ]
  },
  {
    "id": "my-gym-fun-days-my-gym",
    "name": "My Gym Fun Days",
    "provider": "My Gym",
    "category": "sports",
    "subcategory": "multi-sport",
    "tags": [],
    "neighborhood": "norwell",
    "description": "",
    "sentiment": "",
    "ageRange": "3-6",
    "cost": "Check website",
    "location": "Norwell",
    "url": "https://www.mygym.com/norwell/camp",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "starland-rec-program-starland-sports",
    "name": "Starland Rec Program",
    "provider": "Starland Sports",
    "category": "sports",
    "subcategory": "multi-sport",
    "tags": [],
    "neighborhood": "norwood",
    "description": "",
    "sentiment": "",
    "ageRange": "5-11",
    "cost": "Check website",
    "location": "Hanover",
    "url": "https://starlandsports.com/rec-program",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10",
      "w11"
    ]
  },
  {
    "id": "starland-summer-basketball-day-program-starland-sports",
    "name": "Starland Summer Basketball Day Program",
    "provider": "Starland Sports",
    "category": "sports",
    "subcategory": "multi-sport",
    "tags": [],
    "neighborhood": "norwood",
    "description": "",
    "sentiment": "",
    "ageRange": "8-14",
    "cost": "Check website",
    "location": "Hanover",
    "url": "https://starlandsports.com/basketball/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "rosemarie-morelli-art-studio-rosemarie-morelli",
    "name": "Rosemarie Morelli Art Studio",
    "provider": "Rosemarie Morelli",
    "category": "arts",
    "subcategory": "visual-arts",
    "tags": [
      "visual-arts",
      "painting",
      "drawing",
      "illustration",
      "teen-week",
      "plein-air"
    ],
    "neighborhood": "walpole",
    "description": "Children and teens ages 8-18 enjoy painting, drawing, and illustrating in a relaxed-structured studio environment where students work on projects of their choosing while learning fundamentals of form, shape correction, and color mixing. Daily group sketch studies develop skills in portraiture, anatomy, and landscape elements across various media including oils, acrylics, watercolors, pastels, and more. Teen Week includes 3 days of in-studio art and 2 days of plein air landscape painting at local Walpole sites.",
    "sentiment": "",
    "ageRange": "8-18",
    "cost": "$275/5-day week (Weeks 1, 2, 3, 5, & 6); $300 Teen Week (Week 4); $55-65/day for partial weeks",
    "location": "Walpole",
    "url": "https://rosemariemorelliartstudio.com/summer-classes/",
    "registrationDeadline": "Rolling admission",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06"
    ]
  },
  {
    "id": "mass-music-arts-society-mass-music-arts-society",
    "name": "Mass Music & Arts Society",
    "provider": "Mass Music & Arts Society",
    "category": "arts",
    "subcategory": "theater",
    "tags": [
      "musical theatre",
      "Broadway",
      "summer intensive",
      "performance",
      "ages 8-17",
      "showcase"
    ],
    "neighborhood": "mansfield",
    "description": "Mass Arts Center offers two summer theatre intensives for young performers. Defying Gravity (ages 8-17) is a three-week musical theatre program drawing from the Broadway hit Wicked, where students act, sing, and dance while improving their performative skills and culminating in a final showcase. Broadway Mash-up (ages 8-11) is a one-week intensive featuring contemporary musicals like Six and Mamma Mia, where participants tell stories through song and dance with a final performance for family and friends.",
    "sentiment": "",
    "ageRange": "8-17",
    "cost": "$995-$1,125 for Defying Gravity (3 weeks); $399 for Broadway Mash-up (1 week)",
    "location": "Mansfield",
    "url": "https://massartscenter.org/summer-program/",
    "registrationDeadline": "Rolling admission; Early bird pricing through March 31 for Defying Gravity",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w02",
      "w03",
      "w06"
    ]
  },
  {
    "id": "children-s-art-classes-hanover-summer-art-camps-children-s-a",
    "name": "Children's Art Classes Hanover – Summer Art Camps",
    "provider": "Children's Art Classes",
    "category": "arts",
    "subcategory": "visual-arts",
    "tags": [
      "visual-arts",
      "summer-camps",
      "art-classes",
      "creativity",
      "all-ages",
      "South-Shore"
    ],
    "neighborhood": "norwood",
    "description": "Children's Art Classes in Hanover offers summer workshops and art camps where aspiring artists explore more than 40 varieties of art to find their passions and enrich their creativity. Students engage in engaging activities with a solid foundation in the arts, with instruction tailored to different ages and skill levels.",
    "sentiment": "",
    "ageRange": "5-17",
    "cost": "Check website",
    "location": "Hanover",
    "url": "https://ma-hanover.childrensartclasses.com/?utm_source=chatgpt.com",
    "registrationDeadline": "Rolling admission",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "summer-arts-at-derby-academy-derby-academy",
    "name": "Summer Arts at Derby Academy",
    "provider": "Derby Academy",
    "category": "arts",
    "subcategory": "theater",
    "tags": [
      "theater",
      "dance",
      "culinary",
      "arts",
      "creative",
      "collaboration"
    ],
    "neighborhood": "hingham",
    "description": "Summer Arts at Derby Academy offers theater, dance, culinary, and creative programs that foster collaboration and artistic expression. Campers participate in three focused morning periods (9:00 AM–12:00 PM) in their specialty track, with optional full-day experiences including afternoon choice-based classes and a noontime show in the Larson Theatre.",
    "sentiment": "",
    "ageRange": "4-15",
    "cost": "Check website",
    "location": "Hingham",
    "url": "https://www.derbyacademy.org/summer2026",
    "registrationDeadline": "Rolling admission",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07"
    ]
  },
  {
    "id": "miss-movement-dance-camp-miss-movement",
    "name": "Miss Movement Dance Camp",
    "provider": "Miss Movement",
    "category": "arts",
    "subcategory": "dance",
    "tags": [
      "dance",
      "inclusive",
      "special-needs",
      "arts",
      "youth-classes",
      "variety"
    ],
    "neighborhood": "hingham",
    "description": "Missy's Movement offers dance classes with a focus on inclusivity and fun. The studio provides a variety of dance styles and time slots for students of all abilities, including those with special needs.",
    "sentiment": "As the parent of a child with special needs, I can't overstate how kind, patient, compassionate and genuine Miss Melissa is. Her studio was the first place I felt safe leaving my daughter that wasn't a relative's home. I can't say enough about how much we love Missy's Movement!",
    "ageRange": "3-14",
    "cost": "Check website",
    "location": "Hingham",
    "url": "https://www.missysmovement.com/registerforclass",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09"
    ]
  },
  {
    "id": "summer-craft-club-the-crafty-place",
    "name": "Summer Craft Club",
    "provider": "The Crafty Place",
    "category": "arts",
    "subcategory": "visual-arts",
    "tags": [],
    "neighborhood": "cohasset",
    "description": "",
    "sentiment": "",
    "ageRange": "5-10",
    "cost": "Check website",
    "location": "Cohasset",
    "url": "https://thecraftyplace.com/summercraftclub",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09"
    ]
  },
  {
    "id": "the-company-theatre-summer-workshop-the-company-theatre",
    "name": "The Company Theatre Summer Workshop",
    "provider": "The Company Theatre",
    "category": "arts",
    "subcategory": "visual-arts",
    "tags": [],
    "neighborhood": "norwell",
    "description": "",
    "sentiment": "",
    "ageRange": "8-18",
    "cost": "Check website",
    "location": "Norwell",
    "url": "https://www.companytheatre.com/summer-workshop",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03"
    ]
  },
  {
    "id": "children-s-art-classes-children-s-art-classes",
    "name": "Children's Art Classes",
    "provider": "Children's Art Classes",
    "category": "arts",
    "subcategory": "visual-arts",
    "tags": [
      "visual arts",
      "art classes",
      "creative learning",
      "multi-media",
      "youth enrichment",
      "Boston area"
    ],
    "neighborhood": "norwood",
    "description": "Children's Art Classes in Hanover offers comprehensive art education through weekly classes that run from October through mid-June, with each lesson building on the next. Students explore more than 40 varieties of art to find their passions, develop creativity, and build a solid foundation in the arts as a life-long skill.",
    "sentiment": "",
    "ageRange": "5-17",
    "cost": "Check website",
    "location": "Hanover",
    "url": "https://ma-hanover.childrensartclasses.com/",
    "registrationDeadline": "Rolling admission",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09"
    ]
  },
  {
    "id": "pre-teen-musical-theatre-intensive-the-hanover-theatre",
    "name": "Pre-Teen Musical Theatre Intensive",
    "provider": "The Hanover Theatre",
    "category": "arts",
    "subcategory": "visual-arts",
    "tags": [],
    "neighborhood": "norwood",
    "description": "",
    "sentiment": "",
    "ageRange": "10-14",
    "cost": "Check website",
    "location": "Hanover",
    "url": "https://thehanovertheatre.org/conservatory/summer/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w03",
      "w04",
      "w05",
      "w06"
    ]
  },
  {
    "id": "children-s-musical-theatre-the-hanover-theatre",
    "name": "Children's Musical Theatre",
    "provider": "The Hanover Theatre",
    "category": "arts",
    "subcategory": "visual-arts",
    "tags": [],
    "neighborhood": "norwood",
    "description": "",
    "sentiment": "",
    "ageRange": "6-10",
    "cost": "Check website",
    "location": "Hanover",
    "url": "https://thehanovertheatre.org/conservatory/summer/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w02",
      "w07",
      "w08"
    ]
  },
  {
    "id": "lego-stem-camp-let-go-your-mind",
    "name": "LEGO STEM Camp",
    "provider": "Let Go Your Mind",
    "category": "stem",
    "subcategory": "coding",
    "tags": [
      "LEGO",
      "robotics",
      "coding",
      "STEM",
      "stop-motion animation",
      "Minecraft"
    ],
    "neighborhood": "walpole",
    "description": "LetGoYourMind's STEM LEGO & Robotics Summer Camp introduces children to STEM through hands-on LEGO building, coding, and animation projects. Campers construct motorized LEGO builds, program robots using drag-and-drop interfaces, create stop-motion animations, and explore Minecraft Command Generators—all while collaborating on themed challenges inspired by popular video games and characters.",
    "sentiment": "",
    "ageRange": "4-13",
    "cost": "Check website",
    "location": "Walpole",
    "url": "https://www.letgoyourmind.com/locations/ma/walpole",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03"
    ]
  },
  {
    "id": "brookline-smartprograms-brookline-smartprograms",
    "name": "Brookline SmartPrograms",
    "provider": "Brookline SmartPrograms",
    "category": "stem",
    "subcategory": "coding",
    "tags": [],
    "neighborhood": "brookline",
    "description": "",
    "sentiment": "",
    "ageRange": "5-13",
    "cost": "Check website",
    "location": "Brookline",
    "url": "https://brooklineadulted.org/smart-programs/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09"
    ]
  },
  {
    "id": "tech-revolution-tech-revolution",
    "name": "Tech Revolution",
    "provider": "Tech Revolution",
    "category": "stem",
    "subcategory": "coding",
    "tags": [
      "STEM",
      "coding",
      "robotics",
      "tech camps",
      "game design",
      "video production"
    ],
    "neighborhood": "norwood",
    "description": "Tech Revolution offers 60+ cutting-edge weekly STEM camps featuring robotics, coding, game design, video production, digital art, and more. Students learn from passionate instructors from top universities at 50+ world-class locations including UPenn, UCLA, Rice, NYU, and Harvard.",
    "sentiment": "",
    "ageRange": "6-14",
    "cost": "Check website",
    "location": "Allston-Brighton",
    "url": "https://www.lavnercampsandprograms.com/",
    "registrationDeadline": "April 24, 2026",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08"
    ]
  },
  {
    "id": "sela-summer-camp-su-escuela",
    "name": "SELA Summer Camp",
    "provider": "Su Escuela",
    "category": "stem",
    "subcategory": "natural-sciences",
    "tags": [
      "STEAM",
      "Spanish immersion",
      "eco-focused",
      "coding",
      "hands-on learning"
    ],
    "neighborhood": "hingham",
    "description": "SELA's award-winning Summer Program invites children on an unforgettable journey of discovery within a full-immersion Spanish environment. The 11-week program from June to August uses innovative STEAM methodology with an eco-inspired 'Eco Amigos' curriculum, featuring weekly themes from dinosaurs and plants to animals and ocean exploration. Children engage in hands-on learning including coding with Scratch, creative projects, sensory play, and real-world exploration across age groups from infants through 4th grade.",
    "sentiment": "",
    "ageRange": "0-9",
    "cost": "Check website",
    "location": "Hingham",
    "url": "https://suescuela.com/our-programs/summer-program/",
    "registrationDeadline": "March 1, 2026",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09"
    ]
  },
  {
    "id": "cohasset-learning-studio-cohasset-learning-studio",
    "name": "Cohasset Learning Studio",
    "provider": "Cohasset Learning Studio",
    "category": "stem",
    "subcategory": "coding",
    "tags": [],
    "neighborhood": "cohasset",
    "description": "",
    "sentiment": "",
    "ageRange": "3-12",
    "cost": "Check website",
    "location": "Cohasset",
    "url": "https://cohassetlearningstudio.com/camp/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09"
    ]
  },
  {
    "id": "st-gerard-kids-camp-st-gerard-kids-camp",
    "name": "St. Gerard Kids Camp",
    "provider": "St. Gerard Kids Camp",
    "category": "adventure",
    "subcategory": "nature-study",
    "tags": [
      "day camp",
      "multi-sport",
      "arts and crafts",
      "water games",
      "family activities",
      "parish-based"
    ],
    "neighborhood": "canton",
    "description": "Kids Camp is a week full of fun activities including sports, water games, and arts and crafts during the day, plus evening family activities. Celebrating its 37th year, the camp offers campers an exciting experience with themed programming and community engagement.",
    "sentiment": "",
    "ageRange": "5-12",
    "cost": "Check website",
    "location": "Canton",
    "url": "https://www.cantoncatholic.org/kids-camp",
    "registrationDeadline": "June 8, 2026",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w04"
    ]
  },
  {
    "id": "everwood-day-everwood-day",
    "name": "Everwood Day",
    "provider": "Everwood Day",
    "category": "adventure",
    "subcategory": "nature-study",
    "tags": [
      "day camp",
      "multi-activity",
      "ages 4-15",
      "Sharon MA",
      "waterfront",
      "adventure"
    ],
    "neighborhood": "sharon",
    "description": "Everwood Day Camp offers a progressive program for ages 4-15 with activities spanning athletics, arts, STEAM, waterfront instruction, and outdoor adventure. Campers build lifelong friendships while developing social-emotional skills through the camp's Five Star Points: friendship, independence, integrity, inspiration, and teamwork.",
    "sentiment": "My son couldn't wait to get back! My son attended Everwood for the entire 9 weeks, even though I had originally signed him up for 5!",
    "ageRange": "4-10",
    "cost": "Check website",
    "location": "Sharon",
    "url": "https://everwooddaycamp.com/?gclid=CjwKCAjw5_GmBhBIEiwA5QSMxI4lvW05Tpl8LZfgRMfkD7eMWbP0CPEW13pUaLU_Rw5xzFw2z5lTgRoCkZ0QAvD_BwE",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08"
    ]
  },
  {
    "id": "extended-arms-extended-arms",
    "name": "Extended Arms",
    "provider": "Extended Arms",
    "category": "adventure",
    "subcategory": "nature-study",
    "tags": [
      "summer camp",
      "day camp",
      "grades 1-6",
      "outdoor adventure",
      "arts and crafts",
      "multi-activity"
    ],
    "neighborhood": "randolph",
    "description": "Stars Summer Programs and Day Camp offer children entering grades 1-6 days filled with outdoor adventure, creativity, and hands-on learning. Campers participate in athletics, arts and crafts, nature exploration, swimming, and weekly themed experiences that spark imagination and curiosity. With opportunities to stay active, try new things, and build confidence, every day offers something exciting to discover.",
    "sentiment": "",
    "ageRange": "5-6",
    "cost": "Check website",
    "location": "Randolph",
    "url": "https://southshorestars.org/programs/summer/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09"
    ]
  },
  {
    "id": "norton-ninja-s-summer-camp-usanc-ocr-summer-camp",
    "name": "Norton Ninja's Summer Camp",
    "provider": "USANC OCR Summer Camp",
    "category": "adventure",
    "subcategory": "high-adrenaline",
    "tags": [
      "ninja",
      "obstacle course",
      "fitness",
      "summer camp",
      "ages 5+",
      "skill-building"
    ],
    "neighborhood": "norwood",
    "description": "Norton Ninja's Summer Camp offers an exciting week of ninja training and obstacle course challenges for kids. Participants develop strength, agility, and coordination while learning ninja techniques in a fun, supportive environment. The camp runs daily from 9:00 AM to 2:30 PM at USA Ninja Challenge Norton.",
    "sentiment": "",
    "ageRange": "6-15",
    "cost": "Check website",
    "location": "Norton",
    "url": "https://portal.iclasspro.com/usaninjanorton/camps/1?sortBy=time?KKFC",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w08"
    ]
  },
  {
    "id": "accord-center-van-camp-and-summer-programs-accord-center",
    "name": "Accord Center Van Camp and Summer Programs",
    "provider": "Accord Center",
    "category": "adventure",
    "subcategory": "outdoor-survival",
    "tags": [
      "adventure",
      "field-trips",
      "outdoor-exploration",
      "creative-arts",
      "stem",
      "social-skills"
    ],
    "neighborhood": "norwell",
    "description": "Accord Center's Summer 2026 programs combine on-site adventures and mobile experiences. Van Camp takes students on daily field trips to museums, beaches, and amusement parks across Boston, Cape Cod, and Southern New Hampshire, while on-site programs feature themed weeks like Survivor challenges, nature exploration, gardening and cooking, and imaginative creative projects.",
    "sentiment": "",
    "ageRange": "8-18",
    "cost": "$446-$604/week for on-site programs; $688-$932/week for Van Camp; $50-$70 per Teen Night Out",
    "location": "Norwell",
    "url": "https://www.accordcenter.org/summer-vacation",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08"
    ]
  },
  {
    "id": "world-s-end-summer-camp-the-trustees",
    "name": "World's End Summer Camp",
    "provider": "The Trustees",
    "category": "adventure",
    "subcategory": "nature-study",
    "tags": [
      "nature-study",
      "coastal-exploration",
      "environmental-education",
      "outdoor-adventure",
      "day-camp",
      "ages-5-10"
    ],
    "neighborhood": "hingham",
    "description": "Campers explore the unique coastal and woodland habitats of World's End peninsula, discovering plants, animals, sea life, and minerals while learning about environmental balance. Daily adventures include exploring rocky shores, beaches, fields, and woodlands, with science activities at the Wakeman O'Donnell Center serving as home base. Creative projects, active games, and friendship building complement outdoor discovery throughout each day.",
    "sentiment": "Our South Shore Camps are designed for campers who love the outdoors, getting their hands dirty, identifying sea creatures along the coast, connecting to the land, being independent learners, using their imagination, and tapping into their resilience no matter the weather.",
    "ageRange": "5-10",
    "cost": "$565/week (Trustees Member) or $645/week (Nonmember)",
    "location": "Hingham",
    "url": "https://thetrustees.org/program/worlds-end-camp-schedule-and-pricing/",
    "registrationDeadline": "Rolling admission",
    "documents": [
      "Annual physical and immunization forms",
      "Emergency and pick up contact info",
      "Camper insurance policy and doctor contact"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08"
    ]
  },
  {
    "id": "weir-river-farm-camp-the-trustees",
    "name": "Weir River Farm Camp",
    "provider": "The Trustees",
    "category": "adventure",
    "subcategory": "nature-study",
    "tags": [
      "farm",
      "nature-based",
      "outdoor-education",
      "agriculture",
      "environmental-learning",
      "animals"
    ],
    "neighborhood": "hingham",
    "description": "Campers at Weir River Farm spend time caring for farm animals like goats and sheep, develop gardening skills in the Children's Garden, explore woodland habitats to learn about local wildlife, and enjoy creative play, organized games, and arts and crafts projects. Teen Stewards (ages 12-14) work on authentic farm and trail projects alongside land stewards and camp staff to deepen their connection to agriculture and the land.",
    "sentiment": "Our South Shore Camps are designed for campers who love the outdoors, caring for farm animals, getting their hands dirty, identifying sea creatures along the coast, connecting to the land, being independent learners, using their imagination, and tapping into their resilience no matter the weather.",
    "ageRange": "5-11",
    "cost": "$565/week (Trustees Member) or $645/week (Nonmember)",
    "location": "Hingham",
    "url": "https://thetrustees.org/program/weir-river-farm-camp-schedule-pricing/",
    "registrationDeadline": "Rolling admission",
    "documents": [
      "Annual physical and immunization forms",
      "Emergency and pick up contact info",
      "Camper insurance policy and doctor contact"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08"
    ]
  },
  {
    "id": "challenge-rocks-camp-challenge-rocks",
    "name": "Challenge Rocks Camp",
    "provider": "Challenge Rocks",
    "category": "adventure",
    "subcategory": "high-adrenaline",
    "tags": [
      "rock climbing",
      "parkour",
      "youth programs",
      "indoor adventure",
      "competitive climbing",
      "strength-building"
    ],
    "neighborhood": "hingham",
    "description": "Challenge Rocks offers youth climbing and parkour classes where kids build confidence, strength, and real skills through recreational climbing, competitive climbing teams, and parkour sessions. The facility features 18 auto-belays, top-rope climbing, bouldering, warped walls, obstacle courses, an indoor zip-line, and American Ninja Warrior-style challenges across 5,000 square feet.",
    "sentiment": "This place is AMAZING for kids and young adults to harness their rock climbing and parkour skills!! The owner and staff are just wonderful, guiding the kids through warmups and proper techniques.",
    "ageRange": "6-17",
    "cost": "Check website",
    "location": "Hingham",
    "url": "https://www.challengerocks.com/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "little-mariners-hingham-maritime",
    "name": "Little Mariners",
    "provider": "Hingham Maritime",
    "category": "adventure",
    "subcategory": "nature-study",
    "tags": [
      "maritime",
      "sailing",
      "water-sports"
    ],
    "neighborhood": "hingham",
    "description": "Check website",
    "sentiment": "",
    "ageRange": "5-7",
    "cost": "Check website",
    "location": "Hingham",
    "url": "https://www.hinghammaritime.org/programs-25",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08"
    ]
  },
  {
    "id": "holly-hill-farm-summer-camps-holly-hill-farm",
    "name": "Holly Hill Farm Summer Camps",
    "provider": "Holly Hill Farm",
    "category": "adventure",
    "subcategory": "nature-study",
    "tags": [],
    "neighborhood": "cohasset",
    "description": "",
    "sentiment": "",
    "ageRange": "3-14",
    "cost": "Check website",
    "location": "Cohasset",
    "url": "https://hollyhillfarm.org/summer-programs-2026",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "playground-rec-program-cohasset-recreation",
    "name": "Playground Rec Program",
    "provider": "Cohasset Recreation",
    "category": "adventure",
    "subcategory": "nature-study",
    "tags": [],
    "neighborhood": "cohasset",
    "description": "",
    "sentiment": "",
    "ageRange": "5-10",
    "cost": "Check website",
    "location": "Cohasset",
    "url": "https://cohassetrecma.myrec.com/info/default.aspx",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07"
    ]
  },
  {
    "id": "inly-camp-inly-school",
    "name": "Inly Camp",
    "provider": "Inly School",
    "category": "adventure",
    "subcategory": "nature-study",
    "tags": [],
    "neighborhood": "scituate",
    "description": "",
    "sentiment": "",
    "ageRange": "3-14",
    "cost": "Check website",
    "location": "Scituate",
    "url": "https://summeratinly.com/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09"
    ]
  },
  {
    "id": "dalby-farm-dalby-farm",
    "name": "Dalby Farm",
    "provider": "Dalby Farm",
    "category": "adventure",
    "subcategory": "nature-study",
    "tags": [],
    "neighborhood": "scituate",
    "description": "",
    "sentiment": "",
    "ageRange": "5-11",
    "cost": "Check website",
    "location": "Scituate",
    "url": "https://www.dalbyfarm.com/summer-learning-programs",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w04",
      "w05"
    ]
  },
  {
    "id": "south-shore-ymca-nature-center-south-shore-ymca",
    "name": "South Shore YMCA Nature Center",
    "provider": "South Shore YMCA",
    "category": "adventure",
    "subcategory": "nature-study",
    "tags": [],
    "neighborhood": "norwell",
    "description": "",
    "sentiment": "",
    "ageRange": "3-15",
    "cost": "Check website",
    "location": "Norwell",
    "url": "https://ssymca.org/camp",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09"
    ]
  },
  {
    "id": "accord-center-van-camp-accord-center",
    "name": "Accord Center: Van Camp",
    "provider": "Accord Center",
    "category": "adventure",
    "subcategory": "outdoor-survival",
    "tags": [
      "adventure",
      "field-trips",
      "outdoor-exploration",
      "creative-arts",
      "stem",
      "social-skills"
    ],
    "neighborhood": "norwell",
    "description": "Accord Center's Summer 2026 programs combine on-site adventures and mobile experiences. Van Camp takes students on daily field trips to museums, beaches, and amusement parks across Boston, Cape Cod, and Southern New Hampshire, while on-site programs feature themed weeks like Survivor challenges, nature exploration, gardening and cooking, and imaginative creative projects.",
    "sentiment": "",
    "ageRange": "9-18",
    "cost": "$446-$604/week for on-site programs; $688-$932/week for Van Camp; $50-$70 per Teen Night Out",
    "location": "Norwell",
    "url": "https://www.accordcenter.org/summer-vacation",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08"
    ]
  },
  {
    "id": "ymca-south-shore-ymca",
    "name": "YMCA",
    "provider": "South Shore YMCA",
    "category": "adventure",
    "subcategory": "nature-study",
    "tags": [],
    "neighborhood": "norwood",
    "description": "",
    "sentiment": "",
    "ageRange": "3-15",
    "cost": "Check website",
    "location": "Hanover",
    "url": "https://ssymca.org/program/?types%5B0%5D=45",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09"
    ]
  },
  {
    "id": "hartsuff-park-explorers-rockland-recreation",
    "name": "Hartsuff Park Explorers",
    "provider": "Rockland Recreation",
    "category": "adventure",
    "subcategory": "nature-study",
    "tags": [],
    "neighborhood": "rockland",
    "description": "",
    "sentiment": "",
    "ageRange": "6-11",
    "cost": "Check website",
    "location": "Rockland",
    "url": "https://rockland-ma.gov/658/Recreation",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08"
    ]
  },
  {
    "id": "hartsuff-park-chipmunk-rockland-recreation",
    "name": "Hartsuff Park Chipmunk",
    "provider": "Rockland Recreation",
    "category": "adventure",
    "subcategory": "nature-study",
    "tags": [],
    "neighborhood": "rockland",
    "description": "",
    "sentiment": "",
    "ageRange": "3-5",
    "cost": "Check website",
    "location": "Rockland",
    "url": "https://rocklandma.myrec.com/info/default.aspx",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08"
    ]
  },
  {
    "id": "hartsuff-park-teen-adventure-rockland-recreation",
    "name": "Hartsuff Park Teen Adventure",
    "provider": "Rockland Recreation",
    "category": "adventure",
    "subcategory": "nature-study",
    "tags": [],
    "neighborhood": "rockland",
    "description": "",
    "sentiment": "",
    "ageRange": "10-14",
    "cost": "Check website",
    "location": "Rockland",
    "url": "https://rockland-ma.gov/658/Recreation",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08"
    ]
  },
  {
    "id": "south-shore-surf-camp-south-shore-surf-camp",
    "name": "South Shore Surf Camp",
    "provider": "South Shore Surf Camp",
    "category": "adventure",
    "subcategory": "nature-study",
    "tags": [],
    "neighborhood": "hull",
    "description": "",
    "sentiment": "",
    "ageRange": "7-15",
    "cost": "Check website",
    "location": "Hull",
    "url": "http://www.southshoresurfcamp.com/camp.html",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "hull-summer-camp-hull-recreation",
    "name": "Hull Summer Camp",
    "provider": "Hull Recreation",
    "category": "adventure",
    "subcategory": "nature-study",
    "tags": [],
    "neighborhood": "hull",
    "description": "",
    "sentiment": "",
    "ageRange": "5-12",
    "cost": "Check website",
    "location": "Hull",
    "url": "https://hullma.myrec.com/info/default.aspx",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08"
    ]
  },
  {
    "id": "hull-fishing-camp-hull-fishing-camp",
    "name": "Hull Fishing Camp",
    "provider": "Hull Fishing Camp",
    "category": "adventure",
    "subcategory": "nature-study",
    "tags": [],
    "neighborhood": "hull",
    "description": "",
    "sentiment": "",
    "ageRange": "7-14",
    "cost": "Check website",
    "location": "Hull",
    "url": "https://www.hullfishingcamp.com/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w01",
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08",
      "w09",
      "w10"
    ]
  },
  {
    "id": "sunset-point-day-camp-cape-cod-association-for-the-blind",
    "name": "Sunset Point Day Camp",
    "provider": "Cape Cod Association for the Blind",
    "category": "adventure",
    "subcategory": "nature-study",
    "tags": [],
    "neighborhood": "hull",
    "description": "",
    "sentiment": "",
    "ageRange": "6-15",
    "cost": "Check website",
    "location": "Hull",
    "url": "https://www.ccab.org/sunset-point-day-camp/",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w03",
      "w04",
      "w05",
      "w06",
      "w07",
      "w08"
    ]
  },
  {
    "id": "half-day-high-5-program-cohasset-recreation",
    "name": "Half-Day High 5 Program",
    "provider": "Cohasset Recreation",
    "category": "life",
    "subcategory": "leadership",
    "tags": [],
    "neighborhood": "cohasset",
    "description": "",
    "sentiment": "",
    "ageRange": "5-6",
    "cost": "Check website",
    "location": "Cohasset",
    "url": "https://cohassetrecma.myrec.com/info/default.aspx",
    "registrationDeadline": "Check website",
    "documents": [
      "Check website"
    ],
    "weeks": [
      "w02",
      "w03",
      "w04",
      "w05",
      "w06",
      "w07"
    ]
  }
];

// Make CAMPS available to global scope for browser or node
if (typeof window !== 'undefined') window.CAMPS = CAMPS;
if (typeof module !== 'undefined') module.exports = CAMPS;
