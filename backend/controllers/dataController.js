const { Mood, TestResult, Notification } = require('../models');
const { Op } = require('sequelize'); 

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
    
    
    if (testType === 'Daily Check-In') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      await TestResult.destroy({
        where: {
          userId,
          testType: 'Daily Check-In',
          createdAt: {
            [Op.gte]: today,    
            [Op.lt]: tomorrow   
          }
        }
      });
      console.log(`Đã dọn dẹp Daily Check-In cũ cho user ${userId}`);
    }

    const detailsString = Array.isArray(details) ? JSON.stringify(details) : details;

    const newTest = await TestResult.create({ 
      userId, 
      testType, 
      score, 
      result, 
      details: detailsString 
    });
 
    
    let notifTitle = 'Hoàn thành đánh giá';
    let notifMessage = '';
    let notifType = 'success';

    if (testType === 'Daily Check-In') {
      notifTitle = 'Check-in hoàn tất';
      notifMessage = 'Bạn đã checkin cảm xúc ngày hôm nay rồi. Hãy theo dõi cảm xúc của bạn trong lịch cảm xúc nhé!';
      
      notifType = 'daily_checkin'; 
    } else {
      notifTitle = 'Kết quả bài test';
      notifMessage = `Bạn vừa hoàn thành bài kiểm tra ${testType}. Kết quả: ${result}. Hãy xem chi tiết và lời khuyên nhé!`;
      
      notifType = `test_result:${newTest.id}`;
    }

    await Notification.create({
      userId,
      title: notifTitle,
      message: notifMessage,
      type: notifType
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