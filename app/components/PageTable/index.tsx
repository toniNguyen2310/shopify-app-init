import { useState, useCallback, useEffect } from 'react';
import {
    IndexTable,
    Card,
    useIndexResourceState,
    Text,
    Badge,
} from '@shopify/polaris';
import { FilterBar } from './FilterBar';
import type { PageTableProps } from './types';
import { useNavigate } from '@remix-run/react';


export function PageTable({ pages }: PageTableProps) {
    const navigate = useNavigate();
    const [queryValue, setQueryValue] = useState<string>('');
    const [visibilityFilter, setVisibilityFilter] = useState<string | null>(null);
    const handleQueryChange = useCallback((value: string) => setQueryValue(value), []);
    const handleQueryClear = useCallback(() => setQueryValue(''), []);
    const handleVisibilityChange = useCallback((value: string) => setVisibilityFilter(value), []);
    const handleClearAll = useCallback(() => {
        setQueryValue('');
        setVisibilityFilter(null);
    }, []);

    const appliedFilters = [];
    if (visibilityFilter) {
        appliedFilters.push({
            key: 'visibility',
            label: `Visibility: ${visibilityFilter}`,
            onRemove: () => setVisibilityFilter(null),
        });
    }

    const filteredPages = (pages ?? []).filter((page) => {
        const matchesQuery = page.title.toLowerCase().includes(queryValue.toLowerCase());
        const matchesVisibility = visibilityFilter
            ? page.visibility === visibilityFilter
            : true;
        return matchesQuery && matchesVisibility;
    });

    const {
        selectedResources,
        allResourcesSelected,
        handleSelectionChange,
    } = useIndexResourceState(filteredPages);

    const handleRowClick = useCallback((id: string) => {
        navigate(`/app/${id}`);
    }, [navigate]);

    return (
        <Card>
            <FilterBar
                queryValue={queryValue}
                visibilityFilter={visibilityFilter}
                appliedFilters={appliedFilters}
                onQueryChange={handleQueryChange}
                onQueryClear={handleQueryClear}
                onVisibilityChange={handleVisibilityChange}
                onClearAll={handleClearAll}
            />

            <IndexTable
                resourceName={{ singular: 'page', plural: 'pages' }}
                itemCount={filteredPages.length}
                selectedItemsCount={allResourcesSelected ? 'All' : selectedResources.length}
                onSelectionChange={handleSelectionChange}
                headings={[
                    { title: 'Title' },
                    { title: 'Visibility' },
                    { title: 'Content' },
                    { title: 'Updated' },
                ]}
                selectable
            >
                {filteredPages.map(({ id, title, visibility, content, updated }, index) => {

                    return (
                        <IndexTable.Row
                            id={id}
                            key={id}
                            selected={selectedResources.includes(id)}
                            position={index}
                            onClick={() => handleRowClick(id)}
                        >
                            <IndexTable.Cell>
                                <Text fontWeight="medium" as="span">{title}</Text>
                            </IndexTable.Cell>
                            <IndexTable.Cell>
                                <Badge tone={visibility === 'Hidden' ? 'info' : 'success'}>
                                    {visibility}
                                </Badge>
                            </IndexTable.Cell>
                            <IndexTable.Cell>
                                <Text fontWeight="medium" as="span">{content}</Text>
                            </IndexTable.Cell>
                            <IndexTable.Cell>{updated}</IndexTable.Cell>
                        </IndexTable.Row>
                    )
                })}
            </IndexTable>
        </Card>
    );
}