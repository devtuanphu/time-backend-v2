import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendVerificationCode(email: string, fullName: string, code: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Xác thực tài khoản TimeSO của bạn',
      template: './verification', // .hbs extension is implied
      context: {
        name: fullName,
        code: code,
      },
    });
  }

  async sendPasswordEmail(email: string, fullName: string, password: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Tài khoản TimeSO của bạn đã được tạo',
      html: `
        <p>Xin chào ${fullName},</p>
        <p>Tài khoản TimeSO của bạn đã được tạo thành công.</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mật khẩu:</strong> <span style="color: #007bff; font-size: 18px;">${password}</span></p>
        <p>Vui lòng đăng nhập và đổi mật khẩu ngay sau khi nhận được email này.</p>
        <p>Trân trọng,<br />Đội ngũ TimeSO</p>
      `,
    });
  }

  async sendPasswordResetOtp(email: string, fullName: string, otp: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Đặt lại mật khẩu TimeSO',
      html: `
        <p>Xin chào ${fullName},</p>
        <p>Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản TimeSO.</p>
        <p>Mã OTP của bạn là: <strong style="color: #007bff; font-size: 24px;">${otp}</strong></p>
        <p>Mã này có hiệu lực trong 10 phút.</p>
        <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
        <p>Trân trọng,<br />Đội ngũ TimeSO</p>
      `,
    });
  }
}
