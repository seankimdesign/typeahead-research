import 'imports-loader?define=>false!./modules/typeahead.jquery.js'
import * as Bloodhound from 'imports-loader?define=>false!./modules/bloodhound'
import 'imports-loader?define=>false!./modules/featherlight.min'
import generateContent from './modules/modalcontent'
import importedData from './modules/data'
import logoSvg from './modules/typeahead-svg'

import './styles/featherlight.min.css'
import './styles/fonts.css'
import './styles/base.css'


;(()=>{

	let modal

	const cap = 'cap'
	const esp = 'esp'
	const grn = 'grn'
	const tabCap = {id: cap, elem: '<div class="tab-button tab-button-cap" data-type="cap">Cappuccino</div>'}
	const tabEsp = {id: esp, elem: '<div class="tab-button tab-button-esp" data-type="esp">Espresso</div>'}
	const tabGrn = {id: grn, elem: '<div class="tab-button tab-button-grn" data-type="grn">Green Tea Latte</div>'}
	const getTestOrder = (id)=>{
		const orders = {
			'827362': [tabCap, tabEsp, tabGrn],
			'114583': [tabEsp, tabGrn, tabCap],
			'276329': [tabGrn, tabCap, tabEsp],
		}
		if (orders.hasOwnProperty(id)) return orders[id]
		return orders['827362']
	}

	const pageMode = getParameter('mode') || ""
	const initialPageObj =  getTestOrder(pageMode)[0]

	const useData = Array.isArray(importedData) ? importedData : ['Apple']

	const typer= $('#typer')
	const notFoundTags = (o)=>`<div class="tt-notfound">No matching results for <span>${o.query}</span></div>`
	const viewAll = ()=>`<div class="tt-viewall tt-selectable">View All</div>`
	const dataSource = new Bloodhound({
		local: [...useData],
		queryTokenizer: Bloodhound.tokenizers.whitespace,
		datumTokenizer: Bloodhound.tokenizers.whitespace
	})


	const prepPage = ()=>{
		const tabButtonElements = getTestOrder(pageMode).reduce((p,n)=>{
			return p+n.elem
		},'')
		$('div.tabs').html(tabButtonElements)
		$('.header').html(logoSvg)
	}
	prepPage()


	const initView = (view = cap)=>{
		const elem = $('.tab-button[data-type="'+view+'"]')
		let typeConfig = {
			name: 'typedata',
			source: dataSource,
			limit: 10,
			templates: {
				notFound: notFoundTags
			}
		}
		let renderFn = (e)=>{
			$(e.target).parent().find('.tt-selectable:first').addClass('tt-cursor')
		}

		$('.active').removeClass('active')
		elem.addClass('active')
		$('body').attr('class', view)

		switch (view){
			case cap:
				typeConfig.templates.footer = viewAll
				break
			case esp:
				break
			case grn:
				typeConfig.limit = 11
				renderFn = (e)=>{
					let hintGroup = $(e.target).parent()
					hintGroup.find('.tt-selectable:first').addClass('tt-cursor')
					if (hintGroup.find('.tt-selectable').length > 10){
						hintGroup.find('.tt-selectable').eq(10).removeClass('tt-selectable').hide().after(viewAll())
					}
				}
				break
		}

		typer.typeahead('destroy')
		typer.val('')
		typer.typeahead({
			minLength: 2,
			highlight: true,
			autoselect: true
		}, typeConfig)
		typer.bind('typeahead:render', renderFn)

	}
	initView(initialPageObj.id)


	const bindHandlers = ()=>{
		typer.on('keyup', (e)=>{
			let viewall = $('.tt-viewall')
			if (e.key === 'Enter' || e.which === 13){
				if (viewall && viewall.hasClass('tt-cursor')){
					triggerModal()
				} else if (typer.typeahead('val').trim() === ''){
					triggerModal()
				}
			}
		})
		$(document).on('click', '.tt-viewall', triggerModal)
		$(document).on('click', '.search-table-row', (e)=>{
			const elem = $(e.target)
			if (modal){
				typer.typeahead('val', elem.text())
				modal.close()
			}
		})
		$('.tab-button').on('click', (e)=>{
			const elem = $(e.target)
			if (!elem.hasClass('active')){
				initView(elem.data().type, elem)
			}
		})
		$('.modal-trigger').on('click', triggerModal)
	}
	bindHandlers()


	function triggerModal(){
		const curVal = typer.typeahead('val').trim()
		if (curVal === ''){
			modal = $.featherlight(generateContent(curVal, useData, useData.length))
		} else {
			dataSource.search(curVal, (matching) => {
				modal = $.featherlight(generateContent(curVal, matching, useData.length))
			})
		}
	}

	function getParameter(name, url) {
		if (!url) url = window.location.href;
		name = name.replace(/[\[\]]/g, "\\$&");
		let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
			results = regex.exec(url);
		if (!results) return null;
		if (!results[2]) return '';
		return decodeURIComponent(results[2].replace(/\+/g, " "));
	}

})()