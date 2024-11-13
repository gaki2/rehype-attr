import type { Root } from 'hast';
import type { Plugin } from 'unified';
import { visit } from 'unist-util-visit';
import { createRandomString, toUrlSafeString } from './utils.js';

type TagName = keyof HTMLElementTagNameMap;

export type RehypeIdOptions = {
  targetElements?: TagName[];
  prefix?: string;
  type?: 'increment' | 'content';
  initialValue?: number;
};

export const rehypeId: Plugin<[RehypeIdOptions], Root> = (options = {}) => {
  const {
    targetElements = ['h1', 'h2', 'h3'],
    prefix = 'rh-',
    initialValue = 0,
    type = 'increment',
  } = options;

  return (tree) => {
    let count = initialValue;
    visit(tree, 'element', (node) => {
      if (!targetElements.includes(node.tagName as TagName)) {
        return;
      }

      switch (type) {
        case 'increment':
          count += 1;
          node.properties = { ...node.properties, ...{ id: `${prefix}${count}` } };
          break;
        case 'content':
          // @ts-expect-error
          const content = toUrlSafeString(node.children[0]?.value ?? createRandomString(4));
          node.properties = { ...node.properties, ...{ id: `${prefix}${content}` } };
          break;
      }
    });
  };
};
