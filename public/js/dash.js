const sidebarTrigger = document.getElementById('sidebarTrigger')
// const sidebar = document.getElementById('sidebar')

sidebarTrigger.addEventListener('click' ,  ( ) => {
    console.log(sidebar);
    sidebar.classList.add('d-block')
})