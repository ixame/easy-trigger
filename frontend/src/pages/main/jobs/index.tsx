import { DeleteTask, GetTasks, UpdateTask } from "@/apis/tasks"
import { columns } from "./components/columns"
import { DataTable } from "./components/data-table"
import { JobDialog } from "./components/create-job"
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon } from "lucide-react";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { AlertDialogHeader, AlertDialogFooter, AlertDialog, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";


export default function Jobs() {
    const [data, setData] = useState([]);
    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 10,
        total: 0,

    });

    const fetchData = async () => {
        try {
            const response = await GetTasks({
                page: pagination.page,
                pageSize: pagination.pageSize,
            });
            const tasks = response.data.data
            setData(tasks);
            setPagination((prev) => ({
                ...prev,
                total: response.data.total,
            }));
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [pagination.page, pagination.pageSize]);


    const handleRefresh = async () => {

        try {
            await fetchData(); // Refresh data after creating a job
        } catch (error) {
            console.error("Error creating job:", error);
        }
    };

    const handleDelete = async (id: string) => {

        setDeleteId(id)

    }

    const handleSetEnabled = async (data: any) => {
        await UpdateTask(data.id, {
            ...data,
            enabled: !data.enabled
        })
        handleRefresh()

    }

    useEffect( () => {
        //每10秒刷新一次
        const interval = setInterval(() => {
            fetchData();
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    const [editData, setEditData] = useState<any>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);


    return (
        <div className="container mx-auto py-10 px-20">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-bold">Jobs</h1>
                <JobDialog mode="create" onSubmit={() => handleRefresh()} onClose={() => { }} />
                <JobDialog mode="edit" data={editData} onSubmit={() => handleRefresh()} onClose={() => { setEditData(null) }} />
                <AlertDialog open={!!deleteId} onOpenChange={(open) => {
                    if (!open) {
                        setDeleteId(null);
                    }
                }}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your job
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => {
                                // Delete job

                                DeleteTask(deleteId).then(() => {
                                    console.log("Deleted job:", deleteId);
                                    handleRefresh()
                                })
                            }}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
            <DataTable columns={columns((data) => {
                setEditData(data);
            },
                handleDelete,
                (data) => {
                    handleSetEnabled(data);
                }
            )} data={data} />
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
    )
}
