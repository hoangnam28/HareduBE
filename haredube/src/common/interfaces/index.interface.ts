// import { EntityManager, EntityTarget, Repository } from 'typeorm';
import { IPopulate } from 'src/base/base.repository';
import { Pagination } from './filter.interface';

export interface FindAndCountQuery {
  pagination: Pagination;
  populates?: IPopulate[];
  searchBy?: string[];
  select?: string;
}
