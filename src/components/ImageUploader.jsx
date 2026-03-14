import React from 'react';
import { Upload, Camera, X, Image as ImageIcon } from 'lucide-react';

const ImageUploader = ({ uploadedImage, isProcessing, onImageUpload, onImageRemove }) => {
  return (
    <div className="relative">
      {uploadedImage ? (
        <div className="relative group">
          {/* Image Preview */}
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 shadow-2xl">
            <img 
              src={uploadedImage} 
              alt="Uploaded bill" 
              className="w-full h-64 object-contain bg-gray-900"
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Remove Button */}
            <button
              onClick={onImageRemove}
              disabled={isProcessing}
              className="absolute top-4 right-4 p-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all transform hover:scale-110 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X className="h-5 w-5" />
            </button>
            
            {/* Success Badge */}
            <div className="absolute bottom-4 left-4 bg-green-500 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center space-x-2 shadow-lg">
              <span className="h-2 w-2 bg-white rounded-full animate-pulse"></span>
              <span>Image Uploaded</span>
            </div>
          </div>
        </div>
      ) : (
        <label className={`
          relative block w-full cursor-pointer
          transition-all duration-300 transform hover:scale-[1.01]
          ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
        `}>
          {/* Animated Background */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
          
          {/* Upload Area */}
          <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors p-12">
            <div className="text-center">
              {/* Icon */}
              <div className="inline-flex p-4 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl shadow-lg mb-6">
                <Camera className="h-10 w-10 text-white" />
              </div>
              
              {/* Text */}
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Upload Your Bill
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Take a clear photo or upload an image of your Pakistani electricity bill
              </p>
              
              {/* File Types */}
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-500 mb-6">
                <span className="flex items-center">
                  <ImageIcon className="h-4 w-4 mr-1" />
                  PNG, JPG
                </span>
                <span className="text-gray-300">•</span>
                <span className="flex items-center">
                  <Camera className="h-4 w-4 mr-1" />
                  Max 10MB
                </span>
              </div>
              
              {/* Upload Button */}
              <span className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                <Upload className="h-5 w-5 mr-2" />
                Choose Image
              </span>
              
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={onImageUpload}
                className="hidden"
                disabled={isProcessing}
              />
            </div>
          </div>
        </label>
      )}
    </div>
  );
};

export default ImageUploader;