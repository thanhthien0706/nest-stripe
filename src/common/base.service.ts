import { NotFoundException } from '@exceptions/not-found.exception';
import { Repository } from 'typeorm';
import { MessageName } from './message';

export interface Pagination<T> {
  total: number;
  data: T[];
}

export interface RemoveResult {
  removed: number;
}

export abstract class BaseService<T, K, V> {
  constructor(private name: string, private repository: Repository<T>) {}

  abstract findAll(filterDto?): Promise<T[] | Pagination<T>>;

  async findById(id: number): Promise<T> {
    return await this.repository.findOneBy({ id } as any);
  }

  async create(createDto: K): Promise<T> {
    return await this.repository.save(createDto as any);
  }

  async remove(id: string | number): Promise<RemoveResult> {
    const removed = await this.repository.delete(id);
    return {
      removed: removed.affected,
    };
  }

  async update(id: string | number, updateDto: V): Promise<T> {
    const toUpdate = await this.repository.findOne({ where: { id } as any });
    if (!toUpdate) {
      throw new NotFoundException(this.name as MessageName);
    }
    const updated = Object.assign(toUpdate, updateDto);
    return this.repository.save(updated);
  }
}
