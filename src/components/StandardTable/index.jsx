import { Table } from 'antd'
import React from 'react'

export default function StandardTable({
    rowKey,
    columns,
    dataSource,
    typeRow,
    scroll,
    loading,
    pagination
}) {
    return (
        <Table
            rowSelection={{ type: typeRow}}
            scroll={scroll ? scroll : null}
            rowKey={rowKey || "id"}
            columns={columns}
            dataSource={dataSource}
            bordered
            loading={loading}
            pagination={pagination}
            
        />
    )
}
