import React, { useMemo, useState } from "react";

const ADMIN_EMAIL = "nathantwalton@gmail.com";
const GOOGLE_EVIDENCE_LABEL = "House Cup Evidence Folder";
const GOOGLE_EVIDENCE_FOLDER_URL = "https://drive.google.com/drive/folders/15zhX3e1Hf4ExWgkwJK6gjevOggPO8MG8?usp=drive_link";

// Paste your deployed Google Apps Script Web App /exec URL here after deployment.
// Example: https://script.google.com/macros/s/AKfycb.../exec
const APPS_SCRIPT_WEB_APP_URL =
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_APPS_SCRIPT_WEB_APP_URL) ||
  "https://script.google.com/macros/s/AKfycbyO1HJ0dokejC574nuUeMdPgQcrMAcrXXVpG6ZnLCT3SNAAyze6XYtlafqsXCEbyiE/exec";

const HOUSES = ["Catalina", "Rincon", "Santa Rita", "Tortolita", "Tucson"];

// Front-end chief gatekeeping only. For true security, replace with Google auth / backend auth.
const CHIEF_USERS = [
  { name: "Nate", password: "wootwoot1!" },
  { name: "Rosie", password: "wootwoot1!" },
  { name: "Amrutha", password: "wootwoot1!" },
  { name: "Will", password: "wootwoot1!" },
  { name: "Johnny", password: "wootwoot1!" },
];

// Current fallback roster. Future edits should live in the Google Sheet Team tab.
const ROSTER = [
  { name: "Nate Walton", house: "Catalina", role: "Chief", email: "nathantwalton@arizona.edu" },
  { name: "Amrutha Doniparthi", house: "Rincon", role: "Chief", email: "amruthad39@arizona.edu" },
  { name: "Will Waidelich", house: "Santa Rita", role: "Chief", email: "wwaidelich@arizona.edu" },
  { name: "Johnny Trinh", house: "Tortolita", role: "Chief", email: "johnnyminhtrinh@arizona.edu" },
  { name: "Rosie Turk", house: "Tucson", role: "Chief", email: "rosemarieturk@arizona.edu" },
  { name: "Laura Meinke", house: "All", role: "Independent Adjudicator", lowestHouseCredit: true },
  { name: "Mattia Walter", house: "Catalina", role: "PGY3", email: "mattiawalter@arizona.edu" },
  { name: "David Hendrix", house: "Rincon", role: "PGY3", email: "hendrixd1@arizona.edu" },
  { name: "Dwani Patel", house: "Santa Rita", role: "PGY3", email: "dwanip@arizona.edu" },
  { name: "Monica Angeletti", house: "Tortolita", role: "PGY3", email: "monicaangeletti@arizona.edu" },
  { name: "Jared Stillman", house: "Tucson", role: "PGY3", email: "jmstillman@arizona.edu" },
  { name: "Celeste Gracey", house: "Catalina", role: "PGY3", email: "celestegracey@arizona.edu" },
  { name: "Kellie Jeong", house: "Rincon", role: "PGY3", email: "kelliejeong@arizona.edu" },
  { name: "Matthew Lansman", house: "Santa Rita", role: "PGY3", email: "mlansman@arizona.edu" },
  { name: "Nicholas Genz", house: "Tortolita", role: "PGY3", email: "ngenz@arizona.edu" },
  { name: "Swetha Vennelaganti", house: "Tucson", role: "PGY3", email: "svennelaganti@arizona.edu" },
  { name: "Robert Sumner", house: "Catalina", role: "PGY3", email: "rsumner@arizona.edu" },
  { name: "Costa Dalis", house: "Rincon", role: "PGY2", email: "cdalis@arizona.edu" },
  { name: "Kaitlyn Baber", house: "Santa Rita", role: "PGY3", email: "kbaber@arizona.edu" },
  { name: "Jesse Ritter", house: "Tortolita", role: "PGY3", email: "jritter@arizona.edu" },
  { name: "Faith Kim", house: "Tucson", role: "PGY2", email: "faithkim@arizona.edu" },
  { name: "Tim Yu", house: "Catalina", role: "PGY2", email: "timyu456@arizona.edu" },
  { name: "Levi Cohen", house: "Rincon", role: "PGY1", email: "levicohen@arizona.edu" },
  { name: "Kathryn Pulling", house: "Santa Rita", role: "PGY3", email: "kpulling@arizona.edu" },
  { name: "Swathi Somisetty", house: "Tortolita", role: "PGY3", email: "swathisomisetty@arizona.edu" },
  { name: "Ryan Schmidt", house: "Tucson", role: "PGY2", email: "ryanschmidt@arizona.edu" },
  { name: "Justin Le", house: "Catalina", role: "PGY2", email: "justinle@arizona.edu" },
  { name: "Dimitrios Filloglou", house: "Rincon", role: "PGY1", email: "dfilioglou98@arizona.edu" },
  { name: "Adrianna Diviero", house: "Santa Rita", role: "PGY2", email: "adiviero@arizona.edu" },
  { name: "Grace Speer", house: "Tortolita", role: "PGY2", email: "gracespeer@arizona.edu" },
  { name: "Frederick Pan", house: "Tucson", role: "PGY1", email: "fredpan@arizona.edu" },
  { name: "Isabella Campos Aguiar", house: "Catalina", role: "PGY1", email: "isabellacaguiar@arizona.edu" },
  { name: "Shaik Firdhos", house: "Rincon", role: "PGY1", email: "firdhos@arizona.edu" },
  { name: "Rami Khoshaba", house: "Santa Rita", role: "PGY1", email: "rkhoshaba@arizona.edu" },
  { name: "Megan Kohn", house: "Tortolita", role: "PGY2", email: "mkohn3@arizona.edu" },
  { name: "Emily Ploom", house: "Tucson", role: "PGY1", email: "emilyploom@arizona.edu" },
  { name: "Alexander Candel", house: "Catalina", role: "PGY1", email: "acandel@arizona.edu" },
  { name: "Alousius Fombang", house: "Rincon", role: "PGY1", email: "asfombang@arizona.edu" },
  { name: "Henry Lang", house: "Santa Rita", role: "PGY1", email: "henrylang@arizona.edu" },
  { name: "Kenneth Silvestro", house: "Tortolita", role: "PGY2", email: "kennysilvestro@arizona.edu" },
  { name: "Cole Sander", house: "Tucson", role: "PGY1", email: "colesander@arizona.edu" },
  { name: "Rishab Srivastava", house: "Catalina", role: "PGY3", email: "rishabsrivastava@arizona.edu" },
  { name: "Nassim Idouraine", house: "Rincon", role: "PGY1", email: "nidouraine@arizona.edu" },
  { name: "Bryce Little", house: "Santa Rita", role: "PGY1", email: "brycelittle@arizona.edu" },
  { name: "Duy Nguyen", house: "Tortolita", role: "PGY1", email: "duymnguyen@arizona.edu" },
  { name: "Arpan Sharma", house: "Tucson", role: "PGY1", email: "arpans44@arizona.edu" },
  { name: "Faissal Stipho", house: "Catalina", role: "PGY3", email: "fstipho@arizona.edu" },
  { name: "Kalvin Thomas", house: "Rincon", role: "PGY3", email: "kalvinethomas@arizona.edu" },
  { name: "Ajdin Ekic", house: "Santa Rita", role: "PGY3", email: "aekic@arizona.edu" },
  { name: "Mathew Thomas", house: "Tortolita", role: "PGY3", email: "matjthomas95@arizona.edu" },
  { name: "Drew Rasmussen", house: "Tucson", role: "PGY3", email: "dnrasmussen@arizona.edu" },
  { name: "Shenar Dinkha", house: "Catalina", role: "PGY3", email: "sdinkha@arizona.edu" },
  { name: "Matthew Ward", house: "Rincon", role: "PGY3", email: "mbward@arizona.edu" },
  { name: "Dustin Parsons", house: "Santa Rita", role: "PGY3", email: "dustinparsons@arizona.edu" },
  { name: "Marlee Panther", house: "Tortolita", role: "PGY3", email: "marleepanther@arizona.edu" },
  { name: "Danielle Bailey", house: "Tucson", role: "PGY3", email: "daniellebailey@arizona.edu" },
  { name: "Asael Nunez", house: "Catalina", role: "PGY3", email: "asaelnunez@arizona.edu" },
  { name: "William Matloff", house: "Rincon", role: "PGY3", email: "wmatloff@arizona.edu" },
  { name: "Ricardo Reyes", house: "Santa Rita", role: "PGY2", email: "rreyes014@arizona.edu" },
  { name: "Christian Avalos", house: "Tortolita", role: "PGY3", email: "avalosc@arizona.edu" },
  { name: "Ryan Weyker", house: "Tucson", role: "PGY3", email: "rweyker@arizona.edu" },
  { name: "Spencer Chee", house: "Catalina", role: "PGY2", email: "spencerchee@arizona.edu" },
  { name: "Sydney Lovins", house: "Rincon", role: "PGY2", email: "sydneylovins@arizona.edu" },
  { name: "Christopher Sallurday", house: "Santa Rita", role: "PGY2", email: "csallurday@arizona.edu" },
  { name: "Eduardo Garcia Licerio", house: "Tortolita", role: "PGY3", email: "eduardogarcia@arizona.edu" },
  { name: "Tammy Zamaitis", house: "Tucson", role: "PGY3", email: "tzamaitis@arizona.edu" },
  { name: "Laura Tran", house: "Catalina", role: "PGY2", email: "lauratran@arizona.edu" },
  { name: "Gowtham Anche", house: "Rincon", role: "PGY2", email: "gowthamanche@arizona.edu" },
  { name: "Gagandeep Gill", house: "Santa Rita", role: "PGY2", email: "gagan@arizona.edu" },
  { name: "Emily Tishkoff", house: "Tortolita", role: "PGY3", email: "emilytishkoff@arizona.edu" },
  { name: "Mujtaba Shah", house: "Tucson", role: "PGY2", email: "mujtabashah@arizona.edu" },
  { name: "Joy Eskandar", house: "Catalina", role: "PGY2", email: "eskandarj@arizona.edu" },
  { name: "Andres Sanchez", house: "Rincon", role: "PGY2", email: "andresdsanchez@arizona.edu" },
  { name: "Brett Martin", house: "Santa Rita", role: "PGY2", email: "bmartin13@arizona.edu" },
  { name: "Tolulope Popoola", house: "Tortolita", role: "PGY3", email: "tpopoola@arizona.edu" },
  { name: "Nellie Toliver", house: "Tucson", role: "PGY2", email: "nltoliver@arizona.edu" },
  { name: "Emily Adamson", house: "Catalina", role: "PGY2", email: "eadamson@arizona.edu" },
  { name: "Benjamin Maglajac", house: "Rincon", role: "PGY2", email: "maglajac@arizona.edu" },
  { name: "Esther Cheng", house: "Santa Rita", role: "PGY2", email: "esthercheng@arizona.edu" },
  { name: "Jessica Kitsen", house: "Tortolita", role: "PGY3", email: "jkitsen@arizona.edu" },
  { name: "Rachel Rosow", house: "Tucson", role: "PGY2", email: "rrosow@arizona.edu" },
  { name: "Ho Hyun Lee", house: "Catalina", role: "PGY1", email: "hohyunlee@arizona.edu" },
  { name: "Srijit Paul", house: "Rincon", role: "PGY1", email: "srijitpaul@arizona.edu" },
  { name: "Mohamad Al-Mula Hwaish", house: "Santa Rita", role: "PGY2", email: "mohamadakeel@arizona.edu" },
  { name: "Noorhan Monther", house: "Tortolita", role: "PGY2", email: "nmonther@arizona.edu" },
  { name: "Nina Maitra", house: "Tucson", role: "PGY2", email: "ninamaitra@arizona.edu" },
  { name: "Suzette Lopez Valenzuela", house: "Catalina", role: "PGY1", email: "suzettelopez@arizona.edu" },
  { name: "Alex Wang", house: "Rincon", role: "PGY1", email: "awang41@arizona.edu" },
  { name: "Nicole Price", house: "Santa Rita", role: "PGY2", email: "nprice1@arizona.edu" },
  { name: "Isaac Zarif", house: "Tortolita", role: "PGY1", email: "izarif@arizona.edu" },
  { name: "Shawn Wang", house: "Tucson", role: "PGY2", email: "shawn5299@arizona.edu" },
  { name: "Jesse Coy", house: "Catalina", role: "PGY1", email: "jessecoy@arizona.edu" },
  { name: "Kent Lawrence", house: "Rincon", role: "PGY1", email: "alexlawrence@arizona.edu" },
  { name: "Tyler Hill", house: "Santa Rita", role: "PGY1", email: "tylerhill@arizona.edu" },
  { name: "Nandini Sodhi", house: "Tortolita", role: "PGY1", email: "nandinisodhi@arizona.edu" },
  { name: "Ethan Renfrew", house: "Tucson", role: "PGY2", email: "ethanrenfrew@arizona.edu" },
  { name: "Cassandra Everly", house: "Catalina", role: "PGY3", email: "ceverly@arizona.edu" },
  { name: "Myles Bosompem", house: "Rincon", role: "PGY1", email: "bosompem@arizona.edu" },
  { name: "Mariah Black", house: "Santa Rita", role: "PGY1", email: "mariahblack@arizona.edu" },
  { name: "Jasmine Coatley-Thomas", house: "Tortolita", role: "PGY1", email: "coatleythomas@arizona.edu" },
  { name: "D'Andre Gomez", house: "Tucson", role: "PGY1", email: "dmgomez@arizona.edu" },
  { name: "Adam Western", house: "Catalina", role: "PGY2", email: "awestern@arizona.edu" },
  { name: "Sarah Busch", house: "Rincon", role: "PGY2", email: "sarahbusch@arizona.edu" },
  { name: "Shreeya Agrawal", house: "Santa Rita", role: "PGY2", email: "shreeyaagrawal@arizona.edu" },
  { name: "Jackie Maltagliati", house: "Tortolita", role: "PGY3", email: "jackiehu@arizona.edu" },
  { name: "Nathan Giauque", house: "Tucson", role: "PGY3", email: "ngiauque@arizona.edu" },
  { name: "Basem Al-Tarshan", house: "Catalina", role: "PGY1", email: "baltarshan@arizona.edu" },
  { name: "Michael Palomares", house: "Rincon", role: "PGY2", email: "mpalomares@arizona.edu" },
  { name: "Luca Bertozzi", house: "Santa Rita", role: "PGY2", email: "labertozzi@arizona.edu" },
  { name: "Hyun Kim", house: "Tortolita", role: "PGY2", email: "kihyun@arizona.edu" },
  { name: "Khaja Siddiqui", house: "Tucson", role: "PGY2", email: "ksiddiqui@arizona.edu" },
  { name: "Sara Castaneda", house: "Catalina", role: "PGY1", email: "saravalencia@arizona.edu" },
  { name: "Jason Chen", house: "Rincon", role: "PGY1", email: "jasonlchen@arizona.edu" },
  { name: "Joey Ghotmi", house: "Santa Rita", role: "PGY1", email: "joeyghotmi@arizona.edu" },
  { name: "Angela Monetathchi", house: "Tortolita", role: "PGY1", email: "amonetathchi@arizona.edu" },
  { name: "Brielle Tobin", house: "Tucson", role: "PGY1", email: "brielletobin@arizona.edu" },
  { name: "Amanda Gong", house: "Catalina", role: "PGY1", email: "agong3@arizona.edu" },
  { name: "Soojung Choi", house: "Rincon", role: "PGY1", email: "soojungchoi@arizona.edu" },
  { name: "Kassandra Mastras", house: "Santa Rita", role: "PGY1", email: "kmastras@arizona.edu" },
  { name: "Joshua Nay", house: "Tortolita", role: "PGY1", email: "jnay@arizona.edu" },
  { name: "Shana Zadron", house: "Tucson", role: "PGY1", email: "shanazadron@arizona.edu" },
  { name: "Paige Awtrey", house: "Catalina", role: "PGY1", email: "pawtrey@arizona.edu" },
  { name: "Milan Hirpara", house: "Rincon", role: "PGY1", email: "milhirpara@arizona.edu" },
  { name: "Francine Holguin", house: "Santa Rita", role: "PGY1", email: "frholguin@arizona.edu" },
  { name: "Jocelyn Liu", house: "Tortolita", role: "PGY1", email: "jocelynliu@arizona.edu" },
  { name: "Isam Allanouf", house: "Tucson", role: "PGY1", email: "isamalannouf@arizona.edu" },
  { name: "Riley Huffman", house: "Catalina", role: "Resident" },
  { name: "Ryan Hakim", house: "Rincon", role: "PGY1", email: "ryanhakim@arizona.edu" },
  { name: "Rambod Meshgi", house: "Santa Rita", role: "PGY1", email: "rmeshgi@arizona.edu" },
  { name: "Ryan Waggoner", house: "Tortolita", role: "PGY1", email: "rwaggoner@arizona.edu" },
  { name: "Laura Zelis", house: "Tucson", role: "PGY1" },
  { name: "Samuel Stewart", house: "Catalina", role: "Resident" },
  { name: "Alexander Kim", house: "Rincon", role: "Resident" },
  { name: "Lucas Lane", house: "Santa Rita", role: "Resident" },
  { name: "Christina Lim", house: "Tortolita", role: "Resident" },
  { name: "Estevan Sandoval", house: "Tucson", role: "Resident" },
  { name: "Anthony Witten", house: "Catalina", role: "PD_APD" },
  { name: "Eric Brucks", house: "Rincon", role: "PD_APD" },
  { name: "Joao Paulo Ferreira", house: "Santa Rita", role: "PD_APD" },
  { name: "Rajesh Kotagiri", house: "Tortolita", role: "PD_APD" },
  { name: "Indu Partha", house: "Tucson", role: "PD_APD" },
  { name: "Bujji Ainapurapu", house: "Catalina", role: "PD_APD" },
  { name: "Joshua Malo", house: "Rincon", role: "PD_APD" },
  { name: "Ryan Wong", house: "Santa Rita", role: "PD_APD" },
  { name: "Dalia Mikhail", house: "Tortolita", role: "PD_APD" },
  { name: "Amy Sussman", house: "Tucson", role: "PD_APD" },
  { name: "Maria Longoria", house: "Catalina", role: "Program Staff" },
  { name: "Jazmine Koli", house: "Rincon", role: "Program Staff" },
  { name: "Elizabeth Cazesuz", house: "Santa Rita", role: "Program Staff" },
  { name: "Keanna Encinas", house: "Tortolita", role: "Program Staff" },
  { name: "Breanna Sherrow-Serrano", house: "Tucson", role: "Program Staff" }
];

const RESIDENT_ACTIVITIES = [
  {
    id: "academic",
    label: "Academic flex",
    points: 3,
    icon: "🧠",
    color: "#efe1ff",
    description: "Journal club, teaching, abstract, presentation, QI/research work.",
  },
  {
    id: "group_activity",
    label: "Group activity",
    points: 2,
    icon: "🤝",
    color: "#d7ffd8",
    description: "Dinner, trivia, coffee, game night, house hang. 2+ people.",
  },
  {
    id: "group_exercise",
    label: "Group exercise",
    points: 2,
    icon: "🏃",
    color: "#ffe0bd",
    description: "Hike, bike, climb, gym, yoga, pickleball, walk. 2+ people.",
  },
  {
    id: "wellness_challenge",
    label: "Wellness challenge",
    points: 3,
    icon: "🌵",
    color: "#c8fff3",
    description: "Monthly wellness quest, volunteering, meditation/sleep streak, etc.",
  },
  {
    id: "big_challenge",
    label: "Big Tucson challenge",
    points: 5,
    icon: "🏔️",
    color: "#fff2aa",
    description: "Summits, Loop epic, weird Tucson side quests. 5+ pts.",
  },
  {
    id: "point_pitch",
    label: "Tell me why I should give you points?",
    points: 0,
    icon: "🤔",
    color: "#ffd6ef",
    description: "Pitch your case. Tell us how many points and why.",
  },
];

const BIG_CHALLENGE_OPTIONS = [
  { label: "A Mountain summit", points: 5 },
  { label: "The Loop ride/walk epic", points: 5 },
  { label: "Sabino sunrise crew", points: 5 },
  { label: "Sonoran hot dog + group walk", points: 5 },
  { label: "Mission San Xavier reflective visit", points: 5 },
  { label: "Wasson Peak summit", points: 6 },
  { label: "Mt. Lemmon / Ski Valley pilgrimage", points: 6 },
  { label: "Mt. Wrightson summit", points: 7 },
  { label: "Mica Mountain madness", points: 8 },
  { label: "Custom big Tucson side quest", points: 5 },
];

function csvEscape(value) {
  const text = String(value === null || value === undefined ? "" : value);
  if (text.indexOf(",") !== -1 || text.indexOf("\n") !== -1 || text.indexOf('"') !== -1) {
    return '"' + text.replace(/"/g, '""') + '"';
  }
  return text;
}

function normalizeName(value) {
  return String(value === null || value === undefined ? "" : value)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function findRosterPerson(name) {
  const normalized = normalizeName(name);
  if (!normalized) return null;
  for (let i = 0; i < ROSTER.length; i += 1) {
    const person = ROSTER[i];
    if (person && normalizeName(person.name) === normalized) return person;
  }
  return null;
}

function getRosterHouse(name) {
  const person = findRosterPerson(name);
  return person && person.house ? person.house : "Unknown";
}

function authenticateChief(name, password) {
  const user = normalizeName(name);
  const pass = String(password || "");
  for (let i = 0; i < CHIEF_USERS.length; i += 1) {
    if (normalizeName(CHIEF_USERS[i].name) === user && CHIEF_USERS[i].password === pass) return CHIEF_USERS[i];
  }
  return null;
}

function todayString() {
  return new Date().toISOString().slice(0, 10);
}

function makeEmptyTotals() {
  const base = {};
  for (let i = 0; i < HOUSES.length; i += 1) base[HOUSES[i]] = 0;
  return base;
}

function isIndependentAdjudicator(person) {
  if (!person) return false;
  return Boolean(person.lowestHouseCredit || person.role === "Independent Adjudicator" || person.house === "All");
}

function getLowestHouseName(rows) {
  const base = makeEmptyTotals();
  const safeRows = Array.isArray(rows) ? rows : [];
  for (let i = 0; i < safeRows.length; i += 1) {
    const row = safeRows[i];
    if (!row || !row.house || row.house === "Unknown" || row.house === "All") continue;
    if (base[row.house] === undefined) continue;
    base[row.house] += Number(row.points || 0);
  }

  let lowestHouse = HOUSES[0];
  let lowestPoints = base[lowestHouse] || 0;
  for (let j = 1; j < HOUSES.length; j += 1) {
    const houseName = HOUSES[j];
    const points = base[houseName] || 0;
    if (points < lowestPoints) {
      lowestHouse = houseName;
      lowestPoints = points;
    }
  }
  return lowestHouse;
}

function calculateHouseTotals(rows) {
  const base = makeEmptyTotals();
  const safeRows = Array.isArray(rows) ? rows : [];
  for (let i = 0; i < safeRows.length; i += 1) {
    const row = safeRows[i];
    if (!row || !row.house || row.house === "Unknown" || row.house === "All") continue;
    if (base[row.house] === undefined) continue;
    base[row.house] += Number(row.points || 0);
  }
  const totals = [];
  for (let j = 0; j < HOUSES.length; j += 1) {
    const houseName = HOUSES[j];
    totals.push({ house: houseName, points: base[houseName] || 0 });
  }
  totals.sort(function sortTotals(a, b) {
    return b.points - a.points || a.house.localeCompare(b.house);
  });
  return totals;
}

function splitAttendanceNames(text) {
  return String(text === null || text === undefined ? "" : text)
    .split(/\r?\n|,/)
    .map(function cleanName(name) { return name.trim(); })
    .filter(function keepName(name) { return name.length > 0; });
}

function attendanceTextToRows(options) {
  const opts = options || {};
  const text = opts.text || "";
  const eventTitle = opts.eventTitle || "AHD / conference attendance";
  const eventDate = opts.eventDate || todayString();
  const points = Number(opts.points || 1) || 1;
  const uploadedBy = opts.uploadedBy || "Unknown chief";
  const currentRows = opts.currentRows || [];
  const names = splitAttendanceNames(text);
  return names.map(function makeAttendanceRow(name) {
    const rosterPerson = findRosterPerson(name);
    const isAdjudicator = isIndependentAdjudicator(rosterPerson);
    const matchedHouse = isAdjudicator ? getLowestHouseName(currentRows) : rosterPerson && rosterPerson.house ? rosterPerson.house : "Unknown";
    const attendanceNote = isAdjudicator
      ? "Uploaded attendance - independent adjudicator credited to lowest house at upload time (" + matchedHouse + ")"
      : rosterPerson ? "Uploaded attendance" : "Uploaded attendance - house not found in roster";
    return {
      timestamp: new Date().toISOString(),
      date: eventDate,
      name: name,
      house: matchedHouse,
      activity: eventTitle,
      points: points,
      people: "",
      note: attendanceNote,
      photoName: "",
      photoStatus: "not_required",
      source: "chief_ahd_upload",
      uploadedBy: uploadedBy,
    };
  });
}

function chiefBonusToRow(options) {
  const opts = options || {};
  const house = opts.house || "Unknown";
  const eventTitle = opts.eventTitle || "Kahoot / trivia bonus";
  const eventDate = opts.eventDate || todayString();
  const points = Number(opts.points || 0) || 0;
  const note = opts.note || "Chief-scored bonus points";
  const uploadedBy = opts.uploadedBy || "Unknown chief";
  return {
    timestamp: new Date().toISOString(),
    date: eventDate,
    name: house + " house",
    house: house,
    activity: eventTitle,
    points: points,
    people: "",
    note: note,
    photoName: "",
    photoStatus: "not_required",
    source: "chief_bonus",
    uploadedBy: uploadedBy,
  };
}

function runSelfTests() {
  const escapedComma = csvEscape("coffee, tacos");
  const escapedQuote = csvEscape('He said "nice"');
  const totals = calculateHouseTotals([
    { house: "Catalina", points: 1 },
    { house: "Catalina", points: 3 },
    { house: "Rincon", points: 2 },
  ]);
  const uploadedRows = attendanceTextToRows({ text: "Nate Walton\nResident Example", eventTitle: "AHD", eventDate: "2026-07-01", points: 1 });
  const mixedDelimiterRows = attendanceTextToRows({ text: "Nate Walton\r\nResident Example, Faculty Example", eventTitle: "AHD", eventDate: "2026-07-01", points: 1 });
  const unknownRows = attendanceTextToRows({ text: "Unknown Human", eventTitle: "AHD", eventDate: "2026-07-01", points: 1 });
  const emptyRows = attendanceTextToRows({ text: "", eventTitle: "AHD", eventDate: "2026-07-01", points: 1 });
  const bonusRow = chiefBonusToRow({ house: "Tucson", eventTitle: "Trivia win", eventDate: "2026-07-01", points: 5, note: "Winner", uploadedBy: "Nate" });
  const catalinaTotal = totals.find(function findCatalina(total) { return total.house === "Catalina"; });
  const rinconTotal = totals.find(function findRincon(total) { return total.house === "Rincon"; });

  console.assert(escapedComma === '"coffee, tacos"', "csvEscape should wrap comma-containing values");
  console.assert(escapedQuote === '"He said ""nice"""', "csvEscape should double embedded quotes");
  console.assert(catalinaTotal && catalinaTotal.points === 4, "Catalina should total 4 points");
  console.assert(rinconTotal && rinconTotal.points === 2, "Rincon should total 2 points");
  console.assert(RESIDENT_ACTIVITIES.length === 6, "Resident-facing menu should stay intentionally simple but include big challenges and point pitches");
  console.assert(bonusRow.house === "Tucson" && bonusRow.points === 5 && bonusRow.source === "chief_bonus", "Chief bonus should create one house-level row");
  console.assert(uploadedRows.length === 2, "Attendance paste should create one row per attendee");
  console.assert(uploadedRows[0].house === "Catalina", "Attendance upload should auto-match roster houses");
  console.assert(mixedDelimiterRows.length === 3, "Attendance paste should split on newlines, Windows newlines, and commas");
  console.assert(unknownRows.length === 1 && unknownRows[0].house === "Unknown", "Unknown names should be handled gracefully");
  console.assert(emptyRows.length === 0, "Empty attendance text should create no rows");
  console.assert(findRosterPerson("No Match") === null, "findRosterPerson should return null for unmatched names");
  console.assert(getRosterHouse("No Match") === "Unknown", "getRosterHouse should return Unknown for unmatched names");
  console.assert(isIndependentAdjudicator(findRosterPerson("Laura Meinke")), "Laura Meinke should be treated as independent adjudicator");
  console.assert(getLowestHouseName([{ house: "Catalina", points: 10 }, { house: "Rincon", points: 2 }]) === "Santa Rita", "Lowest-house helper should credit the lowest current team with deterministic tie order");
  console.assert(splitAttendanceNames(" A ,\n B \r\n C ").length === 3, "splitAttendanceNames should trim and split mixed input");
  console.assert(calculateHouseTotals(null).length === HOUSES.length, "calculateHouseTotals should tolerate null input");
  console.assert(authenticateChief("Nate", "wootwoot1!") && authenticateChief("Nate", "wootwoot1!").name === "Nate", "Known chief credentials should authenticate");
  console.assert(authenticateChief("nate", "wrong") === null, "Wrong chief password should fail");
  console.assert(bonusRow.uploadedBy === "Nate", "Chief bonus should track uploader");
}

runSelfTests();

function fileToBase64(file) {
  return new Promise(function convertFile(resolve, reject) {
    if (!file) {
      resolve("");
      return;
    }
    const reader = new FileReader();
    reader.onload = function onLoad() {
      const result = String(reader.result || "");
      const commaIndex = result.indexOf(",");
      resolve(commaIndex >= 0 ? result.slice(commaIndex + 1) : result);
    };
    reader.onerror = function onError() {
      reject(reader.error || new Error("Could not read file"));
    };
    reader.readAsDataURL(file);
  });
}

async function submitToAppsScript(row, photoFile) {
  if (!APPS_SCRIPT_WEB_APP_URL) {
    return { ok: false, skipped: true, message: "Apps Script URL not configured yet" };
  }

  const payload = Object.assign({}, row);
  if (photoFile) {
    payload.photoBase64 = await fileToBase64(photoFile);
    payload.photoName = photoFile.name || row.photoName || "house-cup-photo.jpg";
    payload.photoMimeType = photoFile.type || "image/jpeg";
  }

  // text/plain avoids a browser preflight request, which keeps Apps Script v1 much simpler.
  // mode: no-cors means the browser will not expose the JSON response, but the POST still reaches Apps Script.
  await fetch(APPS_SCRIPT_WEB_APP_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload),
  });

  return { ok: true, message: "Submitted to Apps Script" };
}

async function submitRowsToAppsScript(rows) {
  const safeRows = Array.isArray(rows) ? rows : [];
  for (let i = 0; i < safeRows.length; i += 1) {
    await submitToAppsScript(safeRows[i], null);
  }
  return { ok: true, count: safeRows.length };
}

function downloadCSV(rows) {
  const headers = ["timestamp", "date", "name", "house", "activity", "points", "people", "note", "photoName", "photoStatus", "source", "uploadedBy"];
  const safeRows = Array.isArray(rows) ? rows : [];
  const lines = [headers.join(",")];
  for (let i = 0; i < safeRows.length; i += 1) {
    const row = safeRows[i];
    const cells = headers.map(function makeCsvCell(header) { return csvEscape(row ? row[header] : ""); });
    lines.push(cells.join(","));
  }
  const csv = lines.join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "house-cup-points.csv";
  link.click();
  URL.revokeObjectURL(url);
}

function FieldLabel(props) {
  return <label className="hc-label">{props.children}</label>;
}

function TextInput(props) {
  return <input {...props} className={(props.className || "") + " hc-input"} />;
}

function SelectInput(props) {
  return <select value={props.value} onChange={props.onChange} className="hc-input">{props.children}</select>;
}

function TabButton(props) {
  return (
    <button type="button" onClick={props.onClick} className={"hc-tab " + (props.active ? "active" : "")}>{props.children}</button>
  );
}

function HouseCupStyles() {
  return (
    <style>{`
      .hc-page {
        min-height: 100vh;
        padding: 18px;
        color: #24130d;
        background-color: #fff7b8;
        background-image:
          radial-gradient(circle at 12px 12px, rgba(0,128,96,.28) 0 3px, transparent 4px),
          radial-gradient(circle at 34px 34px, rgba(0,128,96,.22) 0 2px, transparent 3px),
          linear-gradient(135deg, rgba(255,255,255,.62), rgba(255,214,231,.52), rgba(217,247,255,.58));
        background-size: 46px 46px, 46px 46px, auto;
        font-family: Verdana, Geneva, Tahoma, sans-serif;
      }
      .hc-shell { max-width: 1120px; margin: 0 auto; }
      .hc-hero {
        border: 4px solid #000;
        border-radius: 0;
        padding: 18px;
        background: linear-gradient(to bottom, #ffffff 0%, #fffef0 100%);
        box-shadow: 8px 8px 0 #000;
        text-align: center;
        position: relative;
      }
      .hc-browserbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        margin: -18px -18px 14px -18px;
        padding: 8px 12px;
        background: linear-gradient(to right, #0f4c81, #4f86c6);
        color: #fff;
        font-size: 12px;
        font-weight: 900;
        border-bottom: 3px solid #000;
      }
      .hc-browserdots { display: flex; gap: 6px; }
      .hc-browserdots span { width: 12px; height: 12px; border-radius: 999px; display: inline-block; border: 1px solid #111; }
      .hc-browserdots span:nth-child(1) { background: #ff5f57; }
      .hc-browserdots span:nth-child(2) { background: #febc2e; }
      .hc-browserdots span:nth-child(3) { background: #28c840; }
      .hc-kicker { display: inline-block; padding: 7px 12px; border: 3px solid #000; border-radius: 0; background: #ffff66; color: #000; font-weight: 1000; text-transform: uppercase; box-shadow: 3px 3px 0 #000; }
      .hc-title { margin: 14px 0 8px; font-size: clamp(40px, 8vw, 86px); line-height: .9; font-weight: 1000; letter-spacing: -2px; text-transform: uppercase; color: #d4006a; text-shadow: 2px 2px 0 #fff, 4px 4px 0 #000; }
      .hc-subtitle { margin: 0 auto; max-width: 760px; color: #243b53; font-size: 15px; font-weight: 800; }
      .hc-marquee-wrap { margin-top: 14px; border: 3px solid #000; background: #000; overflow: hidden; }
      .hc-marquee { display: inline-block; white-space: nowrap; color: #00ff66; font-family: "Courier New", monospace; font-size: 14px; font-weight: 900; padding: 7px 0; animation: hc-scroll 18s linear infinite; }
      @keyframes hc-scroll { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
      .hc-counterbar { margin-top: 10px; display: flex; justify-content: center; gap: 12px; flex-wrap: wrap; }
      .hc-counter, .hc-underconstruction, .hc-webmaster { border: 2px solid #000; background: #fff; padding: 6px 10px; font-family: "Courier New", monospace; font-size: 12px; font-weight: 1000; box-shadow: 3px 3px 0 #000; }
      .hc-underconstruction { background: repeating-linear-gradient(45deg, #ffeb3b, #ffeb3b 10px, #000 10px, #000 20px); color: #fff; text-shadow: 1px 1px 0 #000; }
      .hc-webmaster { color: #0000ee; text-decoration: underline; cursor: pointer; }
      .hc-card { margin-top: 18px; border: 4px solid #000; border-radius: 0; padding: 16px; background: rgba(255,255,255,.95); box-shadow: 6px 6px 0 #000; }
      .hc-grid { display: grid; gap: 12px; }
      .hc-grid-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
      .hc-grid-5 { grid-template-columns: repeat(5, minmax(0, 1fr)); }
      .hc-label { display: block; margin-bottom: 6px; font-size: 12px; font-weight: 1000; color: #000080; text-transform: uppercase; }
      .hc-input { width: 100%; box-sizing: border-box; border-top: 3px solid #777; border-left: 3px solid #777; border-right: 3px solid #fff; border-bottom: 3px solid #fff; border-radius: 0; padding: 10px 12px; background: #fff; color: #111827; font: inherit; outline: none; }
      .hc-input:focus { background: #fffde7; }
      .hc-muted { color: #5b6470; font-size: 12px; font-weight: 700; }
      .hc-alert { margin-top: 16px; padding: 12px; border: 3px dashed #0033cc; background: #dbeafe; color: #002b7f; font-weight: 900; }
      .hc-tabs { margin-top: 18px; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; }
      .hc-tab { border-top: 3px solid #fff; border-left: 3px solid #fff; border-right: 3px solid #000; border-bottom: 3px solid #000; border-radius: 0; padding: 10px 8px; background: linear-gradient(to bottom, #fefefe, #d9d9d9); color: #111827; font-weight: 1000; cursor: pointer; text-transform: uppercase; }
      .hc-tab.active { background: linear-gradient(to bottom, #ff8ad8, #ff4db3); color: #fff; text-shadow: 1px 1px 0 #000; transform: translate(1px, 1px); }
      .hc-actions { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; margin-top: 18px; }
      .hc-action { min-height: 164px; border: 4px solid #000; border-radius: 0; padding: 16px; text-align: left; cursor: pointer; box-shadow: 6px 6px 0 #000; transition: transform .06s ease, box-shadow .06s ease; position: relative; overflow: hidden; }
      .hc-action::after { content: ""; position: absolute; inset: 0; background: linear-gradient(to bottom right, rgba(255,255,255,.25), transparent 40%); pointer-events: none; }
      .hc-action:hover { transform: translate(2px, 2px); box-shadow: 4px 4px 0 #000; }
      .hc-action:disabled { opacity: .5; cursor: not-allowed; }
      .hc-action-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; }
      .hc-icon { font-size: 38px; line-height: 1; }
      .hc-badge { display: inline-block; padding: 5px 10px; border: 2px solid #000; border-radius: 0; background: #000; color: #00ff66; font-family: "Courier New", monospace; font-weight: 1000; }
      .hc-action-title { margin-top: 16px; font-size: 24px; font-weight: 1000; text-transform: uppercase; color: #111; }
      .hc-action-desc { margin-top: 6px; font-size: 13px; color: #334155; font-weight: 700; }
      .hc-button { border-top: 3px solid #fff; border-left: 3px solid #fff; border-right: 3px solid #000; border-bottom: 3px solid #000; border-radius: 0; padding: 10px 14px; background: linear-gradient(to bottom, #fffbcc, #ffd54f); color: #000; font-weight: 1000; cursor: pointer; text-transform: uppercase; }
      .hc-button.secondary { background: linear-gradient(to bottom, #fff, #d9d9d9); color: #111827; }
      .hc-button.danger { background: linear-gradient(to bottom, #ffd6d6, #ff9b9b); color: #7f0000; }
      .hc-button:disabled { opacity: .45; cursor: not-allowed; }
      .hc-row { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }
      .hc-success { margin-top: 16px; border: 3px solid #14532d; border-radius: 0; padding: 12px; background: #dcfce7; color: #14532d; font-weight: 900; }
      .hc-table-wrap { max-height: 380px; overflow: auto; border: 3px solid #000; border-radius: 0; background: #fff; }
      .hc-table { width: 100%; border-collapse: collapse; font-size: 13px; }
      .hc-table th { position: sticky; top: 0; background: #ffeb3b; border-bottom: 2px solid #000; padding: 10px; text-align: left; text-transform: uppercase; }
      .hc-table td { border-top: 1px solid #cbd5e1; padding: 10px; }
      .hc-leader { border: 4px solid #000; border-radius: 0; padding: 18px; text-align: center; background: linear-gradient(to bottom, #fff, #f8fafc); box-shadow: 5px 5px 0 #000; }
      .hc-rank { color: #000080; font-weight: 1000; }
      .hc-house { margin-top: 6px; font-size: 22px; font-weight: 1000; text-transform: uppercase; }
      .hc-score { margin-top: 12px; font-size: 54px; font-weight: 1000; color: #c2185b; text-shadow: 2px 2px 0 #00000022; }
      .hc-photo-preview { margin-top: 8px; max-height: 90px; border: 2px solid #000; border-radius: 0; object-fit: cover; }
      .hc-login { max-width: 440px; margin: 18px auto 0; }
      .hc-footer { margin-top: 18px; border: 3px dotted #000; border-radius: 0; padding: 14px; background: rgba(255,255,255,.86); font-size: 13px; color: #334155; font-weight: 700; }
      .hc-blink { animation: hc-blink 1s step-start infinite; }
      @keyframes hc-blink { 50% { opacity: 0; } }

      .hc-resident-zone { padding-bottom: 8px; }
      .hc-submit-card { position: relative; }
      .hc-mobile-submit-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 16px; }
      .hc-mobile-submit-header h2 { margin: 6px 0 0; font-size: 34px; line-height: .95; font-family: Impact, Haettenschweiler, "Arial Black", sans-serif; text-transform: uppercase; }
      .hc-submit-pill { border: 3px solid #000; background: #fff7b8; box-shadow: 3px 3px 0 #000; padding: 8px 10px; font-weight: 1000; font-size: 12px; text-transform: uppercase; max-width: 150px; text-align: center; }
      .hc-big-input { min-height: 52px; font-size: 18px; }
      .hc-name-field { grid-column: span 3; }
      .hc-house-confirm { border: 3px solid #000; background: #e8ffe8; box-shadow: 3px 3px 0 #000; padding: 10px; margin: 10px 0 16px; display: flex; align-items: center; justify-content: space-between; gap: 8px; font-weight: 900; }
      .hc-house-confirm button { border: 2px solid #000; background: #fff; font-weight: 1000; padding: 6px 8px; cursor: pointer; text-transform: uppercase; }
      .hc-section-title { margin: 18px 0 10px; font-weight: 1000; text-transform: uppercase; letter-spacing: .5px; color: #000080; }
      .hc-mobile-details { margin-top: 18px; border: 3px solid #000; background: #fffdf0; box-shadow: 3px 3px 0 #000; padding: 10px; }
      .hc-mobile-details summary { cursor: pointer; font-weight: 1000; text-transform: uppercase; color: #000080; }
      .hc-mobile-details .hc-grid { margin-top: 12px; }
      .hc-photo-upload { margin-top: 12px; border: 3px dashed #000; background: #fff; padding: 16px; display: block; text-align: center; font-weight: 1000; cursor: pointer; }
      .hc-photo-upload input { display: block; width: 100%; margin-top: 10px; }
      .hc-action.selected { background: #fff176 !important; transform: translate(2px, 2px); box-shadow: 2px 2px 0 #000; }
      .hc-action.selected .hc-badge { background: #d4006a; color: #fff; }
      .hc-mobile-submit-spacer { display: none; }
      .hc-mobile-submit-bar { margin-top: 18px; border: 3px solid #000; background: #fff7b8; box-shadow: 4px 4px 0 #000; padding: 10px; display: flex; align-items: center; justify-content: space-between; gap: 12px; }
      .hc-mobile-submit-bar small { display: block; font-size: 11px; font-weight: 900; opacity: .75; text-transform: uppercase; }
      .hc-submit-now { min-width: 150px; }
      @media (max-width: 860px) { .hc-grid-4, .hc-grid-5, .hc-actions, .hc-tabs { grid-template-columns: 1fr 1fr; } }
      @media (max-width: 560px) {
        .hc-page { padding: 8px; padding-bottom: 118px; }
        .hc-hero { padding: 12px; box-shadow: 4px 4px 0 #000; }
        .hc-browserbar { margin: -12px -12px 12px -12px; font-size: 10px; }
        .hc-title { font-size: 46px; }
        .hc-subtitle { font-size: 13px; }
        .hc-counter, .hc-underconstruction { display: none; }
        .hc-card { padding: 12px; box-shadow: 3px 3px 0 #000; }
        .hc-grid-4, .hc-grid-5, .hc-actions, .hc-tabs { grid-template-columns: 1fr; }
        .hc-tabs { gap: 6px; }
        .hc-tab { min-height: 44px; font-size: 11px; }
        .hc-mobile-submit-header { align-items: center; }
        .hc-name-field { grid-column: span 1; }
        .hc-mobile-submit-header h2 { font-size: 32px; }
        .hc-submit-pill { font-size: 10px; max-width: 105px; padding: 7px; }
        .hc-big-input, .hc-input { min-height: 52px; font-size: 16px; }
        .hc-actions { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 9px; }
        .hc-action { min-height: 112px; padding: 12px 8px; box-shadow: 3px 3px 0 #000; }
        .hc-action-title { font-size: 13px; margin-top: 10px; }
        .hc-action-desc { display: none; }
        .hc-icon { font-size: 30px; }
        .hc-badge { font-size: 12px; padding: 4px 7px; }
        .hc-mobile-details { margin-top: 14px; }
        .hc-mobile-submit-spacer { display: block; height: 82px; }
        .hc-mobile-submit-bar { position: fixed; left: 8px; right: 8px; bottom: 8px; z-index: 60; margin-top: 0; padding: 9px; }
        .hc-submit-now { min-width: 120px; min-height: 48px; font-size: 16px; }
        .hc-photo-upload { padding: 14px 10px; }
        .hc-photo-preview { max-width: 100%; max-height: 170px; }
        .hc-table { min-width: 720px; }
      }
    `}</style>
  );
}

export default function HouseCupPointLogger() {
  const [activeTab, setActiveTab] = useState("log");
  const [name, setName] = useState("");
  const [house, setHouse] = useState("");
  const [people, setPeople] = useState("");
  const [note, setNote] = useState("");
  const [photoName, setPhotoName] = useState("");
  const [photoPreview, setPhotoPreview] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [submitStatus, setSubmitStatus] = useState("");
  const [bigChallengeLabel, setBigChallengeLabel] = useState(BIG_CHALLENGE_OPTIONS[0].label);
  const [pointPitchAmount, setPointPitchAmount] = useState(1);
  const [selectedActivityId, setSelectedActivityId] = useState("");
  const [rows, setRows] = useState([]);
  const [lastSaved, setLastSaved] = useState(null);

  const [chiefName, setChiefName] = useState("");
  const [chiefPassword, setChiefPassword] = useState("");
  const [chiefAuthed, setChiefAuthed] = useState(false);
  const [currentChief, setCurrentChief] = useState("");
  const [chiefMessage, setChiefMessage] = useState("");

  const [attendanceText, setAttendanceText] = useState("");
  const [attendanceTitle, setAttendanceTitle] = useState("AHD / conference attendance");
  const [attendanceDate, setAttendanceDate] = useState(todayString());
  const [attendancePoints, setAttendancePoints] = useState(1);
  const [uploadMessage, setUploadMessage] = useState("");
  const [bonusHouse, setBonusHouse] = useState("");
  const [bonusTitle, setBonusTitle] = useState("Kahoot / trivia bonus");
  const [bonusDate, setBonusDate] = useState(todayString());
  const [bonusPoints, setBonusPoints] = useState(3);
  const [bonusNote, setBonusNote] = useState("");
  const [bonusMessage, setBonusMessage] = useState("");
  const [googleFolderLink, setGoogleFolderLink] = useState(GOOGLE_EVIDENCE_FOLDER_URL);

  const rosterMatch = findRosterPerson(name);
  const isAdjudicator = isIndependentAdjudicator(rosterMatch);
  const adjudicatorHouse = isAdjudicator ? getLowestHouseName(rows) : "";
  const effectiveHouse = isAdjudicator ? adjudicatorHouse : rosterMatch && rosterMatch.house ? rosterMatch.house : house;
  const housePillText = isAdjudicator ? "Lowest: " + adjudicatorHouse : effectiveHouse || "Pick house";
  const canSubmit = Boolean(name.trim() && effectiveHouse);
  const selectedActivity = RESIDENT_ACTIVITIES.find(function findSelectedActivity(activity) { return activity.id === selectedActivityId; }) || null;
  const selectedPointSummary = selectedActivity
    ? selectedActivity.id === "point_pitch"
      ? "+?"
      : selectedActivity.id === "big_challenge"
        ? "+" + getBigChallengeSelection().points
        : "+" + selectedActivity.points
    : "Pick";
  const submitButtonText = !name.trim()
    ? "Add name"
    : !effectiveHouse
      ? "Pick house"
      : !selectedActivity
        ? "Pick points"
        : "Submit";

  const totals = useMemo(function memoTotals() { return calculateHouseTotals(rows); }, [rows]);
  const unknownUploads = rows.filter(function findUnknownUpload(row) { return row && row.house === "Unknown"; });

  function handlePhotoChange(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) {
      setPhotoName("");
      setPhotoPreview("");
      setPhotoFile(null);
      return;
    }
    setPhotoName(file.name);
    setPhotoPreview(URL.createObjectURL(file));
    setPhotoFile(file);
  }

  function getBigChallengeSelection() {
    for (let i = 0; i < BIG_CHALLENGE_OPTIONS.length; i += 1) {
      if (BIG_CHALLENGE_OPTIONS[i].label === bigChallengeLabel) return BIG_CHALLENGE_OPTIONS[i];
    }
    return BIG_CHALLENGE_OPTIONS[0];
  }

  async function logActivity(activity) {
    if (!canSubmit) return;
    let finalActivity = activity.label;
    let finalPoints = activity.points;
    if (activity.id === "big_challenge") {
      const selected = getBigChallengeSelection();
      finalActivity = selected.label;
      finalPoints = selected.points;
    }

    if (activity.id === "point_pitch") {
      finalActivity = "Point pitch - chief review requested";
      finalPoints = Number(pointPitchAmount) || 0;
      if (!note.trim()) {
        setSubmitStatus("For a point pitch, tell us why you deserve points in the note field first.");
        return;
      }
    }

    const baseNote = activity.id === "point_pitch" ? "Requested " + (Number(pointPitchAmount) || 0) + " point(s): " + note.trim() : note.trim();
    const adjudicatorNote = isAdjudicator ? "Independent adjudicator: points credited to lowest house at submission time (" + effectiveHouse + ")." : "";
    const finalNote = [baseNote, adjudicatorNote].filter(function keepNote(part) { return Boolean(part); }).join(" ");

    const row = {
      timestamp: new Date().toISOString(),
      date: todayString(),
      name: name.trim(),
      house: effectiveHouse,
      activity: finalActivity,
      points: finalPoints,
      people: people.trim(),
      note: finalNote,
      photoName: photoName,
      photoStatus: photoName ? "selected_locally_not_uploaded" : "none",
      source: activity.id === "point_pitch" ? "resident_point_pitch" : "resident_log",
    };

    setRows(function addResidentRow(previousRows) { return [row].concat(previousRows); });
    setLastSaved(row);
    setNote("");
    setSubmitStatus(APPS_SCRIPT_WEB_APP_URL ? "Uploading to Google Drive/Sheet..." : "Saved locally. Add Apps Script URL to enable Google upload.");

    try {
      await submitToAppsScript(row, photoFile);
      setSubmitStatus(APPS_SCRIPT_WEB_APP_URL ? "Submitted to Google Sheet/Drive." : "Saved locally. Apps Script URL not configured yet.");
    } catch (error) {
      setSubmitStatus("Saved locally, but Google upload failed. Try again or export CSV.");
    }

    setPhotoName("");
    setPhotoPreview("");
    setPhotoFile(null);
    setSelectedActivityId("");
  }

  async function submitSelectedActivity() {
    if (!selectedActivity) {
      setSubmitStatus("Pick a point category first.");
      return;
    }
    await logActivity(selectedActivity);
  }

  function loginChief() {
    const chiefUser = authenticateChief(chiefName, chiefPassword);
    if (chiefUser) {
      setChiefAuthed(true);
      setCurrentChief(chiefUser.name);
      setChiefMessage("Chief mode unlocked as " + chiefUser.name + ".");
      setActiveTab("chief");
    } else {
      setChiefAuthed(false);
      setCurrentChief("");
      setChiefMessage("Nope. Wrong name/password.");
    }
  }

  async function importAttendance() {
    const imported = attendanceTextToRows({ text: attendanceText, eventTitle: attendanceTitle, eventDate: attendanceDate, points: Number(attendancePoints) || 1, uploadedBy: currentChief || chiefName || "Unknown chief", currentRows: rows });
    if (!imported.length) {
      setUploadMessage("Paste at least one attendee name.");
      return;
    }
    setRows(function addAttendanceRows(previousRows) { return imported.concat(previousRows); });
    setAttendanceText("");
    const unknownCount = imported.filter(function countUnknown(row) { return row.house === "Unknown"; }).length;
    setUploadMessage("Imported " + imported.length + " attendance entries" + (unknownCount ? " - " + unknownCount + " need roster/house cleanup" : "") + ".");

    try {
      await submitRowsToAppsScript(imported);
      if (APPS_SCRIPT_WEB_APP_URL) setUploadMessage("Imported and submitted " + imported.length + " attendance entries" + (unknownCount ? " - " + unknownCount + " need roster/house cleanup" : "") + ".");
    } catch (error) {
      setUploadMessage("Imported locally, but Google upload failed. Export CSV as backup.");
    }
  }

  async function addChiefBonus() {
    if (!bonusHouse) {
      setBonusMessage("Choose a house first.");
      return;
    }
    const row = chiefBonusToRow({ house: bonusHouse, eventTitle: bonusTitle, eventDate: bonusDate, points: Number(bonusPoints) || 0, note: bonusNote, uploadedBy: currentChief || chiefName || "Unknown chief" });
    setRows(function addBonusRow(previousRows) { return [row].concat(previousRows); });
    setBonusNote("");
    setBonusMessage("Added " + row.points + " bonus point(s) to " + row.house + ".");

    try {
      await submitToAppsScript(row, null);
      if (APPS_SCRIPT_WEB_APP_URL) setBonusMessage("Added and submitted " + row.points + " bonus point(s) to " + row.house + ".");
    } catch (error) {
      setBonusMessage("Added locally, but Google upload failed. Export CSV as backup.");
    }
  }

  function clearRows() {
    setRows([]);
    setLastSaved(null);
    setUploadMessage("");
    setBonusMessage("");
  }

  return (
    <div className="hc-page">
      <HouseCupStyles />
      <div className="hc-shell">
        <header className="hc-hero">
          <div className="hc-browserbar">
            <div className="hc-browserdots"><span></span><span></span><span></span></div>
            <div>HouseCupPointOMatic.html</div>
            <div>Best viewed on nights 🌙</div>
          </div>
          <div className="hc-kicker">🏔️ UA Internal Medicine House Cup</div>
          <h1 className="hc-title">Point-O-Matic</h1>
          <p className="hc-subtitle">Points for showing up, doing cool stuff together, and keeping residency a little less soul-crushing.</p>
          <div className="hc-marquee-wrap">
            <div className="hc-marquee">★ WELCOME HOUSE GOBLINS ★ LOG YOUR POINTS ★ DO COOL STUFF ★ TOUCH GRASS ★ BE WELL ★</div>
          </div>
          <div className="hc-counterbar">
            <div className="hc-counter">Visitor #: 000042</div>
            <div className="hc-underconstruction">UNDER CONSTRUCTION</div>
            <a className="hc-webmaster" href="mailto:nathantwalton@gmail.com?subject=House%20Cup%20Point-O-Matic">email the webmaster</a>
            <div className="hc-counter">Status: <span className="hc-blink">ONLINE</span></div>
          </div>
        </header>

        <nav className="hc-tabs">
          <TabButton active={activeTab === "log"} onClick={function selectLog() { setActiveTab("log"); }}>Resident Zone</TabButton>
          <TabButton active={activeTab === "leaderboard"} onClick={function selectLeaderboard() { setActiveTab("leaderboard"); }}>Hall of Glory</TabButton>
          <TabButton active={activeTab === "chiefLogin" || activeTab === "chief"} onClick={function selectChief() { setActiveTab(chiefAuthed ? "chief" : "chiefLogin"); }}>Secret Chief Lair</TabButton>
          <TabButton active={activeTab === "data"} onClick={function selectData() { setActiveTab("data"); }}>Nerd Stuff</TabButton>
        </nav>

        {activeTab === "log" && (
          <section className="hc-resident-zone">
            <div className="hc-card hc-submit-card">
              <div className="hc-mobile-submit-header">
                <div>
                  <div className="hc-kicker">Resident Zone</div>
                  <h2>Submit points</h2>
                </div>
                <div className="hc-submit-pill">{housePillText}</div>
              </div>

              <div className="hc-grid hc-grid-4">
                <div className="hc-name-field">
                  <FieldLabel>Your name</FieldLabel>
                  <TextInput
                    list="names"
                    value={name}
                    onChange={function updateName(event) { setName(event.target.value); }}
                    placeholder="Start typing your name"
                    className="hc-big-input"
                  />
                  <datalist id="names">{ROSTER.map(function renderStarterName(person) { return <option key={person.name} value={person.name} />; })}</datalist>
                </div>

                <div>
                  <FieldLabel>House</FieldLabel>
                  {rosterMatch ? (
                    <div className="hc-house-confirm">
                      <span><b>{isAdjudicator ? "Lowest house now: " + adjudicatorHouse : rosterMatch.house}</b> auto</span>
                      <button type="button" onClick={function clearMatchedName() { setName(""); setHouse(""); }}>change</button>
                    </div>
                  ) : (
                    <SelectInput value={house} onChange={function updateHouse(event) { setHouse(event.target.value); }}>
                      <option value="">Choose house</option>
                      {HOUSES.map(function renderHouse(houseName) { return <option key={houseName} value={houseName}>{houseName}</option>; })}
                    </SelectInput>
                  )}
                </div>
              </div>

              <div className="hc-section-title">What are you submitting?</div>

              <div className="hc-actions">
                {RESIDENT_ACTIVITIES.map(function renderActivity(activity) {
                  const isBig = activity.id === "big_challenge";
                  const isPitch = activity.id === "point_pitch";
                  const big = getBigChallengeSelection();
                  const isSelected = selectedActivityId === activity.id;
                  return (
                    <button
                      key={activity.id}
                      type="button"
                      onClick={function selectActivity() { setSelectedActivityId(activity.id); setSubmitStatus(""); }}
                      className={"hc-action " + (isSelected ? "selected" : "")}
                      style={{ background: activity.color }}
                    >
                      <div className="hc-action-top">
                        <span className="hc-icon">{activity.icon}</span>
                        <span className="hc-badge">{isPitch ? "+?" : "+" + (isBig ? big.points : activity.points)}</span>
                      </div>
                      <div className="hc-action-title">{activity.label}</div>
                      <p className="hc-action-desc">{isPitch ? "Chief review · add note below" : isBig ? big.label : activity.description}</p>
                    </button>
                  );
                })}
              </div>

              <details className="hc-mobile-details">
                <summary>Add details / people / photo proof</summary>

                <div className="hc-grid hc-grid-4">
                  <div>
                    <FieldLabel>Big Tucson challenge</FieldLabel>
                    <SelectInput value={bigChallengeLabel} onChange={function updateBigChallenge(event) { setBigChallengeLabel(event.target.value); }}>
                      {BIG_CHALLENGE_OPTIONS.map(function renderBig(opt) { return <option key={opt.label} value={opt.label}>{opt.label} (+{opt.points})</option>; })}
                    </SelectInput>
                  </div>

                  <div>
                    <FieldLabel>Pitch amount</FieldLabel>
                    <TextInput type="number" min="0" value={pointPitchAmount} onChange={function updatePointPitchAmount(event) { setPointPitchAmount(event.target.value); }} placeholder="?" />
                  </div>

                  <div>
                    <FieldLabel>People with you</FieldLabel>
                    <TextInput value={people} onChange={function updatePeople(event) { setPeople(event.target.value); }} placeholder="Optional" />
                  </div>

                  <div>
                    <FieldLabel>Photo evidence</FieldLabel>
                    <label className="hc-photo-upload">
                      📸 Add photo proof
                      <input type="file" accept="image/*" capture="environment" onChange={handlePhotoChange} />
                    </label>
                    {photoName && <div className="hc-muted">Selected: {photoName}</div>}
                    {photoPreview && <img className="hc-photo-preview" src={photoPreview} alt="Evidence preview" />}
                  </div>
                </div>

                <div style={{ marginTop: 12 }}>
                  <FieldLabel>Note / Google Drive link</FieldLabel>
                  <textarea
                    className="hc-input"
                    value={note}
                    onChange={function updateNote(event) { setNote(event.target.value); }}
                    placeholder="Optional unless you are pitching points. Caption, folder link, or chaos explanation."
                    rows={3}
                  />
                </div>

                <div className="hc-muted" style={{ marginTop: 8 }}>
                  Photo evidence uploads to Google Drive when submitted.
                </div>
              </details>

              {!canSubmit && <div className="hc-alert">Enter your name and house, then pick a point category.</div>}
              {submitStatus && <div className="hc-alert">{submitStatus}</div>}
              {lastSaved && (
                <div className="hc-success">
                  Saved: {lastSaved.activity} · {lastSaved.name} · {lastSaved.house} · +{lastSaved.points} pts {lastSaved.photoName ? "· photo selected" : ""}
                </div>
              )}

              <div className="hc-mobile-submit-spacer" />
              <div className="hc-mobile-submit-bar">
                <div>
                  <b>{selectedPointSummary} pts</b>
                  <small>{selectedActivity ? selectedActivity.label : "Choose category"}</small>
                </div>
                <button
                  type="button"
                  className="hc-button hc-submit-now"
                  onClick={submitSelectedActivity}
                  disabled={!canSubmit || !selectedActivity}
                >
                  {submitButtonText}
                </button>
              </div>
            </div>
          </section>
        )}

        {activeTab === "chiefLogin" && (
          <section className="hc-card hc-login">
            <h2>🔐 Chief back-end</h2>
            <p className="hc-muted">Separate from the front-facing resident page. Chief uploads are tagged by uploader. Front-end login is light gatekeeping only — replace with real authentication before launch.</p>
            <div style={{ marginTop: 12 }}>
              <FieldLabel>Name</FieldLabel>
              <TextInput value={chiefName} onChange={function updateChiefName(event) { setChiefName(event.target.value); }} placeholder="Nate" />
            </div>
            <div style={{ marginTop: 12 }}>
              <FieldLabel>Password</FieldLabel>
              <TextInput type="password" value={chiefPassword} onChange={function updateChiefPassword(event) { setChiefPassword(event.target.value); }} placeholder="wootwoot1!" />
            </div>
            <div className="hc-row" style={{ marginTop: 14 }}>
              <button type="button" className="hc-button" onClick={loginChief}>Enter chief mode</button>
              {chiefMessage && <span className="hc-muted">{chiefMessage}</span>}
            </div>
          </section>
        )}

        {activeTab === "chief" && chiefAuthed && (
          <section className="hc-card">
            <div className="hc-row" style={{ justifyContent: "space-between" }}>
              <div>
                <h2>Chief back-end</h2>
                <p className="hc-muted">Logged in as <b>{currentChief}</b>. AHD/conference upload = 1 point/hour by default. Kahoot/trivia/custom bonuses are manually awarded here and tagged to your name.</p>
              </div>
              <button type="button" className="hc-button secondary" onClick={function logout() { setChiefAuthed(false); setCurrentChief(""); setActiveTab("chiefLogin"); }}>Log out</button>
            </div>

            <div className="hc-card" style={{ boxShadow: "none" }}>
              <h3>Google Docs / Drive settings</h3>
              <p className="hc-muted">Admin/contact: <b>{ADMIN_EMAIL}</b>. Evidence folder: <a href={GOOGLE_EVIDENCE_FOLDER_URL} target="_blank" rel="noreferrer">open Google Drive folder</a>. Apps Script upload endpoint is connected.</p>
              <TextInput value={googleFolderLink} onChange={function updateFolder(event) { setGoogleFolderLink(event.target.value); }} placeholder="Google Drive folder / Google Sheet link" />
            </div>

            <div className="hc-grid hc-grid-4" style={{ marginTop: 18 }}>
              <div>
                <FieldLabel>AHD event title</FieldLabel>
                <TextInput value={attendanceTitle} onChange={function updateAttendanceTitle(event) { setAttendanceTitle(event.target.value); }} />
              </div>
              <div>
                <FieldLabel>Date</FieldLabel>
                <TextInput type="date" value={attendanceDate} onChange={function updateAttendanceDate(event) { setAttendanceDate(event.target.value); }} />
              </div>
              <div>
                <FieldLabel>Points/hour</FieldLabel>
                <TextInput type="number" min="1" value={attendancePoints} onChange={function updateAttendancePoints(event) { setAttendancePoints(event.target.value); }} />
              </div>
              <div style={{ alignSelf: "end" }}>
                <button type="button" className="hc-button" onClick={importAttendance}>Upload AHD</button>
              </div>
            </div>
            <div style={{ marginTop: 12 }}>
              <FieldLabel>AHD/conference attendees</FieldLabel>
              <textarea className="hc-input" style={{ minHeight: 120 }} value={attendanceText} onChange={function updateAttendanceText(event) { setAttendanceText(event.target.value); }} placeholder={"Paste names here:\nNate Walton\nResident Example\nFaculty Example"} />
            </div>
            {uploadMessage && <div className="hc-success">{uploadMessage}</div>}
            {unknownUploads.length > 0 && <div className="hc-alert">{unknownUploads.length} uploaded attendee(s) did not match roster.</div>}

            <hr style={{ margin: "24px 0", border: "none", borderTop: "3px dashed #111827" }} />

            <h3>Kahoot / trivia / bonus points</h3>
            <div className="hc-grid hc-grid-5">
              <div>
                <FieldLabel>House</FieldLabel>
                <SelectInput value={bonusHouse} onChange={function updateBonusHouse(event) { setBonusHouse(event.target.value); }}>
                  <option value="">Choose house</option>
                  {HOUSES.map(function renderBonusHouse(houseName) { return <option key={houseName} value={houseName}>{houseName}</option>; })}
                </SelectInput>
              </div>
              <div>
                <FieldLabel>Bonus title</FieldLabel>
                <TextInput value={bonusTitle} onChange={function updateBonusTitle(event) { setBonusTitle(event.target.value); }} />
              </div>
              <div>
                <FieldLabel>Date</FieldLabel>
                <TextInput type="date" value={bonusDate} onChange={function updateBonusDate(event) { setBonusDate(event.target.value); }} />
              </div>
              <div>
                <FieldLabel>Points</FieldLabel>
                <TextInput type="number" min="0" value={bonusPoints} onChange={function updateBonusPoints(event) { setBonusPoints(event.target.value); }} />
              </div>
              <div style={{ alignSelf: "end" }}>
                <button type="button" className="hc-button" onClick={addChiefBonus}>Add bonus</button>
              </div>
            </div>
            <div style={{ marginTop: 12 }}>
              <FieldLabel>Bonus note</FieldLabel>
              <TextInput value={bonusNote} onChange={function updateBonusNote(event) { setBonusNote(event.target.value); }} placeholder="Winner, runner-up, chaos award, etc." />
            </div>
            {bonusMessage && <div className="hc-success">{bonusMessage}</div>}
          </section>
        )}

        {activeTab === "leaderboard" && (
          <section className="hc-grid hc-grid-5" style={{ marginTop: 18 }}>
            {totals.map(function renderTotal(total, index) {
              return (
                <div key={total.house} className="hc-leader">
                  <div className="hc-rank">#{index + 1}</div>
                  <div className="hc-house">{total.house}</div>
                  <div className="hc-score">{total.points}</div>
                  <div className="hc-muted">points</div>
                </div>
              );
            })}
          </section>
        )}

        {activeTab === "data" && (
          <section className="hc-card">
            <div className="hc-row">
              <button type="button" onClick={function exportCsv() { downloadCSV(rows); }} disabled={!rows.length} className="hc-button">⬇️ Download CSV</button>
              <button type="button" onClick={clearRows} disabled={!rows.length} className="hc-button danger">🗑️ Clear local data</button>
            </div>
            <div className="hc-table-wrap" style={{ marginTop: 14 }}>
              <table className="hc-table">
                <thead>
                  <tr><th>When</th><th>Date</th><th>Name</th><th>House</th><th>Activity</th><th>Pts</th><th>Photo</th><th>Source</th></tr>
                </thead>
                <tbody>
                  {rows.map(function renderRow(row, index) {
                    return (
                      <tr key={row.timestamp + "-" + index}>
                        <td>{new Date(row.timestamp).toLocaleString()}</td><td>{row.date}</td><td>{row.name}</td><td>{row.house}</td><td>{row.activity}</td><td><b>{row.points}</b></td><td>{row.photoName || row.photoStatus}</td><td>{row.source}</td>
                      </tr>
                    );
                  })}
                  {!rows.length && <tr><td colSpan="8" style={{ textAlign: "center", color: "#64748b" }}>No points logged yet.</td></tr>}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeTab === "log" && (
          <section className="hc-footer">
            <b>Scoring:</b> AHD/conference = 1 point/hour via chief upload · Academic flex = 2 · Group activity = 2 · Group exercise = 2+ · Wellness challenge = 3+ · Big Tucson challenge = 5+ · “Tell me why I should give you points?” = resident pitch/chief review · Kahoot/trivia/custom = chief back-end only. Google Drive/Sheet upload is powered by Apps Script v1.
          </section>
        )}
      </div>
    </div>
  );
}
