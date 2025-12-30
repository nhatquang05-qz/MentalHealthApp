const User = require('../models/User');
const EmergencyContact = require('../models/EmergencyContact'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    
    const { username, email, password, contacts } = req.body; 

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email đã được sử dụng.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword
    });

    
    if (contacts && contacts.length > 0) {
      const contactData = contacts.map(c => ({
        userId: newUser.id,
        name: c.name,
        phone: c.phone
      }));
      await EmergencyContact.bulkCreate(contactData);
    }

    res.status(201).json({ message: 'Đăng ký thành công!', userId: newUser.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server khi đăng ký.' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    
    const user = await User.findOne({ 
      where: { email },
      include: [{ model: EmergencyContact, as: 'emergencyContacts' }] 
    });

    if (!user) {
      return res.status(404).json({ message: 'Email không tồn tại.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Mật khẩu không đúng.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Đăng nhập thành công',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        emergencyContacts: user.emergencyContacts || [] 
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server khi đăng nhập.' });
  }
};


exports.updateProfile = async (req, res) => {
  try {
    const { id, username, contacts } = req.body; 
    
    
    await User.update({ username }, { where: { id } });

    
    if (contacts) {
      await EmergencyContact.destroy({ where: { userId: id } });
      
      if (contacts.length > 0) {
        const contactData = contacts.map(c => ({
          userId: id,
          name: c.name,
          phone: c.phone
        }));
        await EmergencyContact.bulkCreate(contactData);
      }
    }

    
    const updatedUser = await User.findOne({ 
      where: { id },
      include: [{ model: EmergencyContact, as: 'emergencyContacts' }]
    });

    res.status(200).json({
      message: 'Cập nhật thành công',
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        emergencyContacts: updatedUser.emergencyContacts || []
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server khi cập nhật hồ sơ.' });
  }
};