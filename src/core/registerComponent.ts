import Handlebars, { type HelperOptions } from "handlebars";
import type Block from "./Block";
import type { BlockOwnProps } from "./Block";

//unknown несовместим с конструкторами вида `new (props: ButtonProps)` в strict-режиме
export interface ComponentClass {
  componentName: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new (props: any): Block;
}

let uniqueId = 0;

export function registerComponent(Component: ComponentClass): void {
  const dataAttribute = `data-component-hbs-id="${++uniqueId}"`;

  Handlebars.registerHelper(
    Component.componentName,
    function (this: unknown, options: HelperOptions) {
      const { hash, data } = options;
      const component = new Component(hash as Record<string, unknown>);

      const root = data.root as BlockOwnProps;

      if (typeof hash["ref"] === "string") {
        const refs = (root.__refs ??= {});
        const element = component.element();
        if (element) {
          refs[hash["ref"]] = element;
        }
      }

      const children = (root.__children ??= []);
      children.push({
        component,
        embed(node: DocumentFragment) {
          const placeholder = node.querySelector(`[${dataAttribute}]`);
          if (!placeholder) {
            throw new Error(
              `Нет плейсхолдера для компонента ${Component.componentName}`,
            );
          }
          const element = component.element();
          if (!element) {
            throw new Error(
              `Компонент ${Component.componentName} не имеет элемента`,
            );
          }
          placeholder.replaceWith(element);
        },
      });

      return new Handlebars.SafeString(`<div ${dataAttribute}></div>`);
    },
  );
}
