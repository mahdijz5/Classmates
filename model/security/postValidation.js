const Yup = require('yup');

exports.schema = Yup.object().shape({
    title: Yup.string().required('لطفا عنوانی را اتنخاب کنید.').max(249,"عنوان شما خیلی طولانی است"),
    body: Yup.string().required('لطفا برای پست خود متنی را بنویسید.').min( 10,"متن نوشته شده خیلی کوتاه است"),
    stauts : Yup.mixed().oneOf(
        ['private', 'public'],
        'لطفا یکی از وضعیت ها را انتخاب کنید.'),

    grade : Yup.mixed().oneOf(['firstbas','secondbas','thirdBas','fourth','fifthBas','sixthtBas','seventh','eighth','ninethe','others'],'لطفا پایه مورد نظر را انتخاب نمایید'),

    book : Yup.mixed().oneOf(['quran','farsi','oloom','math','payam','motaleat','tafakor','fanavari','arabic','english','honar','amadegi','others'],"لطفا کتاب مورد نظر را انتخاب نمایید"),

    thumbnail : Yup.object().shape({
        size : Yup.number().max(3000000,'شما نمیتوانید بیشتر از 3 مگابایت اپلود کنید.'),
        name : Yup.string().required('لطا عکس بند انگشتی را انتخاب کنید.'),
        mimeType : Yup.mixed().oneOf(['png','jpeg'],'فقط از پسوند png  و jpeg پشتیبانی میشود'),

    })
})