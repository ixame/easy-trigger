import { GetTaskLogs } from "@/apis/tasks";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export default function History() {
    const [data, setData] = useState([]);
    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 10,
        total: 0,
    });

    const [filter, setFilter] = useState({
        task_id: "",
    });

    const fetchData = async () => {
        try {
            const response = await GetTaskLogs({
                page: pagination.page,
                pageSize: pagination.pageSize,
                task_id: filter.task_id,
            });
            const logs = response.data.data;
            setData(logs);
            setPagination((prev) => ({
                ...prev,
                total: response.data.total,
            }));
        } catch (error) {
            console.error("Error fetching logs:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [pagination.page, pagination.pageSize]);
    useEffect( () => {
        //每10秒刷新一次
        const interval = setInterval(() => {
            fetchData();
        }, 10000);
        return () => clearInterval(interval);
    }, []);
    return (
        <div className="container mx-auto py-10 px-20">
             <div className="flex justify-between items-center mb-4">
             <h1 className="text-xl font-bold">History</h1>
             <div className="flex items-center">

             <Input
                    placeholder="Filter Task ID"
                    value={filter.task_id}
                    onChange={(event) =>
                        setFilter((prev) => ({
                            ...prev,
                            task_id: event.target.value,
                        })
                        )
                    }
                    onKeyDown={(event) => {
                        if (event.key === "Enter") {
                            setPagination((prev) => ({
                                ...prev,
                                page: 1,
                            }));
                            fetchData();
                        }
                    }}
                    className="max-w-sm"
                />
                <Button onClick={
                    () => {
                        setPagination((prev) => ({
                            ...prev,
                            page: 1,
                        }));
                        fetchData();
                    }
                } className="ml-2">Filter</Button>
             </div>
              

            </div>
            <DataTable columns={columns} data={data} />
            {/* <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {'Total:'} {pagination.total} {'items'}
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            setPagination((prev) => ({
                                ...prev,
                                page: Math.max(prev.page - 1, 1),
                            }));
                        }}
                        disabled={pagination.page === 1}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            setPagination((prev) => ({
                                ...prev,
                                page: Math.min(prev.page + 1, Math.ceil(pagination.total / pagination.pageSize)),
                            }));
                        }}
                        disabled={pagination.page === Math.ceil(pagination.total / pagination.pageSize)}
                    >
                        Next
                    </Button>
                </div>
            </div> */}
            <div className="flex items-center justify-between px-4 pt-4">
                <div className="hidden flex-1 text-sm text-muted-foreground lg:flex">
                    {'Total:'} {pagination.total}
                </div>
                <div className="flex w-full items-center gap-8 lg:w-fit">
                    <div className="hidden items-center gap-2 lg:flex">
                        <Select
                            value={`${pagination.pageSize}`}
                            onValueChange={(value) => {
                                setPagination((prev) => ({
                                    ...prev,
                                    pageSize: parseInt(value),
                                    page: 1,
                                }));
                            }}
                        >
                            <SelectTrigger className="w-20" id="rows-per-page">
                                <SelectValue
                                    placeholder={pagination.pageSize}
                                />
                            </SelectTrigger>
                            <SelectContent side="top">
                                {[10, 20, 30, 40, 50].map((pageSize) => (
                                    <SelectItem key={pageSize} value={`${pageSize}`}>
                                        {pageSize}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex w-fit items-center justify-center text-sm font-medium">
                        Page {pagination.page} of{" "}
                        {Math.ceil(pagination.total / pagination.pageSize)}
                    </div>
                    <div className="ml-auto flex items-center gap-2 lg:ml-0">
                        <Button
                            variant="outline"
                            className="hidden h-8 w-8 p-0 lg:flex"
                            onClick={() => {
                                setPagination((prev) => ({
                                    ...prev,
                                    page: 1,
                                }));
                            }}
                            disabled={pagination.page === 1}
                        >
                            <span className="sr-only">Go to first page</span>
                            <ChevronsLeftIcon />
                        </Button>
                        <Button
                            variant="outline"
                            className="size-8"
                            size="icon"
                            onClick={() => {
                                setPagination((prev) => ({
                                    ...prev,
                                    page: Math.max(prev.page - 1, 1),
                                }));
                            }}
                            disabled={pagination.page === 1}
                        >
                            <span className="sr-only">Go to previous page</span>
                            <ChevronLeftIcon />
                        </Button>
                        <Button
                            variant="outline"
                            className="size-8"
                            size="icon"
                            onClick={() => {
                                setPagination((prev) => ({
                                    ...prev,
                                    page: Math.min(
                                        prev.page + 1,
                                        Math.ceil(pagination.total / pagination.pageSize)
                                    ),
                                }));
                            }}
                            disabled={pagination.page === Math.ceil(pagination.total / pagination.pageSize)}
                        >
                            <span className="sr-only">Go to next page</span>
                            <ChevronRightIcon />
                        </Button>
                        <Button
                            variant="outline"
                            className="hidden size-8 lg:flex"
                            size="icon"
                            onClick={() => {
                                setPagination((prev) => ({
                                    ...prev,
                                    page: Math.ceil(pagination.total / pagination.pageSize),
                                }));
                            }}
                            disabled={pagination.page === Math.ceil(pagination.total / pagination.pageSize)}
                        >
                            <span className="sr-only">Go to last page</span>
                            <ChevronsRightIcon />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
