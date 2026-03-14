import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Zap,
  Camera,
  TrendingUp,
  DollarSign,
  Shield,
  Award,
  FileText,
} from "lucide-react";
import { toast } from "react-toastify";
import Header from "./components/Header";
import TabNavigation from "./components/TabNavigation";
import UploadPhotoTab from "./components/UploadPhotoTab";
import ManualEntryTab from "./components/ManualEntryTab";
import ErrorMessage from "./components/ErrorMessage";
import SubmitButton from "./components/SubmitButton";
import { checkUser } from "./redux/features/auth/authApi";
import { autoFillFromExtracted } from "./redux/features/bill/Bill_Slice";
import { submitManualBillData } from "./redux/features/bill/billApi";
import { clearError } from "./redux/features/bill/Bill_Slice";
import { clearBillData } from "./redux/features/bill/Bill_Slice";
const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { activeTab, extractedData, manualData, loading, submitting, error } =
    useSelector((state) => state.bill);

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkUser());
    dispatch(clearBillData());
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error]);

  // Auto-fill manual data when extracted data is available
  useEffect(() => {
    if (activeTab === "manual" && extractedData.units) {
      dispatch(autoFillFromExtracted());
    }
  }, [activeTab, extractedData.units, dispatch]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    let dataToSubmit = {};

    if (activeTab === "upload") {
      if (!extractedData.units) {
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
        tariffRate: extractedData.tariffRate || "35.57",
        extraCharges,
        fuelAdjustment: extractedData.fuelAdjustment || "0",
        fcSurcharge: extractedData.fcSurcharge || "0",
        quarterlyAdjustment: extractedData.quarterlyAdjustment || "0",
        meterRent: extractedData.meterRent || "1",
        serviceRent: extractedData.serviceRent || "1",
        baseCost: extractedData.baseCost || "0",
        totalCharges: extractedData.totalCharges || "0",
      };

      // For upload tab, we already have the data from OCR - navigate directly
      navigate("/dashboard", {
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
            serviceRent: Number(dataToSubmit.serviceRent || 1),
          },
        },
      });
    } else if (activeTab === "manual") {
      // Validate manual data
      if (!manualData.units || !manualData.tariffRate) {
        return;
      }

      const extraCharges = (
        parseFloat(manualData.fuelAdjustment || 0) +
        parseFloat(manualData.fcSurcharge || 0) +
        parseFloat(manualData.quarterlyAdjustment || 0) +
        parseFloat(manualData.meterRent || 1) +
        parseFloat(manualData.serviceRent || 1)
      ).toFixed(2);

      dataToSubmit = { ...manualData, extraCharges };

      // Submit manual data to backend and navigate on success
      dispatch(submitManualBillData(dataToSubmit)).then((result) => {
        if (submitManualBillData.fulfilled.match(result)) {
          // Use the analyzed data from the backend response
          const analyzedData = result.payload?.data || {};
          navigate("/dashboard", {
            state: {
              billData: {
                ...dataToSubmit,
                ...analyzedData,
                units: Number(analyzedData.units || dataToSubmit.units),
                tariffRate: Number(
                  analyzedData.tariffRate || dataToSubmit.tariffRate,
                ),
                extraCharges: Number(
                  analyzedData.totalExtraCharges || dataToSubmit.extraCharges,
                ),
                baseCost: Number(analyzedData.baseCost || 0),
                totalCharges: Number(analyzedData.totalCharges || 0),
                fuelAdjustment: Number(
                  analyzedData.fuelAdjustment ||
                    dataToSubmit.fuelAdjustment ||
                    0,
                ),
                fcSurcharge: Number(
                  analyzedData.fcSurcharge || dataToSubmit.fcSurcharge || 0,
                ),
                quarterlyAdjustment: Number(
                  analyzedData.quarterlyAdjustment ||
                    dataToSubmit.quarterlyAdjustment ||
                    0,
                ),
                meterRent: Number(
                  analyzedData.meterRent || dataToSubmit.meterRent || 1,
                ),
                serviceRent: Number(
                  analyzedData.serviceRent || dataToSubmit.serviceRent || 1,
                ),
              },
            },
          });
        }
      });
    }
  };

  const isProcessing = loading || submitting;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-yellow-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float animation-delay-4000"></div>
      </div>

      <Header user={user} />

      <main className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg mb-6">
            <Zap className="h-4 w-4 mr-2" />
            Pakistan's #1 Bill Analyzer
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Understand Your{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Electricity Bill
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload your bill or enter details manually. Get instant AI-powered
            insights and save money.
          </p>

          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-8">
            <div className="flex items-center space-x-2">
              <div className="bg-green-100 p-2 rounded-lg">
                <Camera className="h-5 w-5 text-green-600" />
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-500">OCR Accuracy</p>
                <p className="text-lg font-semibold text-gray-900">98.5%</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Zap className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-500">Avg. Processing</p>
                <p className="text-lg font-semibold text-gray-900">2.5 sec</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="bg-purple-100 p-2 rounded-lg">
                <DollarSign className="h-5 w-5 text-purple-600" />
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-500">Saved by Users</p>
                <p className="text-lg font-semibold text-gray-900">Rs 2.5M+</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Card */}
        <form onSubmit={handleSubmit}>
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-6 md:p-8 border border-white/20">
            {/* Tab Navigation */}
            <TabNavigation />

            {/* Active Tab Content */}
            <div className="mt-8">
              {activeTab === "upload" ? <UploadPhotoTab /> : <ManualEntryTab />}
            </div>

            {/* Submit Button */}
            <div className="mt-8">
              <SubmitButton />
            </div>
          </div>
        </form>

        {/* Trust Badges */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-8">
          <div className="flex items-center space-x-2 text-gray-500">
            <Shield className="h-5 w-5 text-green-500" />
            <span className="text-sm">SSL Secured</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-500">
            <Award className="h-5 w-5 text-yellow-500" />
            <span className="text-sm">100% Free</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-500">
            <FileText className="h-5 w-5 text-blue-500" />
            <span className="text-sm">No Sign-up Required</span>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <Camera className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Smart OCR
            </h3>
            <p className="text-gray-600 text-sm">
              Automatically extracts units, charges, and due amount from any
              Pakistani electricity bill.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              AI Analysis
            </h3>
            <p className="text-gray-600 text-sm">
              Get personalized insights and money-saving tips based on your
              consumption patterns.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
            <div className="bg-gradient-to-br from-green-500 to-green-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Savings Simulator
            </h3>
            <p className="text-gray-600 text-sm">
              See how much you can save by adjusting AC temperature, using LED
              bulbs, and more.
            </p>
          </div>
        </div>
      </main>

      <style>{`
        @keyframes float {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-float {
          animation: float 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default Home;
