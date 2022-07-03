const Yup = require('yup');

exports.schema = Yup.object().shape({
    username : Yup.string().required("لطفا نام کاربری خود را وارد کنید.").min(2,"نام کاربری وارد شده کوتاه است").max(80,"نام کاربری وارد شده کوچک است."),
    email : Yup.string(),
    password : Yup.string().required("لطفا رمز خود را وارد کنید").min(4,"رمز عبور شما خیلی کوتا است.").max(80,"رمز عبور شما خیلی طولانی است"),
    confirmPassword : Yup.string().required("لطفا تکرار رمز خود را وارد کنید").oneOf([Yup.ref('password'),null],"تکرار رمز عبور اشتباه است."),
    profileImg : Yup.object().shape({
        size : Yup.number().max(3000000,'شما نمیتوانید بیشتر از 3 مگابایت اپلود کنید.'),
        name : Yup.string(),
        mimeType : Yup.mixed().oneOf(['png','jpeg'],'فقط از پسوند png  و jpeg پشتیبانی میشود'),

    })
})