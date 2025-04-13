package services

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os/exec"
	"time"

	"github.com/ixame/easy-trigger/models"
)

type TaskService struct{}

func (s *TaskService) ExecuteTask(task models.Task) (string, error) {
	startTime := time.Now()
	var output string
	var err error

	switch task.Type {
	case models.TaskTypeShell:
		output, err = executeShellCommand(task.Command)
	case models.TaskTypeHTTP:
		output, err = executeHTTPRequest(task)
	default:
		return "", fmt.Errorf("unknown task type: %s", task.Type)
	}

	duration := time.Since(startTime).Seconds()

	// 记录日志
	log := models.TaskLog{
		TaskID:   task.ID,
		Status:   "success",
		Output:   output,
		Duration: duration,
	}

	if err != nil {
		log.Status = "failed"
		log.Output = err.Error()
	}

	if err := models.DB.Create(&log).Error; err != nil {
		return "", fmt.Errorf("failed to save task log: %v", err)
	}

	return output, err
}

func executeShellCommand(command string) (string, error) {
	cmd := exec.Command("sh", "-c", command)
	var out bytes.Buffer
	var stderr bytes.Buffer
	cmd.Stdout = &out
	cmd.Stderr = &stderr

	err := cmd.Run()
	if err != nil {
		return stderr.String(), err
	}

	return out.String(), nil
}

func executeHTTPRequest(task models.Task) (string, error) {
	var req *http.Request
	var err error

	if task.Method == "POST" || task.Method == "PUT" || task.Method == "PATCH" {
		req, err = http.NewRequest(task.Method, task.Command, bytes.NewBufferString(task.Body))
	} else {
		req, err = http.NewRequest(task.Method, task.Command, nil)
	}

	if err != nil {
		return "", err
	}

	// 设置请求头
	if task.Headers != "" {
		var headers map[string]string
		if err := json.Unmarshal([]byte(task.Headers), &headers); err == nil {
			for key, value := range headers {
				req.Header.Set(key, value)
			}
		}
	}

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	result := map[string]interface{}{
		"status_code": resp.StatusCode,
		"headers":     resp.Header,
		"body":        string(body),
	}

	jsonResult, err := json.Marshal(result)
	if err != nil {
		return "", err
	}

	return string(jsonResult), nil
}
