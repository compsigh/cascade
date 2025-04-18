# Roadmap

## v3

- [ ] Whole-night event, till midnight rather than 90 mins
- [ ] Ladder, similar to Advent of Code, rather than just three
- [ ] Solution is all one related riddle (find a way to make refactoring not a pain in the ass) and should work on previous inputs
- [ ] Private riddle repo just to store the riddles and a protected API server that returns a Markdown string; open-source platform

### Areas of confusion & improvement

- Some people tried to check their emails for a notification
- Some people weren't sure why you had to reload the page to see an invite

## v2

- [x] Remove Stripe
- [x] Markdown rendering
- [ ] Secure Server Actions
- [x] More prominent links & buttons
- [x] Tabulate team data in admin panel
- [ ] One minute cooldown for submitting answers
- [x] Breadcrumbs or some kind of header navigation
- [x] Fun cascading text effect from compsigh web platform
- [x] Add removing of participants entirely, not just from teams
- [x] Remove `part` incrementation/decrementation to match agnosticism

## v1

- [x] Content/details of event
- [x] Styles
- [x] Authentication
- [x] Countdown to event start
- [x] Configurable state of event: Vercel Edge Config
- [x] Conditional rendering of content based on state of event
- [x] Data layer: Vercel Postgres
- [x] Registration: Stripe
- [x] Ability to send, accept, and decline team invites
- [x] Team view
- [x] Outgoing invite list
- [x] Ability to cancel sent invites
- [x] Ability to leave team
- [x] Active invite limits
- [x] Team cap of 4
- [x] Stripe <> database, conditional rendering of event page
- [x] Admin panel with toggleable flags
- [x] Conditionally render UI based on `eventStarted` flag
- [x] Fetching riddle from Notion
- [x] Start/stop timer flags & in-between screens (for breaks throughout the event)
- [x] Leaderboard logic
- [x] UI for riddle, parts, timer
- [x] Riddle output validation
