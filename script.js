// ==UserScript==
// @name         Bot for Yandex
// @namespace    http://tampermonkey.net/
// @version      0.92
// @description  try to take over the world!
// @author       Arseny
// @match        https://yandex.ru/*
// @match        https://xn----7sbab5aqcbiddtdj1e1g.xn--p1ai/*
// @match        https://crushdrummers.ru/*
// @grant        none
// ==/UserScript==

function getRandom(min, max) {
	return Math.floor(Math.random() * (max - min) + min);
}

function getCookie(name) {
	let matches = document.cookie.match(
		new RegExp('(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)')
	);
	return matches ? decodeURIComponent(matches[1]) : undefined;
}

let sites = {
	'xn----7sbab5aqcbiddtdj1e1g.xn--p1ai': [
		'Гобой',
		'Саксофон',
		'Валторна',
		'Фагот',
		'Флейта',
		'Как звучит флейта',
		'Скрипка'
	],
	'crushdrummers.ru': [ 'Барабанное шоу', 'Шоу барабанщиков москва', 'Заказать барабанное шоу' ]
};
let site = Object.keys(sites)[getRandom(0, Object.keys(sites).length)];
let keywords = sites[site];
let keyword = keywords[getRandom(0, keywords.length)];
let yandexInput = document.getElementById('text');
let button = document.getElementsByClassName('button_theme_websearch')[0];
let links = document.links;
//let links = document.getElementsByClassName('link link_theme_normal organic__url');
//let links = document.getElementsByClassName("link link_theme_normal organic__url organic__url_type_multiline i-bem link_js_inited");
if (yandexInput != null) {
	// после первого нажатия на кнопку "Найти" = null
	if (button != undefined) {
		// после первого нажатия на кнопку "Найти" = undefined
		let i = 0;
		//document.cookie = "site"+site;
		document.cookie = 'site=' + site;
		let timerId = setInterval(() => {
			let yandexInputs = document.getElementsByClassName('input__control mini-suggest__input')[0];
			yandexInputs.value += keyword[i++];
			if (i == keyword.length) {
				clearInterval(timerId);
				button.click();
			}
		}, 500);
	}
} else if (location.hostname == 'yandex.ru') {
	let flag = true;
	//let numPage = document.getElementsByClassName("link link_theme_none link_target_serp pager__item pager__item_kind_page i-bem link_js_inited")[0].innerText;
	let numPage = document.getElementsByClassName(
		'link link_theme_none link_target_serp pager__item pager__item_kind_page i-bem'
	)[0].textContent;
	site = getCookie('site');
	let links = document.getElementsByClassName("link link_theme_normal organic__url");
	// ==== цикл поиска необходимый ссылки ========
	for (let i = 0; i < links.length; i++) {
		let link = links[i];
		if (link.href.indexOf(site) != -1) {
			flag = false;
			link.removeAttribute('target');
			setTimeout(() => link.href.click(), 2000);
			break;
		} //else {
			//let nextPage = document.querySelector(`a[aria-label="Следующая страница"]`);
			//nextPage.click();
    //}
	}
  // =========== конец цикла ======================
  let nextPage = document.querySelector(`a[aria-label="Следующая страница"]`);
			nextPage.click();
	if (numPage == '10') location.href = 'https://yandex.ru'; // если достигли 10-ти страниц возвращаемся на yandex.ru
	if (flag) setTimeout(() => link.click(), 2000);
} else {
	if (getRandom(0, 100) >= 80)
		location.href = 'https://yandex.ru'; // с 20% долей вероятности возврщаемся на yandex.ru
	else
		setInterval(() => {
			let link = links[getRandom(0, links.length)];
			if (link.href.indexOf(location.hostname) != -1) link.click();
		}, 500);
}
