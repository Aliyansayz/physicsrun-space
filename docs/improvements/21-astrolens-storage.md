# Improvement Prompts — AstroLens Storage Service (Rating 7 → 9)

## File: `src/services/astrolensStorage.ts`

---

### Prompt 1: Re-evaluate Badges on Snapshot Delete

`deleteCapturedSnapshot` doesn't re-evaluate badges — deleting a snapshot could leave a badge unlocked that should be locked.

**Elevation steps:**
1. After deleting a snapshot, re-run the badge evaluation logic:
   ```ts
   export function deleteCapturedSnapshot(snapshotId: string): DiscoveryProgress {
     const progress = getDiscoveryProgress();
     progress.capturedSnapshots = progress.capturedSnapshots.filter(s => s.id !== snapshotId);
     // Re-evaluate badges
     progress.unlockedBadges = evaluateBadges(progress);
     saveDiscoveryProgress(progress);
     return progress;
   }
   ```
2. Extract badge evaluation into a shared function used by both `addCapturedSnapshot` and `deleteCapturedSnapshot`

---

### Prompt 2: Handle localStorage Quota Exceeded

Snapshot data URLs can be large (1400x900 JPEG) — localStorage has a ~5MB limit. Storing many snapshots could exceed this.

**Elevation steps:**
1. Before saving, check the approximate size:
   ```ts
   const size = JSON.stringify(progress).length;
   if (size > 4 * 1024 * 1024) { // 4MB threshold
     // Remove oldest snapshots until under threshold
   }
   ```
2. Show a user-friendly message: "Storage full — oldest snapshots removed."
3. Consider compressing snapshots to smaller JPEG quality (e.g., 0.7) before storing

---

### Prompt 3: Add Data Migration Support

If the data structure changes (e.g., new fields added), old localStorage data may be incompatible.

**Elevation steps:**
1. Add a `version` field to the stored data
2. On load, check the version and migrate if needed:
   ```ts
   const data = JSON.parse(raw);
   if (data.version < CURRENT_VERSION) {
     return migrateData(data);
   }
   ```
3. This prevents crashes when the app is updated with new data fields
