import stringify from 'rehype-stringify';
import remarkParse from 'remark-parse';
import remark2rehype from 'remark-rehype';
import { unified } from 'unified';
import { rehypeId } from '../src/index';

describe('rehype-id type: increment 테스트', () => {
  [
    {
      title: '1줄짜리 Markdown',
      markdown: '# This is a title',
      expected: '<h1 id="rh-1">This is a title</h1>',
    },
    {
      title: '여러줄의 Markdown',
      markdown: '# This is a title\n## You are my love\n### I love you',
      expected:
        '<h1 id="rh-1">This is a title</h1>\n<h2 id="rh-2">You are my love</h2>\n<h3 id="rh-3">I love you</h3>',
    },
  ].forEach((data, idx) => {
    it(data.title, async () => {
      const htmlStr = unified()
        .use(remarkParse)
        .use(remark2rehype, { allowDangerousHtml: true })
        // _____⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️________
        // .use(rehypeRaw)
        .use(rehypeId, { type: 'increment' })
        .use(stringify)
        .processSync(data.markdown)
        .toString();
      expect(htmlStr).toEqual(data.expected);
    });
  });
});

describe('rehype-id targetElements 테스트', () => {
  [
    {
      title: 'targetElements: p',
      markdown: '# This is a title\n## You are my love\n I love you',
      expected: '<h1>This is a title</h1>\n<h2>You are my love</h2>\n<p id="rh-1">I love you</p>',
    },
  ].forEach((data, idx) => {
    it(data.title, async () => {
      const htmlStr = unified()
        .use(remarkParse)
        .use(remark2rehype, { allowDangerousHtml: true })
        // _____⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️________
        // .use(rehypeRaw)
        .use(rehypeId, { targetElements: ['p'] })
        .use(stringify)
        .processSync(data.markdown)
        .toString();
      expect(htmlStr).toEqual(data.expected);
    });
  });
});

describe('rehype-id type: content 테스트', () => {
  [
    {
      title: 'type: content, targetElements: p',
      markdown: '아이시떼루\n\n 널 사랑해 \n\n I love you',
      expected:
        '<p id="아이시떼루">아이시떼루</p>\n<p id="널-사랑해">널 사랑해</p>\n<p id="i-love-you">I love you</p>',
    },
  ].forEach((data, idx) => {
    it(data.title, async () => {
      const htmlStr = unified()
        .use(remarkParse)
        .use(remark2rehype, { allowDangerousHtml: true })
        // _____⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️________
        // .use(rehypeRaw)
        .use(rehypeId, { prefix: '', targetElements: ['p'], type: 'content' })
        .use(stringify)
        .processSync(data.markdown)
        .toString();
      expect(htmlStr).toEqual(data.expected);
    });
  });
});
