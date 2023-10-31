export const successResponse = (res, statusCode, message, data) => {
    const response ={
        status: true,
        message: message,
        data: data,
        status_code: statusCode,
    }
    return res.status(statusCode).json(response)
}

export const errorResponse = (res, statusCode, message, data) => {
    const response ={
        status: false,
        message: message,
        data: data,
        status_code: statusCode,
    }
    return res.status(statusCode).json(response)
}

