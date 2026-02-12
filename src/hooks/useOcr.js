import { useState } from 'react';
import Tesseract from 'tesseract.js';
import { parsePakistaniBillText } from '../utils/ocrParser';

export const useOCR = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState({
    // Core fields
    units: '',
    tariffRate: '',
    baseCost: '',
    totalCharges: '',
    payableWithinDueDate: '',
    
    // Additional charges
    fuelAdjustment: '',
    fcSurcharge: '',
    quarterlyAdjustment: '',
    meterRent: '',
    serviceRent: '',
    electricityDuty: '',
    gst: '',
    
    // Metadata
    billMonth: '',
    company: '',
    
    // Detection status - CRITICAL for UI
    detectionStatus: {
      units: false,
      baseCost: false,
      fuelAdjustment: false,
      fcSurcharge: false,
      quarterlyAdjustment: false,
      meterRent: false,
      serviceRent: false,
      payableWithinDueDate: false,
      tariffRate: false,
      totalCharges: false,
      electricityDuty: false,
      gst: false
    }
  });
  
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const [rawText, setRawText] = useState('');

  const processImage = async (imageFile) => {
    setIsProcessing(true);
    setError('');
    setProgress(0);
    setRawText('');
    
    // Reset with COMPLETE empty state - NO FALLBACKS!
    setExtractedData({
      units: '',
      tariffRate: '',
      baseCost: '',
      totalCharges: '',
      payableWithinDueDate: '',
      fuelAdjustment: '',
      fcSurcharge: '',
      quarterlyAdjustment: '',
      meterRent: '',
      serviceRent: '',
      electricityDuty: '',
      gst: '',
      billMonth: '',
      company: '',
      detectionStatus: {
        units: false,
        baseCost: false,
        fuelAdjustment: false,
        fcSurcharge: false,
        quarterlyAdjustment: false,
        meterRent: false,
        serviceRent: false,
        payableWithinDueDate: false,
        tariffRate: false,
        totalCharges: false,
        electricityDuty: false,
        gst: false
      }
    });
    
    try {
      console.log("🔍 Starting OCR process...");
      
      const { data: { text } } = await Tesseract.recognize(
        imageFile,
        'eng',
        {
          logger: m => {
            console.log('📸 OCR Progress:', m);
            if (m.status === 'recognizing text') {
              setProgress(Math.round(m.progress * 100));
            }
          }
        }
      );
      
      console.log("📄 RAW OCR TEXT RECEIVED:");
      console.log("==================================");
      console.log(text);
      console.log("==================================");
      
      setRawText(text);
      
      // Parse the text using our updated parser
      const parsedData = parsePakistaniBillText(text);
      
      console.log("✅ PARSED DATA:");
      console.log("==================================");
      console.log(JSON.stringify(parsedData, null, 2));
      console.log("==================================");
      
      // Check what was actually detected
      const detectedFields = Object.entries(parsedData.detectionStatus || {})
        .filter(([_, detected]) => detected === true)
        .map(([field]) => field);
      
      console.log(`📊 DETECTED FIELDS: ${detectedFields.length ? detectedFields.join(', ') : 'NONE'}`);
      
      if (detectedFields.length === 0) {
        console.warn("⚠️ No fields were detected from the image!");
      }
      
      // Set the extracted data - THIS NOW INCLUDES ALL FIELDS!
      setExtractedData(parsedData);
      
    } catch (error) {
      console.error('❌ OCR Error:', error);
      setError('Failed to process image. Please try again or enter manually.');
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const resetExtractedData = () => {
    setExtractedData({
      units: '',
      tariffRate: '',
      baseCost: '',
      totalCharges: '',
      payableWithinDueDate: '',
      fuelAdjustment: '',
      fcSurcharge: '',
      quarterlyAdjustment: '',
      meterRent: '',
      serviceRent: '',
      electricityDuty: '',
      gst: '',
      billMonth: '',
      company: '',
      detectionStatus: {
        units: false,
        baseCost: false,
        fuelAdjustment: false,
        fcSurcharge: false,
        quarterlyAdjustment: false,
        meterRent: false,
        serviceRent: false,
        payableWithinDueDate: false,
        tariffRate: false,
        totalCharges: false,
        electricityDuty: false,
        gst: false
      }
    });
    setError('');
    setRawText('');
  };

  return {
    isProcessing,
    extractedData,
    error,
    progress,
    rawText,
    processImage,
    resetExtractedData,
    setExtractedData
  };
};