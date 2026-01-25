import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

// 1. Lịch làm việc
export class SchedulePermissionDto {
  @ApiPropertyOptional() @IsOptional() @IsBoolean() viewPersonalOnly?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() requestOffAndChange?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() viewGeneralSchedule?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() manageSchedule?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() approveRequests?: boolean;
}

// 2. Chấm công & giờ giấc
export class TimekeepingPermissionDto {
  @ApiPropertyOptional() @IsOptional() @IsBoolean() editTimeSheet?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() viewPersonalTimeSheet?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() sendDispute?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() viewOtherTimeSheet?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() approveTimeSheet?: boolean;
}

// 3. Nhân sự & công việc
export class HRPermissionDto {
  @ApiPropertyOptional() @IsOptional() @IsBoolean() viewPersonalWorkAndKpi?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() viewShiftStaffList?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() viewAllStaff?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() assignWorkInShift?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() assignShiftLeader?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() assignSupervisor?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() createRecruitment?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() approveCandidate?: boolean;
}

// 4. Tài sản, kho & vật dụng
export class AssetPermissionDto {
  @ApiPropertyOptional() @IsOptional() @IsBoolean() viewAssetAndWarehouse?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() manageAssetAndWarehouse?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() proposeSupplies?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() manageSupplies?: boolean;
}

// 5. Lương & thưởng phạt
export class SalaryPermissionDto {
  @ApiPropertyOptional() @IsOptional() @IsBoolean() viewPersonalSalaryAndBonus?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() proposeSalaryEdit?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() approveSubordinateSalary?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() manageStaffPayroll?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() assignPayrollAccess?: boolean;
}

// 6. Nội dung & Groups nội bộ
export class ContentPermissionDto {
  @ApiPropertyOptional() @IsOptional() @IsBoolean() createPost?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() commentInGroups?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() approveContent?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() tagAndWarnViolation?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() reportContent?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() manageMembers?: boolean;
}

// 7. Báo cáo & thống kê
export class ReportPermissionDto {
  @ApiPropertyOptional() @IsOptional() @IsBoolean() viewPersonalShiftReport?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() submitImprovementProposal?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() viewStaffPerformanceReport?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() viewStaffSalaryReport?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() viewViolationAnalysis?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() viewSummaryStaffReport?: boolean;
}

// 8. Truy cập & phân quyền
export class SystemPermissionDto {
  @ApiPropertyOptional() @IsOptional() @IsBoolean() editStaffPermission?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() evaluateStaffCapacity?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() editShiftLeaderPermission?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() editSupervisorPermission?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() editManagerPermission?: boolean;
}

// 9. Thông báo nhân viên
export class EmployeeNotificationDto {
  @ApiPropertyOptional() @IsOptional() @IsBoolean() remindAttendance?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsNumber() remindAttendanceMinutes?: number;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() allowLate?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsNumber() allowLateMinutes?: number;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() notifyAbnormalAbsence?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() notifyAttendanceIssue?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() notifySystemError?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() notifyRequestApproved?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() notifyNewInfoFromSuperior?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() notifyAbnormalOrders?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() notifyLowKpi?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsNumber() notifyLowKpiDays?: number;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() notifySalary?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() notifyNonStandardContent?: boolean;
}

// 10. Thông báo tổ trưởng / trưởng ca
export class ShiftLeaderNotificationDto {
  @ApiPropertyOptional() @IsOptional() @IsBoolean() remindShiftAssignment?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() notifyManagerShortage?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() reportShiftPerformance?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() notifyStaffViolationInShift?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() notifyOrderIssue?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() remindEndShiftReport?: boolean;
}

// 11. Thông báo giám sát / quản lý
export class ManagerNotificationDto {
  @ApiPropertyOptional() @IsOptional() @IsBoolean() notifyKpiDropStore?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() remindPermissionReview?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() notifyContinuousViolation?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsNumber() notifyContinuousViolationCount?: number;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() notifyContinuousPerformanceDrop?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsNumber() notifyContinuousPerformanceDropCount?: number;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() notifySalaryLate?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() notifyEmptyShift?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() remindApproveRequest?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsNumber() remindApproveRequestDays?: number;
}

// 12. Thông báo & nhắc nhở cửa hàng
export class StoreNotificationDto {
  @ApiPropertyOptional() @IsOptional() @IsBoolean() notifyShiftShortageToday?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() notifyUnannouncedAbsence?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() notifyResignationSign?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() remindUnreadNotifications?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() remindNewSchedule?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsNumber() remindNewScheduleDays?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() notifyContinuousPerformanceDropDays?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() notifyContinuousKpiDropDays?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() notifyIndividualLowKpiDays?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() notifyQualitySupervisorDropDays?: number;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() remindAssetInventory?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsNumber() remindAssetInventoryDays?: number;
}

export class StorePermissionConfigDto {
  @ApiPropertyOptional() @IsOptional() @ValidateNested() @Type(() => SchedulePermissionDto) schedule?: SchedulePermissionDto;
  @ApiPropertyOptional() @IsOptional() @ValidateNested() @Type(() => TimekeepingPermissionDto) timekeeping?: TimekeepingPermissionDto;
  @ApiPropertyOptional() @IsOptional() @ValidateNested() @Type(() => HRPermissionDto) hr?: HRPermissionDto;
  @ApiPropertyOptional() @IsOptional() @ValidateNested() @Type(() => AssetPermissionDto) asset?: AssetPermissionDto;
  @ApiPropertyOptional() @IsOptional() @ValidateNested() @Type(() => SalaryPermissionDto) salary?: SalaryPermissionDto;
  @ApiPropertyOptional() @IsOptional() @ValidateNested() @Type(() => ContentPermissionDto) content?: ContentPermissionDto;
  @ApiPropertyOptional() @IsOptional() @ValidateNested() @Type(() => ReportPermissionDto) report?: ReportPermissionDto;
  @ApiPropertyOptional() @IsOptional() @ValidateNested() @Type(() => SystemPermissionDto) system?: SystemPermissionDto;
  @ApiPropertyOptional() @IsOptional() @ValidateNested() @Type(() => EmployeeNotificationDto) employeeNotification?: EmployeeNotificationDto;
  @ApiPropertyOptional() @IsOptional() @ValidateNested() @Type(() => ShiftLeaderNotificationDto) shiftLeaderNotification?: ShiftLeaderNotificationDto;
  @ApiPropertyOptional() @IsOptional() @ValidateNested() @Type(() => ManagerNotificationDto) managerNotification?: ManagerNotificationDto;
  @ApiPropertyOptional() @IsOptional() @ValidateNested() @Type(() => StoreNotificationDto) storeNotification?: StoreNotificationDto;
}
