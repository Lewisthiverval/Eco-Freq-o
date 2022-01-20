////// GEOLOCATES USER > FINDS POSTCODE > RETURN LIVE CARBON EMISSIONS FOR THAT POSTCODE ///////
/////// UNFORTUNATELY THE DATA RETRIEVED ISNT BEING USED,
/////RAN OUT OF TIME TO FIND SOMETHING COOL TO DO WITH IT//////

let long;
let lat;
let postcode;
let carbonEmissionForecast;

const getGeoLocation = () =>
  new Promise((resolve, reject) =>
    navigator.geolocation.getCurrentPosition(resolve, reject)
  );

const getPostCode = (longitude, latitude) => {
  console.log(
    `https://api.postcodes.io/postcodes/lon/${longitude}/lat/${latitude}`
  );
  return fetch(
    `https://api.postcodes.io/postcodes/lon/${longitude}/lat/${latitude}`
  );
};

const getRegionalData = (postcode) =>
  fetch(`https://api.carbonintensity.org.uk/regional/postcode/${postcode}`);

if ("geolocation" in navigator) {
  getGeoLocation()
    .then((x) => {
      console.log({ x });
      return x;
    })
    .then((x) => getPostCode(x.coords.longitude, x.coords.latitude))
    .then((x) => x.json())
    .then((x) => {
      console.log({ x });
      return x.result[0].postcode;
    })
    .then((postcode) => getRegionalData(postcode.split(" ")[0]))
    .then((x) => x.json())
    .then(
      (x) => (carbonEmissionForecast = x.data[0].data[0].intensity.forecast)
    )
    .then((x) => console.log(carbonEmissionForecast));
} else {
  console.log("is not available");
}
