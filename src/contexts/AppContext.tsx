import { ComponentType, createContext, Dispatch, ReactNode, useContext, useMemo } from 'react';

interface AppContextProps {
  setLeftFooter: Dispatch<ComponentType>;
  setRightFooter: Dispatch<ComponentType>;
}

const AppContext = createContext<AppContextProps>({
  setLeftFooter: setFooter,
  setRightFooter: setFooter,
});

function setFooter() {
  return () => null;
}

export function AppContextProvider({
  children,
  setLeftFooter,
  setRightFooter,
}: AppContextProps & { children: ReactNode }) {
  const context = useMemo(() => {
    return { setLeftFooter, setRightFooter } satisfies AppContextProps;
  }, [setLeftFooter, setRightFooter]);

  return <AppContext.Provider value={context}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  return useContext(AppContext);
}
