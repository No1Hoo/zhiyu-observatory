export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "未标注日期";
  return new Intl.DateTimeFormat("zh-CN", { dateStyle: "medium" }).format(new Date(date));
}

export function formatRelativeDate(date: Date | string | null | undefined): string {
  if (!date) return "";
  const now = Date.now();
  const d = new Date(date).getTime();
  const diff = now - d;

  const minutes = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days = Math.floor(diff / 86_400_000);

  if (minutes < 1) return "刚刚";
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  if (days < 7) return `${days}天前`;
  return formatDate(date);
}

export function splitTags(tags: string): string[] {
  return tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}
