const axios = require('axios');

async function generateInvoice() {
  try {
    const response = await axios.get('/api/checkoutFormData');
    const checkoutData = response.data;

    const invoiceHtml = `
      <div style="maxWidth: 800px; margin: 20px auto; backgroundColor: #fff; padding: 20px; borderRadius: 10px; boxShadow: 0 0 10px rgba(0, 0, 0, 0.1); fontFamily: Arial, sans-serif;">
        <div style="display: flex; marginBottom: 20px;">
          <div style="flex: 0 0 auto;">
            <img src="your-logo.png" alt="Company Logo" style="maxWidth: 150px; maxHeight: 100px;" />
          </div>
          <div style="flex: 1; textAlign: right;">
            <h1>Invoice</h1>
            <p>Shree Ganesh Building,First floor No-102, Gurudwara Chowk, Near Akurdi Railway Station Rd,Pune Maharashtra - 411033.</p>
            <p>ubsbill.com | +91 911 211 3322</p>
          </div>
        </div>
        <hr style="margin: 20px 0; border: none; borderBottom: 1px solid #ddd;" />
        <div style="display: flex; marginBottom: 20px;">
          <div style="flex: 1; marginRight: 20px;">
            <h2>Customer Information</h2>
            <div>
              <p><strong>Name:</strong> ${checkoutData.firstname} ${checkoutData.lastname}</p>
              <p><strong>Email:</strong> ${checkoutData.email}</p>
              <p><strong>Phone No:</strong> ${checkoutData.phoneno}</p>
            </div>
          </div>
          <div style="flex: 1;">
            <h2>Invoice Details</h2>
            <p><strong>Date:</strong> April 11, 2024</p>
            <p><strong>Invoice No:</strong> #123456</p>
            <p><strong>Merchant:</strong> XYZ Store</p>
          </div>
        </div>
        <hr style="margin: 20px 0; border: none; borderBottom: 1px solid #ddd;" />
        <div style="textAlign: right;">
          <h2>Total</h2>
          <p><strong>Amount Paid:</strong> $100</p>
          <p><strong>Total:</strong> $100</p>
        </div>
      </div>
    `;

    return invoiceHtml;
  } catch (error) {
    console.error('Error fetching checkout data:', error);
    return null;
  }
}

module.exports = generateInvoice;
