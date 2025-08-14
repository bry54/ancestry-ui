import { Fragment } from 'react';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Card, CardContent } from '@/components/ui/card';
import { HeartHandshakeIcon, InboxIcon, MailboxIcon, SendIcon, UsersIcon } from 'lucide-react';

interface IChannelStatsItem {
  icon: React.ReactNode;
  logoDark?: string;
  info: string;
  desc: string;
  path: string;
}
type IChannelStatsItems = Array<IChannelStatsItem>;

const ChannelStats = () => {
  const iconSize = 40;
  const items: IChannelStatsItems = [
    {
      icon: <UsersIcon color='blue' size={iconSize} className='m-5'/>,
      info: '9.3k',
      desc: 'People in your Tree',
      path: ''
    },
    {
      icon: <HeartHandshakeIcon color='red' size={iconSize} className='m-5'/>,
      info: '24k',
      desc: 'Direct relatives (parents/siblings/children)',
      path: ''
    },
    {
      icon: <SendIcon color='green' size={iconSize} className='m-5'/>,
      info: '608',
      desc: 'Invitations Sent',
      path: '',
    },
    {
      icon: <InboxIcon color='purple' size={iconSize} className='m-5'/>,
      logoDark: 'tiktok-dark.svg',
      info: '2.5k',
      desc: 'Invitations Received',
      path: '',
    },
  ];

  const renderItem = (item: IChannelStatsItem, index: number) => {
    return (
      <Card key={index}>
        <CardContent className="p-0 flex flex-col justify-between gap-6 h-full bg-cover rtl:bg-[left_top_-1.7rem] bg-[right_top_-1.7rem] bg-no-repeat channel-stats-bg">
          {item.icon}
          <div className="flex flex-col gap-1 pb-4 px-5">
            <span className="text-3xl font-semibold text-mono">
              {item.info}
            </span>
            <span className="text-sm font-normal text-muted-forehead">
              {item.desc}
            </span>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Fragment>
      <style>
        {`
          .channel-stats-bg {
            background-image: url('${toAbsoluteUrl('/media/images/2600x1600/bg-3.png')}');
          }
          .dark .channel-stats-bg {
            background-image: url('${toAbsoluteUrl('/media/images/2600x1600/bg-3-dark.png')}');
          }
        `}
      </style>

      {items.map((item, index) => {
        return renderItem(item, index);
      })}
    </Fragment>
  );
};

export { ChannelStats, type IChannelStatsItem, type IChannelStatsItems };
