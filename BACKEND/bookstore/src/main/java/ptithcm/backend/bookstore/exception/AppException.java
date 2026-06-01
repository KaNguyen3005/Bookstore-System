package ptithcm.backend.bookstore.exception;


public class AppException extends RuntimeException{
    private ErrorCode errorCode;

    public AppException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }

    public ErrorCode getErrorcode() {
        return errorCode;
    }

    public void setErrorcode(ErrorCode errorCode) {
        this.errorCode = errorCode;
    }
}
