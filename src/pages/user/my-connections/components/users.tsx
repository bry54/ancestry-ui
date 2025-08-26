'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { API_URL } from '@/auth/adapters/jwt-auth-adapter.ts';
import { DropdownMenu } from '@radix-ui/react-dropdown-menu';
import { RiCheckboxCircleFill } from '@remixicon/react';
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  Row,
  RowSelectionState,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import axios from 'axios';
import {
  EllipsisVertical,
  Filter,
  Loader2,
  Search,
  Settings2,
  X,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { toAbsoluteUrl } from '@/lib/helpers';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { Alert, AlertIcon, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardFooter,
  CardHeader,
  CardHeading,
  CardTable,
  CardToolbar,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { DataGrid, useDataGrid } from '@/components/ui/data-grid';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { DataGridColumnVisibility } from '@/components/ui/data-grid-column-visibility';
import { DataGridPagination } from '@/components/ui/data-grid-pagination';
import {
  DataGridTable,
  DataGridTableRowSelect,
  DataGridTableRowSelectAll,
} from '@/components/ui/data-grid-table';
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface IConnection {
  person: {
    id: string;
    firstName: string;
    lastName: string;
    fatherName: string;
    motherName: string;
    otherGivenNames: string[];
    nickNames: string[];
    gender: 'MALE' | 'FEMALE';
    dateOfBirth: string;
    dateOfDeath: string | null;
    placeOfBirth: {
      city: string;
      country: string;
    };
    placeOfDeath: {
      city: string;
      country: string;
    } | null;
  };
  relationshipPath: string;
}

function ActionsCell({ row }: { row: Row<IConnection> }) {
  const { copyToClipboard } = useCopyToClipboard();
  const handleCopyId = () => {
    copyToClipboard(String(row.original.person.id));
    const message = `User ID successfully copied: ${row.original.person.id}`;
    toast.custom(
      (t) => (
        <Alert
          variant="mono"
          icon="success"
          close={false}
          onClose={() => toast.dismiss(t)}
        >
          <AlertIcon>
            <RiCheckboxCircleFill />
          </AlertIcon>
          <AlertTitle>{message}</AlertTitle>
        </Alert>
      ),
      {
        position: 'top-center',
      },
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="size-7" mode="icon" variant="ghost">
          <EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="end">
        <DropdownMenuItem onClick={() => {}}>Edit</DropdownMenuItem>
        <DropdownMenuItem onClick={handleCopyId}>Copy ID</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={() => {}}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const Users = () => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'person', desc: false },
  ]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<string>('newest');
  const [connections, setConnections] = useState<IConnection[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConnections = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get<IConnection[]>(
          `${API_URL}/persons/related-persons`,
        );
        const result: IConnection[] = await response.data;
        setConnections(result);
      } catch (e) {
        const errorMessage =
          e instanceof Error ? e.message : 'An unknown error occurred';
        setError(errorMessage);
        toast.error(`Error fetching connections: ${errorMessage}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConnections();
  }, []);

  const filteredData = useMemo(() => {
    let filtered = connections;

    // Filter by gender
    if (selectedStatuses.length > 0) {
      filtered = filtered.filter((item) => {
        return selectedStatuses.includes(item.person.gender);
      });
    }

    // Filter by search query (case-insensitive)
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          `${item.person.firstName} ${item.person.lastName}`
            .toLowerCase()
            .includes(searchLower) ||
          item.person.placeOfBirth.city.toLowerCase().includes(searchLower) ||
          item.person.placeOfBirth.country
            .toLowerCase()
            .includes(searchLower) ||
          item.relationshipPath.toLowerCase().includes(searchLower),
      );
    }

    // Apply sorting based on sortOrder
    if (sortOrder === 'newest') {
      // Newest born
      filtered = [...filtered].sort(
        (a, b) =>
          new Date(b.person.dateOfBirth).getTime() -
          new Date(a.person.dateOfBirth).getTime(),
      );
    } else if (sortOrder === 'oldest') {
      // Oldest born
      filtered = [...filtered].sort(
        (a, b) =>
          new Date(a.person.dateOfBirth).getTime() -
          new Date(b.person.dateOfBirth).getTime(),
      );
    }

    return filtered;
  }, [connections, searchQuery, selectedStatuses, sortOrder]);

  const statusCounts = useMemo(() => {
    return connections.reduce(
      (acc, item) => {
        const status = item.person.gender;
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
  }, [connections]);

  const handleStatusChange = (checked: boolean, value: string) => {
    setSelectedStatuses((prev = []) =>
      checked ? [...prev, value] : prev.filter((v) => v !== value),
    );
  };

  const columns = useMemo<ColumnDef<IConnection>[]>(
    () => [
      {
        id: 'select',
        header: () => <DataGridTableRowSelectAll />,
        cell: ({ row }) => <DataGridTableRowSelect row={row} />,
        enableSorting: false,
        enableHiding: false,
        enableResizing: false,
        size: 51,
      },
      {
        id: 'person',
        accessorFn: (row) => `${row.person.firstName} ${row.person.lastName}`,
        header: ({ column }) => (
          <DataGridColumnHeader title="Person" column={column} />
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center font-medium rounded-full size-10 bg-muted text-muted-foreground">
              {row.original.person.firstName.charAt(0)}
              {row.original.person.lastName.charAt(0)}
            </div>
            <div className="flex flex-col">
              <Link
                to="#"
                className="font-medium text-foreground hover:text-primary"
              >
                {`${row.original.person.firstName} ${row.original.person.lastName}`}
              </Link>
              {row.original.person.nickNames &&
                row.original.person.nickNames.length > 0 && (
                  <span className="text-xs text-muted-foreground">
                    {row.original.person.nickNames.join(', ')}
                  </span>
                )}
            </div>
          </div>
        ),
        enableSorting: true,
        size: 220,
      },
      {
        id: 'relationship',
        accessorFn: (row) => row.relationshipPath,
        header: ({ column }) => (
          <DataGridColumnHeader title="Relationship Path" column={column} />
        ),
        cell: ({ row }) => {
          const path = row.original.relationshipPath;
          // Splits by -(TYPE)->, capturing TYPE. Resulting array alternates names and types.
          const parts = path.split(/-\((.*?)\)->/);

          return (
            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
              {parts.map((part, i) => {
                const isName = i % 2 === 0;
                const isLast = i === parts.length - 1;

                // Filter out empty strings that can result from splitting
                if (part.trim() === '') return null;

                return (
                  <React.Fragment key={i}>
                    {isName ? (
                      <span className="font-medium text-foreground text-xs">
                        {part.trim()}
                      </span>
                    ) : (
                      <Badge variant="secondary" size="xs" className="text-xs">
                        <span className="text-xs">{part.trim()}</span>
                      </Badge>
                    )}
                    {!isLast && (
                      <span className="text-muted-foreground text-xs">
                        &rarr;
                      </span>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          );
        },
        enableSorting: true,
        size: 250,
      },
      {
        id: 'birthPlace',
        accessorFn: (row) =>
          `${row.person.placeOfBirth.city}, ${row.person.placeOfBirth.country}`,
        header: ({ column }) => (
          <DataGridColumnHeader title="Birth Place" column={column} />
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <img
              src={toAbsoluteUrl(
                `/media/flags/${row.original.person.placeOfBirth.country.toLowerCase().replace(/ /g, '-')}.svg`,
              )}
              className="size-5 shrink-0"
              alt={row.original.person.placeOfBirth.country}
            />
            <span className="font-normal text-foreground">
              {row.original.person.placeOfBirth.city}
            </span>
          </div>
        ),
        enableSorting: true,
        size: 165,
      },
      {
        id: 'lifeSpan',
        accessorFn: (row) => row.person.dateOfBirth,
        header: ({ column }) => (
          <DataGridColumnHeader title="Life Span" column={column} />
        ),
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="font-normal text-foreground">
              {new Date(row.original.person.dateOfBirth).toLocaleDateString()}
            </span>
            {row.original.person.dateOfDeath && (
              <span className="text-xs text-muted-foreground">
                Died:{' '}
                {new Date(row.original.person.dateOfDeath).toLocaleDateString()}
              </span>
            )}
          </div>
        ),
        enableSorting: true,
        size: 150,
      },
      {
        id: 'gender',
        accessorFn: (row) => row.person.gender,
        header: ({ column }) => (
          <DataGridColumnHeader title="Gender" column={column} />
        ),
        cell: ({ row }) => (
          <Badge
            variant={
              row.original.person.gender === 'MALE' ? 'default' : 'secondary'
            }
          >
            {row.original.person.gender.charAt(0) +
              row.original.person.gender.slice(1).toLowerCase()}
          </Badge>
        ),
        enableSorting: true,
        size: 100,
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => <ActionsCell row={row} />,
        enableSorting: false,
        size: 60,
      },
    ],
    [],
  );

  const table = useReactTable({
    columns,
    data: filteredData,
    pageCount: Math.ceil((filteredData?.length || 0) / pagination.pageSize),
    getRowId: (row: IConnection) => String(row.person.id),
    state: {
      pagination,
      sorting,
      rowSelection,
    },
    columnResizeMode: 'onChange',
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const Toolbar = () => {
    const { table } = useDataGrid();

    return (
      <CardToolbar>
        <Button>
          <Settings2 /> Filters
        </Button>
        <DataGridColumnVisibility
          table={table}
          trigger={
            <Button variant="outline">
              <Settings2 /> Columns
            </Button>
          }
        />
      </CardToolbar>
    );
  };

  return (
    <DataGrid
      table={table}
      recordCount={filteredData?.length || 0}
      tableLayout={{
        columnsPinnable: true,
        columnsMovable: true,
        columnsVisibility: true,
        cellBorder: true,
      }}
    >
      <Card>
        <CardHeader>
          <CardHeading>
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <Search className="size-4 text-muted-foreground absolute start-3 top-1/2 -translate-y-1/2" />
                <Input
                  placeholder="Search Users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="ps-9 w-40"
                />
                {searchQuery.length > 0 && (
                  <Button
                    mode="icon"
                    variant="ghost"
                    className="absolute end-1.5 top-1/2 -translate-y-1/2 h-6 w-6"
                    onClick={() => setSearchQuery('')}
                  >
                    <X />
                  </Button>
                )}
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">
                    <Filter />
                    Gender
                    {selectedStatuses.length > 0 && (
                      <Badge size="sm" variant="outline">
                        {selectedStatuses.length}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-40 p-3" align="start">
                  <div className="space-y-3">
                    <div className="text-xs font-medium text-muted-foreground">
                      Filters
                    </div>
                    <div className="space-y-3">
                      {Object.keys(statusCounts).map((status) => (
                        <div key={status} className="flex items-center gap-2.5">
                          <Checkbox
                            id={status}
                            checked={selectedStatuses.includes(status)}
                            onCheckedChange={(checked) =>
                              handleStatusChange(checked === true, status)
                            }
                          />
                          <Label
                            htmlFor={status}
                            className="grow flex items-center justify-between font-normal gap-1.5"
                          >
                            {status.charAt(0) + status.slice(1).toLowerCase()}
                            <span className="text-muted-foreground">
                              {statusCounts[status]}
                            </span>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">
                    <Filter />
                    Sort Order
                    {sortOrder !== 'newest' && (
                      <Badge size="sm" variant="outline">
                        {sortOrder.charAt(0).toUpperCase() + sortOrder.slice(1)}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-40 p-3" align="start">
                  <div className="space-y-3">
                    <div className="text-xs font-medium text-muted-foreground">
                      Sort By
                    </div>
                    <div className="space-y-3">
                      {['newest', 'oldest'].map((order) => (
                        <div key={order} className="flex items-center gap-2.5">
                          <Checkbox
                            id={order}
                            checked={sortOrder === order}
                            onCheckedChange={(checked) =>
                              checked && setSortOrder(order)
                            }
                          />
                          <Label
                            htmlFor={order}
                            className="grow flex items-center justify-between font-normal gap-1.5"
                          >
                            {order.charAt(0).toUpperCase() + order.slice(1)}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </CardHeading>
          <Toolbar />
        </CardHeader>
        <CardTable>
          {isLoading ? (
            <div className="flex items-center justify-center p-10">
              <Loader2 className="mr-2 h-16 w-16 animate-spin" />
            </div>
          ) : error ? (
            <div className="p-10">
              <Alert variant="destructive">
                <AlertIcon>
                  <X />
                </AlertIcon>
                <AlertTitle>Error: {error}</AlertTitle>
              </Alert>
            </div>
          ) : (
            <ScrollArea>
              <DataGridTable />
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          )}
        </CardTable>
        <CardFooter>
          <DataGridPagination />
        </CardFooter>
      </Card>
    </DataGrid>
  );
};

export { Users };
