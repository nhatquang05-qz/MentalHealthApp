const { Mood, TestResult, Notification } = require('../models');

exports.saveMood = async (req, res) => {
  try {
    const { userId, moodLevel, note, date } = req.body;
    const newMood = await Mood.create({ userId, moodLevel, note, date });
    res.status(201).json({ message: 'Đã lưu trạng thái', data: newMood });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi khi lưu mood' });
  }
};

exports.getMoodHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const moods = await Mood.findAll({ 
        where: { userId },
        order: [['date', 'DESC']] 
    });
    res.status(200).json(moods);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi khi lấy lịch sử mood' });
  }
};

exports.saveTestResult = async (req, res) => {
  try {
    const { userId, testType, score, result, details } = req.body;
    
    const detailsString = Array.isArray(details) ? JSON.stringify(details) : details;

    const newTest = await TestResult.create({ 
      userId, 
      testType, 
      score, 
      result, 
      details: detailsString 
    });
 
    await Notification.create({
      userId,
      title: 'Hoàn thành đánh giá',
      message: `Bạn vừa hoàn thành bài kiểm tra ${testType}. Kết quả: ${result}. Hãy xem chi tiết và lời khuyên nhé!`,
      type: 'success'
    });

    res.status(201).json({ message: 'Đã lưu kết quả test và tạo thông báo', data: newTest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi khi lưu kết quả test' });
  }
};

exports.getTestHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const targetId = userId || req.query.userId;

    if (!targetId) {
       return res.status(400).json({ message: 'Thiếu userId' });
    }

    const tests = await TestResult.findAll({
        where: { userId: targetId },
        order: [['createdAt', 'DESC']]
    });
    res.status(200).json(tests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi khi lấy lịch sử test' });
  }
};