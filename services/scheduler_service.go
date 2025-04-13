package services

import (
	"fmt"
	"time"

	"github.com/ixame/easy-trigger/models"

	"github.com/go-co-op/gocron"
)

type SchedulerService struct {
	scheduler   *gocron.Scheduler
	taskService *TaskService
}

func NewSchedulerService(taskService *TaskService) *SchedulerService {
	s := gocron.NewScheduler(time.Local)
	return &SchedulerService{
		scheduler:   s,
		taskService: taskService,
	}
}

func (s *SchedulerService) Start() {
	// 从数据库加载所有启用的任务
	var tasks []models.Task
	if err := models.DB.Where("enabled = ?", true).Find(&tasks).Error; err != nil {
		fmt.Printf("Failed to load tasks: %v\n", err)
		return
	}

	// 为每个任务创建调度
	for _, task := range tasks {
		s.scheduleTask(task)
	}

	// 启动调度器
	s.scheduler.StartAsync()
}

func (s *SchedulerService) scheduleTask(task models.Task) {
	job, err := s.scheduler.Cron(task.CronExpr).Do(func() {
		fmt.Printf("Executing task %d: %s\n", task.ID, task.Name)
		output, err := s.taskService.ExecuteTask(task)
		if err != nil {
			fmt.Printf("Task %d failed: %v\n", task.ID, err)
		} else {
			fmt.Printf("Task %d completed. Output: %s\n", task.ID, output)
		}
	})

	if err != nil {
		fmt.Printf("Failed to schedule task %d: %v\n", task.ID, err)
	}

	job.Tag(fmt.Sprintf("%d", task.ID))
}

func (s *SchedulerService) validateCronExpression(cronExpr string) error {
	_, err := s.scheduler.Cron(cronExpr).Do(func() {})
	if err != nil {
		return fmt.Errorf("invalid cron expression: %v", err)
	}
	return nil
}

func (s *SchedulerService) AddTask(task models.Task) error {
	if err := s.validateCronExpression(task.CronExpr); err != nil {
		return err
	}

	if err := models.DB.Create(&task).Error; err != nil {
		return err
	}

	if task.Enabled {
		s.scheduleTask(task)
	}

	return nil
}

func (s *SchedulerService) UpdateTask(task models.Task) error {
	if err := s.validateCronExpression(task.CronExpr); err != nil {
		return err
	}

	if err := models.DB.Model(&task).Update("cron_expr", task.CronExpr).Update("name", task.Name).Update("command", task.Command).Update("enabled", task.Enabled).Error; err != nil {
		return err
	}

	// 先移除旧的调度
	s.scheduler.RemoveByTag(fmt.Sprintf("%d", task.ID))

	// 如果任务启用，则添加新的调度
	if task.Enabled {
		s.scheduleTask(task)
	}

	return nil
}

func (s *SchedulerService) DeleteTask(id uint) error {
	if err := models.DB.Delete(&models.Task{}, id).Error; err != nil {
		return err
	}

	// 移除调度
	s.scheduler.RemoveByTag(fmt.Sprintf("%d", id))

	return nil
}
