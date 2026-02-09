import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ZaloToken } from './entities/zalo-token.entity';

@Injectable()
export class ZaloService implements OnModuleInit {
  private readonly logger = new Logger(ZaloService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    @InjectRepository(ZaloToken)
    private readonly zaloTokenRepository: Repository<ZaloToken>,
  ) {}

  /**
   * Kiểm tra token khi server khởi động
   * Không auto-seed từ .env nữa - yêu cầu authorize qua OAuth
   */
  async onModuleInit() {
    const existingToken = await this.zaloTokenRepository.findOne({ where: {} });
    
    if (!existingToken) {
      this.logger.warn('⚠️ Chưa có Zalo token. Để sử dụng ZNS, hãy gọi GET /zalo/oauth-url và authorize trong browser.');
    } else {
      // Kiểm tra token còn hạn không
      const now = new Date();
      const refreshTokenValid = existingToken.refreshTokenExpiresAt.getTime() > now.getTime();
      
      if (!refreshTokenValid) {
        this.logger.warn('⚠️ Zalo refresh token đã hết hạn. Cần authorize lại qua GET /zalo/oauth-url');
      } else {
        this.logger.log('✅ Zalo token đã tồn tại và còn hạn');
      }
    }
  }

  /**
   * Lấy access token hợp lệ, tự động refresh nếu hết hạn
   */
  async getValidAccessToken(): Promise<string> {
    const tokenRecord = await this.zaloTokenRepository.findOne({
      where: {},
      order: { updatedAt: 'DESC' },
    });

    if (!tokenRecord) {
      throw new Error('Chưa có Zalo token. Vui lòng authorize qua GET /zalo/oauth-url trước.');
    }

    // Kiểm tra refresh token còn hạn không
    const now = new Date();
    if (tokenRecord.refreshTokenExpiresAt.getTime() <= now.getTime()) {
      throw new Error('Refresh token đã hết hạn. Vui lòng authorize lại qua GET /zalo/oauth-url');
    }

    // Kiểm tra access token còn hạn không (trừ 5 phút buffer)
    const bufferTime = 5 * 60 * 1000; // 5 phút
    if (tokenRecord.accessTokenExpiresAt.getTime() - bufferTime > now.getTime()) {
      return tokenRecord.accessToken;
    }

    // Access token hết hạn, cần refresh
    this.logger.log('Access token hết hạn, đang refresh...');
    return this.refreshAccessToken(tokenRecord);
  }

  /**
   * Refresh access token bằng refresh token
   */
  async refreshAccessToken(tokenRecord: ZaloToken): Promise<string> {
    const appId = this.configService.get('ZALO_APP_ID');
    const secretKey = this.configService.get('ZALO_APP_SECRET');

    try {
      const response = await firstValueFrom(
        this.httpService.post(
          'https://oauth.zaloapp.com/v4/access_token',
          new URLSearchParams({
            refresh_token: tokenRecord.refreshToken,
            app_id: appId,
            grant_type: 'refresh_token',
          }).toString(),
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'secret_key': secretKey,
            },
          },
        ),
      );

      const { access_token, refresh_token, expires_in } = response.data;
      this.logger.log(`Zalo refresh response: access_token=${!!access_token}, refresh_token=${!!refresh_token}, expires_in=${expires_in} (type: ${typeof expires_in})`);

      if (!access_token || !refresh_token) {
        throw new Error(`Zalo trả về token không hợp lệ: ${JSON.stringify(response.data)}`);
      }

      // expires_in có thể là number hoặc string, dùng Number() thay parseInt()
      const expiresInSeconds = Number(expires_in) || 90000; // fallback 25 giờ

      // Cập nhật token trong DB
      tokenRecord.accessToken = access_token;
      tokenRecord.refreshToken = refresh_token;
      tokenRecord.accessTokenExpiresAt = new Date(
        Date.now() + expiresInSeconds * 1000,
      );
      // Refresh token có hiệu lực 30 ngày
      tokenRecord.refreshTokenExpiresAt = new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000,
      );

      await this.zaloTokenRepository.save(tokenRecord);
      this.logger.log('Refresh token thành công');

      return access_token;
    } catch (error) {
      this.logger.error('Lỗi refresh token:', error.response?.data || error.message);
      throw new Error('Không thể refresh Zalo token. Vui lòng authorize lại.');
    }
  }

  /**
   * Scheduled job: Tự động refresh token mỗi tuần (Chủ nhật 3h sáng)
   * Đảm bảo refresh_token không bao giờ hết hạn nếu server đang chạy
   */
  @Cron(CronExpression.EVERY_WEEK)
  async keepAliveToken() {
    this.logger.log('⏰ [Cron] Bắt đầu keep-alive token...');
    
    try {
      const tokenRecord = await this.zaloTokenRepository.findOne({
        where: {},
        order: { updatedAt: 'DESC' },
      });

      if (!tokenRecord) {
        this.logger.warn('[Cron] Không có token để refresh');
        return;
      }

      // Kiểm tra refresh token còn hạn không
      const now = new Date();
      if (tokenRecord.refreshTokenExpiresAt.getTime() <= now.getTime()) {
        this.logger.error('[Cron] Refresh token đã hết hạn! Cần authorize lại.');
        return;
      }

      // Force refresh token để lấy token mới
      await this.refreshAccessToken(tokenRecord);
      this.logger.log('✅ [Cron] Keep-alive token thành công. Token mới đã được lưu.');
    } catch (error) {
      this.logger.error('[Cron] Keep-alive token thất bại:', error.message);
    }
  }

  /**
   * Khởi tạo token lần đầu (gọi từ API admin)
   */
  async initToken(accessToken: string, refreshToken: string, expiresIn: number) {
    // Xóa token cũ nếu có
    await this.zaloTokenRepository.clear();

    const tokenEntity = this.zaloTokenRepository.create({
      accessToken,
      refreshToken,
      accessTokenExpiresAt: new Date(Date.now() + expiresIn * 1000),
      refreshTokenExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    await this.zaloTokenRepository.save(tokenEntity);
    this.logger.log('Khởi tạo Zalo token thành công');
    return { message: 'Khởi tạo token thành công' };
  }

  /**
   * Gửi OTP qua ZNS
   */
  async sendOtp(phone: string, otp: string, type: 'register' | 'forgot-password' = 'register') {
    const accessToken = await this.getValidAccessToken();
    
    const templateId = type === 'register'
      ? this.configService.get('ZALO_ZNS_REGISTER_TEMPLATE_ID')
      : this.configService.get('ZALO_ZNS_FORGOT_TEMPLATE_ID');

    // Format số điện thoại: bỏ đầu 0, thêm 84
    const formattedPhone = this.formatPhoneNumber(phone);

    try {
      const response = await firstValueFrom(
        this.httpService.post(
          'https://business.openapi.zalo.me/message/template',
          {
            phone: formattedPhone,
            template_id: templateId,
            template_data: {
              otp: otp,
            },
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'access_token': accessToken,
            },
          },
        ),
      );

      this.logger.log(`ZNS sent to ${formattedPhone}: ${JSON.stringify(response.data)}`);
      
      if (response.data.error !== 0) {
        throw new Error(`ZNS Error: ${response.data.message}`);
      }

      return response.data;
    } catch (error) {
      this.logger.error('Lỗi gửi ZNS:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Format số điện thoại từ 0xxx sang 84xxx
   */
  private formatPhoneNumber(phone: string): string {
    let cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('0')) {
      cleaned = '84' + cleaned.substring(1);
    }
    if (!cleaned.startsWith('84')) {
      cleaned = '84' + cleaned;
    }
    return cleaned;
  }

  /**
   * Exchange authorization code for access token (OAuth flow)
   */
  async exchangeCodeForToken(code: string): Promise<{ message: string }> {
    const appId = this.configService.get('ZALO_APP_ID');
    const secretKey = this.configService.get('ZALO_APP_SECRET');
    const redirectUri = this.configService.get('ZALO_REDIRECT_URI') || 'http://localhost:3000/zalo/oauth-callback';

    try {
      const response = await firstValueFrom(
        this.httpService.post(
          'https://oauth.zaloapp.com/v4/access_token',
          new URLSearchParams({
            code: code,
            app_id: appId,
            grant_type: 'authorization_code',
            redirect_uri: redirectUri,
          }).toString(),
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'secret_key': secretKey,
            },
          },
        ),
      );

      const { access_token, refresh_token, expires_in } = response.data;

      if (!access_token) {
        throw new Error(`Zalo OAuth Error: ${response.data.error_description || 'Unknown error'}`);
      }

      // Lưu token vào DB
      await this.initToken(access_token, refresh_token, parseInt(expires_in) || 90000);
      
      this.logger.log('✅ OAuth token exchange thành công');
      return { message: 'Token đã được khởi tạo thành công từ OAuth' };
    } catch (error) {
      this.logger.error('Lỗi exchange code:', error.response?.data || error.message);
      throw new Error(`Không thể lấy token từ Zalo: ${error.response?.data?.error_description || error.message}`);
    }
  }

  /**
   * Kiểm tra trạng thái token hiện tại
   */
  async getTokenStatus(): Promise<{
    hasToken: boolean;
    accessTokenValid: boolean;
    accessTokenExpiresAt?: string;
    refreshTokenExpiresAt?: string;
    message: string;
  }> {
    const tokenRecord = await this.zaloTokenRepository.findOne({
      where: {},
      order: { updatedAt: 'DESC' },
    });

    if (!tokenRecord) {
      return {
        hasToken: false,
        accessTokenValid: false,
        message: 'Chưa có token. Vui lòng gọi GET /zalo/oauth-url để authorize.',
      };
    }

    const now = new Date();
    const bufferTime = 5 * 60 * 1000; // 5 phút
    const accessTokenValid = tokenRecord.accessTokenExpiresAt.getTime() - bufferTime > now.getTime();
    const refreshTokenValid = tokenRecord.refreshTokenExpiresAt.getTime() > now.getTime();

    let message = '';
    if (accessTokenValid) {
      message = 'Access token còn hạn. Sẵn sàng gửi ZNS.';
    } else if (refreshTokenValid) {
      message = 'Access token hết hạn nhưng sẽ tự động refresh khi gọi API.';
    } else {
      message = 'Cả access token và refresh token đều hết hạn. Cần authorize lại.';
    }

    return {
      hasToken: true,
      accessTokenValid,
      accessTokenExpiresAt: tokenRecord.accessTokenExpiresAt.toISOString(),
      refreshTokenExpiresAt: tokenRecord.refreshTokenExpiresAt.toISOString(),
      message,
    };
  }
}
