import React, { useMemo, useState } from "react";

const ADMIN_EMAIL = "nathantwalton@gmail.com";
const GOOGLE_EVIDENCE_FOLDER_URL = "https://drive.google.com/drive/folders/15zhX3e1Hf4ExWgkwJK6gjevOggPO8MG8?usp=drive_link";
const APPS_SCRIPT_WEB_APP_URL =
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_APPS_SCRIPT_WEB_APP_URL) ||
  "https://script.google.com/macros/s/AKfycbzM3DKjDm94gJnygSTFS1y4DVDriQ0b7mXBRpX5KEahjYz2vm8tlfCyhcZkgykC8TeM/exec";

const HOUSES = ["Catalina", "Rincon", "Santa Rita", "Tortolita", "Tucson"];

const CHIEF_USERS = [
  { name: "Nate", password: "wootwoot1!", house: "Catalina" },
  { name: "Rosie", password: "wootwoot1!", house: "Rincon" },
  { name: "Amrutha", password: "wootwoot1!", house: "Santa Rita" },
  { name: "Will", password: "wootwoot1!", house: "Tortolita" },
  { name: "Johnny", password: "wootwoot1!", house: "Tucson" },
];

const ROSTER = [
  { name: "Nate Walton", house: "Catalina" },
  { name: "Resident Example", house: "Rincon" },
  { name: "Faculty Example", house: "Tucson" },
];

const RESIDENT_ACTIVITIES = [
  { id: "group_activity", label: "Group activity", points: 2, icon: "🤝", color: "#d7ffd8", description: "Dinner, trivia, coffee, game night, house hang. 3+ people." },
  { id: "group_exercise", label: "Group exercise", points: 2, icon: "🏃", color: "#ffe0bd", description: "Hike, bike, climb, gym, yoga, pickleball, walk. 3+ people." },
  { id: "academic", label: "Academic flex", points: 3, icon: "🧠", color: "#efe1ff", description: "Journal club, teaching, abstract, presentation, QI/research work. 3+ pts." },
  { id: "wellness_community", label: "Wellness + community +3", points: 3, icon: "🌵", color: "#c8fff3", description: "Wellness, service, Shubitz, blood donation, helping a friend. +3 pts." },
  { id: "big_challenge", label: "Big Tucson challenges", points: 5, icon: "🏔️", color: "#fff2aa", description: "Use Quest picker for featured quest or Tucson challenge. 5+ pts." },
  { id: "point_pitch", label: "Tell me why I should give you points?", points: 0, icon: "🤔", color: "#ffd6ef", description: "Pitch your case. Tell us how many points and why." },
];

const FEATURED_QUEST_IDEAS = [
  "Find the most judgmental saguaro",
  "Sunrise before signout",
  "Best Tucson mural walk",
  "Post-call burrito larger than your soul",
  "Touch grass with three people from your house",
  "Sabino sunrise crew",
  "Sonoran hot dog + decompression walk",
  "A Mountain sunset photo",
  "Mission San Xavier reflective visit",
  "No-phone nature hour",
  "Bring joy to the team snack drop",
  "Write three gratitude notes",
  "Check in on five colleagues you do not know well",
  "Hydration hero shift",
  "Find the weirdest cactus in Tucson",
  "Farmers market produce quest",
  "Coffee walk with someone outside your usual crew",
  "Trail cleanup / leave-it-better mini mission",
  "House picnic or potluck",
  "Desert Museum or botanical garden reset",
  "Meet your interns for coffee, snacks, or a hospital walk",
  "Ask an intern what would make this month easier, then do one small thing",
  "Text someone post-call that you appreciate them",
  "Bring a ridiculous but useful snack to the workroom",
  "Make a team playlist for prerounds / charting / survival",
  "Take a walk with someone who looks like they need a reset",
  "Send one thank-you message to a nurse, MA, pharmacist, RT, or clinic staff member",
  "Make the call room slightly less cursed",
  "Teach one thing you wish someone had taught you earlier",
  "Trade one useful life hack with another house",
  "Organize a five-minute stretch break during a long day",
  "Do a kindness drive-by: coffee, snack, note, or errand for someone slammed",
  "Find a beautiful Tucson sky and document it for morale",
  "Have a real conversation with no work talk for ten minutes",
  "Leave a positive review for a colleague in real life, not New Innovations",
  "Make a mini survival guide for new interns",
  "Do one thing that makes clinic or wards feel less chaotic for the next person",
  "Share a favorite Tucson spot with someone new",
  "Take a house photo that looks like an album cover",
  "Create a house motto, chant, handshake, or absolutely unnecessary ritual",
  "Host a tiny workroom celebration for no good reason",
  "Walk outside and identify one plant you definitely cannot medically manage",
  "Do a two-person errand walk instead of doom-scrolling",
  "Send a meme that improves team morale without violating professionalism",
  "Give someone permission to go home, eat, hydrate, or sleep",
  "Find the best hospital-window sunset view",
  "Do one tiny act of service for a patient-facing team member",
  "Share one good thing from the week in your house chat",
  "Make an intern laugh during a hard shift",
  "Take a group photo proving your house exists outside the EMR",
  "Do something wholesome enough that it feels suspicious",
];

const QUEST_OPTIONS = [
  { label: "Featured Quest", points: 5, category: "Big Tucson Challenge", questType: "featured_quest", lane: "selected" },
  { label: "Monthly Wellness Challenge", points: 5, category: "Monthly Wellness", questType: "monthly_wellness", lane: "selected" },
  { label: "Tucson mountain summit", points: 6, category: "Big Tucson Challenge", questType: "summit", lane: "selected" },
  { label: "The Loop ride/walk epic", points: 5, category: "Big Tucson Challenge", questType: "big_tucson", lane: "selected" },
  { label: "Sabino sunrise crew", points: 5, category: "Big Tucson Challenge", questType: "big_tucson", lane: "selected" },
  { label: "Sonoran hot dog + group walk", points: 5, category: "Big Tucson Challenge", questType: "big_tucson", lane: "selected" },
  { label: "Best Tucson mural walk", points: 5, category: "Big Tucson Challenge", questType: "big_tucson", lane: "selected" },
  { label: "Post-call burrito (or equivalent morale meal)", points: 5, category: "Big Tucson Challenge", questType: "big_tucson", lane: "selected" },
  { label: "Sunrise before signout", points: 5, category: "Big Tucson Challenge", questType: "big_tucson", lane: "selected" },
  { label: "Other Big Tucson challenge", points: 5, category: "Big Tucson Challenge", questType: "big_tucson_other", lane: "selected" },
];

const MONTHLY_WELLNESS_QUESTS = [
  { month: "July", theme: "Kickoff", quest: "House mottos + meet your interns", vibe: "Identity & Belonging", proof: "House motto/logo photo + photo of something fun with interns, inside or outside the hospital" },
  { month: "August", theme: "Beat the Heat", quest: "Step Wars — cumulative house steps", vibe: "Movement & Heat Survival", proof: "Step screenshot / wearable screenshot" },
  { month: "September", theme: "Teaching Season", quest: "Teach Me Something — share one pearl, chalk talk, article, or mini teaching moment", vibe: "Learning Culture", proof: "Photo/screenshot of teaching, article, whiteboard, or post" },
  { month: "October", theme: "Haunted Tucson", quest: "Visit a haunted or historic Tucson spot", vibe: "Fun & Adventure", proof: "Photo at the spot" },
  { month: "November", theme: "Giving Back", quest: "Gratitude + service: post one gratitude note and complete one service/community action", vibe: "Giving Back", proof: "Gratitude screenshot + service/donation/volunteering photo or receipt" },
  { month: "December", theme: "Community", quest: "Holiday Giving Drive", vibe: "Community", proof: "Donation/photo/receipt" },
  { month: "January", theme: "Fresh Start", quest: "New wellness activities tried", vibe: "Fresh Start", proof: "Photo/checklist/calendar screenshot" },
  { month: "February", theme: "Social Wellness", quest: "Check in on 5 colleagues", vibe: "Social Wellness", proof: "Group photo / message screenshot / note" },
  { month: "March", theme: "Adventure", quest: "Peak Bagging Month", vibe: "Adventure", proof: "Summit photos / route screenshots" },
  { month: "April", theme: "Active Transport", quest: "Bike Month — house miles", vibe: "Active Transport", proof: "Mileage screenshot / bike photo" },
  { month: "May", theme: "Mental Health", quest: "Mental health activity of choice", vibe: "Mental Health", proof: "Photo, calendar/checklist, streak screenshot, reflection note, or other non-private proof" },
  { month: "June", theme: "Resilience", quest: "Sunrise workouts + early hikes", vibe: "Resilience", proof: "Sunrise photo / workout screenshot" },
];

function getRandomFeaturedQuestIdea() {
  return FEATURED_QUEST_IDEAS[Math.floor(Math.random() * FEATURED_QUEST_IDEAS.length)] || FEATURED_QUEST_IDEAS[0];
}

function getCurrentMonthlyWellnessQuest(monthOverride) {
  const monthName = monthOverride || new Date().toLocaleString("en-US", { month: "long" });
  for (let i = 0; i < MONTHLY_WELLNESS_QUESTS.length; i += 1) {
    if (MONTHLY_WELLNESS_QUESTS[i].month === monthName) return MONTHLY_WELLNESS_QUESTS[i];
  }
  return MONTHLY_WELLNESS_QUESTS[0];
}

function csvEscape(value) {
  const text = String(value === null || value === undefined ? "" : value);
  if (text.indexOf(",") !== -1 || text.indexOf("\n") !== -1 || text.indexOf('"') !== -1) return '"' + text.replace(/"/g, '""') + '"';
  return text;
}

function normalizeName(value) {
  return String(value === null || value === undefined ? "" : value).trim().toLowerCase().replace(/\s+/g, " ");
}

function findRosterPerson(name) {
  const normalized = normalizeName(name);
  if (!normalized) return null;
  for (let i = 0; i < ROSTER.length; i += 1) {
    if (ROSTER[i] && normalizeName(ROSTER[i].name) === normalized) return ROSTER[i];
  }
  return null;
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

function splitAttendanceNames(text) {
  return String(text === null || text === undefined ? "" : text).split(/\r?\n|,/).map(function cleanName(name) { return name.trim(); }).filter(Boolean);
}

function calculateHouseTotals(rows) {
  const base = {};
  HOUSES.forEach(function initHouse(house) { base[house] = 0; });
  (Array.isArray(rows) ? rows : []).forEach(function addRow(row) {
    if (!row || !row.house || row.house === "Unknown") return;
    if (row.status === "denied" || row.status === "pending_review") return;
    base[row.house] = (base[row.house] || 0) + Number(row.points || 0);
  });
  return HOUSES.map(function makeTotal(house) { return { house: house, points: base[house] || 0 }; }).sort(function sortTotals(a, b) { return b.points - a.points || a.house.localeCompare(b.house); });
}

function attendanceTextToRows(options) {
  const opts = options || {};
  const uploadedBy = opts.uploadedBy || "Unknown chief";
  return splitAttendanceNames(opts.text || "").map(function makeAttendanceRow(name) {
    const person = findRosterPerson(name);
    return {
      timestamp: new Date().toISOString(),
      date: opts.eventDate || todayString(),
      name: name,
      house: person && person.house ? person.house : "Unknown",
      activity: opts.eventTitle || "AHD / conference attendance",
      points: Number(opts.points || 1) || 1,
      people: "",
      note: person ? "Uploaded attendance" : "Uploaded attendance - house not found in roster",
      photoName: "",
      photoStatus: "not_required",
      source: "chief_ahd_upload",
      uploadedBy: uploadedBy,
      status: "approved",
      reviewedBy: uploadedBy,
      reviewedAt: new Date().toISOString(),
      reviewNote: "",
    };
  });
}

function chiefBonusToRow(options) {
  const opts = options || {};
  const uploadedBy = opts.uploadedBy || "Unknown chief";
  return {
    timestamp: new Date().toISOString(),
    date: opts.eventDate || todayString(),
    name: (opts.house || "Unknown") + " house",
    house: opts.house || "Unknown",
    activity: opts.eventTitle || "Kahoot / trivia bonus",
    points: Number(opts.points || 0) || 0,
    people: "",
    note: opts.note || "Chief-scored bonus points",
    photoName: "",
    photoStatus: "not_required",
    source: "chief_bonus",
    uploadedBy: uploadedBy,
    status: "approved",
    reviewedBy: uploadedBy,
    reviewedAt: new Date().toISOString(),
    reviewNote: "",
  };
}

function getChiefHouse(chiefName) {
  const normalized = normalizeName(chiefName);
  for (let i = 0; i < CHIEF_USERS.length; i += 1) {
    if (normalizeName(CHIEF_USERS[i].name) === normalized) return CHIEF_USERS[i].house || "Unknown";
  }
  return "Unknown";
}

function canChiefApprovePitch(chiefName, submission) {
  if (!submission) return false;
  const chiefHouse = getChiefHouse(chiefName);
  return chiefHouse && chiefHouse !== "Unknown" && submission.house !== "Unknown" && chiefHouse !== submission.house;
}

function getPendingPointPitches(rows) {
  return (Array.isArray(rows) ? rows : []).filter(function pendingPitch(row) { return row && row.source === "resident_point_pitch" && row.status === "pending_review"; });
}

function reviewPointPitchRows(rows, submissionKey, decision, approvedPoints, chiefName, reviewNote) {
  return rows.map(function reviewRow(row, index) {
    const key = row.submissionId || row.timestamp + "-" + index;
    if (key !== submissionKey || !canChiefApprovePitch(chiefName, row)) return row;
    return Object.assign({}, row, {
      points: decision === "approve" ? Number(approvedPoints || row.points || 0) : 0,
      status: decision === "approve" ? "approved" : "denied",
      reviewedBy: chiefName,
      reviewedAt: new Date().toISOString(),
      reviewNote: reviewNote || (decision === "approve" ? "Approved by chief from different house" : "Denied by chief from different house"),
    });
  });
}

function getLeaderboardRankLabel(index) {
  if (index === 0) return "🥇 Current House Champions";
  if (index === 1) return "🥈 Respectable Menace";
  if (index === 2) return "🥉 Strong Showing";
  if (index === 3) return "🙂 Still in the Mix";
  return "💪 Comeback Season";
}

function getLeaderboardTrashTalk(index) {
  if (index === 0) return "Please use power responsibly.";
  if (index === 1) return "Dangerously close to glory.";
  if (index === 2) return "Podium adjacent. Hydrate.";
  if (index === 3) return "Still mathematically alive.";
  return "One good week changes everything.";
}

function getAchievementBadges(rows) {
  const safeRows = Array.isArray(rows) ? rows : [];
  const badges = [];
  if (safeRows.length > 0) badges.push({ label: "First blood", detail: "First logged points are on the board." });
  if (safeRows.some(function hasGrass(row) { return /grass|nature|walk|outside|sunrise|sunset|sabino|tumamoc|mountain|summit|loop/i.test(row.activity + " " + row.note); })) badges.push({ label: "Grass toucher", detail: "Someone successfully went outside." });
  if (safeRows.some(function hasConference(row) { return /AHD|conference/i.test(row.activity); })) badges.push({ label: "Conference attendee", detail: "Showing up counts." });
  if (safeRows.some(function hasGroup(row) { return /group activity|house hang|dinner|trivia|coffee/i.test(row.activity + " " + row.note); })) badges.push({ label: "Group activity menace", detail: "Social wellness has entered the chat." });
  if (safeRows.some(function hasSummit(row) { return /summit|peak|lemmon|wrightson|mica|wasson|mountain/i.test(row.activity + " " + row.note); })) badges.push({ label: "Summit sicko", detail: "Altitude-based personality development." });
  if (safeRows.some(function hasWellness(row) { return /wellness|meditation|sleep|gratitude|mental|reset|yoga|community|shubitz|blood|platelet|friend|service/i.test(row.activity + " " + row.note); })) badges.push({ label: "Wellness? In this economy?", detail: "A brave and controversial choice." });
  if (safeRows.some(function hasApproved(row) { return row.source === "resident_point_pitch" && row.status === "approved"; })) badges.push({ label: "Chief-approved nonsense", detail: "Questionable, but sanctioned." });
  return badges;
}

function getRecentSubmissions(rows) {
  return (Array.isArray(rows) ? rows : []).slice(0, 6).map(function makeFeedItem(row) {
    const pending = row.status === "pending_review";
    const emoji = pending ? "🤔" : row.source === "chief_bonus" ? "🏆" : /sonoran|taco|burrito/i.test(row.activity + " " + row.note) ? "🌭" : /summit|mountain|peak|lemmon|wrightson|mica|wasson/i.test(row.activity + " " + row.note) ? "🏔️" : /community|shubitz|blood|platelet|friend|service/i.test(row.activity + " " + row.note) ? "❤️" : "✨";
    return { text: row.name + " submitted “" + row.activity + "” for " + row.house + ". +" + row.points + (pending ? " — pending review." : "."), emoji: emoji };
  });
}

function fileToBase64(file) {
  return new Promise(function convertFile(resolve, reject) {
    if (!file) { resolve(""); return; }
    const reader = new FileReader();
    reader.onload = function onLoad() { const result = String(reader.result || ""); const commaIndex = result.indexOf(","); resolve(commaIndex >= 0 ? result.slice(commaIndex + 1) : result); };
    reader.onerror = function onError() { reject(reader.error || new Error("Could not read file")); };
    reader.readAsDataURL(file);
  });
}

async function submitToAppsScript(row, photoFile) {
  if (!APPS_SCRIPT_WEB_APP_URL) return { ok: false, skipped: true };
  const payload = Object.assign({}, row);
  if (photoFile) {
    payload.photoBase64 = await fileToBase64(photoFile);
    payload.photoName = photoFile.name || row.photoName || "house-cup-photo.jpg";
    payload.photoMimeType = photoFile.type || "image/jpeg";
  }
  await fetch(APPS_SCRIPT_WEB_APP_URL, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(payload) });
  return { ok: true };
}

async function submitRowsToAppsScript(rows) {
  const safeRows = Array.isArray(rows) ? rows : [];
  for (let i = 0; i < safeRows.length; i += 1) await submitToAppsScript(safeRows[i], null);
  return { ok: true, count: safeRows.length };
}

function downloadCSV(rows) {
  const headers = ["timestamp", "date", "name", "house", "activity", "points", "category", "questType", "people", "note", "photoName", "photoStatus", "source", "uploadedBy", "status", "reviewedBy", "reviewedAt", "reviewNote", "submissionId"];
  const lines = [headers.join(",")];
  (Array.isArray(rows) ? rows : []).forEach(function makeRow(row) { lines.push(headers.map(function cell(header) { return csvEscape(row ? row[header] : ""); }).join(",")); });
  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "house-cup-points.csv";
  link.click();
  URL.revokeObjectURL(url);
}

function runSelfTests() {
  console.assert(Array.isArray(QUEST_OPTIONS) && QUEST_OPTIONS.length >= 3, "Quest options should load as an array");
  console.assert(QUEST_OPTIONS.some(function hasBurrito(option) { return option.label === "Post-call burrito (or equivalent morale meal)"; }), "Burrito morale meal option should exist");
  console.assert(QUEST_OPTIONS.some(function hasSunrise(option) { return option.label === "Sunrise before signout"; }), "Sunrise option should exist after burrito option");
  console.assert(!QUEST_OPTIONS.some(function noMission(option) { return /San Xavier/i.test(option.label); }), "San Xavier should not be in the quest dropdown");
  console.assert(!QUEST_OPTIONS.some(function noAMountain(option) { return option.label === "A Mountain summit"; }), "A Mountain summit should not be in the quest dropdown");
  console.assert(splitAttendanceNames("A, B\nC").length === 3, "Attendance splitting should handle comma and newline input");
  console.assert(findRosterPerson("Nate Walton") && findRosterPerson("Nate Walton").house === "Catalina", "Known roster person should resolve to house");
  console.assert(findRosterPerson("Definitely Not Real") === null, "Unknown roster person should return null");
  console.assert(authenticateChief("Nate", "wootwoot1!") && authenticateChief("Nate", "wootwoot1!").house === "Catalina", "Chief login should authenticate known chief");
  console.assert(authenticateChief("Nate", "wrong") === null, "Chief login should reject wrong password");
  console.assert(canChiefApprovePitch("Rosie", { house: "Catalina" }) === true, "Different-house chief should be able to approve pitch");
  console.assert(canChiefApprovePitch("Nate", { house: "Catalina" }) === false, "Same-house chief should not approve pitch");
}
runSelfTests();

function FieldLabel(props) { return <label className="hc-label">{props.children}</label>; }
function TextInput(props) { return <input {...props} className={(props.className || "") + " hc-input"} />; }
function SelectInput(props) { return <select value={props.value} onChange={props.onChange} className="hc-input">{props.children}</select>; }
function TabButton(props) { return <button type="button" onClick={props.onClick} className={"hc-tab " + (props.active ? "active" : "")}>{props.children}</button>; }

function HouseCupStyles() {
  return (
    <style>{`
      .hc-page { min-height: 100vh; cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Cpath fill='%230a7a3d' stroke='%23000000' stroke-width='2' d='M15 29V9a4 4 0 0 1 8 0v5h3a3 3 0 0 1 3 3v4h-5v-4h-1v12h-8zM15 16h-3v-4H9v7h6v5H8a4 4 0 0 1-4-4v-8a4 4 0 0 1 8 0v1h3z'/%3E%3C/svg%3E") 2 2, auto; padding: 14px; color: #24130d; background-color: #fff7b8; background-image: radial-gradient(circle at 12px 12px, rgba(0,128,96,.28) 0 3px, transparent 4px), radial-gradient(circle at 34px 34px, rgba(0,128,96,.22) 0 2px, transparent 3px), linear-gradient(135deg, rgba(255,255,255,.62), rgba(255,214,231,.52), rgba(217,247,255,.58)); background-size: 46px 46px, 46px 46px, auto; font-family: Verdana, Geneva, Tahoma, sans-serif; }
      .hc-shell { max-width: 1120px; margin: 0 auto; }
      .hc-hero { border: 4px solid #000; padding: 16px; background: linear-gradient(to bottom, #ffffff 0%, #fffef0 100%); box-shadow: 7px 7px 0 #000; text-align: center; }
      .hc-kicker { display: inline-block; padding: 7px 12px; border: 3px solid #000; background: #ffff66; color: #000; font-weight: 1000; text-transform: uppercase; box-shadow: 3px 3px 0 #000; }
      .hc-title { margin: 14px 0 8px; font-size: clamp(42px, 8vw, 86px); line-height: .9; font-weight: 1000; letter-spacing: -2px; text-transform: uppercase; color: #d4006a; text-shadow: 2px 2px 0 #fff, 4px 4px 0 #000; }
      .hc-marquee-wrap { margin-top: 14px; border: 3px solid #000; background: #000; overflow: hidden; }
      .hc-marquee { display: inline-block; white-space: nowrap; color: #00ff66; font-family: "Courier New", monospace; font-size: 14px; font-weight: 900; padding: 7px 0; animation: hc-scroll 18s linear infinite; }
      @keyframes hc-scroll { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
      .hc-counterbar { margin-top: 10px; display: flex; justify-content: center; gap: 10px; flex-wrap: wrap; }
      .hc-counter, .hc-underconstruction, .hc-webmaster { border: 2px solid #000; background: #fff; padding: 6px 10px; font-family: "Courier New", monospace; font-size: 12px; font-weight: 1000; box-shadow: 3px 3px 0 #000; }
      .hc-underconstruction { background: repeating-linear-gradient(45deg, #ffeb3b, #ffeb3b 10px, #000 10px, #000 20px); color: #fff; text-shadow: 1px 1px 0 #000; }
      .hc-webmaster { color: #0000ee; text-decoration: underline; cursor: pointer; }
      .hc-tabs { position: sticky; top: 0; z-index: 10; margin-top: 14px; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; padding: 6px 0; background: rgba(255,247,184,.88); backdrop-filter: blur(4px); }
      .hc-tab { border-top: 3px solid #fff; border-left: 3px solid #fff; border-right: 3px solid #000; border-bottom: 3px solid #000; padding: 10px 8px; background: linear-gradient(to bottom, #fefefe, #d9d9d9); color: #111827; font-weight: 1000; cursor: pointer; text-transform: uppercase; }
      .hc-tab.active { background: linear-gradient(to bottom, #ff8ad8, #ff4db3); color: #fff; text-shadow: 1px 1px 0 #000; }
      .hc-card, .hc-footer { margin-top: 16px; border: 4px solid #000; padding: 14px; background: rgba(255,255,255,.95); box-shadow: 5px 5px 0 #000; }
      .hc-footer { border-style: dotted; font-size: 13px; color: #334155; font-weight: 700; }
      .hc-grid { display: grid; gap: 12px; }
      .hc-grid-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
      .hc-grid-5 { grid-template-columns: repeat(5, minmax(0, 1fr)); }
      .hc-label { display: block; margin-bottom: 6px; font-size: 12px; font-weight: 1000; color: #000080; text-transform: uppercase; }
      .hc-input { width: 100%; box-sizing: border-box; border-top: 3px solid #777; border-left: 3px solid #777; border-right: 3px solid #fff; border-bottom: 3px solid #fff; padding: 10px 12px; background: #fff; color: #111827; font: inherit; outline: none; }
      .hc-input:focus { background: #fffde7; }
      .hc-muted { color: #5b6470; font-size: 12px; font-weight: 700; }
      .hc-alert { margin-top: 14px; padding: 12px; border: 3px dashed #0033cc; background: #dbeafe; color: #002b7f; font-weight: 900; }
      .hc-success { margin-top: 14px; border: 3px solid #14532d; padding: 12px; background: #dcfce7; color: #14532d; font-weight: 900; }
      .hc-actions { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; margin-top: 16px; }
      .hc-action { min-height: 154px; border: 4px solid #000; padding: 16px; text-align: left; cursor: pointer; box-shadow: 6px 6px 0 #000; transition: transform .06s ease, box-shadow .06s ease; position: relative; overflow: hidden; }
      .hc-action:hover { transform: translate(2px, 2px); box-shadow: 4px 4px 0 #000; }
      .hc-action:disabled { opacity: .5; cursor: not-allowed; }
      .hc-action-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; }
      .hc-icon { font-size: 38px; line-height: 1; }
      .hc-badge { display: inline-block; padding: 5px 10px; border: 2px solid #000; background: #000; color: #00ff66; font-family: "Courier New", monospace; font-weight: 1000; }
      .hc-action-title { margin-top: 14px; font-size: 22px; font-weight: 1000; text-transform: uppercase; color: #111; }
      .hc-action-desc { margin-top: 6px; font-size: 13px; color: #334155; font-weight: 700; }
      .hc-split-button { border: 3px solid #000; padding: 12px; background: #fff; font-weight: 1000; text-align: left; cursor: pointer; box-shadow: 3px 3px 0 #000; }
      .hc-split-button.active { background: #ff8ad8; color: #fff; text-shadow: 1px 1px 0 #000; transform: translate(1px, 1px); box-shadow: 2px 2px 0 #000; }
      .hc-quest-card { margin-top: 12px; border: 3px dashed #000; padding: 12px; background: #fff7b8; font-weight: 900; }
      .hc-button { border-top: 3px solid #fff; border-left: 3px solid #fff; border-right: 3px solid #000; border-bottom: 3px solid #000; padding: 10px 14px; background: linear-gradient(to bottom, #fffbcc, #ffd54f); color: #000; font-weight: 1000; cursor: pointer; text-transform: uppercase; }
      .hc-button.secondary { background: linear-gradient(to bottom, #fff, #d9d9d9); color: #111827; }
      .hc-button.danger { background: linear-gradient(to bottom, #ffd6d6, #ff9b9b); color: #7f0000; }
      .hc-button:disabled { opacity: .45; cursor: not-allowed; }
      .hc-row { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }
      .hc-photo-preview { margin-top: 8px; max-height: 90px; border: 2px solid #000; object-fit: cover; }
      .hc-leader { border: 4px solid #000; padding: 18px; text-align: center; background: linear-gradient(to bottom, #fff, #f8fafc); box-shadow: 5px 5px 0 #000; }
      .hc-rank { color: #000080; font-weight: 1000; }
      .hc-house { margin-top: 6px; font-size: 22px; font-weight: 1000; text-transform: uppercase; }
      .hc-score { margin-top: 12px; font-size: 54px; font-weight: 1000; color: #c2185b; text-shadow: 2px 2px 0 #00000022; }
      .hc-trash { margin-top: 8px; color: #475569; font-size: 12px; font-weight: 900; }
      .hc-badge-wall, .hc-months { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; margin-top: 12px; }
      .hc-achievement, .hc-month, .hc-feed-item { border: 2px solid #000; background: #fff; padding: 10px; font-size: 12px; box-shadow: 2px 2px 0 #000; font-weight: 800; }
      .hc-achievement { border-width: 3px; background: #fef08a; font-weight: 1000; }
      .hc-achievement small { display: block; margin-top: 5px; color: #475569; font-weight: 800; }
      .hc-feed { margin-top: 12px; display: grid; gap: 8px; }
      .hc-table-wrap { max-height: 380px; overflow: auto; border: 3px solid #000; background: #fff; }
      .hc-table { width: 100%; border-collapse: collapse; font-size: 13px; }
      .hc-table th { position: sticky; top: 0; background: #ffeb3b; border-bottom: 2px solid #000; padding: 10px; text-align: left; text-transform: uppercase; }
      .hc-table td { border-top: 1px solid #cbd5e1; padding: 10px; }
      .hc-login { max-width: 440px; margin: 18px auto 0; }
      .hc-blink { animation: hc-blink 1s step-start infinite; }
      @keyframes hc-blink { 50% { opacity: 0; } }
      @media (max-width: 860px) { .hc-grid-4, .hc-grid-5, .hc-actions, .hc-tabs, .hc-badge-wall, .hc-months { grid-template-columns: 1fr 1fr; } }
      @media (max-width: 560px) {
        .hc-page { padding: 8px; cursor: auto; }
        .hc-hero { padding: 10px; box-shadow: 4px 4px 0 #000; }
        .hc-underconstruction, .hc-counter { display: none; }
        .hc-kicker { font-size: 11px; padding: 5px 8px; }
        .hc-title { font-size: 40px; letter-spacing: -1px; text-shadow: 1px 1px 0 #fff, 3px 3px 0 #000; }
        .hc-marquee { font-size: 12px; }
        .hc-tabs { grid-template-columns: 1fr 1fr; gap: 6px; }
        .hc-tab { font-size: 11px; padding: 10px 5px; }
        .hc-grid-4, .hc-grid-5, .hc-actions, .hc-badge-wall, .hc-months { grid-template-columns: 1fr; }
        .hc-card, .hc-footer { padding: 12px; box-shadow: 3px 3px 0 #000; }
        .hc-action { min-height: 132px; padding: 14px; box-shadow: 4px 4px 0 #000; }
        .hc-action-title { font-size: 19px; }
        .hc-score { font-size: 44px; }
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
  const [questLabel, setQuestLabel] = useState(QUEST_OPTIONS[0].label);
  const [currentFeaturedQuest, setCurrentFeaturedQuest] = useState(FEATURED_QUEST_IDEAS[0]);
  const [currentFeaturedNote, setCurrentFeaturedNote] = useState("Photo evidence encouraged. Keep it easy, funny, and wholesome.");
  const [currentMonthlyWellnessMonth, setCurrentMonthlyWellnessMonth] = useState(getCurrentMonthlyWellnessQuest().month);
  const [featuredSuggestion, setFeaturedSuggestion] = useState(FEATURED_QUEST_IDEAS[0]);
  const [pointPitchAmount, setPointPitchAmount] = useState(1);
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
  const [approvalMessage, setApprovalMessage] = useState("");
  const [approvalPoints, setApprovalPoints] = useState(1);
  const [approvalNote, setApprovalNote] = useState("");

  const rosterMatch = findRosterPerson(name);
  const effectiveHouse = rosterMatch && rosterMatch.house ? rosterMatch.house : house;
  const canSubmit = Boolean(name.trim() && effectiveHouse);
  const totals = useMemo(function memoTotals() { return calculateHouseTotals(rows); }, [rows]);
  const unknownUploads = rows.filter(function findUnknownUpload(row) { return row && row.house === "Unknown"; });
  const pendingPointPitches = getPendingPointPitches(rows);
  const achievementBadges = getAchievementBadges(rows);
  const recentSubmissions = getRecentSubmissions(rows);

  function handlePhotoChange(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) { setPhotoName(""); setPhotoPreview(""); setPhotoFile(null); return; }
    setPhotoName(file.name);
    setPhotoPreview(URL.createObjectURL(file));
    setPhotoFile(file);
  }

  function getQuestSelection() {
    for (let i = 0; i < QUEST_OPTIONS.length; i += 1) {
      if (QUEST_OPTIONS[i].label === questLabel) {
        if (QUEST_OPTIONS[i].questType === "featured_quest") {
          return Object.assign({}, QUEST_OPTIONS[i], {
            label: "Featured Quest — " + currentFeaturedQuest,
            note: currentFeaturedNote,
          });
        }
        if (QUEST_OPTIONS[i].questType === "monthly_wellness") {
          const monthQuest = getCurrentMonthlyWellnessQuest(currentMonthlyWellnessMonth);
          return Object.assign({}, QUEST_OPTIONS[i], {
            label: monthQuest.month + " Monthly Wellness Challenge — " + monthQuest.quest,
            points: 5,
            monthlyTheme: monthQuest.theme,
            monthlyVibe: monthQuest.vibe,
            proof: monthQuest.proof,
          });
        }
        return QUEST_OPTIONS[i];
      }
    }
    return QUEST_OPTIONS[0];
  }

  async function logActivity(activity) {
    if (!canSubmit) return;
    let finalActivity = activity.label;
    let finalPoints = activity.points;
    let finalCategory = "General";
    let finalQuestType = activity.id;
    if (activity.id === "wellness_community" || activity.id === "big_challenge") {
      const selected = getQuestSelection();
      finalActivity = selected.label;
      finalPoints = selected.points;
      finalCategory = selected.category || "Quest";
      finalQuestType = selected.questType || "quest";
    }
    if (activity.id === "group_activity") {
      finalCategory = "Group Activity";
      finalQuestType = "group_activity";
    }
    if (activity.id === "group_exercise") {
      finalCategory = "Group Exercise";
      finalQuestType = "group_exercise";
    }
    if (activity.id === "academic") {
      finalCategory = "Academic";
      finalQuestType = "academic";
    }
    if (activity.id === "point_pitch") {
      finalActivity = "Point pitch - chief review requested";
      finalPoints = Number(pointPitchAmount) || 0;
      finalCategory = "Point Pitch";
      finalQuestType = "point_pitch";
      if (!note.trim()) { setSubmitStatus("For a point pitch, tell us why you deserve points in the note field first."); return; }
    }

    const row = {
      timestamp: new Date().toISOString(),
      date: todayString(),
      name: name.trim(),
      house: effectiveHouse,
      activity: finalActivity,
      points: finalPoints,
      people: people.trim(),
      note: finalQuestType === "point_pitch" || activity.id === "point_pitch" ? "Requested " + finalPoints + " point(s): " + note.trim() : note.trim(),
      photoName: photoName,
      photoStatus: photoName ? "selected_locally_not_uploaded" : "none",
      source: finalQuestType === "point_pitch" || activity.id === "point_pitch" ? "resident_point_pitch" : "resident_log",
      uploadedBy: "resident",
      status: finalQuestType === "point_pitch" || activity.id === "point_pitch" ? "pending_review" : "approved",
      category: finalQuestType === "point_pitch" || activity.id === "point_pitch" ? "Point Pitch" : finalCategory,
      questType: finalQuestType === "point_pitch" || activity.id === "point_pitch" ? "point_pitch" : finalQuestType,
      reviewedBy: "",
      reviewedAt: "",
      reviewNote: "",
      submissionId: String(Date.now()) + "-" + Math.random().toString(36).slice(2),
    };
    setRows(function addResidentRow(previousRows) { return [row].concat(previousRows); });
    setLastSaved(row);
    setNote("");
    setSubmitStatus("Uploading to Google Drive/Sheet...");
    try { await submitToAppsScript(row, photoFile); setSubmitStatus("Submitted to Google Sheet/Drive."); } catch (error) { setSubmitStatus("Saved locally, but Google upload failed. Try again or export CSV."); }
    setPhotoName(""); setPhotoPreview(""); setPhotoFile(null);
  }

  function loginChief() {
    const chiefUser = authenticateChief(chiefName, chiefPassword);
    if (chiefUser) { setChiefAuthed(true); setCurrentChief(chiefUser.name); setChiefMessage("Chief mode unlocked as " + chiefUser.name + "."); setActiveTab("chief"); }
    else { setChiefAuthed(false); setCurrentChief(""); setChiefMessage("Nope. Wrong name/password."); }
  }

  async function importAttendance() {
    const imported = attendanceTextToRows({ text: attendanceText, eventTitle: attendanceTitle, eventDate: attendanceDate, points: Number(attendancePoints) || 1, uploadedBy: currentChief || chiefName || "Unknown chief" });
    if (!imported.length) { setUploadMessage("Paste at least one attendee name."); return; }
    setRows(function addAttendanceRows(previousRows) { return imported.concat(previousRows); });
    setAttendanceText("");
    const unknownCount = imported.filter(function countUnknown(row) { return row.house === "Unknown"; }).length;
    setUploadMessage("Imported " + imported.length + " attendance entries" + (unknownCount ? " - " + unknownCount + " need roster/house cleanup" : "") + ".");
    try { await submitRowsToAppsScript(imported); setUploadMessage("Imported and submitted " + imported.length + " attendance entries" + (unknownCount ? " - " + unknownCount + " need roster/house cleanup" : "") + "."); } catch (error) { setUploadMessage("Imported locally, but Google upload failed. Export CSV as backup."); }
  }

  async function addChiefBonus() {
    if (!bonusHouse) { setBonusMessage("Choose a house first."); return; }
    const row = chiefBonusToRow({ house: bonusHouse, eventTitle: bonusTitle, eventDate: bonusDate, points: Number(bonusPoints) || 0, note: bonusNote, uploadedBy: currentChief || chiefName || "Unknown chief" });
    setRows(function addBonusRow(previousRows) { return [row].concat(previousRows); });
    setBonusNote("");
    setBonusMessage("Added " + row.points + " bonus point(s) to " + row.house + ".");
    try { await submitToAppsScript(row, null); setBonusMessage("Added and submitted " + row.points + " bonus point(s) to " + row.house + "."); } catch (error) { setBonusMessage("Added locally, but Google upload failed. Export CSV as backup."); }
  }

  function reviewPointPitch(submission, index, decision) {
    const submissionKey = submission.submissionId || submission.timestamp + "-" + index;
    if (!canChiefApprovePitch(currentChief, submission)) { setApprovalMessage("Conflict check: chiefs cannot approve/deny point pitches from their own house. Ask a chief from another house."); return; }
    setRows(function updateRows(previousRows) { return reviewPointPitchRows(previousRows, submissionKey, decision, Number(approvalPoints) || submission.points || 0, currentChief, approvalNote); });
    setApprovalMessage((decision === "approve" ? "Approved" : "Denied") + " point pitch for " + submission.name + ".");
    setApprovalNote("");
  }

  function clearRows() {
    setRows([]); setLastSaved(null); setUploadMessage(""); setBonusMessage(""); setApprovalMessage("");
  }

  return (
    <div className="hc-page">
      <HouseCupStyles />
      <div className="hc-shell">
        <header className="hc-hero">
          <div className="hc-kicker">🏔️ UA Internal Medicine House Cup</div>
          <h1 className="hc-title">Point-O-Matic</h1>
          <div className="hc-marquee-wrap"><div className="hc-marquee">★ WELCOME RESIDENTS &amp; FACULTY ★ LOG YOUR POINTS ★ DO COOL STUFF ★ TOUCH GRASS ★ BE WELL ★</div></div>
          <div className="hc-counterbar"><div className="hc-underconstruction">UNDER CONSTRUCTION</div><a className="hc-webmaster" href="mailto:nathantwalton@gmail.com?subject=House%20Cup%20bug%20%2F%20goblin%20complaint&body=Dear%20webmaster%2C%0A%0AI%20regret%20to%20inform%20you...%0A%0AThe%20problem%20is%3A%0A%0AHouse%3A%0AName%3A%0AScreenshot%20or%20evidence%3A%0A%0AWith%20respectful%20chaos%2C%0A">email the webmaster</a><div className="hc-counter">Status: <span className="hc-blink">ONLINE</span></div></div>
        </header>

        <nav className="hc-tabs">
          <TabButton active={activeTab === "log"} onClick={function selectLog() { setActiveTab("log"); }}>Resident Zone</TabButton>
          <TabButton active={activeTab === "leaderboard"} onClick={function selectLeaderboard() { setActiveTab("leaderboard"); }}>Hall of Glory</TabButton>
          <TabButton active={activeTab === "chiefLogin" || activeTab === "chief"} onClick={function selectChief() { setActiveTab(chiefAuthed ? "chief" : "chiefLogin"); }}>Secret Chief Lair</TabButton>
          <TabButton active={activeTab === "data"} onClick={function selectData() { setActiveTab("data"); }}>Nerd Stuff</TabButton>
        </nav>

        {activeTab === "log" && (
          <section>
            <div className="hc-card">
              <div className="hc-grid hc-grid-4">
                <div>
                  <FieldLabel>Resident / faculty name</FieldLabel>
                  <TextInput list="names" value={name} onChange={function updateName(event) { setName(event.target.value); }} placeholder="Start typing..." />
                  <datalist id="names">{ROSTER.map(function renderName(person) { return <option key={person.name} value={person.name} />; })}</datalist>
                </div>
                <div>
                  <FieldLabel>House</FieldLabel>
                  {rosterMatch ? <div className="hc-input"><b>{rosterMatch.house}</b> <span className="hc-muted">auto</span></div> : <SelectInput value={house} onChange={function updateHouse(event) { setHouse(event.target.value); }}><option value="">Choose house</option>{HOUSES.map(function renderHouse(h) { return <option key={h} value={h}>{h}</option>; })}</SelectInput>}
                </div>
                <div>
                  <FieldLabel>People with you</FieldLabel>
                  <TextInput value={people} onChange={function updatePeople(event) { setPeople(event.target.value); }} placeholder="Optional" />
                </div>
                <div>
                  <FieldLabel>Photo evidence</FieldLabel>
                  <input className="hc-input" type="file" accept="image/*" capture="environment" onChange={handlePhotoChange} />
                  {photoName && <div className="hc-muted">Selected: {photoName}</div>}
                  {photoPreview && <img className="hc-photo-preview" src={photoPreview} alt="Evidence preview" />}
                </div>
              </div>
              <div style={{ marginTop: 12 }}>
                <FieldLabel>Note or supporting documentation</FieldLabel>
                <TextInput value={note} onChange={function updateNote(event) { setNote(event.target.value); }} placeholder="Optional, unless using random point pitch" />
              </div>
              {!canSubmit && <div className="hc-alert">Enter your name and house once, then submit points.</div>}
            </div>

            <div className="hc-card">
              <div className="hc-grid hc-grid-4">
                <div style={{ gridColumn: "span 3" }}>
                  <FieldLabel>Quest picker</FieldLabel>
                  <SelectInput value={questLabel} onChange={function updateQuest(event) { setQuestLabel(event.target.value); }}>
                    {QUEST_OPTIONS.map(function renderQuest(opt) { return <option key={opt.label} value={opt.label}>{opt.category}: {opt.label} (+{opt.points || "?"})</option>; })}
                  </SelectInput>
                </div>
                <div>
                  <FieldLabel>Point pitch amount</FieldLabel>
                  <TextInput type="number" min="0" value={pointPitchAmount} onChange={function updatePitch(event) { setPointPitchAmount(event.target.value); }} placeholder="?" />
                </div>
              </div>
              <div className="hc-quest-card">Current Featured Quest: {currentFeaturedQuest} (+5)</div>
              <div className="hc-quest-card">Monthly Wellness: {getCurrentMonthlyWellnessQuest(currentMonthlyWellnessMonth).month} — {getCurrentMonthlyWellnessQuest(currentMonthlyWellnessMonth).quest} (+5). Proof: {getCurrentMonthlyWellnessQuest(currentMonthlyWellnessMonth).proof}</div>
              <div className="hc-muted" style={{ marginTop: 10 }}>Use this dropdown for Featured Quest, Monthly Wellness Challenge, or Big Tucson/custom challenges. Otherwise mash respective button below.</div>
            </div>

            <div className="hc-actions">
              {RESIDENT_ACTIVITIES.map(function renderActivity(activity) {
                const quest = getQuestSelection();
                const usesQuestPicker = activity.id === "wellness_community" || activity.id === "big_challenge";
                const isPitch = activity.id === "point_pitch";
                const shownPoints = usesQuestPicker ? quest.points : isPitch ? "?" : activity.points;
                const shownDescription = usesQuestPicker ? quest.label : isPitch ? "Requested: +" + (Number(pointPitchAmount) || 0) + " · requires note/chief review" : activity.description;
                return <button key={activity.id} type="button" onClick={function clickActivity() { logActivity(activity); }} disabled={!canSubmit} className="hc-action" style={{ background: activity.color }}><div className="hc-action-top"><span className="hc-icon">{activity.icon}</span><span className="hc-badge">{activity.id === "point_pitch" ? "+?" : "+" + (activity.id === "wellness_community" ? 3 : shownPoints)}</span></div><div className="hc-action-title">{activity.label}</div><p className="hc-action-desc">{activity.id === "wellness_community" ? "Wellness, community, service, Shubitz, blood donation, helping a friend. +3 pts." : activity.id === "big_challenge" ? "" : activity.id === "point_pitch" ? "For unsanctioned excellence and suspiciously wholesome nonsense." : shownDescription}</p></button>;
              })}
            </div>

            {submitStatus && <div className="hc-alert">{submitStatus}</div>}
            {lastSaved && <div className="hc-success">Saved: {lastSaved.activity} · {lastSaved.name} · {lastSaved.house} · +{lastSaved.points} pts {lastSaved.photoName ? "· photo selected" : ""}</div>}
            <section className="hc-footer"><b>Scoring:</b> AHD/conference = 1 point/hour via chief upload · Group activity = 2 (3+ people) · Group exercise = 2 (3+ people) · Academic flex = 3+ · Wellness + community = 3 · Monthly wellness challenge = 5 · Big Tucson challenges = 5–8 · Tell me why I should give you points? = chief review.</section>
          </section>
        )}

        {activeTab === "leaderboard" && (
          <section>
            <div className="hc-grid hc-grid-5" style={{ marginTop: 18 }}>{totals.map(function renderTotal(total, index) { return <div key={total.house} className="hc-leader"><div className="hc-rank">{getLeaderboardRankLabel(index)}</div><div className="hc-house">{total.house}</div><div className="hc-score">{total.points}</div><div className="hc-muted">points</div><div className="hc-trash">{getLeaderboardTrashTalk(index)}</div></div>; })}</div>
            <div className="hc-card"><h3>Achievement Badges</h3>{achievementBadges.length === 0 && <div className="hc-alert">No badges yet. Be the first to do literally anything.</div>}<div className="hc-badge-wall">{achievementBadges.map(function renderBadge(badge) { return <div key={badge.label} className="hc-achievement">{badge.label}<small>{badge.detail}</small></div>; })}</div></div>
            <div className="hc-card"><h3>Mini Wall of Fame</h3>{recentSubmissions.length === 0 && <div className="hc-alert">No submissions yet. The wall is tragically blank.</div>}<div className="hc-feed">{recentSubmissions.map(function renderFeedItem(item, index) { return <div key={index} className="hc-feed-item">{item.emoji} {item.text}</div>; })}</div></div>
            <div className="hc-card"><h3>Monthly Wellness Quests</h3><div className="hc-months">{MONTHLY_WELLNESS_QUESTS.map(function renderMonth(month) { return <div key={month.month} className="hc-month"><b>{month.month}: {month.theme}</b><br />{month.quest}<br /><span className="hc-muted">+5 · {month.vibe}<br />Proof: {month.proof}</span></div>; })}</div></div>
          </section>
        )}

        {activeTab === "chiefLogin" && (
          <section className="hc-card hc-login"><h2>🔐 Chief back-end</h2><p className="hc-muted">Chief uploads are tagged by uploader. Front-end login is light gatekeeping only — replace with real authentication before launch.</p><div style={{ marginTop: 12 }}><FieldLabel>Name</FieldLabel><TextInput value={chiefName} onChange={function updateChiefName(event) { setChiefName(event.target.value); }} placeholder="Nate" /></div><div style={{ marginTop: 12 }}><FieldLabel>Password</FieldLabel><TextInput type="password" value={chiefPassword} onChange={function updateChiefPassword(event) { setChiefPassword(event.target.value); }} placeholder="wootwoot1!" /></div><div className="hc-row" style={{ marginTop: 14 }}><button type="button" className="hc-button" onClick={loginChief}>Enter chief mode</button>{chiefMessage && <span className="hc-muted">{chiefMessage}</span>}</div></section>
        )}

        {activeTab === "chief" && chiefAuthed && (
          <section className="hc-card"><div className="hc-row" style={{ justifyContent: "space-between" }}><div><h2>Secret Chief Lair</h2><p className="hc-muted">Logged in as <b>{currentChief}</b> ({getChiefHouse(currentChief)}). AHD/conference upload = 1 point/hour by default. Kahoot/trivia/custom bonuses are manually awarded here.</p></div><button type="button" className="hc-button secondary" onClick={function logout() { setChiefAuthed(false); setCurrentChief(""); setActiveTab("chiefLogin"); }}>Log out</button></div>
            <div className="hc-card" style={{ boxShadow: "none" }}><h3>Google Docs / Drive settings</h3><p className="hc-muted">Admin/contact: <b>{ADMIN_EMAIL}</b>. Evidence folder: <a href={GOOGLE_EVIDENCE_FOLDER_URL} target="_blank" rel="noreferrer">open Google Drive folder</a>. Apps Script upload endpoint is connected.</p></div>
            <div className="hc-card" style={{ boxShadow: "none" }}>
              <h3>Featured Quest / Monthly Wellness controls</h3>
              <p className="hc-muted">Use this to change what residents see in the Quest Picker box. This updates the live page state; backend persistence can be added in Apps Script later.</p>
              <div className="hc-grid hc-grid-4">
                <div>
                  <FieldLabel>Featured quest idea bank</FieldLabel>
                  <SelectInput value={featuredSuggestion} onChange={function updateFeaturedSuggestion(event) { setFeaturedSuggestion(event.target.value); setCurrentFeaturedQuest(event.target.value); }}>
                    {FEATURED_QUEST_IDEAS.map(function renderIdea(idea) { return <option key={idea} value={idea}>{idea}</option>; })}
                  </SelectInput>
                  <button type="button" className="hc-button secondary" style={{ marginTop: 8 }} onClick={function randomizeFeaturedQuest() { const idea = getRandomFeaturedQuestIdea(); setFeaturedSuggestion(idea); setCurrentFeaturedQuest(idea); }}>🎲 Random sweet quest</button>
                </div>
                <div>
                  <FieldLabel>Current featured quest</FieldLabel>
                  <TextInput value={currentFeaturedQuest} onChange={function updateFeaturedQuest(event) { setCurrentFeaturedQuest(event.target.value); }} />
                </div>
                <div>
                  <FieldLabel>Featured quest note</FieldLabel>
                  <TextInput value={currentFeaturedNote} onChange={function updateFeaturedNote(event) { setCurrentFeaturedNote(event.target.value); }} />
                </div>
                <div>
                  <FieldLabel>Monthly wellness challenge</FieldLabel>
                  <SelectInput value={currentMonthlyWellnessMonth} onChange={function updateMonthlyMonth(event) { setCurrentMonthlyWellnessMonth(event.target.value); }}>
                    {MONTHLY_WELLNESS_QUESTS.map(function renderMonth(month) { return <option key={month.month} value={month.month}>{month.month}: {month.theme}</option>; })}
                  </SelectInput>
                </div>
              </div>
              <div className="hc-quest-card">Resident view now shows: Featured Quest — {currentFeaturedQuest} (+5)</div>
              <div className="hc-quest-card">Monthly Wellness: {getCurrentMonthlyWellnessQuest(currentMonthlyWellnessMonth).month} — {getCurrentMonthlyWellnessQuest(currentMonthlyWellnessMonth).quest}</div>
            </div>
            <div className="hc-grid hc-grid-4" style={{ marginTop: 18 }}><div><FieldLabel>AHD event title</FieldLabel><TextInput value={attendanceTitle} onChange={function updateAttendanceTitle(event) { setAttendanceTitle(event.target.value); }} /></div><div><FieldLabel>Date</FieldLabel><TextInput type="date" value={attendanceDate} onChange={function updateAttendanceDate(event) { setAttendanceDate(event.target.value); }} /></div><div><FieldLabel>Points/hour</FieldLabel><TextInput type="number" min="1" value={attendancePoints} onChange={function updateAttendancePoints(event) { setAttendancePoints(event.target.value); }} /></div><div style={{ alignSelf: "end" }}><button type="button" className="hc-button" onClick={importAttendance}>Upload AHD</button></div></div>
            <div style={{ marginTop: 12 }}><FieldLabel>AHD/conference attendees</FieldLabel><textarea className="hc-input" style={{ minHeight: 110 }} value={attendanceText} onChange={function updateAttendanceText(event) { setAttendanceText(event.target.value); }} placeholder={"Paste names here:\nNate Walton\nResident Example\nFaculty Example"} /></div>{uploadMessage && <div className="hc-success">{uploadMessage}</div>}{unknownUploads.length > 0 && <div className="hc-alert">{unknownUploads.length} uploaded attendee(s) did not match roster.</div>}
            <hr style={{ margin: "24px 0", border: "none", borderTop: "3px dashed #111827" }} />
            <h3>Approval Zone</h3><p className="hc-muted">Point pitches must be approved or denied by a chief who is not in the same house.</p><div className="hc-grid hc-grid-4" style={{ marginTop: 12 }}><div><FieldLabel>Approved points</FieldLabel><TextInput type="number" min="0" value={approvalPoints} onChange={function updateApprovalPoints(event) { setApprovalPoints(event.target.value); }} /></div><div><FieldLabel>Review note</FieldLabel><TextInput value={approvalNote} onChange={function updateApprovalNote(event) { setApprovalNote(event.target.value); }} placeholder="Optional" /></div><div className="hc-muted" style={{ alignSelf: "end" }}>Logged in as {currentChief} ({getChiefHouse(currentChief)}).</div></div>
            {pendingPointPitches.length === 0 && <div className="hc-alert">No pending point pitches.</div>}{pendingPointPitches.map(function renderPitch(pitch, index) { const blocked = !canChiefApprovePitch(currentChief, pitch); return <div key={pitch.submissionId || pitch.timestamp + "-" + index} className="hc-card" style={{ boxShadow: "none", background: blocked ? "#fee2e2" : "#fff7b8" }}><div><b>{pitch.name}</b> · {pitch.house} · requested +{pitch.points}</div><div className="hc-muted">{pitch.note}</div><div className="hc-muted">Conflict check: {blocked ? "BLOCKED — same house or unknown house" : "OK — different house chief"}</div><div className="hc-row" style={{ marginTop: 10 }}><button type="button" className="hc-button" disabled={blocked} onClick={function approvePitch() { reviewPointPitch(pitch, index, "approve"); }}>Approve</button><button type="button" className="hc-button danger" disabled={blocked} onClick={function denyPitch() { reviewPointPitch(pitch, index, "deny"); }}>Deny</button></div></div>; })}{approvalMessage && <div className="hc-success">{approvalMessage}</div>}
            <hr style={{ margin: "24px 0", border: "none", borderTop: "3px dashed #111827" }} />
            <h3>Kahoot / trivia / bonus points</h3><div className="hc-grid hc-grid-5"><div><FieldLabel>House</FieldLabel><SelectInput value={bonusHouse} onChange={function updateBonusHouse(event) { setBonusHouse(event.target.value); }}><option value="">Choose house</option>{HOUSES.map(function renderBonusHouse(h) { return <option key={h} value={h}>{h}</option>; })}</SelectInput></div><div><FieldLabel>Bonus title</FieldLabel><TextInput value={bonusTitle} onChange={function updateBonusTitle(event) { setBonusTitle(event.target.value); }} /></div><div><FieldLabel>Date</FieldLabel><TextInput type="date" value={bonusDate} onChange={function updateBonusDate(event) { setBonusDate(event.target.value); }} /></div><div><FieldLabel>Points</FieldLabel><TextInput type="number" min="0" value={bonusPoints} onChange={function updateBonusPoints(event) { setBonusPoints(event.target.value); }} /></div><div style={{ alignSelf: "end" }}><button type="button" className="hc-button" onClick={addChiefBonus}>Add bonus</button></div></div><div style={{ marginTop: 12 }}><FieldLabel>Bonus note</FieldLabel><TextInput value={bonusNote} onChange={function updateBonusNote(event) { setBonusNote(event.target.value); }} placeholder="Winner, runner-up, chaos award, etc." /></div>{bonusMessage && <div className="hc-success">{bonusMessage}</div>}
          </section>
        )}

        {activeTab === "data" && (
          <section className="hc-card"><div className="hc-row"><button type="button" onClick={function exportCsv() { downloadCSV(rows); }} disabled={!rows.length} className="hc-button">⬇️ Download CSV</button><button type="button" onClick={clearRows} disabled={!rows.length} className="hc-button danger">🗑️ Clear local data</button></div><div className="hc-table-wrap" style={{ marginTop: 14 }}><table className="hc-table"><thead><tr><th>When</th><th>Date</th><th>Name</th><th>House</th><th>Activity</th><th>Pts</th><th>Status</th><th>Source</th></tr></thead><tbody>{rows.map(function renderRow(row, index) { return <tr key={row.timestamp + "-" + index}><td>{new Date(row.timestamp).toLocaleString()}</td><td>{row.date}</td><td>{row.name}</td><td>{row.house}</td><td>{row.activity}</td><td><b>{row.points}</b></td><td>{row.status || "approved"}</td><td>{row.source}</td></tr>; })}{!rows.length && <tr><td colSpan="8" style={{ textAlign: "center", color: "#64748b" }}>No points logged yet.</td></tr>}</tbody></table></div></section>
        )}
      </div>
    </div>
  );
}
