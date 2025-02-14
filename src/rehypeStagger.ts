import type { Root } from 'hast';
import type { Plugin } from 'unified';
import { visit } from 'unist-util-visit';

type TagName = keyof HTMLElementTagNameMap;

export type RehypeStaggerOptions = {
  /**
   * 시작 숫자
   */
  startNum?: number;
  /**
   * 증가 숫자
   */
  increment?: number;
  /**
   * 최소 숫자
   */
  min?: number;
  /**
   * 최대 숫자
   */
  max?: number;
  /**
   * stagger 증가 여부를 결정하는 함수
   */
  shouldIncrease?: (tagNameOrComponentName: string) => boolean;
  /**
   * stagger 를 적용할 element
   * '*' 를 사용하면 모든 element에 적용
   */
  elements?: TagName[] | string;
  /**
   * stagger 를 적용할 mdx 컴포넌트 이름
   * '*' 를 사용하면 모든 컴포넌트에 적용
   */
  componentNames?: string[] | string;
  /**
   * 리액트 컴포넌트에 stagger 값을 전달할 prop 이름
   */
  attributeName?: string;
};

export const rehypeStagger: Plugin<[RehypeStaggerOptions], Root> = (options = {}) => {
  const {
    elements = '*',
    startNum = 1,
    increment = 1,
    min = 0,
    max = 99,
    shouldIncrease = () => true,
    componentNames = '*',
    attributeName = 'stagger',
  } = options;

  return (tree) => {
    let count = startNum - increment;
    visit(tree, ['element', 'mdxJsxFlowElement'], (node) => {
      
      switch (node.type) {
        case 'element': 
          if (elements !== '*' && !elements.includes(node.tagName as TagName)) {
            return;
          }

          if (shouldIncrease(node.tagName)) {
            count += increment;
            count = clamp(count, min, max);
          }
    
          const style = node.properties?.style;
          const styleValue = typeof style === 'object' 
            ? Object.entries(style).map(([key, value]) => `${key}:${value}`).join(';')
            : String(style || '');
          
          node.properties = { 
            ...node.properties, 
            style: withStagger(styleValue, count) 
          };
          break; 

        // @ts-ignore
        case 'mdxJsxFlowElement': 
        // @ts-ignore
          if (componentNames !== '*' && !componentNames.includes(node.name)) {
            return;
          }
          // @ts-ignore
          if (shouldIncrease(node.name)) {
            count += increment;
            count = clamp(count, min, max);
          }
          // @ts-ignore
          node.attributes = node.attributes || [];
          // @ts-ignore
          node.attributes.push({
            type: 'mdxJsxAttribute',
            name: attributeName,
            value: count,
          });
          
          break;
      }
    });
  };
};


const withStagger = (style: string, count: number) => {
  return `--stagger:${count}; ${style}`.trim();
}

const clamp = (value: number, min: number, max: number) => {
  return Math.max(Math.min(value, max), min);
}