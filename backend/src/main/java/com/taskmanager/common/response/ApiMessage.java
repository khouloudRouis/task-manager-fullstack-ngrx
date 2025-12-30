package com.taskmanager.common.response;

public final class ApiMessage {

	    // ===== SUCCESS MESSAGES =====
	    public static final String TASK_CREATED = "Task created successfully";
	    public static final String TASK_UPDATED = "Task updated successfully";
	    public static final String TASK_DELETED = "Task deleted successfully";
	    public static final String TASK_RETRIEVED = "Task retrieved successfully";
	    public static final String TASKS_RETRIEVED = "Tasks retrieved successfully";

	    // ===== CLIENT ERROR MESSAGES (400) =====
	    public static final String INVALID_TASK_DATA = "Invalid task data"; 

	    // ===== NOT FOUND (404) =====
	    public static final String TASK_NOT_FOUND = "Task not found with id"; 

	    // ===== UNAUTHORIZED   ===== 
	    public static final String UNAUTHORIZED_ACCESS = "You are not authorized to access this resource";
 
	    // ===== SERVER ERRORS (500) =====
	    public static final String UNEXPECTED_ERROR = "Unexpected error occurred";
	    public static final String DATABASE_ERROR = "Database operation failed ";
	    
	    // ======= MESSAGE TYPE =====
	    public static final String SUCCESS = "success";
	    public static final String ERROR = "error";
	    public static final String INFO = "info";
 

}
