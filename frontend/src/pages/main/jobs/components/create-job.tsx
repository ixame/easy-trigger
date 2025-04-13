import { CreateTask, UpdateTask } from "@/apis/tasks"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList } from "@/components/ui/tabs"
import { TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useEffect, useState } from "react"

export function JobDialog({
    mode,
    onSubmit,
    onClose,
    data
}: {
    mode: "create" | "edit",
    onSubmit: () => void,
    onClose?: () => void,
    data?: any
}) {
    const [formData, setFormData] = useState({
        name: "",
        username: "",
        type: "shell",
        command: "",
        cron_expr: "",
        enabled: true,
        method: "GET",
        headers: "",
        body: "",
        timeout: 30,
        retries: 3,
        retry_delay: 5,
    })
    const handleSubmit = async () => {
        setLoading(true);
        try {
            if (mode === "create") {
                await CreateTask(formData);
            } else {
                await UpdateTask(data.id, formData);
            }
            setOpen(false);
            onSubmit();
        } finally {
            setLoading(false);
        }
    }
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (data) {
            setFormData({
                ...formData,
                name: data.name,
                cron_expr: data.cron_expr,
                type: data.type,
                command: data.command,
            })
        }
    }, [data])

    useEffect(() => {
        if (mode === "edit" && data && data.id) {
            setOpen(true);
        }else{
            setOpen(false);
        }
    }, [mode, data])


    const handleOpenChange = (open: boolean) => {
        setOpen(open);
        if (!open) {
            setFormData({
                name: "",
                username: "",
                type: "shell",
                command: "",
                cron_expr: "",
                enabled: true,
                method: "GET",
                headers: "",
                body: "",
                timeout: 30,
                retries: 3,
                retry_delay: 5,
            })
            if (onClose) {
                onClose();
            }
        }
    }
    return (
        <Dialog open={open} onOpenChange={handleOpenChange} >
            {mode == "create" && <DialogTrigger asChild>
                <Button>{mode === "create" ? "Create Job" : "Edit Job"}</Button>
            </DialogTrigger>}
            <DialogContent className="">
                <DialogHeader>
                    <DialogTitle>{mode === "create" ? "Create Job" : "Edit Job"}</DialogTitle>
                    <DialogDescription>
                        {mode === "create" ? "Fill out the form to create a new job." : "Edit the details of the job."}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="cron" className="text-right">
                            Cron
                        </Label>
                        <Input id="cron" value={formData.cron_expr} onChange={(e) => setFormData({ ...formData, cron_expr: e.target.value })} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="type" className="text-right">
                            Type
                        </Label>
                        <Tabs
                            defaultValue="shell"
                            value={formData.type}
                            onValueChange={(value) => setFormData({ ...formData, type: value })}
                            className="w-[200px]"
                        >
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="shell">SHELL</TabsTrigger>
                                <TabsTrigger disabled value="http">HTTP</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="command" className="text-right">
                            {formData.type === "shell" ? "Command" : "URL"}
                        </Label>
                        {/* <Input id="username" value={formData.command} onChange={(e) => setFormData({ ...formData, command: e.target.value })} className="col-span-3" /> */}
                        <Textarea className="col-span-3" value={formData.command} onChange={(e) => setFormData({ ...formData, command: e.target.value })} placeholder="" />
                    </div>
                </div>

                <DialogFooter>
                    <Button type="submit" disabled={loading} onClick={() => {
                        handleSubmit()
                    }}>
                        {loading ? (mode === "create" ? "Creating..." : "Saving...") : (mode === "create" ? "Create" : "Save")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
