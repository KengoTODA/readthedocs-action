# Test Patterns

## Factors and their levels

1. Event: `pull_request` or others
2. State of PR: `opened` or `closed`
3. Event type: `opened`, `reopend`, `synchronize`, and `closed`
4. The [version in readthedocs](https://docs.readthedocs.io/en/stable/api/v3.html#versions): `active` or not
5. State of the [build in readthedocs](https://docs.readthedocs.io/en/stable/api/v3.html#builds): `triggered`, `building`, `installing`, `cloning`, or `finished`
6. The project of readthedocs: Has one or more translates or not
7. The PR head and base: same or not
