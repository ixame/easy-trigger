package models

import (
	"time"
)

type TaskLog struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	TaskID    uint      `gorm:"index;not null" json:"task_id"`
	Status    string    `gorm:"size:50;not null" json:"status"` // success, failed
	Output    string    `gorm:"type:text" json:"output"`
	Duration  float64   `json:"duration"` // 执行时间(秒)
	CreatedAt time.Time `json:"created_at"`
}
