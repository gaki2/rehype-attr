import type { Root } from 'hast';
import type { Plugin } from 'unified';
import { visit } from 'unist-util-visit';

type TagName = keyof HTMLElementTagNameMap;

export type RehypeStaggerOptions = {
  elements?: TagName[];
  startNum?: number;
  increment?: number;
  min?: number;
  max?: number;
  shouldIncrease?: (currentElementTagName: string) => boolean;
};

export const rehypeStagger: Plugin<[RehypeStaggerOptions], Root> = (options = {}) => {
  const {
    elements = ['p', 'h1', 'h2', 'h3', 'h4', 'h5'],
    startNum = 1,
    increment = 1,
    min = 0,
    max = 99,
    shouldIncrease = () => true,
  } = options;

  return (tree) => {
    let count = startNum;
    visit(tree, 'element', (node) => {
      if (!elements.includes(node.tagName as TagName)) {
        return;
      }

      if (shouldIncrease(node.tagName)) {
        count += increment;
        count = Math.max(Math.min(count, max), min);
      }

      node.properties = { ...node.properties, ...{ style: `--stagger:${count}` } };
    });
  };
};
