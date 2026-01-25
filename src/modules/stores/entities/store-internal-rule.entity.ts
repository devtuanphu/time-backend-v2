import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Store } from './store.entity';

export interface InternalRuleFile {
  name: string;
  url: string;
  key?: string;
  type?: string;
  size?: number;
}

@Entity('store_internal_rules')
export class StoreInternalRule extends BaseEntity {
  @Column({ name: 'store_id' })
  storeId: string;

  @OneToOne(() => Store, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @Column({ nullable: true })
  title: string;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({
    type: 'jsonb',
    nullable: true,
    default: [],
  })
  files: InternalRuleFile[];

  @Column({ name: 'is_required_view', default: false })
  isRequiredView: boolean;
}
