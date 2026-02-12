import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './components/Header';
import TabNavigation from './components/TabNavigation';
import UploadPhotoTab from './components/UploadPhotoTab';
import ManualEntryTab from './components/ManualEntryTab';
import ErrorMessage from './components/ErrorMessage';
import SubmitButton from './components/SubmitButton';
import { useOCR } from './hooks/useOCR';
import { validateForm } from './utils/validation';

const Home = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('upload');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [manualData, setManualData] = useState({
    units: '',
    tariffRate: '35.57',
    fuelAdjustment: '0',
    fcSurcharge: '0',
    quarterlyAdjustment: '0',
    meterRent: '1',
    serviceRent: '1',
    extraCharges: '0'
  });
  const [errors, setErrors] = useState({});

  const {
    isProcessing,
    extractedData,
    error: ocrError,
    progress,
    processImage,
    resetExtractedData
  } = useOCR();

  // Auto-fill manual data when extracted data is available
  useEffect(() => {
    if (extractedData.units) {
      setManualData({
        units: extractedData.units,
        tariffRate: extractedData.tariffRate || '35.57',
        fuelAdjustment: extractedData.fuelAdjustment || '0',
        fcSurcharge: extractedData.fcSurcharge || '0',
        quarterlyAdjustment: extractedData.quarterlyAdjustment || '0',
        meterRent: extractedData.meterRent || '1',
        serviceRent: extractedData.serviceRent || '1',
        extraCharges: (
          parseFloat(extractedData.fuelAdjustment || 0) +
          parseFloat(extractedData.fcSurcharge || 0) +
          parseFloat(extractedData.quarterlyAdjustment || 0)
        ).toString()
      });
    }
  }, [extractedData]);

  // ================= IMAGE PREPROCESSING =================
  const preprocessImage = (file) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        // Resize for better OCR
        const maxWidth = 2000;
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement('canvas');
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Convert to grayscale + increase contrast
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
          const bright = gray > 128 ? 255 : 0; // simple threshold
          data[i] = data[i + 1] = data[i + 2] = bright;
        }
        ctx.putImageData(imageData, 0, 0);

        canvas.toBlob((blob) => resolve(blob), 'image/png', 1);
      };
    });
  };

  // ================= HANDLE IMAGE UPLOAD =================
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadedImage(URL.createObjectURL(file));
    resetExtractedData();

    try {
      const preprocessedFile = await preprocessImage(file);
      processImage(preprocessedFile); // send preprocessed image to OCR
    } catch (err) {
      console.error('Image preprocessing failed', err);
    }
  };

  const handleImageRemove = () => {
    setUploadedImage(null);
    resetExtractedData();
  };

  // ================= MANUAL INPUT =================
  const handleManualInputChange = (e) => {
    const { name, value } = e.target;
    setManualData((prev) => ({ ...prev, [name]: value }));

    if (['fuelAdjustment', 'fcSurcharge', 'quarterlyAdjustment'].includes(name)) {
      const fuelAdj = parseFloat(name === 'fuelAdjustment' ? value : manualData.fuelAdjustment) || 0;
      const fcSur = parseFloat(name === 'fcSurcharge' ? value : manualData.fcSurcharge) || 0;
      const qta = parseFloat(name === 'quarterlyAdjustment' ? value : manualData.quarterlyAdjustment) || 0;
      setManualData((prev) => ({ ...prev, extraCharges: (fuelAdj + fcSur + qta).toString() }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // ================= TAB CHANGE =================
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setErrors({});
    if (tab === 'manual' && extractedData.units) {
      setManualData((prev) => ({
        ...prev,
        units: extractedData.units,
        tariffRate: extractedData.tariffRate || '35.57'
      }));
    }
  };

  // ================= FORM SUBMIT =================
  const handleSubmit = () => {
    let dataToSubmit = {};

    if (activeTab === 'upload') {
      if (!extractedData.units) {
        setErrors({ form: 'Please upload a valid bill image or switch to manual entry' });
        return;
      }

      const extraCharges = (
        parseFloat(extractedData.fuelAdjustment || 0) +
        parseFloat(extractedData.fcSurcharge || 0) +
        parseFloat(extractedData.quarterlyAdjustment || 0) +
        parseFloat(extractedData.meterRent || 0) +
        parseFloat(extractedData.serviceRent || 0)
      ).toFixed(2);

      dataToSubmit = {
        units: extractedData.units,
        tariffRate: extractedData.tariffRate || '35.57',
        extraCharges,
        fuelAdjustment: extractedData.fuelAdjustment || '0',
        fcSurcharge: extractedData.fcSurcharge || '0',
        quarterlyAdjustment: extractedData.quarterlyAdjustment || '0',
        meterRent: extractedData.meterRent || '1',
        serviceRent: extractedData.serviceRent || '1',
        baseCost: extractedData.baseCost || '0',
        totalCharges: extractedData.totalCharges || '0'
      };
    } else {
      const extraCharges = (
        parseFloat(manualData.fuelAdjustment || 0) +
        parseFloat(manualData.fcSurcharge || 0) +
        parseFloat(manualData.quarterlyAdjustment || 0) +
        parseFloat(manualData.meterRent || 1) +
        parseFloat(manualData.serviceRent || 1)
      ).toFixed(2);

      dataToSubmit = { ...manualData, extraCharges };
    }

    // Validate required fields
    const validationErrors = validateForm({
      units: dataToSubmit.units,
      tariffRate: dataToSubmit.tariffRate,
      extraCharges: dataToSubmit.extraCharges
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Navigate to dashboard with parsed data
    navigate('/dashboard', {
      state: {
        billData: {
          ...dataToSubmit,
          units: Number(dataToSubmit.units),
          tariffRate: Number(dataToSubmit.tariffRate),
          extraCharges: Number(dataToSubmit.extraCharges),
          fuelAdjustment: Number(dataToSubmit.fuelAdjustment || 0),
          fcSurcharge: Number(dataToSubmit.fcSurcharge || 0),
          quarterlyAdjustment: Number(dataToSubmit.quarterlyAdjustment || 0),
          meterRent: Number(dataToSubmit.meterRent || 1),
          serviceRent: Number(dataToSubmit.serviceRent || 1)
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />

        {activeTab === 'upload' && (
          <UploadPhotoTab
            uploadedImage={uploadedImage}
            isProcessing={isProcessing}
            progress={progress}
            extractedData={extractedData}
            onImageUpload={handleImageUpload}
            onImageRemove={handleImageRemove}
          />
        )}

        {activeTab === 'manual' && (
          <ManualEntryTab
            formData={manualData}
            errors={errors}
            onInputChange={handleManualInputChange}
          />
        )}

        <ErrorMessage message={errors.form} />
        <ErrorMessage message={ocrError} />

        <SubmitButton isProcessing={isProcessing} onClick={handleSubmit} />
      </main>
    </div>
  );
};

export default Home;
