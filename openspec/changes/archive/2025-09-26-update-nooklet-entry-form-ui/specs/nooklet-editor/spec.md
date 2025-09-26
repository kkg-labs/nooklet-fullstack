## ADDED Requirements
### Requirement: New nooklet entry card integrates with list UI
The system SHALL display the draft entry form as part of the nooklet card list, matching the layout and styling of existing entries.

#### Scenario: Draft entry card appears inline
- **WHEN** the user views the nooklet timeline
- **THEN** the new-entry draft card is rendered in the same container as other nooklet cards
- **AND** the card uses the same visual hierarchy and spacing as existing entries

### Requirement: Draft entry relies on autosave without manual controls
The system SHALL omit manual "Save" or "Clear" actions from the new nooklet entry form because autosave preserves draft updates.

#### Scenario: Autosave only controls
- **WHEN** the user edits the new nooklet draft
- **THEN** the UI provides no explicit save or clear buttons
- **AND** draft changes persist automatically per existing autosave behavior

### Requirement: Create label matches entry metadata style
The system SHALL render the "Create a new nooklet" label using the compact metadata style to match the "Created" label on existing cards.

#### Scenario: Consistent label styling
- **WHEN** the user sees the entry label on the draft card
- **THEN** the label matches the typography, size, and styling of the "Created" metadata label used on other cards
