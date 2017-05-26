const generateContent = (queryTerm = '', matching = [], totalLength = 999)=>{
	if (queryTerm.trim().length) {
		queryTerm = `"${queryTerm}"`
	} else{
		queryTerm = 'all'
	}
	let searchResult = '<div class="search-table-no-results">No Matching Records Found</div>'
	if (matching.length){
		const searchRows = matching.map((item)=> `<div class="search-table-row">${item}</div>`)
								   .reduce((prev, next)=>prev+next, '')
		searchResult = `<div class="search-table-rows">${searchRows}</div>`
	}
	return(
		`<div class="modal-header">Please Select</div>
			<div class="modal-body">
				<p class="results-text">Results for ${queryTerm}</p>
				<div class="results-area">
					<div class="search-table">
						<div class="search-table-header-row">Name</div>
						${searchResult}
					</div>
				</div>
				<p class="entries-text">${matching.length} of ${matching.length} entries</p>
			</div>`
	)
}

export default generateContent