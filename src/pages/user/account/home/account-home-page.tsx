import { Fragment } from 'react';
import { UserHero } from '@/partials/common/user-hero';
import { Mail, MapPin, Zap } from 'lucide-react';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Container } from '@/components/common/container';
import { AccountUserProfileContent } from '@/pages/user/account';

export function AccountHomePage() {
  const image = (
    <img
      src={toAbsoluteUrl('/media/avatars/300-1.png')}
      className="rounded-full border-3 border-green-500 h-[100px] shrink-0"
      alt="image"
    />
  );

  return (
    <Fragment>
      <UserHero
        name="Jenny Klabber"
        image={image}
        info={[
          { label: 'KeenThemes', icon: Zap },
          { label: 'SF, Bay Area', icon: MapPin },
          { email: 'jenny@kteam.com', icon: Mail },
        ]}
      />
      <Container>
        <AccountUserProfileContent />
      </Container>
    </Fragment>
  );
}
