package com.taskmanager.common.response;

public record ApiResponse<T> (T data, String message, String type)  {}
