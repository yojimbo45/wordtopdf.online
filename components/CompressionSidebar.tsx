"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    RadioGroup,
    RadioGroupItem,
} from "@/components/ui/radio-group";

export type CompressionLevel = "extreme" | "recommended" | "less";

interface Props {
    level: CompressionLevel;
    onLevelChange: (l: CompressionLevel) => void;
    onCompress: () => void;
    loading: boolean;
}

const levels: { id: CompressionLevel; title: string; subtitle: string }[] = [
    { id: "extreme",      title: "EXTREME COMPRESSION",     subtitle: "Less quality, high compression" },
    { id: "recommended",  title: "RECOMMENDED COMPRESSION", subtitle: "Good quality, good compression" },
    { id: "less",         title: "LESS COMPRESSION",        subtitle: "High quality, less compression" },
];

export function CompressionSidebar({
                                       level,
                                       onLevelChange,
                                       onCompress,
                                       loading,
                                   }: Props) {
    return (
        <aside className="w-full max-w-[22rem] border-l bg-white flex flex-col">
            <h2 className="px-6 pt-6 text-2xl font-semibold">
                Compression level
            </h2>

            <RadioGroup
                value={level}
                onValueChange={onLevelChange}
                className="space-y-1 px-2 py-4 flex-1 overflow-auto"
            >
                {levels.map((l) => (
                    <label
                        key={l.id}
                        htmlFor={l.id}
                        className={cn(
                            "flex cursor-pointer items-start gap-3 rounded-md px-4 py-3",
                            level === l.id && "bg-muted"
                        )}
                    >
                        <RadioGroupItem id={l.id} value={l.id} />
                        <div className="flex-1">
                            <p className="font-semibold uppercase">{l.title}</p>
                            <p className="text-sm text-muted-foreground">{l.subtitle}</p>
                        </div>
                        {level === l.id && <Check className="h-5 w-5 text-primary" />}
                    </label>
                ))}
            </RadioGroup>

            <div className="p-6">
                <Button
                    disabled={loading}
                    className="w-full text-lg py-6"
                    onClick={onCompress}
                >
                    {loading ? "Compressing…" : "Compress PDF"}
                </Button>
            </div>
        </aside>
    );
}
