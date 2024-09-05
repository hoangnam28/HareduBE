import { DEFAULT_PAGINATION } from './../constants/global.const';
import { QUERY_PARAM_PARSE } from '@common/constants/global.const';
import { Pagination } from '@common/interfaces/filter.interface';
import LogService from 'src/config/log.service';
import * as i18n from 'i18n';

export function handleLogError(error: any) {
  if (process.env.NODE_ENV === 'production') {
    LogService.logErrorFile(JSON.stringify(error));
  } else {
    LogService.logError('STACK', error.stack);
    LogService.logError('PATH', error.path);
    LogService.logError('BODY REQUEST', JSON.stringify(error?.body)?.slice(0, 500) + '...');
  }
}

export function handleLogInfo(info: any) {
  if (process.env.NODE_ENV === 'production') {
    LogService.logInfoFile(info);
  } else {
    LogService.logInfo(info);
  }
}

export function convertQueryParam(query: any): { [key: string]: string } {
  const parseQueries = {};

  Object.keys(query).forEach((key) => {
    if (['', 'undefined', 'NaN', 'null'].includes(query[key])) return;

    const array = (query[key] as string).split(',');

    if (array.length > 1) {
      parseQueries[key] = array;
      return;
    }

    parseQueries[key] = QUERY_PARAM_PARSE[query[key]] ?? query[key];
  });

  return parseQueries;
}

export function getPagination(request: { query: unknown }): Pagination {
  const query = convertQueryParam(request.query);
  const paginationParams = {
    ...DEFAULT_PAGINATION,
    ...query,
  } as Pagination;
  return paginationParams;
}

export const ItemNotFoundMessage = (item: string) => i18n.__('item-not-found', i18n.__(item));
