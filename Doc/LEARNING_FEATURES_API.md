# 📚 Review Schedule & Daily Vocabulary API Guide

## 📖 Tổng quan

Hệ thống học từ vựng thông minh với 2 tính năng chính:
- **Review Schedule**: Lịch ôn tập với spaced repetition algorithm
- **Daily Vocabulary**: Học từ vựng hàng ngày với streak tracking

## 🔐 Authentication

Tất cả API đều yêu cầu JWT token trong header:
```
Authorization: Bearer <your_access_token>
```

---

# 🔄 Review Schedule APIs

## 1. Tạo lịch ôn tập

**POST** `/api/review-schedule`

Tạo lịch ôn tập cho quiz với interval tùy chỉnh.

### Request Body:
```json
{
  "quizId": "67643aa4e123456789abcdef",
  "reviewInterval": 3
}
```

### Parameters:
- `quizId` (string, required): ID của quiz cần tạo lịch ôn tập
- `reviewInterval` (number, optional): Số ngày giữa các lần ôn tập. Giá trị hợp lệ: 1, 3, 5, 7, 15, 30. Mặc định: 3

### Response (201):
```json
{
  "success": true,
  "message": "Tạo lịch ôn tập thành công",
  "metadata": {
    "_id": "67643cc4e123456789abcdef",
    "user": "67643bb4e123456789abcdef",
    "quiz": {
      "_id": "67643aa4e123456789abcdef",
      "title": "English Vocabulary - Chapter 1",
      "questions": 10
    },
    "nextReviewAt": "2025-09-17T10:00:00.000Z",
    "reviewInterval": 3,
    "reviewCount": 0,
    "isActive": true,
    "averageScore": 0
  }
}
```

### Lỗi phổ biến:
- **400**: Quiz đã có lịch ôn tập
- **404**: Quiz không tồn tại

---

## 2. Lấy quiz cần ôn tập hôm nay

**GET** `/api/review-schedule/due?limit=10`

Lấy danh sách quiz cần ôn tập trong ngày.

### Query Parameters:
- `limit` (number, optional): Số lượng quiz tối đa. Mặc định: 10

### Response (200):
```json
{
  "success": true,
  "message": "Lấy danh sách quiz cần ôn tập thành công",
  "metadata": {
    "quizzes": [
      {
        "_id": "67643cc4e123456789abcdef",
        "quiz": {
          "_id": "67643aa4e123456789abcdef",
          "title": "English Vocabulary - Chapter 1",
          "questions": 10
        },
        "nextReviewAt": "2025-09-14T09:00:00.000Z",
        "reviewInterval": 3,
        "averageScore": 75,
        "needsReview": true
      }
    ],
    "total": 1
  }
}
```

### Sử dụng:
- Gọi API này mỗi sáng để hiển thị quiz cần ôn
- `needsReview: true` nghĩa là đã đến thời gian ôn tập

---

## 3. Lấy tất cả lịch ôn tập

**GET** `/api/review-schedule/my?page=1&limit=10&active=true`

Lấy danh sách lịch ôn tập của user với phân trang.

### Query Parameters:
- `page` (number, optional): Trang hiện tại. Mặc định: 1
- `limit` (number, optional): Số item mỗi trang. Mặc định: 10
- `active` (boolean, optional): Lọc theo trạng thái active

### Response (200):
```json
{
  "success": true,
  "message": "Lấy lịch ôn tập thành công",
  "metadata": {
    "schedules": [
      {
        "_id": "67643cc4e123456789abcdef",
        "quiz": {
          "_id": "67643aa4e123456789abcdef",
          "title": "English Vocabulary - Chapter 1",
          "category": "vocabulary"
        },
        "nextReviewAt": "2025-09-17T10:00:00.000Z",
        "reviewInterval": 5,
        "reviewCount": 3,
        "averageScore": 82,
        "isActive": true
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalItems": 25,
      "itemsPerPage": 10
    }
  }
}
```

---

## 4. Cập nhật lịch ôn tập sau khi làm bài

**PATCH** `/api/review-schedule/{scheduleId}/complete`

Tự động cập nhật interval dựa trên điểm số vừa đạt được.

### URL Parameters:
- `scheduleId` (string): ID của review schedule

### Request Body:
```json
{
  "submissionId": "67643bb4e123456789abcdef"
}
```

### Spaced Repetition Logic:
- **Điểm ≥ 80%**: Tăng interval (3→5→7→15→30 ngày)
- **Điểm < 60%**: Giảm interval (30→15→7→5→3→1 ngày)
- **Điểm 60-79%**: Giữ nguyên interval

### Response (200):
```json
{
  "success": true,
  "message": "Cập nhật lịch ôn tập thành công",
  "metadata": {
    "_id": "67643cc4e123456789abcdef",
    "nextReviewAt": "2025-09-21T10:00:00.000Z",
    "reviewInterval": 7,
    "lastScore": 85,
    "averageScore": 78
  }
}
```

---

## 5. Cập nhật cài đặt lịch ôn tập

**PATCH** `/api/review-schedule/{scheduleId}`

Cập nhật interval hoặc trạng thái active thủ công.

### Request Body:
```json
{
  "reviewInterval": 7,
  "isActive": true
}
```

### Parameters:
- `reviewInterval` (number, optional): Interval mới (1-30 ngày)
- `isActive` (boolean, optional): Bật/tắt lịch ôn tập

---

## 6. Xóa lịch ôn tập

**DELETE** `/api/review-schedule/{scheduleId}`

Xóa hoàn toàn lịch ôn tập cho quiz.

### Response (200):
```json
{
  "success": true,
  "message": "Xóa lịch ôn tập thành công"
}
```

---

## 7. Thống kê ôn tập

**GET** `/api/review-schedule/statistics`

Lấy thống kê chi tiết về việc ôn tập.

### Response (200):
```json
{
  "success": true,
  "message": "Lấy thống kê ôn tập thành công",
  "metadata": {
    "statistics": {
      "totalSchedules": 25,
      "activeSchedules": 20,
      "needsReview": 3,
      "averageScore": 78.5,
      "totalReviews": 145
    },
    "recentPerformance": [
      {
        "_id": "67643cc4e123456789abcdef",
        "lastScore": 85,
        "lastReviewedAt": "2025-09-14T09:30:00.000Z",
        "quiz": {
          "title": "English Vocabulary - Chapter 1"
        }
      }
    ]
  }
}
```

### Metrics giải thích:
- `totalSchedules`: Tổng số lịch ôn tập đã tạo
- `activeSchedules`: Số lịch đang hoạt động
- `needsReview`: Số quiz cần ôn hôm nay
- `averageScore`: Điểm trung bình tất cả lần ôn
- `totalReviews`: Tổng số lần đã ôn tập

---

# 📚 Daily Vocabulary APIs

## 1. Lấy từ vựng hôm nay

**GET** `/api/vocabulary/today`

Tự động tạo hoặc lấy danh sách từ vựng cho ngày hôm nay.

### Response (200):
```json
{
  "success": true,
  "message": "Lấy từ vựng hôm nay thành công",
  "metadata": {
    "_id": "67643dd4e123456789abcdef",
    "user": "67643bb4e123456789abcdef",
    "date": "2025-09-14T00:00:00.000Z",
    "vocabularyWords": [
      {
        "word": "beautiful",
        "meaning": "đẹp",
        "pronunciation": "/ˈbjuːtɪfəl/",
        "example": "She is very beautiful.",
        "difficulty": "intermediate",
        "category": "adjective",
        "isLearned": false,
        "reviewCount": 0
      }
    ],
    "totalWords": 10,
    "completedWords": 1,
    "isCompleted": false,
    "progressPercentage": 10
  }
}
```

### Tính năng:
- Auto-generate 10 từ mỗi ngày (có thể tùy chỉnh)
- Lấy từ random từ quiz database hoặc từ điển mặc định
- Theo dõi progress theo ngày

---

## 2. Đánh dấu từ đã học

**PATCH** `/api/vocabulary/learn`

Đánh dấu một từ vựng đã học xong.

### Request Body:
```json
{
  "wordIndex": 0
}
```

### Parameters:
- `wordIndex` (number): Vị trí của từ trong mảng (bắt đầu từ 0)

### Response (200):
```json
{
  "success": true,
  "message": "Đánh dấu từ đã học thành công",
  "metadata": {
    "_id": "67643dd4e123456789abcdef",
    "completedWords": 2,
    "progressPercentage": 20,
    "isCompleted": false
  }
}
```

### Lỗi (400):
```json
{
  "success": false,
  "message": "Từ này đã được đánh dấu là đã học"
}
```

### Streak Logic:
- Khi hoàn thành hết 10 từ trong ngày → `isCompleted: true`
- Tự động cập nhật streak nếu học liên tục nhiều ngày

---

## 3. Lịch sử học từ vựng

**GET** `/api/vocabulary/history?page=1&limit=7`

Xem lịch sử học từ vựng qua các ngày.

### Query Parameters:
- `page` (number, optional): Trang hiện tại. Mặc định: 1
- `limit` (number, optional): Số ngày hiển thị. Mặc định: 7

### Response (200):
```json
{
  "success": true,
  "message": "Lấy lịch sử học từ vựng thành công",
  "metadata": {
    "history": [
      {
        "_id": "67643dd4e123456789abcdef",
        "date": "2025-09-14T00:00:00.000Z",
        "totalWords": 10,
        "completedWords": 8,
        "progressPercentage": 80,
        "isCompleted": false
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalItems": 15,
      "itemsPerPage": 7
    }
  }
}
```

### Sử dụng:
- Hiển thị calendar view với progress mỗi ngày
- Theo dõi consistency trong việc học

---

## 4. Thống kê học từ vựng

**GET** `/api/vocabulary/statistics`

Lấy thống kê tổng quan và streak hiện tại.

### Response (200):
```json
{
  "success": true,
  "message": "Lấy thống kê học từ vựng thành công",
  "metadata": {
    "statistics": {
      "totalDays": 15,
      "completedDays": 12,
      "totalWords": 150,
      "totalLearnedWords": 134,
      "averageProgress": 89.3,
      "currentStreak": 7,
      "vocabularyStreak": 7
    },
    "recentActivity": [
      {
        "_id": "67643dd4e123456789abcdef",
        "date": "2025-09-14T00:00:00.000Z",
        "totalWords": 10,
        "completedWords": 8,
        "progressPercentage": 80,
        "isCompleted": true
      }
    ]
  }
}
```

### Metrics giải thích:
- `totalDays`: Tổng số ngày đã học
- `completedDays`: Số ngày hoàn thành 100%
- `currentStreak`: Streak hiện tại (tính từ hôm nay)
- `vocabularyStreak`: Streak được lưu trong database
- `averageProgress`: Phần trăm hoàn thành trung bình

---

## 5. Lấy từ để ôn tập

**GET** `/api/vocabulary/review?limit=20`

Lấy ngẫu nhiên các từ đã học trong 7 ngày qua để ôn tập.

### Query Parameters:
- `limit` (number, optional): Số từ tối đa. Mặc định: 20

### Response (200):
```json
{
  "success": true,
  "message": "Lấy từ vựng để ôn tập thành công",
  "metadata": {
    "words": [
      {
        "word": "beautiful",
        "meaning": "đẹp",
        "pronunciation": "/ˈbjuːtɪfəl/",
        "learnedDate": "2025-09-10T00:00:00.000Z",
        "reviewCount": 2
      }
    ],
    "total": 15
  }
}
```

### Sử dụng:
- Tạo quiz ôn tập từ những từ đã học
- Reinforcement learning

---

## 6. Cập nhật preferences

**PATCH** `/api/vocabulary/preferences`

Tùy chỉnh cài đặt học từ vựng cá nhân.

### Request Body:
```json
{
  "dailyWordGoal": 15,
  "reminderTime": "09:30",
  "difficultyLevel": "intermediate"
}
```

### Parameters:
- `dailyWordGoal` (number, 5-20): Số từ học mỗi ngày
- `reminderTime` (string, HH:MM): Giờ nhắc nhở học từ
- `difficultyLevel` (enum): "beginner", "intermediate", "advanced"

### Response (200):
```json
{
  "success": true,
  "message": "Cập nhật preferences thành công",
  "metadata": {
    "preferences": {
      "dailyWordGoal": 15,
      "reminderTime": "09:30",
      "difficultyLevel": "intermediate"
    }
  }
}
```

---

## 7. Reset tiến trình

**DELETE** `/api/vocabulary/reset`

Xóa toàn bộ dữ liệu học từ vựng và reset streak về 0.

### Response (200):
```json
{
  "success": true,
  "message": "Reset tiến trình học từ vựng thành công"
}
```

### ⚠️ Cảnh báo:
- Thao tác này không thể hoàn tác
- Sẽ xóa tất cả lịch sử học từ vựng
- Reset streak về 0

---

# 🔄 Integration Flow

## Workflow học tập hoàn chỉnh:

### 1. Học từ vựng hàng ngày:
```
GET /api/vocabulary/today
→ PATCH /api/vocabulary/learn (for each word)
→ GET /api/vocabulary/statistics
```

### 2. Làm quiz và tạo lịch ôn:
```
POST /api/submissions (submit quiz)
→ Review schedule tự động tạo
→ GET /api/review-schedule/due (check tomorrow)
```

### 3. Ôn tập định kỳ:
```
GET /api/review-schedule/due
→ Do quiz again
→ PATCH /api/review-schedule/{id}/complete
```

### 4. Theo dõi tiến trình:
```
GET /api/vocabulary/statistics
GET /api/review-schedule/statistics
```

## 📱 Frontend Integration Tips

### Daily Vocabulary Widget:
```javascript
// Lấy từ vựng hôm nay
const todayWords = await fetch('/api/vocabulary/today');

// Đánh dấu từ đã học
await fetch('/api/vocabulary/learn', {
  method: 'PATCH',
  body: JSON.stringify({ wordIndex: 0 })
});

// Cập nhật progress bar
const stats = await fetch('/api/vocabulary/statistics');
```

### Review Reminder System:
```javascript
// Check quiz cần ôn mỗi sáng
const dueQuizzes = await fetch('/api/review-schedule/due');

// Hiển thị notification nếu có quiz cần ôn
if (dueQuizzes.total > 0) {
  showNotification(`Bạn có ${dueQuizzes.total} quiz cần ôn tập!`);
}
```

### Streak Display:
```javascript
// Hiển thị streak và motivate user
const stats = await fetch('/api/vocabulary/statistics');
const streak = stats.metadata.statistics.currentStreak;

if (streak >= 7) {
  showAchievement('🔥 Streak 7 ngày!');
}
```

---

## 🎯 Best Practices

### 1. Error Handling:
```javascript
try {
  const response = await fetch('/api/vocabulary/learn', { ... });
  if (!response.ok) {
    const error = await response.json();
    console.error(error.message);
  }
} catch (error) {
  console.error('Network error:', error);
}
```

### 2. Caching Strategy:
- Cache vocabulary hôm nay trong localStorage
- Refresh mỗi ngày lúc 00:00
- Cache statistics trong 1 giờ

### 3. User Experience:
- Hiển thị progress bar real-time
- Animate khi hoàn thành từ
- Show streak celebrations
- Gentle reminders cho due quizzes

### 4. Performance:
- Pagination cho history APIs
- Limit reasonable cho review words
- Debounce cho frequent API calls

---

## 🔧 Environment Variables

Cần thiết lập trong `.env`:
```env
GEMINI_API_KEY_1=your_key_1
GEMINI_API_KEY_2=your_key_2
# ... up to GEMINI_API_KEY_8

MONGODB_URI=mongodb://localhost:27017/quizrise
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
```

---

## 📞 Support

Nếu gặp vấn đề khi integrate, check:
1. JWT token có hợp lệ không
2. Request body format có đúng không  
3. API endpoint có chính xác không
4. Server có running không (port 3001)

Happy coding! 🚀