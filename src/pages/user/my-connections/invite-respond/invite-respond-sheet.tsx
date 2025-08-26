import { useEffect, useState } from 'react';
import { API_URL } from '@/auth/adapters/jwt-auth-adapter.ts';
import { Rating } from '@/pages/store-client/components/sheets/product-details-sheet.tsx';
import { Empty, Result, Spin } from 'antd';
import axios from 'axios';
import { CheckCheckIcon, UserCheck, UserX } from 'lucide-react';
import { toAbsoluteUrl } from '@/lib/helpers.ts';
import { Any } from '@/lib/interfaces';
import { Badge } from '@/components/ui/badge.tsx';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card.tsx';
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

const setupPersonSummary = (person: Any): Any[] => {
  const data: Any = [];
  const summaryProps = Object.keys(mappedData);
  Object.keys(person)
    .filter((key) => summaryProps.includes(key))
    .map((prop: string) => {
      data.push({
        text: mappedData[prop],
        info: person[prop],
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
  }, [token]);

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
        <SheetBody className="w-full flexjustify-center grow">
          <CardContent className="flex flex-col space-y-3 p-3">
            <Card className="relative items-center justify-center white-100 mb-6.5">
              <img
                src={toAbsoluteUrl('/media/avatars/blank.png')}
                className="size-50"
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

            <span className="text-sm font-normal text-foreground block mb-7">
              {invitation.sourcePerson.firstName}{' '}
              {invitation.sourcePerson.lastName} added you as {invitation.type}{' '}
              in the family tree. Do you wish to accept this invitation?
            </span>
          </CardContent>
        </SheetBody>
        <SheetFooter className="border-t py-3.5 px-5 border-border flex gap-2">
          <Button className="grow" disabled={isProcessing} onClick={onAccept}>
            <span className="flex items-center gap-2">
              <UserCheck className="h-4 w-4" /> Accept Invite
            </span>
          </Button>

          <Button
            className="grow bg-red-500 hover:bg-red-600 text-white"
            disabled={isProcessing}
            onClick={onReject}
          >
            <span className="flex items-center gap-2">
              <UserX className="h-4 w-4" /> Reject Invite
            </span>
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
