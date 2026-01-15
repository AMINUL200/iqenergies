import React, { useState, useEffect } from "react";
import {
  Users,
  Phone,
  Mail,
  MapPin,
  Battery,
  CheckCircle,
  XCircle,
  Calendar,
  RefreshCw,
  Filter,
  Search,
  Eye,
  PhoneCall,
  UserCheck,
  Download,
  Printer,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { api } from "../../utils/app";

const HandleBookingSurvey = () => {
  // Admin Color Schema
  const colors = {
    primaryBlack: "#0A0A0A",
    pureWhite: "#FFFFFF",
    darkGray: "#1F2937",
    mediumGray: "#4B5563",
    lightGray: "#E5E7EB",
    softBackground: "#F3F4F6",
    accent: "#0A0A0A",
    danger: "#DC2626",
    warning: "#D97706",
    success: "#059669",
    info: "#2563EB",
  };

  // States
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // 'all', 'contacted', 'pending'
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Fetch booking data
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/book-solar-surveys");
      if (response.data?.success) {
        setBookings(response.data.data);
        setCurrentPage(1); // Reset to first page on refresh
      }
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
      alert("Failed to load booking surveys");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Mark as contacted
  const markAsContacted = async (id) => {
    if (!confirm("Mark this booking as contacted?")) return;

    try {
      setUpdating(true);
      const response = await api.patch(
        `/admin/book-solar-surveys/${id}/contacted`
      );

      if (response.data?.success) {
        // Update local state
        setBookings((prev) =>
          prev.map((booking) =>
            booking.id === id ? { ...booking, is_contacted: true } : booking
          )
        );
        alert("Marked as contacted successfully!");
      }
    } catch (error) {
      console.error("Failed to update status:", error);
      alert(error.response?.data?.message || "Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  // Filter bookings based on search and status
  const filteredBookings = bookings.filter((booking) => {
    // Apply search filter
    const matchesSearch =
      searchTerm === "" ||
      booking.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.mobile.includes(searchTerm) ||
      booking.pincode.includes(searchTerm);

    // Apply status filter
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "contacted" && booking.is_contacted) ||
      (filterStatus === "pending" && !booking.is_contacted);

    return matchesSearch && matchesStatus;
  });

  // Pagination calculations
  const totalItems = filteredBookings.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBookings = filteredBookings.slice(startIndex, endIndex);

  // Pagination handlers
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const goToFirstPage = () => goToPage(1);
  const goToLastPage = () => goToPage(totalPages);
  const goToPrevPage = () => goToPage(currentPage - 1);
  const goToNextPage = () => goToPage(currentPage + 1);

  // Items per page options
  const itemsPerPageOptions = [2, 5, 10, 20, 50, 100];

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Calculate statistics
  const stats = {
    total: bookings.length,
    contacted: bookings.filter((b) => b.is_contacted).length,
    pending: bookings.filter((b) => !b.is_contacted).length,
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div
          className="animate-spin rounded-full h-12 w-12 border-b-2"
          style={{ borderColor: colors.primaryBlack }}
        ></div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen p-6"
      style={{ backgroundColor: colors.softBackground }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1
                className="text-3xl font-bold mb-2"
                style={{ color: colors.primaryBlack }}
              >
                Solar Survey Bookings
              </h1>
              <p className="text-lg" style={{ color: colors.mediumGray }}>
                Manage and track solar survey booking requests
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={fetchBookings}
                disabled={updating}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-all hover:bg-gray-50 disabled:opacity-50"
                style={{
                  borderColor: colors.lightGray,
                  color: colors.primaryBlack,
                }}
              >
                <RefreshCw
                  className={`w-4 h-4 ${updating ? "animate-spin" : ""}`}
                />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div
            className="bg-white rounded-xl border p-6"
            style={{ borderColor: colors.lightGray }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: colors.mediumGray }}>
                  Total Bookings
                </p>
                <h3
                  className="text-3xl font-bold mt-2"
                  style={{ color: colors.primaryBlack }}
                >
                  {stats.total}
                </h3>
              </div>
              <div
                className="p-3 rounded-lg"
                style={{ backgroundColor: `${colors.info}10` }}
              >
                <Users className="w-6 h-6" style={{ color: colors.info }} />
              </div>
            </div>
          </div>

          <div
            className="bg-white rounded-xl border p-6"
            style={{ borderColor: colors.lightGray }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: colors.mediumGray }}>
                  Contacted
                </p>
                <h3
                  className="text-3xl font-bold mt-2"
                  style={{ color: colors.success }}
                >
                  {stats.contacted}
                </h3>
              </div>
              <div
                className="p-3 rounded-lg"
                style={{ backgroundColor: `${colors.success}10` }}
              >
                <UserCheck
                  className="w-6 h-6"
                  style={{ color: colors.success }}
                />
              </div>
            </div>
          </div>

          <div
            className="bg-white rounded-xl border p-6"
            style={{ borderColor: colors.lightGray }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: colors.mediumGray }}>
                  Pending Contact
                </p>
                <h3
                  className="text-3xl font-bold mt-2"
                  style={{ color: colors.warning }}
                >
                  {stats.pending}
                </h3>
              </div>
              <div
                className="p-3 rounded-lg"
                style={{ backgroundColor: `${colors.warning}10` }}
              >
                <PhoneCall
                  className="w-6 h-6"
                  style={{ color: colors.warning }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div
          className="bg-white rounded-xl border p-6 mb-8"
          style={{ borderColor: colors.lightGray }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                  style={{ color: colors.mediumGray }}
                />
                <input
                  type="text"
                  placeholder="Search by name, email, phone or pincode..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1); // Reset to first page on search
                  }}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border focus:ring-2 focus:outline-none transition-all"
                  style={{
                    borderColor: colors.lightGray,
                    backgroundColor: colors.softBackground,
                    color: colors.primaryBlack,
                  }}
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter
                  className="w-5 h-5"
                  style={{ color: colors.mediumGray }}
                />
                <select
                  value={filterStatus}
                  onChange={(e) => {
                    setFilterStatus(e.target.value);
                    setCurrentPage(1); // Reset to first page on filter change
                  }}
                  className="px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none transition-all"
                  style={{
                    borderColor: colors.lightGray,
                    backgroundColor: colors.softBackground,
                    color: colors.primaryBlack,
                  }}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="contacted">Contacted</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm" style={{ color: colors.mediumGray }}>
                  Showing {filteredBookings.length} of {bookings.length}{" "}
                  bookings
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div
          className="bg-white rounded-xl border overflow-hidden mb-6"
          style={{ borderColor: colors.lightGray }}
        >
          {currentBookings.length === 0 ? (
            <div className="text-center py-12">
              <Users
                className="w-12 h-12 mx-auto mb-4"
                style={{ color: colors.lightGray }}
              />
              <h3
                className="text-xl font-semibold mb-2"
                style={{ color: colors.primaryBlack }}
              >
                No bookings found
              </h3>
              <p style={{ color: colors.mediumGray }}>
                {searchTerm || filterStatus !== "all"
                  ? "Try changing your search or filter criteria"
                  : "No booking surveys have been submitted yet"}
              </p>
            </div>
          ) : (
            <div className="max-w-[400px] md:max-w-[700px] lg:max-w-[1140px] overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr style={{ backgroundColor: colors.softBackground }}>
                    <th className="py-4 px-6 text-left">
                      <span
                        className="text-sm font-semibold"
                        style={{ color: colors.primaryBlack }}
                      >
                        Customer Details
                      </span>
                    </th>
                    <th className="py-4 px-6 text-left">
                      <span
                        className="text-sm font-semibold"
                        style={{ color: colors.primaryBlack }}
                      >
                        Monthly Usage
                      </span>
                    </th>
                    <th className="py-4 px-6 text-left">
                      <span
                        className="text-sm font-semibold"
                        style={{ color: colors.primaryBlack }}
                      >
                        Location
                      </span>
                    </th>
                    <th className="py-4 px-6 text-left">
                      <span
                        className="text-sm font-semibold"
                        style={{ color: colors.primaryBlack }}
                      >
                        Status
                      </span>
                    </th>
                    <th className="py-4 px-6 text-left">
                      <span
                        className="text-sm font-semibold"
                        style={{ color: colors.primaryBlack }}
                      >
                        Submitted On
                      </span>
                    </th>
                    <th className="py-4 px-6 text-left">
                      <span
                        className="text-sm font-semibold"
                        style={{ color: colors.primaryBlack }}
                      >
                        Actions
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentBookings.map((booking) => (
                    <tr
                      key={booking.id}
                      className="border-t hover:bg-gray-50 transition-colors"
                      style={{ borderColor: colors.lightGray }}
                    >
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Users
                              className="w-4 h-4"
                              style={{ color: colors.mediumGray }}
                            />
                            <span
                              className="font-medium"
                              style={{ color: colors.primaryBlack }}
                            >
                              {booking.full_name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone
                              className="w-4 h-4"
                              style={{ color: colors.mediumGray }}
                            />
                            <a
                              href={`tel:${booking.mobile}`}
                              className="hover:text-blue-600 transition-colors"
                              style={{ color: colors.info }}
                            >
                              {booking.mobile}
                            </a>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail
                              className="w-4 h-4"
                              style={{ color: colors.mediumGray }}
                            />
                            <a
                              href={`mailto:${booking.email}`}
                              className="hover:text-blue-600 transition-colors"
                              style={{ color: colors.info }}
                            >
                              {booking.email}
                            </a>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <Battery
                            className="w-4 h-4"
                            style={{ color: colors.warning }}
                          />
                          <span
                            className="font-medium"
                            style={{ color: colors.primaryBlack }}
                          >
                            {booking.average_monthly_usage} kWh
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <MapPin
                            className="w-4 h-4"
                            style={{ color: colors.danger }}
                          />
                          <span style={{ color: colors.mediumGray }}>
                            {booking.pincode}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          {booking.is_contacted ? (
                            <>
                              <CheckCircle
                                className="w-4 h-4"
                                style={{ color: colors.success }}
                              />
                              <span
                                className="text-sm font-medium"
                                style={{ color: colors.success }}
                              >
                                Contacted
                              </span>
                            </>
                          ) : (
                            <>
                              <XCircle
                                className="w-4 h-4"
                                style={{ color: colors.warning }}
                              />
                              <span
                                className="text-sm font-medium"
                                style={{ color: colors.warning }}
                              >
                                Pending
                              </span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <Calendar
                            className="w-4 h-4"
                            style={{ color: colors.mediumGray }}
                          />
                          <span
                            className="text-sm"
                            style={{ color: colors.mediumGray }}
                          >
                            {formatDate(booking.created_at)}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          {!booking.is_contacted && (
                            <button
                              onClick={() => markAsContacted(booking.id)}
                              disabled={updating}
                              className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-all hover:bg-green-50 disabled:opacity-50"
                              style={{
                                borderColor: colors.success,
                                color: colors.success,
                              }}
                            >
                              <PhoneCall className="w-4 h-4" />
                              Mark as Contacted
                            </button>
                          )}
                          <button
                            onClick={() => setSelectedBooking(booking)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-all hover:bg-gray-50"
                            style={{
                              borderColor: colors.lightGray,
                              color: colors.primaryBlack,
                            }}
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {filteredBookings.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Items per page selector */}
            <div className="flex items-center gap-3">
              <span className="text-sm" style={{ color: colors.mediumGray }}>
                Show:
              </span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1); // Reset to first page when changing items per page
                }}
                className="px-3 py-1.5 rounded-lg border focus:ring-2 focus:outline-none transition-all"
                style={{
                  borderColor: colors.lightGray,
                  backgroundColor: colors.softBackground,
                  color: colors.primaryBlack,
                }}
              >
                {itemsPerPageOptions.map((option) => (
                  <option key={option} value={option}>
                    {option} per page
                  </option>
                ))}
              </select>
            </div>

            {/* Page info */}
            <div className="text-sm" style={{ color: colors.mediumGray }}>
              Showing {Math.min(startIndex + 1, totalItems)} to{" "}
              {Math.min(endIndex, totalItems)} of {totalItems} entries
            </div>

            {/* Pagination buttons */}
            <div className="flex items-center gap-2">
              {/* First page button */}
              <button
                onClick={goToFirstPage}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border transition-all hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  borderColor: colors.lightGray,
                  color: colors.primaryBlack,
                }}
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>

              {/* Previous page button */}
              <button
                onClick={goToPrevPage}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border transition-all hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  borderColor: colors.lightGray,
                  color: colors.primaryBlack,
                }}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Page numbers */}
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  if (pageNum > totalPages) return null;

                  return (
                    <button
                      key={pageNum}
                      onClick={() => goToPage(pageNum)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                        currentPage === pageNum
                          ? "border"
                          : "border hover:bg-gray-50"
                      }`}
                      style={{
                        borderColor:
                          currentPage === pageNum
                            ? colors.primaryBlack
                            : colors.lightGray,
                        backgroundColor:
                          currentPage === pageNum
                            ? colors.primaryBlack
                            : "transparent",
                        color:
                          currentPage === pageNum
                            ? colors.pureWhite
                            : colors.primaryBlack,
                      }}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              {/* Next page button */}
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border transition-all hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  borderColor: colors.lightGray,
                  color: colors.primaryBlack,
                }}
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Last page button */}
              <button
                onClick={goToLastPage}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border transition-all hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  borderColor: colors.lightGray,
                  color: colors.primaryBlack,
                }}
              >
                <ChevronsRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Booking Details Modal */}
        {selectedBooking && (
          <div className="fixed inset-0 bg-black/50  flex items-center justify-center p-4 z-50">
            <div
              className="bg-white rounded-xl border max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              style={{ borderColor: colors.lightGray }}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2
                    className="text-2xl font-bold"
                    style={{ color: colors.primaryBlack }}
                  >
                    Booking Details
                  </h2>
                  <button
                    onClick={() => setSelectedBooking(null)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <XCircle
                      className="w-6 h-6"
                      style={{ color: colors.mediumGray }}
                    />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Customer Info */}
                  <div>
                    <h3
                      className="text-lg font-semibold mb-4 flex items-center gap-2"
                      style={{ color: colors.primaryBlack }}
                    >
                      <Users className="w-5 h-5" />
                      Customer Information
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p
                          className="text-sm"
                          style={{ color: colors.mediumGray }}
                        >
                          Full Name
                        </p>
                        <p
                          className="font-medium"
                          style={{ color: colors.primaryBlack }}
                        >
                          {selectedBooking.full_name}
                        </p>
                      </div>
                      <div>
                        <p
                          className="text-sm"
                          style={{ color: colors.mediumGray }}
                        >
                          Mobile Number
                        </p>
                        <a
                          href={`tel:${selectedBooking.mobile}`}
                          className="font-medium hover:text-blue-600 transition-colors"
                          style={{ color: colors.info }}
                        >
                          {selectedBooking.mobile}
                        </a>
                      </div>
                      <div>
                        <p
                          className="text-sm"
                          style={{ color: colors.mediumGray }}
                        >
                          Email Address
                        </p>
                        <a
                          href={`mailto:${selectedBooking.email}`}
                          className="font-medium hover:text-blue-600 transition-colors"
                          style={{ color: colors.info }}
                        >
                          {selectedBooking.email}
                        </a>
                      </div>
                      <div>
                        <p
                          className="text-sm"
                          style={{ color: colors.mediumGray }}
                        >
                          Pincode
                        </p>
                        <p
                          className="font-medium"
                          style={{ color: colors.primaryBlack }}
                        >
                          {selectedBooking.pincode}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Usage Info */}
                  <div>
                    <h3
                      className="text-lg font-semibold mb-4 flex items-center gap-2"
                      style={{ color: colors.primaryBlack }}
                    >
                      <Battery className="w-5 h-5" />
                      Energy Usage
                    </h3>
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p
                            className="text-sm"
                            style={{ color: colors.mediumGray }}
                          >
                            Average Monthly Usage
                          </p>
                          <p
                            className="text-2xl font-bold"
                            style={{ color: colors.primaryBlack }}
                          >
                            {selectedBooking.average_monthly_usage} kWh
                          </p>
                        </div>
                        <div
                          className="p-3 rounded-lg"
                          style={{ backgroundColor: colors.info }}
                        >
                          <Battery className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status and Dates */}
                  <div>
                    <h3
                      className="text-lg font-semibold mb-4 flex items-center gap-2"
                      style={{ color: colors.primaryBlack }}
                    >
                      <Calendar className="w-5 h-5" />
                      Status & Timeline
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p
                          className="text-sm"
                          style={{ color: colors.mediumGray }}
                        >
                          Contact Status
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          {selectedBooking.is_contacted ? (
                            <>
                              <CheckCircle
                                className="w-5 h-5"
                                style={{ color: colors.success }}
                              />
                              <span
                                className="font-medium"
                                style={{ color: colors.success }}
                              >
                                Contacted
                              </span>
                            </>
                          ) : (
                            <>
                              <XCircle
                                className="w-5 h-5"
                                style={{ color: colors.warning }}
                              />
                              <span
                                className="font-medium"
                                style={{ color: colors.warning }}
                              >
                                Pending Contact
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <div>
                        <p
                          className="text-sm"
                          style={{ color: colors.mediumGray }}
                        >
                          Submitted On
                        </p>
                        <p
                          className="font-medium"
                          style={{ color: colors.primaryBlack }}
                        >
                          {formatDate(selectedBooking.created_at)}
                        </p>
                      </div>
                      <div>
                        <p
                          className="text-sm"
                          style={{ color: colors.mediumGray }}
                        >
                          Last Updated
                        </p>
                        <p
                          className="font-medium"
                          style={{ color: colors.primaryBlack }}
                        >
                          {formatDate(selectedBooking.updated_at)}
                        </p>
                      </div>
                      <div>
                        <p
                          className="text-sm"
                          style={{ color: colors.mediumGray }}
                        >
                          Booking ID
                        </p>
                        <p
                          className="font-mono font-medium"
                          style={{ color: colors.primaryBlack }}
                        >
                          #{selectedBooking.id}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div
                    className="pt-6 border-t"
                    style={{ borderColor: colors.lightGray }}
                  >
                    <div className="flex flex-wrap gap-3">
                      {!selectedBooking.is_contacted && (
                        <button
                          onClick={() => {
                            markAsContacted(selectedBooking.id);
                            setSelectedBooking(null);
                          }}
                          disabled={updating}
                          className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50"
                          style={{
                            backgroundColor: colors.success,
                            color: colors.pureWhite,
                          }}
                        >
                          <PhoneCall className="w-5 h-5" />
                          Mark as Contacted
                        </button>
                      )}
                      <button
                        onClick={() => window.print()}
                        className="flex items-center gap-2 px-6 py-3 rounded-lg border font-semibold transition-all hover:bg-gray-50"
                        style={{
                          borderColor: colors.lightGray,
                          color: colors.primaryBlack,
                        }}
                      >
                        <Printer className="w-5 h-5" />
                        Print Details
                      </button>
                      <button
                        onClick={() => setSelectedBooking(null)}
                        className="flex items-center gap-2 px-6 py-3 rounded-lg border font-semibold transition-all hover:bg-gray-50"
                        style={{
                          borderColor: colors.lightGray,
                          color: colors.primaryBlack,
                        }}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HandleBookingSurvey;
