import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Eye, 
  Download, 
  CheckCircle, 
  XCircle, 
  Clock,
  AlertCircle,
  Image as ImageIcon,
  Mail,
  User,
  Calendar,
  RefreshCw,
  MessageSquare,
  FileText,
  Trash2
} from 'lucide-react';
import { api } from '../../utils/app';

const HandleTechnicalSupport = () => {
  // Admin Color Schema
  const colors = {
    primaryBlack: '#0A0A0A',
    pureWhite: '#FFFFFF',
    darkGray: '#1F2937',
    mediumGray: '#4B5563',
    lightGray: '#E5E7EB',
    softBackground: '#F3F4F6',
    accent: '#0A0A0A',
    danger: '#DC2626',
    warning: '#D97706',
    success: '#059669',
    info: '#2563EB'
  };

  // States
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Fetch tickets
  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/technical-supports');
      if (response.data?.success) {
        setTickets(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch technical support tickets:', error);
      alert('Failed to load technical support tickets');
    } finally {
      setLoading(false);
    }
  };

  // Filter tickets based on search
  const filteredTickets = tickets.filter(ticket => {
    return (
      ticket.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.ticket_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.problem_description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleViewDetails = (ticket) => {
    setSelectedTicket(ticket);
    setShowDetails(true);
  };

  const handleResolveTicket = async (ticketId) => {
    if (!window.confirm('Mark this ticket as resolved?')) return;

    try {
      setProcessing(true);
      const response = await api.put(`/admin/technical-supports/${ticketId}/resolve`);
      
      if (response.data?.success) {
        alert('Ticket marked as resolved!');
        fetchTickets(); // Refresh list
      }
    } catch (error) {
      console.error('Failed to resolve ticket:', error);
      alert('Failed to update ticket status');
    } finally {
      setProcessing(false);
    }
  };

  const handleDeleteTicket = async (ticketId) => {
    if (!window.confirm('Are you sure you want to delete this ticket?')) return;

    try {
      setProcessing(true);
      const response = await api.delete(`/admin/technical-supports/${ticketId}`);
      
      if (response.data?.success) {
        alert('Ticket deleted successfully!');
        fetchTickets(); // Refresh list
      }
    } catch (error) {
      console.error('Failed to delete ticket:', error);
      alert('Failed to delete ticket');
    } finally {
      setProcessing(false);
    }
  };

  const downloadImage = (imageUrl, ticketNo) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `issue-${ticketNo}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (ticket) => {
    if (ticket.resolved_at) {
      return {
        text: 'Resolved',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        icon: <CheckCircle className="w-4 h-4" />
      };
    }
    return {
      text: 'Pending',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-800',
      icon: <Clock className="w-4 h-4" />
    };
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: colors.primaryBlack }}></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: colors.softBackground }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2" style={{ color: colors.primaryBlack }}>
                Technical Support Tickets
              </h1>
              <p className="text-lg" style={{ color: colors.mediumGray }}>
                Manage and respond to customer technical support requests
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={fetchTickets}
                disabled={processing}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-all hover:bg-gray-50 disabled:opacity-50"
                style={{ 
                  borderColor: colors.lightGray,
                  color: colors.primaryBlack
                }}
              >
                <RefreshCw className={`w-4 h-4 ${processing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              
              <div className="text-sm px-3 py-2 rounded-lg border" style={{ 
                borderColor: colors.lightGray,
                backgroundColor: colors.pureWhite,
                color: colors.mediumGray
              }}>
                Total: {tickets.length} tickets
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl border p-6 mb-8" style={{ borderColor: colors.lightGray }}>
          <div className="w-full md:w-1/2">
            <label className="block text-sm font-medium mb-2" style={{ color: colors.primaryBlack }}>
              Search Tickets
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: colors.mediumGray }} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, email, ticket number, or description..."
                className="w-full pl-10 pr-4 py-3 rounded-lg border focus:ring-2 focus:outline-none transition-all"
                style={{ 
                  borderColor: colors.lightGray,
                  backgroundColor: colors.softBackground,
                  color: colors.primaryBlack
                }}
              />
            </div>
          </div>
        </div>

        {/* Tickets Table */}
        <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: colors.lightGray }}>
           <div className="max-w-[400px] md:max-w-[700px] lg:max-w-[1140px] overflow-x-auto">
              <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b" style={{ borderColor: colors.lightGray, backgroundColor: colors.softBackground }}>
                  <th className="py-4 px-6 text-left font-medium" style={{ color: colors.primaryBlack }}>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Ticket #
                    </div>
                  </th>
                  <th className="py-4 px-6 text-left font-medium" style={{ color: colors.primaryBlack }}>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Customer
                    </div>
                  </th>
                  <th className="py-4 px-6 text-left font-medium" style={{ color: colors.primaryBlack }}>
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Problem
                    </div>
                  </th>
                  <th className="py-4 px-6 text-left font-medium" style={{ color: colors.primaryBlack }}>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Date
                    </div>
                  </th>
                  
                  <th className="py-4 px-6 text-left font-medium" style={{ color: colors.primaryBlack }}>
                    Image
                  </th>
                  <th className="py-4 px-6 text-left font-medium" style={{ color: colors.primaryBlack }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.length > 0 ? (
                  filteredTickets.map((ticket) => {
                    const statusBadge = getStatusBadge(ticket);
                    
                    return (
                      <tr 
                        key={ticket.id} 
                        className="border-b hover:bg-gray-50 transition-colors" 
                        style={{ borderColor: colors.lightGray }}
                      >
                        <td className="py-4 px-6">
                          <div className="font-mono font-semibold" style={{ color: colors.primaryBlack }}>
                            {ticket.ticket_no}
                          </div>
                        </td>
                        
                        <td className="py-4 px-6">
                          <div className="space-y-1">
                            <div className="font-medium" style={{ color: colors.primaryBlack }}>
                              {ticket.name}
                            </div>
                            <div className="text-sm flex items-center gap-1" style={{ color: colors.mediumGray }}>
                              <Mail className="w-3 h-3" />
                              {ticket.email}
                            </div>
                          </div>
                        </td>
                        
                        <td className="py-4 px-6">
                          <div 
                            className="max-w-xs line-clamp-2" 
                            style={{ color: colors.mediumGray }}
                            title={ticket.problem_description}
                          >
                            {ticket.problem_description}
                          </div>
                        </td>
                        
                        <td className="py-4 px-6">
                          <div className="space-y-1">
                            <div className="text-sm" style={{ color: colors.primaryBlack }}>
                              {formatDate(ticket.created_at)}
                            </div>
                            <div className="text-xs" style={{ color: colors.mediumGray }}>
                              {new Date(ticket.created_at).toLocaleTimeString('en-IN', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </div>
                        </td>
                        
                       
                        
                        <td className="py-4 px-6">
                          {ticket.problem_image_url ? (
                            <div className="flex items-center gap-2">
                              <ImageIcon className="w-4 h-4" style={{ color: colors.info }} />
                              <button
                                onClick={() => downloadImage(ticket.problem_image_url, ticket.ticket_no)}
                                className="text-xs px-2 py-1 rounded border hover:bg-gray-50"
                                style={{ 
                                  borderColor: colors.lightGray,
                                  color: colors.mediumGray
                                }}
                              >
                                Download
                              </button>
                            </div>
                          ) : (
                            <span className="text-sm" style={{ color: colors.mediumGray }}>
                              No image
                            </span>
                          )}
                        </td>
                        
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleViewDetails(ticket)}
                              className="p-2 rounded-lg border transition-all hover:bg-gray-100"
                              style={{ 
                                borderColor: colors.lightGray,
                                color: colors.info
                              }}
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            
                           
                            
                            
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="py-16 text-center">
                      <AlertCircle className="w-16 h-16 mx-auto mb-4" style={{ color: colors.mediumGray }} />
                      <h3 className="text-lg font-medium mb-2" style={{ color: colors.primaryBlack }}>
                        No Tickets Found
                      </h3>
                      <p className="mb-6" style={{ color: colors.mediumGray }}>
                        {searchTerm 
                          ? 'No tickets match your search criteria' 
                          : 'No technical support tickets have been submitted yet.'}
                      </p>
                      {searchTerm && (
                        <button
                          onClick={() => setSearchTerm('')}
                          className="px-4 py-2 rounded-lg font-medium border transition-all hover:bg-gray-50"
                          style={{ 
                            borderColor: colors.lightGray,
                            color: colors.primaryBlack
                          }}
                        >
                          Clear Search
                        </button>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Ticket Details Modal */}
        {showDetails && selectedTicket && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setShowDetails(false)}
            ></div>
            
            {/* Modal Content */}
            <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="sticky top-0 z-10 bg-white border-b p-6" style={{ borderColor: colors.lightGray }}>
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold" style={{ color: colors.primaryBlack }}>
                      Ticket Details: {selectedTicket.ticket_no}
                    </h2>
                    <p className="text-sm mt-1" style={{ color: colors.mediumGray }}>
                      Submitted on {formatDateTime(selectedTicket.created_at)}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="p-2 rounded-lg hover:bg-gray-100"
                  >
                    <XCircle className="w-5 h-5" style={{ color: colors.mediumGray }} />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  {/* Customer Info */}
                  <div className="space-y-4">
                    <h3 className="font-medium" style={{ color: colors.primaryBlack }}>Customer Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 rounded-lg border" style={{ borderColor: colors.lightGray }}>
                        <User className="w-5 h-5" style={{ color: colors.mediumGray }} />
                        <div>
                          <div className="text-sm" style={{ color: colors.mediumGray }}>Name</div>
                          <div className="font-medium" style={{ color: colors.primaryBlack }}>{selectedTicket.name}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 rounded-lg border" style={{ borderColor: colors.lightGray }}>
                        <Mail className="w-5 h-5" style={{ color: colors.mediumGray }} />
                        <div>
                          <div className="text-sm" style={{ color: colors.mediumGray }}>Email</div>
                          <div className="font-medium" style={{ color: colors.primaryBlack }}>{selectedTicket.email}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status Info */}
                  <div className="space-y-4">
                    <h3 className="font-medium" style={{ color: colors.primaryBlack }}>Ticket Status</h3>
                    <div className="space-y-3">
                      <div className={`inline-flex items-center gap-2 px-4 py-3 rounded-lg border ${getStatusBadge(selectedTicket).bgColor} ${getStatusBadge(selectedTicket).textColor}`} style={{ borderColor: colors.lightGray }}>
                        {getStatusBadge(selectedTicket).icon}
                        <span className="font-medium">{getStatusBadge(selectedTicket).text}</span>
                      </div>
                      
                      {selectedTicket.resolved_at && (
                        <div className="flex items-center gap-3 p-3 rounded-lg border" style={{ borderColor: colors.lightGray }}>
                          <CheckCircle className="w-5 h-5" style={{ color: colors.success }} />
                          <div>
                            <div className="text-sm" style={{ color: colors.mediumGray }}>Resolved On</div>
                            <div className="font-medium" style={{ color: colors.primaryBlack }}>{formatDateTime(selectedTicket.resolved_at)}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Problem Description */}
                <div className="mb-6">
                  <h3 className="font-medium mb-3" style={{ color: colors.primaryBlack }}>Problem Description</h3>
                  <div className="p-4 rounded-lg border bg-gray-50" style={{ borderColor: colors.lightGray }}>
                    <p className="whitespace-pre-wrap" style={{ color: colors.mediumGray }}>
                      {selectedTicket.problem_description}
                    </p>
                  </div>
                </div>

                {/* Attached Image */}
                {selectedTicket.problem_image_url && (
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium" style={{ color: colors.primaryBlack }}>Attached Image</h3>
                      <button
                        onClick={() => downloadImage(selectedTicket.problem_image_url, selectedTicket.ticket_no)}
                        className="flex items-center gap-2 px-3 py-1 rounded-lg border transition-all hover:bg-gray-50"
                        style={{ 
                          borderColor: colors.lightGray,
                          color: colors.primaryBlack
                        }}
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    </div>
                    <div className="relative">
                      <img
                        src={selectedTicket.problem_image_url}
                        alt="Problem"
                        className="w-full h-64 object-contain rounded-lg border bg-gray-100"
                        style={{ borderColor: colors.lightGray }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNFNUU3RUIiLz48cGF0aCBkPSJNNjggMTAwTDg4IDEyMEwxMzIgODBMMTYwIDEwMEw2OCAxMDBaIiBmaWxsPSIjOEM5M0EwIi8+PC9zdmc+';
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="sticky bottom-0 border-t bg-white p-6" style={{ borderColor: colors.lightGray }}>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowDetails(false)}
                    className="px-4 py-2 rounded-lg border font-medium transition-all hover:bg-gray-50"
                    style={{ 
                      borderColor: colors.lightGray,
                      color: colors.primaryBlack
                    }}
                  >
                    Close
                  </button>
                  
                  {!selectedTicket.resolved_at && (
                    <button
                      onClick={() => {
                        handleResolveTicket(selectedTicket.id);
                        setShowDetails(false);
                      }}
                      disabled={processing}
                      className="px-4 py-2 rounded-lg border font-medium transition-all hover:bg-green-50 hover:border-green-200"
                      style={{ 
                        borderColor: colors.success,
                        color: colors.success
                      }}
                    >
                      Mark as Resolved
                    </button>
                  )}
                  
                  <button
                    onClick={() => {
                      handleDeleteTicket(selectedTicket.id);
                      setShowDetails(false);
                    }}
                    disabled={processing}
                    className="px-4 py-2 rounded-lg border font-medium transition-all hover:bg-red-50 hover:border-red-200"
                    style={{ 
                      borderColor: colors.danger,
                      color: colors.danger
                    }}
                  >
                    Delete Ticket
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HandleTechnicalSupport;