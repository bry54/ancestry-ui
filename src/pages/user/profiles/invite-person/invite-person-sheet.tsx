import { useState } from 'react';
import { API_URL } from '@/auth/adapters/jwt-auth-adapter.ts';
import { IInvitePersonDto } from '@/pages/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { Empty } from 'antd';
import axios from 'axios';
import {
  AlertCircle,
  Check,
  CheckCheckIcon,
  LoaderCircleIcon,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { LineageSide, RelationshipType } from '@/lib/enums';
import { capitalizeFirstLetter } from '@/lib/helpers.ts';
import { Any } from '@/lib/interfaces';
import { Alert, AlertIcon, AlertTitle } from '@/components/ui/alert.tsx';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input.tsx';
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

interface InvitePersonSheetProps {
  open: boolean;
  onOpenChange: () => void;
  onInvitePerson: () => void;
  person: any;
}

const getInvitePersonSchema = () => {
  return z.object({
    email: z.string().email({ message: 'Invalid email address.' }),
    phone: z.string().optional(),
    type: z.string().optional(),
    lineageSide: z.string().optional(),
  });
};

export type InvitePersonSchemaType = z.infer<
  ReturnType<typeof getInvitePersonSchema>
>;

export function InvitePersonSheet({
  open,
  onOpenChange,
  onInvitePerson,
  person,
}: InvitePersonSheetProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const form = useForm<InvitePersonSchemaType>({
    resolver: zodResolver(getInvitePersonSchema()),
    defaultValues: {
      email: '',
      phone: '',
      type: '',
      lineageSide: '',
    },
  });

  async function onSubmit(values: InvitePersonSchemaType) {
    try {
      setIsProcessing(true);
      setError(null);

      const dto: IInvitePersonDto = {
        email: values.email,
        phone: values.phone,
        targetPersonId: person.id,
        type: values.type as RelationshipType,
        lineageSide: values.lineageSide as LineageSide,
      };

      await axios.post(`${API_URL}/invitations/create`, dto);

      setSuccessMessage('Invitation sent successfully.');
      onInvitePerson();
    } catch (err: Any) {
      console.error('[INVITE_PERSON_SHEET] Error sending invitation:', err);
      setError(
        err?.response?.data?.message ??
          'An unexpected error occurred. Please try again.',
      );
    } finally {
      setIsProcessing(false);
    }
  }

  if (!person)
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="justify-center sm:w-[620px] sm:max-w-none inset-5 start-auto h-auto rounded-lg p-0 [&_[data-slot=sheet-close]]:top-4.5 [&_[data-slot=sheet-close]]:end-5">
          <Empty description={'No person selected'} />
        </SheetContent>
      </Sheet>
    );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:w-[620px] sm:max-w-none inset-5 start-auto h-auto rounded-lg p-0 [&_[data-slot=sheet-close]]:top-4.5 [&_[data-slot=sheet-close]]:end-5">
        <SheetHeader className="border-b py-3.5 px-5 border-border">
          <SheetTitle>Invite Person</SheetTitle>
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
                  <div className="flex gap-2">
                    <div className="grow">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter email address"
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
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter phone number"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  <Separator />
                  <div className="flex gap-2">
                    <div className="grow">
                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Select relationship</FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={(value) => {
                                  field.onChange(value);
                                }}
                                value={field.value}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select relationship" />
                                </SelectTrigger>
                                <SelectContent>
                                  {Object.entries(RelationshipType).map(
                                    ([key, value]) => {
                                      console.log(key, value);
                                      return (
                                        <SelectItem key={value} value={value}>
                                          {capitalizeFirstLetter(
                                            value
                                              .toLowerCase()
                                              .replace(/_/g, ' '),
                                          )}
                                        </SelectItem>
                                      );
                                    },
                                  )}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grow">
                      <FormField
                        control={form.control}
                        name="lineageSide"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Select lineage side</FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={(value) => {
                                  field.onChange(value);
                                }}
                                value={field.value}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select lineage side" />
                                </SelectTrigger>
                                <SelectContent>
                                  {Object.entries(LineageSide).map(
                                    ([key, value]) => (
                                      <SelectItem key={value} value={value}>
                                        {capitalizeFirstLetter(
                                          value
                                            .toLowerCase()
                                            .replace(/_/g, ' '),
                                        )}
                                      </SelectItem>
                                    ),
                                  )}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              </ScrollArea>
            </SheetBody>
            <SheetFooter className="border-t py-3.5 px-5 border-border">
              <Button type="submit" className="grow" disabled={isProcessing}>
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <LoaderCircleIcon className="h-4 w-4 animate-spin" />{' '}
                    Sending invitation...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <CheckCheckIcon className="h-4 w-4" /> Invite Person
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
