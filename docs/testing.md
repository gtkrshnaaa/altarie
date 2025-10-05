# Testing

A smoke test exists at `altarie/tests/run.js`.

Run:
```bash
npm test
```

Recommendations:
- Add integration tests for critical routes (e.g., health, auth-protected routes).
- Consider using `tap` or `vitest` if you expand testing needs.
