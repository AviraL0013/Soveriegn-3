# Privacy Limitations

## Honest Assessment of Threshold Privacy

Sovereign Protocol aims to keep the exact threshold of private policies confidential to prevent counterparties or observers from gaming the parameters or front-running liquidations.

However, any system that publishes decisions on a public chain has inherent information leakage. We treat technical honesty as a credibility win: we know exactly what our system does and does not hide.

### The Binary-Search Oracle Attack

If the protocol publishes both `SAFE` and `BREACHED` decisions continuously to a public on-chain log, it creates a binary-search oracle:

```
Observation 1: Market drops 5%, Risk = 280 -> Event Published: SAFE
Observation 2: Market drops further, Risk = 290 -> Event Published: SAFE
Observation 3: Market drops further, Risk = 310 -> Event Published: BREACHED
```

Even if the exact threshold is hidden in a ZK proof, an observer watching the public events learns that the threshold is `290 < threshold <= 310`. Over time, repeated interactions can narrow the interval significantly.

### The Mitigation: Breach-Only Publication

To mitigate this, Sovereign Protocol uses **Breach-Only Publication**:

1. CRE/TEE evaluates risk privately on every tick.
2. While the position is safe, nothing is submitted to the on-chain `DecisionSink`.
3. Only when the threshold is crossed does the CRE submit `CHECK_BREACH, result=false (BREACHED)`.

This changes the public information to:

```
Observation: Market drops, Risk = 310 -> Event Published: BREACHED
```

The observer learns that the threshold was breached at that specific moment, but they cannot narrow the threshold using a history of public `SAFE` results.

### Residual Leakage (What Cannot Be Eliminated)

When the contract publicly transitions to `BREACHED` and unwinds escrow, observers necessarily learn that the private condition became true.

ZK proofs do not fully solve this: they can hide the threshold and inputs, but the verified boolean result and resulting transaction remain visible. Fully hiding that would require confidential chain state and confidential execution, which is outside the current architecture.

### Recommended Best Practices

To further mitigate residual leakage:
- **Do not include the observed loss value in events**, metadata, logs, or transaction calldata.
- **Restrict who can request an evaluation** so attackers cannot perform chosen-input threshold probing.
- **Rate-limit checks** inside the CRE workflow.
- **Publish only terminal state changes**.
- **Avoid exposing TEE logs** containing policy inputs or evaluation values.
- **Use delayed or batched breach publication** if timing correlation is a concern.
- **Rotate policies** when agreements are renewed instead of reusing the same threshold indefinitely.
