import React, { useState } from 'react';
import { Bot, Send, Loader, Lightbulb, AlertCircle, Zap } from 'lucide-react';

const AIExplanationPanel = ({ billData, formatCurrency }) => {
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [error, setError] = useState('');

  const generateExplanation = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // Safely extract data with fallbacks
      const units = parseFloat(billData?.units) || 0;
      const tariffRate = parseFloat(billData?.tariffRate) || 0;
      const totalBill = parseFloat(billData?.totalBill) || parseFloat(billData?.payableWithinDueDate) || 0;
      const extraCharges = parseFloat(billData?.extraCharges) || 0;
      const fuelAdjustment = parseFloat(billData?.fuelAdjustment) || 0;
      const fcSurcharge = parseFloat(billData?.fcSurcharge) || 0;
      const quarterlyAdjustment = parseFloat(billData?.quarterlyAdjustment) || 0;
      const company = billData?.company || 'Pakistani Electricity Company';
      
      // Calculate additional metrics for better context
      const avgCostPerUnit = units > 0 ? (totalBill / units).toFixed(2) : 0;
      const isHighUsage = units > 30;
      const baseCost = units * tariffRate;
      
      // Construct detailed prompt for OpenAI
      const messages = [
        {
          role: "system",
          content: "You are a helpful utility bill assistant for Pakistani consumers. You explain electricity bills in simple, easy-to-understand Urdu/English mixed language. Keep responses friendly, practical, and concise (max 150 words). Use emojis and make it feel like a helpful friend explaining."
        },
        {
          role: "user",
          content: `Please explain this electricity bill in simple Urdu/English mix:

BILL DETAILS:
- Company: ${company}
- Units Consumed: ${units} kWh
- Tariff Rate: Rs ${tariffRate.toFixed(2)} per unit
- Base Electricity Cost: Rs ${baseCost.toFixed(2)}
- Fuel Price Adjustment (FPA): Rs ${fuelAdjustment.toFixed(2)}
- FC Surcharge: Rs ${fcSurcharge.toFixed(2)}
- Quarterly Tariff Adjustment: Rs ${quarterlyAdjustment.toFixed(2)}
- Other Extra Charges: Rs ${extraCharges.toFixed(2)}
- Total Bill Amount: Rs ${totalBill.toFixed(2)}
- Average Rate per Unit: Rs ${avgCostPerUnit}
- Usage Status: ${isHighUsage ? 'HIGH (above 30 units)' : 'NORMAL (within 30 units)'}

Please provide:
1. A warm greeting in Urdu/English mix (start with "Assalam-o-Alaikum!")
2. Simple breakdown of what they're paying for
3. ${isHighUsage ? 'Usage is high - give 2 specific tips to reduce it' : 'Usage is normal - praise them and give 1 tip to save more'}
4. Explain FPA and surcharges in very simple terms
5. End with an encouraging message`
        }
      ];

      // Call OpenAI API
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo', // You can also use 'gpt-4' if you have access
          messages: messages,
          temperature: 0.7,
          max_tokens: 400,
          top_p: 0.8,
          frequency_penalty: 0.3,
          presence_penalty: 0.3
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`OpenAI API failed: ${errorData.error?.message || response.status}`);
      }

      const data = await response.json();
      
      // Extract the generated text from OpenAI response
      const generatedText = data.choices?.[0]?.message?.content;
      
      if (!generatedText) {
        throw new Error('No explanation generated');
      }

      setExplanation(generatedText);
      setShowExplanation(true);
      
    } catch (error) {
      console.error('OpenAI API Error:', error);
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