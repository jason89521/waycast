import { useNavigate } from 'react-router-dom';
import { CommandItem } from '../components/CommandItem';
import LinkIcon from '../assets/link.svg?react';
import { Separator } from '../components/Separator';
import { FormEvent, HTMLInputTypeAttribute, useEffect, useId, useRef, useState } from 'react';
import { Store } from '@tauri-apps/plugin-store';
import { Command } from 'cmdk';

import { invoke } from '@tauri-apps/api/core';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { FooterLeftContainer, FooterRightContainer } from '../components/Footer';
import { KBD } from '../components/KBD';

const store = new Store('quick-link.bin');

export function useQuickLinks() {
  const [entries, setEntries] = useState<[link: string, name: string][]>([]);
  useEffect(() => {
    let unmounted = false;
    store.entries<string>().then(entries => {
      if (unmounted) return;
      setEntries(entries);
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
    <Command.Group heading="Quick Links">
      {entries.map(([link, name]) => {
        return (
          <CommandItem
            key={link}
            onSelect={() => {
              invoke('open_link', { url: link });
            }}
            type="QuickLink"
          >
            <LinkIcon fill="white" />
            {name}
          </CommandItem>
        );
      })}
    </Command.Group>
  );
}

export default function QuickLink() {
  const [name, setName] = useState('');
  const [link, setLink] = useState('');
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
    store
      .set(link, name)
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
          <FormItem
            type="text"
            label="Name"
            name="name"
            value={name}
            onChange={setName}
            autoFocus={true}
          />
          <FormItem type="url" label="Link" name="link" value={link} onChange={setLink} />
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

function FormItem({
  label,
  type,
  name,
  value,
  onChange,
  autoFocus = false,
}: {
  name: string;
  label: string;
  type: HTMLInputTypeAttribute;
  value: string;
  onChange: (v: string) => void;
  autoFocus?: boolean;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const inputId = useId();

  useEffect(() => {
    const p = getCurrentWindow().onFocusChanged(event => {
      if (event.payload && autoFocus) {
        ref.current?.focus();
      }
    });
    return () => {
      p.then(unlisten => {
        unlisten();
      });
    };
  }, [autoFocus]);

  return (
    <div className="flex gap-6 text-sm w-full after:flex-1 items-center">
      <label htmlFor={inputId} className="flex-1 text-right">
        {label}
      </label>
      <input
        ref={ref}
        autoFocus={autoFocus}
        required={true}
        value={value}
        name={name}
        type={type}
        id={inputId}
        onChange={e => onChange(e.target.value)}
        className="rounded bg-black border border-gray-50 px-2 py-1 w-80"
      />
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
