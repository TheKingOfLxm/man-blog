import workData from '../data/literature.json' with { type: 'json' }
import type { LiteraryKind, LiteraryWork } from '../types'

export const literaryWorks = workData as LiteraryWork[]

export const literaryCollections = {
  shi: {
    title: '诗',
    english: 'Poems',
    path: '/poems',
    unit: '首',
    subtitle: '借一帘月色，写几行心事。',
  },
  ci: {
    title: '词',
    english: 'Ci / Lyric poetry',
    path: '/ci',
    unit: '阕',
    subtitle: '把江南烟雨，填入长短句。',
  },
} satisfies Record<
  LiteraryKind,
  {
    title: string
    english: string
    path: string
    unit: string
    subtitle: string
  }
>

export function literaryPath(work: LiteraryWork) {
  return `${literaryCollections[work.kind].path}/${work.id}`
}

export function getLiteraryWork(kind: LiteraryKind, id: string) {
  return literaryWorks.find((work) => work.kind === kind && work.id === id)
}

export function verseLines(stanza: string, kind: LiteraryKind) {
  return stanza
    .split(kind === 'shi' ? /(?<=[，。！？])/u : /(?<=[。！？])/u)
    .filter(Boolean)
}

export function searchLiterature(
  query: string,
  kind?: LiteraryKind,
  tune = '',
) {
  const needle = query.trim().toLocaleLowerCase()
  return literaryWorks.filter(
    (work) =>
      (!kind || work.kind === kind) &&
      (!tune || work.tune === tune) &&
      `${work.title}${work.stanzas.join('')}`
        .toLocaleLowerCase()
        .includes(needle),
  )
}
