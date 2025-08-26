import { useEffect, useState } from 'react';
import { API_URL } from '@/auth/adapters/jwt-auth-adapter.ts';
import { zodResolver } from '@hookform/resolvers/zod';
import { Empty, Result, Spin } from 'antd';
import axios from 'axios';
import { UserCheck, UserX } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toAbsoluteUrl } from '@/lib/helpers.ts';
import { Any } from '@/lib/interfaces';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card.tsx';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form.tsx';
import { Input } from '@/components/ui/input.tsx';
import { ScrollArea } from '@/components/ui/scroll-area.tsx';
import { Separator } from '@/components/ui/separator.tsx';
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

interface InviteRespondSheetProps {
  open: boolean;
  onOpenChange: () => void;
  onAccept: () => void;
  onReject: () => void;
  token: string | null;
}

const mappedData: Any = {
  firstName: 'First name',
  lastName: 'Last name',
  motherName: 'Mother name',
  fatherName: 'Father name',
  otherGivenNames: 'Other names',
};

const getInviteResponseSchema = () => {
  return z
    .object({
      password: z.string().optional(),
      passwordConfirm: z.string().optional(),
    })
    .refine((data) => data.password === data.passwordConfirm, {
      message: 'Passwords are not matching',
      path: ['passwordConfirm'],
    });
};

export type InviteResponseSchema = z.infer<
  ReturnType<typeof getInviteResponseSchema>
>;

const setupPersonSummary = (person: Any): Any[] => {
  const data: Any = [];
  const summaryProps = Object.keys(mappedData);
  Object.keys(person)
    .filter((key) => summaryProps.includes(key))
    .map((prop: string) => {
      const isArray = Array.isArray(person[prop]);
      data.push({
        text: mappedData[prop],
        info: isArray ? person[prop][0] : person[prop],
      });
    });

  return data;
};

export function InviteRespondSheet({
  open,
  onOpenChange,
  onAccept,
  onReject,
  token,
}: InviteRespondSheetProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [invitation, setInvitation] = useState<any | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [items, setItems] = useState<Any>([]);

  const form = useForm<InviteResponseSchema>({
    resolver: zodResolver(getInviteResponseSchema()),
    defaultValues: {
      password: '',
      passwordConfirm: '',
    },
  });

  useEffect(() => {
    const fetchInvite = async () => {
      if (!token) {
        setError('No invitation token provided.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          `${API_URL}/invitations/fetch/${token}`,
        );
        const invitation = response.data;
        const sourceDetails = setupPersonSummary(invitation.sourcePerson);
        setItems(sourceDetails);
        setInvitation(invitation);
      } catch (err: Any) {
        setError(
          err.response?.data?.message || 'Failed to fetch invitation details.',
        );
        console.error('[INVITE_RESPOND_CONTENT] Fetch Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInvite();
  }, []);

  async function onSubmit(values: InviteResponseSchema) {
    try {
      setIsProcessing(true);
      setError(null);

      const dto: Any = {
        token: token,
        password: values.password,
      };

      await axios.post(`${API_URL}/invitations/accept`, dto);
      onAccept();
    } catch (err: Any) {
      console.error(
        '[INVITATION_RESPONSE_SHEET] Error accepting invitation:',
        err,
      );
      setError(
        err.response?.data?.message ||
          'An unexpected error occurred. Please try again.',
      );
    } finally {
      setIsProcessing(false);
    }
  }

  async function rejectInvitation() {
    try {
      setIsProcessing(true);
      setError(null);
      const dto: Any = {
        token: token,
      };
      await axios.post(`${API_URL}/invitations/reject`, dto);
      onReject();
    } catch (err: Any) {
      console.error(
        '[INVITATION_RESPONSE_SHEET] Error rejecting invitation:',
        err,
      );
      setError(
        err.response?.data?.message ||
          'An unexpected error occurred. Please try again.',
      );
    } finally {
      setIsProcessing(false);
    }
  }

  if (loading) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="sm:w-[620px] sm:max-w-none inset-5 start-auto h-auto rounded-lg p-0 [&_[data-slot=sheet-close]]:top-4.5 [&_[data-slot=sheet-close]]:end-5">
          <div className="w-full flex items-center justify-center grow bg-white rounded-lg shadow p-2">
            <Spin size="large" />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  if (error) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="sm:w-[620px] sm:max-w-none inset-5 start-auto h-auto rounded-lg p-0 [&_[data-slot=sheet-close]]:top-4.5 [&_[data-slot=sheet-close]]:end-5">
          <div className="w-full flex items-center justify-center grow bg-white rounded-lg shadow p-2">
            <Result status="error" title="Request failed" subTitle={error} />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  if (!invitation) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="sm:w-[620px] sm:max-w-none inset-5 start-auto h-auto rounded-lg p-0 [&_[data-slot=sheet-close]]:top-4.5 [&_[data-slot=sheet-close]]:end-5">
          <div className="w-full flex items-center justify-center grow bg-white rounded-lg shadow p-2">
            <Empty description={<span>{error}</span>} />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:w-[520px] sm:max-w-none inset-5 start-auto h-auto rounded-lg p-0 [&_[data-slot=sheet-close]]:top-4.5 [&_[data-slot=sheet-close]]:end-5">
        <SheetHeader className="border-b py-3.5 px-5 border-border">
          <SheetTitle>Invitation</SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="block w-full space-y-5"
          >
            <SheetBody className="px-5 py-0">
              <ScrollArea className="h-[calc(100dvh-11.75rem)] pe-3 -me-3">
                <CardContent className="flex flex-col space-y-3 p-3">
                  <Card className="flex items-center justify-center white-100 mb-4">
                    <img
                      src={toAbsoluteUrl('/media/avatars/blank.png')}
                      className="size-40"
                      alt="image"
                    />
                  </Card>

                  <div className="flex flex-col gap-2.5 lg:mb-5">
                    {items.map((item: Any, index: number) => (
                      <div className="flex items-center gap-2.5" key={index}>
                        <span className="text-sm font-light text-foreground min-w-14 xl:min-w-24 shrink-0">
                          {item?.text}
                        </span>
                        <span className="text-sm font-medium text-foreground min-w-14 xl:min-w-24 shrink-0">
                          {item?.info}
                        </span>
                      </div>
                    ))}
                  </div>

                  <span className="text-sm font-normal text-foreground block mb-3">
                    {invitation.sourcePerson.firstName}{' '}
                    {invitation.sourcePerson.lastName} added you as{' '}
                    {invitation.type} in the family tree. Do you wish to accept
                    this invitation?
                    <div className="mt-3">
                      {!invitation.targetPerson?.user?.id
                        ? 'Accepting this invitation will allow you login and extend the family tree. Set your password below'
                        : null}
                    </div>
                  </span>
                  {!invitation.targetPerson?.user?.id && (
                    <div>
                      <Separator className="mb-3"></Separator>
                      <div className="flex gap-2">
                        <div className="grow">
                          <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                  <Input
                                    type="password"
                                    placeholder="Password"
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
                            name="passwordConfirm"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Confirm Password</FormLabel>
                                <FormControl>
                                  <Input
                                    type="password"
                                    placeholder="confirmPassword"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </ScrollArea>
            </SheetBody>
            <SheetFooter className="border-t py-3.5 px-5 border-border flex gap-2">
              <Button className="grow" disabled={isProcessing} type="submit">
                <span className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4" /> Accept Invite
                </span>
              </Button>

              <Button
                className="grow bg-red-500 hover:bg-red-600 text-white"
                disabled={isProcessing}
                onClick={rejectInvitation}
              >
                <span className="flex items-center gap-2">
                  <UserX className="h-4 w-4" /> Reject Invite
                </span>
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
