document.addEventListener('DOMContentLoaded', function() {
  
  // init
  init();
  
  // eventListeners
  const selectArea = document.querySelector('#area');
  selectArea.addEventListener('change', () => {
    const area = document.querySelector('#area').value;
    renderPage(area);
  }, false);

  const trendArea = document.querySelector('.js_trendArea');
  trendArea.addEventListener('click', (e) => {
    e.preventDefault()
    const btn = e.target;
    showTrendArea(btn);
  }, false);

  window.addEventListener('scroll', showBtn, false);
  const scrollBtn = document.querySelector('.scrollTop');
  scrollBtn.addEventListener('click', scrollToTop, false);
  
});


// XHR
const xhr = new XMLHttpRequest();
xhr.open('GET', 'https://api.kcg.gov.tw/api/service/get/9c8e1450-e833-499c-8320-29b36b7ace5c', true);
xhr.send();

let landscapes = [];
xhr.addEventListener('load', () => {
  const str = xhr.responseText;
  const arr = JSON.parse(str);
  landscapes = arr['data']['XML_Head']['Infos']['Info'];
  
  renderPage();
});

function init() {
  areaList();
}

// area list
function areaList() {
  const list = document.querySelector('#area');
  const areas = ['楠梓區', '左營區' ,'鼓山區' ,'鹽埕區' ,'三民區', '前金區', '新興區', '苓雅區', '前鎮區', '小港區', '旗津區', '鳳山區', '鳥松區', '仁武區', '大社區', '大樹區', '大寮區', '林園區', '岡山區', '橋頭區', '路竹區', '燕巢區', '阿蓮區', '田寮區', '梓官區', '彌陀區', '永安區', '湖內區', '茄萣區', '旗山區', '美濃區', '內門區', '杉林區', '甲仙區', '六龜區', '那瑪夏區', '桃源區', '茂林區'];
  
  let str = '';
  const len = areas.length;
  for (let i = 0; i < len; i++) {
    str += `<option value="${areas[i]}">${areas[i]}</option>`;
  }
  list.innerHTML = '<option value="default">- - 請選擇行政區 - -</option>' + str;
}

function landscapeFilter(area) {
  if (area === 'default') return landscapes;
  area = new RegExp(area);
  const place = landscapes.filter(item => area.test(item.Add));
  return place;
}

// render content
function createList(area) {
  const ls = landscapeFilter(area);
  const len = ls.length;

  let ticket = '';
  let str ='';
  let landscapeList = [];
  for (let i = 0; i < len; i++) {
    if (ls[i].Ticketinfo === '') {
      ticket = '免費參觀';
    } else {
      ticket = '';
    }

    str += `
    <li>
      <header class="banner" style="background:url(${ls[i].Picture1})center;">
        <h3>${ls[i].Name}</h3>
        <h4>${area}</h4>
      </header>
      <div class="locationInfo">
        <div class="openhour">${ls[i].Opentime}</div>
        <div class="address">${ls[i].Add}</div>
        <div class="tel"><a href="tel:${ls[i].Tel}">+${ls[i].Tel}</a></div>
        <div class="ticket">${ticket}</div>
      </div>
    </li>`;

    if (i + 1 === 6 || (i + 1) % 6 === 0) {
      landscapeList.push(str);
      str = '';
      continue;
    } 
  }
  landscapeList.push(str);
  return landscapeList;
}

function renderPage(selected = 'default') {
  const locationList = document.querySelector('.js_locationList');
  const title = document.querySelector('.js_areaTitle');
  const pageNumber = document.querySelector('.js_pageNumber');
  
  const area = (selected === 'default') ? '全部景點' : selected;
  title.innerHTML = area;

  const pageList = createList(selected);
  locationList.innerHTML = pageList[0];

  const len = pageList.length;
  let p = '';
  for (let i = 1; i <= len; i++) {
    p += `<li><a href="#">${i}</a></li>`;
  }
  pageNumber.innerHTML = p;

  hideLoadingAni();
}

function showTrendArea(btn) {
  if (btn.nodeName !== 'A') return;
  const trend = btn.getAttribute('data-trend');
  renderPage(trend);
}

// scroll top with jQuery
function showBtn() {
  if($(this).scrollTop() > 300) {
    $('.scrollTop').fadeIn();
  } else {
    $('.scrollTop').fadeOut();
  }
}

function scrollToTop(e) {
  e.preventDefault();
  $('body, html').animate({
    scrollTop: 0
  }, 300);
}

// loading animate 
function hideLoadingAni() {
  const loader = document.querySelector('.js_loader');
  loader.style.display = 'none';
}