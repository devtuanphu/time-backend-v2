import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsEnum,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ServiceType } from '../entities/service-item.entity';
import { PaymentMethod } from '../entities/order.entity';

export class CreateServiceItemDto {
  @ApiProperty({ description: 'ID danh mục dịch vụ', example: 'uuid-category' })
  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({ description: 'Tên món/dịch vụ', example: 'Cafe Sữa Đá' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Giá bán', example: 35000 })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    description: 'Kích thước (S, M, L)',
    example: 'M',
    required: false,
  })
  @IsString()
  @IsOptional()
  size?: string;

  @ApiProperty({
    description: 'Thời lượng thực hiện (phút)',
    example: 15,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  duration?: number;

  @ApiProperty({
    description: 'Mô tả chi tiết',
    example: 'Cafe pha phin truyền thống',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Ảnh minh họa',
    required: false,
  })
  @IsOptional()
  avatar?: any;
}

export class OrderItemDto {
  @ApiProperty({
    description: 'ID của ServiceItem',
    example: 'uuid-service-item',
  })
  @IsString()
  @IsNotEmpty()
  serviceItemId: string;

  @ApiProperty({ description: 'Số lượng', example: 2 })
  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @ApiProperty({
    description: 'Ghi chú cho món (ít đá, không hành...)',
    example: 'Ít đường',
    required: false,
  })
  @IsString()
  @IsOptional()
  note?: string;
}

export class CreateOrderDto {
  @ApiProperty({ enum: ServiceType, description: 'Loại dịch vụ của đơn hàng' })
  @IsEnum(ServiceType)
  type: ServiceType;

  @ApiProperty({
    description: 'Tên khách hàng',
    example: 'Anh Tuấn',
    required: false,
  })
  @IsString()
  @IsOptional()
  customerName?: string;

  @ApiProperty({
    description: 'Số điện thoại khách hàng',
    example: '0901234567',
    required: false,
  })
  @IsString()
  @IsOptional()
  customerPhone?: string;

  @ApiProperty({ description: 'Thành phố/Tỉnh', example: 'Hồ Chí Minh', required: false })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({ description: 'Phường/Xã', example: 'Phường 12', required: false })
  @IsString()
  @IsOptional()
  ward?: string;

  @ApiProperty({ description: 'Địa chỉ chi tiết', example: '123 Đường ABC', required: false })
  @IsString()
  @IsOptional()
  addressLine?: string;

  @ApiProperty({ description: 'Ngày hẹn (dd/mm/yyyy hoặc ISO)', example: '2026-01-25', required: false })
  @IsString()
  @IsOptional()
  appointmentDate?: string;

  @ApiProperty({ description: 'Giờ hẹn (HH:mm)', example: '14:30', required: false })
  @IsString()
  @IsOptional()
  appointmentTime?: string;

  @ApiProperty({
    type: [OrderItemDto],
    description: 'Danh sách các món trong đơn hàng',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty({
    description: 'Phần trăm giảm giá',
    example: 10,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  discountPercent?: number;

  @ApiProperty({
    description: 'Phần trăm thuế VAT',
    example: 8,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  taxPercent?: number;

  @ApiProperty({ enum: PaymentMethod, description: 'Phương thức thanh toán' })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @ApiProperty({
    description: 'Thông tin chi tiết đặc thù của đơn hàng (JSON)',
    example: { tableNumber: 5, dineIn: true },
    required: false,
  })
  @IsOptional()
  orderDetails?: any;

  @ApiProperty({
    description: 'Ghi chú chung cho đơn hàng',
    example: 'Giao gấp',
    required: false,
  })
  @IsString()
  @IsOptional()
  note?: string;
}

export class RecipeDto {
  @ApiProperty({ description: 'ID hàng hóa nguyên liệu', example: 'uuid-product' })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ description: 'Số lượng tiêu hao', example: 0.1 })
  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @ApiProperty({ description: 'Đơn vị tính', example: 'kg', required: false })
  @IsString()
  @IsOptional()
  unit?: string;
}

export class CreateFnbServiceItemDto {
  @ApiProperty({ description: 'Tên món', example: 'Cafe Sữa Đá' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Giá bán', example: 35000 })
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  price: number;

  @ApiProperty({ description: 'ID danh mục', example: 'uuid-danh-muc' })
  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({ description: 'Kích thước', example: 'M', required: false })
  @IsString()
  @IsOptional()
  size?: string;

  @ApiProperty({ description: 'Mô tả', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ type: [RecipeDto], description: 'Công thức định lượng', required: false })
  @IsOptional()
  recipes?: RecipeDto[];

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  @IsOptional()
  avatar?: any;
}

export class CreateYieldServiceItemDto {
  @ApiProperty({ description: 'Tên mặt hàng', example: 'Gạch ống' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Giá tiền', example: 1200 })
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  price: number;

  @ApiProperty({ description: 'Đơn vị tính (VD: viên, bao, kg)', example: 'viên' })
  @IsString()
  @IsNotEmpty()
  unit: string;

  @ApiProperty({ description: 'ID danh mục', example: 'uuid-danh-muc', required: false })
  @IsString()
  @IsOptional()
  categoryId?: string;

  @ApiProperty({ description: 'Mô tả', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  @IsOptional()
  avatar?: any;
}

export class CreatePersonalCareItemDto {
  @ApiProperty({ description: 'Tên dịch vụ', example: 'Gội đầu dưỡng sinh' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Giá tiền', example: 150000 })
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  price: number;

  @ApiProperty({ description: 'Thời lượng (phút)', example: 45 })
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  duration: number;

  @ApiProperty({ description: 'ID danh mục', required: false })
  @IsString()
  @IsOptional()
  categoryId?: string;

  @ApiProperty({ description: 'Mô tả', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  @IsOptional()
  avatar?: any;
}

export class CreatePetCareItemDto {
  @ApiProperty({ description: 'Tên dịch vụ', example: 'Cắt tỉa lông chó Poodle' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Giá tiền', example: 350000 })
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  price: number;

  @ApiProperty({ description: 'Thời lượng (phút)', example: 90 })
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  duration: number;

  @ApiProperty({ description: 'ID danh mục', required: false })
  @IsString()
  @IsOptional()
  categoryId?: string;

  @ApiProperty({ description: 'Mô tả', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  @IsOptional()
  avatar?: any;
}
