"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DropdownMenu } from "@radix-ui/react-dropdown-menu"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import {FriendlyTime} from "@/components/friendly-time"
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Job = {
  id: string
  name: string
  enabled: string
  cron_expr: string
  command: string
  updated_at: string
  created_at: string

}

export const columns = (
  onEdit?: (data: any) => void,
  onDelete?: (id: any) => void,
  onSetEnabled?: (data: any) => void,

): ColumnDef<Job>[] => [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "name",
      header: "Name",
    },

    {
      accessorKey: "enabled",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("enabled")
        return (
          <div className="flex items-center">
            <span className={`h-2.5 w-2.5 rounded-full ${status ? "bg-green-500" : "bg-red-500"}`} />
            <span className="ml-2">{status ? "Enabled" : "Disabled"}</span>
          </div>
        )
      }
    },
    {
      accessorKey: "cron_expr",
      header: "Cron Expression",
    },
    {
      accessorKey: "command",
      header: "Command",
    },

 
    {
      accessorKey: "updated_at",
      header: "Updated At",
      cell: ({ row }) => {
        return (
          <div className="max-w-50 overflow-hidden text-ellipsis whitespace-nowrap">
            <FriendlyTime dateString={row.getValue("updated_at")} />
          </div>
        )
      }
    },
    {
      accessorKey: "created_at",
      header: "Created At",
      cell: ({ row }) => {
        return (
          <div className="max-w-50 overflow-hidden text-ellipsis whitespace-nowrap">
            <FriendlyTime dateString={row.getValue("created_at")} />
          </div>
        )
      }
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const job = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  // Toggle enabled status
                  if (onSetEnabled) {
                    onSetEnabled(job)
                  }
                }}
              >
                {job.enabled ? "禁用" : "启用"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  // Open edit dialog
                  if (onEdit) {
                    onEdit(job)
                  }
                }}
              >
                编辑
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  // Open delete confirmation dialog
                  if (onDelete) {
                    onDelete(job.id)
                  }
                }
                }
              >
                删除
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]
