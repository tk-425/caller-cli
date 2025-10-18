---
name: code-review
description: This skill should be used when conducting comprehensive code reviews and codebase audits. Invoke when the user requests to review code quality, security vulnerabilities, performance issues, or best practices across entire codebases, directories, or specific files. Typical requests include "Review the codebase in ./src", "Audit this project for security issues", or "Review all Python files for quality".
---

# Code Review

## Overview

Conduct comprehensive code reviews and codebase audits covering security, performance, code quality, best practices, testing, and documentation. Use this skill to systematically analyze codebases and provide actionable feedback with severity-categorized findings.

## Workflow

### 1. Understand the Scope

First, clarify the review scope with the user:

- **Target:** Which files/directories to review?
- **Language/Framework:** What languages are used?
- **Focus Areas:** All categories or specific ones (security, performance, etc.)?
- **Output Format:** Markdown (default), HTML, or JSON report?

If the user provides a general request like "Review this codebase", default to reviewing all code files in the current directory, covering all review categories.

### 2. Discover the Codebase

Use appropriate tools to identify files to review:

```bash
# Find all source code files
Glob: "**/*.py"  # For Python
Glob: "**/*.js"  # For JavaScript
Glob: "**/*.{ts,tsx}"  # For TypeScript/React
Glob: "**/*.go"  # For Go
Glob: "**/*.java"  # For Java
Glob: "**/*.swift"  # For Swift
```

Prioritize files in common source directories (`src/`, `lib/`, `app/`, etc.) and exclude:
- `node_modules/`, `venv/`, `.git/`
- Build artifacts (`dist/`, `build/`, `target/`, `DerivedData/`)
- Lock files and dependencies
- Test fixtures (review test code separately if requested)

### 3. Load Review Guidelines

Reference the comprehensive checklist for review criteria:

```
Read: references/review-checklist.md
```

This checklist covers:
- **Security:** Authentication, input validation, data protection, vulnerabilities, dependencies
- **Performance:** Algorithms, database queries, caching, resource management, concurrency
- **Code Quality:** Readability, maintainability, error handling, testing
- **Best Practices:** Language-specific idioms and patterns
- **Documentation:** Comments, README, API docs
- **Architecture:** System design, API design, database design
- **DevOps:** Deployment, monitoring, infrastructure
- **Compliance:** Privacy, accessibility, licensing

Apply checklist items relevant to the codebase language and architecture.

### 4. Conduct Systematic Review

For each file in scope:

1. **Read the file** completely to understand context
2. **Apply checklist** items systematically:
   - Security vulnerabilities
   - Performance issues
   - Code quality problems
   - Best practice violations
   - Documentation gaps
3. **Identify patterns** across files (duplicated issues)
4. **Note positives** alongside issues (what's done well)

**Review Strategy:**
- Start with critical files (authentication, authorization, data access)
- Look for high-severity issues first (security, data corruption)
- Batch similar findings to avoid repetition
- Consider the codebase maturity and context

### 5. Categorize Findings by Severity

For each finding, assign a severity level using the guidelines:

```
Read: references/severity-levels.md
```

**Severity Levels:**
- **CRITICAL:** Immediate security risks, data loss, system failure
- **HIGH:** Significant security/functionality impact with some mitigation
- **MEDIUM:** Code quality, maintainability, moderate impact issues
- **LOW:** Minor quality issues, style inconsistencies
- **INFO:** Observations, suggestions, best practice notes

When determining severity, consider:
- **Impact:** User reach, data sensitivity, scope
- **Exploitability:** Ease of exploitation, access requirements
- **Likelihood:** Frequency of code path execution
- **Context:** Production vs. experimental, regulatory requirements

### 6. Format Findings

Structure each finding using this format:

```
**[SEVERITY]** Title of Finding

**Location:** file_path:line_number

**Description:** Brief description of the issue

**Impact:** What could happen if not fixed

**Recommendation:** Specific steps to remediate

**References:** [Optional] Links to documentation, CVEs, best practices
```

**Example:**

```
**[HIGH]** Missing Input Validation in API Endpoint

**Location:** api/users.py:34

**Description:** User input from request parameter 'email' is used without validation before database query.

**Impact:** Attacker could inject malicious payloads, potentially leading to data exposure or manipulation.

**Recommendation:** Add input validation using a library like `validators`:
- Validate email format
- Sanitize input before use
- Use parameterized queries (already done, but validation still needed)

**References:** https://owasp.org/www-community/controls/Input_Validation
```

### 7. Generate Report

After completing the review, organize findings and generate a report.

**Option A: Manual Report (Default)**

Present findings directly to the user in markdown format:
1. Summary section with severity counts
2. Findings organized by severity (most severe first)
3. Each finding formatted as shown above

**Option B: Automated Report (Advanced)**

Use the report generation script for polished output:

```bash
# First, create findings JSON file
cat > findings.json << 'EOF'
[
  {
    "severity": "HIGH",
    "title": "Missing Input Validation",
    "location": "api/users.py:34",
    "description": "...",
    "impact": "...",
    "recommendation": "...",
    "references": ["https://owasp.org/..."]
  }
]
EOF

# Generate report in desired format
python scripts/generate_review_report.py --format markdown < findings.json > review_report.md
python scripts/generate_review_report.py --format html < findings.json > review_report.html
python scripts/generate_review_report.py --format json < findings.json > review_report.json
```

The script provides:
- Severity-based color coding (HTML)
- Automatic sorting by severity
- Summary statistics
- Professional formatting

### 8. Provide Actionable Summary

Conclude the review with:

1. **Executive Summary:** High-level overview of findings
2. **Priority Actions:** Top 3-5 issues to address immediately
3. **Positive Observations:** What's well-done in the codebase
4. **Long-term Recommendations:** Architectural or process improvements

**Example Summary:**

```
## Executive Summary

Reviewed 47 Python files (2,340 lines) in the `src/` directory. Found 23 issues:
- 2 Critical (must fix before deployment)
- 5 High (address in current sprint)
- 11 Medium (address in coming weeks)
- 5 Low (address as time permits)

## Priority Actions

1. **[CRITICAL]** Fix SQL injection vulnerability in auth/login.py:45
2. **[CRITICAL]** Remove hardcoded API key from config/settings.py:12
3. **[HIGH]** Add input validation to all API endpoints (5 locations)

## Positive Observations

- Excellent test coverage (87%)
- Clean separation of concerns in service layer
- Comprehensive error logging

## Long-term Recommendations

- Implement automated security scanning in CI/CD
- Add pre-commit hooks for code quality checks
- Consider migrating to type hints for better maintainability
```

## Tips for Effective Reviews

### Focus on What Matters
- Prioritize security and data integrity issues
- Don't nitpick style if linting tools exist
- Consider the codebase context (startup vs. enterprise)

### Be Specific
- Always include file paths and line numbers
- Provide code examples in recommendations
- Link to authoritative references (OWASP, language docs)

### Balance Criticism with Recognition
- Acknowledge well-written code
- Explain the "why" behind recommendations
- Suggest improvements, don't just criticize

### Adapt to the Audience
- Adjust depth based on team experience
- Use educational tone for junior developers
- Focus on architectural concerns for senior reviews

### Language-Specific Focus Areas

**Python:**
- Type hints usage
- Context managers for resources
- Virtual environment and dependencies
- PEP 8 compliance

**JavaScript/TypeScript:**
- TypeScript over JavaScript
- Async/await patterns
- ESLint/Prettier configuration
- npm audit results

**Java:**
- Exception handling patterns
- Stream API usage
- Dependency injection
- Memory management

**Go:**
- Error handling idioms
- Goroutine usage
- Context propagation
- Go modules

**Swift:**
- Optionals handling (avoid force unwrapping)
- Memory management (weak/unowned references, avoid retain cycles)
- Error handling with do-try-catch and Result types
- Protocol-oriented programming
- Value types (struct) vs reference types (class)
- Guard statements for early returns
- SwiftLint compliance
- Swift Package Manager dependencies

**Rust:**
- Ownership and borrowing
- Error handling with Result
- Unsafe code justification

## Resources

### references/review-checklist.md
Comprehensive checklist covering security, performance, code quality, best practices, documentation, architecture, DevOps, and compliance. Load this file to ensure thorough review coverage.

### references/severity-levels.md
Guidelines for categorizing findings by severity (Critical, High, Medium, Low, Info). Load this file to ensure consistent severity assignment across findings.

### scripts/generate_review_report.py
Python script to generate formatted reports (Markdown, HTML, JSON) from findings data. Use this for polished, professional report output with automatic formatting and severity-based organization.

**Usage:**
```bash
python scripts/generate_review_report.py --format [markdown|html|json] < findings.json
```
