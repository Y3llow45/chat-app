package main

import (
	"log"
	"server/config"
	"server/routes"
)

func main() {
	// Load configuration
	config.Load()

	// Initialize routes
	r := routes.SetupRouter()

	// Start the server
	err := r.Run(":8080")
	if err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
