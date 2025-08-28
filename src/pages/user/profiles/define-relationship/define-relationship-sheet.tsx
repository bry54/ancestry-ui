import { useEffect, useState } from 'react';
import { API_URL } from '@/auth/adapters/jwt-auth-adapter.ts';
import { useAuth } from '@/auth/context/auth-context.ts';
import { RelationshipCombobox } from '@/pages/utilities/relationship-select.tsx';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import {
  AlertCircle,
  Check,
  CheckCheckIcon,
  ChevronsUpDown,
  LoaderCircleIcon,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { LineageSide, RelationshipLabels, RelationshipType } from '@/lib/enums';
import { capitalizeFirstLetter } from '@/lib/helpers.ts';
import { Any } from '@/lib/interfaces';
import { cn } from '@/lib/utils.ts';
import { Alert, AlertIcon, AlertTitle } from '@/components/ui/alert.tsx';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command.tsx';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { InputAddon, InputGroup } from '@/components/ui/input.tsx';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover.tsx';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.tsx';
import { Separator } from '@/components/ui/separator.tsx';
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

// --- Data Structures ---

interface Person {
  id: string;
  firstName: string;
  lastName: string;
}

interface IDefineRelationDto {
  sourceId: string;
  targetId: string;
  metadata: {
    type: RelationshipType;
    lineageSide: LineageSide | null;
  };
}

// --- Zod Schema ---

const defineRelationshipSchema = z
  .object({
    sourceId: z.string().min(1, { message: 'Please select a source person.' }),
    targetId: z.string().min(1, { message: 'Please select a target person.' }),
    type: z.string({
      errorMap: () => ({ message: 'Please select a relationship type.' }),
    }),
    lineageSide: z.string().optional(),
  })
  .refine((data) => data.sourceId !== data.targetId, {
    message: 'Source and target person cannot be the same.',
    path: ['targetId'], // Show error on the target field
  });

export type DefineRelationshipSchemaType = z.infer<
  typeof defineRelationshipSchema
>;

// --- Reusable Combobox Components ---

function PersonCombobox({
  persons,
  value,
  onChange,
  placeholder,
  isLoading,
  disabled,
}: {
  persons: Person[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  isLoading?: boolean;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const selectedPerson = persons.find((person) => person.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
          disabled={isLoading || disabled}
        >
          {isLoading
            ? 'Loading...'
            : selectedPerson
              ? `${selectedPerson.firstName} ${selectedPerson.lastName}`
              : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder="Search person..." />
          <CommandEmpty>No person found.</CommandEmpty>
          <CommandList>
            <CommandGroup>
              {persons.map((person) => (
                <CommandItem
                  key={person.id}
                  value={`${person.firstName} ${person.lastName}`}
                  onSelect={() => {
                    onChange(person.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === person.id ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  {`${person.firstName} ${person.lastName}`}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

// --- Main Sheet Component ---

interface DefineRelationshipSheetProps {
  open: boolean;
  onOpenChange: () => void;
  onRelationshipDefined: () => void;
  target: string;
  source: string;
}

export function DefineRelationshipSheet({
  open,
  onOpenChange,
  onRelationshipDefined,
  target,
  source,
}: DefineRelationshipSheetProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [persons, setPersons] = useState<Person[]>([]);
  const [isFetchingPersons, setIsFetchingPersons] = useState(true);
  const { user } = useAuth();

  const form = useForm<DefineRelationshipSchemaType>({
    resolver: zodResolver(defineRelationshipSchema),
    defaultValues: {
      sourceId: source ?? '',
      targetId: target ?? '',
    },
  });

  // Fetch persons when the sheet opens
  useEffect(() => {
    if (open) {
      const getPersons = async () => {
        setIsFetchingPersons(true);
        try {
          const url = user?.isAdmin
            ? `${API_URL}/persons`
            : `${API_URL}/managed-profiles`;
          const response = await axios.get(`${url}`, {
            params: { limit: 10000 },
          });
          const list = response.data.data;
          setPersons(list);
        } catch (err) {
          console.error('Failed to fetch persons', err);
          setError('Could not load persons list.');
        } finally {
          setIsFetchingPersons(false);
        }
      };
      getPersons();
    }
  }, [open, user?.isAdmin]);

  async function onSubmit(values: DefineRelationshipSchemaType) {
    console.log(values);
    try {
      setIsProcessing(true);
      setError(null);
      setSuccessMessage(null);

      const dto: IDefineRelationDto = {
        targetId: target ?? values.targetId,
        sourceId: source ?? values.sourceId,
        metadata: {
          type: values.type as RelationshipType,
          lineageSide: values.lineageSide as Any,
        },
      };

      await axios.post(`${API_URL}/relationships`, dto);

      setSuccessMessage('Relationship created successfully.');
      onRelationshipDefined();
      form.reset();
    } catch (err: any) {
      console.error(
        '[CREATE_RELATIONSHIP_SHEET] Error creating relationship:',
        err,
      );
      setError(
        err?.response?.data?.message ??
          'An unexpected error occurred. Please try again.',
      );
    } finally {
      setIsProcessing(false);
    }
  }

  // --- For the summary ---
  const watchedSourceId = form.watch('sourceId');
  const watchedTargetId = form.watch('targetId');
  const watchedType = form.watch('type') as RelationshipType;

  const sourcePerson = persons.find((p) => p.id === watchedSourceId);
  const targetPerson = persons.find((p) => p.id === watchedTargetId);
  const relationshipText = RelationshipLabels[watchedType];

  const showSummary = sourcePerson && targetPerson && relationshipText;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:w-[420px] sm:max-w-none inset-5 start-auto h-auto rounded-lg p-0 [&_[data-slot=sheet-close]]:top-4.5 [&_[data-slot=sheet-close]]:end-5">
        <SheetHeader className="border-b py-3.5 px-5 border-border">
          <SheetTitle>Define Relationship</SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex h-full flex-col"
          >
            <SheetBody className="flex-1 px-5 py-0">
              <ScrollArea className="h-full pe-3 -me-3">
                {error && (
                  <Alert
                    className="my-4"
                    variant="destructive"
                    appearance="light"
                    onClose={() => setError(null)}
                  >
                    <AlertIcon>
                      <AlertCircle />
                    </AlertIcon>
                    <AlertTitle>{error}</AlertTitle>
                  </Alert>
                )}

                {successMessage && (
                  <Alert
                    className="my-4"
                    appearance="light"
                    onClose={() => setSuccessMessage(null)}
                  >
                    <AlertIcon>
                      <Check />
                    </AlertIcon>
                    <AlertTitle>{successMessage}</AlertTitle>
                  </Alert>
                )}

                <CardContent className="flex flex-col space-y-4 p-5 p-0">
                  <FormField
                    disabled={!!target}
                    control={form.control}
                    name="targetId"
                    render={({ field }) => (
                      <FormItem className="grow flex flex-col">
                        <FormLabel>Target Person</FormLabel>
                        <InputGroup>
                          <PersonCombobox
                            persons={persons.filter(
                              (p) => p.id !== form.watch('sourceId'),
                            )}
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Select target person..."
                            isLoading={isFetchingPersons}
                            disabled={field.disabled}
                          />
                          <InputAddon>is</InputAddon>
                        </InputGroup>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem className="grow">
                        <FormLabel>Relationship</FormLabel>
                        <InputGroup>
                          <RelationshipCombobox
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Select relationship"
                          />
                          <InputAddon>of</InputAddon>
                        </InputGroup>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    disabled={!!source}
                    control={form.control}
                    name="sourceId"
                    render={({ field }) => (
                      <FormItem className="grow flex flex-col">
                        <FormLabel>Source Person</FormLabel>
                        <InputGroup>
                          <PersonCombobox
                            persons={persons}
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Select source person..."
                            isLoading={isFetchingPersons}
                            disabled={field.disabled}
                          />
                          <InputAddon>on</InputAddon>
                        </InputGroup>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lineageSide"
                    render={({ field }) => (
                      <FormItem className="grow">
                        <FormLabel>Lineage Side</FormLabel>
                        <InputGroup>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select lineage side" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.values(LineageSide).map((side) => (
                                <SelectItem key={side} value={side}>
                                  {capitalizeFirstLetter(
                                    side.toLowerCase().replace(/_/g, ' '),
                                  )}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <InputAddon>Side</InputAddon>
                        </InputGroup>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Separator />
                  <div className="flex flex-col sm:flex-row gap-4"></div>
                  {/* --- Relationship Summary --- */}
                  {showSummary && (
                    <div className="!mt-6 p-3 bg-muted/50 border border-border rounded-md text-sm text-muted-foreground text-center">
                      <span className="font-semibold text-foreground">
                        {targetPerson.firstName} {targetPerson.lastName}
                      </span>{' '}
                      is{' '}
                      <span className="font-semibold text-foreground">
                        {relationshipText}
                      </span>{' '}
                      of{' '}
                      <span className="font-semibold text-foreground">
                        {sourcePerson.firstName} {sourcePerson.lastName}
                      </span>
                      .
                    </div>
                  )}
                </CardContent>
              </ScrollArea>
            </SheetBody>
            <SheetFooter className="mt-auto border-t border-border py-3.5 px-5">
              <Button
                type="submit"
                className="grow"
                disabled={isProcessing || !!successMessage}
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <LoaderCircleIcon className="h-4 w-4 animate-spin" />
                    Creating Relationship...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <CheckCheckIcon className="h-4 w-4" /> Create Relationship
                  </span>
                )}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
