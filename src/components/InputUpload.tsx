import type { InputUploadProps } from '@/types';
import FileUploadIcon from '@/assets/svg/FileUpload.svg';
import React from 'react';
import Tooltip from './Tooltip';
import { TOOLTIP_POSITION } from '@/constants';

const InputUpload: React.FC<InputUploadProps> = ({
  id = 'file-upload',
  accept,
  multiple,
  onChange,
  onFilesSelected,
  label = 'Select file',
  selectedFiles,
}) => {
  const [isDragging, setIsDragging] = React.useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    onFilesSelected?.(files);
    onChange?.(event);
  };

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(event.dataTransfer.files ?? []);
    if (droppedFiles.length === 0) {
      return;
    }

    const acceptedExtensions = accept
      ? accept
          .split(',')
          .map((entry) => entry.trim().toLowerCase())
          .filter(Boolean)
      : [];

    const matchingFiles =
      acceptedExtensions.length === 0
        ? droppedFiles
        : droppedFiles.filter((file) => {
            const fileName = file.name.toLowerCase();
            return acceptedExtensions.some((extension) =>
              extension.startsWith('.') ? fileName.endsWith(extension) : true
            );
          });

    const nextFiles = multiple ? matchingFiles : matchingFiles.slice(0, 1);
    onFilesSelected?.(nextFiles);
  };

  const previewText =
    selectedFiles.length > 0
      ? selectedFiles.length === 1
        ? selectedFiles[0].name
        : `${selectedFiles.length} files selected`
      : 'Click to upload or drag and drop';

  return (
    <div className="my-5">
      <label
        htmlFor={id}
        className={`group relative flex cursor-pointer items-center justify-between rounded-md border bg-white/90 px-4 py-3 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 ${
          isDragging
            ? 'border-sky-400 ring-2 ring-sky-500/40'
            : 'border-gray-200 hover:border-gray-300'
        }`}
        onDragOver={handleDragOver}
        onDragEnter={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <img src={FileUploadIcon} alt="Upload Icon" />
          <div className="min-w-0 text-left truncate">
            <div className="text-md font-medium text-gray-600">{label}</div>
            <Tooltip
              content={previewText}
              placement={TOOLTIP_POSITION.BOTTOM}
              className="w-full max-w-64 sm:max-w-88"
            >
              <div className="block w-full text-sm text-gray-900">{previewText}</div>
            </Tooltip>
          </div>
        </div>
        <div className="shrink-0 pl-4 text-lg text-indigo-950 group-hover:underline">Browse</div>
        <input
          id={id}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          className="sr-only"
        />
      </label>
    </div>
  );
};

export default React.memo(InputUpload);
