import React, { createContext, useContext, useState, type ReactNode } from 'react';
import type { ContestContextType, Contest } from '../../types/dataTypes';

interface ContestProviderProps {
    children: ReactNode;
}


const ContestContext = createContext<ContestContextType | undefined>(undefined);

export const useContest = () => {
    const context = useContext(ContestContext);
    if (context === undefined) {
        throw new Error('useContest must be used within a ContestProvider');
    }
    return context;
};


export const ContestProvider: React.FC<ContestProviderProps> = ({ children }) => {
    const [contest, setContest] = useState<Contest>({
        cName: '',
        cDesc: '',
        cStartTime: '',
        cEndTime: '',
        questions: []
    });

    const [showUpdateAlert, setShowUpdateAlert] = useState(false);

    return (
        <ContestContext.Provider value={{ contest, setContest, showUpdateAlert, setShowUpdateAlert }}>
            {children}
        </ContestContext.Provider>
    );
};
