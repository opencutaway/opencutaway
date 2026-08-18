# Privacy (A1)

**This document owns** what must never be committed, and the PII scrub procedure.
**It does not own** safety rules that bind the shipped app (`CLAUDE.md`).

Privacy is the first hard-stop for this repository. If privacy conflicts with any other task, privacy wins. Do not commit material and clean it up later.

## What must never be committed

- Legal names of the builder, family members, or children
- Email addresses (including personal GitHub addresses)
- Phone numbers
- Home, work, or school addresses
- GPS coordinates or other precise location
- Account IDs, tokens, API keys, `.env` files, and similar secrets
- Photos of identifiable people, including family photos
- Children’s real names or sibling profile names taken from a real household
- Windows or macOS user-folder paths, machine hostnames, and local account names
- Chat exports or Cursor transcripts that contain personal facts
- Device save dumps from a real household

## Git identity

LICENSE and README identify **Open Cutaway** / **opencutaway authors** only. Do not put a personal name or email on the copyright line.

If you configure git for publishing, use `git config user.name opencutaway` and a GitHub noreply identity in the form GitHub documents for that username. Never invent or commit a real personal email, even as an “example.”

## Local profiles

Multiple on-device sibling profiles are the product model. They are never cloud-shared, never OAuth, never email, never synced.

Real profile JSON belongs only on the device and is gitignored. Sample data in this repo must use clearly fake display names such as `Player A`, `Pat`, or `Jordan`.

## What the cheap lint looks for

The PII gate scans files that git would track (except lockfiles) for:

- Email-like strings
- Windows user-folder path prefixes
- macOS user-folder path prefixes

Documentation in this file deliberately avoids those exact path strings so the lint can stay strict. The scanner encodes the same patterns without writing them as literal committed examples of household paths.

## If you find personal information

1. Stop. Do not commit.
2. Remove the material and rewrite the file.
3. Re-run the PII gate.
4. Only continue when the tree is clean.
