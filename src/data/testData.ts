export interface Question {
  id: number;
  text: string;
  options: string[];
  points: number[]; 
}

export interface ResultLevel {
  min: number;
  max: number;
  level: string;
  color: string;
  description: string;
  advice: string[]; 
}

export interface TestCategory {
  title: string;
  source: string; 
  questions: Question[];
  results: ResultLevel[];
}

export const testData: Record<string, TestCategory> = {
  depression: {
    title: "Test Trầm Cảm (Dựa trên PHQ-9)",
    source: "Tham khảo thang đo PHQ-9 & CES-D",
    questions: [
      {
        id: 1,
        text: "Bạn có cảm thấy buồn bã, chán nản hoặc tuyệt vọng không?",
        options: ["Không bao giờ", "Vài ngày", "Hơn một nửa số ngày", "Gần như mọi ngày"],
        points: [0, 1, 2, 3]
      },
      {
        id: 2,
        text: "Bạn có mất hứng thú hoặc niềm vui khi làm những việc thường ngày không?",
        options: ["Không bao giờ", "Vài ngày", "Hơn một nửa số ngày", "Gần như mọi ngày"],
        points: [0, 1, 2, 3]
      },
      {
        id: 3,
        text: "Bạn cảm thấy khó ngủ, ngủ không ngon giấc, hoặc ngủ quá nhiều?",
        options: ["Không bao giờ", "Vài ngày", "Hơn một nửa số ngày", "Gần như mọi ngày"],
        points: [0, 1, 2, 3]
      },
      {
        id: 4,
        text: "Bạn cảm thấy mệt mỏi hoặc thiếu năng lượng làm việc?",
        options: ["Không bao giờ", "Vài ngày", "Hơn một nửa số ngày", "Gần như mọi ngày"],
        points: [0, 1, 2, 3]
      },
      {
        id: 5,
        text: "Bạn cảm thấy chán ăn hoặc ăn quá nhiều không kiểm soát?",
        options: ["Không bao giờ", "Vài ngày", "Hơn một nửa số ngày", "Gần như mọi ngày"],
        points: [0, 1, 2, 3]
      },
      {
        id: 6,
        text: "Bạn có cảm thấy tồi tệ về bản thân, hoặc cho rằng mình là người thất bại?",
        options: ["Không bao giờ", "Vài ngày", "Hơn một nửa số ngày", "Gần như mọi ngày"],
        points: [0, 1, 2, 3]
      },
      {
        id: 7,
        text: "Bạn gặp khó khăn khi tập trung vào việc gì đó (như đọc báo, xem tivi)?",
        options: ["Không bao giờ", "Vài ngày", "Hơn một nửa số ngày", "Gần như mọi ngày"],
        points: [0, 1, 2, 3]
      },
      {
        id: 8,
        text: "Bạn di chuyển hoặc nói năng chậm chạp đến mức người khác có thể nhận thấy?",
        options: ["Không bao giờ", "Vài ngày", "Hơn một nửa số ngày", "Gần như mọi ngày"],
        points: [0, 1, 2, 3]
      },
      {
        id: 9,
        text: "Hoặc ngược lại, bạn bồn chồn đến mức phải đi lại liên tục?",
        options: ["Không bao giờ", "Vài ngày", "Hơn một nửa số ngày", "Gần như mọi ngày"],
        points: [0, 1, 2, 3]
      },
      {
        id: 10,
        text: "Bạn có suy nghĩ rằng cuộc sống này không đáng sống không?",
        options: ["Không bao giờ", "Vài ngày", "Hơn một nửa số ngày", "Gần như mọi ngày"],
        points: [0, 1, 2, 3]
      }
    ],
    results: [
      {
        min: 0, max: 9,
        level: "Bình thường / Nhẹ",
        color: "#34C759",
        description: "Tâm trạng của bạn khá ổn định. Một chút buồn bã là phản ứng tự nhiên của cuộc sống.",
        advice: [
          "Duy trì thói quen ngủ đủ 7-8 tiếng.",
          "Tiếp tục các hoạt động xã hội và sở thích cá nhân.",
          "Thực hành lòng biết ơn mỗi ngày."
        ]
      },
      {
        min: 10, max: 19,
        level: "Trung bình",
        color: "#FFCC00",
        description: "Bạn đang có dấu hiệu trầm cảm vừa. Cảm xúc tiêu cực đang bắt đầu ảnh hưởng đến cuộc sống.",
        advice: [
          "Liệu pháp Kích hoạt Hành vi (Behavioral Activation): Hãy ép bản thân làm 1 việc nhỏ mỗi ngày dù không muốn.",
          "Vận động nhẹ: Đi bộ 15-30 phút để kích thích endorphin.",
          "Chia sẻ cảm xúc với một người bạn tin cậy."
        ]
      },
      {
        min: 20, max: 30,
        level: "Cao / Nghiêm trọng",
        color: "#FF3B30",
        description: "Mức độ trầm cảm đáng lo ngại. Bạn nên tìm kiếm sự hỗ trợ chuyên môn ngay.",
        advice: [
          "Tìm kiếm sự giúp đỡ từ bác sĩ tâm lý hoặc chuyên gia tham vấn.",
          "Tránh cô lập bản thân, hãy ở cạnh người thân.",
          "Nếu có suy nghĩ làm hại bản thân, hãy gọi hotline hỗ trợ khẩn cấp ngay lập tức."
        ]
      }
    ]
  },
  anxiety: {
    title: "Test Lo Âu (Dựa trên GAD-7)",
    source: "Tham khảo thang đo GAD-7 & Beck Anxiety Inventory",
    questions: [
      {
        id: 1,
        text: "Bạn có cảm thấy lo lắng, bồn chồn hoặc căng thẳng không?",
        options: ["Không bao giờ", "Vài ngày", "Hơn một nửa số ngày", "Gần như mọi ngày"],
        points: [0, 1, 2, 3]
      },
      {
        id: 2,
        text: "Bạn có thấy mình không thể ngừng hoặc kiểm soát sự lo lắng?",
        options: ["Không bao giờ", "Vài ngày", "Hơn một nửa số ngày", "Gần như mọi ngày"],
        points: [0, 1, 2, 3]
      },
      {
        id: 3,
        text: "Bạn hay lo lắng quá mức về nhiều việc khác nhau?",
        options: ["Không bao giờ", "Vài ngày", "Hơn một nửa số ngày", "Gần như mọi ngày"],
        points: [0, 1, 2, 3]
      },
      {
        id: 4,
        text: "Bạn có cảm thấy khó thư giãn, cơ thể luôn trong trạng thái 'gồng'?",
        options: ["Không bao giờ", "Vài ngày", "Hơn một nửa số ngày", "Gần như mọi ngày"],
        points: [0, 1, 2, 3]
      },
      {
        id: 5,
        text: "Bạn cảm thấy bồn chồn đến mức không thể ngồi yên?",
        options: ["Không bao giờ", "Vài ngày", "Hơn một nửa số ngày", "Gần như mọi ngày"],
        points: [0, 1, 2, 3]
      },
      {
        id: 6,
        text: "Bạn trở nên dễ cáu gắt hoặc khó chịu hơn bình thường?",
        options: ["Không bao giờ", "Vài ngày", "Hơn một nửa số ngày", "Gần như mọi ngày"],
        points: [0, 1, 2, 3]
      },
      {
        id: 7,
        text: "Bạn cảm thấy sợ hãi như thể có điều gì đó khủng khiếp sắp xảy ra?",
        options: ["Không bao giờ", "Vài ngày", "Hơn một nửa số ngày", "Gần như mọi ngày"],
        points: [0, 1, 2, 3]
      },
      {
        id: 8,
        text: "Bạn có cảm thấy tim đập nhanh, hồi hộp dù không vận động mạnh?",
        options: ["Không bao giờ", "Vài ngày", "Hơn một nửa số ngày", "Gần như mọi ngày"],
        points: [0, 1, 2, 3]
      },
      {
        id: 9,
        text: "Bạn có bị lạnh tay chân, hoặc đổ mồ hôi trộm khi lo lắng?",
        options: ["Không bao giờ", "Vài ngày", "Hơn một nửa số ngày", "Gần như mọi ngày"],
        points: [0, 1, 2, 3]
      },
      {
        id: 10,
        text: "Bạn có cảm thấy khó thở hoặc cảm giác nghẹn ở cổ họng?",
        options: ["Không bao giờ", "Vài ngày", "Hơn một nửa số ngày", "Gần như mọi ngày"],
        points: [0, 1, 2, 3]
      }
    ],
    results: [
      {
        min: 0, max: 9,
        level: "Lo âu thấp",
        color: "#34C759",
        description: "Mức độ lo âu của bạn trong giới hạn bình thường.",
        advice: [
          "Thực hành chánh niệm (Mindfulness) để duy trì sự bình tĩnh.",
          "Hạn chế caffeine (cà phê, trà đậm) vì nó có thể gây hồi hộp."
        ]
      },
      {
        min: 10, max: 19,
        level: "Lo âu trung bình",
        color: "#FFCC00",
        description: "Bạn có dấu hiệu rối loạn lo âu. Các triệu chứng cơ thể bắt đầu xuất hiện.",
        advice: [
          "Kỹ thuật 'Grounding 5-4-3-2-1': Tìm 5 thứ bạn thấy, 4 thứ chạm được, 3 thứ nghe được...",
          "Bài tập thở 4-7-8: Hít vào 4s, giữ 7s, thở ra 8s để làm dịu hệ thần kinh.",
          "Giới hạn thời gian 'được phép lo lắng' (Worry time) chỉ 15 phút mỗi ngày."
        ]
      },
      {
        min: 20, max: 30,
        level: "Lo âu cao",
        color: "#FF3B30",
        description: "Mức độ lo âu nghiêm trọng, ảnh hưởng lớn đến sức khỏe thể chất.",
        advice: [
          "Thăm khám bác sĩ để kiểm tra các triệu chứng tim mạch/hô hấp (loại trừ nguyên nhân bệnh lý).",
          "Liệu pháp Nhận thức Hành vi (CBT) là phương pháp hiệu quả nhất.",
          "Cân nhắc tham gia các lớp Yoga hoặc Thiền chuyên sâu."
        ]
      }
    ]
  },
  stress: {
    title: "Test Căng Thẳng (Dựa trên PSS-10)",
    source: "Tham khảo thang đo PSS-10 (Perceived Stress Scale)",
    questions: [
      {
        id: 1,
        text: "Bạn cảm thấy buồn bực vì những sự việc xảy ra bất ngờ?",
        options: ["Không bao giờ", "Thỉnh thoảng", "Thường xuyên", "Luôn luôn"],
        points: [0, 1, 2, 3]
      },
      {
        id: 2,
        text: "Bạn cảm thấy mình không thể kiểm soát những việc quan trọng trong cuộc sống?",
        options: ["Không bao giờ", "Thỉnh thoảng", "Thường xuyên", "Luôn luôn"],
        points: [0, 1, 2, 3]
      },
      {
        id: 3,
        text: "Bạn cảm thấy căng thẳng, bồn chồn và áp lực?",
        options: ["Không bao giờ", "Thỉnh thoảng", "Thường xuyên", "Luôn luôn"],
        points: [0, 1, 2, 3]
      },
      {
        id: 4,
        text: "Bạn cảm thấy *thiếu* tự tin vào khả năng xử lý các vấn đề cá nhân?",
        options: ["Không bao giờ", "Thỉnh thoảng", "Thường xuyên", "Luôn luôn"],
        points: [0, 1, 2, 3]
      },
      {
        id: 5,
        text: "Bạn cảm thấy mọi việc *không* đi theo đúng ý muốn của mình?",
        options: ["Không bao giờ", "Thỉnh thoảng", "Thường xuyên", "Luôn luôn"],
        points: [0, 1, 2, 3] 
      },
      {
        id: 6,
        text: "Bạn thấy rằng mình không thể hoàn thành hết những việc phải làm?",
        options: ["Không bao giờ", "Thỉnh thoảng", "Thường xuyên", "Luôn luôn"],
        points: [0, 1, 2, 3]
      },
      {
        id: 7,
        text: "Bạn có cảm thấy mình *không* kiểm soát được sự tức giận trong cuộc sống?",
        options: ["Không bao giờ", "Thỉnh thoảng", "Thường xuyên", "Luôn luôn"],
        points: [0, 1, 2, 3] 
      },
      {
        id: 8,
        text: "Bạn cảm thấy mình đang gánh vác quá nhiều trách nhiệm?",
        options: ["Không bao giờ", "Thỉnh thoảng", "Thường xuyên", "Luôn luôn"],
        points: [0, 1, 2, 3]
      },
      {
        id: 9,
        text: "Bạn hay quên hoặc khó tập trung do suy nghĩ quá nhiều?",
        options: ["Không bao giờ", "Thỉnh thoảng", "Thường xuyên", "Luôn luôn"],
        points: [0, 1, 2, 3]
      },
      {
        id: 10,
        text: "Bạn cảm thấy đau mỏi cơ thể (đau vai gáy, đau đầu) do căng thẳng?",
        options: ["Không bao giờ", "Thỉnh thoảng", "Thường xuyên", "Luôn luôn"],
        points: [0, 1, 2, 3]
      }
    ],
    results: [
      {
        min: 0, max: 12,
        level: "Căng thẳng thấp",
        color: "#34C759",
        description: "Bạn đang kiểm soát cuộc sống rất tốt.",
        advice: [
          "Tiếp tục duy trì sự cân bằng giữa công việc và nghỉ ngơi.",
          "Dành thời gian cho các sở thích cá nhân."
        ]
      },
      {
        min: 13, max: 20,
        level: "Căng thẳng trung bình",
        color: "#FFCC00",
        description: "Bạn đang chịu áp lực khá lớn. Cần có biện pháp can thiệp sớm.",
        advice: [
          "Phương pháp 'Ma trận Eisenhower': Phân loại công việc (Quan trọng/Khẩn cấp) để giảm tải.",
          "Kỹ thuật Pomodoro: Làm việc 25 phút, nghỉ 5 phút để não bộ không bị quá tải.",
          "Viết nhật ký (Journaling) để giải tỏa suy nghĩ ra khỏi đầu."
        ]
      },
      {
        min: 21, max: 30,
        level: "Căng thẳng cao",
        color: "#FF3B30",
        description: "Mức độ quá tải (Burnout). Bạn có nguy cơ kiệt sức.",
        advice: [
          "Thư giãn cơ bắp tiến triển (PMR): Căng và thả lỏng từng nhóm cơ để giảm đau mỏi vật lý.",
          "Digital Detox: Ngắt kết nối thiết bị điện tử ít nhất 1 giờ trước khi ngủ.",
          "Xin nghỉ phép ngắn hạn để 'sạc' lại năng lượng."
        ]
      }
    ]
  }
};