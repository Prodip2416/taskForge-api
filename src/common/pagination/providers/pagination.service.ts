import {
  Inject,
  Injectable,
  InternalServerErrorException,
  RequestTimeoutException,
} from '@nestjs/common';
import { PaginationQueryDto } from '../dtos/pagination-query.dto';
import { ObjectLiteral, QueryFailedError, SelectQueryBuilder } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';

@Injectable()
export class PaginationService {
  constructor(@Inject(REQUEST) private readonly request: Request) {}

  public async paginateQuery<T extends ObjectLiteral>(
    paginationQuery: PaginationQueryDto,
    queryBuilder: SelectQueryBuilder<T>,
    // repository: Repository<T>,
  ) {
    const { page = 1, limit = 10 } = paginationQuery;
    // let results = await repository.find({
    //   skip: (page - 1) * limit,
    //   take: limit,
    // });

    let results: T[];
    let count: number;
    try {
      [results, count] = await queryBuilder
        .skip((page - 1) * limit)
        .take(limit)
        .getManyAndCount();
    } catch (error: unknown) {
      if (error instanceof QueryFailedError) {
        throw new InternalServerErrorException(
          'Database query failed while fetching paginated data.',
        );
      }

      // Connection-level error (optional advanced handling)
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        (error as any).code === 'ECONNREFUSED'
      ) {
        throw new RequestTimeoutException(
          'Database connection failed. Please try again later.',
        );
      }

      // Fallback
      throw new InternalServerErrorException(
        'Something went wrong while paginating data.',
      );
    }
    /**
     * Create the request URLs
     */
    const baseURL =
      this.request.protocol + '://' + this.request.headers.host + '/';
    const newUrl = new URL(this.request.url, baseURL);

    // Calculate page numbers
    const totalItems = count;
    const totalPages = Math.ceil(totalItems / limit);
    const nextPage = page === totalPages ? page : page + 1;
    const previousPage = page === 1 ? page : page - 1;
    const finalResponse = {
      data: results,
      meta: {
        itemsPerPage: limit,
        totalItems: totalItems,
        currentPage: page,
        totalPages: Math.ceil(totalItems / limit),
      },
      links: {
        first: `${newUrl.origin}${newUrl.pathname}?limit=${limit}&page=1`,
        last: `${newUrl.origin}${newUrl.pathname}?limit=${limit}&page=${totalPages}`,
        current: `${newUrl.origin}${newUrl.pathname}?limit=${limit}&page=${page}`,
        next: `${newUrl.origin}${newUrl.pathname}?limit=${limit}&page=${nextPage}`,
        previous: `${newUrl.origin}${newUrl.pathname}?limit=${limit}&page=${previousPage}`,
      },
    };

    return finalResponse;
  }
}
