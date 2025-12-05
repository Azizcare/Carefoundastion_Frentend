"use client";
import { useState, useEffect } from "react";
import { BiSearch, BiMailSend } from "react-icons/bi";
import { FiMail, FiPhone, FiMessageSquare } from "react-icons/fi";
import { adminService } from "@/services/adminService";
import toast from "react-hot-toast";

export default function WebsiteQueriesTable() {
  const [queries, setQueries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  useEffect(() => {
    fetchQueries();
  }, []);

  const fetchQueries = async () => {
    setIsLoading(true);
    try {
      const response = await adminService.getAllContactQueries({
        page: 1,
        limit: entriesPerPage
      });
      setQueries(response.data || []);
    } catch (error) {
      console.error('Failed to load queries:', error);
      toast.error('Failed to load contact queries');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsResolved = async (queryId) => {
    try {
      await adminService.updateQueryStatus(queryId, { status: 'resolved' });
      toast.success('Query marked as resolved');
      fetchQueries(); // Refresh the list
    } catch (error) {
      console.error('Failed to update query:', error);
      toast.error('Failed to update query status');
    }
  };

  return (
    <>
      <div className="mb-8 bg-white rounded-xl shadow-lg p-6 border-2 border-gray-100">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">Contact Queries</h1>
        <nav className="text-gray-500 text-sm">
          <ol className="flex space-x-2 items-center">
            <li><a href="/admin" className="hover:underline text-gray-600 font-medium">Home</a></li>
            <li className="text-gray-400">/</li>
            <li><a href="/admin/queries" className="hover:underline text-gray-600 font-medium">Contact Queries</a></li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-700 font-semibold">All Contact Queries</li>
          </ol>
        </nav>
      </div>

      <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-4 backdrop-blur-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span className="w-1 h-8 bg-gradient-to-b from-green-500 to-blue-500 rounded-full"></span>
          Website Contact Queries Table
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

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-green-500 via-blue-500 to-green-500">
                <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wide">Name</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wide">Mobile Number</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wide">Subject</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wide">Message</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wide">Status</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wide">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="px-4 py-12 text-center text-gray-500">
                    Loading queries...
                  </td>
                </tr>
              ) : queries.length > 0 ? (
                queries.map((query, idx) => (
                  <tr key={query._id} className={`border-b border-gray-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 transition-all duration-200 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        <FiMail className="text-gray-400" />
                        <div>
                          <div className="font-medium text-gray-900">{query.name}</div>
                          <div className="text-xs text-gray-500">{query.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-1">
                        <FiPhone className="text-gray-400" size={14} />
                        {query.phone}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{query.subject}</td>
                    <td className="px-4 py-3 text-sm max-w-md">
                      <div className="line-clamp-2 text-gray-700">{query.message}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        query.status === 'resolved' ? 'bg-gradient-to-r from-green-400 to-green-600 text-white' :
                        query.status === 'in-progress' ? 'bg-gradient-to-r from-blue-400 to-blue-600 text-white' :
                        'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white'
                      }`}>
                        {query.status.replace('-', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button 
                        onClick={() => handleMarkAsResolved(query._id)}
                        className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={query.status === 'resolved'}
                      >
                        {query.status === 'resolved' ? 'Resolved' : 'Mark As Fixed'}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-4 py-12 text-center text-gray-500">
                    No queries found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}



