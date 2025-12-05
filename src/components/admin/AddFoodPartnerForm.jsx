"use client";
import { useState } from "react";
import { uploadService } from "@/services/uploadService";
import api from "@/utils/api";
import toast from "react-hot-toast";

export default function AddFoodPartnerForm() {
  const [formData, setFormData] = useState({
    banner: null, partnerType: "", restaurantName: "", username: "", date: "", foodCuisine: "", address: "", state: "", email: "", contact: "", specialOffer: "", timingsFrom: "", timingsTo: "", availableDay: "", businessLink: "", fsai: ""
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
    if (!formData.restaurantName || !formData.email || !formData.contact || !formData.address || !formData.state) {
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
    toast.loading('Creating food partner...');

    try {
      // Upload banner if provided
      let bannerUrl = null;
      if (formData.banner) {
        toast.loading('Uploading banner image...');
        bannerUrl = await uploadBanner(formData.banner);
      }

      // Get backend base URL
      const backendBaseURL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';

      // Map form data to Partner model structure
      const partnerData = {
        name: formData.restaurantName,
        email: formData.email.toLowerCase().trim(),
        phone: cleanPhone,
        businessType: formData.partnerType === 'Cafe' ? 'restaurant' : 'restaurant', // Map partner type
        category: 'food',
        description: formData.foodCuisine || 'Food partner',
        address: {
          street: formData.address,
          city: formData.address.split(',')[0] || 'Mumbai', // Extract city from address or default
          state: formData.state || 'Maharashtra',
          pincode: '400001', // Default pincode, you can add a field for this
          country: 'India'
        },
        contactPerson: {
          name: formData.restaurantName,
          phone: cleanPhone,
          email: formData.email.toLowerCase().trim()
        },
        images: bannerUrl ? [{
          url: `${backendBaseURL}${bannerUrl}`,
          caption: 'Restaurant Banner',
          isPrimary: true
        }] : [],
        socialLinks: {
          website: formData.businessLink || ''
        },
        operatingHours: {
          monday: { 
            open: formData.timingsFrom || '09:00', 
            close: formData.timingsTo || '21:00', 
            isOpen: formData.availableDay?.includes('Mon') || true 
          },
          tuesday: { 
            open: formData.timingsFrom || '09:00', 
            close: formData.timingsTo || '21:00', 
            isOpen: formData.availableDay?.includes('Tue') || true 
          },
          wednesday: { 
            open: formData.timingsFrom || '09:00', 
            close: formData.timingsTo || '21:00', 
            isOpen: formData.availableDay?.includes('Wed') || true 
          },
          thursday: { 
            open: formData.timingsFrom || '09:00', 
            close: formData.timingsTo || '21:00', 
            isOpen: formData.availableDay?.includes('Thu') || true 
          },
          friday: { 
            open: formData.timingsFrom || '09:00', 
            close: formData.timingsTo || '21:00', 
            isOpen: formData.availableDay?.includes('Fri') || true 
          },
          saturday: { 
            open: formData.timingsFrom || '09:00', 
            close: formData.timingsTo || '21:00', 
            isOpen: formData.availableDay?.includes('Sat') || true 
          },
          sunday: { 
            open: formData.timingsFrom || '09:00', 
            close: formData.timingsTo || '21:00', 
            isOpen: formData.availableDay?.includes('Sun') || false 
          }
        },
        // Add admin notes with special offer info
        adminNotes: `Special Offer: ${formData.specialOffer || 'N/A'}, FSAI: ${formData.fsai || 'N/A'}, Username: ${formData.username || 'N/A'}`,
        // Provide documents with FSAI as business license for admin-created partners
        documents: {
          businessLicense: formData.fsai || 'Admin-approved partner',
          gstNumber: '',
          panNumber: ''
        },
        status: 'approved', // Auto-approve for admin-created partners
        isActive: true // Ensure partner is active
      };

      console.log('Submitting partner data:', partnerData);

      // Create partner
      const response = await api.post('/partners', partnerData);
      
      toast.dismiss();
      toast.success('Food partner added successfully! 🎉');
      
      // Reset form
      setFormData({
        banner: null, 
        partnerType: "", 
        restaurantName: "", 
        username: "", 
        date: "", 
        foodCuisine: "", 
        address: "", 
        state: "", 
        email: "", 
        contact: "", 
        specialOffer: "", 
        timingsFrom: "", 
        timingsTo: "", 
        availableDay: "", 
        businessLink: "",
        fsai: ""
      });
      
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';

      // Reload after 2 seconds
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error) {
      console.error('Partner creation failed:', error);
      toast.dismiss();
      
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.data?.errors) {
        const errorMessages = error.response.data.errors
          .map(err => `${err.field}: ${err.message}`)
          .join('\n');
        toast.error(`Validation failed:\n${errorMessages}`, { duration: 6000 });
      } else {
        toast.error(error.message || 'Failed to create food partner. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Add Food Partner</h1>
        <nav className="text-xs text-gray-500">
          <ol className="flex space-x-2 items-center">
            <li><a href="/admin" className="hover:underline text-gray-600">Home</a></li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-700">Add Food Partner</li>
          </ol>
        </nav>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-8">
        <h2 className="text-xl font-semibold mb-2">Add <span className="text-blue-600">Food</span> Partner</h2>
        <h3 className="text-lg font-semibold text-green-600 mb-6">Adding Food Partner</h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-red-600 mb-2">UPLOAD BANNER</label>
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
              <label className="block text-sm font-medium text-orange-600 mb-2">PARTNER TYPE</label>
              <select name="partnerType" value={formData.partnerType} onChange={handleChange} className="border rounded-lg px-4 py-2 w-full text-sm">
                <option>Select Partner Type</option>
                <option>Restaurant</option>
                <option>Cafe</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-green-600 mb-2">USERNAME</label>
              <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Enter Username" className="border rounded-lg px-4 py-2 w-full text-sm"/>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-orange-600 mb-2">RESTAURANT NAME</label>
            <input type="text" name="restaurantName" value={formData.restaurantName} onChange={handleChange} placeholder="Enter Name Of Restaurant" className="border rounded-lg px-4 py-2 w-full text-sm"/>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-orange-600 mb-2">DATE</label>
              <input type="date" name="date" value={formData.date} onChange={handleChange} className="border rounded-lg px-4 py-2 w-full text-sm"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-orange-600 mb-2">FSAI NUMBER</label>
              <input 
                type="text" 
                name="fsai" 
                value={formData.fsai}
                onChange={handleChange}
                placeholder="Enter FSAI No" 
                className="border rounded-lg px-4 py-2 w-full text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-orange-600 mb-2">FOOD CUISINE</label>
            <input type="text" name="foodCuisine" value={formData.foodCuisine} onChange={handleChange} placeholder="Enter Food Cuisine here" className="border rounded-lg px-4 py-2 w-full text-sm"/>
          </div>

          <div>
            <label className="block text-sm font-medium text-orange-600 mb-2">ADDRESS</label>
            <textarea name="address" value={formData.address} onChange={handleChange} placeholder="Enter Restaurants Address here..." rows={3} className="border rounded-lg px-4 py-2 w-full text-sm"/>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-orange-600 mb-2">STATE</label>
              <select name="state" value={formData.state} onChange={handleChange} className="border rounded-lg px-4 py-2 w-full text-sm">
                <option>Select State</option>
                <option>Maharashtra</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-orange-600 mb-2">EMAIL</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter Email here" className="border rounded-lg px-4 py-2 w-full text-sm"/>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-orange-600 mb-2">CONTACT NUMBER</label>
            <input type="text" name="contact" value={formData.contact} onChange={handleChange} placeholder="Enter 10 digit mobile number (e.g., 9876543210)" maxLength="10" className="border rounded-lg px-4 py-2 w-full text-sm"/>
          </div>

          <div>
            <label className="block text-sm font-medium text-orange-600 mb-2">SPECIAL OFFER FOR OUR NGO</label>
            <input type="text" name="specialOffer" value={formData.specialOffer} onChange={handleChange} placeholder="Eg. 10%" className="border rounded-lg px-4 py-2 w-full text-sm"/>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-orange-600 mb-2">TIMINGS OF AVAILABLE FROM</label>
              <input type="time" name="timingsFrom" value={formData.timingsFrom} onChange={handleChange} className="border rounded-lg px-4 py-2 w-full text-sm"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-orange-600 mb-2">TIMINGS OF AVAILABLE TO</label>
              <input type="time" name="timingsTo" value={formData.timingsTo} onChange={handleChange} className="border rounded-lg px-4 py-2 w-full text-sm"/>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-orange-600 mb-2">AVAILABLE DAY <span className="text-green-600">SEO Link</span></label>
            <input type="text" name="availableDay" value={formData.availableDay} onChange={handleChange} placeholder="Eg. Mon - Sat" className="border rounded-lg px-4 py-2 w-full text-sm"/>
          </div>

          <div>
            <label className="block text-sm font-medium text-red-600 mb-2">Paste Google Bussiness Link</label>
            <input type="url" name="businessLink" value={formData.businessLink} onChange={handleChange} placeholder="Paste Google Bussiness Link" className="border rounded-lg px-4 py-2 w-full text-sm"/>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input type="radio" name="agree1" className="w-4 h-4"/>
              <span className="text-sm text-green-600">1. Do You Agree To Pay Care Foundation Trust 10% Admin Charges? ○ Yes ○ No</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="agree2" className="w-4 h-4"/>
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







