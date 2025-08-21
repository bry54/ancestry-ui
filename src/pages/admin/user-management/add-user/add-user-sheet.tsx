import { useState } from 'react';
import { API_URL } from '@/auth/adapters/jwt-auth-adapter.ts';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import {
  AlertCircle,
  Check,
  CheckCheckIcon,
  LoaderCircleIcon,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Role } from '@/lib/enums';
import { Any } from '@/lib/interfaces';
import { Alert, AlertIcon, AlertTitle } from '@/components/ui/alert.tsx';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox.tsx';
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
  Sheet,
  SheetBody,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

interface AddUSerSheetProps {
  open: boolean;
  onOpenChange: () => void;
  productId: string | null;
  addUser: () => void;
}

interface IAddUSerDto {
  email: string;
  roles: string[];
}

const getAddUserSchema = () => {
  return z.object({
    email: z.string().min(1, { message: 'First name is required.' }),
    roles: z.array(z.string()).optional(),
    terms: z.boolean().refine((val) => val, {
      message: 'You must agree to the terms and conditions.',
    }),
  });
};

export type AddUserSchemaType = z.infer<ReturnType<typeof getAddUserSchema>>;

export function AddUserSheet({
  open,
  onOpenChange,
  addUser,
}: AddUSerSheetProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const form = useForm<AddUserSchemaType>({
    resolver: zodResolver(getAddUserSchema()),
    defaultValues: {
      email: '',
      roles: [''],
      terms: false,
    },
  });

  async function onSubmit(values: AddUserSchemaType) {
    try {
      setIsProcessing(true);
      setError(null);

      const dto: IAddUSerDto = {
        email: values.email,
        roles: values.roles ?? [Role.VIEWER],
      };

      await axios.post(`${API_URL}/user`, dto);

      setSuccessMessage('User added successfully.');
      addUser();
    } catch (err) {
      console.error('[ADD_USER_SHEET] Error adding User:', err);
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
      <SheetContent className="sm:w-[420px] sm:max-w-none inset-5 start-auto h-auto rounded-lg p-0 [&_[data-slot=sheet-close]]:top-4.5 [&_[data-slot=sheet-close]]:end-5">
        <SheetHeader className="border-b py-3.5 px-5 border-border">
          <SheetTitle>Add User</SheetTitle>
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
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="roles"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select Roles</FormLabel>
                        <FormControl>
                          <Checkbox defaultChecked={true} />
                        </FormControl>
                        <FormMessage />
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
                    Creating user...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <CheckCheckIcon className="h-4 w-4" /> Save User
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
