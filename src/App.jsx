// App.tsx
// Expo React Native starter app for the UA IM House Cup point logger.
// Works on iOS + Android with: npx create-expo-app house-cup && replace App.tsx with this file.
// Optional packages for CSV sharing:
// npx expo install expo-sharing expo-file-system

import React, { useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

const HOUSES = ["Catalina", "Rincon", "Santa Rita", "Tortolita", "Tucson"];

const ACTIVITIES = [
  {
    id: "conference",
    label: "Conference",
    points: 1,
    icon: "AHD",
    description: "AHD, noon conference, grand rounds",
  },
  {
    id: "group_activity",
    label: "Group activity",
    points: 2,
    icon: "GROUP",
    description: "Dinner, trivia, coffee, house hang, 3+ people",
  },
  {
    id: "group_exercise",
    label: "Group exercise",
    points: 2,
    icon: "MOVE",
    description: "Hike, bike, climb, gym, yoga, pickleball, walk, 3+ people",
  },
  {
    id: "academic",
    label: "Academic flex",
    points: 3,
    icon: "BRAIN",
    description: "Journal club, teaching, abstract, QI/research",
  },
  {
    id: "wellness_community",
    label: "Wellness + community",
    points: 3,
    icon: "BE WELL",
    description: "Wellness, service, Shubitz, blood donation, helping a friend",
  },
  {
    id: "monthly_wellness",
    label: "Monthly wellness",
    points: 5,
    icon: "MONTH",
    description: "Monthly challenge with photo/screenshot proof",
  },
  {
    id: "big_tucson",
    label: "Big Tucson challenge",
    points: 5,
    icon: "TUCSON",
    description: "Featured quest, Loop, summit, mural, sunrise, or custom Tucson quest",
  },
  {
    id: "point_pitch",
    label: "Tell me why I should give you points?",
    points: 0,
    icon: "WHY?",
    description: "Pitch your case. Chief review required.",
  },
];

function csvEscape(value) {
  const text = String(value ?? "");
  if (text.includes(",") || text.includes("\n") || text.includes('"')) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function makeEntryId(activityId) {
  return `${Date.now()}-${activityId}-${Math.random().toString(36).slice(2)}`;
}

function isAscii(text) {
  return /^[\x00-\x7F]*$/.test(String(text ?? ""));
}

function calculateTotals(entries) {
  return HOUSES.map((house) => ({
    house,
    points: entries
      .filter((entry) => entry.house === house)
  function normalizeSheetSubmission(row, index) {
  const fallbackId = `sheet-${index}-${Date.now()}`;
  return {
    id: row.submissionId || row.id || fallbackId,
    timestamp: row.timestamp || new Date().toISOString(),
    name: row.name || "",
    house: row.house || "",
    activity: row.activity || "",
    points: Number(row.points || 0),
    note: row.note || "",
    status: row.status || "approved",
    source: row.source || "sheet",
  };
}

function calculateTotals(entries) {
  return HOUSES.map((house) => ({
    house,
    points: entries
      .filter((entry) => entry.house === house)
      .filter((entry) => entry.status !== "pending_review" && entry.status !== "denied")
      .reduce((sum, entry) => sum + Number(entry.points || 0), 0),
  })).sort((a, b) => b.points - a.points || a.house.localeCompare(b.house));
}ity.id === "point_pitch"), "Point pitch activity should exist.");
  console.assert(ACTIVITIES.find((activity) => activity.id === "academic")?.points === 3, "Academic flex should be 3 points.");
  console.assert(ACTIVITIES.find((activity) => activity.id === "wellness_community")?.points === 3, "Wellness + community should be 3 points.");
  console.assert(ACTIVITIES.find((activity) => activity.id === "monthly_wellness")?.points === 5, "Monthly wellness should be 5 points.");
  console.assert(ACTIVITIES.every((activity) => isAscii(activity.icon)), "Activity icons should be ASCII-safe for older bundlers.");
  console.assert(csvEscape("a,b") === '"a,b"', "CSV escaping should quote commas.");
  console.assert(calculateTotals([{ house: "Catalina", points: 2 }, { house: "Catalina", points: 3 }])[0].points === 5, "Totals should sum by house.");
}console.assert(calculateTotals([{ house: "Catalina", points: 2 }, { house: "Catalina", points: 3 }])[0].points === 5, "Totals should sum by house.");
  console.assert(calculateTotals([{ house: "Catalina", points: 99, status: "pending_review" }])[0].points === 0, "Pending review points should not count in totals.");
  console.assert(normalizeSheetSubmission({ house: "Rincon", points: "4" }, 0).points === 4, "Sheet rows should normalize numeric point strings."); setNote] = useState("");
  const [pointPitchAmount, setPointPitchAmount] = useState("1");
  const [entries, setEntries] = useState([]);
  const [lastEntry, setLastEntry] = useState(null);

  const totals = useMemo(() => calculateTotals(entries), [entries]);

  const canLog = name.trim().lconst [lastEntry, setLastEntry] = useState(null);
  const [syncStatus, setSyncStatus] = useState("Local only until you sync Sheet.");ity(activity) {
    if (!canLog || !house) {
      Alert.alert("Almost there", "Add your name and house once, then tap again.");
      return;
    }

    if (activity.id === "point_pitch" && !note.trim()) {
      Alert.alert("Sell it", "Tell us why you deserve points in the note field first.");
      return;
    }

    const finalPoints = activity.id === "point_pitch" ? Number(pointPitchAmount) || 0 : activity.points;
    const finalNote = activity.id === "point_pitch"
      ? `Requested ${finalPoints} point(s): ${note.trim()}`
      : note.trim();

    const entry = {
      id: makeEntryId(activity.id),
      timestamp: new Date().toISOString(),
      name: name.trim(),
      house,
      activity: activity.label,
      points: finalPoints,
      note: finalNote,
      status: activity.id === "point_pitch" ? "pending_review" : "approved",
    };

    setEntries((prev) => [entry, ...prev]);
    setLastEntry(entry);
    setNote("");
  }

  async function shareCSV() {
    if (entries.length === 0) {
      Alert.alert("No data yet", "Log at least one point first.");
      return;
    }

   async function loadSheetSubmissions() {
    try {
      setSyncStatus("Syncing Sheet...");
      const response = await fetch(`${APPS_SCRIPT_WEB_APP_URL}?action=submissions`);
      const data = await response.json();
      if (!data || data.ok !== true || !Array.isArray(data.submissions)) {
        throw new Error("Sheet endpoint did not return submissions.");
      }
      const sheetEntries = data.submissions.map(normalizeSheetSubmission);
      setEntries(sheetEntries);
      setLastEntry(sheetEntries[0] || null);
      setSyncStatus(`Synced ${sheetEntries.length} Sheet row(s).`);
    } catch (error) {
      setSyncStatus("Could not sync Sheet. Check Apps Script deployment/access.");
      Alert.alert("Sync failed", String(error && error.message ? error.message : error));
    }
  }

  async function shareCSV() {p", "name", "house", "activity", "points", "status", "note"];
    const rows = entries.map((entry) => [
      entry.timestamp,
      entry.name,
      entry.house,
      entry.activity,
      entry.points,
      entry.status || "approved",
      entry.note,
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map(csvEscape).join(","))
      .join("\n");

    const path = `${FileSystem.documentDirectory}house-cup-points.csv`;
    await FileSystem.writeAsStringAsync(path, csv, { encoding: FileSystem.EncodingType.UTF8 });

    const available = await Sharing.isAvailableAsync();
    if (!available) {
      Alert.alert("CSV created", path);
      return;
    }

    await Sharing.shareAsync(path, {
      mimeType: "text/csv",
      dialogTitle: "Share House Cup CSV",
      UTI: "public.comma-separated-values-text",
    });
  }

  function clearEntries() {
    Alert.alert("Clear local entries?", "This only clears data stored on this phone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear",
        style: "destructive",
        onPress: () => {
          setEntries([]);
          setLastEntry(null);
        },
      },
    ]);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerPill}>
          <Text style={styles.headerPillText}>UA Internal Medicine House Cup</Text>
        </View>

        <Text style={styles.title}>Point-O-Matic</Text>
        <Text style={styles.subtitle}>Name + house once. Tap a button. Done in under 30 seconds.</Text>

        <View style={styles.card}>
          <Text sty<Text style={styles.subtitle}>Name + house once. Tap a button. Done in under 30 seconds.</Text>
        <Text style={styles.syncText}>{syncStatus}</Text> placeholder="Your name"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />

          <Text style={[styles.label, { marginTop: 14 }]}>House</Text>
          <View style={styles.houseGrid}>
            {HOUSES.map((h) => (
              <Pressable
                key={h}
                style={[styles.houseButton, house === h && styles.houseButtonSelected]}
                onPress={() => setHouse(h)}
              >
                <Text style={[styles.houseButtonText, house === h && styles.houseButtonTextSelected]}>{h}</Text>
              </Pressable>
            ))}
          </View>

          <Text style={[styles.label, { marginTop: 14 }]}>Note or supporting documentation</Text>
          <TextInput
            style={styles.input}
            placeholder="Optional, unless pitching points"
            value={note}
            onChangeText={setNote}
          />

          <Text style={[styles.label, { marginTop: 14 }]}>Point pitch amount</Text>
          <TextInput
            style={styles.input}
            placeholder="For Tell me why I should give you points?"
            value={pointPitchAmount}
            onChangeText={setPointPitchAmount}
            keyboardType="numeric"
          />
        </View>

        {!canLog && <Text style={styles.helper}>Add name + house to activate point buttons.</Text>}

        <View style={styles.activityGrid}>
          {ACTIVITIES.map((activity) => {
            const displayPoints = activity.id === "point_pitch" ? "?" : activity.points;
            return (
              <Pressable
                key={activity.id}
                style={({ pressed }) => [
                  styles.activityButton,
                  !canLog && styles.activityButtonDisabled,
                  pressed && canLog && styles.activityButtonPressed,
                ]}
                onPress={() => logActivity(activity)}
              >
                <View style={styles.activityTopRow}>
                  <Text style={styles.activityIcon}>{activity.icon}</Text>
                  <Text style={styles.pointsBadge}>+{displayPoints}</Text>
                </View>
                <Text style={styles.activityTitle}>{activity.label}</Text>
                <Text style={styles.activityDescription}>{activity.description}</Text>
              </Pressable>
            );
          })}
        </View>

        {lastEntry && (
          <View style={styles.savedCard}>
            <Text style={styles.savedTitle}>Saved: {lastEntry.activity}</Text>
            <Text style={styles.savedText}>
              {lastEntry.name} - {lastEntry.house} - +{lastEntry.points} pts - {lastEntry.status || "approved"}
            </Text>
          </View>
        )}

        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Leaderboard</Text>
          <Text style={styles.entryCount}>{entries.length} logs</Text>
        </View>

        <View style={styles.leaderboardCard}>
          {totals.map((total, index) => (
            <View key={total.house} style={styles.leaderboardRow}>
              <Text style={styles.rank}>#{index + 1}</Text>
              <Text style={styles.houseName}>{total.house}</Text>
              <Text style={styles.totalPoints}>{total.points}</Text>
            </View>
          ))}
        </View>

        <View style={styles.actionRow}>
          <Pressable style={styles.secondaryButton} onPress={shareCSV}>
            <Text style={styles.secondaryButton<View style={styles.actionRow}>
          <Pressable style={styles.secondaryButton} onPress={loadSheetSubmissions}>
            <Text style={styles.secondaryButtonText}>Sync Sheet</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton} onPress={shareCSV}>
            <Text style={styles.secondaryButtonText}>Share CSV</Text>
          </Pressable>
          <Pressable style={styles.dangerButton} onPress={clearEntries}>    Simple scoring: Conference 1 - Group 2 - Academic 3 - Wellness/community 3 - Monthly wellness 5 - Big Tucson 5+. Keep the vibe fun, not forensic.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff7ed",
  },
  container: {
    padding: 18,
    paddingBottom: 40,
  },
  headerPill: {
    alignSelf: "center",
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#fed7aa",
    marginTop: 8,
  },
  headerPillText: {
    fontWeight: "700",
    color: "#431407",
  },
  title: {
    marginTop: 18,
    fontSize: 42,
    lineHeight: 46,
    fontWeight: "900",
    textAlign: "center",
    color: "#1e293b",
  },
  subtitle: {
    marginTop: 8,
    fontSize: 15,
    textAlign: "center",
    color: "#64748b",
  },
  card: {
    marginTop: 22,
    backgroundColor: "subtitle: {
    marginTop: 8,
    fontSize: 15,
    textAlign: "center",
    color: "#64748b",
  },
  syncText: {
    marginTop: 8,
    fontSize: 12,
    textAlign: "center",
    color: "#9a3412",
    fontWeight: "700",
  },},
  label: {
    fontSize: 13,
    fontWeight: "800",
    color: "#334155",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  houseGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  houseButton: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    backgroundColor: "#f8fafc",
  },
  houseButtonSelected: {
    backgroundColor: "#1e293b",
    borderColor: "#1e293b",
  },
  houseButtonText: {
    fontWeight: "800",
    color: "#334155",
  },
  houseButtonTextSelected: {
    color: "#ffffff",
  },
  helper: {
    marginTop: 12,
    textAlign: "center",
    color: "#64748b",
    fontSize: 13,
  },
  activityGrid: {
    marginTop: 16,
    gap: 12,
  },
  activityButton: {
    backgroundColor: "#ffffff",
    borderRadius: 26,
    padding: 18,
    borderWidth: 2,
    borderColor: "#fed7aa",
  },
  activityButtonDisabled: {
    opacity: 0.48,
  },
  activityButtonPressed: {
    transform: [{ scale: 0.985 }],
    backgroundColor: "#fffbeb",
  },
  activityTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  activityIcon: {
    overflow: "hidden",
    backgroundColor: "#ffedd5",
    color: "#7c2d12",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    fontWeight: "900",
    fontSize: 13,
  },
  pointsBadge: {
    overflow: "hidden",
    backgroundColor: "#1e293b",
    color: "#ffffff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    fontWeight: "900",
    fontSize: 16,
  },
  activityTitle: {
    marginTop: 12,
    fontSize: 24,
    fontWeight: "900",
    color: "#1e293b",
  },
  activityDescription: {
    marginTop: 4,
    fontSize: 14,
    color: "#64748b",
  },
  savedCard: {
    marginTop: 16,
    backgroundColor: "#dcfce7",
    borderColor: "#86efac",
    borderWidth: 1,
    padding: 14,
    borderRadius: 20,
  },
  savedTitle: {
    fontWeight: "900",
    color: "#14532d",
  },
  savedText: {
    marginTop: 2,
    color: "#166534",
  },
  sectionHeaderRow: {
    marginTop: 24,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#1e293b",
  },
  entryCount: {
    color: "#64748b",
    fontWeight: "700",
  },
  leaderboardCard: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 8,
    borderWidth: 1,
    borderColor: "#ffedd5",
  },
  leaderboardRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  rank: {
    width: 38,
    color: "#64748b",
    fontWeight: "900",
  },
  houseName: {
    flex: 1,
    fontSize: 16,
    fontWeight: "900",
    color: "#1e293b",
  },
  totalPoints: {
    fontSize: 22,
    fontWeight: "900",
    color: "#1e293b",
  },
  actionRow: {
    marginTop: 16,
    flexDirection: "row",
    gap: 10,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: "#1e293b",
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#ffffff",
    fontWeight: "900",
    fontSize: 16,
  },
  dangerButton: {
    backgroundColor: "#fee2e2",
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 22,
    alignItems: "center",
  },
  dangerButtonText: {
    color: "#991b1b",
    fontWeight: "900",
    fontSize: 16,
  },
  footerText: {
    marginTop: 18,
    textAlign: "center",
    color: "#64748b",
    fontSize: 13,
    lineHeight: 18,
  },
});
