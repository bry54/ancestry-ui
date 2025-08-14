import { DropdownMenu4 } from '@/partials/dropdown-menu/dropdown-menu-4';
import { RemixiconComponentType } from '@remixicon/react';
import {
  CakeIcon,
  EllipsisVertical,
  SignpostIcon,
  TreesIcon,
  type LucideIcon,
} from 'lucide-react';
import { BadgeDot } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface IHighlightsRow {
  icon: LucideIcon | RemixiconComponentType;
  text: React.ReactNode;
}
type IHighlightsRows = Array<IHighlightsRow>;

interface IHighlightsItem {
  badgeColor: string;
  label: string;
}
type IHighlightsItems = Array<IHighlightsItem>;

interface IHighlightsProps {
  limit?: number;
}

const Highlights = ({ limit }: IHighlightsProps) => {
  const rows: IHighlightsRows = [
    {
      icon: CakeIcon,
      text: (
        <span>
          <b>[Birthday]</b> John Doe (Turns 12)'
        </span>
      ),
    },
    {
      icon: SignpostIcon,
      text: (
        <span>
          <b>[Memorial]</b> Someone died 6 years ago
        </span>
      ),
    },
  ];

  const items: IHighlightsItems = [
    { badgeColor: 'bg-green-500', label: 'Paternal' },
    { badgeColor: 'bg-destructive', label: 'Maternal' },
    { badgeColor: 'bg-violet-500', label: 'others' },
  ];

  const renderRow = (row: IHighlightsRow, index: number) => {
    return (
      <div
        key={index}
        className="flex items-center justify-between flex-wrap gap-2"
      >
        <div className="flex items-center gap-1.5">
          <row.icon className="size-4.5 text-muted-foreground" />
          <span className="text-sm font-normal text-mono">{row.text}</span>
        </div>
      </div>
    );
  };

  const renderItem = (item: IHighlightsItem, index: number) => {
    return (
      <div key={index} className="flex items-center gap-1.5">
        <BadgeDot className={item.badgeColor} />
        <span className="text-sm font-normal text-foreground">
          {item.label}
        </span>
      </div>
    );
  };

  return (
    <Card className="h-full scroll-auto">
      <CardHeader>
        <CardTitle>Highlights</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 p-5 lg:p-7.5 lg:pt-4">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2.5">
            <span className="text-3xl font-semibold text-mono">
              Tree Composition
            </span>
            <TreesIcon color="red" />
          </div>
        </div>
        <div className="flex items-center gap-1 mb-1.5">
          <div className="bg-green-500 h-2 w-full max-w-[60%] rounded-xs"></div>
          <div className="bg-destructive h-2 w-full max-w-[25%] rounded-xs"></div>
          <div className="bg-violet-500 h-2 w-full max-w-[15%] rounded-xs"></div>
        </div>
        <div className="flex items-center flex-wrap gap-4 mb-1">
          {items.map((item, index) => {
            return renderItem(item, index);
          })}
        </div>
        <div className="border-b border-input scroll-auto"></div>
        <div className="grid gap-3">{rows.map(renderRow)}</div>
      </CardContent>
    </Card>
  );
};

export {
  Highlights,
  type IHighlightsRow,
  type IHighlightsRows,
  type IHighlightsItem,
  type IHighlightsItems,
  type IHighlightsProps,
};
