package main

import (
	"log"

	"github.com/ixame/easy-trigger/config"
	"github.com/ixame/easy-trigger/controllers"
	"github.com/ixame/easy-trigger/models"
	"github.com/ixame/easy-trigger/services"

	"github.com/gin-gonic/gin"
)

func main() {
	// 初始化数据库
	models.InitDB()

	// 初始化服务
	taskService := &services.TaskService{}
	schedulerService := services.NewSchedulerService(taskService)

	// 启动调度器
	schedulerService.Start()

	// 初始化Gin
	r := gin.Default()

	authorized := r.Group("/", gin.BasicAuth(gin.Accounts{
		config.GetConfig().Admin.Username: config.GetConfig().Admin.Password,
	}))

	frontendDir := "./frontend/dist"

	authorized.Static("/assets", frontendDir+"/assets")
	authorized.StaticFile("/t.svg", frontendDir+"/t.svg")
	authorized.GET("/", func(c *gin.Context) {
		c.File(frontendDir + "/index.html")
	})
	// 处理前端路由（如 React/Vue 的路由）
	r.NoRoute(func(c *gin.Context) {
		c.File(frontendDir + "/index.html")
	})
	// 添加 CORS 中间件
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Origin, Content-Type, Authorization")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	// 初始化控制器
	taskController := controllers.NewTaskController(schedulerService)
	logController := &controllers.LogController{}

	// 路由设置
	api := authorized.Group("/api")
	{
		// 任务相关路由
		tasks := api.Group("/tasks")
		{
			tasks.POST("", taskController.CreateTask)
			tasks.GET("", taskController.GetTasks)
			tasks.GET("/:id", taskController.GetTask)
			tasks.PUT("/:id", taskController.UpdateTask)
			tasks.DELETE("/:id", taskController.DeleteTask)
			tasks.POST("/:id/execute", taskController.ExecuteTaskNow)
		}

		// 日志相关路由
		logs := api.Group("/logs")
		{
			logs.GET("", logController.GetTaskLogs)
		}

		// 启动HTTP服务器
		if err := r.Run(config.GetConfig().Server.Port); err != nil {
			log.Fatalf("Failed to start server: %v", err)
		}
	}
}
