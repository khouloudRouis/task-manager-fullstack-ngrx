package com.taskmanager.task.dto;

import com.taskmanager.task.domain.TaskStatus;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record TaskUpsertRequest(@NotBlank String title, String description, @NotNull TaskStatus status) {

}
