## Why
The create-new nooklet entry experience currently sits apart from existing entries and retains redundant "Save" and "Clear" controls even though autosave is already in place. This inconsistency creates UI fragmentation and extra cognitive load.

## What Changes
- Integrate the new nooklet entry card into the main nooklet list so it visually aligns with existing entries.
- Remove manual save/clear controls from the new nooklet form, relying on autosave.
- Update the "Create a new nooklet" label to match the smaller "Created" label style used by existing entries for consistency.

## Impact
- Affected specs: nooklet authoring UI
- Affected code: Inertia pages/components rendering the nooklet index and editor states
