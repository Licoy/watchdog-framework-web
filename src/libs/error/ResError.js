function ExtendableBuiltin(cls) {
    function ExtendableBuiltin() {
        cls.apply(this, arguments);
    }
    ExtendableBuiltin.prototype = Object.create(cls.prototype);
    Object.setPrototypeOf(ExtendableBuiltin, cls);

    return ExtendableBuiltin;
}

//自定义请求异常错误
export class ResError extends ExtendableBuiltin(Error){
    constructor(message) {
        super(message);
        this.message = message;
        this.name = "ResError";
    }
}