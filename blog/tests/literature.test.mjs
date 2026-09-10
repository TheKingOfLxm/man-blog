import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import {
  literaryWorks,
  getLiteraryWork,
  literaryPath,
  searchLiterature,
  verseLines,
} from '../src/lib/literature.ts'

test('所有原稿去重后完整收录，逐字保留标题、正文及标点', () => {
  const source = readFileSync(
    new URL('./fixtures/literature-original.txt', import.meta.url),
    'utf8',
  )
  const originals = source
    .trim()
    .split(/\r?\n\s*\r?\n/)
    .map((block) => {
      const [title, ...stanzas] = block.split(/\r?\n/)
      return { title, text: stanzas.join('') }
    })
  const unique = [
    ...new Map(originals.map((work) => [JSON.stringify(work), work])).values(),
  ]
  assert.equal(originals.length, 13)
  assert.equal(unique.length, 12)
  assert.deepEqual(
    literaryWorks.map((work) => ({
      title: work.title,
      text: work.stanzas.join(''),
    })),
    unique,
  )
})

test('诗词分类、唯一链接和详情查找不会混入另一板块', () => {
  assert.equal(literaryWorks.filter((work) => work.kind === 'shi').length, 1)
  assert.equal(literaryWorks.filter((work) => work.kind === 'ci').length, 11)
  assert.equal(new Set(literaryWorks.map(literaryPath)).size, 12)
  for (const work of literaryWorks) {
    assert.equal(getLiteraryWork(work.kind, work.id), work)
    assert.equal(
      getLiteraryWork(work.kind === 'shi' ? 'ci' : 'shi', work.id),
      undefined,
    )
  }
  assert.equal(getLiteraryWork('ci', 'missing-work'), undefined)
})

test('句读排版不改变字句，诗分四行，词保留上下阕', () => {
  for (const work of literaryWorks) {
    for (const stanza of work.stanzas)
      assert.equal(verseLines(stanza, work.kind).join(''), stanza)
    if (work.kind === 'ci') assert.equal(work.stanzas.length, 2)
  }
  const spring = literaryWorks.find((work) => work.title === '春夜')
  assert.equal(verseLines(spring.stanzas[0], spring.kind).length, 4)
})

test('可按正文搜索，并保持词牌及板块筛选', () => {
  assert.equal(searchLiterature('  琼珠乱撒  ', 'ci')[0]?.title, '踏莎行')
  assert.equal(searchLiterature('东风入夜', 'shi').length, 1)
  assert.equal(searchLiterature('', 'ci', '临江仙').length, 2)
  assert.equal(searchLiterature('不存在的诗句', 'ci').length, 0)
})
