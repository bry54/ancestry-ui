import { Faq } from '@/partials/common/faq';
import { Help2 } from '@/partials/common/help2';

export function HelpSupportContent() {
  return (
    <div className="grid gap-5 lg:gap-7.5">
      <Faq />
      <Help2 />
    </div>
  );
}
