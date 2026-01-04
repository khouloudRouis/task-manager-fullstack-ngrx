package com.taskmanager.task.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.Instant;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.taskmanager.task.domain.Task;
import com.taskmanager.task.domain.TaskStatus;
import com.taskmanager.task.dto.TaskResponse;
import com.taskmanager.task.dto.TaskUpsertRequest;

@SpringBootTest
@DisplayName("TaskMapper Unit Tests")
class TaskMapperTest {

    @Autowired
    private TaskMapper mapper;

    private UUID userId;
    private Task task;
    private TaskUpsertRequest taskUpsertRequest;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();
        Instant now = Instant.now();
        
        task = Task.builder()
                .id(1L)
                .userId(userId)
                .title("Test Task")
                .description("Test Description")
                .status(TaskStatus.TODO)
                .order(1L)
                .createdAt(now)
                .updatedAt(now)
                .build();

        taskUpsertRequest = new TaskUpsertRequest(
                "New Task",
                "New Description",
                TaskStatus.DOING,
                2L
        );
    }

    @Test
    @DisplayName("Should map Task entity to TaskResponse")
    void toResponse_ShouldMapTaskToResponse() {
        
        TaskResponse response = mapper.toResponse(task);

        
        assertThat(response).isNotNull();
        assertThat(response.id()).isEqualTo(task.getId());
        assertThat(response.title()).isEqualTo(task.getTitle());
        assertThat(response.description()).isEqualTo(task.getDescription());
        assertThat(response.status()).isEqualTo(task.getStatus());
        assertThat(response.createdAt()).isEqualTo(task.getCreatedAt());
        assertThat(response.updatedAt()).isEqualTo(task.getUpdatedAt());
        assertThat(response.order()).isEqualTo(task.getOrder());
    }

    @Test
    @DisplayName("Should map TaskUpsertRequest to Task entity ignoring id, userId, and timestamps")
    void toEntity_ShouldMapRequestToEntity() {
        
        Task entity = mapper.toEntity(taskUpsertRequest);

        
        assertThat(entity).isNotNull();
        assertThat(entity.getId()).isNull();
        assertThat(entity.getUserId()).isNull();
        assertThat(entity.getTitle()).isEqualTo(taskUpsertRequest.title());
        assertThat(entity.getDescription()).isEqualTo(taskUpsertRequest.description());
        assertThat(entity.getStatus()).isEqualTo(taskUpsertRequest.status());
        assertThat(entity.getOrder()).isEqualTo(taskUpsertRequest.order());
        assertThat(entity.getCreatedAt()).isNull();
        assertThat(entity.getUpdatedAt()).isNull();
    }

    @Test
    @DisplayName("Should map Task with null description to TaskResponse")
    void toResponse_ShouldHandleNullDescription() {
        
        Task taskWithNullDescription = Task.builder()
                .id(2L)
                .userId(userId)
                .title("Task Without Description")
                .description(null)
                .status(TaskStatus.TODO)
                .order(1L)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        
        TaskResponse response = mapper.toResponse(taskWithNullDescription);

        
        assertThat(response).isNotNull();
        assertThat(response.description()).isNull();
        assertThat(response.title()).isEqualTo("Task Without Description");
    }

    @Test
    @DisplayName("Should map TaskUpsertRequest with null description to Task entity")
    void toEntity_ShouldHandleNullDescription() {
        
        TaskUpsertRequest requestWithNullDescription = new TaskUpsertRequest(
                "Task Title",
                null,
                TaskStatus.TODO,
                1L
        );

        
        Task entity = mapper.toEntity(requestWithNullDescription);

        
        assertThat(entity).isNotNull();
        assertThat(entity.getDescription()).isNull();
        assertThat(entity.getTitle()).isEqualTo("Task Title");
    }

    @Test
    @DisplayName("Should map Task with null order to TaskResponse")
    void toResponse_ShouldHandleNullOrder() {
        
        Task taskWithNullOrder = Task.builder()
                .id(3L)
                .userId(userId)
                .title("Task Without Order")
                .description("Description")
                .status(TaskStatus.DONE)
                .order(null)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        
        TaskResponse response = mapper.toResponse(taskWithNullOrder);

        
        assertThat(response).isNotNull();
        assertThat(response.order()).isNull();
    }

    @Test
    @DisplayName("Should map TaskUpsertRequest with null order to Task entity")
    void toEntity_ShouldHandleNullOrder() {
        
        TaskUpsertRequest requestWithNullOrder = new TaskUpsertRequest(
                "Task Title",
                "Description",
                TaskStatus.TODO,
                null
        );

        
        Task entity = mapper.toEntity(requestWithNullOrder);

        
        assertThat(entity).isNotNull();
        assertThat(entity.getOrder()).isNull();
    }

    @Test
    @DisplayName("Should map all TaskStatus enum values correctly")
    void toResponse_ShouldMapAllTaskStatusValues() {
        
        TaskStatus[] statuses = TaskStatus.values();

        for (TaskStatus status : statuses) {
            Task taskWithStatus = Task.builder()
                    .id(4L)
                    .userId(userId)
                    .title("Task with " + status)
                    .description("Description")
                    .status(status)
                    .order(1L)
                    .createdAt(Instant.now())
                    .updatedAt(Instant.now())
                    .build();

            
            TaskResponse response = mapper.toResponse(taskWithStatus);

            
            assertThat(response.status()).isEqualTo(status);
        }
    }

    @Test
    @DisplayName("Should map TaskUpsertRequest with all TaskStatus enum values")
    void toEntity_ShouldMapAllTaskStatusValues() {
        
        TaskStatus[] statuses = TaskStatus.values();

        for (TaskStatus status : statuses) {
            TaskUpsertRequest request = new TaskUpsertRequest(
                    "Task Title",
                    "Description",
                    status,
                    1L
            );

            
            Task entity = mapper.toEntity(request);

            
            assertThat(entity.getStatus()).isEqualTo(status);
        }
    }

    @Test
    @DisplayName("Should preserve all fields when mapping Task to TaskResponse")
    void toResponse_ShouldPreserveAllFields() {
        
        Instant createdAt = Instant.parse("2024-01-01T00:00:00Z");
        Instant updatedAt = Instant.parse("2024-01-02T00:00:00Z");
        
        Task detailedTask = Task.builder()
                .id(5L)
                .userId(userId)
                .title("Detailed Task")
                .description("Detailed Description")
                .status(TaskStatus.DOING)
                .order(5L)
                .createdAt(createdAt)
                .updatedAt(updatedAt)
                .build();

        
        TaskResponse response = mapper.toResponse(detailedTask);

        
        assertThat(response.id()).isEqualTo(5L);
        assertThat(response.title()).isEqualTo("Detailed Task");
        assertThat(response.description()).isEqualTo("Detailed Description");
        assertThat(response.status()).isEqualTo(TaskStatus.DOING);
        assertThat(response.order()).isEqualTo(5L);
        assertThat(response.createdAt()).isEqualTo(createdAt);
        assertThat(response.updatedAt()).isEqualTo(updatedAt);
    }
}

