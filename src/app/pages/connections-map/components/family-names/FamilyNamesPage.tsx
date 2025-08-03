import {Content} from "../../../../../_metronic/layout/components/content";
import {useEffect, useState} from "react";
import axios from "axios";
import {Spin} from "antd";
import {useIntl} from "react-intl";
import WordCloud, {WordData} from "../../d3/WordCloud.tsx";

export function FamilyNamesPage() {
    const API_URL = import.meta.env.VITE_APP_API_URL;
    const FULL_URL = `${API_URL}/connections-map/name-distribution`;

    const intl = useIntl()
    const [data, setData] = useState<WordData[]>();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await axios.get(FULL_URL)
                setData(result.data as WordData[]);
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

            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%", // Or a dynamic height based on parent
                width: "100%",
            }}>
                <Content>
                    <WordCloud words={data} />
                </Content>
            </div>
    );
}