import {
    Filters,
    TextField,
} from '@shopify/polaris';
import type { FilterBarProps } from './types';

export function FilterBar({
    queryValue,
    visibilityFilter,
    appliedFilters,
    onQueryChange,
    onQueryClear,
    onVisibilityChange,
    onClearAll,
}: FilterBarProps) {
    return (
        <Filters
            queryValue={queryValue}
            filters={[
                {
                    key: 'visibility',
                    label: 'Visibility',
                    filter: (
                        <TextField
                            label="Visibility"
                            value={visibilityFilter || ''}
                            onChange={onVisibilityChange}
                            autoComplete="off"
                        />
                    ),
                    shortcut: true,
                },
            ]}
            appliedFilters={appliedFilters}
            onQueryChange={onQueryChange}
            onQueryClear={onQueryClear}
            onClearAll={onClearAll}
        />
    );
}