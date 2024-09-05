export default {
	getdate(){
		let date =  start_date.selectedDate.replace(/T|-|:/g,"").slice(0,8)
		return date;
	},
	async formatSearch(){
		let number = phone_number.text.replace("+44", "0").replace(" ", "")
		if(number.slice(0,2) == "44"){
			number = number.replace("44", "0" )
		}
		let date_init = moment(start_date.formattedDate).startOf('day').toISOString()
		let date_end = moment(end_date.formattedDate).endOf('day').toISOString()
		await getCallList.run({
			"phone_number":number,
			"start_date":date_init,
			"end_date":date_end
		})
	},
	async downloadFile(){
		var zip = JSZip()

		for (const file of Call_Information.selectedRows){
			console.log(file.filename)
		}

		for(const file of Call_Information.selectedRows){
			let filename = Helper.removePluses(file.filename)
			
			console.log("downloading " + filename)
			await GetAudioFile.run({"filename" : filename})
			console.log("downloaded " + filename)
			const data = GetAudioFile.data.fileData
			await zip.folder("calls").file(file.filename, data, {base64 : true})
		}
		zip.generateAsync({type:"blob"})
			.then(function (blob) {

			const url = URL.createObjectURL(blob);
			console.log(url)
			download(url, "3CX-Recordings", "application/zip");
		});


		//download("data:audio/wav;base64,"+GetAudioFile.data.fileData, file.filename, 'wav')
	},
	removePluses(rawString){
		const firstBracket = rawString.indexOf("[")
		const secondBracket = rawString.indexOf("]")
		const editString = rawString.slice(firstBracket, secondBracket+1)
		const newString = editString.replace(/([+](?!44))/g," ")	
		const finalString = rawString.replace(editString, newString)
		return finalString
	}
}																						
		// const newString = rawString.replace(/([+](?!44))/g," ")	
		// return newString

