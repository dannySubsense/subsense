# Adding the next recovered item

This is the working ingestion path used by **Becoming Agential**. It is intentionally small and file-based.

1. **Keep the recovered source unchanged.** Identify the original files in `subsense-original-content/`; do not move or rename them.
2. **Select, don’t flatten.** Copy only the chosen public derivatives to `site/assets/`. Each copied asset needs its exact original path in `site/content/archive.js`.
3. **Create an entry object.** Add an `entries` record with an id, title, year if known, types, orientation, tags, editorial status, source paths, blocks, and related entry ids. Unknown facts stay absent.
4. **Compose blocks to fit the material.** Available block types are `media`, `mediaPair`, `sequence`, `video`, and `quote`. An entry need not use every type or follow Becoming Agential’s order.
5. **Connect outward.** Use `related` to point to adjacent entries; relationships are editorial propositions, not automatic tags.
6. **Verify.** Run `python3 -m http.server 4173 --directory site`, open the entry and its related links, check mobile width, captions, source paths, and media playback.
7. **Promote the decision.** Record durable editorial decisions in `docs/06-DECISION-LOG.md` and Lore, then commit only the site framework, chosen derivatives, content data, and documentation—not the protected source corpus.

The model is deliberately not a CMS or universal schema. It is a way to turn real recovered material into a legible public relationship while preserving provenance and room for a different next composition.
