export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "未标注日期";
  return new Intl.DateTimeFormat("zh-CN", { dateStyle: "medium" }).format(new Date(date));
}

export function splitTags(tags: string): string[] {
  return tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}
