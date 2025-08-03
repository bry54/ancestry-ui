import {KTCardBody} from '../../../../../_metronic/helpers'
import React, { useEffect, useState } from 'react';
import type { GetProp, TableProps } from 'antd';
import { Table } from 'antd';
import type { AnyObject } from 'antd/es/_util/type';
import type { SorterResult } from 'antd/es/table/interface';
import axios from "axios";

const API_URL = import.meta.env.VITE_APP_API_URL;
const PROFILES_URL = `${API_URL}/persons`;

type ColumnsType<T extends object = object> = TableProps<T>['columns'];
type TablePaginationConfig = Exclude<GetProp<TableProps, 'pagination'>, boolean>;

interface DataType {
    name: string;
    gender: string;
    email: string;
    id: string;
}

interface TableParams {
    pagination?: TablePaginationConfig;
    sortField?: SorterResult<any>['field'];
    sortOrder?: SorterResult<any>['order'];
    filters?: Parameters<GetProp<TableProps, 'onChange'>>[1];
}


const columns: ColumnsType<DataType> = [
    {
        title: 'First Name',
        dataIndex: 'firstName',
        sorter: true,
        width: '20%',
        fixed: 'left',
    },{
        title: 'Last Name',
        dataIndex: 'lastName',
        sorter: true,
        width: '20%',
    },
    {
        title: 'Gender',
        dataIndex: 'gender',
        filters: [
            { text: 'Male', value: 'male' },
            { text: 'Female', value: 'female' },
        ],
        width: '20%',
    },
    {
        title: 'Other Name',
        dataIndex: 'otherGivenNames',
    },
    {
        title: 'Father Names',
        dataIndex: 'fatherName',
    },,
    {
        title: 'Mother Name',
        dataIndex: 'fatherName',
    },
    {
        title: 'Action',
        key: 'operation',
        fixed: 'right',
        width: 100,
        render: () => {
            return (<span>
                <a>A1</a>
                <a>A2</a>
            </span>)
        },
    },
];

const toURLSearchParams = <T extends AnyObject>(record: T) => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(record)) {
        params.append(key, value);
    }
    return params;
};

const getRandomuserParams = (params: TableParams) => {
    const { pagination, filters, sortField, sortOrder, ...restParams } = params;
    const result: Record<string, any> = {};

    // https://github.com/mockapi-io/docs/wiki/Code-examples#pagination
    result.limit = pagination?.pageSize;
    result.page = pagination?.current;

    // https://github.com/mockapi-io/docs/wiki/Code-examples#filtering
    if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                result[key] = value;
            }
        });
    }

    // https://github.com/mockapi-io/docs/wiki/Code-examples#sorting
    if (sortField) {
        result.orderby = sortField;
        result.order = sortOrder === 'ascend' ? 'asc' : 'desc';
    }

    // 处理其他参数
    Object.entries(restParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            result[key] = value;
        }
    });

    return result;
};

const ProfilesTable: React.FC = () => {
    const [data, setData] = useState<DataType[]>();
    const [loading, setLoading] = useState(false);

    const [tableParams, setTableParams] = useState<TableParams>({
        pagination: {
            current: 1,
            pageSize: 10,
        },
    });

    const params = toURLSearchParams(getRandomuserParams(tableParams));

    const fetchData = () => {
        setLoading(true);
        axios.get(PROFILES_URL)
            .then((res) => {
                const data = res.data.data;
                setData(Array.isArray(data) ? data : []);
                setLoading(false);

                setTableParams({
                    ...tableParams,
                    pagination: {
                        ...tableParams.pagination,
                        total: 100,
                        // 100 is mock data, you should read it from server
                        // total: data.totalCount,
                    },
                });
            });
    };

    useEffect(fetchData, [
        tableParams.pagination?.current,
        tableParams.pagination?.pageSize,
        tableParams?.sortOrder,
        tableParams?.sortField,
        JSON.stringify(tableParams.filters),
    ]);

    const handleTableChange: TableProps<DataType>['onChange'] = (pagination, filters, sorter) => {
        setTableParams({
            pagination,
            filters,
            sortOrder: Array.isArray(sorter) ? undefined : sorter.order,
            sortField: Array.isArray(sorter) ? undefined : sorter.field,
        });

        // `dataSource` is useless since `pageSize` changed
        if (pagination.pageSize !== tableParams.pagination?.pageSize) {
            setData([]);
        }
    };

    return (
        <KTCardBody className='py-4'>
            <div className='table-responsive'>
        <Table<DataType>
            columns={columns}
            rowKey={(record) => record.id}
            dataSource={data}
            pagination={tableParams.pagination}
            loading={loading}
            onChange={handleTableChange}
            scroll={{ x: 'max-content' }}
        />
            </div>
        </KTCardBody>
    );
};

export {ProfilesTable}
