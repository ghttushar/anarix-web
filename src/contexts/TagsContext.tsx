import { createContext, useCallback, useContext, useMemo, useState, ReactNode } from "react";
import { seedTags } from "@/data/mockTags";

interface TagsContextValue {
  /** Master tag dictionary (all tags ever created). */
  tags: string[];
  /** Committed tags per campaign id. */
  campaignTags: Record<string, string[]>;
  /** Uncommitted draft overrides (only used in edit mode). */
  draftTags: Record<string, string[]>;
  /** Get effective tags (draft if present, otherwise committed). */
  getEffectiveTags: (campaignId: string) => string[];
  /** Toggle a tag for a single campaign (writes to draft). */
  toggleTag: (campaignId: string, tag: string) => void;
  /** Toggle a tag across many campaigns at once (writes to draft). */
  bulkToggleTag: (campaignIds: string[], tag: string) => void;
  /** Remove a tag from a single campaign (writes to draft). */
  removeTag: (campaignId: string, tag: string) => void;
  /** Create a new tag in the master dictionary. */
  createTag: (tag: string) => void;
  /** Rename an existing tag everywhere. */
  renameTag: (oldName: string, newName: string) => void;
  /** Delete a tag from the master dictionary AND from every campaign. */
  deleteTag: (tag: string) => void;
  /** Commit draft → permanent. */
  commitDrafts: () => void;
  /** Discard drafts. */
  discardDrafts: () => void;
  /** Whether there are any pending drafts. */
  hasDrafts: boolean;
}

const TagsContext = createContext<TagsContextValue | null>(null);

export function TagsProvider({ children }: { children: ReactNode }) {
  const [tags, setTags] = useState<string[]>(seedTags);
  const [campaignTags, setCampaignTags] = useState<Record<string, string[]>>({});
  const [draftTags, setDraftTags] = useState<Record<string, string[]>>({});

  const getEffectiveTags = useCallback(
    (campaignId: string) =>
      draftTags[campaignId] ?? campaignTags[campaignId] ?? [],
    [draftTags, campaignTags]
  );

  const toggleTag = useCallback((campaignId: string, tag: string) => {
    setDraftTags((prev) => {
      const current = prev[campaignId] ?? campaignTags[campaignId] ?? [];
      const next = current.includes(tag)
        ? current.filter((t) => t !== tag)
        : [...current, tag];
      return { ...prev, [campaignId]: next };
    });
  }, [campaignTags]);

  const bulkToggleTag = useCallback((campaignIds: string[], tag: string) => {
    setDraftTags((prev) => {
      const next = { ...prev };
      // Determine if every selected row already has the tag → then remove; else add.
      const allHave = campaignIds.every((id) => {
        const current = next[id] ?? campaignTags[id] ?? [];
        return current.includes(tag);
      });
      for (const id of campaignIds) {
        const current = next[id] ?? campaignTags[id] ?? [];
        if (allHave) {
          next[id] = current.filter((t) => t !== tag);
        } else if (!current.includes(tag)) {
          next[id] = [...current, tag];
        } else {
          next[id] = current;
        }
      }
      return next;
    });
  }, [campaignTags]);

  const removeTag = useCallback((campaignId: string, tag: string) => {
    setDraftTags((prev) => {
      const current = prev[campaignId] ?? campaignTags[campaignId] ?? [];
      return { ...prev, [campaignId]: current.filter((t) => t !== tag) };
    });
  }, [campaignTags]);

  const createTag = useCallback((tag: string) => {
    const clean = tag.trim();
    if (!clean) return;
    setTags((prev) => (prev.includes(clean) ? prev : [...prev, clean]));
  }, []);

  const renameTag = useCallback((oldName: string, newName: string) => {
    const clean = newName.trim();
    if (!clean || clean === oldName) return;
    setTags((prev) => prev.map((t) => (t === oldName ? clean : t)));
    const rewrite = (map: Record<string, string[]>) =>
      Object.fromEntries(
        Object.entries(map).map(([id, arr]) => [
          id,
          arr.map((t) => (t === oldName ? clean : t)),
        ])
      );
    setCampaignTags((prev) => rewrite(prev));
    setDraftTags((prev) => rewrite(prev));
  }, []);

  const deleteTag = useCallback((tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
    const strip = (map: Record<string, string[]>) =>
      Object.fromEntries(
        Object.entries(map).map(([id, arr]) => [id, arr.filter((t) => t !== tag)])
      );
    setCampaignTags((prev) => strip(prev));
    setDraftTags((prev) => strip(prev));
  }, []);

  const commitDrafts = useCallback(() => {
    setCampaignTags((prev) => ({ ...prev, ...draftTags }));
    setDraftTags({});
  }, [draftTags]);

  const discardDrafts = useCallback(() => setDraftTags({}), []);

  const hasDrafts = useMemo(() => Object.keys(draftTags).length > 0, [draftTags]);

  const value = useMemo<TagsContextValue>(
    () => ({
      tags,
      campaignTags,
      draftTags,
      getEffectiveTags,
      toggleTag,
      bulkToggleTag,
      removeTag,
      createTag,
      renameTag,
      deleteTag,
      commitDrafts,
      discardDrafts,
      hasDrafts,
    }),
    [
      tags,
      campaignTags,
      draftTags,
      getEffectiveTags,
      toggleTag,
      bulkToggleTag,
      removeTag,
      createTag,
      renameTag,
      deleteTag,
      commitDrafts,
      discardDrafts,
      hasDrafts,
    ]
  );

  return <TagsContext.Provider value={value}>{children}</TagsContext.Provider>;
}

export function useTags() {
  const ctx = useContext(TagsContext);
  if (!ctx) throw new Error("useTags must be used within TagsProvider");
  return ctx;
}
