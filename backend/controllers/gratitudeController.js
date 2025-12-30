const { Gratitude } = require('../models');


exports.createGratitude = async (req, res) => {
  try {
    const { userId, content } = req.body;
    
    
    const imageUrl = req.file ? req.file.path : null;

    if (!userId) {
      return res.status(400).json({ message: 'Thiếu User ID' });
    }

    const newEntry = await Gratitude.create({
      userId,
      content,
      imageUrl
    });

    res.status(201).json({ message: 'Đã lưu nhật ký biết ơn', data: newEntry });
  } catch (error) {
    console.error('Lỗi khi lưu nhật ký:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};


exports.getGratitudeByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const list = await Gratitude.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json(list);
  } catch (error) {
    console.error('Lỗi lấy danh sách:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};


exports.deleteGratitude = async (req, res) => {
    try {
      const { id } = req.params;
      await Gratitude.destroy({ where: { id } });
      res.status(200).json({ message: 'Đã xóa thành công' });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi xóa' });
    }
  };