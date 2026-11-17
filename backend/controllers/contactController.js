const Contact = require("../models/Contact");

/* =========================================================
   SUBMIT CONTACT MESSAGE
========================================================= */
exports.createContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const contact = await Contact.create({
      name,
      email,
      subject,
      message
    });

    console.log("CONTACT MESSAGE SAVED:", contact);

    res.status(201).json({
      success: true,
      message: "Message stored successfully!",
      contact
    });

  } catch (error) {
    console.error("CONTACT ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
