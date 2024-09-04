package routes

import (
	"server/handlers"

	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()

	// Auth routes
	r.POST("/api/auth/signup", handlers.SignUp)
	r.POST("/api/auth/signin", handlers.SignIn)

	// Chat routes
	r.GET("/api/chat/:roomId", handlers.GetMessages)
	r.POST("/api/chat/:roomId", handlers.PostMessage)

	return r
}
