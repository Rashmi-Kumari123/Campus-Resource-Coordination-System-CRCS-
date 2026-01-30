package com.crcs.common.config;

import io.github.cdimascio.dotenv.Dotenv;

import java.io.File;

/**
 * Utility class to load .env file from project root
 */
public class DotenvLoader {
    
    /**
     * Load .env file and set system properties
     * Tries multiple locations: project root, current directory, and parent directories
     */
    public static void loadDotenv() {
        String[] possiblePaths = {
            "../../",  // From service directory to project root
            "../",    // From subdirectory to project root
            "./",     // Current directory
            "."       // Current directory (alternative)
        };
        
        Dotenv dotenv = null;
        String loadedFrom = null;
        
        for (String path : possiblePaths) {
            try {
                File envFile = new File(path, ".env");
                if (envFile.exists() && envFile.isFile()) {
                    dotenv = Dotenv.configure()
                        .directory(path)
                        .filename(".env")
                        .ignoreIfMissing()
                        .load();
                    loadedFrom = envFile.getAbsolutePath();
                    break;
                }
            } catch (Exception e) {
                // Try next path
                continue;
            }
        }
        
        if (dotenv != null && !dotenv.entries().isEmpty()) {
            // Set system properties from .env file
            dotenv.entries().forEach(entry -> {
                String key = entry.getKey();
                String value = entry.getValue();
                // Only set if not already set as system property or environment variable
                if (System.getProperty(key) == null && System.getenv(key) == null) {
                    System.setProperty(key, value);
                }
            });
            System.out.println("Loaded environment variables from: " + loadedFrom);
        } else {
            System.out.println("Note: .env file not found, using system environment variables");
        }
    }
}
