import type { DetailedHTMLProps, HTMLAttributes } from "react";

type UoinkMarkElement = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "uoink-mark": UoinkMarkElement;
    }
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "uoink-mark": UoinkMarkElement;
    }
  }
}

export {};
