#!/bin/bash
# ============================================================
#  TEST FACE REGISTRATION — chạy trực tiếp trên server VPS
#  Copy toàn bộ file này lên server rồi chạy: bash test-face-registration.sh
# ============================================================

set -e

# ─── CONFIG ─── Thay đổi cho phù hợp
API_BASE="http://localhost:3000/api"   # Gọi nội bộ, bypass nginx
TEST_EMAIL="testface_$(date +%s)@test.com"
TEST_PHONE="09$(shuf -i 10000000-99999999 -n 1)"
TEST_PASSWORD="Test@12345"
TEST_NAME="Test FaceReg $(date +%H%M%S)"

echo "============================================"
echo "  🧪 TEST FACE REGISTRATION ENDPOINT"
echo "============================================"
echo ""
echo "📧 Email:    $TEST_EMAIL"
echo "📱 Phone:    $TEST_PHONE"
echo "🔑 Password: $TEST_PASSWORD"
echo ""

# ─── STEP 1: Đăng ký tài khoản owner ───
echo "━━━ STEP 1: Đăng ký tài khoản Owner ━━━"
REGISTER_RESULT=$(curl -s -X POST "$API_BASE/auth/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"fullName\": \"$TEST_NAME\",
    \"email\": \"$TEST_EMAIL\",
    \"phone\": \"$TEST_PHONE\",
    \"password\": \"$TEST_PASSWORD\",
    \"gender\": \"male\",
    \"birthday\": \"1995-01-15\"
  }")
echo "Response: $REGISTER_RESULT"
echo ""

# ─── STEP 2: Đăng nhập (bỏ qua OTP verify — dev mode) ───
echo "━━━ STEP 2: Đăng nhập lấy JWT Token ━━━"
LOGIN_RESULT=$(curl -s -X POST "$API_BASE/auth/login" \
  -H "Content-Type: application/json" \
  -d "{
    \"emailOrPhone\": \"$TEST_PHONE\",
    \"password\": \"$TEST_PASSWORD\",
    \"appType\": \"OWNER_APP\"
  }")
echo "Response (truncated): $(echo $LOGIN_RESULT | head -c 500)"
echo ""

# Trích JWT token
TOKEN=$(echo "$LOGIN_RESULT" | grep -o '"accessToken":"[^"]*"' | head -1 | cut -d'"' -f4)
if [ -z "$TOKEN" ]; then
  # Thử format khác
  TOKEN=$(echo "$LOGIN_RESULT" | grep -o '"access_token":"[^"]*"' | head -1 | cut -d'"' -f4)
fi

if [ -z "$TOKEN" ]; then
  echo "❌ Không lấy được JWT token. Có thể tài khoản chưa verify OTP."
  echo ""
  echo "=== THỬ ĐĂNG NHẬP VỚI TÀI KHOẢN CÓ SẴN ==="
  echo "Nhập emailOrPhone của tài khoản đã có (hoặc Ctrl+C để thoát):"
  read -p "emailOrPhone: " EXISTING_LOGIN
  read -p "password: " EXISTING_PASS
  
  LOGIN_RESULT=$(curl -s -X POST "$API_BASE/auth/login" \
    -H "Content-Type: application/json" \
    -d "{
      \"emailOrPhone\": \"$EXISTING_LOGIN\",
      \"password\": \"$EXISTING_PASS\",
      \"appType\": \"OWNER_APP\"
    }")
  echo "Response: $(echo $LOGIN_RESULT | head -c 500)"
  
  TOKEN=$(echo "$LOGIN_RESULT" | grep -o '"accessToken":"[^"]*"' | head -1 | cut -d'"' -f4)
  if [ -z "$TOKEN" ]; then
    TOKEN=$(echo "$LOGIN_RESULT" | grep -o '"access_token":"[^"]*"' | head -1 | cut -d'"' -f4)
  fi
  
  if [ -z "$TOKEN" ]; then
    echo "❌ Vẫn không có token. Dừng test."
    exit 1
  fi
fi

echo "✅ Token: ${TOKEN:0:50}..."
echo ""

# ─── STEP 3: Tạo store ───
echo "━━━ STEP 3: Tạo cửa hàng test ━━━"
STORE_RESULT=$(curl -s -X POST "$API_BASE/stores" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Test Store FaceReg\",
    \"phone\": \"$TEST_PHONE\",
    \"address\": \"123 Test Street\"
  }")
echo "Response: $(echo $STORE_RESULT | head -c 500)"
echo ""

STORE_ID=$(echo "$STORE_RESULT" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
if [ -z "$STORE_ID" ]; then
  echo "⚠️  Không tạo được store mới. Thử lấy store đã có..."
  STORES_LIST=$(curl -s -X GET "$API_BASE/stores" \
    -H "Authorization: Bearer $TOKEN")
  STORE_ID=$(echo "$STORES_LIST" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
  echo "Store ID từ list: $STORE_ID"
fi

echo "✅ Store ID: $STORE_ID"
echo ""

# ─── STEP 4: Tạo nhân viên ───
echo "━━━ STEP 4: Tạo nhân viên test ━━━"
EMP_EMAIL="emp_$(date +%s)@test.com"
EMP_PHONE="08$(shuf -i 10000000-99999999 -n 1)"

EMPLOYEE_RESULT=$(curl -s -X POST "$API_BASE/stores/employees/manual" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"storeId\": \"$STORE_ID\",
    \"fullName\": \"Nhân viên Test Face\",
    \"phone\": \"$EMP_PHONE\",
    \"email\": \"$EMP_EMAIL\",
    \"birthday\": \"2000-05-20\",
    \"gender\": \"male\"
  }")
echo "Response: $(echo $EMPLOYEE_RESULT | head -c 500)"
echo ""

EMPLOYEE_ID=$(echo "$EMPLOYEE_RESULT" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
if [ -z "$EMPLOYEE_ID" ]; then
  echo "⚠️  Không tạo được nhân viên. Thử lấy từ store..."
  EMP_LIST=$(curl -s -X GET "$API_BASE/stores/$STORE_ID/employees" \
    -H "Authorization: Bearer $TOKEN")
  EMPLOYEE_ID=$(echo "$EMP_LIST" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
  echo "Employee ID từ list: $EMPLOYEE_ID"
fi

echo "✅ Employee ID: $EMPLOYEE_ID"
echo ""

# ─── STEP 5: Tạo ảnh test giả lập khuôn mặt ───
echo "━━━ STEP 5: Tạo ảnh test ━━━"

# Thử dùng ImageMagick nếu có, nếu không thì tải ảnh mẫu
if command -v convert &> /dev/null; then
  convert -size 640x480 xc:white \
    -fill gray -draw "circle 320,200 320,300" \
    -fill black -draw "circle 290,180 290,190" \
    -fill black -draw "circle 350,180 350,190" \
    /tmp/face_front.jpg
  cp /tmp/face_front.jpg /tmp/face_left.jpg
  cp /tmp/face_front.jpg /tmp/face_right.jpg
  echo "✅ Tạo ảnh test bằng ImageMagick"
else
  # Tải ảnh mẫu từ internet
  curl -s -o /tmp/face_front.jpg "https://picsum.photos/640/480" || echo "placeholder" > /tmp/face_front.jpg
  cp /tmp/face_front.jpg /tmp/face_left.jpg
  cp /tmp/face_front.jpg /tmp/face_right.jpg
  echo "✅ Tạo ảnh test (placeholder)"
fi

ls -la /tmp/face_*.jpg
echo ""

# ─── STEP 6: GỌI FACE REGISTRATION API ───
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  🎯 STEP 6: TEST FACE REGISTRATION API"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "URL: $API_BASE/stores/employees/$EMPLOYEE_ID/face-registration"
echo "Store ID: $STORE_ID"
echo ""

FACE_RESULT=$(curl -v -X POST \
  "$API_BASE/stores/employees/$EMPLOYEE_ID/face-registration" \
  -H "Authorization: Bearer $TOKEN" \
  -F "storeId=$STORE_ID" \
  -F "photos=@/tmp/face_front.jpg" \
  -F "photos=@/tmp/face_left.jpg" \
  -F "photos=@/tmp/face_right.jpg" \
  2>&1)

echo ""
echo "━━━ FULL RESPONSE (curl -v) ━━━"
echo "$FACE_RESULT"
echo ""

# Phân tích kết quả
HTTP_CODE=$(echo "$FACE_RESULT" | grep "< HTTP/" | tail -1 | awk '{print $3}')
echo ""
echo "============================================"
echo "  📊 KẾT QUẢ"
echo "============================================"
echo "HTTP Status: $HTTP_CODE"

if echo "$FACE_RESULT" | grep -q "faceDescriptors"; then
  echo "✅ FACE REGISTRATION THÀNH CÔNG!"
elif echo "$FACE_RESULT" | grep -q "faces detected"; then
  echo "⚠️  Backend nhận request nhưng không detect được face (ảnh test không có mặt thật)"
  echo "   → Backend hoạt động đúng! Lỗi trên app là do vấn đề khác."
elif echo "$FACE_RESULT" | grep -q "401\|Unauthorized"; then
  echo "❌ LỖI 401 — Token không hợp lệ hoặc hết hạn"
elif echo "$FACE_RESULT" | grep -q "500\|Internal Server Error"; then
  echo "❌ LỖI 500 — Backend crash khi xử lý"
elif echo "$FACE_RESULT" | grep -q "413\|Entity Too Large"; then
  echo "❌ LỖI 413 — File quá lớn"
elif echo "$FACE_RESULT" | grep -q "404\|Not Found"; then
  echo "❌ LỖI 404 — Route không tồn tại"
else
  echo "❓ Kết quả không xác định, đọc response ở trên"
fi

echo ""
echo "━━━ KIỂM TRA PM2 LOGS NGAY SAU KHI CHẠY ━━━"
echo "Chạy: pm2 logs time-backend-v2 --lines 20"
echo ""

# Cleanup
rm -f /tmp/face_front.jpg /tmp/face_left.jpg /tmp/face_right.jpg
