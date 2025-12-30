package com.taskmanager.common.exception;

import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingRequestHeaderException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.taskmanager.common.response.*;

import lombok.extern.slf4j.Slf4j;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@ControllerAdvice
public class GlobalExceptionHandler {
	@ExceptionHandler(ResourceNotFoundException.class)
	public ResponseEntity<ApiError> handleNotFound(ResourceNotFoundException ex) {
		log.warn("{}", ex.getMessage());
		return ResponseEntity.status(HttpStatus.NOT_FOUND)
				.body(new ApiError(ex.getMessage(), null, LocalDateTime.now(), ApiMessage.ERROR));
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<ApiError> handleValidation(MethodArgumentNotValidException ex) {
		log.warn("{}", ex.getMessage());
		Map<String, String> errors = ex.getBindingResult().getFieldErrors().stream()
				.collect(Collectors.toMap(FieldError::getField, FieldError::getDefaultMessage));
		return ResponseEntity.badRequest()
				.body(new ApiError(ApiMessage.INVALID_TASK_DATA, errors, LocalDateTime.now(), ApiMessage.ERROR));
	}

	@ExceptionHandler(MissingRequestHeaderException.class)
	public ResponseEntity<ApiError> handleHeader(MissingRequestHeaderException ex) {
		log.error("{}", ex.getMessage());
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
				.body(new ApiError(ApiMessage.UNAUTHORIZED_ACCESS, null, LocalDateTime.now(), ApiMessage.ERROR));
	}

	@ExceptionHandler(DataAccessException.class)
	public ResponseEntity<ApiError> handleDataAccess(DataAccessException ex) {
		log.error("Database error", ex);
		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.body(new ApiError(ApiMessage.DATABASE_ERROR, null, LocalDateTime.now(), ApiMessage.ERROR));
	}
}
