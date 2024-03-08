import express from 'express';
import { existsSync, mkdirSync, writeFile, readdir } from 'fs';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const folderPath = resolve(join(__dirname, 'files'));

// Create the 'files' folder if not exists
try {
    if (!existsSync(folderPath)) {
        mkdirSync(folderPath, { recursive: true });
        console.log(`Directory created: ${folderPath}`);
    }
} catch (error) {
    console.error(`Error creating directory: ${error.message}`);
}

// Endpoint to create a text file with the current timestamp
app.post('/createFile', (req, res) => {
    const currentDate = new Date().toISOString().replace(/[-:.]/g, '');
    const fileName = `${currentDate}.txt`;
    const filePath = join(folderPath, fileName);

    writeFile(filePath, currentDate, (err) => {
        if (err) {
            console.error(`Error creating file: ${err.message}`);
            return res.status(500).json({ error: 'Error creating file.' });
        }
        res.json({ message: 'File created successfully.' });
    });
});

// Endpoint to retrieve all text files in the 'files' folder
app.get('/getTextFiles', (req, res) => {
    readdir(folderPath, (err, files) => {
        if (err) {
            console.error(`Error reading files: ${err.message}`);
            return res.status(500).json({ error: 'Error reading files.' });
        }
        res.json({ files });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
