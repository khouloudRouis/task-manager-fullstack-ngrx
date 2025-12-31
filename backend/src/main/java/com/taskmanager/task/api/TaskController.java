package com.taskmanager.task.api;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.taskmanager.common.response.*;
import com.taskmanager.task.application.*;
import com.taskmanager.task.dto.*;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/tasks")
public class TaskController {

	private final TaskService service;

	@GetMapping
	public ResponseEntity<ApiResponse<List<TaskResponse>>> getTasks(@RequestHeader("X-USER-ID") UUID userId) {
		var taskResponse = service.getAll(userId);
		var apiResponse = new ApiResponse<>(taskResponse, ApiMessage.TASKS_RETRIEVED, MessageType.SUCCESS );
		return ResponseEntity.ok(apiResponse);
	}

	@GetMapping("/{id}")
	public ResponseEntity<ApiResponse<TaskResponse>> getTask(@RequestHeader("X-USER-ID") UUID userId,
			@PathVariable long id) {
		var taskResponse = service.getById(userId, id);
		var apiResponse = new ApiResponse<>(taskResponse, ApiMessage.TASK_RETRIEVED,  MessageType.SUCCESS);
		return ResponseEntity.ok(apiResponse);
	}

	@PostMapping
	public ResponseEntity<ApiResponse<TaskResponse>> create(@Valid @RequestBody TaskUpsertRequest request,
			@RequestHeader("X-USER-ID") UUID userId) {
		var taskResponse = service.create(request, userId);
		var apiResponse = new ApiResponse<>(taskResponse, ApiMessage.TASK_CREATED,  MessageType.SUCCESS);
		return ResponseEntity.status(HttpStatus.CREATED).body(apiResponse);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<ApiResponse<Object>> delete(@PathVariable long id, @RequestHeader("X-USER-ID") UUID userId) {
		service.delete(userId, id);
		var apiResponse = new ApiResponse<>(null, ApiMessage.TASK_DELETED, MessageType.SUCCESS);
		return ResponseEntity.ok(apiResponse);
	}

	@PatchMapping("/{id}/status")
	public ResponseEntity<ApiResponse<TaskResponse>> updateStatus(@PathVariable long id,
			@RequestHeader("X-USER-ID") UUID userId, @Valid @RequestBody TaskStatusUpdateRequest request) {
		var apiResponse = new ApiResponse<>(service.updateStatus(userId, id, request.status()),
				ApiMessage.TASK_UPDATED,  MessageType.SUCCESS);
		return ResponseEntity.ok(apiResponse);
	}

	@PutMapping("/{id}")
	public ResponseEntity<ApiResponse<TaskResponse>> update(@PathVariable long id,
			@RequestHeader("X-USER-ID") UUID userId, @Valid @RequestBody TaskUpsertRequest request) {
		var apiResponse = new ApiResponse<>(service.update(userId, id, request), ApiMessage.TASK_UPDATED,  MessageType.SUCCESS);
		return ResponseEntity.ok(apiResponse);
	}

}
