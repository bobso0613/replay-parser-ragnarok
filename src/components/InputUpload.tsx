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
  label = 'Select file',
  selectedFiles,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(event);
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
        className="group relative flex cursor-pointer items-center justify-between rounded-md border border-gray-200 bg-white/90 px-4 py-3 shadow-sm hover:border-gray-300 focus-within:ring-2 focus-within:ring-indigo-500"
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
