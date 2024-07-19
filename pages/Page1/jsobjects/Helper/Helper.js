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
		for( const file of Call_Information.selectedRows){
			await GetAudioFile.run({"filename" : file.filename})
			const data = GetAudioFile.data.fileData


			zip.folder("calls").file(file.filename, data, {base64 : true})
		}



		zip.generateAsync({type:"blob"})
			.then(function (blob) {

			const url = URL.createObjectURL(blob);
			console.log(url)
			download(url, "3CX-Recordings", "application/zip");
		});


		//download("data:audio/wav;base64,"+GetAudioFile.data.fileData, file.filename, 'wav')
	}
}
