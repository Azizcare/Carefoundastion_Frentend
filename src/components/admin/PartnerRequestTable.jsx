"use client";
import { useState, useEffect } from "react";
import { BiSearch, BiCheck, BiX } from "react-icons/bi";
import { FiEye } from "react-icons/fi";
import useAdminStore from "@/store/adminStore";
import toast from "react-hot-toast";

export default function PartnerRequestTable() {
  const { partners, isLoading, getPartners, updatePartner } = useAdminStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        await getPartners({ limit: 100 });
      } catch (error) {
        console.error("Failed to load partner requests:", error);
        toast.error("Failed to load partner requests");
      }
    };
    fetchPartners();
  }, [getPartners]);

  const handleApprove = async (partnerId) => {
    try {
      await updatePartner(partnerId, { status: 'approved', isActive: true });
      toast.success("Partner approved successfully!");
      getPartners({ limit: 100 });
    } catch (error) {
      toast.error("Failed to approve partner");
    }
  };

  const handleReject = async (partnerId) => {
    try {
      await updatePartner(partnerId, { status: 'rejected', isActive: false });
      toast.success("Partner rejected");
      getPartners({ limit: 100 });
    } catch (error) {
      toast.error("Failed to reject partner");
    }
  };

  const filteredRequests = partners.filter(partner =>
    partner.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.contactPerson?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.contactPerson?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredRequests.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(filteredRequests.length / entriesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <div className="mb-8 bg-white rounded-xl shadow-lg p-4 border-2 border-gray-100">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">Partner Request</h1>
        <nav className="text-xs text-gray-500">
          <ol className="flex space-x-2 items-center">
            <li><a href="/admin" className="hover:underline text-gray-600 font-medium">Home</a></li>
            <li className="text-gray-400">/</li>
            <li><a href="/admin/partner-requests" className="hover:underline text-gray-600 font-medium">Partner Request</a></li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-700 font-semibold">Partner Request Section</li>
          </ol>
        </nav>
      </div>

      <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-4 backdrop-blur-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span className="w-1 h-8 bg-gradient-to-b from-green-500 to-blue-500 rounded-full"></span>
          Partner Request
        </h2>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <select value={entriesPerPage} onChange={(e) => setEntriesPerPage(Number(e.target.value))} className="border-2 border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm hover:shadow-md">
              <option value={10}>10</option>
            </select>
            <span className="text-sm text-green-600 font-medium">entries per page</span>
          </div>
          <div className="relative">
            <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="border-2 border-gray-300 rounded-xl pl-4 pr-10 py-2.5 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm hover:shadow-md"/>
            <BiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading partner requests...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-green-500 via-blue-500 to-green-500">
                    <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wide">Business Name</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wide">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wide">Contact Person</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wide">Contact Info</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wide">Location</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wide">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentEntries.length > 0 ? (
                  currentEntries.map((partner, idx) => (
                    <tr key={partner._id} className={`border-b border-gray-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 transition-all duration-200 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                      <td className="px-4 py-4">
                        <div className="font-medium text-gray-900">
                          {partner.name && partner.name !== partner.contactPerson?.name 
                            ? partner.name 
                            : partner.businessName 
                            ? partner.businessName 
                            : partner.businessType && partner.category
                            ? `${partner.businessType.charAt(0).toUpperCase() + partner.businessType.slice(1)} - ${partner.category.charAt(0).toUpperCase() + partner.category.slice(1)}`
                            : partner.description 
                            ? partner.description.substring(0, 30) + (partner.description.length > 30 ? '...' : '')
                            : 'N/A'}
                        </div>
                        {partner.registrationNumber && (
                          <div className="text-xs text-gray-500">Reg: {partner.registrationNumber}</div>
                        )}
                        {partner.documents?.businessLicense && (
                          <div className="text-xs text-gray-500">License: {partner.documents.businessLicense.substring(0, 20)}...</div>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          partner.category === 'food' || partner.type === 'food' ? 'bg-gradient-to-r from-orange-400 to-orange-600 text-white' :
                          partner.category === 'medical' || partner.type === 'health' || partner.type === 'medical' ? 'bg-gradient-to-r from-blue-400 to-blue-600 text-white' :
                          'bg-gradient-to-r from-purple-400 to-purple-600 text-white'
                        }`}>
                          {partner.category || partner.type || 'N/A'}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm">
                        <div className="font-medium text-gray-900">
                          {partner.contactPerson?.name || partner.name || 'N/A'}
                        </div>
                        {partner.contactPerson?.designation && (
                          <div className="text-xs text-gray-500">{partner.contactPerson.designation}</div>
                        )}
                        {!partner.contactPerson?.designation && partner.businessType && (
                          <div className="text-xs text-gray-500">{partner.businessType}</div>
                        )}
                      </td>
                      <td className="px-4 py-4 text-sm">
                        <div className="text-gray-700">{partner.contactPerson?.email || 'N/A'}</div>
                        <div className="text-gray-600">{partner.contactPerson?.phone || 'N/A'}</div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700 max-w-xs">
                        <div className="line-clamp-2">
                          {partner.address?.street && `${partner.address.street}, `}
                          {partner.address?.city || 'N/A'}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          partner.status === 'approved' ? 'bg-green-100 text-green-700' :
                          partner.status === 'rejected' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {partner.status || 'pending'}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex gap-2">
                          {partner.status !== 'approved' && (
                            <button
                              onClick={() => handleApprove(partner._id)}
                              className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition-colors"
                              title="Approve Partner"
                            >
                              <BiCheck size={18} />
                              Approve
                            </button>
                          )}
                          {partner.status !== 'rejected' && (
                            <button
                              onClick={() => handleReject(partner._id)}
                              className="flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700 transition-colors"
                              title="Reject Partner"
                            >
                              <BiX size={18} />
                              Reject
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-4 py-12 text-center text-gray-500">
                      <div className="text-4xl mb-2">🤝</div>
                      {isLoading ? 'Loading partners...' : 'No partner requests found'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}



