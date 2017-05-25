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

	const cap = 'cap'
	const esp = 'esp'
	const grn = 'grn'

	const useData = Array.isArray(importedData) ? importedData : ['Apple']

	const typer= $('#typer')
	const notFoundTags = (o)=>`<div class="tt-notfound">No matching results for <span>${o.query}</span></div>`
	const viewAll = ()=>`<div class="tt-viewall tt-selectable">View All</div>`
	const dataSource = new Bloodhound({
		local: [...useData],
		queryTokenizer: Bloodhound.tokenizers.whitespace,
		datumTokenizer: Bloodhound.tokenizers.whitespace
	})

	let modal

	$('.modal-trigger').on('click', triggerModal)

	$('.header').html(logoSvg)

	const initView = (view = cap, elem)=>{

		$('.active').removeClass('active')
		elem.addClass('active')
		$('body').attr('class', view)

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

		switch (view){
			case cap:
				typeConfig.templates.footer = viewAll
				break
			case esp:
				break
			case grn:
				typeConfig.limit = 11
				renderFn = (e)=>{
					console.log('> rendered')
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

	initView(cap, $('.active'))

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

	$('.tab-button').on('click', (e)=>{
		const elem = $(e.target)
		if (!elem.hasClass('active')){
			initView(elem.data().type, elem)
		}
	})

	$(document).on('click', '.search-table-row', (e)=>{
		const elem = $(e.target)
		if (modal){
			typer.typeahead('val', elem.text())
			modal.close()
		}
	})

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

})()