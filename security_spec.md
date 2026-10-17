# Security Specification: Boundless Echoes Autonomous 12-Sign Swarm Council

## 1. Data Invariants
- Deliberations are publicly viewable council sessions. Creation and status updates require valid structural boundaries.
- Speeches must always belong to an existing deliberation (`deliberations/{deliberationId}`).
- A speech record cannot exceed 2000 characters and must match one of the 12 verified zodiac signs (`aries`, `taurus`, `gemini`, `cancer`, `leo`, `virgo`, `libra`, `scorpio`, `sagittarius`, `capricorn`, `aquarius`, `pisces`).
- Autonomous agents profiles (`/agents/{agentId}`) represent the 12 sovereign council seats and have locked immutable identifiers.
- No client may inject shadow properties or spoof arbitrary admin roles.

## 2. The "Dirty Dozen" Payloads
1. **Unbounded Payload Injection**: A deliberation with `topic` length > 10,000 characters.
2. **Invalid Sign Identity**: A speech referencing an unauthorized or malicious `signId` like `"imposter_agent"`.
3. **Orphaned Speech Write**: A speech submitted to a non-existent deliberation ID.
4. **Shadow Field Injection**: A deliberation create payload injecting `{ isAdmin: true, bypassCouncil: true }`.
5. **Direct Status Modification**: Modifying immutable deliberation `createdAt` timestamps.
6. **Malicious Path Variable**: Using document ID containing path traversal characters like `../../hack`.
7. **Negative or Unbounded Scores**: Submitting `consensusScore` as -50 or 9999.
8. **Invalid Element Spoofing**: Submitting `element` as `"DarkMatter"` instead of `Fire`, `Earth`, `Air`, or `Water`.
9. **Speech Bloat Denial of Wallet**: Submitting a speech with statement length > 50,000 chars.
10. **Agent Hijacking**: Overwriting the core `signId` of an established council seat.
11. **Status Tampering**: Updating an agent status to arbitrary non-enum states like `"root_access"`.
12. **Blanket Query Scraping**: Issuing unbounded global collectionGroup queries without proper constraints.

## 3. Enforcement Strategy
All writes are guarded by strict JSON-schema mirrors with `hasAll` and `hasOnly` key constraints, string boundary checks, regex guards on document IDs, and relational parent validation.
