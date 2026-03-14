import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Calendar,
  Zap,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Clock,
  FileText,
  Download,
  Eye,
  ChevronRight,
  Filter,
  Search,
  X,
  AlertCircle,
  BarChart3,
  PieChart,
  RefreshCw
} from 'lucide-react';
import { getBillHistory } from '../redux/features/bill/billApi';
import BillDetailsModal from './BillDetailsModel';
import Header from './Header';


const BillHistory = () => {
  const dispatch = useDispatch();
 const { bills = [], loading = false, error = null, stats = {} } =
  useSelector((state) => state.bill?.billHistory || {});

  const [searchTerm, setSearchTerm] = useState('');
  const [filterMonth, setFilterMonth] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedBill, setSelectedBill] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'

  // Fetch bill history on component mount
  useEffect(() => {
     console.log("Dispatching getBillHistory");
    dispatch(getBillHistory());
  }, [dispatch]);

  console.log("Bill History Data:", bills);

  // Filter and sort bills
  const filteredBills = bills
    ?.filter(bill => {
      // Search filter
      const matchesSearch = 
        bill.vendor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bill.billMonth?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bill.unitsConsumed?.toString().includes(searchTerm);
      
      // Month filter
      const billDate = new Date(bill.createdAt);
      const billMonth = billDate.toLocaleString('default', { month: 'long' });
      const matchesMonth = filterMonth === 'all' || billMonth === filterMonth;
      
      return matchesSearch && matchesMonth;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortBy === 'oldest') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else if (sortBy === 'highest') {
        return (b.totalAmount || 0) - (a.totalAmount || 0);
      } else if (sortBy === 'lowest') {
        return (a.totalAmount || 0) - (b.totalAmount || 0);
      }
      return 0;
    });

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-PK', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleViewBill = (bill) => {
    setSelectedBill(bill);
    setShowModal(true);
  };

  const handleRefresh = () => {
    dispatch(getBillHistory());
  };

  const getMonthOptions = () => {
    const months = ['all', 'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    return months;
  };

  if (loading && bills?.length === 0) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
          <p className="text-gray-600">Loading your bill history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <Header />
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold flex items-center">
            <FileText className="h-6 w-6 mr-2" />
            Bill History
          </h2>
          <button
            onClick={handleRefresh}
            className="bg-white/20 backdrop-blur-sm p-2 rounded-xl hover:bg-white/30 transition-all"
            title="Refresh"
          >
            <RefreshCw className="h-5 w-5" />
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
            <p className="text-blue-100 text-xs mb-1">Total Bills</p>
            <p className="text-2xl font-bold">{stats?.totalBills}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
            <p className="text-blue-100 text-xs mb-1">Total Spent</p>
            <p className="text-2xl font-bold">{formatCurrency(stats?.totalAmount)}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
            <p className="text-blue-100 text-xs mb-1">Average Bill</p>
            <p className="text-2xl font-bold">{formatCurrency(stats?.averageBill)}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
            <p className="text-blue-100 text-xs mb-1">Total Units</p>
            <p className="text-2xl font-bold">{stats?.unitsConsumed} kWh</p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-lg p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by company or month..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>

          {/* Month Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
            >
              {getMonthOptions().map(month => (
                <option key={month} value={month}>
                  {month === 'all' ? 'All Months' : month}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="relative">
            <BarChart3 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Amount</option>
              <option value="lowest">Lowest Amount</option>
            </select>
          </div>

          {/* View Toggle */}
          <div className="flex bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                viewMode === 'list'
                  ? 'bg-white text-blue-600 shadow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              List
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                viewMode === 'grid'
                  ? 'bg-white text-blue-600 shadow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Grid
            </button>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Failed to load bill history</h3>
              <p className="text-xs text-red-700 mt-1">{error}</p>
              <button
                onClick={handleRefresh}
                className="mt-2 text-xs bg-white text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredBills?.length === 0 && (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <div className="bg-gray-100 rounded-full p-4 inline-block mb-4">
            <FileText className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Bills Found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || filterMonth !== 'all'
              ? "No bills match your search criteria. Try adjusting your filters."
              : "You haven't analyzed any bills yet. Upload your first bill to get started!"}
          </p>
          {(searchTerm || filterMonth !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterMonth('all');
              }}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}

      {/* Bill List/Grid View */}
      {filteredBills?.length > 0 && (
        <>
          {viewMode === 'list' ? (
            // List View
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="divide-y divide-gray-100">
                {filteredBills.map((bill) => (
                  <div
                    key={bill._id}
                    className="p-4 hover:bg-gray-50 transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {/* Icon */}
                        <div className="bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl p-3">
                          <Zap className="h-6 w-6 text-white" />
                        </div>
                        
                        {/* Details */}
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {bill.vendor || 'Electricity Bill'}
                          </h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                            <span className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {formatDate(bill.billMonth)}
                            </span>
                            <span className="flex items-center">
                              <Zap className="h-3 w-3 mr-1" />
                              {bill.unitsConsumed || 0} kWh
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Amount and Actions */}
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">
                            {formatCurrency(bill.totalAmount)}
                          </p>
                          {bill.savedAmount > 0 && (
                            <p className="text-xs text-green-600">
                              Saved {formatCurrency(bill.savedAmount)}
                            </p>
                          )}
                        </div>
                        
                        <button
                          onClick={() => handleViewBill(bill)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-5 w-5 text-gray-500" />
                        </button>
                        
                        <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            // Grid View
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredBills.map((bill) => (
                <div
                  key={bill._id}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all transform hover:-translate-y-1 cursor-pointer"
                  onClick={() => handleViewBill(bill)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl p-3">
                      <FileText className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(bill.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {bill.company || 'Electricity Bill'}
                  </h4>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Units:</span>
                      <span className="font-medium text-gray-900">{bill.units || 0} kWh</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Amount:</span>
                      <span className="font-bold text-blue-600">{formatCurrency(bill.totalAmount)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>View Details →</span>
                    {bill.savedAmount > 0 && (
                      <span className="text-green-600">Saved {formatCurrency(bill.savedAmount)}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Bill Details Modal */}
      {showModal && selectedBill && (
        <BillDetailsModal
          bill={selectedBill}
          onClose={() => {
            setShowModal(false);
            setSelectedBill(null);
          }}
          formatCurrency={formatCurrency}
        />
      )}
    </div>
  );
};

export default BillHistory;