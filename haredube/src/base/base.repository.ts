import { FindAndCountQuery } from '@common/interfaces/index.interface';
import { Injectable } from '@nestjs/common';
import {
  Callback,
  ClientSession,
  Document,
  FilterQuery,
  Model,
  PopulateOptions,
  ProjectionType,
  Query,
  QueryOptions,
  Schema,
  Types,
} from 'mongoose';

export type IPopulate = PopulateOptions | string;

@Injectable()
export class BaseRepository<T extends Document> {
  constructor(protected model: Model<T>) {}

  async findAll(
    filterQuery?: FilterQuery<T>,
    populate?: IPopulate[],
    sort: string | any = { createdAt: 'desc' },
    projection?: ProjectionType<T> | null,
    options?: QueryOptions<T> | null,
  ): Promise<T[]> {
    return await this._addPopulate(
      this.model
        .find(
          {
            ...filterQuery,
            deletedAt: null,
          },
          projection,
          options,
        )
        .sort(sort),
      populate,
    );
  }

  async findAllIncludeDeleted(
    filterQuery?: FilterQuery<T>,
    populate?: IPopulate[],
    sort: string | any = { createdAt: 'desc' },
  ): Promise<T[]> {
    return await this._addPopulate(
      this.model
        .find({
          ...filterQuery,
        })
        .sort(sort),
      populate,
      true,
    );
  }

  async findAllDeleted(filterQuery?: FilterQuery<T>, populate?: IPopulate[]): Promise<T[]> {
    return await this._addPopulate(
      this.model.find({
        ...filterQuery,
        deletedAt: { $ne: null },
      }),
      populate,
    );
  }

  async findOne(
    filterQuery: FilterQuery<T>,
    populate?: IPopulate[],
    sort: string | any = { createdAt: 'desc' },
  ): Promise<T> {
    const query = { ...filterQuery, deletedAt: null };
    return await this._addPopulate(this.model.findOne(query).sort(sort), populate);
  }

  async findById(id: string, populate?: IPopulate[]): Promise<T> {
    const query: FilterQuery<T> = {
      _id: id as any,
      deletedAt: null,
    };
    return await this._addPopulate(this.model.findOne(query), populate);
  }

  async findByIds(ids: string[], populate?: IPopulate[]) {
    return await this.findAll({ _id: { $in: ids } }, populate);
  }

  async findByIdIncludeDelete(id: string, populate?: IPopulate[]): Promise<T> {
    return await this._addPopulate(this.model.findOne({ _id: id as any }), populate);
  }

  async paginate(params: FindAndCountQuery): Promise<[T[], number]> {
    const { pagination, select, populates, searchBy = [] } = params;
    const { size, page, sortBy = 'createdAt', sortType = 'desc', text, ...rest } = pagination;
    const conditions: any = { ...rest };

    if (text && searchBy.length > 0) {
      const isTextNumeric = !isNaN(Number(text)) && isFinite(Number(text));
      conditions['$or'] = searchBy
        .map((key) => {
          const isFieldNumeric = this.isFieldTypeNumber(key);
          return isTextNumeric && isFieldNumeric
            ? { [key]: Number(text) }
            : !isFieldNumeric
              ? { [key]: { $regex: new RegExp(text.toString(), 'i') } }
              : null;
        })
        .filter((condition) => condition !== null);
    }
    Object.keys(rest).length > 0 &&
      Object.keys(rest).forEach((key) => {
        conditions[key] = Array.isArray(rest[key]) ? { $in: rest[key] } : rest[key];
      });
    const query = this._addPopulate(
      this.model
        .find(conditions)
        .select(select || '-password -__v')
        .skip((Number(page) - 1) * Number(size))
        .limit(Number(size))
        .sort({ [sortBy]: sortType === 'desc' ? -1 : 1 }),
      populates,
    );
    const [data, total] = await Promise.all([query, this.model.countDocuments(conditions)]);
    return [data, total];
  }

  private isFieldTypeNumber(fieldName: string): boolean {
    const schemaType = this.model.schema.path(fieldName);
    return schemaType instanceof Schema.Types.Number;
  }

  async create(payload: any, session?: ClientSession): Promise<T> {
    const _createModel = async (data: any, session: ClientSession) => {
      const document = new this.model(data);
      await document.save({ session });
      return document;
    };

    if (session) {
      try {
        return await _createModel(payload, session);
      } catch (error) {
        throw error;
      }
    }

    const sessionLocal = await this.model.db.startSession();
    try {
      sessionLocal.startTransaction();
      const data = await _createModel(payload, sessionLocal);
      await sessionLocal.commitTransaction();
      return data;
    } catch (error) {
      await sessionLocal.abortTransaction();
      throw error;
    } finally {
      sessionLocal.endSession();
    }
  }

  async createMany(payload: any, session?: ClientSession) {
    const _createModels = async (data: any, session: ClientSession) => {
      if (Array.isArray(data)) {
        const models = data.map((item) => new this.model(item));
        const document = await this.model.insertMany(models, {
          session,
        });
        return document;
      }
    };

    if (session) {
      try {
        return await _createModels(payload, session);
      } catch (error) {
        throw error;
      }
    }

    const sessionLocal = await this.model.db.startSession();
    try {
      sessionLocal.startTransaction();
      const data = await _createModels(payload, sessionLocal);
      await sessionLocal.commitTransaction();
      return data;
    } catch (error) {
      await sessionLocal.abortTransaction();
      throw error;
    } finally {
      sessionLocal.endSession();
    }
  }

  async update(id: string | Types.ObjectId, payload: any, session?: ClientSession): Promise<T> {
    const _updateModel = async (id: string | Types.ObjectId, data: any, session: ClientSession) => {
      return await this.model.findByIdAndUpdate(id, data, {
        new: true,
        session,
      });
    };

    if (session) {
      try {
        return await _updateModel(id, payload, session);
      } catch (error) {
        throw error;
      }
    }

    const sessionLocal = await this.model.db.startSession();
    try {
      sessionLocal.startTransaction();
      const data = await _updateModel(id, payload, sessionLocal);
      await sessionLocal.commitTransaction();
      return data;
    } catch (error) {
      await sessionLocal.abortTransaction();
      throw error;
    } finally {
      sessionLocal.endSession();
    }
  }

  async insertOrUpdate(filterQuery: FilterQuery<T>, payload: any, session?: ClientSession): Promise<any> {
    const _insertOrUpdateModel = async (filterQuery: FilterQuery<T>, data: any, session: ClientSession) => {
      return await this.model.findOneAndUpdate(filterQuery, data, {
        new: true,
        session,
        upsert: true,
      });
    };

    if (session) {
      return await _insertOrUpdateModel(filterQuery, payload, session);
    }

    const sessionLocal = await this.model.db.startSession();
    try {
      sessionLocal.startTransaction();
      const data = await _insertOrUpdateModel(filterQuery, payload, sessionLocal);
      await sessionLocal.commitTransaction();
      return data;
    } catch (error) {
      await sessionLocal.abortTransaction();
      throw error;
    } finally {
      sessionLocal.endSession();
    }
  }

  async updateByFilter(filterQuery: FilterQuery<T>, payload: any, session?: ClientSession): Promise<any> {
    const _updateMany = async (filterQuery: FilterQuery<T>, data: any, session: ClientSession) => {
      return await this.model.updateMany(filterQuery, data, {
        new: true,
        session,
      });
    };

    if (session) {
      try {
        return await _updateMany(filterQuery, payload, session);
      } catch (error) {
        throw error;
      }
    }

    const sessionLocal = await this.model.db.startSession();
    try {
      sessionLocal.startTransaction();
      const data = await _updateMany(filterQuery, payload, sessionLocal);
      await sessionLocal.commitTransaction();
      return data;
    } catch (error) {
      await sessionLocal.abortTransaction();
      throw error;
    } finally {
      sessionLocal.endSession();
    }
  }

  async remove(id: string, session?: ClientSession) {
    const _removeModel = async (id: string, session: ClientSession) => {
      return await this.model.findByIdAndRemove(id, { session });
    };

    if (session) {
      try {
        return await _removeModel(id, session);
      } catch (error) {
        throw error;
      }
    }

    const sessionLocal = await this.model.db.startSession();
    try {
      sessionLocal.startTransaction();
      const data = await _removeModel(id, sessionLocal);
      await sessionLocal.commitTransaction();
      return data;
    } catch (error) {
      await sessionLocal.abortTransaction();
      throw error;
    } finally {
      sessionLocal.endSession();
    }
  }

  async softDelete(id: string, session?: ClientSession) {
    const data = { deletedAt: new Date() };
    return await this.update(id, data, session);
  }

  async restore(id: string, session?: ClientSession) {
    const data = { deletedAt: null };
    return await this.update(id, data, session);
  }

  async updateMany(payload: any[], session?: ClientSession) {
    const _updateMany = async (payload: any[], session: ClientSession) =>
      await Promise.all(
        payload.map(async (item) => {
          const { _id, ...rest } = item;
          const record = await this.findById(_id);
          if (record) {
            return this.update(_id, item, session);
          }
          return this.create(rest, session);
        }),
      );
    if (session) {
      return await _updateMany(payload, session);
    }
    const sessionLocal = await this.model.db.startSession();
    try {
      sessionLocal.startTransaction();
      const data = await _updateMany(payload, session);
      await sessionLocal.commitTransaction();
      return data;
    } catch (error) {
      await sessionLocal.abortTransaction();
      throw error;
    } finally {
      sessionLocal.endSession();
    }
  }

  async removeByFilter(filterQuery: FilterQuery<T>, session?: ClientSession): Promise<any> {
    const _deleteMany = async (filterQuery: FilterQuery<T>, session: ClientSession) => {
      return await this.model.deleteMany(filterQuery, { session });
    };
    if (session) {
      try {
        return await _deleteMany(filterQuery, session);
      } catch (error) {
        throw error;
      }
    }
    const sessionLocal = await this.model.db.startSession();
    try {
      sessionLocal.startTransaction();
      const data = await _deleteMany(filterQuery, sessionLocal);
      await sessionLocal.commitTransaction();
      return data;
    } catch (error) {
      await sessionLocal.abortTransaction();
      throw error;
    } finally {
      sessionLocal.endSession();
    }
  }

  private _addPopulate(query: Query<any, any>, populate?: IPopulate[], includingSoftDelete = false) {
    if (populate && populate.length) {
      populate.forEach((item) => {
        const itemTransform = includingSoftDelete
          ? this._addPopulateIncludeSoftDelete(item)
          : this._addPopulateSoftDelete(item);
        query = query.populate(itemTransform);
      });
    }
    return query;
  }

  private _addPopulateSoftDelete(item: IPopulate): PopulateOptions {
    let tmp = {} as PopulateOptions;
    if (typeof item === 'string') {
      tmp.path = item;
      tmp.match = { deletedAt: null };
    } else {
      tmp = { ...item };
      tmp.match = { deletedAt: null, ...tmp.match };
      if (item.populate) {
        if (Array.isArray(item.populate)) {
          tmp.populate = item.populate.map((val) => this._addPopulateSoftDelete(val as IPopulate));
        } else {
          tmp.populate = this._addPopulateSoftDelete(item.populate as IPopulate);
        }
      }
    }
    return tmp;
  }

  private _addPopulateIncludeSoftDelete(item: IPopulate): PopulateOptions {
    let tmp = {} as PopulateOptions;
    if (typeof item === 'string') {
      tmp.path = item;
    } else {
      tmp = { ...item };
      tmp.match = { ...tmp.match };
      if (item.populate) {
        if (Array.isArray(item.populate)) {
          tmp.populate = item.populate.map((val) => this._addPopulateIncludeSoftDelete(val as IPopulate));
        } else {
          tmp.populate = this._addPopulateIncludeSoftDelete(item.populate as IPopulate);
        }
      }
    }
    return tmp;
  }

  async distinct(field: string, filter?: FilterQuery<T>, callback?: Callback<number>): Promise<any[]> {
    return await this.model.distinct(field, filter, callback);
  }
}
