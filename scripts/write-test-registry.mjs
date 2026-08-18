import { writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

function na(reason) {
  return { status: 'not_applicable', reason }
}

const noWaiver = {
  accountable_owner: na('No waiver; this test is in force.'),
  compensating_controls: na('No waiver; this test is in force.'),
  expiry_date: na('No waiver; this test is in force.'),
  waiver_reason: na('No waiver; this test is in force.')
}

function testRecord(entry) {
  return {
    identity: entry.identity,
    classification: entry.classification,
    cleanup: {
      cleanup_steps: na('No external resources or durable side effects.'),
      cleanup_verification: na('No cleanup required.')
    },
    environment: {
      code_version: '0.0.0',
      dependency_versions: ['See package-lock.json after npm install.'],
      infrastructure_configuration: na(
        'No deployed infrastructure in this conventions slice.'
      ),
      schema_version: '0.1.0'
    },
    exception: noWaiver,
    execution: {
      concurrency: na('Single-process local run.'),
      random_seed: na('No randomness.'),
      repetition_count: 1,
      steps: entry.steps,
      timing_and_timeouts: entry.timing_and_timeouts ?? na('Default vitest timeout.')
    },
    operation: {
      blocks_deployment: true,
      blocks_merge: true,
      blocks_release: true,
      evidence_retained: entry.evidence_retained,
      execution_trigger: entry.execution_trigger,
      failure_owner: 'ROLE-IMPLEMENTER',
      pipeline_stage: entry.pipeline_stage
    },
    oracle: entry.oracle,
    ownership: {
      author: 'ROLE-IMPLEMENTER',
      responsible_owner: entry.responsible_owner ?? 'ROLE-IMPLEMENTER',
      reviewer: 'ROLE-REVIEWER'
    },
    preconditions: {
      configuration: ['Node.js >=22'],
      dependencies: ['npm install'],
      feature_flags: na('No feature flags.'),
      identity_and_permissions: na('No accounts; local files only.'),
      initial_state: entry.initial_state
    },
    quality: {
      independent: true,
      maximum_duration: entry.maximum_duration ?? '30s',
      repeatable: true,
      required_failure_diagnostics: entry.required_failure_diagnostics,
      resource_limits: na('Default local Node process.'),
      self_validating: entry.self_validating
    },
    scope: entry.scope,
    test_data: entry.test_data,
    traceability: {
      control_ids: entry.control_ids ?? [],
      defect_or_incident_ids: [],
      privacy_risk_ids: entry.privacy_risk_ids ?? [],
      requirement_ids: entry.requirement_ids,
      threat_ids: entry.threat_ids ?? []
    }
  }
}

function exclusion(entry) {
  return {
    exclusion_id: entry.exclusion_id,
    category_ids: entry.category_ids,
    reason: entry.reason,
    role_owner: 'ROLE-IMPLEMENTER',
    review_date: '2026-08-18',
    independent_review: {
      reviewer: 'ROLE-REVIEWER',
      status: 'pending',
      evidence_ids: []
    },
    user_approval: {
      status: 'approved',
      evidence_id: 'AX_DOD'
    }
  }
}

const tests = {
  'TEST-BOOTSTRAP-TITLE': testRecord({
    identity: {
      test_id: 'TEST-BOOTSTRAP-TITLE',
      title: 'Title-screen stub names Open Cutaway',
      objective: 'The placeholder shell identifies the game and does not contain lessons.'
    },
    classification: {
      execution_mode: 'automated',
      priority: 'high',
      severity_if_failed: 'high',
      test_layer: 'unit',
      test_types: [
        'TC-FUNCTIONAL-UNIT',
        'TC-FUNCTIONAL-SMOKE',
        'TC-FUNCTIONAL-ACCEPTANCE'
      ]
    },
    steps: ['Run tests/title.test.ts via npm test.'],
    evidence_retained: ['vitest output'],
    execution_trigger: 'npm test',
    pipeline_stage: 'local-verification',
    oracle: {
      expected_failure_mode: na('Passing run expected.'),
      expected_logs_events_and_alerts: na('No telemetry in this product.'),
      expected_outputs: ['GAME_TITLE equals Open Cutaway'],
      expected_state_changes: na('No durable state.'),
      prohibited_side_effects: ['No network calls', 'No lesson catalog'],
      required_invariants: ['Placeholder does not teach a specific object']
    },
    initial_state: 'src/app/title.ts present.',
    required_failure_diagnostics: ['Assertion diff for GAME_TITLE or TITLE_BLURB'],
    self_validating: true,
    scope: {
      component: 'src/app/title.ts',
      exclusions: ['Playable Learn/Challenge lessons'],
      included_behaviour: ['Title string', 'Placeholder blurb'],
      supported_platforms: ['Node.js >=22'],
      supported_versions: ['0.0.0']
    },
    test_data: {
      boundary_values: na('No numeric bounds in the title stub.'),
      classification: 'synthetic',
      generation_method: na('Hard-coded strings in source.'),
      inputs: na('No external inputs.'),
      retention_and_cleanup: na('No retained test data.'),
      source: 'synthetic'
    },
    requirement_ids: ['REQ_NAME', 'REQ_DOD', 'REQ_OBJECTIVE']
  }),
  'TEST-HIT-TARGET': testRecord({
    identity: {
      test_id: 'TEST-HIT-TARGET',
      title: 'Minimum child-facing hit target is 44 CSS pixels',
      objective: 'The placeholder stylesheet keeps child-facing controls at a 44 CSS-pixel minimum.'
    },
    classification: {
      execution_mode: 'automated',
      priority: 'high',
      severity_if_failed: 'high',
      test_layer: 'unit',
      test_types: ['TC-FUNCTIONAL-UNIT', 'TC-BEHAVIOUR-POSITIVE']
    },
    steps: ['Run tests/hit-target.test.ts via npm test.'],
    evidence_retained: ['vitest output'],
    execution_trigger: 'npm test',
    pipeline_stage: 'local-verification',
    oracle: {
      expected_failure_mode: na('Passing run expected.'),
      expected_logs_events_and_alerts: na('No telemetry in this product.'),
      expected_outputs: [
        'src/index.css contains min-height: 44px',
        'src/index.css contains min-width: 44px'
      ],
      expected_state_changes: na('No durable state.'),
      prohibited_side_effects: ['Must not change game behaviour'],
      required_invariants: ['Minimum remains 44 CSS pixels']
    },
    initial_state: 'src/index.css present.',
    required_failure_diagnostics: ['Assertion diff for min-height or min-width 44px'],
    self_validating: true,
    scope: {
      component: 'src/index.css',
      exclusions: ['Playable controls'],
      included_behaviour: ['Stylesheet min-height and min-width of 44px'],
      supported_platforms: ['Node.js >=22'],
      supported_versions: ['0.0.0']
    },
    test_data: {
      boundary_values: ['44'],
      classification: 'synthetic',
      generation_method: na('Hard-coded CSS in source.'),
      inputs: na('No external inputs.'),
      retention_and_cleanup: na('No retained test data.'),
      source: 'synthetic'
    },
    requirement_ids: ['REQ_DOD']
  }),
  'TEST-SCHEMA-EXAMPLES': testRecord({
    identity: {
      test_id: 'TEST-SCHEMA-EXAMPLES',
      title: 'Committed examples match JSON Schema',
      objective: 'Placeholder content files are valid instances of the published schemas.'
    },
    classification: {
      execution_mode: 'automated',
      priority: 'high',
      severity_if_failed: 'high',
      test_layer: 'contract',
      test_types: [
        'TC-FUNCTIONAL-CONTRACT',
        'TC-FUNCTIONAL-COMPONENT',
        'TC-FUNCTIONAL-INTEGRATION',
        'TC-BEHAVIOUR-POSITIVE'
      ]
    },
    steps: ['Run tests/schema-examples.test.ts committed-example cases via npm test.'],
    evidence_retained: ['vitest output'],
    execution_trigger: 'npm test',
    pipeline_stage: 'local-verification',
    oracle: {
      expected_failure_mode: na('Passing run expected.'),
      expected_logs_events_and_alerts: na('No telemetry in this product.'),
      expected_outputs: ['Ajv compile/validate returns true for each example'],
      expected_state_changes: na('No durable state.'),
      prohibited_side_effects: ['Examples must not enable cloudSync'],
      required_invariants: ['Sample profile display names are fake']
    },
    initial_state: 'schema/ and content/examples/ present.',
    required_failure_diagnostics: ['Ajv errors for the failing example'],
    self_validating: true,
    scope: {
      component: 'schema/ and content/examples/',
      exclusions: ['Filled object catalog'],
      included_behaviour: [
        'Object card example',
        'System chain example',
        'Local profile example'
      ],
      supported_platforms: ['Node.js >=22'],
      supported_versions: ['schemaVersion 0.1.0']
    },
    test_data: {
      boundary_values: na('Positive examples only in this test_id.'),
      classification: 'synthetic',
      generation_method: 'Hand-authored placeholder JSON.',
      inputs: [
        'content/examples/object-card.example.json',
        'content/examples/system-chain.example.json',
        'content/examples/local-profile.example.json'
      ],
      retention_and_cleanup: 'Examples remain in git as fixtures.',
      source: 'synthetic'
    },
    requirement_ids: ['REQ_DOD', 'REQ_PEDAGOGY', 'REQ_ETHOS']
  }),
  'TEST-SCHEMA-INVALID': testRecord({
    identity: {
      test_id: 'TEST-SCHEMA-INVALID',
      title: 'Schemas reject invalid instances',
      objective: 'Unsafe, cloud-synced, incomplete, or extra-field instances fail validation.'
    },
    classification: {
      execution_mode: 'automated',
      priority: 'high',
      severity_if_failed: 'high',
      test_layer: 'contract',
      test_types: [
        'TC-BEHAVIOUR-NEGATIVE',
        'TC-BEHAVIOUR-BOUNDARY',
        'TC-BEHAVIOUR-ERROR-PATH',
        'TC-SECURITY-INJECTION-PARSER'
      ]
    },
    steps: ['Run tests/schema-examples.test.ts invalid-instance cases via npm test.'],
    evidence_retained: ['vitest output'],
    execution_trigger: 'npm test',
    pipeline_stage: 'local-verification',
    oracle: {
      expected_failure_mode: 'Ajv validate returns false.',
      expected_logs_events_and_alerts: na('No telemetry in this product.'),
      expected_outputs: ['False for each invalid instance'],
      expected_state_changes: na('No durable state.'),
      prohibited_side_effects: ['Must not write files'],
      required_invariants: ['approachLiveGear cannot be anything but never']
    },
    initial_state: 'JSON Schema files present.',
    required_failure_diagnostics: ['Which invalid instance unexpectedly passed'],
    self_validating: true,
    scope: {
      component: 'schema/',
      exclusions: ['Custom runtime parsers'],
      included_behaviour: [
        'Missing required fields',
        'Empty displayName',
        'cloudSync true',
        'Additional properties'
      ],
      supported_platforms: ['Node.js >=22'],
      supported_versions: ['schemaVersion 0.1.0']
    },
    test_data: {
      boundary_values: ['empty displayName', 'chain with one step'],
      classification: 'synthetic',
      generation_method: 'In-memory invalid objects in the test file.',
      inputs: ['Invalid object-card, chain, and profile objects'],
      retention_and_cleanup: na('In-memory only.'),
      source: 'synthetic'
    },
    requirement_ids: ['REQ_DOD', 'REQ_ETHOS'],
    threat_ids: ['THREAT-CLOUD-SYNC', 'THREAT-UNSAFE-APPROACH']
  }),
  'TEST-CLIENT-HARD-STOPS': testRecord({
    identity: {
      test_id: 'TEST-CLIENT-HARD-STOPS',
      title: 'src/ contains no forbidden client APIs or SDKs',
      objective: 'Fail the suite if the child-facing tree mentions banned capabilities.'
    },
    classification: {
      execution_mode: 'automated',
      priority: 'critical',
      severity_if_failed: 'critical',
      test_layer: 'static',
      test_types: [
        'TC-BEHAVIOUR-INVARIANT',
        'TC-SECURITY-CONFIGURATION',
        'TC-PRIVACY-LOGGING-ANALYTICS',
        'TC-PRIVACY-PURPOSE-LIMITATION',
        'TC-STATIC-SECURITY-ANALYSIS',
        'TC-STATIC-LINTING',
        'TC-FUNCTIONAL-REGRESSION'
      ]
    },
    steps: [
      'Run tests/client-gates.test.ts via npm test.',
      'Run node scripts/scan-client-gates.mjs.'
    ],
    evidence_retained: ['vitest output', 'scan-client-gates stderr on failure'],
    execution_trigger: 'npm test',
    pipeline_stage: 'local-verification',
    oracle: {
      expected_failure_mode: 'Non-empty findings list.',
      expected_logs_events_and_alerts: na('No telemetry in this product.'),
      expected_outputs: ['Empty findings for src/'],
      expected_state_changes: na('No durable state.'),
      prohibited_side_effects: [
        'geolocation',
        'getUserMedia',
        'gtag',
        'Sentry',
        'openai',
        'langgraph'
      ],
      required_invariants: ['Child client stays offline and model-free']
    },
    initial_state: 'src/ tree present.',
    required_failure_diagnostics: ['File path and matched token'],
    self_validating: true,
    responsible_owner: 'ROLE-PRIVACY-OWNER',
    scope: {
      component: 'src/',
      exclusions: ['docs and agent rules, which may name banned APIs'],
      included_behaviour: ['Token scan of client source'],
      supported_platforms: ['Node.js >=22'],
      supported_versions: ['0.0.0']
    },
    test_data: {
      boundary_values: na('Token presence is boolean.'),
      classification: 'synthetic',
      generation_method: 'Constructed token string plus live src/ tree.',
      inputs: ['src/** client sources'],
      retention_and_cleanup: na('No extra data stored.'),
      source: 'synthetic'
    },
    requirement_ids: ['REQ_ETHOS', 'REQ_PRIVACY_A1', 'REQ_GRAPH'],
    privacy_risk_ids: ['PRIV-ANALYTICS', 'PRIV-CAMERA', 'PRIV-LOCATION'],
    threat_ids: ['THREAT-TELEMETRY', 'THREAT-LLM-IN-CLIENT']
  }),
  'TEST-PII-SCRUB': testRecord({
    identity: {
      test_id: 'TEST-PII-SCRUB',
      title: 'Tracked files contain no email or user-folder path markers',
      objective: 'Cheap A1 lint over files git would track, excluding lockfiles.'
    },
    classification: {
      execution_mode: 'automated',
      priority: 'critical',
      severity_if_failed: 'critical',
      test_layer: 'static',
      test_types: [
        'TC-PRIVACY-DATA-MINIMIZATION',
        'TC-PRIVACY-TEST-DATA',
        'TC-PRIVACY-DATA-INVENTORY-LIFECYCLE',
        'TC-SECURITY-SECRETS-EXPOSURE',
        'TC-STATIC-SECRET-SCANNING',
        'TC-STATIC-PRIVACY-REVIEW'
      ]
    },
    steps: [
      'Run tests/pii-scan.test.ts via npm test.',
      'Run node scripts/scan-pii.mjs.'
    ],
    evidence_retained: ['vitest output', 'scan-pii stderr on failure'],
    execution_trigger: 'npm test',
    pipeline_stage: 'local-verification',
    oracle: {
      expected_failure_mode: 'Non-empty findings list.',
      expected_logs_events_and_alerts: na('No telemetry in this product.'),
      expected_outputs: ['Empty findings for scannable tracked files'],
      expected_state_changes: na('No durable state.'),
      prohibited_side_effects: ['Email-like strings', 'User-folder path prefixes'],
      required_invariants: ['Sample profiles use fake display names only']
    },
    initial_state: 'Git working tree with ignore rules applied.',
    required_failure_diagnostics: ['Relative path and finding kind'],
    self_validating: true,
    responsible_owner: 'ROLE-PRIVACY-OWNER',
    scope: {
      component: 'git-tracked working tree',
      exclusions: ['package-lock.json and other lockfiles'],
      included_behaviour: ['Email regex', 'Windows user-folder prefix', 'macOS user-folder prefix'],
      supported_platforms: ['Node.js >=22 with git'],
      supported_versions: ['0.0.0']
    },
    test_data: {
      boundary_values: na('Marker presence is boolean.'),
      classification: 'synthetic',
      generation_method: 'Runtime-constructed strings; live tree scan.',
      inputs: ['git ls-files -co --exclude-standard'],
      retention_and_cleanup: na('No extra data stored.'),
      source: 'synthetic'
    },
    requirement_ids: ['REQ_PRIVACY_A1'],
    privacy_risk_ids: ['PRIV-PII-IN-GIT']
  }),
  'TEST-FORBIDDEN-DEPENDENCIES': testRecord({
    identity: {
      test_id: 'TEST-FORBIDDEN-DEPENDENCIES',
      title: 'package.json does not declare banned client or cloud SDKs',
      objective: 'Keep Next.js, auth, analytics, LLM, and similar packages out of this app.'
    },
    classification: {
      execution_mode: 'automated',
      priority: 'critical',
      severity_if_failed: 'critical',
      test_layer: 'static',
      test_types: ['TC-SECURITY-SUPPLY-CHAIN', 'TC-STATIC-DEPENDENCY-SCANNING']
    },
    steps: ['Run tests/forbidden-dependencies.test.ts via npm test.'],
    evidence_retained: ['vitest output'],
    execution_trigger: 'npm test',
    pipeline_stage: 'local-verification',
    oracle: {
      expected_failure_mode: 'findForbiddenDependencies returns a non-empty list.',
      expected_logs_events_and_alerts: na('No telemetry in this product.'),
      expected_outputs: ['Empty forbidden-name list for committed package.json'],
      expected_state_changes: na('No durable state.'),
      prohibited_side_effects: ['Declaring openai, langgraph, next, firebase, or similar'],
      required_invariants: ['Direct dependencies stay Preact/Vite/test tooling']
    },
    initial_state: 'package.json present.',
    required_failure_diagnostics: ['Forbidden package name'],
    self_validating: true,
    scope: {
      component: 'package.json',
      exclusions: ['Transitive dependency CVE scanning (deferred)'],
      included_behaviour: ['Direct dependency name denylist'],
      supported_platforms: ['Node.js >=22'],
      supported_versions: ['0.0.0']
    },
    test_data: {
      boundary_values: na('Name match is boolean.'),
      classification: 'synthetic',
      generation_method: 'Hand-authored denylist plus committed package.json.',
      inputs: ['package.json'],
      retention_and_cleanup: na('No extra data stored.'),
      source: 'synthetic'
    },
    requirement_ids: ['REQ_ETHOS', 'REQ_CODE_QUALITY'],
    threat_ids: ['THREAT-LLM-IN-CLIENT', 'THREAT-TELEMETRY']
  }),
  'TEST-WORKFLOW-GRAPH': testRecord({
    identity: {
      test_id: 'TEST-WORKFLOW-GRAPH',
      title: 'Content-authoring graph is a valid build-time workflow',
      objective: 'The example graph names nodes, file handoffs, a cycle cap, and a kid-facing human gate.'
    },
    classification: {
      execution_mode: 'automated',
      priority: 'high',
      severity_if_failed: 'high',
      test_layer: 'contract',
      test_types: ['TC-BEHAVIOUR-STATE-TRANSITION', 'TC-FUNCTIONAL-CONTRACT']
    },
    steps: ['Run tests/workflow-graph.test.ts via npm test.'],
    evidence_retained: ['vitest output'],
    execution_trigger: 'npm test',
    pipeline_stage: 'local-verification',
    oracle: {
      expected_failure_mode: na('Passing run expected.'),
      expected_logs_events_and_alerts: na('No telemetry in this product.'),
      expected_outputs: [
        'Ajv accepts the YAML graph',
        'kid-facing-copy-gate is a human gate'
      ],
      expected_state_changes: na('No durable state.'),
      prohibited_side_effects: ['unattendedChildCopyLoops must stay false'],
      required_invariants: ['locus is build-time', 'cycleCap <= 3']
    },
    initial_state: 'workflows/content-authoring.example.yaml present.',
    required_failure_diagnostics: ['Ajv errors or missing gate node'],
    self_validating: true,
    scope: {
      component: 'workflows/content-authoring.example.yaml',
      exclusions: ['Executable LangGraph runner'],
      included_behaviour: ['Schema validation', 'Human-gate presence', 'Edge handoffs'],
      supported_platforms: ['Node.js >=22'],
      supported_versions: ['schemaVersion 0.1.0']
    },
    test_data: {
      boundary_values: ['cycleCap maximum 3'],
      classification: 'synthetic',
      generation_method: 'Committed YAML example.',
      inputs: ['workflows/content-authoring.example.yaml'],
      retention_and_cleanup: 'Example remains in git.',
      source: 'synthetic'
    },
    requirement_ids: ['REQ_GRAPH', 'REQ_PROCESS']
  }),
  'TEST-REGISTRY-COVERAGE': testRecord({
    identity: {
      test_id: 'TEST-REGISTRY-COVERAGE',
      title: 'Every taxonomy category is assessed',
      objective: 'The central registry names a test or an exclusion for each CQP-001 category.'
    },
    classification: {
      execution_mode: 'automated',
      priority: 'high',
      severity_if_failed: 'medium',
      test_layer: 'contract',
      test_types: ['TC-FUNCTIONAL-CONTRACT']
    },
    steps: ['Run tests/registry-coverage.test.ts via npm test.'],
    evidence_retained: ['vitest output'],
    execution_trigger: 'npm test',
    pipeline_stage: 'local-verification',
    oracle: {
      expected_failure_mode: 'Missing or dual-assessed category IDs.',
      expected_logs_events_and_alerts: na('No telemetry in this product.'),
      expected_outputs: ['Empty missing and extra category lists'],
      expected_state_changes: na('No durable state.'),
      prohibited_side_effects: ['A category must not be both applicable and excluded'],
      required_invariants: ['Every test has all contract groups']
    },
    initial_state: 'tests/registry files present.',
    required_failure_diagnostics: ['Missing, extra, or dual-assessed category IDs'],
    self_validating: true,
    scope: {
      component: 'tests/registry.json',
      exclusions: ['Runtime product behaviour'],
      included_behaviour: ['Taxonomy coverage', 'Contract group presence'],
      supported_platforms: ['Node.js >=22'],
      supported_versions: ['CQP-001 1.0.0-beta.3']
    },
    test_data: {
      boundary_values: na('Set coverage, not numeric bounds.'),
      classification: 'synthetic',
      generation_method: 'Committed taxonomy list and registry JSON.',
      inputs: [
        'tests/registry/test-taxonomy-ids.json',
        'tests/registry.json'
      ],
      retention_and_cleanup: 'Registry remains in git.',
      source: 'synthetic'
    },
    requirement_ids: ['REQ_CODE_QUALITY']
  }),
  'TEST-BUILD': testRecord({
    identity: {
      test_id: 'TEST-BUILD',
      title: 'Typecheck and Vite production build succeed',
      objective: 'tsc --noEmit and vite build complete for the placeholder app.'
    },
    classification: {
      execution_mode: 'automated',
      priority: 'high',
      severity_if_failed: 'high',
      test_layer: 'build',
      test_types: ['TC-STATIC-COMPILE-TYPE', 'TC-OPERATIONS-COMPATIBILITY']
    },
    steps: ['Run npm run build.'],
    timing_and_timeouts: 'Complete within 2 minutes on a developer machine.',
    evidence_retained: ['tsc and vite build logs'],
    execution_trigger: 'npm run build',
    pipeline_stage: 'local-verification',
    oracle: {
      expected_failure_mode: 'Non-zero exit from tsc or vite.',
      expected_logs_events_and_alerts: na('No telemetry in this product.'),
      expected_outputs: ['dist/ bundle produced', 'exit code 0'],
      expected_state_changes: ['dist/ written locally and gitignored'],
      prohibited_side_effects: ['Must not contact model APIs'],
      required_invariants: ['Build uses Preact and Vite only']
    },
    initial_state: 'Dependencies installed.',
    maximum_duration: '2m',
    required_failure_diagnostics: ['tsc or vite error text'],
    self_validating: true,
    scope: {
      component: 'src/ plus Vite config',
      exclusions: ['Playable lesson bundles'],
      included_behaviour: ['Typecheck', 'Production bundle'],
      supported_platforms: ['Node.js >=22'],
      supported_versions: ['0.0.0']
    },
    test_data: {
      boundary_values: na('Build success is boolean.'),
      classification: 'synthetic',
      generation_method: na('No extra fixtures.'),
      inputs: na('Source tree only.'),
      retention_and_cleanup: 'dist/ is gitignored.',
      source: 'synthetic'
    },
    requirement_ids: ['REQ_DOD', 'REQ_ENV']
  }),
  'TEST-SCHEMA-INVENTORY': testRecord({
    identity: {
      test_id: 'TEST-SCHEMA-INVENTORY',
      title: 'Ajv compiles every schema and enforces the title UI contract',
      objective:
        'JSON Schema is the authority path: every committed schema compiles, the title contract is valid, and illegal variants fail.'
    },
    classification: {
      execution_mode: 'automated',
      priority: 'high',
      severity_if_failed: 'high',
      test_layer: 'contract',
      test_types: [
        'TC-FUNCTIONAL-CONTRACT',
        'TC-BEHAVIOUR-NEGATIVE',
        'TC-BEHAVIOUR-INVARIANT'
      ]
    },
    steps: ['Run tests/schema-inventory.test.ts via npm test.'],
    evidence_retained: ['vitest output'],
    execution_trigger: 'npm test',
    pipeline_stage: 'local-verification',
    oracle: {
      expected_failure_mode: na('Passing run expected.'),
      expected_logs_events_and_alerts: na('No telemetry in this product.'),
      expected_outputs: [
        'Five schema paths listed',
        'Title contract Ajv true',
        'lessonsShipped true is Ajv false'
      ],
      expected_state_changes: na('No durable state.'),
      prohibited_side_effects: ['Must not change game behaviour'],
      required_invariants: ['Player-facing JSON is Ajv-validated']
    },
    initial_state: 'schema/ and content/ui/title-screen.json present.',
    required_failure_diagnostics: ['Ajv errors or schema path list mismatch'],
    self_validating: true,
    scope: {
      component: 'schema/ plus content/ui/',
      exclusions: ['Playable lesson catalog JSON'],
      included_behaviour: ['Schema compile', 'Title UI contract'],
      supported_platforms: ['Node.js >=22'],
      supported_versions: ['0.0.0']
    },
    test_data: {
      boundary_values: ['lessonsShipped false vs true'],
      classification: 'synthetic',
      generation_method: 'Committed JSON fixtures.',
      inputs: ['schema/*.schema.json', 'content/ui/title-screen.json'],
      retention_and_cleanup: na('No retained test data.'),
      source: 'synthetic'
    },
    requirement_ids: ['REQ_DOD', 'REQ_CODE_QUALITY']
  }),
  'TEST-E2E-TITLE': testRecord({
    identity: {
      test_id: 'TEST-E2E-TITLE',
      title: 'Playwright covers title-screen teaching, interaction, and regression',
      objective:
        'A child and grown-up opening the app see the name Open Cutaway, can reach the heading, and do not see a leaked lesson.'
    },
    classification: {
      execution_mode: 'automated',
      priority: 'high',
      severity_if_failed: 'high',
      test_layer: 'end-to-end',
      test_types: [
        'TC-FUNCTIONAL-END-TO-END',
        'TC-FUNCTIONAL-SYSTEM',
        'TC-FUNCTIONAL-ACCEPTANCE'
      ]
    },
    steps: ['Run e2e/specs/title.spec.ts via npm run test:e2e after a production build.'],
    evidence_retained: ['Playwright list reporter output'],
    execution_trigger: 'npm run gauntlet',
    pipeline_stage: 'gauntlet',
    timing_and_timeouts: 'Playwright 30s test timeout; 5s expect timeout.',
    maximum_duration: '2m',
    oracle: {
      expected_failure_mode: na('Passing run expected.'),
      expected_logs_events_and_alerts: na('No telemetry in this product.'),
      expected_outputs: [
        'Heading Open Cutaway visible',
        'Lessons are not in this build yet visible',
        'No Learn heading'
      ],
      expected_state_changes: na('No durable state.'),
      prohibited_side_effects: ['Must not call network APIs from the child app'],
      required_invariants: ['Title stub is the only shipped screen']
    },
    initial_state: 'Dependencies and Chromium installed; dist/ present for preview.',
    required_failure_diagnostics: ['Playwright trace on retry; screenshot on failure'],
    self_validating: true,
    scope: {
      component: 'e2e/specs/title.spec.ts',
      exclusions: ['Playable Learn/Challenge lessons'],
      included_behaviour: ['Teaching', 'Interaction', 'Regression'],
      supported_platforms: ['Chromium desktop and Pixel 5 viewport'],
      supported_versions: ['0.0.0']
    },
    test_data: {
      boundary_values: na('Copy literals only.'),
      classification: 'synthetic',
      generation_method: na('Page object plus fixture.'),
      inputs: ['Production preview of the title stub'],
      retention_and_cleanup: 'playwright-report/ and test-results/ are gitignored.',
      source: 'synthetic'
    },
    requirement_ids: ['REQ_NAME', 'REQ_DOD', 'REQ_AGE_COPLAY']
  }),
  'TEST-E2E-STUB-MODES': testRecord({
    identity: {
      test_id: 'TEST-E2E-STUB-MODES',
      title: 'Playwright keeps Learn, Challenge, and Life list unshipped',
      objective:
        'The title stub does not grow extra mode buttons or headings before those features exist.'
    },
    classification: {
      execution_mode: 'automated',
      priority: 'high',
      severity_if_failed: 'high',
      test_layer: 'end-to-end',
      test_types: ['TC-FUNCTIONAL-REGRESSION', 'TC-BEHAVIOUR-NEGATIVE']
    },
    steps: ['Run e2e/specs/modes-not-shipped.spec.ts via npm run test:e2e.'],
    evidence_retained: ['Playwright list reporter output'],
    execution_trigger: 'npm run gauntlet',
    pipeline_stage: 'gauntlet',
    timing_and_timeouts: 'Playwright 30s test timeout; 5s expect timeout.',
    maximum_duration: '2m',
    oracle: {
      expected_failure_mode: na('Passing run expected.'),
      expected_logs_events_and_alerts: na('No telemetry in this product.'),
      expected_outputs: ['Zero buttons', 'Zero links', 'No Learn/Challenge/Life list headings'],
      expected_state_changes: na('No durable state.'),
      prohibited_side_effects: ['Must not change game behaviour'],
      required_invariants: ['Stub modes stay unshipped']
    },
    initial_state: 'Dependencies and Chromium installed.',
    required_failure_diagnostics: ['Playwright screenshot on failure'],
    self_validating: true,
    scope: {
      component: 'e2e/specs/modes-not-shipped.spec.ts',
      exclusions: ['Future mode implementation'],
      included_behaviour: ['Absence of unshipped modes'],
      supported_platforms: ['Chromium desktop and Pixel 5 viewport'],
      supported_versions: ['0.0.0']
    },
    test_data: {
      boundary_values: na('Count of zero controls.'),
      classification: 'synthetic',
      generation_method: na('Page object plus fixture.'),
      inputs: ['Title stub'],
      retention_and_cleanup: 'playwright-report/ and test-results/ are gitignored.',
      source: 'synthetic'
    },
    requirement_ids: ['REQ_DOD']
  }),
  'TEST-INDEPENDENT-REVIEW': testRecord({
    identity: {
      test_id: 'TEST-INDEPENDENT-REVIEW',
      title: 'Independent review of the bootstrap revision',
      objective:
        'A reviewer who did not implement the slice checks licensing, PII, telemetry, and no LLM-in-client.'
    },
    classification: {
      execution_mode: 'manual',
      priority: 'critical',
      severity_if_failed: 'critical',
      test_layer: 'review',
      test_types: [
        'TC-STATIC-MANUAL-CODE-REVIEW',
        'TC-STATIC-THREAT-MODEL-REVIEW',
        'TC-SECURITY-PENETRATION'
      ]
    },
    steps: [
      'Assign ROLE-REVIEWER who did not implement the revision.',
      'Provide requirements, revision identifier, diff, and test results.',
      'Review LICENSE, telemetry/PII grep, client hard-stops, and collaboration records.',
      'Record findings under docs/reviews/ using role IDs only.',
      'Return findings to ROLE-IMPLEMENTER; the same reviewer verifies corrections.'
    ],
    timing_and_timeouts: na('Human review; no automated timeout.'),
    evidence_retained: ['docs/reviews/ record', 'diff identifier'],
    execution_trigger: 'Each integrated revision',
    pipeline_stage: 'independent-review',
    oracle: {
      expected_failure_mode: 'Open finding not corrected or accepted.',
      expected_logs_events_and_alerts: na('No telemetry in this product.'),
      expected_outputs: ['Review record with pass or listed findings'],
      expected_state_changes: ['Corrections in the working tree when findings exist'],
      prohibited_side_effects: ['Reviewer must not implement the revision under review'],
      required_invariants: ['Integration blocked until findings are closed']
    },
    initial_state: 'Implementation complete and npm test plus npm run build recorded.',
    maximum_duration: na('Human review.'),
    required_failure_diagnostics: ['Finding text, evidence, affected files, revision id'],
    self_validating: false,
    responsible_owner: 'ROLE-REVIEWER',
    scope: {
      component: 'integrated bootstrap revision',
      exclusions: ['Playable lesson content, which must not exist yet'],
      included_behaviour: [
        'PII scrub',
        'MIT license holder check',
        'Forbidden client tokens',
        'Workflow locus'
      ],
      supported_platforms: ['This repository'],
      supported_versions: ['0.0.0']
    },
    test_data: {
      boundary_values: na('Review of the full diff.'),
      classification: 'synthetic',
      generation_method: 'Working-tree diff of the bootstrap.',
      inputs: ['Changed files', 'npm test output', 'npm run build output'],
      retention_and_cleanup: 'Review markdown retained in docs/reviews/.',
      source: 'synthetic'
    },
    requirement_ids: [
      'REQ_AGENT_COLLABORATION',
      'REQ_PRIVACY_A1',
      'REQ_ETHOS',
      'REQ_PROCESS'
    ]
  })
}

const exclusions = {
  'EXCL-NO-FUZZ-MUTATION': exclusion({
    exclusion_id: 'EXCL-NO-FUZZ-MUTATION',
    category_ids: [
      'TC-BEHAVIOUR-FUZZ',
      'TC-BEHAVIOUR-MUTATION',
      'TC-BEHAVIOUR-PROPERTY-BASED'
    ],
    reason:
      'There is no custom parser or generative suite yet. Structural rejection is covered by JSON Schema negative tests.'
  }),
  'EXCL-NO-DISTRIBUTED-RUNTIME': exclusion({
    exclusion_id: 'EXCL-NO-DISTRIBUTED-RUNTIME',
    category_ids: [
      'TC-CONCURRENCY',
      'TC-CONCURRENCY-IDEMPOTENCY',
      'TC-CONCURRENCY-ORDERING-DUPLICATION',
      'TC-CONCURRENCY-PARTITION-CONSISTENCY',
      'TC-CONCURRENCY-RACE-CONDITION'
    ],
    reason:
      'The shipped client is an offline single-device placeholder with no server, queue, or replicated state.'
  }),
  'EXCL-NO-PRODUCT-PERSISTENCE': exclusion({
    exclusion_id: 'EXCL-NO-PRODUCT-PERSISTENCE',
    category_ids: [
      'TC-DATA-BACKUP-RESTORE',
      'TC-DATA-CORRUPTION',
      'TC-DATA-MIGRATION',
      'TC-DATA-MIGRATION-ROLLBACK',
      'TC-DATA-PERSISTENCE'
    ],
    reason:
      'Local profile runtime is not implemented. Device saves are gitignored and out of scope for this slice.'
  }),
  'EXCL-NO-OPERATIONS-LOAD': exclusion({
    exclusion_id: 'EXCL-NO-OPERATIONS-LOAD',
    category_ids: [
      'TC-OPERATIONS-DEPLOYMENT',
      'TC-OPERATIONS-FAULT-INJECTION',
      'TC-OPERATIONS-LOAD',
      'TC-OPERATIONS-PERFORMANCE',
      'TC-OPERATIONS-RECOVERY',
      'TC-OPERATIONS-RESOURCE-LIMIT',
      'TC-OPERATIONS-SOAK',
      'TC-OPERATIONS-STRESS'
    ],
    reason:
      'No hosted deployment, load profile, or fault-injection harness exists for a title-screen stub.'
  }),
  'EXCL-NO-PERSONAL-DATA-PROCESSING': exclusion({
    exclusion_id: 'EXCL-NO-PERSONAL-DATA-PROCESSING',
    category_ids: [
      'TC-PRIVACY-ACCESS-CORRECTION-EXPORT',
      'TC-PRIVACY-CONSENT-DEFAULTS',
      'TC-PRIVACY-DE-IDENTIFICATION',
      'TC-PRIVACY-DELETION',
      'TC-PRIVACY-RETENTION'
    ],
    reason:
      'This slice does not collect personal data, so export, consent, deletion, de-identification, and retention jobs do not exist. Remaining privacy categories are covered by PII and analytics gates.'
  }),
  'EXCL-NO-ACCOUNT-SECURITY-SURFACE': exclusion({
    exclusion_id: 'EXCL-NO-ACCOUNT-SECURITY-SURFACE',
    category_ids: [
      'TC-SECURITY-AUDIT-DETECTION',
      'TC-SECURITY-AUTHENTICATION',
      'TC-SECURITY-AUTHORIZATION',
      'TC-SECURITY-BUSINESS-LOGIC-ABUSE',
      'TC-SECURITY-CRYPTOGRAPHY',
      'TC-SECURITY-SESSION-MANAGEMENT',
      'TC-SECURITY-TENANT-ISOLATION'
    ],
    reason:
      'No accounts, sessions, tenants, crypto protocol, or playable economy exist in this slice.'
  }),
  'EXCL-NO-CLOUD-INFRA-CONFIG': exclusion({
    exclusion_id: 'EXCL-NO-CLOUD-INFRA-CONFIG',
    category_ids: ['TC-STATIC-CONFIGURATION-SCANNING'],
    reason:
      'This repository has no cloud, container, or network infrastructure manifests to scan.'
  })
}

const registry = {
  policy_id: 'CQP-001',
  policy_version: '1.0.0-beta.3',
  tests,
  exclusions
}

writeFileSync(
  path.join(repoRoot, 'tests/registry.json'),
  `${JSON.stringify(registry, null, 2)}\n`,
  'utf8'
)
