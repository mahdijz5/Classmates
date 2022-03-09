
// document.getElementById('uploadImg').onclick= ()=> {
//     const uploadInp = document.getElementById('uploadInp')
//     const urlImg = document.getElementById('foo')

//     const xhttp = new XMLHttpRequest()

//     xhttp.onreadystatechange = () => {
//         if(xhttp.status == 200) {
//             urlImg.innerHTML = xhttp.responseText
//         }else{
//             urlImg.innerHTML = xhttp.responseText
//         }
//     }

//     xhttp.open('POST','/admin/upload-img')

//     const formData = new FormData()

//     if(uploadInp.files.length > 0) {
//         formData.append('image',uploadInp.files[0])
//         xhttp.send(formData)
//     }else {
//         urlImg.innerHTML = 'Please choose an image'
//     }
// }

document.getElementById('uploadImg').onclick = () => {
    const uploadInp = document.getElementById('uploadInp')
    const urlImg = document.getElementById('foo')

    const xhttp = new XMLHttpRequest()
    
    xhttp.onreadystatechange = () => {
        if(xhttp.status == 200){
            urlImg.innerHTML = xhttp.responseText
        }else {
            urlImg.innerHTML = xhttp.responseText
        }
    }

    xhttp.open('POST','/admin/upload-img')

    const formData = new FormData()

    if(uploadInp.files.length > 0 ) {
        formData.append('image',uploadInp.files[0])
        xhttp.send(formData)
    }else {
        urlImg.innerHTML = 'Please Choose an image'
    }
}






















