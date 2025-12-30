package com.taskmanager.task.application;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.taskmanager.common.exception.*;
import com.taskmanager.common.response.*;
import com.taskmanager.task.domain.*;
import com.taskmanager.task.dto.*;
import com.taskmanager.task.mapper.*;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
@Transactional(readOnly = true)
public class TaskService {

	private final TaskRepository repository;
	private final TaskMapper mapper;

	public List<TaskResponse> getAll(UUID userId) {
		return repository.findByUserId(userId).stream().map(mapper::toResponse).toList();
	}

	public TaskResponse getById(UUID userId, long taskId) {
		Task task = repository.findByIdAndUserId(taskId, userId)
				.orElseThrow(() -> new ResourceNotFoundException(String.format("%s %d",ApiMessage.TASK_NOT_FOUND, taskId)));
		return mapper.toResponse(task);

	}

	@Transactional
	public TaskResponse updateStatus(UUID userId, long taskId, TaskStatus status) {
		Task task = repository.findByIdAndUserId(taskId, userId)
				.orElseThrow(() -> new ResourceNotFoundException(String.format("%s %d",ApiMessage.TASK_NOT_FOUND, taskId)));

		task.setStatus(status);
		var result = repository.save(task);
		return mapper.toResponse(result);
	}

	@Transactional
	public TaskResponse update(UUID userId,long taskId, TaskUpsertRequest request) {
		Task task = repository.findByIdAndUserId(taskId, userId)
				.orElseThrow(() -> new ResourceNotFoundException(String.format("%s %d",ApiMessage.TASK_NOT_FOUND, taskId)));

		task.setTitle(request.title());
		task.setDescription(request.description());
		task.setStatus(request.status());
		repository.save(task);
		return mapper.toResponse(task);
	}

	@Transactional
	public TaskResponse create(TaskUpsertRequest request, UUID userId) {
		Task task = mapper.toEntity(request);
		task.setUserId(userId);
		task = repository.save(task);
		return mapper.toResponse(task);
	}

	@Transactional
	public void delete(UUID userId, long taskId) {
		Task task = repository.findByIdAndUserId(taskId,userId)
				.orElseThrow(() -> new ResourceNotFoundException(ApiMessage.TASK_NOT_FOUND + " " + taskId));
		repository.delete(task);
	}

}
