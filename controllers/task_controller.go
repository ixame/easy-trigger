package controllers

import (
	"net/http"
	"strconv"

	"github.com/ixame/easy-trigger/models"
	"github.com/ixame/easy-trigger/services"

	"github.com/gin-gonic/gin"
	"github.com/ixame/easy-trigger/utils"
)

type TaskController struct {
	schedulerService *services.SchedulerService
}

func NewTaskController(schedulerService *services.SchedulerService) *TaskController {
	return &TaskController{
		schedulerService: schedulerService,
	}
}

func (c *TaskController) CreateTask(ctx *gin.Context) {
	var task models.Task
	if err := ctx.ShouldBindJSON(&task); err != nil {
		utils.Error(ctx, http.StatusBadRequest, err.Error())
		return
	}

	if err := c.schedulerService.AddTask(task); err != nil {
		utils.Error(ctx, http.StatusInternalServerError, err.Error())
		return
	}

	utils.Success(ctx, task)
}

func (c *TaskController) UpdateTask(ctx *gin.Context) {
	id, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		utils.Error(ctx, http.StatusBadRequest, "Invalid task ID")
		return
	}

	var task models.Task
	if err := ctx.ShouldBindJSON(&task); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	task.ID = uint(id)

	if err := c.schedulerService.UpdateTask(task); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	utils.Success(ctx, task)
}

func (c *TaskController) DeleteTask(ctx *gin.Context) {
	id, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid task ID"})
		return
	}

	if err := c.schedulerService.DeleteTask(uint(id)); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	utils.Success(ctx, "Task deleted successfully")
}

func (c *TaskController) GetTasks(ctx *gin.Context) {
	page, _ := strconv.Atoi(ctx.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(ctx.DefaultQuery("pageSize", "10"))
	if page < 1 {
		page = 1
	}
	if pageSize < 1 {
		pageSize = 10
	}

	var tasks []models.Task
	var total int64

	if err := models.DB.Model(&models.Task{}).Count(&total).Error; err != nil {
		utils.Error(ctx, http.StatusInternalServerError, err.Error())
		return
	}

	if err := models.DB.Limit(pageSize).Offset((page - 1) * pageSize).Find(&tasks).Error; err != nil {
		utils.Error(ctx, http.StatusInternalServerError, err.Error())
		return
	}

	utils.Success(ctx, gin.H{
		"data":       tasks,
		"total":      total,
		"page":       page,
		"pageSize":   pageSize,
		"totalPages": (total + int64(pageSize) - 1) / int64(pageSize),
	})
}

func (c *TaskController) GetTask(ctx *gin.Context) {
	id, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid task ID"})
		return
	}

	var task models.Task
	if err := models.DB.First(&task, id).Error; err != nil {
		utils.Error(ctx, http.StatusNotFound, "Task not found")
		return
	}

	utils.Success(ctx, task)
}

func (c *TaskController) ExecuteTaskNow(ctx *gin.Context) {
	id, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid task ID"})
		return
	}

	var task models.Task
	if err := models.DB.First(&task, id).Error; err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Task not found"})
		return
	}

	taskService := services.TaskService{}
	output, err := taskService.ExecuteTask(task)
	if err != nil {
		utils.Error(ctx, http.StatusInternalServerError, err.Error())
		return
	}

	utils.Success(ctx, gin.H{"output": output})
}
