import React, { useRef } from 'react';
import {
    UploadCloud,
    Trash2,
    Download,
    FileText,
    FileImage,
    FileCode2,
    FileType2,
} from 'lucide-react';

interface FileUploadFieldProps {
    label: string;
    onFilesChange: (files: File[]) => void;
    files: File[];
    error?: string;
    helperText?: string;
    accept?: string;
    multiple?: boolean;
}

const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return <FileText className="w-5 h-5 text-red-500" />;
    if (type.includes('image')) return <FileImage className="w-5 h-5 text-blue-500" />;
    if (type.includes('code') || type.includes('javascript')) return <FileCode2 className="w-5 h-5 text-yellow-500" />;
    return <FileType2 className="w-5 h-5 text-neutral-500" />;
};

const formatBytes = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Byte';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
};

const FileUploadField: React.FC<FileUploadFieldProps> = ({
    label,
    onFilesChange,
    files,
    error,
    helperText,
    accept = '*',
    multiple = true,
}) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);
            onFilesChange([...files, ...selectedFiles]);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (e.dataTransfer.files) {
            const droppedFiles = Array.from(e.dataTransfer.files);
            onFilesChange([...files, ...droppedFiles]);
        }
    };

    const handleDelete = (index: number) => {
        const updated = files.filter((_, i) => i !== index);
        onFilesChange(updated);
    };

    return (
        <div className="w-full">
            <label className="mb-2 block text-xl font-medium text-gray-900">{label}</label>
            <div
                className={`w-full p-6 border-2 border-dashed rounded-md text-center cursor-pointer hover:bg-gray-50 transition ${error ? 'border-red-500' : 'border-gray-300'
                    }`}
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
            >
                <UploadCloud className="mx-auto mb-2 h-6 w-6 text-gray-400" />
                <p className="text-sm text-gray-500">Drag & drop file here</p>
                <p className="text-sm text-gray-500 my-1">or</p>
                <button
                    type="button"
                    className="px-4 py-1.5 border text-sm rounded-md font-medium border-gray-300 hover:bg-gray-100"
                >
                    Select File
                </button>
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                    accept={accept}
                    multiple={multiple}
                />
            </div>

            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
            {!error && helperText && (
                <p className="mt-1 text-sm text-gray-500">{helperText}</p>
            )}

            <ul className="mt-4 space-y-2">
                {files.map((file, index) => (
                    <li
                        key={index}
                        className="flex items-center justify-between bg-gray-50 border rounded-md px-3 py-2"
                    >
                        <div className="flex items-center space-x-2 truncate">
                            {getFileIcon(file.type)}
                            <span className="text-sm truncate">
                                {file.name}{' '}
                                <span className="text-xs text-gray-400 ml-1">
                                    ({formatBytes(file.size)})
                                </span>
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                title="Download"
                                onClick={() => {
                                    const url = URL.createObjectURL(file);
                                    const a = document.createElement('a');
                                    a.href = url;
                                    a.download = file.name;
                                    a.click();
                                    URL.revokeObjectURL(url);
                                }}
                            >
                                <Download className="w-4 h-4 text-gray-500 hover:text-gray-700" />
                            </button>
                            <button
                                type="button"
                                title="Delete"
                                onClick={() => handleDelete(index)}
                            >
                                <Trash2 className="w-4 h-4 text-red-500 hover:text-red-700" />
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FileUploadField;
