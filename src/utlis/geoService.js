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
  
}

export default geoLocation;