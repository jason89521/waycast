import { ReactNode } from 'react';

export function KBD({ children }: { children: ReactNode }) {
  return (
    <kbd className="flex rounded items-center justify-center bg-[var(--gray5)] px-1 text-[var(--gray11)] min-w-5">
      {children}
    </kbd>
  );
}
