const Contact = require('../models/Contact');

exports.submitContact = async (req, res) => {
  try {
    const { name, email, message, userId } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin.' });
    }

    const newContact = await Contact.create({
      name,
      email,
      message,
      userId: userId || null
    });

    res.status(201).json({ message: 'Gửi liên hệ thành công!', contactId: newContact.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server khi gửi liên hệ.' });
  }
};