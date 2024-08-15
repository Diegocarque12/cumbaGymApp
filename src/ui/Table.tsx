import React, { useState } from 'react'

interface TableProps<T> {
    data: T[]
    columns: {
        header: string
        accessor: keyof T
        render?: (value: T[keyof T], item: T) => React.ReactNode
    }[]
    onEdit?: (item: T) => void
    onDelete?: (item: T) => void
    onCopy?: (item: T) => void
}

function Table<T extends { id: number | string }>({ data, columns, onEdit, onDelete, onCopy }: TableProps<T>) {
    const [sortColumn, setSortColumn] = useState<keyof T | null>(null)
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

    const handleSort = (column: keyof T) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
        } else {
            setSortColumn(column)
            setSortDirection('asc')
        }
    }

    const sortedData = [...data].sort((a, b) => {
        if (!sortColumn) return 0
        const aValue = a[sortColumn]
        const bValue = b[sortColumn]
        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
        return 0
    })

    return (
        <div className="overflow-x-auto">
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-gray-200">
                        {columns.map((column) => (
                            <th
                                key={column.accessor.toString()}
                                className="border p-2 whitespace-nowrap cursor-pointer"
                                onClick={() => handleSort(column.accessor)}
                            >
                                {column.header}
                                {sortColumn === column.accessor && (
                                    <span className="ml-1">{sortDirection === 'asc' ? '▲' : '▼'}</span>
                                )}
                            </th>
                        ))}
                        {(onEdit || onDelete || onCopy) && <th className="border p-2 whitespace-nowrap">Acciones</th>}
                    </tr>
                </thead>
                <tbody>
                    {sortedData.map((item) => (
                        <tr key={item.id}>
                            {columns.map((column) => (
                                <td key={column.accessor.toString()} className="border p-2 text-center">
                                    {column.render
                                        ? column.render(item[column.accessor], item)
                                        : item[column.accessor]?.toString()}
                                </td>
                            ))}
                            {(onEdit || onDelete || onCopy) && (
                                <td className="border p-2 text-center flex gap-2 justify-center">
                                    {onCopy && (
                                        <button
                                            onClick={() => onCopy(item)}
                                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex items-center" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                                                <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                                            </svg>
                                        </button>
                                    )}
                                    {onEdit && (
                                        <button
                                            onClick={() => onEdit(item)}
                                            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-2 rounded"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex items-center" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                            </svg>
                                        </button>
                                    )}
                                    {onDelete && (
                                        <button
                                            onClick={() => onDelete(item)}
                                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex items-center" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    )}
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Table
