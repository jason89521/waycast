import { Command } from 'cmdk';
import { ReactNode } from 'react';

export function CommandItem({
  children,
  keywords,
  type = 'unknown',
  onSelect,
}: {
  children: ReactNode;
  value?: string;
  keywords?: string[];
  type?: string;
  onSelect?: (value: string) => void;
}) {
  return (
    <Command.Item keywords={keywords} onSelect={onSelect}>
      {children}
      <span cmdk-waycast-meta="">{type}</span>
    </Command.Item>
  );
}
