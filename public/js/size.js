const sidebar = document.getElementById('sidebar')


sidebar.style.height = `${Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)}px`

function reportWindowSize() {
    console.log(sidebar.style.width);
    sidebar.style.height = `${Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)}px`
}

window.onresize = reportWindowSize;
