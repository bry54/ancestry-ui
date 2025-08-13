import { Fragment, useEffect, useState } from 'react';
import { API_URL } from '@/auth/adapters/jwt-auth-adapter';
import { CardUserMini } from '@/partials/cards';
import axios from 'axios';
import { ArrowRight, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Empty, Result, Spin } from 'antd';
import { RiArrowLeftDoubleFill, RiArrowRightDoubleFill } from '@remixicon/react';

export interface IAvatar {
  className: string;
  image?: string;
  imageClass?: string;
  fallback?: string;
  badgeClass: string;
}

export interface IMiniCardsContentItem {
  avatar: IAvatar;
  name: string;
  email: string;
  verify: boolean;
}
type IMiniCardsContentItems = Array<IMiniCardsContentItem>;

export function ProfilesListContent() {
  const [searchInput, setSearchInput] = useState('');
  const [items, setItems] = useState<IMiniCardsContentItems>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchPersons = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/persons`, {
          params: { page, limit },
        });
        const persons = response.data.data.map((person: any) => ({
          avatar: {
            className: 'size-20 relative',
            image: person.avatar || '300-1.png',
            imageClass: 'rounded-full',
            badgeClass:
              'flex size-2.5 bg-green-500 rounded-full absolute bottom-0.5 start-16 transform -translate-y-1/2',
          },
          name: `${person.firstName} ${person.lastName}`,
          email: person.email || 'no-email@example.com',
          verify: true,
        }));
        setItems(persons);
        setTotal(response.data.total);
      } catch (err) {
        setError('Failed to fetch persons.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPersons();
  }, [page, limit]);

  const renderItem = (item: IMiniCardsContentItem, index: number) => (
    <CardUserMini
      avatar={item.avatar}
      name={item.name}
      email={item.email}
      verify={item.verify}
      key={index}
    />
  );

  const Pagination = () => {
    return (
      <div className="flex grow justify-center items-center pt-5 lg:pt-7.5">
        <Button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="me-2"
        >
          <RiArrowLeftDoubleFill/>
        </Button>
        <span>
          Page {page} of {totalPages}
        </span>
        <Button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
          className="ms-2"
        >
          <RiArrowRightDoubleFill/>
        </Button>
      </div>
    );
  };

  const totalPages = Math.ceil(total / limit);

  if (loading) {
    return (
      <div className="w-full h-120 md:h-136 bg-white rounded-lg shadow p-2">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-120 md:h-136 bg-white rounded-lg shadow p-2">
        <Result
          status="error"
          title="Request failed"
          subTitle={error}
        />
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="w-full h-120 md:h-136 bg-white rounded-lg shadow p-2">
        <Empty description={<span>{error}</span>} />
      </div>
    );
  }

  return (
    <Fragment>
      <div className="flex items-center justify-between gap-2.5 flex-wrap mb-7.5">
        <h3 className="text-base text-mono font-medium">
          Showing {items.length} of {total} Users
        </h3>
        <div className="flex items-center flex-wrap gap-2.5">
          <div className="flex relative">
            <Search className="size-4 text-muted-foreground absolute start-3 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Type name, team"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="ps-9 w-40"
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-5 lg:gap-7.5">
        {items.map((item, index) => {
          return renderItem(item, index);
        })}
      </div>

      <Pagination />
    </Fragment>
  );
}
