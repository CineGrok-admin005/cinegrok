'use client';

/**
 * Language Combobox Component
 * 
 * Searchable multi-select combobox for language selection.
 * Optimized for 100+ items with instant filtering.
 * 
 * @module components/ui/LanguageCombobox
 */

import * as React from 'react';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { cn } from '@/components/ui/utils';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { LANGUAGES } from '@/lib/constants';

interface LanguageComboboxProps {
    value: string[];
    onChange: (value: string[]) => void;
    placeholder?: string;
    maxItems?: number;
    disabled?: boolean;
}

/**
 * Searchable multi-select combobox for languages.
 * Features:
 * - Instant search/filter for 100+ languages
 * - Multi-select with chips display
 * - Keyboard navigation
 * - Mobile-friendly
 * 
 * @example
 * <LanguageCombobox 
 *   value={['English', 'Hindi']} 
 *   onChange={(langs) => setLanguages(langs)}
 * />
 */
export function LanguageCombobox({
    value = [],
    onChange,
    placeholder = 'Select languages...',
    maxItems = 10,
    disabled = false,
}: LanguageComboboxProps) {
    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState('');

    // Filter languages based on search
    const filteredLanguages = React.useMemo(() => {
        if (!search) return LANGUAGES.slice(0, 50); // Show first 50 when not searching
        const lowerSearch = search.toLowerCase();
        return LANGUAGES.filter((lang) =>
            lang.toLowerCase().includes(lowerSearch)
        ).slice(0, 50);
    }, [search]);

    const handleSelect = (language: string) => {
        if (value.includes(language)) {
            // Remove if already selected
            onChange(value.filter((l) => l !== language));
        } else if (value.length < maxItems) {
            // Add if under max
            onChange([...value, language]);
        }
    };

    const handleRemove = (language: string) => {
        onChange(value.filter((l) => l !== language));
    };

    return (
        <div className="space-y-2">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between h-auto min-h-10 text-left font-normal"
                        disabled={disabled}
                    >
                        {value.length === 0 ? (
                            <span className="text-muted-foreground">{placeholder}</span>
                        ) : (
                            <span className="text-sm">
                                {value.length} language{value.length !== 1 ? 's' : ''} selected
                            </span>
                        )}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                    <Command shouldFilter={false}>
                        <CommandInput
                            placeholder="Search languages..."
                            value={search}
                            onValueChange={setSearch}
                        />
                        <CommandList>
                            <CommandEmpty>No language found.</CommandEmpty>
                            <CommandGroup>
                                {filteredLanguages.map((language) => {
                                    const isSelected = value.includes(language);
                                    const isDisabled = !isSelected && value.length >= maxItems;
                                    return (
                                        <CommandItem
                                            key={language}
                                            value={language}
                                            onSelect={() => handleSelect(language)}
                                            disabled={isDisabled}
                                            className={cn(
                                                isDisabled && 'opacity-50 cursor-not-allowed'
                                            )}
                                        >
                                            <Check
                                                className={cn(
                                                    'mr-2 h-4 w-4',
                                                    isSelected ? 'opacity-100' : 'opacity-0'
                                                )}
                                            />
                                            {language}
                                        </CommandItem>
                                    );
                                })}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                    {value.length >= maxItems && (
                        <div className="p-2 text-xs text-muted-foreground border-t text-center">
                            Maximum {maxItems} languages allowed
                        </div>
                    )}
                </PopoverContent>
            </Popover>

            {/* Selected languages as chips */}
            {value.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {value.map((language) => (
                        <Badge
                            key={language}
                            variant="secondary"
                            className="px-2 py-1 text-sm flex items-center gap-1"
                        >
                            {language}
                            <button
                                type="button"
                                onClick={() => handleRemove(language)}
                                className="ml-1 hover:text-destructive focus:outline-none"
                                disabled={disabled}
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    ))}
                </div>
            )}
        </div>
    );
}

export default LanguageCombobox;
