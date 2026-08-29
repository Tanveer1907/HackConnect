# HackConnect — Polish & Enhancements Plan

> **Scope:** Everything worth doing **apart from** wiring real external data/APIs (Devpost/MLH/Adzuna ingestion is tracked separately, blocked on credentials).
> This plan covers two tracks: **(A) Functional gaps** — controls that look interactive but do nothing — and **(B) UI / animation / effects** — motion, loading states, and visual polish.
>
> _Last updated: 2026-07-06._

---

## Context

HackConnect is feature-rich on paper (auth, hackathons, internships, teams, real-time chat, moderation), but an audit surfaced two classes of unfinished work:

1. **Dead controls** — several buttons, filters, sort dropdowns, and the core "invite to team" flow are styled and hover-animated but have no handler or wire only a partial action. They make the app feel finished while silently doing nothing.
2. **Motion & loading polish** — the app has a strong dark-glass aesthetic (glow orbs, blur, hover lifts) but no skeleton loaders, no page/list entrance animations, and two animation classes (`animate-scaleUp`, `animate-fadeIn`) that are referenced but **never defined**, so those transitions silently don't run.

The goal: close the "looks done vs. is done" gap and add the tasteful motion the design already implies.

**Already fixed (this session):** removed fake `Math.random()` numbers (participant counts, match %, "Active Now" stat), populated the invite-panel hackathon dropdown from real data, derived Profile tags from real skills, and replaced the mocked admin `activeHackathons` metric with a real query.

**Phase 1 completed (2026-07-06):**
- **B0** — registered `fadeIn`/`slideIn`/`scaleUp`/`shimmer` keyframes + animations centrally in [index.html](frontend/public/index.html); removed the scattered inline `<style>` tags in Login/Teams. The previously-broken `animate-scaleUp` (Chat/Internships modals) and `animate-fadeIn` (ForgotPassword) now run.
- **A5** — Teams experience-level filter now applies (derived from each user's highest skill `type`); "View More Talents" paginates (8/page); Hackathons sort dropdown (Recommended/Newest/Prize Pool) and real numbered pagination (9/page) are wired, with empty states.
- **A8** — Home "Join" → `/hackathons`, footer Platform links → real routes; removed featureless "Learn more"/"View all features" placeholders and the non-functional Sidebar "Upgrade Plan" card and Profile "View All" link. _(Remaining `href="#"` in Login/Register/Chat are conventional support/legal placeholders — left intentionally.)_
- Verified: `npm run build` compiles cleanly (no new errors).

---

## Track A — Functional Gaps

Ordered by user-facing impact. Each item lists the file, the problem, and the fix.

### A1. Team invite flow only sends a chat DM — never creates an invite _(highest impact)_
- **Where:** [Teams.jsx:297-333](frontend/src/pages/Teams.jsx) — "Send Invitation" only does `socket.emit('send_message', ...)`; the "Select Hackathon" `<select>` has no `value`/`onChange` so the choice is discarded.
- **Fix:** On send, call `sendTeamRequest`/`createTeam` (see [teamController.js:113](backend/src/controllers/teamController.js)) with the selected hackathon, then optionally send the DM. Bind the dropdown to state so the hackathon is captured.

### A2. Reject / Decline team request is unimplemented (frontend + backend)
- **Where:** [Dashboard.jsx:135](frontend/src/pages/Dashboard.jsx) "Decline" button has no `onClick`. No `rejectTeamRequest` in [teamController.js](backend/src/controllers/teamController.js), no route, no API helper.
- **Fix:** Add `rejectTeamRequest` controller + `PUT /team/:teamId/reject` route + `rejectTeamRequest` in [api.js](frontend/src/services/api.js), wire the Decline button. (Consider `leaveTeam`/`removeMember` while here.)

### A3. Admin Moderation page is unreachable for the React app
- **Where:** [AdminModeration.jsx](frontend/src/pages/AdminModeration.jsx) sends a Bearer **user** token, but [adminAuth.js:4](backend/src/middleware/adminAuth.js) requires an `admin_token` **cookie** with `role: 'admin'`. Every action returns 403; there's no admin login in React and no nav link.
- **Decision (2026-07-06): keep admin access.** Add a React admin-login flow that authenticates against the existing admin OTP endpoints and sets the `admin_token` cookie, plus a nav entry to `/admin/moderation`. The backend moderation logic already works.

### A4. Teammate recommendation is a thin stub + un-normalized score
- **Where:** [userController.js:74-107](backend/src/controllers/userController.js) — `+10` per exact skill-name match only; raw score shown as a `%` in [TeamCard.jsx:43](frontend/src/components/TeamCard.jsx), so 3 shared skills reads "30% Match" and >10 skills exceeds 100%.
- **Fix (interim):** normalize the score to 0–100 before display. **(Full smart-matching algorithm is a separate larger effort — out of scope here, noted for later.)**

### A5. Filters / sorts / pagination that don't act
- **Experience-level filter** unused: [Teams.jsx:139-166](frontend/src/pages/Teams.jsx) sets `expFilter` but never applies it.
- **Hackathons sort dropdown** (Recommended/Newest/Prize Pool) not wired: [Hackathons.jsx:96-100](frontend/src/pages/Hackathons.jsx).
- **Hackathons pagination** static: [Hackathons.jsx:181-185](frontend/src/pages/Hackathons.jsx) — no page state, API not paginated.
- **"View More Talents"** no-op: [Teams.jsx:177-181](frontend/src/pages/Teams.jsx).
- **Fix:** apply `expFilter` in the filter predicate; sort client-side (or add `sort` query param); implement simple pagination (client slice or `?page=`), or remove the controls if not planned.

### A6. Avatar can never be set through the UI
- **Where:** [EditProfile.jsx](frontend/src/pages/EditProfile.jsx) submits `profileImage` but renders no file/URL input, so every avatar stays as the initial-letter fallback.
- **Fix:** add a Cloudinary upload field (the backend already uses Cloudinary + Multer for internships/hackathons — reuse that pattern) or a URL input.

### A7. Notifications don't cover team requests
- **Where:** [Navbar.jsx:13-57](frontend/src/components/Navbar.jsx) derives the red dot only from unread chat. A team leader gets no alert for a join request.
- **Fix:** include pending join-request count (from `getMyTeams`) in the notification indicator.

### A8. Low-impact dead buttons / links (batch cleanup)
- Home "Join" / "View all features" / process link ([Home.jsx:41,65,76](frontend/src/pages/Home.jsx)); Teams hero "Get Started"/"How it works" + `href="#"` footer; Sidebar "Upgrade Plan" ([Sidebar.jsx:81](frontend/src/components/Sidebar.jsx)); Profile "View All" skills link ([Profile.jsx:122](frontend/src/pages/Profile.jsx)); Chat left-nav "All/Unread/Groups" `href="#"`; Register Terms/Privacy `href="#"`.
- **Fix:** give each a real destination/handler, or remove/disable it.
- _Note: the Dashboard "Full Stack Certification" card and the Profile hardcoded Badges block (previously listed here) were **removed** on 2026-07-06._

### A9. Server-side validation & socket-event gaps
- No server validation in [authController.js:5-30](backend/src/controllers/authController.js) `registerUser` (email/password/name) — client-only. Add `express-validator` or manual checks.
- [teamController.js:113](backend/src/controllers/teamController.js) `sendTeamRequest` writes a Message to Mongo but doesn't emit it over the socket, so the leader sees it only after refetch. Emit on send; also emit a confirmation on accept.

---

## Track B — UI / Animation / Effects

The app uses **Tailwind via CDN** (config inline in [public/index.html](frontend/public/index.html), `theme.extend` is empty) and only **two** custom keyframes (`slideIn`, `fadeIn`) scattered as inline `<style>` tags. Animation approach (decided): **add `framer-motion`** for page/list/exit transitions. The frontend is a CRA app (`react-scripts`), so `npm install framer-motion` is a normal runtime dependency — no build-tooling change. The only Tailwind caveat: since Tailwind is CDN-only (no `tailwind.config.js`), any new **CSS keyframes** must be registered in the inline config in `index.html`, not a config file.

### B0. Foundation — fix broken animations & centralize keyframes _(do first, quick)_
- **`animate-scaleUp` is undefined** → modals in [Chat.jsx](frontend/src/pages/Chat.jsx) and [Internships.jsx](frontend/src/pages/Internships.jsx) have **no entrance animation**.
- **`animate-fadeIn` is undefined in [ForgotPassword.jsx](frontend/src/pages/ForgotPassword.jsx)** (keyframe only exists locally in Login.jsx).
- **Fix:** register `fadeIn`, `slideIn`, `scaleUp`, `shimmer`, `stagger` centrally in the Tailwind CDN config (`theme.extend.keyframes` + `theme.extend.animation` in [index.html](frontend/public/index.html)), and remove the inline `<style>` duplicates in Teams/Login. One source of truth every page can use.

### B1. Loading & empty states _(biggest perceived-quality win)_
- **Add a shared `Skeleton` / shimmer component** for card grids ([Hackathons.jsx](frontend/src/pages/Hackathons.jsx), [Teams.jsx](frontend/src/pages/Teams.jsx), [Dashboard.jsx](frontend/src/pages/Dashboard.jsx)) instead of pop-in.
- **Standardize the loader:** Internships/MyApplications/AdminModeration show plain "Loading…" text while others use spinners. Pick one (`<Loader />` or skeletons) app-wide. Add a loading guard to [Profile.jsx](frontend/src/pages/Profile.jsx).
- **Illustrated/animated empty states** with a CTA to replace bare text (Teams "no talents", Dashboard "no teams/requests", Profile "no skills").

### B2. Motion polish
- **List/grid stagger-in:** fade+translate entrance for `.map()` grids ([Dashboard.jsx](frontend/src/pages/Dashboard.jsx), [Hackathons.jsx](frontend/src/pages/Hackathons.jsx), [Teams.jsx](frontend/src/pages/Teams.jsx)) using a staggered `animation-delay`.
- **Page-transition animations:** subtle fade/slide on route change in [App.js](frontend/src/App.js).
- **Animate the Dashboard progress bar** fill on mount (currently static `width:75%`).
- **Count-up stats** on the Hackathons stats bar and TeamCard numbers.
- **Reduce poll flicker:** Dashboard hard-replaces state every 5s ([Dashboard.jsx:42](frontend/src/pages/Dashboard.jsx)); transition or diff to avoid grid re-mount flashes.

### B3. Feedback & consistency
- **Consistent press feedback:** apply `active:scale-95` to all primary buttons (only [TeamCard.jsx:88](frontend/src/components/TeamCard.jsx) has it today).
- **Unify card tokens:** [HackathonCard.jsx](frontend/src/components/HackathonCard.jsx) vs. the inline card in [Hackathons.jsx](frontend/src/pages/Hackathons.jsx) are near-duplicates; TeamCard uses a different radius. Standardize radius/shadow/hover and dedupe to one `HackathonCard`.
- **Theme the toasts** to match the dark-glass aesthetic (custom `react-hot-toast` options in [App.js](frontend/src/App.js)).

### B4. Responsiveness & housekeeping
- **Mobile nav:** [Sidebar.jsx](frontend/src/components/Sidebar.jsx) and [Navbar.jsx](frontend/src/components/Navbar.jsx) links both hide below `lg` with no drawer/hamburger replacement — add a mobile menu.
- **Respect `prefers-reduced-motion`:** add `motion-reduce:` variants as animations land.
- **Remove guard duplication:** [App.js:22-31](frontend/src/App.js) redefines `ProtectedRoute`/`PublicRoute` inline, duplicating (and bypassing `AuthContext`) the components in [components/](frontend/src/components/). Consolidate to one.

---

## Suggested Execution Order

| Phase | Items | Rationale |
|---|---|---|
| **1 — Quick wins** | B0 (fix broken keyframes), A5 (wire filters/sort/pagination), A8 (dead buttons) | Cheap, high visible payoff; removes "does nothing" feel. |
| **2 — Core flows** | A1 (real invite), A2 (reject request), A7 (request notifications), A9 (validation/socket) | Makes the headline "team up" feature actually work end-to-end. |
| **3 — UI depth** | B1 (skeletons/empty states), B2 (stagger/page transitions), B3 (feedback/consistency) | The "cool effects" layer, on top of working flows. |
| **4 — Rounding out** | A3 (build React admin login), A4 (score normalize), A6 (avatar upload), B4 (mobile nav, reduced-motion, guard dedupe) | Larger or decision-dependent items. |

---

## Verification

- **Frontend:** `cd frontend && npm start`, then click through each fixed control:
  - Teams: apply experience filter, send an invite → confirm a team request record is created (not just a DM), dropdown captures the hackathon.
  - Dashboard: Decline a request → it disappears and backend records rejection.
  - Hackathons: change sort + paginate → list reorders/advances.
  - Modals (Chat "new chat", Internship apply): confirm the scale-up entrance now animates.
  - Loading: throttle network in devtools → skeletons show; empty accounts → styled empty states.
- **Backend:** `cd backend && node -c src/app.js` after edits; manually hit new routes (`/team/:id/reject`) with a valid user token.
- **No test suite exists yet** — add lightweight Jest/supertest coverage for the new team-reject and validation logic as a follow-up.

---

## Open Questions (resolve before Phase 4)

1. **Admin access (A3):** **DECIDED (Updated):** Admin login was removed from the student/developer login screen. The Admin portal will be built as a separate website/subdomain entirely.
2. **Learning/certification card & badges:** **DONE (2026-07-06): removed** — deleted the "Full Stack Certification" card from [Dashboard.jsx](frontend/src/pages/Dashboard.jsx) and the hardcoded Badges block from [Profile.jsx](frontend/src/pages/Profile.jsx).
3. **Animation library:** **DECIDED (2026-07-06): add `framer-motion`** for page/list/exit transitions. It installs as a normal npm dependency into the existing CRA build (no tooling change). Use it for the richer B2 transitions (page transitions, list stagger, exit animations); keep simple one-shot entrances (B0) as CSS keyframes registered in the inline Tailwind config in `index.html`.
