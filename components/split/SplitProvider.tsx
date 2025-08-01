'use client';

import React, { createContext, useContext, useReducer } from 'react';
import { splitPdfPages } from '@/lib/pdf-utils'; // Implement this function
import type { UploadedFile } from '@/lib/pdf-utils';

export type SplitStatus = 'idle' | 'uploading' | 'splitting' | 'done' | 'error'; // ✅ DEFINE THIS HERE

type State = {
    items: UploadedFile[];
    status: SplitStatus;
    progress: number;
    splitUrls: string[];
};

type Action =
    | { type: 'ADD_FILES'; files: UploadedFile[] }
    | { type: 'DELETE_FILE'; id: string }
    | { type: 'SET_STATUS'; status: SplitStatus } // ✅ Fixed
    | { type: 'SET_PROGRESS'; value: number }
    | { type: 'SET_SPLIT_URLS'; urls: string[] }
    | { type: 'RESET' };


function reducer(state: State, action: Action): State {
    switch (action.type) {
        case 'ADD_FILES':
            return { ...state, items: action.files, status: 'idle' };
        case 'DELETE_FILE':
            return { ...state, items: state.items.filter(f => f.id !== action.id) };
        case 'SET_STATUS':
            return { ...state, status: action.status };
        case 'SET_PROGRESS':
            return { ...state, progress: action.value };
        case 'SET_SPLIT_URLS':
            return { ...state, splitUrls: action.urls };
        case 'RESET':
            return { items: [], status: 'idle', progress: 0, splitUrls: [] };
    }
}

const SplitContext = createContext<ReturnType<typeof useSplitCore> | null>(null);

function useSplitCore() {
    const [state, dispatch] = useReducer(reducer, {
        items: [],
        status: 'idle',
        progress: 0,
        splitUrls: [],
    });

    async function split() {
        dispatch({ type: 'SET_STATUS', status: 'splitting' });
        let p = 0;
        const timer = setInterval(() => {
            p = Math.min(95, p + 5);
            dispatch({ type: 'SET_PROGRESS', value: p });
        }, 120);

        const urls = await splitPdfPages(state.items.map(i => i.file));
        clearInterval(timer);
        dispatch({ type: 'SET_SPLIT_URLS', urls });
        dispatch({ type: 'SET_PROGRESS', value: 100 });
        dispatch({ type: 'SET_STATUS', status: 'done' });
    }

    return { state, dispatch, split };
}

export const SplitProvider = ({ children }: { children: React.ReactNode }) => (
    <SplitContext.Provider value={useSplitCore()}>{children}</SplitContext.Provider>
);

export const useSplit = () => {
    const ctx = useContext(SplitContext);
    if (!ctx) throw new Error('useSplit must be used inside SplitProvider');
    return ctx;
};
