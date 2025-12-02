export interface Question {
  id: number;
  text: string;
  options: string[];
  points: number[]; 
}

export interface MedicalContact {
  name: string;
  address: string;
  phone: string;
}

export interface ResultLevel {
  min: number;
  max: number;
  level: string;
  color: string;
  description: string;
  advice: string[];
  details: string; // Lời khuyên chi tiết
  medicalContacts?: MedicalContact[]; // Danh sách liên hệ (chỉ hiện khi nặng)
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
        description: "Tâm trạng của bạn khá ổn định. Một chút buồn bã là phản ứng tự nhiên.",
        advice: [
          "Duy trì thói quen ngủ đủ 7-8 tiếng.",
          "Tiếp tục các hoạt động xã hội và sở thích cá nhân.",
          "Thực hành lòng biết ơn mỗi ngày."
        ],
        details: "Bạn đang làm rất tốt việc quản lý cảm xúc của mình. Những cảm giác buồn thoáng qua là hoàn toàn bình thường. Hãy tiếp tục duy trì lối sống lành mạnh, tập thể dục đều đặn và kết nối với mọi người xung quanh để giữ vững tinh thần tích cực này."
      },
      {
        min: 10, max: 19,
        level: "Trung bình",
        color: "#FFCC00",
        description: "Dấu hiệu trầm cảm vừa. Cảm xúc tiêu cực bắt đầu ảnh hưởng cuộc sống.",
        advice: [
          "Liệu pháp Kích hoạt Hành vi: Ép bản thân làm 1 việc nhỏ mỗi ngày.",
          "Vận động nhẹ: Đi bộ 15-30 phút để kích thích endorphin.",
          "Chia sẻ cảm xúc với một người bạn tin cậy."
        ],
        details: "Mức độ này cho thấy bạn đang gặp khó khăn trong việc tìm kiếm niềm vui. \n\nLời khuyên chuyên sâu:\n1. Thiết lập lại nhịp sinh học: Cố gắng thức dậy và đi ngủ vào một giờ cố định.\n2. 'Kỹ thuật 5 phút': Nếu không muốn làm gì, hãy tự nhủ chỉ làm trong 5 phút thôi. Thường thì sau 5 phút, bạn sẽ có đà để làm tiếp.\n3. Hạn chế mạng xã hội: Việc so sánh bản thân với người khác trên mạng có thể làm tình trạng tệ hơn."
      },
      {
        min: 20, max: 30,
        level: "Cao / Nghiêm trọng",
        color: "#FF3B30",
        description: "Mức độ đáng báo động. Cần tìm kiếm sự hỗ trợ chuyên môn y tế.",
        advice: [
          "Tìm kiếm sự giúp đỡ từ bác sĩ tâm lý ngay lập tức.",
          "Tránh cô lập bản thân, hãy ở cạnh người thân.",
          "Gọi hotline hỗ trợ khẩn cấp nếu có suy nghĩ tiêu cực."
        ],
        details: "Kết quả cho thấy bạn đang chịu đựng nỗi đau tinh thần rất lớn. Đây không phải là lỗi của bạn, và bạn không phải chiến đấu một mình. Tình trạng này CẦN được điều trị y khoa kết hợp tâm lý trị liệu.\n\nHãy đến ngay các cơ sở y tế uy tín dưới đây để được đánh giá và hỗ trợ:",
        medicalContacts: [
          {
            name: "Viện Sức khỏe Tâm thần - BV Bạch Mai (Hà Nội)",
            address: "78 Giải Phóng, Phương Mai, Đống Đa, Hà Nội",
            phone: "02435765344"
          },
          {
            name: "Bệnh viện Tâm thần Ban ngày Mai Hương (Hà Nội)",
            address: "4 Hồng Mai, Bạch Mai, Hai Bà Trưng, Hà Nội",
            phone: "02436275762"
          },
          {
            name: "Bệnh viện Tâm thần TP.HCM (Sài Gòn)",
            address: "766 Võ Văn Kiệt, Phường 1, Quận 5, TP.HCM",
            phone: "0289234675"
          },
          {
            name: "Khoa Tâm lý - BV Đại học Y Dược TP.HCM",
            address: "215 Hồng Bàng, Phường 11, Quận 5, TP.HCM",
            phone: "02838554269"
          }
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
        ],
        details: "Bạn kiểm soát lo âu khá tốt. Để duy trì, hãy thử tập thiền định 10 phút mỗi ngày. Hãy nhớ rằng lo âu là phản ứng tự nhiên giúp ta cảnh giác, miễn là nó không cản trở cuộc sống hàng ngày của bạn."
      },
      {
        min: 10, max: 19,
        level: "Lo âu trung bình",
        color: "#FFCC00",
        description: "Dấu hiệu rối loạn lo âu. Triệu chứng cơ thể bắt đầu xuất hiện.",
        advice: [
          "Kỹ thuật 'Grounding 5-4-3-2-1': 5 thứ thấy, 4 thứ chạm, 3 thứ nghe...",
          "Bài tập thở 4-7-8: Hít 4s, giữ 7s, thở 8s để làm dịu thần kinh.",
          "Worry Time: Chỉ cho phép lo lắng trong 15 phút cố định mỗi ngày."
        ],
        details: "Hệ thần kinh của bạn đang ở trạng thái 'chiến đấu hoặc bỏ chạy' quá thường xuyên.\n\nChiến lược chi tiết:\n1. Cắt giảm Caffeine và Đường: Chúng là chất kích thích làm tăng nhịp tim.\n2. Viết nhật ký lo âu: Khi lo lắng, hãy viết nó ra giấy thay vì để nó chạy trong đầu.\n3. Tập thể dục cường độ vừa phải: Giúp đốt cháy hormone căng thẳng cortisol tích tụ."
      },
      {
        min: 20, max: 30,
        level: "Lo âu cao",
        color: "#FF3B30",
        description: "Lo âu nghiêm trọng, ảnh hưởng lớn đến sức khỏe thể chất.",
        advice: [
          "Thăm khám bác sĩ để loại trừ nguyên nhân bệnh lý tim mạch/hô hấp.",
          "Liệu pháp Nhận thức Hành vi (CBT) là phương pháp hiệu quả nhất.",
          "Cân nhắc tham gia các lớp Yoga hoặc Thiền chuyên sâu."
        ],
        details: "Mức độ lo âu này có thể gây ra các cơn hoảng loạn (Panic Attack) và suy nhược cơ thể. Bạn cần sự can thiệp của chuyên gia để học cách kiểm soát và dùng thuốc nếu cần thiết. Đừng chịu đựng một mình.\n\nĐịa chỉ hỗ trợ chuyên sâu:",
        medicalContacts: [
          {
            name: "Phòng khám Tâm thần kinh - BV Đại học Y Hà Nội",
            address: "Số 1 Tôn Thất Tùng, Đống Đa, Hà Nội",
            phone: "19006422"
          },
          {
            name: "Viện Tâm lý Việt - Pháp",
            address: "46 Trần Quốc Vượng, Cầu Giấy, Hà Nội",
            phone: "0977729396"
          },
          {
            name: "Khoa Tâm thần - Bệnh viện Nguyễn Tri Phương",
            address: "468 Nguyễn Trãi, Phường 8, Quận 5, TP.HCM",
            phone: "02839234332"
          }
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
        ],
        details: "Bạn có kỹ năng quản lý thời gian và cảm xúc tuyệt vời. Hãy chia sẻ bí quyết của bạn với người khác nếu có thể! Để tối ưu hơn, hãy thử học thêm một kỹ năng mới hoặc môn thể thao mới để não bộ luôn được kích thích tích cực."
      },
      {
        min: 13, max: 20,
        level: "Căng thẳng trung bình",
        color: "#FFCC00",
        description: "Bạn đang chịu áp lực khá lớn. Cần có biện pháp can thiệp sớm.",
        advice: [
          "Ma trận Eisenhower: Phân loại công việc (Quan trọng/Khẩn cấp).",
          "Kỹ thuật Pomodoro: Làm 25p, nghỉ 5p để não không quá tải.",
          "Viết nhật ký (Journaling) để giải tỏa suy nghĩ."
        ],
        details: "Bạn đang ở ranh giới giữa kiểm soát được và mất kiểm soát. \n\nLời khuyên cụ thể:\n1. Học cách nói 'KHÔNG': Đừng nhận thêm trách nhiệm nếu bạn đã quá tải.\n2. Giấc ngủ ngắn (Power Nap): 15-20 phút ngủ trưa có thể phục hồi sự tỉnh táo đáng kể.\n3. Digital Detox: Tắt thông báo điện thoại sau giờ làm việc để não bộ thực sự được nghỉ ngơi."
      },
      {
        min: 21, max: 30,
        level: "Căng thẳng cao",
        color: "#FF3B30",
        description: "Mức độ quá tải (Burnout). Bạn có nguy cơ kiệt sức.",
        advice: [
          "Thư giãn cơ bắp (PMR): Căng và thả lỏng từng nhóm cơ.",
          "Ngắt kết nối thiết bị điện tử ít nhất 1 giờ trước khi ngủ.",
          "Xin nghỉ phép ngắn hạn để 'sạc' lại năng lượng."
        ],
        details: "Bạn đang trong trạng thái 'Burnout' (Kiệt sức). Nếu kéo dài, nó sẽ dẫn đến trầm cảm và các bệnh lý tim mạch. Bạn cần 'ngắt cầu dao' ngay lập tức.\n\nKhuyến nghị:\n- Hãy xin nghỉ phép ít nhất 2-3 ngày hoàn toàn không công việc.\n- Nếu công việc hiện tại quá độc hại, hãy cân nhắc tư vấn hướng nghiệp.\n- Tham vấn tâm lý để tìm lại cân bằng:",
        medicalContacts: [
          {
            name: "Trung tâm Tham vấn Tâm lý Hoàng Gia",
            address: "Hà Nội & TP.HCM (Hỗ trợ Online)",
            phone: "0989199584"
          },
          {
            name: "SunnyCare - Viện Tâm Lý",
            address: "LP 03-10 Tòa nhà Landmark Plus, 208 Nguyễn Hữu Cảnh, P22, Bình Thạnh, TP.HCM",
            phone: "19006295"
          }
        ]
      }
    ]
  }
};