import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { setUploadedImage, clearUploadedImage, clearExtractedData } from '../redux/features/bill/Bill_Slice';
import ImageUploader from './ImageUploader';
import ProcessingIndicator from './ProcessingIndicator';
import ExtractedDataDisplay from './ExtractedDataDisplay';
import { getBillData } from '../redux/features/bill/billApi';

const UploadPhotoTab = () => {
  const dispatch = useDispatch();
  const { uploadedImage, extractedData, loading, error } = useSelector(state => state.bill);
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    dispatch(setUploadedImage(imageUrl));
    dispatch(clearExtractedData());    
    
    dispatch(getBillData(file));
  };
  useEffect(() => {
  return () => {
    dispatch(clearUploadedImage());
  };
}, []);

  const handleImageRemove = () => {
    dispatch(clearUploadedImage());
    dispatch(clearExtractedData());
  };

  return (
    <div className="space-y-8">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-3xl"></div>
        <div className="relative bg-white/50 backdrop-blur-sm rounded-3xl p-6 border-2 border-dashed border-gray-200 hover:border-blue-400 transition-colors">
          <ImageUploader
            uploadedImage={uploadedImage}
            isProcessing={loading}
            onImageUpload={handleImageUpload}
            onImageRemove={handleImageRemove}
          />
        </div>
      </div>
      
      {loading && (
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur"></div>
          <div className="relative bg-white rounded-2xl p-6 shadow-lg">
            <ProcessingIndicator isProcessing={loading} progress={0} />
          </div>
        </div>
      )}
      
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-2xl"></div>
        <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          <ExtractedDataDisplay 
            extractedData={extractedData} 
            isProcessing={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default UploadPhotoTab;
