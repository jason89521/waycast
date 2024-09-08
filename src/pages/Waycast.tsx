import { useEffect, useRef, useState } from 'react';
import { Command } from 'cmdk';
import { QuickLinkCommandGroup, QuickLinkCommandItem } from './QuickLink';
import * as Popover from '@radix-ui/react-popover';
import ReactIcon from '../assets/react.svg?react';
import { FooterLeftContainer, FooterRightContainer } from '../components/Footer';

export default function Waycast() {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <>
      <Command value={value} onValueChange={setValue}>
        <Command.Input
          ref={inputRef}
          placeholder="Search for apps and commands..."
          autoFocus={true}
        />
        <Command.Separator alwaysRender={true} />
        <Command.List>
          <Command.Empty>No Result Found</Command.Empty>
          <Command.Group heading="Commands">
            <QuickLinkCommandItem />
          </Command.Group>
          <QuickLinkCommandGroup />
        </Command.List>
      </Command>
      <FooterLeftContainer>
        <ReactIcon />
      </FooterLeftContainer>
      <FooterRightContainer>
        <div className="flex items-center">
          <button className="text-[var(--gray12)] pr-1 pl-2 rounded-md font-medium text-xs h-7 tracking-[-0.25px] flex items-center gap-2">
            Open Application
            <kbd className="text-[var(--gray11)] bg-[var(--gray3)] h-5 w-5 rounded flex items-center justify-center">
              ↵
            </kbd>
          </button>
          <hr className="h-3 w-[1px] border-0 bg-[var(--gray6)] mr-1 ml-3" />
          <SubCommand selectedValue={value} inputRef={inputRef} />
        </div>
      </FooterRightContainer>
    </>
  );
}

function SubCommand({
  inputRef,
  selectedValue,
}: {
  inputRef: React.RefObject<HTMLInputElement>;
  selectedValue: string;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function listener(e: KeyboardEvent) {
      if (e.key === 'k' && e.altKey) {
        e.preventDefault();
        setOpen(o => !o);
      }
    }

    document.addEventListener('keydown', listener);

    return () => {
      document.removeEventListener('keydown', listener);
    };
  }, []);

  return (
    <Popover.Root open={open} onOpenChange={setOpen} modal>
      <Popover.Trigger
        cmdk-waycast-subcommand-trigger=""
        onClick={() => setOpen(true)}
        aria-expanded={open}
      >
        Actions
        <kbd>Alt</kbd>
        <kbd>K</kbd>
      </Popover.Trigger>
      <Popover.Content
        side="top"
        align="end"
        className="waycast-submenu"
        sideOffset={16}
        alignOffset={0}
        onCloseAutoFocus={e => {
          e.preventDefault();
          inputRef?.current?.focus();
        }}
      >
        <Command>
          <Command.List>
            <Command.Empty>No Result.</Command.Empty>
            <Command.Group heading={selectedValue}>
              <SubItem shortcut="↵">
                <ReactIcon />
                Open Application
              </SubItem>
              <SubItem shortcut="Alt + ↵">
                <ReactIcon />
                Show in Finder
              </SubItem>
              <SubItem shortcut="Alt I">
                <ReactIcon />
                Show Info in Finder
              </SubItem>
              <SubItem shortcut="Alt ⇧ F">
                <ReactIcon />
                Add to Favorites
              </SubItem>
            </Command.Group>
          </Command.List>
          <Command.Input placeholder="Search for actions..." />
        </Command>
      </Popover.Content>
    </Popover.Root>
  );
}

function SubItem({ children, shortcut }: { children: React.ReactNode; shortcut: string }) {
  return (
    <Command.Item>
      {children}
      <div cmdk-waycast-submenu-shortcuts="">
        {shortcut.split(' ').map(key => {
          return <kbd key={key}>{key}</kbd>;
        })}
      </div>
    </Command.Item>
  );
}
