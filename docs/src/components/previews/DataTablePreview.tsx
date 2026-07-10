'use client'
import React, { useState } from 'react'
import { View } from 'react-native'
import { Preview } from './shared/Preview'
import { DataTable } from '../../../../packages/registry/components/data-table/data-table'

interface Row {
  id: string
  name: string
  role: string
  status: string
}

const DATA: Row[] = [
  { id: '1', name: 'Ava Thompson', role: 'Designer', status: 'Active' },
  { id: '2', name: 'Liam Chen', role: 'Engineer', status: 'Active' },
  { id: '3', name: 'Noah Patel', role: 'PM', status: 'Invited' },
  { id: '4', name: 'Sofia Martinez', role: 'Engineer', status: 'Active' },
]

const columns = [
  { key: 'name', title: 'Name', flex: 2, sortable: true },
  { key: 'role', title: 'Role', flex: 1, sortable: true },
  { key: 'status', title: 'Status', flex: 1 },
]

export default function DataTablePreview() {
  const [sortBy, setSortBy] = useState<string | undefined>(undefined)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [loading, setLoading] = useState(false)

  const sorted = [...DATA].sort((a, b) => {
    if (!sortBy) return 0
    const av = String((a as any)[sortBy])
    const bv = String((b as any)[sortBy])
    return sortDirection === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
  })

  return (
    <div className="space-y-10">
      <Preview title="Basic table" minHeight={220} code={`import { DataTable } from '~/components/ui/data-table'

const columns = [
  { key: 'name', title: 'Name', flex: 2 },
  { key: 'role', title: 'Role', flex: 1 },
  { key: 'status', title: 'Status', flex: 1 },
]

<DataTable columns={columns} data={data} keyExtractor={(row) => row.id} />`}>
        <View style={{ width: 380 }}>
          <DataTable columns={columns} data={DATA} keyExtractor={(row: Row) => row.id} />
        </View>
      </Preview>

      <Preview title="Sortable columns" minHeight={220} code={`const [sortBy, setSortBy] = useState()
const [sortDirection, setSortDirection] = useState('asc')

<DataTable
  columns={columns}
  data={data}
  sortBy={sortBy}
  sortDirection={sortDirection}
  onSort={(key, direction) => { setSortBy(key); setSortDirection(direction) }}
/>`}>
        <View style={{ width: 380 }}>
          <DataTable
            columns={columns}
            data={sorted}
            sortBy={sortBy}
            sortDirection={sortDirection}
            onSort={(key: string, direction: 'asc' | 'desc') => { setSortBy(key); setSortDirection(direction) }}
            keyExtractor={(row: Row) => row.id}
          />
        </View>
      </Preview>

      <Preview title="Striped and bordered" minHeight={220} code={`<DataTable columns={columns} data={data} striped bordered />`}>
        <View style={{ width: 380 }}>
          <DataTable columns={columns} data={DATA} striped bordered keyExtractor={(row: Row) => row.id} />
        </View>
      </Preview>

      <Preview title="Row press" minHeight={220} code={`<DataTable
  columns={columns}
  data={data}
  onRowPress={(row) => console.log(row.name)}
/>`}>
        <View style={{ width: 380 }}>
          <DataTable columns={columns} data={DATA} onRowPress={() => {}} keyExtractor={(row: Row) => row.id} />
        </View>
      </Preview>

      <Preview title="Loading skeleton" minHeight={220} code={`<DataTable columns={columns} data={[]} loading loadingRows={4} />`}>
        <View style={{ width: 380 }}>
          <DataTable columns={columns} data={[]} loading loadingRows={4} />
        </View>
      </Preview>

      <Preview title="Empty state" minHeight={220} code={`<DataTable columns={columns} data={[]} emptyMessage="No team members yet" />`}>
        <View style={{ width: 380 }}>
          <DataTable columns={columns} data={[]} emptyMessage="No team members yet" />
        </View>
      </Preview>
    </div>
  )
}
