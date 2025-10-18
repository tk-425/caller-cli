# Code Review Checklist

This comprehensive checklist covers all aspects of code review for full codebase audits.

## Security

### Authentication & Authorization
- [ ] Authentication mechanisms properly implemented (no hardcoded credentials)
- [ ] Session management secure (proper timeout, secure cookies)
- [ ] Authorization checks on all protected resources
- [ ] Password storage uses strong hashing (bcrypt, Argon2, PBKDF2)
- [ ] Multi-factor authentication implemented where appropriate
- [ ] JWT tokens properly signed and validated
- [ ] OAuth/OIDC flows correctly implemented

### Input Validation & Sanitization
- [ ] All user input validated and sanitized
- [ ] SQL injection prevention (parameterized queries, ORMs)
- [ ] XSS prevention (output encoding, CSP headers)
- [ ] Command injection prevention (avoid shell execution with user input)
- [ ] Path traversal prevention (validate file paths)
- [ ] LDAP injection prevention
- [ ] XML external entity (XXE) prevention
- [ ] Server-side request forgery (SSRF) prevention

### Data Protection
- [ ] Sensitive data encrypted at rest
- [ ] Sensitive data encrypted in transit (TLS/SSL)
- [ ] Secrets management (use vaults, not environment variables in code)
- [ ] PII properly handled and protected
- [ ] Database credentials secured
- [ ] API keys and tokens properly secured
- [ ] Logging doesn't expose sensitive data

### Common Vulnerabilities
- [ ] CSRF protection on state-changing operations
- [ ] Clickjacking protection (X-Frame-Options)
- [ ] CORS properly configured
- [ ] Rate limiting implemented
- [ ] File upload restrictions (type, size, storage location)
- [ ] Deserialization vulnerabilities addressed
- [ ] Race condition vulnerabilities checked
- [ ] Integer overflow/underflow checked

### Dependencies
- [ ] Dependencies up-to-date and without known vulnerabilities
- [ ] Dependency integrity verified (lock files, checksums)
- [ ] Minimal dependency footprint
- [ ] License compliance

## Performance

### Algorithms & Data Structures
- [ ] Appropriate algorithm complexity (avoid O(n²) when O(n log n) possible)
- [ ] Efficient data structures chosen
- [ ] Unnecessary iterations avoided
- [ ] Early returns used to avoid unnecessary processing
- [ ] Recursion depth reasonable (consider iteration)

### Database & Queries
- [ ] Queries optimized (proper indexes)
- [ ] N+1 query problem avoided
- [ ] Batch operations used where appropriate
- [ ] Connection pooling implemented
- [ ] Query result pagination for large datasets
- [ ] Transactions properly scoped (not too broad)
- [ ] Lazy loading vs eager loading appropriate

### Caching
- [ ] Appropriate caching strategy
- [ ] Cache invalidation properly handled
- [ ] Cache key collisions prevented
- [ ] Memory usage reasonable

### Resource Management
- [ ] File handles properly closed
- [ ] Database connections properly closed
- [ ] Network connections properly managed
- [ ] Memory leaks prevented
- [ ] Large objects disposed properly
- [ ] Background jobs/workers properly managed

### Async & Concurrency
- [ ] Async/await used appropriately
- [ ] Race conditions prevented
- [ ] Deadlocks prevented
- [ ] Thread safety ensured where needed
- [ ] Shared state properly synchronized

## Code Quality

### Readability
- [ ] Code is self-documenting with clear variable names
- [ ] Functions are small and focused (single responsibility)
- [ ] Consistent naming conventions
- [ ] Magic numbers replaced with named constants
- [ ] Complex logic explained with comments
- [ ] Code follows language idioms

### Maintainability
- [ ] DRY principle followed (Don't Repeat Yourself)
- [ ] SOLID principles followed
- [ ] Separation of concerns maintained
- [ ] Tight coupling avoided
- [ ] God objects/classes avoided
- [ ] Cyclomatic complexity reasonable (< 10 per function)
- [ ] Code is modular and reusable
- [ ] Feature flags used for gradual rollouts

### Error Handling
- [ ] Errors properly caught and handled
- [ ] Meaningful error messages
- [ ] Errors logged appropriately
- [ ] Recovery strategies implemented
- [ ] No swallowed exceptions
- [ ] Resources cleaned up in error paths (try-finally, context managers)
- [ ] User-facing vs internal errors distinguished

### Testing
- [ ] Unit tests cover critical paths
- [ ] Edge cases tested
- [ ] Error cases tested
- [ ] Integration tests for key workflows
- [ ] Test coverage reasonable (> 80% for critical code)
- [ ] Tests are maintainable and readable
- [ ] Mock dependencies appropriately
- [ ] Tests are deterministic (no flaky tests)

## Best Practices by Language

### Python
- [ ] Type hints used (Python 3.5+)
- [ ] Context managers used for resource management
- [ ] List comprehensions over loops where appropriate
- [ ] Virtual environments used
- [ ] requirements.txt or pyproject.toml present
- [ ] PEP 8 style guide followed
- [ ] Docstrings present for modules, classes, functions

### JavaScript/TypeScript
- [ ] TypeScript used for type safety (preferred over JS)
- [ ] Strict mode enabled
- [ ] Promises/async-await over callbacks
- [ ] Arrow functions used appropriately
- [ ] Destructuring used for cleaner code
- [ ] Template literals over concatenation
- [ ] ESLint/Prettier configured
- [ ] Package.json dependencies locked

### Java
- [ ] Proper exception hierarchy
- [ ] Generics used appropriately
- [ ] Streams used for collections
- [ ] Try-with-resources for AutoCloseable
- [ ] Builder pattern for complex objects
- [ ] Dependency injection used
- [ ] Maven/Gradle dependency management

### Go
- [ ] Error handling explicit (return error)
- [ ] Goroutines and channels used appropriately
- [ ] Defer used for cleanup
- [ ] Context used for cancellation
- [ ] go.mod present
- [ ] Exported vs unexported naming correct

### Ruby
- [ ] Idiomatic Ruby (blocks, enumerables)
- [ ] Symbols vs strings appropriate
- [ ] RuboCop configured
- [ ] Bundler for dependency management
- [ ] Proper use of modules and mixins

### Swift
- [ ] Optionals properly handled (avoid force unwrapping with !)
- [ ] Memory management correct (weak/unowned for delegates, closures)
- [ ] Retain cycles prevented (especially in closures)
- [ ] Error handling with do-try-catch and Result types
- [ ] Protocol-oriented programming patterns used
- [ ] Value types (struct) preferred over reference types (class) where appropriate
- [ ] Guard statements used for early returns
- [ ] Access control appropriate (public, internal, private, fileprivate)
- [ ] SwiftLint or SwiftFormat configured
- [ ] Swift Package Manager or CocoaPods for dependencies
- [ ] Escaping vs non-escaping closures correct
- [ ] Combine or async/await for asynchronous operations

### Rust
- [ ] Ownership and borrowing correct
- [ ] Lifetimes properly annotated
- [ ] Error handling with Result
- [ ] Cargo.toml present
- [ ] unsafe code justified and minimal

## Documentation

### Code Documentation
- [ ] README present with setup instructions
- [ ] API documentation for public interfaces
- [ ] Complex algorithms explained
- [ ] Architecture decisions documented (ADRs)
- [ ] Configuration options documented
- [ ] Environment variables documented

### Comments
- [ ] Comments explain WHY, not WHAT
- [ ] TODO comments tracked
- [ ] Outdated comments removed
- [ ] No commented-out code

## Architecture & Design

### System Design
- [ ] Architecture appropriate for scale
- [ ] Separation of concerns (layers, modules)
- [ ] Design patterns used appropriately
- [ ] Configuration externalized
- [ ] Environment-specific config handled properly
- [ ] Feature toggles for experimental features

### API Design
- [ ] RESTful principles followed (if REST)
- [ ] Versioning strategy in place
- [ ] Consistent error response format
- [ ] Proper HTTP status codes
- [ ] Request/response validation
- [ ] Rate limiting and throttling

### Database Design
- [ ] Schema normalized appropriately
- [ ] Indexes on foreign keys and query columns
- [ ] Constraints enforced at DB level
- [ ] Migrations versioned and reversible
- [ ] Backup and recovery strategy

## DevOps & Operations

### Deployment
- [ ] CI/CD pipeline configured
- [ ] Automated tests in pipeline
- [ ] Blue-green or canary deployment strategy
- [ ] Rollback procedure documented
- [ ] Health check endpoints implemented

### Monitoring & Observability
- [ ] Logging strategy in place (structured logging)
- [ ] Metrics collected (response time, error rate, etc.)
- [ ] Distributed tracing implemented (for microservices)
- [ ] Alerts configured for critical errors
- [ ] Dashboard for key metrics

### Infrastructure
- [ ] Infrastructure as code (Terraform, CloudFormation)
- [ ] Containers properly configured (if using Docker)
- [ ] Resource limits set (CPU, memory)
- [ ] Auto-scaling configured where appropriate
- [ ] Disaster recovery plan

## Compliance & Legal

### Privacy
- [ ] GDPR compliance (if applicable)
- [ ] CCPA compliance (if applicable)
- [ ] Privacy policy accurate
- [ ] Data retention policy implemented
- [ ] Right to deletion implemented

### Accessibility
- [ ] WCAG guidelines followed (for web applications)
- [ ] Keyboard navigation supported
- [ ] Screen reader compatible
- [ ] Color contrast sufficient

### Licensing
- [ ] Code license clearly stated
- [ ] Third-party licenses compatible
- [ ] License headers on source files (if required)
