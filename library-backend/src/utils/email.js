// const nodemailer = require('nodemailer');
const config = require("../config/config");

// Create a mock transporter for development
const transporter = {
  sendMail: async (mailOptions) => {
    console.log("Email would be sent in production:");
    console.log("From:", mailOptions.from);
    console.log("To:", mailOptions.to);
    console.log("Subject:", mailOptions.subject);
    console.log("Content:", mailOptions.html.substring(0, 100) + "...");
    return { messageId: "mock-id-" + Date.now() };
  },
  verify: async () => {
    console.log("Email service mock is ready");
    return true;
  },
};

// Send welcome email
exports.sendWelcomeEmail = async (email, name) => {
  try {
    const mailOptions = {
      from: config.email.from,
      to: email,
      subject: "Welcome to the Library Management System",
      html: `
        <h1>Welcome to the Library Management System</h1>
        <p>Hello ${name},</p>
        <p>Thank you for registering with our library management system. We're excited to have you on board!</p>
        <p>With your account, you can:</p>
        <ul>
          <li>Browse our extensive collection of books</li>
          <li>Borrow books</li>
          <li>Reserve books that are currently unavailable</li>
          <li>Track your loan history</li>
        </ul>
        <p>If you have any questions, please don't hesitate to contact us.</p>
        <p>Happy reading!</p>
        <p>The Library Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${email}`);
  } catch (error) {
    console.error("Error sending welcome email:", error);
  }
};

// Send overdue notification
exports.sendOverdueNotification = async (email, name, bookTitle, dueDate) => {
  try {
    const formattedDueDate = new Date(dueDate).toLocaleDateString();

    const mailOptions = {
      from: config.email.from,
      to: email,
      subject: "Overdue Book Notification",
      html: `
        <h1>Overdue Book Notification</h1>
        <p>Hello ${name},</p>
        <p>Our records indicate that you have an overdue book:</p>
        <p><strong>${bookTitle}</strong></p>
        <p>This book was due on ${formattedDueDate}.</p>
        <p>Please return the book as soon as possible to avoid additional fines.</p>
        <p>If you have already returned this book, please disregard this message.</p>
        <p>Thank you for your cooperation.</p>
        <p>The Library Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(
      `Overdue notification sent to ${email} for book "${bookTitle}"`
    );
  } catch (error) {
    console.error("Error sending overdue notification:", error);
  }
};

// Send reservation fulfilled notification
exports.sendReservationFulfilledEmail = async (email, name, bookTitle) => {
  try {
    const mailOptions = {
      from: config.email.from,
      to: email,
      subject: "Book Reservation Available",
      html: `
        <h1>Your Reserved Book is Now Available</h1>
        <p>Hello ${name},</p>
        <p>Good news! The book you reserved is now available:</p>
        <p><strong>${bookTitle}</strong></p>
        <p>Please visit the library within the next 7 days to check out this book. After this period, your reservation will expire and the book may be made available to other users.</p>
        <p>Thank you for using our library services.</p>
        <p>The Library Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(
      `Reservation fulfilled email sent to ${email} for book "${bookTitle}"`
    );
  } catch (error) {
    console.error("Error sending reservation fulfilled email:", error);
  }
};

// Send reservation expired notification
exports.sendReservationExpiredEmail = async (email, name, bookTitle) => {
  try {
    const mailOptions = {
      from: config.email.from,
      to: email,
      subject: "Book Reservation Expired",
      html: `
        <h1>Your Book Reservation Has Expired</h1>
        <p>Hello ${name},</p>
        <p>Your reservation for the following book has expired:</p>
        <p><strong>${bookTitle}</strong></p>
        <p>If you're still interested in this book, please make a new reservation.</p>
        <p>Thank you for using our library services.</p>
        <p>The Library Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(
      `Reservation expired email sent to ${email} for book "${bookTitle}"`
    );
  } catch (error) {
    console.error("Error sending reservation expired email:", error);
  }
};

// Send loan receipt
exports.sendLoanReceiptEmail = async (email, name, bookTitle, dueDate) => {
  try {
    const formattedDueDate = new Date(dueDate).toLocaleDateString();

    const mailOptions = {
      from: config.email.from,
      to: email,
      subject: "Book Loan Receipt",
      html: `
        <h1>Book Loan Receipt</h1>
        <p>Hello ${name},</p>
        <p>You have successfully borrowed the following book:</p>
        <p><strong>${bookTitle}</strong></p>
        <p>Due date: ${formattedDueDate}</p>
        <p>Please return the book by the due date to avoid late fees.</p>
        <p>Thank you for using our library services.</p>
        <p>The Library Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Loan receipt email sent to ${email} for book "${bookTitle}"`);
  } catch (error) {
    console.error("Error sending loan receipt email:", error);
  }
};

// Send return confirmation
exports.sendReturnConfirmationEmail = async (email, name, bookTitle) => {
  try {
    const mailOptions = {
      from: config.email.from,
      to: email,
      subject: "Book Return Confirmation",
      html: `
        <h1>Book Return Confirmation</h1>
        <p>Hello ${name},</p>
        <p>We confirm that you have successfully returned the following book:</p>
        <p><strong>${bookTitle}</strong></p>
        <p>Thank you for returning the book on time.</p>
        <p>We hope you enjoyed reading it!</p>
        <p>The Library Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(
      `Return confirmation email sent to ${email} for book "${bookTitle}"`
    );
  } catch (error) {
    console.error("Error sending return confirmation email:", error);
  }
};

// Verify email service is working
exports.verifyEmailService = async () => {
  try {
    await transporter.verify();
    console.log("Email service is ready");
    return true;
  } catch (error) {
    console.error("Email service verification failed:", error);
    return false;
  }
};
