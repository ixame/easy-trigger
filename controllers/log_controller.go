package controllers

import (
	"net/http"
	"strconv"

	"github.com/ixame/easy-trigger/models"
	"github.com/ixame/easy-trigger/utils"

	"github.com/gin-gonic/gin"
)

type LogController struct{}

func (c *LogController) GetTaskLogs(ctx *gin.Context) {
	// taskID, err := strconv.Atoi(ctx.Param("task_id"))
	// if err != nil {
	// 	ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid task ID"})
	// 	return
	// }

	page, _ := strconv.Atoi(ctx.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(ctx.DefaultQuery("pageSize", "10"))
	if page < 1 {
		page = 1
	}
	if pageSize < 1 {
		pageSize = 10
	}

	var logs []models.TaskLog
	var total int64

	if taskIDStr := ctx.Query("task_id"); taskIDStr != "" {
		taskID, err := strconv.Atoi(taskIDStr)
		if err != nil {
			utils.Error(ctx, http.StatusBadRequest, "Invalid task ID")
			return
		}
		if err := models.DB.Where("task_id = ?", taskID).Model(&models.TaskLog{}).Count(&total).Error; err != nil {

			utils.Error(ctx, http.StatusInternalServerError, err.Error())
			return
		}
		if err := models.DB.Where("task_id = ?", taskID).Order("created_at desc").Limit(pageSize).Offset((page - 1) * pageSize).Find(&logs).Error; err != nil {
			utils.Error(ctx, http.StatusInternalServerError, err.Error())
			return
		}
	} else {
		if err := models.DB.Model(&models.TaskLog{}).Count(&total).Error; err != nil {
			utils.Error(ctx, http.StatusInternalServerError, err.Error())
			return
		}
		if err := models.DB.Order("created_at desc").Limit(pageSize).Offset((page - 1) * pageSize).Find(&logs).Error; err != nil {
			utils.Error(ctx, http.StatusInternalServerError, err.Error())
			return
		}
	}

	utils.Success(ctx, gin.H{
		"data":       logs,
		"total":      total,
		"page":       page,
		"pageSize":   pageSize,
		"totalPages": (total + int64(pageSize) - 1) / int64(pageSize),
	})
}

func (c *LogController) GetLog(ctx *gin.Context) {
	id, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		utils.Error(ctx, http.StatusBadRequest, "Invalid log ID")
		return
	}

	var log models.TaskLog
	if err := models.DB.First(&log, id).Error; err != nil {
		utils.Error(ctx, http.StatusNotFound, "Log not found")
		return
	}

	ctx.JSON(http.StatusOK, log)
}
