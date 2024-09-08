import { useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import LeftArrow from '../assets/left-arrow.svg?react';

export function CommandPageLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        navigate('..');
      }
    }

    document.addEventListener('keydown', handler);

    return () => {
      document.removeEventListener('keydown', handler);
    };
  }, []);

  return (
    <>
      <Link
        to=".."
        className="fixed left-4 top-4 bg-[var(--gray6)] p-1 rounded-md hover:bg-[var(--gray8)]"
      >
        <LeftArrow className="w-4 h-4" />
      </Link>
      <Outlet />
    </>
  );
}
