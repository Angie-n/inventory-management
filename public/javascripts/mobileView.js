const menuBtn = document.getElementById('mobile-menu-button');
const nav = document.getElementsByTagName('nav')[0];

if(window.innerWidth <= 830) nav.classList.add('hidden');
else menuBtn.classList.add('hidden');

window.onresize =  e => {
    if(window.innerWidth <= 830) {
      if(menuBtn.classList.contains('hidden')) nav.classList.add('hidden');
      menuBtn.classList.remove('hidden');
    }
    else {
      nav.classList.remove('hidden');
      menuBtn.classList.add('hidden');
    }
};

menuBtn.onclick = e => {
  nav.classList.toggle('hidden');
}