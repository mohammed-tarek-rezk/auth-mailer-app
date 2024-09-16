

class AppError extends Error {
    constructor() {
        super();

    }

    create(status , statusCode , msg , data){
        this.status = status;
        this.statusCode = statusCode;
        this.message = msg;
        this.data = data;
        return this;
    }
}


module.exports = new AppError();