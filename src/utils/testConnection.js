// Test connection to backend
export const testBackendConnection = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/health');
    const data = await response.json();
    console.log('✅ Backend connection successful:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Backend connection failed:', error);
    return { success: false, error: error.message };
  }
};

// Test registration endpoint
export const testRegistration = async (testData) => {
  try {
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });
    
    const data = await response.json();
    console.log('✅ Registration test response:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Registration test failed:', error);
    return { success: false, error: error.message };
  }
};









