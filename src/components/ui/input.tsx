import { forwardRef, useCallback, useRef } from 'react';

import { cn } from '@/lib/utils';
import { useFocusChanged } from '@/hooks/useFocusChanged';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, autoFocus, ...props }, ref) => {
    const internalRef = useRef<HTMLInputElement | null>(null);

    useFocusChanged(
      useCallback(
        focus => {
          if (focus && autoFocus) {
            internalRef.current?.focus();
          }
        },
        [autoFocus]
      )
    );

    return (
      <input
        type={type}
        className={cn(
          'flex h-9 w-full max-w-sm rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        autoFocus={autoFocus}
        ref={el => {
          internalRef.current = el;
          if (!ref) return;
          if (typeof ref === 'object') {
            ref.current = el;
          } else {
            ref(el);
          }
        }}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
