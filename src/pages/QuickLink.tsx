import { useNavigate } from 'react-router-dom';
import { CommandItem } from '../components/CommandItem';
import LinkIcon from '../assets/link.svg?react';
import { Separator } from '../components/Separator';
import { FormEvent, ReactNode, useEffect, useRef, useState } from 'react';
import { Store } from '@tauri-apps/plugin-store';
import { CommandGroup } from 'cmdk';

import { FooterLeftContainer, FooterRightContainer } from '../components/Footer';
import { KBD } from '../components/KBD';
import InputWithFileUpload from '@/components/InputWithFilePath';
import { Input } from '@/components/ui/input';
import { Command, open } from '@tauri-apps/plugin-shell';

const store = new Store('quick-link.bin');

const DEFAULT_COMMAND = 'DEFAULT';

interface QuickLink {
  name: string;
  command: string;
  path: string;
}
export function useQuickLinks() {
  const [entries, setEntries] = useState<[key: string, quickLink: QuickLink][]>([]);
  useEffect(() => {
    let unmounted = false;
    store.entries<QuickLink>().then(entries => {
      if (unmounted) return;
      setEntries(entries);
      console.log(entries);
    });

    return () => {
      unmounted = true;
    };
  }, []);

  return entries;
}

export function QuickLinkCommandGroup() {
  const entries = useQuickLinks();

  return (
    <CommandGroup heading="Quick Links">
      {entries.map(([key, { name, path, command }]) => {
        return (
          <CommandItem
            key={key}
            onSelect={() => {
              if (command === DEFAULT_COMMAND) {
                open(path);
              } else {
                Command.create('exec-sh', ['-c', `${command} "${path}"`])
                  .execute()
                  .then(result => {
                    console.log(result);
                  });
              }
            }}
            type="QuickLink"
            keywords={[name, path, command]}
          >
            <LinkIcon fill="white" />
            {name}
          </CommandItem>
        );
      })}
    </CommandGroup>
  );
}

export default function QuickLink() {
  const [name, setName] = useState('');
  const [path, setPath] = useState('');
  const [command, setCommand] = useState(DEFAULT_COMMAND);
  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === 'k' && e.altKey) {
        formRef.current?.requestSubmit();
      }
    }
    document.addEventListener('keydown', handler);

    return () => {
      document.removeEventListener('keydown', handler);
    };
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = { name, path, command };
    const key = getQuickLinkKey(value);
    store
      .set(key, value)
      .then(e => {
        console.log('success', e);
        store.save();
        navigate(-1);
      })
      .catch(e => {
        console.log('failed');
        console.error(e);
      });
  }

  return (
    <>
      <div className="pt-[var(--cmdk-input-height)]">
        <Separator />
        <form
          ref={formRef}
          className="flex flex-col items-stretch gap-6 pt-6"
          onSubmit={handleSubmit}
        >
          <FormItem label="Name">
            <Input
              required={true}
              type="text"
              autoFocus={true}
              placeholder="Enter the QuickLink's name"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </FormItem>
          <FormItem label="Path">
            <InputWithFileUpload
              required={true}
              placeholder="Enter path or link"
              value={path}
              onChange={setPath}
            />
          </FormItem>
          <FormItem label="Command">
            <Input value={command} onChange={e => setCommand(e.target.value)} />
          </FormItem>
          <button hidden type="submit">
            Submit
          </button>
        </form>
      </div>
      <FooterLeftContainer>
        <div className="flex items-center gap-2 text-[var(--gray11)]">
          <LinkIcon fill="white" />
          <span>Create Quick Link</span>
        </div>
      </FooterLeftContainer>
      <FooterRightContainer>
        <button
          className="flex items-center gap-2"
          onClick={() => {
            formRef.current?.requestSubmit();
          }}
        >
          <span className="font-semibold">Save Quick Link</span>
          <KBD>Alt</KBD>
          <KBD>↵</KBD>
        </button>
      </FooterRightContainer>
    </>
  );
}

function FormItem({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="text-sm">
      <label className="flex items-center gap-6 mx-auto after:flex-1">
        <span className="flex-1 text-right">{label}</span>
        {children}
      </label>
    </div>
  );
}

export function QuickLinkCommandItem() {
  const navigate = useNavigate();

  return (
    <CommandItem
      type="Command"
      onSelect={() => {
        navigate('quick-link');
      }}
    >
      <LinkIcon fill="white" />
      <span>Create QuickLink</span>
    </CommandItem>
  );
}

function getQuickLinkKey({ name, path, command }: QuickLink) {
  return `${name}-${path}-${command}`;
}
