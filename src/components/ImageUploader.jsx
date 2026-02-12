import React from 'react';

const ImageUploader = ({ uploadedImage, isProcessing, onImageUpload, onImageRemove }) => {
  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
      {uploadedImage ? (
        <div className="space-y-4">
          <img 
            src={uploadedImage} 
            alt="Uploaded bill" 
            className="max-h-64 mx-auto rounded-lg shadow-sm"
          />
          <button
            onClick={onImageRemove}
            disabled={isProcessing}
            className="text-sm text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Remove image
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-gray-600">
            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H8a4 4 0 01-4-4V12a4 4 0 014-4h12m8 0l4-4m-4 4l-4-4m4 4v16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <label htmlFor="image-upload" className="cursor-pointer">
              <span className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                Upload Bill Image
              </span>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={onImageUpload}
                className="hidden"
                disabled={isProcessing}
              />
            </label>
          </div>
          <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;