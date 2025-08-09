import { Fragment, useEffect, useState } from 'react';
import { Empty, Spin } from 'antd';
import axios from 'axios';
import { useIntl } from 'react-intl';
import { Any } from '@/lib/interfaces';
import { networkData } from '@/components/visuals/data/network-data.ts';
import { ResponsiveForceGraph } from '@/components/visuals/ResponsiveForceGraph.tsx';
import { ResponsiveWordCloud } from '@/components/visuals/ResponsiveWordCloud/ResponsiveWordCloud.tsx';

export function FamilySizeContent() {
  const API_URL = import.meta.env.VITE_API_URL;
  const FULL_URL = `${API_URL}/connections-map/name-distribution`;

  const intl = useIntl();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get(FULL_URL);
        setData(result.data);
      } catch (e: Any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-120 md:h-136 bg-white rounded-lg shadow p-2">
        <Spin size="large" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="w-full h-120 md:h-136 bg-white rounded-lg shadow p-2 mt-2">
        <Empty description={<span>{error}</span>} />
      </div>
    );
  }

  return (
    <Fragment>
      <div className="w-full h-120 md:h-136 bg-white rounded-lg p-2">
        <ResponsiveForceGraph data={networkData} />
      </div>
    </Fragment>
  );
}
