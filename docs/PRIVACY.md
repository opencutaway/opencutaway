# Privacy (A1)

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

If you configure git for publishing, use a GitHub noreply identity. Do not write a real address into this repository, even as an “example.”

## Local profiles

Multiple on-device sibling profiles are the product model. They are never cloud-shared, never OAuth, never email, never synced.

Real profile JSON belongs only on the device and is gitignored. Sample data in this repo must use clearly fake display names such as `Player A`, `Pat`, or `Jordan`.

## What the cheap lint looks for

`npm test` scans files that git would track (except lockfiles) for:

- Email-like strings
- Windows user-folder path prefixes
- macOS user-folder path prefixes

Documentation in this file deliberately avoids those exact path strings so the lint can stay strict. The scanner encodes the same patterns without writing them as literal committed examples of household paths.

## If you find personal information

1. Stop. Do not commit.
2. Remove the material and rewrite the file.
3. Re-run `npm test`.
4. Only continue when the tree is clean.
