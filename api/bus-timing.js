require('dotenv').config();

const axios = require('axios');
const moment = require('moment');

let baseURL = 'http://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2';

module.exports = {
	/**
   * Get all the bus timing at the specific bus stop
   * @param {*} busStopCode
   */
	getBusStopTimings: async (busStopCode) => {
		let bsc = String(busStopCode);

		const busCodeTest = RegExp(/(\b\d{5}\b)/g);

		if (busCodeTest.test(bsc) === true) {
			try {
				const response = await axios.get(baseURL, {
					params: {
						BusStopCode: busStopCode
					},
					headers: {
						Accept: 'application/json',
						AccountKey: process.env.LTA_API_KEY
					}
				});

				const data = response.data.Services;

				if (data.length == 0) {
					return 'No data available\nReasons may be the bus stop code is wrong\nOr buses are not in operation';
				} else {
					let array = [];
					for (let i = 0; i < data.length; i++) {
						const serviceNo = data[i].ServiceNo;
						const estimatedTime = moment().to(data[i].NextBus.EstimatedArrival);
						let busTimes = `${serviceNo} ${estimatedTime}`;

						array = [ ...array, busTimes ];
					}
					return array.join('\n');
				}
			} catch (err) {
				return err;
			}
		} else {
			return `Bus stop code not in a valid format.
A valid format is 5 numbers. (Eg: 83139)`;
		}
	},
	/**
   * Get the specific bus timing
   * @param {*} busStopCode
   * @param {*} busServiceNo
   */
	getBusTiming: async (busStopCode, busServiceNo) => {
		let bsc = String(busStopCode);

		const busCodeTest = RegExp(/(\b\d{5}\b)/g);
		if (busCodeTest.test(bsc) === true) {
			await axios
				.get(baseURL, {
					params: {
						BusStopCode: busStopCode,
						ServiceNo: busServiceNo
					},
					headers: {
						Accept: 'application/json',
						AccountKey: process.env.LTA_API_KEY
					}
				})
				.then((res) => {
					console.log(res.data.Services.ServiceNo);
				})
				.catch((err) => {
					console.log(err);
				});
		} else {
			return false;
		}
	},
	getBusNumber: async (busStopCode) => {
		let bsc = String(busStopCode);

		const busCodeTest = RegExp(/(\b\d{5}\b)/g);

		if (busCodeTest.test(bsc) === true) {
			try {
				const response = await axios.get(baseURL, {
					params: {
						BusStopCode: busStopCode
					},
					headers: {
						Accept: 'application/json',
						AccountKey: process.env.LTA_API_KEY
					}
				});
				const data = response.data.Services;
				let serviceNo = [];
				for (let i = 0; i < data.length; i++) {
					serviceNo.push(data[i].ServiceNo);
				}
				return serviceNo;
			} catch (err) {
				console.log(err);
			}
		}
	}
};
