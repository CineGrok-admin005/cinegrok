---
description: Standardized Feature Implementation & Quality Guardrails
---
# Feature Implementation Protocol

Every time you add or modify a feature in CineGrok, you MUST follow these 4 check-points before submitting the work.

## 1. Architectural Compliance (The 3-Box Rule)
**Constraint**: No vendor-specific imports (Supabase/Razorpay SDKs) in `src/components`.

- **Action**: Logic -> `src/domain`, DB calls -> `src/services`, UI calls -> `api.ts`.
- **Verification**: Run `grep -r "supabase" src/components`.

## 2. Security & Atomic Integrity
**Constraint**: All database writes must be "Zero-Trust."

- **Action**: Always verify `auth.uid()` against target record's `user_id`.
- **Atomic Operations**: For multi-table updates (e.g., Payments), use a Postgres RPC using `supabase/migrations`.

## 3. Performance (The DB-First Rule)
**Constraint**: No in-memory filtering of large data sets.

- **Action**: All filtering, sorting, and pagination must happen in the Supabase query layer (Service/DB).

## 4. The "Anti-Backlash" Testing Suite
**Logic Check**: Update/Add unit tests in `src/domain/__tests__` if logic changes.
**User Check**: Run `npx playwright test` (Smoke Test) to ensure main site flow works.
**Safety Check**: Ensure `global-error.tsx` is not bypassed.

---

## Final Deliverable Format
For every task, confirm compliance:

```markdown
# Protocol Compliance Report
1. [x] **Architecture**: Grep check passed (No direct DB access in UI).
2. [x] **Security**: inputs sanitized, atomic writes verified.
3. [x] **Performance**: DB-level filtering used.
4. [x] **Testing**: Smoke tests passed.
```
