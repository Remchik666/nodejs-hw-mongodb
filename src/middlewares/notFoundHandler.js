/* eslint-disable no-unused-vars */
import createError from 'http-errors';

export function notFoundHandler(req, res, next) {
    new createError.NotFound(res.status(404).json({
            message: 'Route not found',
        }))
}