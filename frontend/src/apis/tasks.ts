import {HttpClient} from "@/lib/request";

export const GetTasks = (data: Record<string, string | number>) => {
  return HttpClient.get(`/api/tasks?${new URLSearchParams(Object.entries(data).reduce((acc, [key, value]) => {
    acc[key] = value.toString();
    return acc;
  }, {} as Record<string, string>))}`);
}

export const CreateTask = (data: Record<string, any>) => {
  return HttpClient.post(`/api/tasks`, data);
}

export const GetTask = (id: any) => {
  return HttpClient.get(`/api/tasks/${id}`);
}

export const UpdateTask = (id: any, data: any) => {
  return HttpClient.put(`/api/tasks/${id}`, data);
}

export const DeleteTask = (id: any) => {
  return HttpClient.delete(`/api/tasks/${id}`);
}

export const ExecuteTaskNow = (id: any) => {
  return HttpClient.post(`/api/tasks/${id}/execute`);
}

export const GetTaskLogs = (data: Record<string, string | number>) => {
  return HttpClient.get(`/api/logs?${new URLSearchParams(Object.entries(data).reduce((acc, [key, value]) => {
    acc[key] = value.toString();
    return acc;
  }, {} as Record<string, string>))}`);
}
