import React, { useState } from 'react';
import { Bot, Send, Loader, Lightbulb, AlertCircle, Zap } from 'lucide-react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generateBillExplanation } from '../redux/features/bill/billApi';

const AIExplanationPanel = ({ billData, formatCurrency }) => {
  const { billExplanation } = useSelector(state => state.bill);
  const dispatch = useDispatch();

//  console.log("AIExplanationPanel - billData:", billData);
 console.log("AIExplanationPanel - billExplanation:", billExplanation);

  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
  if (billExplanation) {
    setExplanation(billExplanation);
    setShowExplanation(true);
  }
}, [billExplanation]);

  const generateExplanation = async () => {
    setIsLoading(true);
    setError('');
    
    try {
     console.log("Dispatching generateBillExplanation with billData:", billData);
       await dispatch(generateBillExplanation(billData)).unwrap();
      
    } catch (error) {
      console.error('Gemini API Error:', error);
      setError(`Failed to generate explanation: ${error.message}. Showing fallback.`);
      
      // Fallback explanation if API fails
      const fallbackText = generateFallbackExplanation(billData);
      setExplanation(fallbackText);
      setShowExplanation(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Fallback explanation generator if API fails
  const generateFallbackExplanation = (data) => {
    const units = parseFloat(data?.units) || 0;
    const tariffRate = parseFloat(data?.tariffRate) || 35.57;
    const totalBill = parseFloat(data?.totalBill) || parseFloat(data?.payableWithinDueDate) || 0;
    const fuelAdjustment = parseFloat(data?.fuelAdjustment) || 0;
    const fcSurcharge = parseFloat(data?.fcSurcharge) || 0;
    const quarterlyAdjustment = parseFloat(data?.quarterlyAdjustment) || 0;
    const company = data?.company || 'LESCO';
    const isHighUsage = units > 30;
    
    let text = `🖐️ **Assalam-o-Alaikum!**\n\n`;
    text += `آپ کا **${company}** بل **Rs ${totalBill.toFixed(2)}** ہے۔\n\n`;
    text += `📊 **آپ نے ${units} یونٹ بجلی استعمال کی۔**\n\n`;
    
    if (isHighUsage) {
      text += `⚠️ آپ کا استعمال اوسط (30 یونٹ) سے زیادہ ہے۔ اس لیے بل زیادہ آیا ہے۔\n\n`;
      text += `💡 **بجلی بچانے کے لیے:**\n`;
      text += `• ایئر کنڈیشنر 24°C پر چلائیں - اس سے 30% بچت ہوگی\n`;
      text += `• پرانے بلب کو LED سے تبدیل کریں - 75% بچت\n`;
      text += `• سٹینڈ بے موڈ میں آلات بند کریں - 10% بچت\n\n`;
    } else {
      text += `✅ بہت اچھا! آپ کا استعمال نارمل حد میں ہے۔\n\n`;
      text += `💡 **مزید بچت کے لیے:**\n`;
      text += `• پنکھے کم رفتار پر چلائیں\n`;
      text += `• فریج کا دروازہ بند رکھیں\n\n`;
    }
    
    text += `💰 **بل کی تفصیل:**\n`;
    text += `• بنیادی قیمت: Rs ${(units * tariffRate).toFixed(2)} (${units} یونٹ × Rs ${tariffRate.toFixed(2)})\n`;
    if (fuelAdjustment > 0) text += `• فیول ایڈجسٹمنٹ (FPA): Rs ${fuelAdjustment.toFixed(2)} - ایندھن کی قیمت میں تبدیلی\n`;
    if (fcSurcharge > 0) text += `• ایف سی سرچارج: Rs ${fcSurcharge.toFixed(2)}\n`;
    if (quarterlyAdjustment > 0) text += `• کوارٹرلی ایڈجسٹمنٹ: Rs ${quarterlyAdjustment.toFixed(2)}\n`;
    text += `• ٹیکسز: 5%\n\n`;
    
    text += `🤝 **اگلے مہینے کم بل کے لیے ان تجاویز پر عمل کریں۔**\n`;
    text += `شکریہ! اللہ حافظ۔`;
    
    return text;
  };

  // Don't render if no bill data
  if (!billData || !billData.units) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <Bot className="h-5 w-5 text-purple-600 mr-2" />
          AI Bill Explainer (OpenAI)
        </h3>
        {!showExplanation && (
          <button
            onClick={generateExplanation}
            disabled={isLoading}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all transform hover:scale-105 flex items-center space-x-2 disabled:opacity-50 disabled:hover:scale-100 shadow-md"
          >
            {isLoading ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            <span>{isLoading ? 'Analyzing with OpenAI...' : 'Explain My Bill with AI'}</span>
          </button>
        )}
      </div>

      {!showExplanation && !isLoading && (
        <div className="text-center py-8">
          <div className="bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full p-4 inline-block mx-auto mb-4">
            <Bot className="h-12 w-12 text-purple-600" />
          </div>
          <p className="text-gray-600 mb-2">Get a personalized explanation of your bill</p>
          <p className="text-sm text-gray-500">Powered by OpenAI GPT</p>
        </div>
      )}

      {isLoading && (
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-purple-600 rounded-full p-2 animate-pulse">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div className="h-4 bg-purple-200 rounded w-32 animate-pulse"></div>
          </div>
          <div className="space-y-3">
            <div className="h-4 bg-purple-100 rounded w-3/4 animate-pulse"></div>
            <div className="h-4 bg-purple-100 rounded w-full animate-pulse"></div>
            <div className="h-4 bg-purple-100 rounded w-2/3 animate-pulse"></div>
            <div className="h-4 bg-purple-100 rounded w-5/6 animate-pulse"></div>
          </div>
          <p className="text-xs text-purple-600 mt-4 flex items-center">
            <Zap className="h-3 w-3 mr-1" />
            OpenAI is analyzing your bill...
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2" />
            <div>
              <p className="text-sm text-red-700">{error}</p>
              <p className="text-xs text-red-600 mt-1">Showing fallback explanation instead.</p>
            </div>
          </div>
        </div>
      )}

      {showExplanation && explanation && (
        <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 rounded-2xl p-6 border border-purple-100 shadow-lg">
          <div className="flex items-start space-x-3">
            <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full p-2 flex-shrink-0 shadow-lg">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-800 to-indigo-800">
                  OpenAI Assistant
                </p>
                <span className="text-xs bg-white px-2 py-1 rounded-full text-purple-600 shadow-sm">
                  {billData?.company || 'Pakistani Bill Expert'}
                </span>
              </div>
              
              <div className="prose prose-sm max-w-none">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-inner">
                  <p className="text-gray-800 whitespace-pre-line leading-relaxed text-sm">
                    {explanation}
                  </p>
                </div>
              </div>
              
              {/* Quick Stats Row */}
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="bg-white/60 backdrop-blur-sm rounded-lg p-2 text-center">
                  <p className="text-xs text-gray-600">Total Bill</p>
                  <p className="text-sm font-bold text-purple-700">
                    {formatCurrency(parseFloat(billData?.totalBill || billData?.payableWithinDueDate || 0))}
                  </p>
                </div>
                <div className="bg-white/60 backdrop-blur-sm rounded-lg p-2 text-center">
                  <p className="text-xs text-gray-600">Units Used</p>
                  <p className="text-sm font-bold text-indigo-700">{billData?.units || 0} kWh</p>
                </div>
              </div>
              
              <div className="mt-4 pt-3 border-t border-purple-200 flex items-start space-x-2">
                <Lightbulb className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-gray-600 italic">
                  This explanation is generated by OpenAI GPT based on your bill data. 
                  Always verify with your electricity provider for official billing information.
                </p>
              </div>
              
              <div className="mt-3 flex justify-end">
                <button
                  onClick={() => {
                    setShowExplanation(false);
                    setExplanation('');
                    setError('');
                  }}
                  className="text-xs bg-white text-purple-600 hover:text-purple-800 font-medium px-3 py-1.5 rounded-full shadow-sm hover:shadow transition-all"
                >
                  Ask OpenAI Again →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIExplanationPanel;