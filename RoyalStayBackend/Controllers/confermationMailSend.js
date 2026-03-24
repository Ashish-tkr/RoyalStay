import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import Booking from '../models/booking.js';

// Email configuration
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    // Add these options for better email delivery
    tls: {
      rejectUnauthorized: false
    },
    debug: true, // Enable debug for troubleshooting
    logger: true
  });
};

// Complete embedded HTML template
const getEmbeddedTemplate = () => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Confirmation - RoyalStay</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
        }
        .header h1 {
            font-size: 28px;
            margin-bottom: 8px;
            font-weight: 600;
        }
        .header p {
            font-size: 16px;
            opacity: 0.9;
        }
        .content {
            padding: 30px 20px;
        }
        .success-message {
            background: #d4edda;
            border: 1px solid #c3e6cb;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 30px;
            text-align: center;
        }
        .success-message h2 {
            color: #155724;
            font-size: 24px;
            margin-bottom: 8px;
        }
        .success-message p {
            color: #155724;
            font-size: 16px;
        }
        .booking-info {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
        }
        .booking-info h3 {
            color: #495057;
            margin-bottom: 15px;
            font-size: 18px;
            border-bottom: 2px solid #dee2e6;
            padding-bottom: 5px;
        }
        .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            padding: 8px 0;
            border-bottom: 1px solid #e9ecef;
        }
        .info-row:last-child {
            border-bottom: none;
            margin-bottom: 0;
        }
        .info-label {
            font-weight: 600;
            color: #495057;
        }
        .info-value {
            color: #6c757d;
            text-align: right;
        }
        .amount {
            font-size: 18px;
            font-weight: 700;
            color: #28a745;
        }
        .next-steps {
            background: #e7f3ff;
            border-left: 4px solid #007bff;
            padding: 20px;
            margin: 20px 0;
        }
        .next-steps h3 {
            color: #0056b3;
            margin-bottom: 15px;
        }
        .next-steps ul {
            list-style: none;
            padding-left: 0;
        }
        .next-steps li {
            margin-bottom: 10px;
            padding-left: 20px;
            position: relative;
        }
        .next-steps li:before {
            content: "✓";
            position: absolute;
            left: 0;
            color: #007bff;
            font-weight: bold;
        }
        .footer {
            background: #343a40;
            color: white;
            text-align: center;
            padding: 20px;
        }
        .footer p {
            margin-bottom: 10px;
        }
        .contact-info {
            font-size: 14px;
            color: #adb5bd;
        }
        @media (max-width: 600px) {
            .container {
                margin: 10px;
                border-radius: 8px;
            }
            .content {
                padding: 20px 15px;
            }
            .info-row {
                flex-direction: column;
                align-items: flex-start;
            }
            .info-value {
                text-align: left;
                margin-top: 5px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>RoyalStay</h1>
            <p>Peaceful • Luxurious • Unforgettable</p>
        </div>
        
        <div class="content">
            <div class="success-message">
                <h2>🎉 Booking Confirmed!</h2>
                <p>Your luxury experience awaits where tranquility meets exceptional hospitality.</p>
            </div>
            
            <p style="font-size: 16px; margin-bottom: 20px;">
                Dear <strong>{{guestName}}</strong>,
            </p>
            <p style="margin-bottom: 20px;">
                Thank you for choosing RoyalStay. We're excited to host you for an unforgettable stay.
            </p>
            
            <div class="booking-info">
                <h3>📋 Booking Details</h3>
                <div class="info-row">
                    <span class="info-label">Booking ID:</span>
                    <span class="info-value"><strong>{{bookingId}}</strong></span>
                </div>
                <div class="info-row">
                    <span class="info-label">Guest Name:</span>
                    <span class="info-value">{{guestName}}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Check-in:</span>
                    <span class="info-value">{{checkInDate}}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Check-out:</span>
                    <span class="info-value">{{checkOutDate}}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Total Guests:</span>
                    <span class="info-value">{{totalGuests}} ({{adults}} Adults, {{children}} Children)</span>
                </div>
            </div>
            
            <div class="booking-info">
                <h3>🏨 Property Details</h3>
                <div class="info-row">
                    <span class="info-label">Property:</span>
                    <span class="info-value">{{apartmentName}}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Location:</span>
                    <span class="info-value">{{apartmentLocation}}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Flat Type:</span>
                    <span class="info-value">{{flatType}} - {{flatTitle}}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Flat ID:</span>
                    <span class="info-value">{{flatId}}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Features:</span>
                    <span class="info-value">{{bedrooms}} Bedrooms, {{bathrooms}} Bathrooms</span>
                </div>
            </div>
            
            <div class="booking-info">
                <h3>💳 Payment Confirmation</h3>
                <div class="info-row">
                    <span class="info-label">Amount Paid:</span>
                    <span class="info-value amount">{{finalAmount}}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Transaction ID:</span>
                    <span class="info-value">{{transactionId}}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Razorpay Order ID:</span>
                    <span class="info-value">{{razorpayOrderId}}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Payment Date:</span>
                    <span class="info-value">{{paymentDate}}</span>
                </div>
            </div>
            
            <div class="next-steps">
                <h3>📝 What's Next?</h3>
                <ul>
                    <li>Save this email for your records and present it during check-in</li>
                    <li>You'll receive check-in instructions 24 hours before your arrival</li>
                    <li>Our concierge team will contact you to arrange any special requests</li>
                    <li>Download our mobile app for seamless communication during your stay</li>
                </ul>
            </div>
            
            <p style="text-align: center; font-style: italic; color: #6c757d; margin-top: 30px;">
                "Where luxury meets serenity, creating unforgettable experiences in the world's most beautiful destinations."
            </p>
        </div>
        
        <div class="footer">
            <p><strong>Thank you for choosing RoyalStay</strong></p>
            <div class="contact-info">
                <p>📧 Contact Support: support@RoyalStay.com</p>
                <p>🌐 Manage Booking: www.RoyalStay.com/bookings</p>
            </div>
        </div>
    </div>
</body>
</html>`;
};

// Function to send booking confirmation email
export const sendBookingConfirmationEmail = async (bookingData) => {
  try {
    console.log("📧 Preparing booking confirmation email...");

    const {
      booking,
      guestInfo,
      apartmentDetails,
      flatDetails,
      payment,
      pricing,
      checkInDate,
      checkOutDate,
      adults,
      children,
      totalGuests,
    } = bookingData;

    // Always use embedded template to avoid file read issues
    let htmlTemplate = getEmbeddedTemplate();

    console.log("✅ Using embedded HTML template");

    // Format dates
    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
      }).format(amount);
    };

    // Replace template variables with proper null checks
    const emailHtml = htmlTemplate
      .replace(/{{bookingId}}/g, booking._id || 'N/A')
      .replace(/{{guestName}}/g, `${guestInfo.firstName || ''} ${guestInfo.lastName || ''}`.trim())
      .replace(/{{checkInDate}}/g, formatDate(checkInDate))
      .replace(/{{checkOutDate}}/g, formatDate(checkOutDate))
      .replace(/{{adults}}/g, adults || 0)
      .replace(/{{children}}/g, children || 0)
      .replace(/{{totalGuests}}/g, totalGuests || (adults || 0) + (children || 0))
      .replace(/{{apartmentName}}/g, apartmentDetails.name || 'Luxury Apartment')
      .replace(/{{apartmentLocation}}/g, apartmentDetails.location || 'Premium Location')
      .replace(/{{flatType}}/g, flatDetails.type || 'Luxury')
      .replace(/{{flatTitle}}/g, flatDetails.title || 'Premium Stay')
      .replace(/{{flatId}}/g, booking.flatId || 'N/A')
      .replace(/{{bedrooms}}/g, flatDetails.bedrooms || 'N/A')
      .replace(/{{bathrooms}}/g, flatDetails.bathrooms || 'N/A')
      .replace(/{{flatSize}}/g, flatDetails.size || 'N/A')
      .replace(/{{basePrice}}/g, formatCurrency(pricing.basePrice || 0))
      .replace(/{{finalAmount}}/g, formatCurrency(pricing.finalAmount || 0))
      .replace(/{{transactionId}}/g, payment.transactionId || 'N/A')
      .replace(/{{razorpayOrderId}}/g, payment.razorpayOrderId || 'N/A')
      .replace(/{{paymentDate}}/g, formatDate(new Date()));

    console.log("✅ Template variables replaced successfully");

    // Create transporter
    const transporter = createTransporter();

    // Verify transporter configuration
    await transporter.verify();
    console.log("✅ Email transporter verified successfully");

    // Create text version
    const textContent = createTextVersion(bookingData);

    // Email options with both HTML and text
    const mailOptions = {
      from: {
        name: 'RoyalStay',
        address: process.env.EMAIL_USER,
      },
      to: guestInfo.email,
      subject: `🎉 Booking Confirmed - Your Luxury Stay Awaits at ${apartmentDetails.name}`,
      html: emailHtml,
      text: textContent, // Always include text version
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        'Importance': 'high'
      }
    };

    console.log("📧 Sending email to:", guestInfo.email);
    console.log("📧 Email HTML length:", emailHtml.length);
    console.log("📧 Email text length:", textContent.length);

    // Send email
    const result = await transporter.sendMail(mailOptions);
    console.log("✅ Booking confirmation email sent successfully:", result.messageId);

    return {
      success: true,
      messageId: result.messageId,
    };

  } catch (error) {
    console.error("❌ Failed to send booking confirmation email:", error);
    console.error("❌ Error details:", {
      message: error.message,
      stack: error.stack,
      code: error.code
    });
    throw new Error(`Email sending failed: ${error.message}`);
  }
};

// Function to create a text version of the email
const createTextVersion = (bookingData) => {
  const {
    booking,
    guestInfo,
    apartmentDetails,
    flatDetails,
    payment,
    pricing,
    checkInDate,
    checkOutDate,
    adults,
    children,
    totalGuests,
  } = bookingData;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return `
RoyalStay - BOOKING CONFIRMATION
Peaceful • Luxurious • Unforgettable

🎉 BOOKING CONFIRMED!

Dear ${guestInfo.firstName || ''} ${guestInfo.lastName || ''},

Thank you for choosing RoyalStay. Your luxury experience awaits where tranquility meets exceptional hospitality.

BOOKING DETAILS:
Booking ID: ${booking._id || 'N/A'}
Guest Name: ${guestInfo.firstName || ''} ${guestInfo.lastName || ''}
Check-in: ${new Date(checkInDate).toDateString()}
Check-out: ${new Date(checkOutDate).toDateString()}
Total Guests: ${totalGuests || 0} (${adults || 0} Adults, ${children || 0} Children)

PROPERTY DETAILS:
${apartmentDetails.name || 'Luxury Apartment'}
Location: ${apartmentDetails.location || 'Premium Location'}
Flat Type: ${flatDetails.type || 'Luxury'} - ${flatDetails.title || 'Premium Stay'}
Flat ID: ${booking.flatId || 'N/A'}
Features: ${flatDetails.bedrooms || 'N/A'} Bedrooms, ${flatDetails.bathrooms || 'N/A'} Bathrooms

PAYMENT CONFIRMATION:
Amount Paid: ${formatCurrency(pricing.finalAmount || 0)}
Transaction ID: ${payment.transactionId || 'N/A'}
Razorpay Order ID: ${payment.razorpayOrderId || 'N/A'}
Payment Date: ${new Date().toDateString()}

WHAT'S NEXT:
• Save this email for your records and present it during check-in
• You'll receive check-in instructions 24 hours before your arrival  
• Our concierge team will contact you to arrange any special requests
• Download our mobile app for seamless communication during your stay

"Where luxury meets serenity, creating unforgettable experiences in the world's most beautiful destinations."

Thank you for choosing RoyalStay for your luxury stay.

Contact Support: support@RoyalStay.com
Manage Booking: www.RoyalStay.com/bookings
  `.trim();
};

// Function to call when booking is confirmed and payment successful
export const handleBookingConfirmation = async (bookingId) => {
  try {
    console.log("🔄 Processing booking confirmation for:", bookingId);

    // Fetch booking details from database
    const booking = await Booking.findById(bookingId).populate('apartmentId');
    if (!booking) {
      throw new Error('Booking not found');
    }

    // Verify booking and payment status
    if (booking.status !== 'confirmed') {
      console.log("⚠️ Warning: Booking status is not 'confirmed':", booking.status);
    }

    if (booking.payment.paymentStatus !== 'success') {
      console.log("⚠️ Warning: Payment status is not 'success':", booking.payment.paymentStatus);
    }

    // Prepare email data with fallbacks
    const emailData = {
      booking: booking,
      guestInfo: booking.guestInfo || {},
      apartmentDetails: booking.apartmentDetails || {},
      flatDetails: booking.flatDetails || {},
      payment: booking.payment || {},
      pricing: booking.pricing || {},
      checkInDate: booking.checkInDate,
      checkOutDate: booking.checkOutDate,
      adults: booking.adults || 0,
      children: booking.children || 0,
      totalGuests: booking.totalGuests || (booking.adults || 0) + (booking.children || 0),
    };

    // Send confirmation email
    await sendBookingConfirmationEmail(emailData);

    console.log("✅ Booking confirmation process completed successfully");
    return { success: true };

  } catch (error) {
    console.error("❌ Booking confirmation process failed:", error);
    throw error;
  }
};

// Test function to verify email configuration
export const testEmailConfiguration = async () => {
  try {
    console.log("🧪 Testing email configuration...");

    const transporter = createTransporter();
    await transporter.verify();

    console.log("✅ Email configuration is valid");
    return { success: true, message: "Email configuration is working" };

  } catch (error) {
    console.error("❌ Email configuration test failed:", error);
    return { success: false, error: error.message };
  }
};