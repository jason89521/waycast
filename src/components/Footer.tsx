import { ReactNode, useEffect, useRef, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';

interface Store {
  element: HTMLDivElement | null;
  sub: (onChange: () => void) => () => void;
  getElement: () => HTMLDivElement | null;
  setElement: (element: HTMLDivElement | null) => void;
}

function createStore(): Store {
  let listeners: (() => void)[] = [];
  let element: HTMLDivElement | null = null;

  return {
    element,
    sub(onChange) {
      listeners.push(onChange);

      return () => {
        listeners = listeners.filter(l => l !== onChange);
      };
    },
    getElement() {
      return element;
    },
    setElement(newElement) {
      element = newElement;
      for (const listener of listeners) {
        listener();
      }
    },
  };
}

const leftContainerStore = createStore();
const rightContainerStore = createStore();

export function Footer() {
  const footerLeft = useRef<HTMLDivElement>(null);
  const footerRight = useRef<HTMLDivElement>(null);

  useEffect(() => {
    leftContainerStore.setElement(footerLeft.current);
    rightContainerStore.setElement(footerRight.current);
  }, []);

  return (
    <footer
      waycast-footer=""
      className="flex h-10 items-center w-full bg-[var(--gray2)] p-2 border border-solid border-[var(--gray6)]"
    >
      <div ref={footerLeft} className="mr-auto text-xs font-medium" />
      <div ref={footerRight} className="text-xs" />
    </footer>
  );
}

interface ContainerProps {
  children: ReactNode;
}

export function FooterLeftContainer({ children }: ContainerProps) {
  const element = useSyncExternalStore(leftContainerStore.sub, leftContainerStore.getElement);

  if (element) {
    return createPortal(children, element);
  }

  return null;
}

export function FooterRightContainer({ children }: ContainerProps) {
  const element = useSyncExternalStore(rightContainerStore.sub, rightContainerStore.getElement);

  if (element) {
    return createPortal(children, element);
  }

  return null;
}
