import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { StoresService } from './stores.service';

@Injectable()
export class StoresCronService {
  private readonly logger = new Logger(StoresCronService.name);

  constructor(private readonly storesService: StoresService) {}

  /**
   * Cron job chạy vào 00:05 (12:05 AM) mỗi ngày
   * Tạo DailyEmployeeReport cho tất cả các cửa hàng active
   */
  @Cron('5 0 * * *', {
    name: 'create-daily-reports',
    timeZone: 'Asia/Ho_Chi_Minh',
  })
  async handleCreateDailyReports() {
    this.logger.log('Starting daily reports creation for all stores...');
    
    try {
      const reports = await this.storesService.createDailyReportsForAllStores();
      this.logger.log(`Successfully created ${reports.length} daily reports`);
    } catch (error) {
      this.logger.error('Failed to create daily reports:', error);
    }
  }

  /**
   * Cron job chạy vào 00:10 (12:10 AM) ngày 1 mỗi tháng
   * Tạo MonthlyPayroll cho tất cả các cửa hàng active
   */
  @Cron('10 0 1 * *', {
    name: 'create-monthly-payrolls',
    timeZone: 'Asia/Ho_Chi_Minh',
  })
  async handleCreateMonthlyPayrolls() {
    this.logger.log('Starting monthly payrolls creation for all stores...');
    
    try {
      const payrolls = await this.storesService.createMonthlyPayrollsForAllStores();
      this.logger.log(`Successfully created ${payrolls.length} monthly payrolls`);
    } catch (error) {
      this.logger.error('Failed to create monthly payrolls:', error);
    }
  }

  /**
   * Cron job chạy vào 00:00 (12:00 AM) ngày 1 mỗi tháng
   * Tạo EmployeeMonthlySummary cho tất cả nhân viên active
   */
  @Cron('0 0 1 * *', {
    name: 'create-monthly-employee-summaries',
    timeZone: 'Asia/Ho_Chi_Minh',
  })
  async handleCreateMonthlySummaries() {
    this.logger.log('Starting monthly employee summaries creation for all active employees...');
    
    try {
      const summaries = await this.storesService.createMonthlySummariesForAllEmployees();
      this.logger.log(`Successfully created ${summaries.length} monthly employee summaries`);
    } catch (error) {
      this.logger.error('Failed to create monthly employee summaries:', error);
    }
  }

  /**
   * Cron job chạy vào 00:15 (12:15 AM) mỗi ngày
   * Xử lý các chu kỳ làm việc hết hạn và hẹn dừng
   */
  @Cron('15 0 * * *', {
    name: 'process-expired-work-cycles',
    timeZone: 'Asia/Ho_Chi_Minh',
  })
  async handleProcessExpiredCycles() {
    this.logger.log('Starting to process expired and scheduled-stop work cycles...');
    
    try {
      const result = await this.storesService.processExpiredCycles();
      this.logger.log(`Processed work cycles: ${result.expiredCount} expired, ${result.stoppedCount} stopped`);
    } catch (error) {
      this.logger.error('Failed to process expired work cycles:', error);
    }
  }

  /**
   * Cron job chạy vào 00:20 (12:20 AM) mỗi ngày
   * Tạo shift slots cho ngày mai cho các chu kỳ DAILY/WEEKLY/MONTHLY
   */
  @Cron('20 0 * * *', {
    name: 'generate-daily-slots',
    timeZone: 'Asia/Ho_Chi_Minh',
  })
  async handleGenerateDailySlots() {
    this.logger.log('Starting to generate slots for tomorrow for all active cycles...');
    
    try {
      const result = await this.storesService.generateDailySlotsForAllCycles();
      this.logger.log(`Generated slots: ${result.createdSlots} slots for ${result.processedCycles} cycles`);
    } catch (error) {
      this.logger.error('Failed to generate daily slots:', error);
    }
  }

  /**
   * Cron job chạy vào 00:25 (12:25 AM) mỗi ngày
   * Tạo shift slots cho ngày mai cho các chu kỳ vô thời hạn (dựa trên template)
   */
  @Cron('25 0 * * *', {
    name: 'generate-slots-indefinite-cycles',
    timeZone: 'Asia/Ho_Chi_Minh',
  })
  async handleGenerateSlotsForIndefiniteCycles() {
    this.logger.log('Starting to generate slots for indefinite work cycles...');
    
    try {
      const result = await this.storesService.generateDailySlotsForIndefiniteCycles();
      this.logger.log(`Processed ${result.processedCount} indefinite cycles`);
    } catch (error) {
      this.logger.error('Failed to generate slots for indefinite cycles:', error);
    }
  }
}
