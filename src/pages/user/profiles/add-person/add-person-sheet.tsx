import { useState } from 'react';
import { API_URL } from '@/auth/adapters/jwt-auth-adapter.ts';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { format } from 'date-fns';
import { AlertCircle, CalendarDays, Check, CheckCheckIcon, LoaderCircleIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Gender, LifeStatus } from '@/lib/enums';
import { cn } from '@/lib/utils.ts';
import { Alert, AlertIcon, AlertTitle } from '@/components/ui/alert.tsx';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar.tsx';
import { CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox.tsx';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input.tsx';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.tsx';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.tsx';
import { Separator } from '@/components/ui/separator.tsx';
import { Sheet, SheetBody, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useAuth } from '@/auth/context/auth-context.ts';
import { UserModel } from '@/lib/interfaces';


interface AddPersonSheetProps {
  open: boolean;
  onOpenChange: () => void;
  productId: string | null;
  addPerson: () => void;
}

interface StateDates {
  dateOfBirth: Date | undefined;
  dateOfDeath: Date | undefined;
}

interface IPlace {
  "city": string | undefined;
  "country": string | undefined;
}


interface IAddPersonDto {
  lifeStatus: LifeStatus;
  firstName: string,
  lastName: string,
  dateOfBirth: Date | undefined,
  dateOfDeath: Date | undefined,
  gender: string | undefined,
  otherGivenNames: string[] | undefined,
  motherName: string | undefined,
  fatherName: string | undefined,
  placeOfBirth: IPlace,
  placeOfDeath: IPlace,
  userId: string
}

const defaultStateDates = {
  dateOfBirth: undefined,
  dateOfDeath: undefined,
};

const getAddPersonSchema = () => {
  return z.object({
    firstName: z.string().min(1, { message: 'First name is required.' }),
    lastName: z.string().min(1, { message: 'Last name is required.' }),
    otherGivenNames: z.string().optional(),
    placeOfBirth: z.string().optional(),
    dateOfBirth: z.date().optional(),
    placeOfDeath: z.string().optional(),
    dateOfDeath: z.date().optional(),
    motherName: z.string().optional(),
    fatherName: z.string().optional(),
    gender: z.string().optional(),
    terms: z.boolean().refine((val) => val === true, {
      message: 'You must agree to the terms and conditions.',
    }),
    lifeStatus: z.string(),
  });
};

export type AddPersonSchemaType = z.infer<
  ReturnType<typeof getAddPersonSchema>
>;

export function AddPersonSheet({
  open,
  onOpenChange,
  addPerson,
}: AddPersonSheetProps) {
  const [stateDates, setStateDates] = useState<StateDates>(defaultStateDates);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isDeceased, setIsDeceased] = useState<boolean>(false);
  const {user} = useAuth();

  const form = useForm<AddPersonSchemaType>({
    resolver: zodResolver(getAddPersonSchema()),
    defaultValues: {
      firstName: '',
      lastName: '',
      otherGivenNames: '',
      placeOfBirth: '',
      dateOfBirth: new Date(),
      placeOfDeath: '',
      dateOfDeath: new Date(),
      lifeStatus: '',
      gender: '',
      terms: false,
    },
  });

  const handleDateChanges = (key: any, value: any) => {
    setStateDates({
      ...stateDates,
      [key]: value,
    });

    form.setValue(key, value);
  };

  async function onSubmit(values: AddPersonSchemaType) {
    try {
      setIsProcessing(true);
      setError(null);
      const birthPlaceData = values.placeOfDeath?.split(',');
      const deathPlaceData = values.placeOfDeath?.split(',');

      const dto: IAddPersonDto = {
        lifeStatus: values.lifeStatus as LifeStatus,
        firstName: values.firstName,
        lastName: values.lastName,
        dateOfBirth: values.dateOfBirth,
        dateOfDeath: values.dateOfDeath,
        gender: values.gender,
        otherGivenNames: values.otherGivenNames?.split(','),
        motherName: values.motherName,
        fatherName: values.fatherName,
        placeOfBirth: birthPlaceData ? { city: birthPlaceData[0], country: birthPlaceData[1]} : {city: undefined, country: undefined},
        placeOfDeath: deathPlaceData ? { city: deathPlaceData[0], country: deathPlaceData[1]} : {city: undefined, country: undefined},
        userId: user!.id
      };
      
      await axios.post(`${API_URL}/persons`, dto)

      setSuccessMessage('Person added successfully.');
      addPerson();
    } catch (err) {
      console.error('[ADD_PERSON_SHEET] Error adding person:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'An unexpected error occurred. Please try again.',
      );
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:w-[520px] sm:max-w-none inset-5 start-auto h-auto rounded-lg p-0 [&_[data-slot=sheet-close]]:top-4.5 [&_[data-slot=sheet-close]]:end-5">
        <SheetHeader className="border-b py-3.5 px-5 border-border">
          <SheetTitle>Add Person</SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="block w-full space-y-5"
          >
            <SheetBody className="px-5 py-0">
              {error && (
                <Alert
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
                  appearance="light"
                  onClose={() => setSuccessMessage(null)}
                >
                  <AlertIcon>
                    <Check />
                  </AlertIcon>
                  <AlertTitle>{successMessage}</AlertTitle>
                </Alert>
              )}

              <ScrollArea className="h-[calc(100dvh-11.75rem)] pe-3 -me-3">
                <CardContent className="flex flex-col space-y-3 p-5 p-0">
                  <FormField
                    control={form.control}
                    name="lifeStatus"
                    rules={{ required: 'Select a life status' }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Life Status</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={(value) => {
                              if (value === LifeStatus.DECEASED) {
                                setIsDeceased(true);
                              } else {
                                setIsDeceased(false);
                              }
                              field.onChange(value);
                            }}
                            value={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={LifeStatus.ALIVE}>
                                Alive
                              </SelectItem>
                              <SelectItem value={LifeStatus.DECEASED}>
                                Deceased
                              </SelectItem>
                              <SelectItem value={LifeStatus.UNKNOWN}>
                                Unknown
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {isDeceased && (
                    <div className="flex gap-2">
                      <div className="grow">
                        <FormField
                          control={form.control}
                          name="placeOfDeath"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Place of Death</FormLabel>
                              <FormControl>
                                <Input placeholder="City, Country" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grow">
                        <FormLabel>Date Of Death</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              mode="input"
                              variant="outline"
                              id="date"
                              className={cn(
                                'w-full data-[state=open]:border-primary',
                                !stateDates?.dateOfDeath &&
                                  'text-muted-foreground',
                              )}
                            >
                              <CalendarDays className="-ms-0.5" />
                              {stateDates.dateOfDeath ? (
                                format(stateDates.dateOfDeath, 'LLL dd, y')
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              initialFocus
                              mode="single"
                              defaultMonth={stateDates.dateOfDeath}
                              selected={stateDates.dateOfDeath}
                              onSelect={(value) =>
                                handleDateChanges('dateOfDeath', value)
                              }
                              numberOfMonths={1}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  )}

                  <Separator className="my-4" />

                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your first name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your last name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-2">
                    <div className="grow">
                      <FormField
                        control={form.control}
                        name="otherGivenNames"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Other Given Names</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Other Given Names"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grow">
                      <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Gender</FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value={Gender.MALE}>
                                    Male
                                  </SelectItem>
                                  <SelectItem value={Gender.FEMALE}>
                                    Female
                                  </SelectItem>
                                  <SelectItem value={Gender.OTHER}>
                                    Other
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <div className="grow">
                      <FormField
                        control={form.control}
                        name="placeOfBirth"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Place of Birth</FormLabel>
                            <FormControl>
                              <Input placeholder="City, Country" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grow">
                      <FormLabel>Date Of Birth</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            mode="input"
                            variant="outline"
                            id="date"
                            className={cn(
                              'w-full data-[state=open]:border-primary',
                              !stateDates?.dateOfBirth &&
                                'text-muted-foreground',
                            )}
                          >
                            <CalendarDays className="-ms-0.5" />
                            {stateDates.dateOfBirth ? (
                              format(stateDates.dateOfBirth, 'LLL dd, y')
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            initialFocus
                            mode="single"
                            defaultMonth={stateDates.dateOfBirth}
                            selected={stateDates.dateOfBirth}
                            onSelect={(value) =>
                              handleDateChanges('dateOfBirth', value)
                            }
                            numberOfMonths={1}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <FormField
                    control={form.control}
                    name="fatherName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Father's Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your father's first name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="motherName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mother's Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your mother's first name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator className="my-4" />

                  <FormField
                    control={form.control}
                    name="terms"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-0.5 space-y-0 rounded-md">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm text-muted-foreground">
                            I confirm that the information I have provided is
                            accurate to the best of my knowledge, and I consent
                            to its use for the purpose of creating and
                            maintaining the family tree.
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </ScrollArea>
            </SheetBody>
            <SheetFooter className="border-t py-3.5 px-5 border-border">
              <Button type="submit" className="grow" disabled={isProcessing}>
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <LoaderCircleIcon className="h-4 w-4 animate-spin" />{' '}
                    Creating account...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <CheckCheckIcon className="h-4 w-4" /> Save Person
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
