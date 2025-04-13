package models

import (
	"fmt"
	"log"

	"github.com/ixame/easy-trigger/config"

	"gorm.io/driver/mysql"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var DB *gorm.DB

func InitDB() {
	config.LoadConfig()

	// 构建 DSN
	dialector := gorm.Dialector(nil)
	if config.AppConfig.Server.DBType == "mysql" {
		dsn := fmt.Sprintf("%s:%s@tcp(%s:%d)/%s?charset=utf8mb4&parseTime=True&loc=Local",
			config.AppConfig.Database.User,
			config.AppConfig.Database.Password,
			config.AppConfig.Database.Host,
			config.AppConfig.Database.Port,
			config.AppConfig.Database.DBName)
		dialector = mysql.Open(dsn)
	}

	if config.AppConfig.Server.DBType == "sqlite" {
		dsn := config.AppConfig.Sqlite.Path
		dialector = sqlite.Open(dsn)
	}

	// 连接数据库
	db, err := gorm.Open(dialector, &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	DB = db

	// 自动迁移表
	err = DB.AutoMigrate(&Task{}, &TaskLog{})
	if err != nil {
		log.Fatalf("Failed to auto migrate tables: %v", err)
	}
}
