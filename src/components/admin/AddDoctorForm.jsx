"use client";
import { useState } from "react";
import { uploadService } from "@/services/uploadService";
import api from "@/utils/api";
import toast from "react-hot-toast";

export default function AddDoctorForm() {
  const [formData, setFormData] = useState({
    banner: null, username: "", name: "", registration: "", qualification: "", specialization: "", address: "", state: "", email: "", contact: "", timingsFrom: "", timingsTo: "", fees: "", feesOffer: "", availableDay: "", businessLink: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB');
        return;
      }
      setFormData(prev => ({ ...prev, banner: file }));
    }
  };

  const uploadBanner = async (file) => {
    if (!file) return null;
    
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await uploadService.uploadSingle(formData);
      return response.data.url;
    } catch (error) {
      console.error('Banner upload failed:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.email || !formData.contact || !formData.address || !formData.state) {
      toast.error('Please fill all required fields');
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    // Validate phone number (10 digits)
    const phoneRegex = /^\d{10}$/;
    const cleanPhone = formData.contact.replace(/\D/g, '');
    if (!phoneRegex.test(cleanPhone)) {
      toast.error('Please provide a valid 10-digit contact number');
      return;
    }

    setIsSubmitting(true);
    toast.loading('Creating doctor partner...');

    try {
      // Upload banner if provided
      let bannerUrl = null;
      if (formData.banner) {
        toast.loading('Uploading banner image...');
        bannerUrl = await uploadBanner(formData.banner);
      }

      // Get backend base URL
      const backendBaseURL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';

      // Build description with doctor details
      const doctorDescription = `${formData.qualification ? `Qualification: ${formData.qualification}. ` : ''}${formData.specialization ? `Specialization: ${formData.specialization}. ` : ''}${formData.registration ? `Registration No: ${formData.registration}. ` : ''}${formData.fees ? `Actual Fees: ₹${formData.fees}. ` : ''}${formData.feesOffer ? `Special Offer for NGO: ${formData.feesOffer}. ` : ''}`.trim() || 'Medical partner';

      // Map form data to Partner model structure
      const partnerData = {
        name: formData.name,
        email: formData.email.toLowerCase().trim(),
        phone: cleanPhone,
        businessType: 'clinic', // Default to clinic for doctors
        category: 'medical',
        description: doctorDescription,
        address: {
          street: formData.address,
          city: formData.address.split(',')[0] || 'Mumbai', // Extract city from address or default
          state: formData.state || 'Maharashtra',
          pincode: '400001', // Default pincode
          country: 'India'
        },
        contactPerson: {
          name: formData.name,
          phone: cleanPhone,
          email: formData.email.toLowerCase().trim(),
          designation: 'Doctor'
        },
        images: bannerUrl ? [{
          url: `${backendBaseURL}${bannerUrl}`,
          caption: 'Doctor Profile Banner',
          isPrimary: true
        }] : [],
        socialLinks: {
          website: formData.businessLink || ''
        },
        operatingHours: {
          monday: { 
            open: formData.timingsFrom || '09:00', 
            close: formData.timingsTo || '18:00', 
            isOpen: formData.availableDay?.includes('Mon') !== false 
          },
          tuesday: { 
            open: formData.timingsFrom || '09:00', 
            close: formData.timingsTo || '18:00', 
            isOpen: formData.availableDay?.includes('Tue') !== false 
          },
          wednesday: { 
            open: formData.timingsFrom || '09:00', 
            close: formData.timingsTo || '18:00', 
            isOpen: formData.availableDay?.includes('Wed') !== false 
          },
          thursday: { 
            open: formData.timingsFrom || '09:00', 
            close: formData.timingsTo || '18:00', 
            isOpen: formData.availableDay?.includes('Thu') !== false 
          },
          friday: { 
            open: formData.timingsFrom || '09:00', 
            close: formData.timingsTo || '18:00', 
            isOpen: formData.availableDay?.includes('Fri') !== false 
          },
          saturday: { 
            open: formData.timingsFrom || '09:00', 
            close: formData.timingsTo || '18:00', 
            isOpen: formData.availableDay?.includes('Sat') !== false 
          },
          sunday: { 
            open: formData.timingsFrom || '09:00', 
            close: formData.timingsTo || '18:00', 
            isOpen: formData.availableDay?.includes('Sun') || false 
          }
        },
        // Add admin notes with doctor-specific info
        adminNotes: `Username: ${formData.username || 'N/A'}, Registration: ${formData.registration || 'N/A'}, Qualification: ${formData.qualification || 'N/A'}, Specialization: ${formData.specialization || 'N/A'}, Actual Fees: ${formData.fees || 'N/A'}, NGO Offer: ${formData.feesOffer || 'N/A'}`,
        // Provide documents with registration number as business license
        documents: {
          businessLicense: formData.registration || 'Admin-approved doctor partner',
          gstNumber: '',
          panNumber: ''
        },
        status: 'approved', // Auto-approve for admin-created partners
        isActive: true // Ensure partner is active
      };

      console.log('Submitting doctor partner data:', partnerData);

      // Create partner
      const response = await api.post('/partners', partnerData);
      
      toast.dismiss();
      toast.success('Doctor partner added successfully! 🎉');
      
      // Reset form
      setFormData({
        banner: null, 
        username: "", 
        name: "", 
        registration: "", 
        qualification: "", 
        specialization: "", 
        address: "", 
        state: "", 
        email: "", 
        contact: "", 
        timingsFrom: "", 
        timingsTo: "", 
        fees: "", 
        feesOffer: "", 
        availableDay: "", 
        businessLink: ""
      });
      
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';

      // Reload after 2 seconds
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error) {
      console.error('Doctor partner creation failed:', error);
      toast.dismiss();
      
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.data?.errors) {
        const errorMessages = error.response.data.errors
          .map(err => `${err.field}: ${err.message}`)
          .join('\n');
        toast.error(`Validation failed:\n${errorMessages}`, { duration: 6000 });
      } else {
        toast.error(error.message || 'Failed to create doctor partner. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Add Doctor Partner</h1>
        <nav className="text-gray-500 text-sm">
          <ol className="flex space-x-2 items-center">
            <li><a href="/admin" className="hover:underline text-gray-600">Home</a></li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-700">Add Doctor Partner</li>
          </ol>
        </nav>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-8">
        <h2 className="text-xl font-semibold mb-2">Add <span className="text-green-600">Doctor</span> Partner</h2>
        <h3 className="text-lg font-semibold text-green-600 mb-6">Adding Doctor Partner</h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-red-600 mb-2">Upload Banner</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={handleFileChange}
              className="border rounded-lg px-3 py-2 w-full text-sm"
            />
            {formData.banner && (
              <p className="text-xs text-gray-500 mt-1">Selected: {formData.banner.name}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-green-600 mb-2">USERNAME</label>
              <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Username Of Doctor" className="border rounded-lg px-4 py-2 w-full text-sm"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-green-600 mb-2">REGISTRATION NO.</label>
              <input type="text" name="registration" value={formData.registration} onChange={handleChange} placeholder="Enter Registration no. here" className="border rounded-lg px-4 py-2 w-full text-sm"/>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-green-600 mb-2">NAME OF THE DOCTOR</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter Name Of Doctor" className="border rounded-lg px-4 py-2 w-full text-sm"/>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-green-600 mb-2">QUALIFICATION</label>
              <input type="text" name="qualification" value={formData.qualification} onChange={handleChange} placeholder="Enter qualification here" className="border rounded-lg px-4 py-2 w-full text-sm"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-green-600 mb-2">SPECIALIZATION</label>
              <input type="text" name="specialization" value={formData.specialization} onChange={handleChange} placeholder="Enter Specialization here" className="border rounded-lg px-4 py-2 w-full text-sm"/>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-green-600 mb-2">ADDRESS OF CLINIC / HOSPITAL / OPERATION</label>
            <textarea name="address" value={formData.address} onChange={handleChange} placeholder="Enter Address here..." rows={3} className="border rounded-lg px-4 py-2 w-full text-sm"/>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-green-600 mb-2">STATE</label>
              <select name="state" value={formData.state} onChange={handleChange} className="border rounded-lg px-4 py-2 w-full text-sm">
                <option>Select State</option>
                <option>Maharashtra</option>
                <option>Karnataka</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-green-600 mb-2">EMAIL ID</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter Email here" className="border rounded-lg px-4 py-2 w-full text-sm"/>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-green-600 mb-2">CONTACT NUMBER</label>
            <input type="text" name="contact" value={formData.contact} onChange={handleChange} placeholder="Enter 10 digit mobile number (e.g., 9876543210)" maxLength="10" className="border rounded-lg px-4 py-2 w-full text-sm"/>
          </div>

          <div>
            <label className="block text-sm font-medium text-green-600 mb-2">Doctors Actual Fees</label>
            <input type="text" name="fees" value={formData.fees} onChange={handleChange} placeholder="Enter actual Fees of Doctor" className="border rounded-lg px-4 py-2 w-full text-sm"/>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-green-600 mb-2">TIMINGS OF AVAILABLE FROM</label>
              <input type="time" name="timingsFrom" value={formData.timingsFrom} onChange={handleChange} className="border rounded-lg px-4 py-2 w-full text-sm"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-green-600 mb-2">TIMINGS OF AVAILABLE TO</label>
              <input type="time" name="timingsTo" value={formData.timingsTo} onChange={handleChange} className="border rounded-lg px-4 py-2 w-full text-sm"/>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-green-600 mb-2">Fees For Care Foundation Trust</label>
              <input type="text" name="feesOffer" value={formData.feesOffer} onChange={handleChange} placeholder="Enter Any Offer For NGO" className="border rounded-lg px-4 py-2 w-full text-sm"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-green-600 mb-2">AVAILABLE DAY <span className="text-blue-600">See Link</span></label>
              <input type="text" name="availableDay" value={formData.availableDay} onChange={handleChange} placeholder="Eg. Mon - Sat" className="border rounded-lg px-4 py-2 w-full text-sm"/>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-red-600 mb-2">Paste Google Bussiness Link</label>
            <input type="url" name="businessLink" value={formData.businessLink} onChange={handleChange} placeholder="Paste Google Bussiness Link" className="border rounded-lg px-4 py-2 w-full text-sm"/>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input type="radio" name="agree1" value="Yes" className="w-4 h-4"/>
              <span className="text-sm text-green-600">1. Do You Agree To Pay Care Foundation Trust 20% Admin Charges? ○ Yes ○ No</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="agree2" value="Yes" className="w-4 h-4"/>
              <span className="text-sm text-green-600">2. Do You Agree For Weekly Reimbursement? ○ Yes ○ No</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4"/>
              <span className="text-sm text-green-600">3. I agree to the above Terms and Conditions ○ Yes ○ No</span>
            </label>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className={`px-6 py-2 text-white text-sm font-medium rounded-lg transition-colors ${
              isSubmitting 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-orange-500 hover:bg-orange-600'
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Submitting...
              </span>
            ) : (
              'Submit'
            )}
          </button>
        </form>
      </div>
    </>
  );
}







