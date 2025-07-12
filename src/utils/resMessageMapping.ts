export const RES_MESSAGE_MAPPING = {
    NO_CREDENTIALS: 'Không có thông tin xác thực.',
    INVALID_TOKEN: 'Token không hợp lệ',
    FORBIDDEN: 'Bạn không có quyền thực hiện hành động này.',
    BLOCKED_BY_CORS_POLICY: 'Bị chặn bởi chính sách bảo mật truy cập CORS.',
    INTERNAL_SERVER_ERROR: 'Lỗi không xác định từ phía server. Vui lòng thử lại sau.',
    INVALID_CREDENTIALS: 'Thông tin xác thực không hợp lệ.',
    NO_PERMISSION: 'Bạn không có quyền thực hiện hành động này.',
    USERNAME_EXISTED: 'Tên đăng nhập đã tồn tại.',
    EMAIL_EXISTED: 'Email đã tồn tại.',
    USER_NOT_FOUND: 'Người dùng không tồn tại.',
    INCORRECT_PASSWORD: 'Mật khẩu không chính xác.',
    INCORRECT_USERNAME_OR_PASSWORD: 'Tên đăng nhập hoặc mật khẩu không chính xác.',
    GOOGLE_AUTH_FAILED: 'Xác thực Google thất bại.',
    DATA_VALIDATION_FAILED: 'Dữ liệu không hợp lệ.',
    UPLOAD_IMAGE_FAILED: 'Tải ảnh lên thất bại.',
    DELETE_IMAGE_FAILED: 'Xóa ảnh thất bại.',
    EMAIL_VERIFICATION_FAILED: 'Email chưa được xác thực.',

    SIGN_IN_SUCCESSFULLY: 'Đăng nhập thành công.',
    SIGN_UP_SUCCESSFULLY: 'Đăng ký thành công.',
    REFRESH_TOKEN_SUCCESSFULLY: 'Làm mới token thành công.',
    DEACTIVATE_ACCOUNT_SUCCESSFULLY: 'Hủy kích hoạt tài khoản thành công.',
    REACTIVATE_ACCOUNT_SUCCESSFULLY: 'Kích hoạt tài khoản thành công.',
    RESET_PASSWORD_EMAIL_SENT: 'Email đặt lại mật khẩu đã được gửi.',
    GOOGLE_AUTH_SUCCESSFULLY: 'Xác thực Google thành công.',
    RESET_PASSWORD_SUCCESSFULLY: 'Đặt lại mật khẩu thành công.',
    CHANGE_PASSWORD_SUCCESSFULLY: 'Thay đổi mật khẩu thành công.',
    UPLOAD_IMAGE_SUCCESSFULLY: 'Tải ảnh lên thành công.',
    DELETE_IMAGE_SUCCESSFULLY: 'Xóa ảnh thành công.'
}

export const getMappedMessage = (originalMessage: string) => {
    return RES_MESSAGE_MAPPING[originalMessage as keyof typeof RES_MESSAGE_MAPPING] ?? originalMessage
}
