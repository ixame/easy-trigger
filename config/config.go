package config

import (
	"log"
	"os"

	"gopkg.in/yaml.v2"
)

type Config struct {
	Database struct {
		Host     string `yaml:"host"`
		Port     int    `yaml:"port"`
		User     string `yaml:"user"`
		Password string `yaml:"password"`
		DBName   string `yaml:"dbname"`
	} `yaml:"database"`

	Sqlite struct {
		Path string `yaml:"path"`
	} `yaml:"sqlite"`

	Server struct {
		Port   string `yaml:"port"`
		DBType string `yaml:"db_type"`
	} `yaml:"server"`

	Admin struct {
		Username string `yaml:"username"`
		Password string `yaml:"password"`
	}

	Logging struct {
		Level string `yaml:"level"`
		Path  string `yaml:"path"`
	} `yaml:"logging"`
}

var AppConfig Config

func GetConfig() *Config {
	return &AppConfig
}

func LoadConfig() {
	file, err := os.Open("config.yaml")
	if err != nil {
		log.Fatalf("Failed to open config file: %v", err)
	}
	defer file.Close()

	decoder := yaml.NewDecoder(file)
	if err := decoder.Decode(&AppConfig); err != nil {
		log.Fatalf("Failed to decode config file: %v", err)
	}
}
