import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../models/task';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response';

@Injectable({
  providedIn: 'root'
})
export class TaskApiService {
  private http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl + '/tasks';

  getTasks(): Observable<ApiResponse<Task[]>> {
    return this.http.get<ApiResponse<Task[]>>(this.apiUrl);
  }

  getTaskById(id: string): Observable<ApiResponse<Task>> {
    return this.http.get<ApiResponse<Task>>(`${this.apiUrl}/${id}`);
  }

  createTask(task: Partial<Task>): Observable<ApiResponse<Task>> {
    return this.http.post<ApiResponse<Task>>(this.apiUrl, task);
  }

  updateTask(id: string, task: Partial<Task>): Observable<ApiResponse<Task>> {
    return this.http.put<ApiResponse<Task>>(`${this.apiUrl}/${id}`, task);
  }

  deleteTask(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }

  updateTaskStatus(id: string, status: Task['status']): Observable<ApiResponse<Task>> {
    return this.http.patch<ApiResponse<Task>>(`${this.apiUrl}/${id}/status`, { status });
  }


  reorderTasks(taskIds: string[], status: Task['status']): Observable<ApiResponse<Task[]>> {
    return this.http.post<ApiResponse<Task[]>>(`${this.apiUrl}/reorder`, { taskIds, status });
  }
}
