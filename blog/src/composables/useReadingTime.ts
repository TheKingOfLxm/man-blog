/** 从 markdown 原文估算阅读时长/字数（兜底用；列表页直接读 post.readingTime）。 */
export function estimateReadingTime(md: string): { readingTime: number; wordCount: number } {
  const noCode = md.replace(/```[\s\S]*?```/g, ' ').replace(/`[^`]*`/g, ' ')
  const text = noCode
    .replace(/!\[[\s\S]*?\]\([\s\S]*?\)/g, ' ')
    .replace(/\[([^\]]*)\]\([\s\S]*?\)/g, '$1')
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/[#>*_~\-|]/g, ' ')
  const cjk = (text.match(/[一-龥]/g) || []).length
  const latinWords = (text.match(/[A-Za-z]+/g) || []).length
  const wordCount = cjk + latinWords
  return {
    wordCount,
    readingTime: Math.max(1, Math.ceil(cjk / 400 + latinWords / 200)),
  }
}
