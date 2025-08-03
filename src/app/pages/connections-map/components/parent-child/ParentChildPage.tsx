import {Content} from "../../../../../_metronic/layout/components/content";
import CollapsibleTree, {TreeNode} from "../../d3/CollapsibleTree.tsx";
import {useEffect, useState} from "react";
import axios from "axios";
import {Spin} from "antd";
import {useIntl} from "react-intl";

export function ParentChildPage() {
    const API_URL = import.meta.env.VITE_APP_API_URL;
    const FULL_URL = `${API_URL}/connections-map/parent-child`;

    const intl = useIntl()
    const [data, setData] = useState<TreeNode>();
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
                minHeight: '50vh',
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%", // Or a dynamic height based on parent
                width: "100%",
            }}>
            <CollapsibleTree data={data} />
            </div>
        </Content>
    );
}