package com.taskmanager.task.dto;

import com.taskmanager.task.domain.TaskStatus;

import jakarta.validation.constraints.NotNull;

public record TaskStatusUpdateRequest(@NotNull TaskStatus status) {}
