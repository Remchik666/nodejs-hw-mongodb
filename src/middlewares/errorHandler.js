/* eslint-disable no-unused-vars */
import createHttpError from "http-errors"; 

export function errorHandler(err, req, res, next) {
    new createHttpError.InternalServerError(res.status(500).json({
            message: 'Something went wrong',
            data: err.message,
        }))    
}