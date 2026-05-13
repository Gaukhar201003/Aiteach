# Security Specification - AI-teach

## 1. Data Invariants
- A User profile must be uniquely identified by their Firebase Auth UID.
- Users can only read and write their own profile data.
- Lesson plans, generated tasks, and prompts are sub-resources owned by a specific user and cannot exist independently.
- Timestamps (createdAt) must be validated (though currently client-provided, they should ideally be server-assigned).
- Roles and competency levels must be restricted to predefined sets.

## 2. The "Dirty Dozen" Payloads
1. **Identity Spoofing**: Attempt to create a user profile with `uid: "someone_else"` while authenticated as `"my_uid"`.
2. **Role Escalation**: Attempt to set `role: "admin"` during profile creation.
3. **ID Poisoning**: Attempt to use a 2MB string as a `planId`.
4. **Orphaned Write**: Attempt to create a lesson plan with a `userId` that doesn't match the path.
5. **PII Leak**: Attempt to read another user's profile metadata.
6. **State Shortcut**: (N/A for Current Schema)
7. **Cross-User Injection**: Add a lesson plan to another user's collection.
8. **Field Injection**: Add a `verified: true` field to the user profile that isn't in the schema.
9. **Denial of Wallet**: Send a 1MB display name string.
10. **Timestamp Fraud**: Set `createdAt` to a future date string.
11. **Type Mismatch**: Send `stats.plansGenerated: "lots"` (string instead of number).
12. **Missing Gate**: Access subcollections without being the owner of the parent document.

## 3. Test Cases (Mental)
- [create] /users/me -> OK (if data.uid == me)
- [create] /users/someone_else -> REJECT
- [update] /users/me (changing role) -> REJECT
- [write] /users/me/lessonPlans/123 -> OK (if auth.uid == me)
- [write] /users/other/lessonPlans/123 -> REJECT
