import React, { useState, useEffect } from 'react';
import {
  Users,
  Mail,
  Building,
  MessageSquare,
  CheckCircle,
  XCircle,
  Eye,
  Trash2,
  RefreshCw,
  Search,
  Filter,
  AlertCircle,
  UserCheck,
  UserX,
  MailOpen,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Phone
} from 'lucide-react';
import { toast } from 'react-toastify';
import { api } from '../../../utils/app';

const HandleFranchiseRequests = () => {
  // States
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState({ status: '' });

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Status options for dropdown
  const statusOptions = [
    { value: 'reviewed', label: 'Reviewed', icon: <MailOpen className="w-4 h-4" />, color: 'bg-blue-100 text-blue-800' },
    { value: 'approved', label: 'Approved', icon: <UserCheck className="w-4 h-4" />, color: 'bg-green-100 text-green-800' },
    { value: 'rejected', label: 'Rejected', icon: <UserX className="w-4 h-4" />, color: 'bg-red-100 text-red-800' }
  ];

  // Items per page options
  const itemsPerPageOptions = [5, 10, 20, 50];

  // Fetch franchise requests with pagination
  const fetchRequests = async (page = 1) => {
    try {
      setLoading(true);
      const params = {
        page,
        per_page: itemsPerPage,
        ...(searchTerm && { search: searchTerm }),
        ...(filterStatus !== 'all' && { status: filterStatus })
      };

      const response = await api.get('/admin/franchise-applications', { params });
      
      if (response.data?.success) {
        setRequests(response.data.data);
        setTotalItems(response.data.total || response.data.data.length);
        setTotalPages(response.data.last_page || 1);
        setCurrentPage(response.data.current_page || 1);
      }
    } catch (error) {
      console.error('Failed to fetch franchise requests:', error);
      toast.error('Failed to load franchise requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests(currentPage);
  }, [currentPage, itemsPerPage]);

  // Update request status
  const updateRequestStatus = async (id) => {
    if (!statusUpdate.status) {
      toast.error('Please select a status');
      return;
    }

    try {
      setUpdatingStatus(true);
      const response = await api.post(`/admin/franchise-applications/${id}/status`, statusUpdate);
      
      if (response.data?.success) {
        toast.success('Status updated successfully!');
        setSelectedRequest(null);
        setStatusUpdate({ status: '' });
        fetchRequests(currentPage);
      } else {
        toast.error(response.data?.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error(error.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Delete request
  const deleteRequest = async (id) => {
    if (!window.confirm('Are you sure you want to delete this request?')) return;

    try {
      const response = await api.delete(`/admin/franchise-applications/${id}`);
      
      if (response.data?.success) {
        toast.success('Request deleted successfully!');
        fetchRequests(currentPage);
        if (selectedRequest?.id === id) {
          setSelectedRequest(null);
        }
      } else {
        toast.error(response.data?.message || 'Failed to delete request');
      }
    } catch (error) {
      console.error('Error deleting request:', error);
      toast.error(error.response?.data?.message || 'Failed to delete request');
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option || { label: status.charAt(0).toUpperCase() + status.slice(1), color: 'bg-gray-100 text-gray-800' };
  };

  // Handle search with debounce
  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
    // Fetch after a small delay to prevent too many API calls
    const timeoutId = setTimeout(() => {
      fetchRequests(1);
    }, 500);
    return () => clearTimeout(timeoutId);
  };

  // Handle filter change
  const handleFilterChange = (value) => {
    setFilterStatus(value);
    setCurrentPage(1);
    fetchRequests(1);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

  // Pagination controls
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      let endPage = startPage + maxVisiblePages - 1;
      
      if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  // Calculate statistics
  const stats = {
    total: totalItems,
    approved: requests.filter(r => r.status === 'approved').length,
    reviewed: requests.filter(r => r.status === 'reviewed').length,
    rejected: requests.filter(r => r.status === 'rejected').length
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Franchise Requests
              </h1>
              <p className="text-gray-600">
                Manage and track franchise partnership requests
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => fetchRequests(currentPage)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Requests</p>
                <h3 className="text-3xl font-bold mt-2 text-gray-900">
                  {stats.total}
                </h3>
              </div>
              <div className="p-3 bg-gray-100 rounded-lg">
                <Users className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Reviewed</p>
                <h3 className="text-3xl font-bold mt-2 text-blue-600">
                  {stats.reviewed}
                </h3>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <MailOpen className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                <h3 className="text-3xl font-bold mt-2 text-green-600">
                  {stats.approved}
                </h3>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rejected</p>
                <h3 className="text-3xl font-bold mt-2 text-red-600">
                  {stats.rejected}
                </h3>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <UserX className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl border p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, company, or message..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => handleFilterChange(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                >
                  <option value="all">All Status</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Requests List */}
        <div className="bg-white rounded-xl border overflow-hidden mb-6">
          {requests.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No requests found
              </h3>
              <p className="text-gray-600">
                {searchTerm || filterStatus !== 'all' 
                  ? 'Try changing your search or filter criteria'
                  : 'No franchise requests have been submitted yet'}
              </p>
            </div>
          ) : (
            <div className="max-w-[400px] md:max-w-[700px] lg:max-w-[1140px] overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="py-4 px-6 text-left">
                      <span className="text-sm font-semibold text-gray-900">
                        Request Details
                      </span>
                    </th>
                    <th className="py-4 px-6 text-left">
                      <span className="text-sm font-semibold text-gray-900">
                        Status
                      </span>
                    </th>
                    <th className="py-4 px-6 text-left">
                      <span className="text-sm font-semibold text-gray-900">
                        Submitted
                      </span>
                    </th>
                    <th className="py-4 px-6 text-left">
                      <span className="text-sm font-semibold text-gray-900">
                        Actions
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request) => {
                    const statusBadge = getStatusBadge(request.status);
                    return (
                      <tr 
                        key={request.id} 
                        className="border-t hover:bg-gray-50 cursor-pointer"
                        onClick={() => setSelectedRequest(request)}
                      >
                        <td className="py-4 px-6">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-gray-500" />
                              <span className="font-medium text-gray-900">
                                {request.full_name}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-gray-500" />
                              <a 
                                href={`mailto:${request.email}`}
                                className="text-gray-600 hover:text-blue-600"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {request.email}
                              </a>
                            </div>
                            <div className="flex items-center gap-2">
                              <Building className="w-4 h-4 text-gray-500" />
                              <span className="text-gray-600">{request.company_name}</span>
                            </div>
                            <div className="flex items-start gap-2 mt-2">
                              <MessageSquare className="w-4 h-4 text-gray-500 mt-1" />
                              <p className="text-sm text-gray-600 line-clamp-2">
                                {request.message}
                              </p>
                            </div>
                          </div>
                        </td>
                        
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${statusBadge.color}`}>
                            {statusBadge.icon || null}
                            {statusBadge.label}
                          </span>
                        </td>
                        
                        <td className="py-4 px-6">
                          <div className="text-sm text-gray-600">
                            {formatDate(request.created_at)}
                          </div>
                        </td>
                        
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedRequest(request);
                                setStatusUpdate({ status: request.status });
                              }}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                              title="Update Status"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteRequest(request.id);
                              }}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {requests.length > 0 && (
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white rounded-xl border p-4">
            {/* Items per page selector */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">Show</span>
              <select
                value={itemsPerPage}
                onChange={(e) => handleItemsPerPageChange(e.target.value)}
                className="px-2 py-1 border border-gray-300 rounded text-sm"
              >
                {itemsPerPageOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              <span className="text-sm text-gray-700">entries</span>
            </div>

            {/* Page info */}
            <div className="text-sm text-gray-700">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
              {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} entries
            </div>

            {/* Pagination buttons */}
            <div className="flex items-center gap-1">
              {/* First Page */}
              <button
                onClick={() => goToPage(1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>

              {/* Previous Page */}
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Page Numbers */}
              {getPageNumbers().map(page => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`min-w-10 h-10 px-3 rounded-lg border ${
                    currentPage === page
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}

              {/* Next Page */}
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Last Page */}
              <button
                onClick={() => goToPage(totalPages)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronsRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Request Details Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl border max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Franchise Request Details
                </h2>
                <button
                  onClick={() => {
                    setSelectedRequest(null);
                    setStatusUpdate({ status: '' });
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <XCircle className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Basic Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Full Name</p>
                    <p className="font-medium text-gray-900 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      {selectedRequest.full_name}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Company Name</p>
                    <p className="font-medium text-gray-900 flex items-center gap-2">
                      <Building className="w-4 h-4" />
                      {selectedRequest.company_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Company Name</p>
                    <p className="font-medium text-gray-900 flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      {selectedRequest.phone}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Email Address</p>
                    <a 
                      href={`mailto:${selectedRequest.email}`}
                      className="font-medium text-blue-600 hover:text-blue-700 flex items-center gap-2"
                    >
                      <Mail className="w-4 h-4" />
                      {selectedRequest.email}
                    </a>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Request ID</p>
                    <p className="font-mono font-medium text-gray-900">
                      #{selectedRequest.id}
                    </p>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <p className="text-sm text-gray-600 mb-2">Message</p>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-700 whitespace-pre-line">
                      {selectedRequest.message}
                    </p>
                  </div>
                </div>

                {/* Status Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Current Status</p>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(selectedRequest.status).color}`}>
                        {getStatusBadge(selectedRequest.status).icon}
                        {getStatusBadge(selectedRequest.status).label}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Submitted On</p>
                    <p className="font-medium text-gray-900">
                      {formatDate(selectedRequest.created_at)}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Last Updated</p>
                    <p className="font-medium text-gray-900">
                      {formatDate(selectedRequest.updated_at)}
                    </p>
                  </div>
                </div>

                {/* Update Status Section */}
                <div className="pt-6 border-t">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Update Status
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Status
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {statusOptions.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => setStatusUpdate({ status: option.value })}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                              statusUpdate.status === option.value
                                ? option.color.replace('bg-', 'border-').replace('text-', 'border-')
                                : 'border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {option.icon}
                            <span>{option.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => updateRequestStatus(selectedRequest.id)}
                        disabled={updatingStatus || !statusUpdate.status || statusUpdate.status === selectedRequest.status}
                        className="px-6 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {updatingStatus ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Updating...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            Update Status
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => deleteRequest(selectedRequest.id)}
                        className="px-6 py-2 border border-red-300 text-red-600 rounded-lg font-medium hover:bg-red-50 flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete Request
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HandleFranchiseRequests;