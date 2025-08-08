import { BasicSettings, PersonalInfo } from './components';
import { Password } from '@/pages/user/account/home/components/password.tsx';
import { DeleteAccount } from '@/pages/user/account/home/components/delete-account.tsx';

export function AccountUserProfileContent() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 lg:gap-7.5">
      <div className="col-span-1">
        <div className="grid gap-5 lg:gap-7.5">
          <BasicSettings title="Security Settings" />
          <Password />
          <DeleteAccount />
        </div>
      </div>
      <div className="col-span-1">
        <div className="grid gap-5 lg:gap-7.5">
          <PersonalInfo />
        </div>
      </div>
    </div>
  );
}
