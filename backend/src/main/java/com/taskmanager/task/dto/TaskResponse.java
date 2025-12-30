package com.taskmanager.task.dto;

import java.time.Instant;

import com.taskmanager.task.domain.TaskStatus;

public record TaskResponse(Long id, String title, String description, TaskStatus status, Instant createdAt,
		Instant updatedAt) {
}
