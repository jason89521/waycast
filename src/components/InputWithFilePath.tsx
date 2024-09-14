import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Paperclip, Folder } from 'lucide-react';

import { open } from '@tauri-apps/plugin-dialog';

interface Props {
  autoFocus?: boolean;
  onChange?(value: string): void;
  value?: string;
  placeholder?: string;
  required?: boolean;
}

export default function InputWithFileUpload({
  autoFocus = false,
  required = false,
  onChange,
  value,
  placeholder,
}: Props) {
  const [inputValue, setInputValue] = useState(value ?? '');

  useEffect(() => {
    if (typeof value === 'string') {
      setInputValue(value);
    }
  }, [value]);

  const handleValueChange = (value: string) => {
    if (onChange) {
      onChange(value);
    } else {
      setInputValue(value);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleValueChange(e.target.value);
  };

  const handleFileButtonClick = () => {
    open().then(value => {
      if (typeof value === 'string') {
        handleValueChange(value);
      }
    });
  };

  const handleFolderButtonClick = () => {
    open({ directory: true }).then(value => {
      if (typeof value === 'string') {
        handleValueChange(value);
      }
    });
  };

  return (
    <div className="relative w-full max-w-sm">
      <Input
        required={required}
        autoFocus={autoFocus}
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={handleInputChange}
        className="pr-12"
      />
      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleFileButtonClick}
          className="h-8 w-8"
        >
          <Paperclip className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleFolderButtonClick}
          className="h-8 w-8"
        >
          <Folder className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
