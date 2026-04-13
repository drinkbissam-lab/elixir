import { RequestHandler } from "express";
import nodemailer from "nodemailer";
import {
  OrderConfirmationEmailRequest,
  OrderConfirmationEmailResponse,
} from "@shared/api";

// Initialize Nodemailer transporter
// For Gmail: Use app-specific password
// For other services: Update with your email service credentials
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "drinkbissam@gmail.com",
    pass: process.env.EMAIL_PASSWORD || "",
  },
});

export const handleSendOrderEmail: RequestHandler = async (
  req,
  res
) => {
  try {
    const {
      orderId,
      customerName,
      customerEmail,
      phoneNumber,
      neighborhood,
      address,
      addressDetails,
      items,
      total,
      paymentMethod,
    } = req.body as OrderConfirmationEmailRequest;

    // Validate required fields
    if (
      !orderId ||
      !customerName ||
      !phoneNumber ||
      !address ||
      !items ||
      !total ||
      !neighborhood
    ) {
      res.status(400).json({
        success: false,
        message: "Missing required fields",
      } as OrderConfirmationEmailResponse);
      return;
    }

    // Create email HTML content with detailed information
    const emailContent = `
      <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right; padding: 20px; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 8px;">
          <h2 style="color: #fff; background-color: #ff6b6b; padding: 15px; border-radius: 8px; text-align: center; margin-bottom: 25px;">✓ تم استقبال طلبك بنجاح</h2>
          
          <p style="color: #666; font-size: 16px; line-height: 1.6;">السلام عليكم ورحمة الله,</p>
          <p style="color: #666; font-size: 16px; line-height: 1.6;"><strong>${customerName}</strong> شكراً لك على طلبك الكريم. تم استقبال طلبك بنجاح وسيتم معالجته قريباً.</p>
          
          <h3 style="color: #ff6b6b; margin-top: 30px; border-bottom: 2px solid #ff6b6b; padding-bottom: 10px; font-size: 18px;">📋 تفاصيل الطلب</h3>
          <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
            <tr style="background-color: #fff3f3;">
              <td style="padding: 12px; border: 1px solid #ffcccc; font-weight: bold; color: #333; width: 40%;">رقم الطلب:</td>
              <td style="padding: 12px; border: 1px solid #ffcccc; color: #ff6b6b; font-weight: bold; font-size: 14px;">${orderId}</td>
            </tr>
            <tr style="background-color: #f9f9f9;">
              <td style="padding: 12px; border: 1px solid #e0e0e0; font-weight: bold; color: #333;">اسم العميل:</td>
              <td style="padding: 12px; border: 1px solid #e0e0e0; color: #666;">${customerName}</td>
            </tr>
            <tr style="background-color: #f9f9f9;">
              <td style="padding: 12px; border: 1px solid #e0e0e0; font-weight: bold; color: #333;">البريد الإلكتروني:</td>
              <td style="padding: 12px; border: 1px solid #e0e0e0; color: #666;">${customerEmail || "غير متوفر"}</td>
            </tr>
            <tr style="background-color: #f9f9f9;">
              <td style="padding: 12px; border: 1px solid #e0e0e0; font-weight: bold; color: #333;">رقم الهاتف:</td>
              <td style="padding: 12px; border: 1px solid #e0e0e0; color: #666;">${phoneNumber}</td>
            </tr>
          </table>

          <h3 style="color: #ff6b6b; margin-top: 25px; border-bottom: 2px solid #ff6b6b; padding-bottom: 10px; font-size: 18px;">📍 عنوان التسليم</h3>
          <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
            <tr style="background-color: #f9f9f9;">
              <td style="padding: 12px; border: 1px solid #e0e0e0; font-weight: bold; color: #333; width: 40%;">المنطقة:</td>
              <td style="padding: 12px; border: 1px solid #e0e0e0; color: #666; font-weight: 500;">${neighborhood}</td>
            </tr>
            <tr style="background-color: #f9f9f9;">
              <td style="padding: 12px; border: 1px solid #e0e0e0; font-weight: bold; color: #333; vertical-align: top;">تفاصيل العنوان:</td>
              <td style="padding: 12px; border: 1px solid #e0e0e0; color: #666; word-break: break-word;">${addressDetails}</td>
            </tr>
          </table>

          <h3 style="color: #ff6b6b; margin-top: 25px; border-bottom: 2px solid #ff6b6b; padding-bottom: 10px; font-size: 18px;">🛒 تفاصيل المنتجات</h3>
          <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
            <tr style="background-color: #fff3f3; font-weight: bold;">
              <td style="padding: 12px; border: 1px solid #ffcccc; color: #333;">المنتجات:</td>
            </tr>
            <tr style="background-color: #f9f9f9;">
              <td style="padding: 12px; border: 1px solid #e0e0e0; color: #666;">${items}</td>
            </tr>
            <tr>
              <td style="padding: 12px; border: 1px solid #e0e0e0; font-weight: bold; color: #333;">طريقة الدفع:</td>
            </tr>
            <tr style="background-color: #f9f9f9;">
              <td style="padding: 12px; border: 1px solid #e0e0e0; color: #666;">${paymentMethod === "card" ? "💳 بطاقة ائتمان" : "💰 الدفع عند الاستلام"}</td>
            </tr>
          </table>

          <div style="background-color: #fff3f3; border-left: 4px solid #ff6b6b; padding: 15px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0; color: #333; font-size: 14px; font-weight: bold;">المبلغ الإجمالي:</p>
            <p style="margin: 8px 0 0 0; color: #ff6b6b; font-size: 24px; font-weight: bold;">د.م. ${total.toFixed(2)}</p>
          </div>
          
          <p style="color: #666; font-size: 14px; line-height: 1.6; margin-top: 20px; padding: 15px; background-color: #f9f9f9; border-radius: 4px;">
            <strong>ملاحظة هامة:</strong> سيتم التواصل معك قريباً عبر الهاتف لتأكيد الطلب وموعد التسليم. تأكد من توفر هاتفك أثناء ساعات العمل.
          </p>
          
          <p style="color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 15px; text-align: center;">
            شكراً لاختيارك لنا!<br>
            <strong style="color: #ff6b6b;">فريق Bissam للمشروبات</strong><br>
            🕒 متاح للتواصل طوال ساعات العمل
          </p>
        </div>
      </div>
    `;

    // Send email to business inbox
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER || "drinkbissam@gmail.com",
      to: "drinkbissam@gmail.com",
      subject: "New Order: " + orderId + " from " + customerName,
      html: emailContent,
    });

    // Send confirmation email to customer
    if (customerEmail) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER || "drinkbissam@gmail.com",
        to: customerEmail,
        subject: "Order Confirmation: " + orderId,
        html: emailContent,
      });
      console.log("Customer confirmation email sent to:", customerEmail);
    }

    console.log("✅ Order confirmation email sent:", info.messageId);
    console.log("=====================================");
    console.log("Order ID:", orderId);
    console.log("Customer:", customerName, "(" + customerEmail + ")");
    console.log("Phone:", phoneNumber);
    console.log("Neighborhood:", neighborhood);
    console.log("Address:", addressDetails);
    console.log("Items:", items);
    console.log("Total:", "د.م.", total.toFixed(2));
    console.log("Payment Method:", paymentMethod);
    console.log("=====================================");

    res.json({
      success: true,
      message: "Order confirmation email sent to drinkbissam@gmail.com",
    } as OrderConfirmationEmailResponse);
  } catch (error) {
    console.error("Error sending order email:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send order confirmation email",
    } as OrderConfirmationEmailResponse);
  }
};
