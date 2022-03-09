const profileTab =  document.getElementById('profileTab')
const changePasswordTab =  document.getElementById('passwordTab')
const tabs = document.getElementsByClassName('tab')
const tabsTrigger = document.getElementsByClassName('setting-tabs')

const profile =  document.getElementById('profile')
const password =  document.getElementById('password')

profileTab.onclick = function () {
    console.log(profileTab);
    updateTab()
    profileTab.classList.add('active')
    profile.classList.remove('d-none')
    profile.classList.add('d-block')
}

changePasswordTab.onclick = function () {
    updateTab()
    changePasswordTab.classList.add('active')
    password.classList.remove('d-none')
    password.classList.add('d-block')
}

const updateTab = () => {
    for (let num = 0; num < tabsTrigger.length; num++) {
        const tab = tabsTrigger[num];
        tab.classList.remove('active')
        
    }
    for (let num = 0; num < tabs.length; num++) {
        const tab = tabs[num];
        tab.classList.remove('d-block')
        tab.classList.add('d-none')
        
    }
}




