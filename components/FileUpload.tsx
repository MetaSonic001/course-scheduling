import { Box, Button, Typography } from '@mui/material';
import React, { useState } from 'react';

interface FileUploadProps {
  onUpload: (file1: File, file2: File) => void;
}

export default function FileUpload({ onUpload }: FileUploadProps) {
  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, fileNumber: number) => {
    if (event.target.files) {
      if (fileNumber === 1) {
        setFile1(event.target.files[0]);
      } else {
        setFile2(event.target.files[0]);
      }
    }
  };

  const handleUpload = () => {
    if (file1 && file2) {
      onUpload(file1, file2);
    }
  };

  return (
    <Box className="my-4">
      <Typography variant="h6" gutterBottom>Upload Input Files</Typography>
      <Box className="mb-2">
        <input
          accept=".txt"
          className="hidden"
          id="file-upload-1"
          type="file"
          onChange={(e) => handleFileChange(e, 1)}
        />
        <label htmlFor="file-upload-1">
          <Button variant="contained" component="span">
            Upload File 1
          </Button>
        </label>
        {file1 && <Typography variant="body2" className="ml-2">{file1.name}</Typography>}
      </Box>
      <Box className="mb-2">
        <input
          accept=".txt"
          className="hidden"
          id="file-upload-2"
          type="file"
          onChange={(e) => handleFileChange(e, 2)}
        />
        <label htmlFor="file-upload-2">
          <Button variant="contained" component="span">
            Upload File 2
          </Button>
        </label>
        {file2 && <Typography variant="body2" className="ml-2">{file2.name}</Typography>}
      </Box>
      <Button
        variant="contained"
        color="primary"
        onClick={handleUpload}
        disabled={!file1 || !file2}
      >
        Process Files
      </Button>
    </Box>
  );
}