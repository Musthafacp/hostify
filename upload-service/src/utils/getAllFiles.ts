import fs from 'fs';
import path from 'path';

export const getAllFiles = (dirPath: string): string[] => {
    let result: string[] = [];
    
    try {
        const filesAndFolders = fs.readdirSync(dirPath);
        filesAndFolders.forEach(file => {
            const filePath = path.join(dirPath, file);
            if (fs.statSync(filePath).isDirectory()) {
                result = result.concat(getAllFiles(filePath));
            } else {
                result.push(filePath);
            }
        });
    } catch (error) {
        console.error(`Error reading directory ${dirPath}:`, error);
    }
    
    return result;
};
