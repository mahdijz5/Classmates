const replyBtn = document.querySelectorAll('#replyBtn'),
replyForm = document.querySelectorAll('#replyForm')

console.log(replyBtn);
for (let index = 0; index < replyBtn.length; index++) {
    const btn = replyBtn[index];
    btn.addEventListener('click',()=> {
        replyBtn.classList = 'd-none'
        replyForm.classList = 'd-block'
    })
}

replyForm.addEventListener('submit',(e)=> {
    replyBtn.classList  = 'm-2 btn btn-info text-light'
    replyForm.classList = 'd-none'
})

