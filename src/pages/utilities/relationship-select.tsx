import { useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { RelationshipLabels, RelationshipType } from '@/lib/enums';
import { cn } from '@/lib/utils.ts';
import { Button } from '@/components/ui/button.tsx';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command.tsx';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover.tsx';

export function RelationshipCombobox({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  const [open, setOpen] = useState(false);

  const relationships = Object.entries(RelationshipType).map(([key, val]) => ({
    value: val,
    label: RelationshipLabels[val],
  }));

  const selectedRelationship = relationships.find((r) => r.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
        >
          {selectedRelationship ? selectedRelationship.label : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder="Search relationship..." />
          <CommandEmpty>No relationship found.</CommandEmpty>
          <CommandList>
            <CommandGroup>
              {relationships.map((relationship) => (
                <CommandItem
                  key={relationship.value}
                  value={relationship.value}
                  onSelect={() => {
                    onChange(relationship.value);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === relationship.value
                        ? 'opacity-100'
                        : 'opacity-0',
                    )}
                  />
                  {relationship.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
