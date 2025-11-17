import React, { useCallback, useState } from 'react';
import { Upload, FileText, Loader2 } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, isLoading }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        const file = files[0];
        if (file.type === 'application/pdf') {
          setSelectedFile(file);
          onFileSelect(file);
        } else {
          alert('Bitte nur PDF-Dateien hochladen');
        }
      }
    },
    [onFileSelect]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        const file = files[0];
        setSelectedFile(file);
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="w-full">
      <div
        className={`
          relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200
          ${isDragging ? 'border-primary-500 bg-primary-50' : 'border-gray-300 bg-gray-50'}
          ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-primary-400 hover:bg-primary-50'}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isLoading && document.getElementById('file-input')?.click()}
      >
        <input
          id="file-input"
          type="file"
          accept="application/pdf"
          onChange={handleFileInput}
          className="hidden"
          disabled={isLoading}
        />

        <div className="flex flex-col items-center gap-4">
          {isLoading ? (
            <>
              <Loader2 className="w-16 h-16 text-primary-600 animate-spin" />
              <p className="text-lg font-medium text-gray-700">
                PDF wird analysiert...
              </p>
              <p className="text-sm text-gray-500">
                Dies kann einen Moment dauern
              </p>
            </>
          ) : (
            <>
              {selectedFile ? (
                <>
                  <FileText className="w-16 h-16 text-primary-600" />
                  <div>
                    <p className="text-lg font-medium text-gray-700">
                      {selectedFile.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(selectedFile.size)}
                    </p>
                  </div>
                  <p className="text-sm text-primary-600">
                    Klicken Sie oder ziehen Sie eine andere Datei, um sie zu ersetzen
                  </p>
                </>
              ) : (
                <>
                  <Upload className="w-16 h-16 text-gray-400" />
                  <div>
                    <p className="text-lg font-medium text-gray-700">
                      PDF-Datei hier ablegen oder klicken
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Unterstützt werden PDF-Dateien bis 10 MB
                    </p>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
