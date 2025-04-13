package models

import (
	"time"
)

type TaskType string

const (
	TaskTypeShell TaskType = "shell"
	TaskTypeHTTP  TaskType = "http"
)

type Task struct {
	ID          uint      `gorm:"primaryKey;not null" json:"id"`
	Name        string    `gorm:"size:255;not null" json:"name" binding:"required"`
	Description string    `gorm:"size:500" json:"description"`
	Type        TaskType  `gorm:"size:50;not null" json:"type" binding:"required"`
	Command     string    `gorm:"size:1000" json:"command" binding:"required"` // shell命令或HTTP URL
	Method      string    `gorm:"size:10" json:"method"`                       // 仅HTTP任务使用
	Body        string    `gorm:"type:text" json:"body"`                       // 仅HTTP任务使用
	Headers     string    `gorm:"type:text" json:"headers"`                    // 仅HTTP任务使用
	CronExpr    string    `gorm:"size:100;not null" json:"cron_expr" binding:"required"`
	Enabled     bool      `gorm:"default:true" json:"enabled"`
	UpdatedAt   time.Time `gorm:"autoUpdateTime" json:"updated_at"`
	CreatedAt   time.Time `gorm:"autoCreateTime" json:"created_at"`
}
