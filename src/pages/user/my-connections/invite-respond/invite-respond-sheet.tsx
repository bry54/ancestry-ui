import { useEffect, useState } from 'react';
import { API_URL } from '@/auth/adapters/jwt-auth-adapter.ts';
import axios from 'axios';
import { AlertCircle, LoaderCircleIcon } from 'lucide-react';
import { Alert, AlertIcon, AlertTitle } from '@/components/ui/alert.tsx';
import { Button } from '@/components/ui/button';
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
        const response = await axios.get(`${API_URL}/invitations/${token}`);
        setInvitation(response.data);
      } catch (err) {
        setError('Failed to fetch invitation details.');
        console.error('[INVITE_RESPOND_CONTENT] Fetch Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInvite();
  }, []);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:w-[620px] sm:max-w-none inset-5 start-auto h-auto rounded-lg p-0 [&_[data-slot=sheet-close]]:top-4.5 [&_[data-slot=sheet-close]]:end-5">
        <SheetHeader className="border-b py-3.5 px-5 border-border">
          <SheetTitle>Invitation</SheetTitle>
        </SheetHeader>
        <SheetBody className="px-5 py-5">
          {loading && (
            <div className="flex items-center justify-center">
              <LoaderCircleIcon className="h-8 w-8 animate-spin" />
            </div>
          )}
          {error && (
            <Alert variant="destructive" appearance="light">
              <AlertIcon>
                <AlertCircle />
              </AlertIcon>
              <AlertTitle>{error}</AlertTitle>
            </Alert>
          )}
          {invitation && !loading && !error && (
            <div className="border p-4 rounded-md mb-4">
              <p className="text-lg">
                You have been invited to connect with{' '}
                <strong>{invitation.sourcePerson.firstName}</strong>.
              </p>
              <p className="text-sm text-gray-500">
                Invitation sent on:{' '}
                {new Date(invitation.createdAt).toLocaleDateString()}
              </p>
            </div>
          )}
        </SheetBody>
        <SheetFooter className="border-t py-3.5 px-5 border-border">
          <div className="flex gap-4">
            <Button onClick={onAccept} disabled={loading || !!error}>
              Accept
            </Button>
            <Button
              variant="destructive"
              onClick={onReject}
              disabled={loading || !!error}
            >
              Reject
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
