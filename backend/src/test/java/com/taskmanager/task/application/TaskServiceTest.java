package com.taskmanager.task.application;
 
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.taskmanager.common.exception.ResourceNotFoundException;
import com.taskmanager.common.response.ApiMessage;
import com.taskmanager.task.domain.Task;
import com.taskmanager.task.domain.TaskRepository;
import com.taskmanager.task.domain.TaskStatus;
import com.taskmanager.task.dto.TaskResponse;
import com.taskmanager.task.dto.TaskUpsertRequest;
import com.taskmanager.task.mapper.TaskMapper;

@ExtendWith(MockitoExtension.class)
@DisplayName("TaskService Unit Tests")
class TaskServiceTest {

    @Mock
    private TaskRepository repository;

    @Mock
    private TaskMapper mapper;

    @InjectMocks
    private TaskService service;

    private UUID userId;
    private Task task;
    private TaskResponse taskResponse;
    private TaskUpsertRequest taskUpsertRequest;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();
        task = Task.builder()
                .id(1L)
                .userId(userId)
                .title("Test Task")
                .description("Test Description")
                .status(TaskStatus.TODO)
                .order(1L)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        taskResponse = new TaskResponse(
                1L,
                "Test Task",
                "Test Description",
                TaskStatus.TODO,
                Instant.now(),
                Instant.now(),
                1L
        );

        taskUpsertRequest = new TaskUpsertRequest(
                "Test Task",
                "Test Description",
                TaskStatus.TODO,
                1L
        );
    }

    @Test
    @DisplayName("Should retrieve all tasks for a user")
    void getAll_ShouldReturnListOfTasks() {
        List<Task> tasks = List.of(task);
        when(repository.findByUserIdOrderByOrder(userId)).thenReturn(tasks);
        when(mapper.toResponse(task)).thenReturn(taskResponse);
 
        List<TaskResponse> result = service.getAll(userId);
 
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(taskResponse, result.get(0));
        verify(repository).findByUserIdOrderByOrder(userId);
        verify(mapper).toResponse(task);
    }

    @Test
    @DisplayName("Should return empty list when user has no tasks")
    void getAll_ShouldReturnEmptyList() {
        when(repository.findByUserIdOrderByOrder(userId)).thenReturn(List.of());
 
        List<TaskResponse> result = service.getAll(userId);

        assertNotNull(result); 
        verify(repository).findByUserIdOrderByOrder(userId);
        verify(mapper, never()).toResponse(any());
    }

    @Test
    @DisplayName("Should retrieve task by id and user id")
    void getById_ShouldReturnTask() {
        Long taskId = 1L;
        when(repository.findByIdAndUserId(taskId, userId)).thenReturn(Optional.of(task));
        when(mapper.toResponse(task)).thenReturn(taskResponse);

         TaskResponse result = service.getById(userId, taskId);

    
        assertNotNull(result);
        assertEquals(taskResponse, result);
        verify(repository).findByIdAndUserId(taskId, userId);
        verify(mapper).toResponse(task);
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when task not found")
    void getById_ShouldThrowExceptionWhenTaskNotFound() {
        Long taskId = 999L;
        when(repository.findByIdAndUserId(taskId, userId)).thenReturn(Optional.empty());
 
        assertThatThrownBy(() -> service.getById(userId, taskId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining(ApiMessage.TASK_NOT_FOUND)
                .hasMessageContaining(String.valueOf(taskId));
        verify(repository).findByIdAndUserId(taskId, userId);
        verify(mapper, never()).toResponse(any());
    }

    @Test
    @DisplayName("Should create a new task")
    void create_ShouldCreateTask() {
        Task newTask = Task.builder()
                .title("New Task")
                .description("New Description")
                .status(TaskStatus.TODO)
                .order(1L)
                .build();

        when(mapper.toEntity(taskUpsertRequest)).thenReturn(newTask);
        when(repository.save(any(Task.class))).thenAnswer(invocation -> {
            Task savedTask = invocation.getArgument(0);
            savedTask.setId(1L);
            savedTask.setCreatedAt(Instant.now());
            savedTask.setUpdatedAt(Instant.now());
            return savedTask;
        });
        when(mapper.toResponse(any(Task.class))).thenReturn(taskResponse);
 
        TaskResponse result = service.create(taskUpsertRequest, userId);
 
        assertNotNull(result);
        assertEquals(taskResponse, result);
        verify(mapper).toEntity(taskUpsertRequest);
        verify(repository).save(any(Task.class));
        verify(mapper).toResponse(any(Task.class));
    }

    @Test
    @DisplayName("Should update task status")
    void updateStatus_ShouldUpdateStatus() {
        Long taskId = 1L;
        TaskStatus newStatus = TaskStatus.DOING;
        Task updatedTask = Task.builder()
                .id(taskId)
                .userId(userId)
                .title("Test Task")
                .description("Test Description")
                .status(newStatus)
                .order(1L)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        TaskResponse updatedResponse = new TaskResponse(
                taskId,
                "Test Task",
                "Test Description",
                newStatus,
                Instant.now(),
                Instant.now(),
                1L
        );

        when(repository.findByIdAndUserId(taskId, userId)).thenReturn(Optional.of(task));
        when(repository.save(any(Task.class))).thenReturn(updatedTask);
        when(mapper.toResponse(updatedTask)).thenReturn(updatedResponse);
 
        TaskResponse result = service.updateStatus(userId, taskId, newStatus);
 
        assertNotNull(result);
        assertEquals(newStatus, result.status());
        verify(repository).findByIdAndUserId(taskId, userId);
        verify(repository).save(task);
        verify(mapper).toResponse(updatedTask);
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when updating status of non-existent task")
    void updateStatus_ShouldThrowExceptionWhenTaskNotFound() {
  
        Long taskId = 999L;
        TaskStatus newStatus = TaskStatus.DOING;
        when(repository.findByIdAndUserId(taskId, userId)).thenReturn(Optional.empty());
 
        assertThatThrownBy(() -> service.updateStatus(userId, taskId, newStatus))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining(ApiMessage.TASK_NOT_FOUND);
        verify(repository).findByIdAndUserId(taskId, userId);
        verify(repository, never()).save(any());
    }

    @Test
    @DisplayName("Should update task")
    void update_ShouldUpdateTask() { 
        Long taskId = 1L;
        TaskUpsertRequest updateRequest = new TaskUpsertRequest(
                "Updated Task",
                "Updated Description",
                TaskStatus.DONE,
                2L
        );

        Task updatedTask = Task.builder()
                .id(taskId)
                .userId(userId)
                .title("Updated Task")
                .description("Updated Description")
                .status(TaskStatus.DONE)
                .order(2L)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        TaskResponse updatedResponse = new TaskResponse(
                taskId,
                "Updated Task",
                "Updated Description",
                TaskStatus.DONE,
                Instant.now(),
                Instant.now(),
                2L
        );

        when(repository.findByIdAndUserId(taskId, userId)).thenReturn(Optional.of(task));
        when(repository.save(any(Task.class))).thenReturn(updatedTask);
        when(mapper.toResponse(updatedTask)).thenReturn(updatedResponse);
 
        TaskResponse result = service.update(userId, taskId, updateRequest);
 
        assertNotNull(result);
        assertEquals("Updated Task", result.title());
        assertEquals("Updated Description", result.description());
        assertEquals(2L, result.order());
        verify(repository).findByIdAndUserId(taskId, userId);
        verify(repository).save(task);
        verify(mapper).toResponse(updatedTask);
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when updating non-existent task")
    void update_ShouldThrowExceptionWhenTaskNotFound() { 
        Long taskId = 999L;
        when(repository.findByIdAndUserId(taskId, userId)).thenReturn(Optional.empty());
 
        assertThatThrownBy(() -> service.update(userId, taskId, taskUpsertRequest))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining(ApiMessage.TASK_NOT_FOUND);
        verify(repository).findByIdAndUserId(taskId, userId);
        verify(repository, never()).save(any());
    }

    @Test
    @DisplayName("Should delete task")
    void delete_ShouldDeleteTask() { 
        Long taskId = 1L;
        when(repository.findByIdAndUserId(taskId, userId)).thenReturn(Optional.of(task));
 
        service.delete(userId, taskId);
 
        verify(repository).findByIdAndUserId(taskId, userId);
        verify(repository).delete(task);
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when deleting non-existent task")
    void delete_ShouldThrowExceptionWhenTaskNotFound() {
 
        Long taskId = 999L;
        when(repository.findByIdAndUserId(taskId, userId)).thenReturn(Optional.empty());
 
        assertThatThrownBy(() -> service.delete(userId, taskId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining(ApiMessage.TASK_NOT_FOUND);
        verify(repository).findByIdAndUserId(taskId, userId);
        verify(repository, never()).delete(any());
    }

    @Test
    @DisplayName("Should retrieve multiple tasks ordered by order field")
    void getAll_ShouldReturnTasksOrderedByOrder() { 
        Task task1 = Task.builder().id(1L).userId(userId).title("Task 1").status(TaskStatus.TODO).order(1L).build();
        Task task2 = Task.builder().id(2L).userId(userId).title("Task 2").status(TaskStatus.TODO).order(2L).build();
        Task task3 = Task.builder().id(3L).userId(userId).title("Task 3").status(TaskStatus.TODO).order(3L).build();

        List<Task> tasks = List.of(task1, task2, task3);
        when(repository.findByUserIdOrderByOrder(userId)).thenReturn(tasks);
        when(mapper.toResponse(any(Task.class))).thenAnswer(invocation -> {
            Task t = invocation.getArgument(0);
            return new TaskResponse(t.getId(), t.getTitle(), t.getDescription(), t.getStatus(),
                    t.getCreatedAt(), t.getUpdatedAt(), t.getOrder());
        });
 
        List<TaskResponse> result = service.getAll(userId);
 
        assertEquals(3, result.size());
        verify(repository).findByUserIdOrderByOrder(userId);
        verify(mapper, times(3)).toResponse(any(Task.class));
    }
}

