import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

// Load .env file
dotenv.config();

const STORE_ID = '01ebfedb-354f-4ce9-8389-7fc72076f28d';

const TEST_EMPLOYEES = [
  { fullName: 'Nguyễn Văn An', phone: '0901234501', email: 'an.nguyen@test.com', gender: 'male' },
  { fullName: 'Trần Thị Bình', phone: '0901234502', email: 'binh.tran@test.com', gender: 'female' },
  { fullName: 'Lê Văn Cường', phone: '0901234503', email: 'cuong.le@test.com', gender: 'male' },
  { fullName: 'Phạm Thị Dung', phone: '0901234504', email: 'dung.pham@test.com', gender: 'female' },
  { fullName: 'Hoàng Văn Em', phone: '0901234505', email: 'em.hoang@test.com', gender: 'male' },
  { fullName: 'Vũ Thị Phương', phone: '0901234506', email: 'phuong.vu@test.com', gender: 'female' },
  { fullName: 'Đặng Văn Giang', phone: '0901234507', email: 'giang.dang@test.com', gender: 'male' },
  { fullName: 'Bùi Thị Hà', phone: '0901234508', email: 'ha.bui@test.com', gender: 'female' },
];

async function seedEmployees() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT || '5432'),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: ['src/**/*.entity.{ts,js}'],
    synchronize: false,
  });

  try {
    await dataSource.initialize();
    console.log('✅ Database connected');

    const accountRepo = dataSource.getRepository('Account');
    const employeeRepo = dataSource.getRepository('EmployeeProfile');
    const storeRepo = dataSource.getRepository('Store');

    // Check if store exists
    const store = await storeRepo.findOne({ where: { id: STORE_ID } });
    if (!store) {
      console.error(`❌ Store ${STORE_ID} not found`);
      process.exit(1);
    }
    console.log(`✅ Store found: ${store.name}`);

    const hashedPassword = await bcrypt.hash('123456', 10);

    for (const emp of TEST_EMPLOYEES) {
      // Check if account already exists
      let account = await accountRepo.findOne({
        where: [{ phone: emp.phone }, { email: emp.email }],
      });

      if (!account) {
        // Create account
        account = accountRepo.create({
          fullName: emp.fullName,
          phone: emp.phone,
          email: emp.email,
          passwordHash: hashedPassword,
          gender: emp.gender,
          status: 'active',
        });
        await accountRepo.save(account);
        console.log(`✅ Created account: ${emp.fullName}`);
      } else {
        console.log(`⚠️  Account already exists: ${emp.fullName}`);
      }

      // Check if employee profile exists
      const existingProfile = await employeeRepo.findOne({
        where: { storeId: STORE_ID, accountId: account.id },
      });

      if (!existingProfile) {
        // Create employee profile
        const profile = employeeRepo.create({
          storeId: STORE_ID,
          accountId: account.id,
          employmentStatus: 'active',
          workingStatus: 'idle',
          joinedAt: new Date(),
        });
        await employeeRepo.save(profile);
        console.log(`✅ Created employee profile: ${emp.fullName}`);
      } else {
        console.log(`⚠️  Employee profile already exists: ${emp.fullName}`);
      }
    }

    console.log('\n✅ Seed completed successfully!');
    console.log(`📊 Total employees: ${TEST_EMPLOYEES.length}`);
    console.log(`🏪 Store ID: ${STORE_ID}`);
    console.log('🔑 Default password for all test accounts: 123456');
  } catch (error) {
    console.error('❌ Error seeding employees:', error);
    process.exit(1);
  } finally {
    await dataSource.destroy();
  }
}

seedEmployees();
