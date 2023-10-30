export const successResponse = (res, statusCode, message) => {
    const response ={
        status: true,
        message: message,
        status_code: statusCode,
    }
    return res.status(statusCode).json(response)
}

export const errorResponse = (res, statusCode, message) => {
    const response ={
        status: false,
        message: message,
        status_code: statusCode,
    }
    return res.status(statusCode).json(response)
}

