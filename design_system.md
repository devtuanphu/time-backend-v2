HRM MVP – Authentication & User/Profile System Design

1. Phạm vi (Scope)

Tài liệu này mô tả MVP system design cho:

Authentication (login, refresh, logout)

Quản lý User (1 account = 1 người)

Quản lý Store (1 store = 1 owner)

Quản lý Profile:

Owner profile (theo store)

Employee profile (theo store)

Role theo store

Employee type theo store

Chưa bao gồm: ca làm việc, chấm công, lương, payroll.

2. Nguyên tắc thiết kế

1 Account = 1 Người

1 Store = 1 Owner

1 Account có thể sở hữu nhiều Store

1 Account có thể làm nhân viên ở nhiều Store

Role scope theo Store

Employee Type scope theo Store

TẤT CẢ bảng dùng soft delete (deleted_at)

Không hard delete dữ liệu nghiệp vụ

3. Database Schema (MVP)
   3.1 Accounts (User core + authentication)
   accounts (
   id PK,
   full_name,
   gender,
   birthday,
   email UNIQUE,
   phone UNIQUE,
   password_hash,
   address,
   status, -- active / blocked
   last_login_at,
   created_at,
   updated_at,
   deleted_at
   )

Ý nghĩa

Identity + đăng nhập

Không chứa role / store / employee info

3.2 Account Identity Documents (CCCD)
account_identity_documents (
id PK,
account_id FK -> accounts.id,
doc_type, -- 'CCCD'
front_image_url,
back_image_url,
verified_status, -- unverified / verified / rejected
created_at,
updated_at,
deleted_at
)

3.3 Account Finance (Bank + Tax)
account_finance (
account_id PK FK -> accounts.id,
bank_name,
bank_number,
tax_code,
updated_at,
deleted_at
)

3.4 Refresh Tokens (Session)
account_refresh_tokens (
id PK,
account_id FK -> accounts.id,
token_hash UNIQUE,
app_type, -- OWNER_APP / EMPLOYEE_APP
device_id,
device_name,
user_agent,
issued_at,
expires_at,
revoked_at,
created_at,
deleted_at
)

Rule

Không lưu refresh token plaintext

Token hợp lệ khi:

deleted_at IS NULL

revoked_at IS NULL

expires_at > now()

4. Store & Profile
   4.1 Stores (1 store = 1 owner)
   stores (
   id PK,
   owner_account_id FK -> accounts.id,

name,
avatar_url,

city,
ward,
address_line,

tax_code,
phone,
email,

industry,

employee_range_label, -- "1-5", "5-10"
employee_range_min,
employee_range_max,

years_active_label, -- "1-3", "3-5"
years_active_min,
years_active_max,

status, -- active / inactive
created_at,
updated_at,
deleted_at
)

4.2 Store Employee Types (Fulltime / Parttime / Học việc…)
store_employee_types (
id PK,
store_id FK -> stores.id,
code, -- FULL_TIME, PART_TIME
name, -- Fulltime, Parttime
description,
is_active,
created_at,
updated_at,
deleted_at
)

4.3 Employee Profiles (Account làm việc tại Store)
employee_profiles (
id PK,
store_id FK -> stores.id,
account_id FK -> accounts.id,
employee_code,
employment_status, -- active / on_leave / terminated
employee_type_id FK -> store_employee_types.id,
joined_at,
left_at,
note,
created_at,
updated_at,
deleted_at
)

Constraint

UNIQUE (store_id, account_id) với record chưa deleted

4.4 Store Roles (Role theo Store)
store_roles (
id PK,
store_id FK -> stores.id,
code, -- MANAGER, WAITER
name, -- Quản lý, Phục vụ
is_active,
created_at,
deleted_at
)

4.5 Employee Profile Roles (Gán role cho nhân viên)
employee_profile_roles (
employee_profile_id FK -> employee_profiles.id,
store_role_id FK -> store_roles.id,
assigned_at,
assigned_by_account_id FK -> accounts.id,
deleted_at,
PRIMARY KEY (employee_profile_id, store_role_id)
)

Rule

employee_profile.store_id == store_role.store_id
