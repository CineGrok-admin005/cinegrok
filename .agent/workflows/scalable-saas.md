---
description: Maintain "Scalable SaaS" architecture principles for all future changes.
---

# Scalable SaaS Architecture Workflow

Any future changes to this codebase must adhere to the mandatory architectural rules established during the `cinegrok-scalable` refactor.

## 📐 Mandatory Rules

1.  **Frontend Isolation**: Never import `@supabase/supabase-js` or any other provider-specific SDK in frontend components (`src/components` or `src/app`).
2.  **API Client Only**: Frontend components MUST use the unified API client in `src/lib/api.ts` for all data, auth, and storage operations.
3.  **Service Abstraction**: If a new infrastructure capability is needed (e.g., Email, SMS, AI), define an interface in `src/services/capabilities/` first, then implement a provider-agnostic factory.
4.  **Domain Isolation**: Business logic (validation, data transformation, complex calculations) belongs in `src/domain`. It should never depend on service implementations.
5.  **Environment Configuration**: Never hardcode URLs or API keys. Add them to `.env.local` and access via server-side configuration.

## 🔄 Adding New Features

When adding a new feature (e.g., "User Messaging"):

1.  **Interface**: Create `IMessageService` in `src/services/message/message.service.interface.ts`.
2.  **Implementation**: Create `SupabaseMessageService` (or other) in `src/services/message/supabase-message.service.ts`.
3.  **Domain**: Add logic to `src/domain/message.logic.ts`.
4.  **API Route**: Add `src/app/api/messages/route.ts` that uses the service.
5.  **API Client**: Add methods to `src/lib/api.ts`.
6.  **Component**: Call the new `lib/api` method.

## 🧪 Verification
After any change, run a grep check to ensure no vendor-specific imports have leaked into the frontend:
`grep -r "supabase" src/components` (Should return zero results, except for comments).
