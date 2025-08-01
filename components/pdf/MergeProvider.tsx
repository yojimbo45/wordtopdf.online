'use client';
import React, { createContext, useContext, useReducer } from 'react';
import { mergePdfs } from '@/lib/pdf-utils';  // heavy code kept outside components
import type { UploadedFile, MergeStatus } from '@/lib/pdf-utils';

type State = {
    items: UploadedFile[];
    status: MergeStatus;
    progress: number;
    mergedUrl: string | null;
};

type Action =
    | { type: 'ADD_FILES'; files: UploadedFile[] }
    | { type: 'DELETE_FILE'; id: string }
    | { type: 'REORDER'; items: UploadedFile[] }
    | { type: 'SET_STATUS'; status: MergeStatus }
    | { type: 'SET_PROGRESS'; value: number }
    | { type: 'SET_MERGED_URL'; url: string | null }
    | { type: 'RESET' };

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case 'ADD_FILES':
            return { ...state, items: action.files, status: 'idle' };
        case 'DELETE_FILE':
            return { ...state, items: state.items.filter(f => f.id !== action.id) };
        case 'REORDER':
            return { ...state, items: action.items };
        case 'SET_STATUS':
            return { ...state, status: action.status };
        case 'SET_PROGRESS':
            return { ...state, progress: action.value };
        case 'SET_MERGED_URL':
            return { ...state, mergedUrl: action.url };
        case 'RESET':
            return { items: [], status: 'idle', progress: 0, mergedUrl: null };
    }
}

const MergeContext = createContext<ReturnType<typeof useMergeCore> | null>(null);

function useMergeCore() {
    const [state, dispatch] = useReducer(reducer, {
        items: [],
        status: 'idle',
        progress: 0,
        mergedUrl: null,
    });

    // Async side‑effect kept here so UI components remain dumb
    async function merge() {
        dispatch({ type: 'SET_STATUS', status: 'merging' });
        let p = 0;
        const timer = setInterval(() => {
            p = Math.min(95, p + 5);
            dispatch({ type: 'SET_PROGRESS', value: p });
        }, 120);

        const url = await mergePdfs(state.items.map(i => i.file));
        clearInterval(timer);
        dispatch({ type: 'SET_MERGED_URL', url });
        dispatch({ type: 'SET_PROGRESS', value: 100 });
        dispatch({ type: 'SET_STATUS', status: 'done' });
    }

    return { state, dispatch, merge };
}

export const MergeProvider = ({ children }: { children: React.ReactNode }) => (
    <MergeContext.Provider value={useMergeCore()}>{children}</MergeContext.Provider>
);
export const useMerge = () => {
    const ctx = useContext(MergeContext);
    if (!ctx) throw new Error('useMerge must be used inside MergeProvider');
    return ctx;
};
