package com.taskmanager.task.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.taskmanager.task.domain.*;
import com.taskmanager.task.dto.*;

@Mapper(componentModel = "spring")
public interface TaskMapper {

	TaskResponse toResponse(Task task);

	@Mapping(target = "id", ignore = true)
	@Mapping(target = "userId", ignore = true)
	@Mapping(target = "createdAt", ignore = true)
	@Mapping(target = "updatedAt", ignore = true)
	Task toEntity(TaskUpsertRequest request);
}
