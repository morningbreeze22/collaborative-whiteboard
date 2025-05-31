package main

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	// Initialize Gin router
	router := gin.Default()

	// Configure CORS
	router.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	// Health check endpoint
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status": "ok",
			"service": "collaborative-whiteboard",
		})
	})

	// API routes
	api := router.Group("/api")
	{
		// Board endpoints
		api.POST("/boards", createBoard)
		api.GET("/boards/:id", getBoard)
		api.POST("/boards/:id/export", exportBoard)
		
		// Image upload endpoint
		api.POST("/upload", uploadImage)
	}

	// WebSocket endpoint
	router.GET("/ws/:boardId", handleWebSocket)

	// Get port from environment or default to 8080
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	if err := router.Run(":" + port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}

// Placeholder handlers - to be implemented
func createBoard(c *gin.Context) {
	c.JSON(200, gin.H{"message": "Create board endpoint"})
}

func getBoard(c *gin.Context) {
	boardId := c.Param("id")
	c.JSON(200, gin.H{"message": "Get board endpoint", "boardId": boardId})
}

func exportBoard(c *gin.Context) {
	boardId := c.Param("id")
	c.JSON(200, gin.H{"message": "Export board endpoint", "boardId": boardId})
}

func uploadImage(c *gin.Context) {
	c.JSON(200, gin.H{"message": "Upload image endpoint"})
}

func handleWebSocket(c *gin.Context) {
	boardId := c.Param("boardId")
	c.JSON(200, gin.H{"message": "WebSocket endpoint", "boardId": boardId})
} 