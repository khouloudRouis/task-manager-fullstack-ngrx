package com.taskmanager.common.response;

import java.time.LocalDateTime;
import java.util.Map;

public record ApiError(String message,Map<String, String> errors, LocalDateTime timestamp, String type) {}
