import { ShoppingCart, Star } from 'lucide-react';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

interface StoreClientProductDetailsSheetProps {
  open: boolean;
  onOpenChange: () => void;
  productId: string | null;
  addPerson: ({ productId }: { productId: string }) => void;
}

export function AddPersonSheet({
  open,
  onOpenChange,
  productId,
  addPerson,
}: StoreClientProductDetailsSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:w-[520px] sm:max-w-none inset-5 start-auto h-auto rounded-lg p-0 [&_[data-slot=sheet-close]]:top-4.5 [&_[data-slot=sheet-close]]:end-5">
        <SheetHeader className="border-b py-3.5 px-5 border-border">
          <SheetTitle>Add Person</SheetTitle>
        </SheetHeader>
        <SheetBody className="px-5 py-0">
          <ScrollArea className="h-[calc(100dvh-11.75rem)] pe-3 -me-3">
            <CardContent className="flex flex-col space-y-3 p-5 p-0">
              Some things
            </CardContent>
          </ScrollArea>
        </SheetBody>
        <SheetFooter className="border-t py-3.5 px-5 border-border">
          <Button onClick={addPerson} disabled={!productId} className="grow">
            Save
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
