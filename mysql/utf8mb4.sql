-- Alter database for new tables
ALTER DATABASE
    bread_server
    CHARACTER SET = utf8mb4
    COLLATE = utf8mb4_unicode_ci;

-- Modified User and readings Tables while keeping the same amount of bytes for each column
ALTER TABLE users 
	MODIFY COLUMN first_name  VARCHAR(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
	MODIFY COLUMN last_name  VARCHAR(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
    MODIFY COLUMN email  VARCHAR(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
	MODIFY COLUMN username  VARCHAR(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
    MODIFY COLUMN password  VARCHAR(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
    MODIFY COLUMN image  VARCHAR(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL;
	
        
ALTER TABLE readings 
	MODIFY COLUMN title  VARCHAR(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
	MODIFY COLUMN domain  VARCHAR(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
    MODIFY COLUMN description  VARCHAR(375) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
	MODIFY COLUMN image  VARCHAR(375) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
    MODIFY COLUMN url  VARCHAR(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL; 
    
    

    

	
	
	