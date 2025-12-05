# Backend Integration Guide

## Overview
This guide explains how the frontend is integrated with the backend API to fetch and display real data.

## API Configuration

### Environment Variables
Create a `.env.local` file in the frontend root directory:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# App Configuration
NEXT_PUBLIC_APP_NAME=Care Foundation Trust
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### API Base Configuration
The API is configured in `src/utils/api.js` with:
- Base URL: `http://localhost:5000/api`
- Automatic token injection for authenticated requests
- Error handling for 401 responses
- Request/response interceptors

## Services

### 1. Auth Service (`src/services/authService.js`)
Handles user authentication:
- Login/Register
- Token management
- Password reset
- Profile management

### 2. Campaign Service (`src/services/campaignService.js`)
Manages campaigns:
- Create/Read/Update/Delete campaigns
- Get campaign statistics
- Search and filter campaigns

### 3. Donation Service (`src/services/donationService.js`)
Handles donations:
- Create donations
- Get donation history
- Process payments
- Get donation statistics

### 4. Coupon Service (`src/services/couponService.js`)
Manages coupons:
- Create/Read/Update/Delete coupons
- Validate coupons
- Get coupon usage statistics

### 5. User Service (`src/services/userService.js`)
User management:
- Get user profile
- Update profile
- Get user statistics
- Admin user management

### 6. Admin Service (`src/services/adminService.js`)
Admin-specific operations:
- Dashboard statistics
- Manage campaigns, donations, users, coupons
- System analytics

### 7. Payment Service (`src/services/paymentService.js`)
Payment processing:
- Create payment intents
- Process payments
- Verify payments
- Handle refunds

## State Management

### 1. Auth Store (`src/store/authStore.js`)
Manages authentication state:
- User information
- Login status
- Token management
- Role-based access

### 2. Campaign Store (`src/store/campaignStore.js`)
Campaign data management:
- Campaign list
- Current campaign
- Loading states
- Error handling

### 3. Donation Store (`src/store/donationStore.js`)
Donation data management:
- Donation history
- Current donation
- Payment status
- Statistics

### 4. Admin Store (`src/store/adminStore.js`)
Admin panel data:
- Dashboard statistics
- All campaigns, donations, users, coupons
- Analytics data
- Pagination

## Admin Panel Integration

### Dashboard
The admin dashboard displays real-time statistics:
- Total campaigns
- Total donations
- Total users
- Active coupons

### Data Tables
The admin panel includes comprehensive tables for:
- **Campaigns**: Title, description, target amount, current amount, status, created date
- **Donations**: Amount, donor name, campaign, status, date
- **Users**: Name, email, role, status, join date
- **Coupons**: Code, discount, type, status, expiry date

### Features
- Real-time data fetching
- Loading states
- Error handling
- Pagination
- Search and filtering
- Action buttons (Edit, Delete)
- Responsive design

## Usage Examples

### Fetching Dashboard Stats
```javascript
import useAdminStore from '@/store/adminStore';

const { dashboardStats, getDashboardStats } = useAdminStore();

useEffect(() => {
  getDashboardStats();
}, []);
```

### Creating a Campaign
```javascript
import { campaignService } from '@/services/campaignService';

const createCampaign = async (campaignData) => {
  try {
    const response = await campaignService.createCampaign(campaignData);
    console.log('Campaign created:', response);
  } catch (error) {
    console.error('Error creating campaign:', error);
  }
};
```

### Processing a Donation
```javascript
import { donationService } from '@/services/donationService';

const processDonation = async (donationData) => {
  try {
    const response = await donationService.createDonation(donationData);
    console.log('Donation processed:', response);
  } catch (error) {
    console.error('Error processing donation:', error);
  }
};
```

## Backend Endpoints

The frontend expects these backend endpoints:

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Campaigns
- `GET /api/campaigns` - Get all campaigns
- `POST /api/campaigns` - Create campaign
- `GET /api/campaigns/:id` - Get campaign by ID
- `PUT /api/campaigns/:id` - Update campaign
- `DELETE /api/campaigns/:id` - Delete campaign

### Donations
- `GET /api/donations` - Get all donations
- `POST /api/donations` - Create donation
- `GET /api/donations/:id` - Get donation by ID
- `GET /api/donations/user/:userId` - Get user donations

### Admin
- `GET /api/admin/dashboard` - Get dashboard statistics
- `GET /api/admin/campaigns` - Get all campaigns (admin view)
- `GET /api/admin/donations` - Get all donations (admin view)
- `GET /api/admin/users` - Get all users (admin view)
- `GET /api/admin/coupons` - Get all coupons (admin view)

### Payments
- `POST /api/payments/create-intent` - Create payment intent
- `POST /api/payments/process` - Process payment
- `POST /api/payments/verify/:id` - Verify payment

## Error Handling

The system includes comprehensive error handling:
- Network errors
- Authentication errors
- Validation errors
- Server errors
- User-friendly error messages

## Security

- JWT token authentication
- Role-based access control
- CORS configuration
- Rate limiting
- Input validation
- Secure cookie handling

## Getting Started

1. **Start Backend Server**:
   ```bash
   cd Care-Foundation-Backend
   npm install
   npm start
   ```

2. **Start Frontend Server**:
   ```bash
   cd Care-Foundation-Frontend
   npm install
   npm run dev
   ```

3. **Access Admin Panel**:
   - Login with admin credentials
   - Navigate to `/admin`
   - View real-time data from backend

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure backend CORS is configured for frontend URL
2. **Authentication Errors**: Check token validity and expiration
3. **Data Not Loading**: Verify backend endpoints are working
4. **Permission Errors**: Ensure user has admin role

### Debug Mode

Enable debug mode by setting:
```env
NODE_ENV=development
```

This will show detailed error messages and API logs.

## Support

For issues or questions:
1. Check browser console for errors
2. Verify backend server is running
3. Check network tab for API calls
4. Ensure environment variables are set correctly









