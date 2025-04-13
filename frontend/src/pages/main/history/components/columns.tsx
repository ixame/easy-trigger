"use client"
import { ColumnDef } from "@tanstack/react-table"
import  {FriendlyTime}  from "@/components/friendly-time"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type History = {
  id: number
  task_id: number
  created_at: string
  duration: number
  output: string
  status: string

}

export const columns: ColumnDef<History>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "task_id",
    header: "Task ID",
  },
  {
    accessorKey: "status",
    header: "Status",

  },
  {
    accessorKey: "duration",
    header: "Duration",
  },
  {
    accessorKey: "output",
    header:  "Output",
    cell: ({ row }) => {
      const output = row.getValue("output")
      return (
        <div className="max-w-60 overflow-hidden text-ellipsis whitespace-nowrap">
          {output}
        </div>
      )
    }
  },

  {
    accessorKey: "created_at",
    header: () => <div className="max-w-50">{"Executed At"}</div>,
    cell: ({ row }) => {
      return (
        <div className="max-w-50 overflow-hidden text-ellipsis whitespace-nowrap">
          <FriendlyTime dateString={row.getValue("created_at")} />
        </div>
      )
    }
  },
]
