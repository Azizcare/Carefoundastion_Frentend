"use client";
import { useState, useEffect } from "react";
import { BiSearch, BiCheck, BiX, BiUser } from "react-icons/bi";
import { FiMail, FiPhone, FiCalendar } from "react-icons/fi";
import Image from "next/image";
import useAdminStore from "@/store/adminStore";
import { adminService } from "@/services/adminService";
import toast from "react-hot-toast";

export default function VolunteerRequestTable() {
  const { users, isLoading, getUsers, updateUserStatus } = useAdminStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [assigningRole, setAssigningRole] = useState({});

  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        // Fetch users with volunteer role
        await getUsers({ role: 'volunteer', limit: 100 });
      } catch (error) {
        console.error("Failed to load volunteers:", error);
        toast.error("Failed to load volunteers");
      }
    };
    fetchVolunteers();
  }, [getUsers]);

  const handleApprove = async (userId) => {
    try {
      await updateUserStatus(userId, { isActive: true, status: 'approved' });
      toast.success("Volunteer approved!");
      getUsers({ role: 'volunteer', limit: 100 });
    } catch (error) {
      toast.error("Failed to approve volunteer");
    }
  };

  const handleReject = async (userId) => {
    try {
      await updateUserStatus(userId, { isActive: false, status: 'rejected' });
      toast.success("Volunteer rejected");
      getUsers({ role: 'volunteer', limit: 100 });
    } catch (error) {
      toast.error("Failed to reject volunteer");
    }
  };

  const handleAssignRole = async (userId, newRole) => {
    try {
      setAssigningRole({ ...assigningRole, [userId]: true });
      await adminService.assignRole(userId, newRole);
      toast.success(`Role assigned: ${newRole}`);
      getUsers({ role: 'volunteer', limit: 100 });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to assign role");
    } finally {
      setAssigningRole({ ...assigningRole, [userId]: false });
    }
  };

  const validRoles = ['volunteer', 'donor', 'fundraiser', 'partner', 'vendor', 'admin'];

  const filteredRequests = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone?.includes(searchTerm)
  );

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredRequests.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(filteredRequests.length / entriesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleActivate = (id) => {
    console.log("Activate:", id);
  };

  const handleBlock = (id) => {
    console.log("Block:", id);
  };

  return (
    <>
      <div className="mb-8 bg-white rounded-xl shadow-lg p-4 border-2 border-gray-100">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">Volunteer Request Data</h1>
        <nav className="text-xs text-gray-500">
          <ol className="flex space-x-2 items-center">
            <li><a href="/admin" className="hover:underline text-gray-600 hover:text-blue-600">Home</a></li>
            <li className="text-gray-400">/</li>
            <li><a href="/admin/volunteer-requests" className="hover:underline text-gray-600 hover:text-blue-600">Volunteer Rqst</a></li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-700">Volunteer Request Data</li>
          </ol>
        </nav>
      </div>

      <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-4 backdrop-blur-sm">

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <select value={entriesPerPage} onChange={(e) => { setEntriesPerPage(Number(e.target.value)); setCurrentPage(1); }}
              className="border-2 border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm hover:shadow-md">
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span className="text-sm text-green-600 font-medium">entries per page</span>
          </div>
          <div className="relative">
            <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="border-2 border-gray-300 rounded-xl pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64 transition-all shadow-sm hover:shadow-md"/>
            <BiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading volunteers...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-green-500 via-blue-500 to-green-500">
                    <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wide">Volunteer Details</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wide">Contact</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wide">Role</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wide">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wide">Joined Date</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentEntries.length > 0 ? (
                    currentEntries.map((volunteer, index) => (
                      <tr key={volunteer._id} className={`border-b border-gray-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 transition-all duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                              {volunteer.name?.charAt(0).toUpperCase() || 'V'}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{volunteer.name}</div>
                              <div className="text-xs text-gray-500">{volunteer.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm">
                          <div className="flex items-center gap-2 text-gray-700">
                            <FiPhone size={14} />
                            {volunteer.phone || 'N/A'}
                          </div>
                          <div className="flex items-center gap-2 text-gray-600 text-xs mt-1">
                            <FiMail size={12} />
                            {volunteer.email}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <select
                            value={volunteer.role || 'volunteer'}
                            onChange={(e) => handleAssignRole(volunteer._id, e.target.value)}
                            disabled={assigningRole[volunteer._id]}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-purple-100 text-purple-700 border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer hover:bg-purple-200"
                          >
                            {validRoles.map((role) => (
                              <option key={role} value={role}>
                                {role.charAt(0).toUpperCase() + role.slice(1)}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-col gap-1">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium w-fit ${
                              volunteer.isActive ? 'bg-gradient-to-r from-green-400 to-green-600 text-white' : 'bg-gradient-to-r from-red-400 to-red-600 text-white'
                            }`}>
                              {volunteer.isActive ? '● Active' : '● Blocked'}
                            </span>
                            {volunteer.isVerified && (
                              <span className="px-2 py-1 rounded-full text-xs font-medium w-fit bg-gradient-to-r from-blue-400 to-blue-600 text-white">
                                ✓ Verified
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-700">
                          <div className="flex items-center gap-2">
                            <FiCalendar size={14} />
                            {new Date(volunteer.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex gap-2">
                            {volunteer.isActive ? (
                              <button 
                                onClick={() => handleReject(volunteer._id)}
                                className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-medium rounded-lg hover:from-red-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg"
                              >
                                <BiX size={18} />
                                Block
                              </button>
                            ) : (
                              <button 
                                onClick={() => handleApprove(volunteer._id)}
                                className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-medium rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg"
                              >
                                <BiCheck size={18} />
                                Activate
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-4 py-12 text-center text-gray-500">
                        <div className="text-4xl mb-2">🤝</div>
                        {isLoading ? 'Loading volunteers...' : 'No volunteers found'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </>
  );
}



