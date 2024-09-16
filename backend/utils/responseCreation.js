
const responseCreation = (status , message = null , data = null , statusCode = 200 )=>{
    const response = {
        status: status,
        message,
        data: {data}
    };
    return response;
}


module.exports = responseCreation;