import { FormState } from "../PageForm/PageForm";

export interface PageType {
    id: string,
    title: string,
    content: string,
    pageTitle: string,
    metaDescription: string,
    template: string,
    visibility: 'Hidden' | 'Visible';
    updated: string;
    [key: string]: unknown;
}

export interface FilterBarProps {
    queryValue: string;
    visibilityFilter: string | null;
    appliedFilters: Array<{
        key: string;
        label: string;
        onRemove: () => void;
    }>;
    onQueryChange: (value: string) => void;
    onQueryClear: () => void;
    onVisibilityChange: (value: string) => void;
    onClearAll: () => void;
}

export interface PageTableProps {
    pages?: PageType[];
}