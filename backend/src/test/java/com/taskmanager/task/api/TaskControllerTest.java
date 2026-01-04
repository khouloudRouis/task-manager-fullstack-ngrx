package com.taskmanager.task.api;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.taskmanager.common.response.ApiMessage;
import com.taskmanager.common.response.MessageType;
import com.taskmanager.task.application.TaskService;
import com.taskmanager.task.domain.TaskStatus;
import com.taskmanager.task.dto.TaskResponse;
import com.taskmanager.task.dto.TaskStatusUpdateRequest;
import com.taskmanager.task.dto.TaskUpsertRequest;

@WebMvcTest(TaskController.class)
@DisplayName("TaskController Unit Tests")
class TaskControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private TaskService taskService;

    private UUID userId;
    private TaskResponse taskResponse;
    private TaskUpsertRequest taskUpsertRequest;
    private TaskStatusUpdateRequest statusUpdateRequest;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();
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

        statusUpdateRequest = new TaskStatusUpdateRequest(TaskStatus.TODO);
    }

    @Test
    @DisplayName("Should get all tasks")
    void getTasks_ShouldReturnListOfTasks() throws Exception {
        
        List<TaskResponse> tasks = List.of(taskResponse);
        when(taskService.getAll(userId)).thenReturn(tasks);

        
        mockMvc.perform(get("/api/tasks")
                .header("X-USER-ID", userId.toString())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data[0].id").value(1L))
                .andExpect(jsonPath("$.data[0].title").value("Test Task"))
                .andExpect(jsonPath("$.data[0].status").value("TODO"))
                .andExpect(jsonPath("$.message").value(ApiMessage.TASKS_RETRIEVED))
                .andExpect(jsonPath("$.type").value(MessageType.SUCCESS.toString()));
    }

    @Test
    @DisplayName("Should return empty list when no tasks exist")
    void getTasks_ShouldReturnEmptyList() throws Exception {
        
        when(taskService.getAll(userId)).thenReturn(List.of());

        
        mockMvc.perform(get("/api/tasks")
                .header("X-USER-ID", userId.toString())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data").isEmpty())
                .andExpect(jsonPath("$.message").value(ApiMessage.TASKS_RETRIEVED));
    }

    @Test
    @DisplayName("Should get task by id")
    void getTask_ShouldReturnTask() throws Exception {
        
        Long taskId = 1L;
        when(taskService.getById(userId, taskId)).thenReturn(taskResponse);

        
        mockMvc.perform(get("/api/tasks/{id}", taskId)
                .header("X-USER-ID", userId.toString())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.data.id").value(1L))
                .andExpect(jsonPath("$.data.title").value("Test Task"))
                .andExpect(jsonPath("$.data.description").value("Test Description"))
                .andExpect(jsonPath("$.data.status").value("TODO"))
                .andExpect(jsonPath("$.message").value(ApiMessage.TASK_RETRIEVED))
                .andExpect(jsonPath("$.type").value(MessageType.SUCCESS.toString()));
    }

    @Test
    @DisplayName("Should create a new task")
    void create_ShouldCreateTask() throws Exception {
        
        when(taskService.create(any(TaskUpsertRequest.class), eq(userId))).thenReturn(taskResponse);

        
        mockMvc.perform(post("/api/tasks")
                .header("X-USER-ID", userId.toString())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(taskUpsertRequest)))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.data.id").value(1L))
                .andExpect(jsonPath("$.data.title").value("Test Task"))
                .andExpect(jsonPath("$.message").value(ApiMessage.TASK_CREATED))
                .andExpect(jsonPath("$.type").value(MessageType.SUCCESS.toString()));
    }

    @Test
    @DisplayName("Should return bad request when creating task with invalid data")
    void create_ShouldReturnBadRequestForInvalidData() throws Exception {
       
        TaskUpsertRequest invalidRequest = new TaskUpsertRequest(
                "", // empty title
                null,
                null, // missing status
                null
        );

        
        mockMvc.perform(post("/api/tasks")
                .header("X-USER-ID", userId.toString())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Should update task status")
    void updateStatus_ShouldUpdateStatus() throws Exception {
        
        Long taskId = 1L;
        TaskResponse updatedResponse = new TaskResponse(
                1L,
                "Test Task",
                "Test Description",
                TaskStatus.DOING,
                Instant.now(),
                Instant.now(),
                1L
        );

        when(taskService.updateStatus(eq(userId), eq(taskId), eq(TaskStatus.DOING)))
                .thenReturn(updatedResponse);

        
        mockMvc.perform(patch("/api/tasks/{id}/status", taskId)
                .header("X-USER-ID", userId.toString())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(statusUpdateRequest)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.message").value(ApiMessage.TASK_UPDATED))
                .andExpect(jsonPath("$.type").value(MessageType.SUCCESS.toString()));
    }

    @Test
    @DisplayName("Should return bad request when updating status with invalid data")
    void updateStatus_ShouldReturnBadRequestForInvalidData() throws Exception {
       
        String invalidRequest = "{}";

        
        mockMvc.perform(patch("/api/tasks/{id}/status", 1L)
                .header("X-USER-ID", userId.toString())
                .contentType(MediaType.APPLICATION_JSON)
                .content(invalidRequest))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Should update task")
    void update_ShouldUpdateTask() throws Exception {
        
        Long taskId = 1L;
        TaskUpsertRequest updateRequest = new TaskUpsertRequest(
                "Updated Task",
                "Updated Description",
                TaskStatus.DONE,
                2L
        );

        TaskResponse updatedResponse = new TaskResponse(
                1L,
                "Updated Task",
                "Updated Description",
                TaskStatus.DONE,
                Instant.now(),
                Instant.now(),
                2L
        );

        when(taskService.update(eq(userId), eq(taskId), any(TaskUpsertRequest.class)))
                .thenReturn(updatedResponse);

        
        mockMvc.perform(put("/api/tasks/{id}", taskId)
                .header("X-USER-ID", userId.toString())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.data.title").value("Updated Task"))
                .andExpect(jsonPath("$.data.description").value("Updated Description"))
                .andExpect(jsonPath("$.data.status").value("DONE"))
                .andExpect(jsonPath("$.data.order").value(2L))
                .andExpect(jsonPath("$.message").value(ApiMessage.TASK_UPDATED))
                .andExpect(jsonPath("$.type").value(MessageType.SUCCESS.toString()));
    }

     

    @Test
    @DisplayName("Should delete task")
    void delete_ShouldDeleteTask() throws Exception {
        
        Long taskId = 1L;

        
        mockMvc.perform(delete("/api/tasks/{id}", taskId)
                .header("X-USER-ID", userId.toString())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.data").isEmpty())
                .andExpect(jsonPath("$.message").value(ApiMessage.TASK_DELETED))
                .andExpect(jsonPath("$.type").value(MessageType.SUCCESS.toString()));
    }

    @Test
    @DisplayName("Should return unauthorized when X-USER-ID header is missing")
    void anyEndpoint_ShouldReturnUnauthorizedWhenHeaderMissing() throws Exception {
        
        mockMvc.perform(get("/api/tasks")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Should handle invalid UUID format in X-USER-ID header")
    void anyEndpoint_ShouldReturnBadRequestForInvalidUserId() throws Exception {
        
        mockMvc.perform(get("/api/tasks")
                .header("X-USER-ID", "invalid-uuid")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }
}

