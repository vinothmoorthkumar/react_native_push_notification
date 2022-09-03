import axios from "axios";

const API= "AIzaSyD2oP_9oLhqRNDnH3VHsmGnqJtZ0Xi0C88"
const geoLocation = {
    suggestions: async function (q) {
        return new Promise(async function(resolve, reject) {
            var config = {
                method: 'get',
                url: `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${q}&types=geocode&key=${API}`,
                headers: {}
            };
            let results = await axios(config)
            resolve(results)
          });
    },
    nearBy: async function (placeId) {
        return new Promise(async function(resolve, reject) {
            var config = {
                method: 'get',
                url: `https://maps.googleapis.com/maps/api/geocode/json?place_id=${placeId}&key=${API}`,
                headers: {}
            };
            let results1 = await axios(config)
            let latLon=results1.data.results[0].geometry.location
            if(results1.data && results1.data.results.length>0 && results1.data.results[0].geometry){
                var config2 = {
                    method: 'get',
                    url: `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latLon.lat}%2C${latLon.lng}&radius=1500&key=${API}`,
                    headers: {}
                };
                let result2 = await axios(config2)

                resolve(result2.data.results)
            }
      
          });
    },
    getPhotosByRef: async function (ref) {
        return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=60&photo_reference=${ref}&key=${API}`;
    },
    thingstodo: async function (place) {
        return new Promise(async function(resolve, reject) {
            try{
                var config = {
                    method: 'get',
                    url: `https://maps.googleapis.com/maps/api/place/textsearch/json?query=top+sights+in+${place}&language=en&key=${API}`,
                    // url: `https://maps.googleapis.com/maps/api/place/textsearch/json?query=things+to+do+in+${place}&language=en&key=${API}`,
                    headers: {}
                };
                let results1 = await axios(config)
                resolve(results1.data.results)
            }catch(err){
                reject(err)
            }


          });
    },
  
}

export default geoLocation;