import {Content} from "../../../../../_metronic/layout/components/content";
import {useEffect, useState} from "react";
import axios from "axios";
import {Spin} from "antd";
import {useIntl} from "react-intl";
import ArcDiagram, {ArcData} from "../../d3/ArcDiagram.tsx";

export function ArchRelationsPage() {
  const API_URL = import.meta.env.VITE_APP_API_URL;
  const FULL_URL = `${API_URL}/connections-map/arc-relations`;

  const intl = useIntl()
  const [data, setData] = useState<ArcData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get(FULL_URL)
        setData(result.data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Content>
      <Spin size="large" tip={intl.formatMessage({id: 'GENERAL.LOADING'})}/>
    </Content>;
  }

  if (error) {
    return <Content>Error: {error}</Content>;
  }

  if (!data) {
    return <Content>No data available.</Content>;
  }

  return (
      <Content>
        <div className="card card-custom p-2" style={{
          display: "flex",
          minHeight: '50vh',
          flexDirection: "column",
          justifyContent: "start",
          alignItems: "start",
          //height: "100%", // Or a dynamic height based on parent
          //width: "100%",
        }}>
          <ArcDiagram data={data} />
        </div>
      </Content>
  );
}