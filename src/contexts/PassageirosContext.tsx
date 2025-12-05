import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Passageiro {
  id: string;
  nome: string;
  faculdade: string;
}

interface PassageiroComPresenca extends Passageiro {
  presente: boolean | null;
}

interface PassageirosContextType {
  passageiros: Passageiro[];
  addPassageiro: (passageiro: Omit<Passageiro, 'id'>) => void;
  removePassageiro: (id: string) => void;
  getPassageirosComPresenca: () => PassageiroComPresenca[];
  updatePresenca: (id: string, presente: boolean) => void;
  resetChamada: () => void;
  presencas: Record<string, boolean | null>;
}

const PassageirosContext = createContext<PassageirosContextType | undefined>(undefined);

export function PassageirosProvider({ children }: { children: ReactNode }) {
  const [passageiros, setPassageiros] = useState<Passageiro[]>([]);
  const [presencas, setPresencas] = useState<Record<string, boolean | null>>({});

  const addPassageiro = (passageiro: Omit<Passageiro, 'id'>) => {
    const newPassageiro: Passageiro = {
      id: Date.now().toString(),
      ...passageiro,
    };
    setPassageiros([...passageiros, newPassageiro]);
    // Inicializa a presença como null para o novo passageiro
    setPresencas({ ...presencas, [newPassageiro.id]: null });
  };

  const removePassageiro = (id: string) => {
    setPassageiros(passageiros.filter((p) => p.id !== id));
    // Remove também a presença registrada
    const newPresencas = { ...presencas };
    delete newPresencas[id];
    setPresencas(newPresencas);
  };

  const getPassageirosComPresenca = (): PassageiroComPresenca[] => {
    return passageiros.map((p) => ({
      ...p,
      presente: presencas[p.id] ?? null,
    }));
  };

  const updatePresenca = (id: string, presente: boolean) => {
    setPresencas({ ...presencas, [id]: presente });
  };

  const resetChamada = () => {
    const newPresencas: Record<string, boolean | null> = {};
    passageiros.forEach((p) => {
      newPresencas[p.id] = null;
    });
    setPresencas(newPresencas);
  };

  return (
    <PassageirosContext.Provider
      value={{
        passageiros,
        addPassageiro,
        removePassageiro,
        getPassageirosComPresenca,
        updatePresenca,
        resetChamada,
        presencas,
      }}
    >
      {children}
    </PassageirosContext.Provider>
  );
}

export function usePassageiros() {
  const context = useContext(PassageirosContext);
  if (context === undefined) {
    throw new Error('usePassageiros must be used within a PassageirosProvider');
  }
  return context;
}