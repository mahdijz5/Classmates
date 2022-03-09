const Yup = require('yup')

exports.schema = Yup.object().shape({
    text: Yup.string().required().max(2000,'پیام شما نمیتواند از 2000 کارکتر بیشتر باشد'),
    post: Yup.string().required(),
    reply : Yup.string().max(2000,'پیام شا نمیتواند از 2000 کارکتر بیشتر باشد')
})