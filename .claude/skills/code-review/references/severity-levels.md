# Severity Levels for Code Review Findings

This guide helps categorize code review findings by severity to prioritize remediation efforts.

## Severity Categories

### Critical

**Definition:** Issues that pose immediate security risks, cause data loss, or result in complete system failure.

**Examples:**
- SQL injection vulnerabilities
- Hardcoded credentials or API keys
- Authentication bypass vulnerabilities
- Remote code execution vulnerabilities
- Unencrypted transmission of sensitive data (passwords, PII)
- Data corruption risks
- Complete system crashes
- Memory corruption vulnerabilities

**Action Required:** Must be fixed immediately before deployment.

**Typical Resolution Time:** Same day

---

### High

**Definition:** Issues that significantly impact security, functionality, or user experience but have some mitigation factors.

**Examples:**
- XSS vulnerabilities
- CSRF vulnerabilities without sensitive impact
- Weak cryptography usage
- Missing authorization checks
- Significant performance issues (e.g., O(n²) in critical path)
- Major functionality broken
- Data integrity issues
- Significant memory leaks
- Race conditions with security/data implications
- Missing input validation on critical paths

**Action Required:** Should be fixed before the next release.

**Typical Resolution Time:** Within 1 week

---

### Medium

**Definition:** Issues that affect code quality, maintainability, or have moderate security/functionality impact.

**Examples:**
- Information disclosure (error messages revealing system details)
- Missing rate limiting
- Suboptimal error handling
- Code complexity issues (high cyclomatic complexity)
- Minor performance issues
- Moderate code duplication
- Missing logging for important operations
- Inadequate test coverage
- Dependencies with known vulnerabilities (low severity)
- Minor functionality issues
- Accessibility issues
- Missing documentation for complex logic

**Action Required:** Should be addressed in upcoming sprints.

**Typical Resolution Time:** Within 2-4 weeks

---

### Low

**Definition:** Minor issues that affect code quality or developer experience but don't impact functionality or security significantly.

**Examples:**
- Code style inconsistencies
- Missing docstrings/comments
- Minor code duplication
- Suboptimal algorithm choice with negligible impact
- TODO comments without tracking
- Minor naming inconsistencies
- Unused imports or variables
- Console.log/print statements left in code
- Minor test improvements
- Non-critical documentation gaps
- Minor UI/UX polish issues

**Action Required:** Nice to have; address as time permits.

**Typical Resolution Time:** Best effort

---

### Info

**Definition:** Observations, suggestions, or best practice recommendations that don't require immediate action.

**Examples:**
- Alternative implementation suggestions
- Potential future refactoring opportunities
- Educational notes about language features
- Best practice reminders
- Architecture discussion points
- Performance optimization opportunities (non-critical)
- Suggestions for code modernization
- Tips for future maintainability

**Action Required:** Optional; consider for future improvements.

**Typical Resolution Time:** No specific timeline

---

## Factors Affecting Severity

When determining severity, consider these factors:

### Impact
- How many users are affected?
- What's the scope of the issue (single feature vs. entire system)?
- Can it lead to data loss or corruption?
- Does it expose sensitive information?

### Exploitability
- How easy is it to exploit?
- Does it require special conditions or access levels?
- Is it publicly known (CVE)?

### Likelihood
- How often will this code path execute?
- Are there existing mitigations in place?
- What's the probability of occurrence?

### Context
- Is this production code or experimental?
- What's the sensitivity of the data/system?
- What are the regulatory requirements?

## Severity Adjustment Rules

### Upgrade Severity If:
- Issue is in a high-traffic code path
- Issue affects production environment
- Issue involves PII or financial data
- Issue has regulatory compliance implications
- Multiple related issues compound the risk

### Downgrade Severity If:
- Issue is in rarely used code path
- Strong mitigations exist elsewhere
- Issue only affects development environment
- Issue requires privileged access to exploit
- Issue is theoretical with no practical exploit

## Reporting Format

When reporting findings, use this format:

```
**[SEVERITY]** Title of Finding

**Location:** file_path:line_number

**Description:** Brief description of the issue

**Impact:** What could happen if exploited/not fixed

**Recommendation:** Specific steps to remediate

**References:** Links to documentation, CVEs, or best practices
```

Example:

```
**[CRITICAL]** SQL Injection in User Login

**Location:** auth/login.py:45

**Description:** User input is directly concatenated into SQL query without parameterization.

**Impact:** Attacker could bypass authentication, access unauthorized data, or modify/delete database contents.

**Recommendation:** Use parameterized queries or an ORM. Replace:
`query = f"SELECT * FROM users WHERE username='{username}'"`
with:
`query = "SELECT * FROM users WHERE username=?", (username,)`

**References:** https://owasp.org/www-community/attacks/SQL_Injection
```
