# Test registry

Central machine-readable test metadata for code-quality policy CQP-001.

- `test-registry.json` — keyed by `test_id`; every automated or manual test has the full per-test contract
- `test-taxonomy-ids.json` — every taxonomy category ID, assessed exactly once as applicable (named by a test) or excluded

Do not put personal names in ownership fields. Use `ROLE-*` identifiers.
