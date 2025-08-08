import { Fragment, useEffect, useState } from 'react';
import axios from 'axios';
import { useIntl } from 'react-intl';
import { ResponsiveCollapsibleTree } from '@/components/visuals/ResponsiveCollapsibleTree/ResponsiveCollapsibleTree.tsx';

export function TreeExplorerContent() {
  const API_URL = import.meta.env.VITE_API_URL;
  const FULL_URL = `${API_URL}/connections-map/parent-child`;

  const intl = useIntl();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get(FULL_URL);
        setData(result.data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Fragment>
      <div className="w-full h-80 md:h-96 bg-white rounded-lg shadow p-2">
        {data && <ResponsiveCollapsibleTree data={data} />}
      </div>
    </Fragment>
  );
}
