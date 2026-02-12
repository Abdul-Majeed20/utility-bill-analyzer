import React from 'react';
import ImageUploader from './ImageUploader';
import ProcessingIndicator from './ProcessingIndicator';
import ExtractedDataDisplay from './ExtractedDataDisplay';

const UploadPhotoTab = ({
  uploadedImage,
  isProcessing,
  progress,
  extractedData,
  onImageUpload,
  onImageRemove
}) => {
  return (
    <div className="space-y-6">
      <ImageUploader
        uploadedImage={uploadedImage}
        isProcessing={isProcessing}
        onImageUpload={onImageUpload}
        onImageRemove={onImageRemove}
      />
      
      <ProcessingIndicator isProcessing={isProcessing} progress={progress} />
      
      {/* Always show ExtractedDataDisplay - it handles empty state */}
      <ExtractedDataDisplay extractedData={extractedData} />
    </div>
  );
};

export default UploadPhotoTab;