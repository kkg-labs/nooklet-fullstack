# test Specification

## Purpose
Capture shared testing patterns that protect database state during automated runs.

## Requirements
### Requirement: Functional specs isolate persistence changes
The system SHALL wrap every functional or service-level test group that writes to the database in a global transaction so mutations are rolled back after each test.

#### Scenario: Hooks manage transactional isolation
- **WHEN** a functional test suite defines `group.each.setup`
- **THEN** it calls `db.beginGlobalTransaction()` before exercising data mutations
- **AND** it returns an async teardown that calls `db.rollbackGlobalTransaction()`
