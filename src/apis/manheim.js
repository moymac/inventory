export const ValuationsAuth = async () => {
  let formBody = "grant_type=client_credentials";
  const AuthURL = "https://api.manheim.com/oauth2/token.oauth2";
  const options = {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      authorization: "Basic eTZqdDh2Nnc1MmJrZzQyMm40a3A5Mzd0OnVRRXBEZmJEanI="
    },
    body: formBody
  };
  let response = await fetch(AuthURL, options);
  // console.log(response);
  const jsonResponse = await response.json();
  return jsonResponse.access_token;
};

export const ValuationByVIN = async (token, VIN) => {
  console.log("valuationbyvin", token, VIN);

  const URL = "https://api.manheim.com/valuations/vin/" + VIN;
  const options = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  let response = await fetch(URL, options);
  if (response.status !== 200) {
    console.log(response);
  }
  try {
    let jsonResponse = await response.json();
    console.log(jsonResponse);

    if (jsonResponse.count) return jsonResponse;
  } catch (error) {
    console.log(error);
  }
  return null;
};

export const VehicleDescriptions = async (token, VIN) => {
  const URL = `https://api.manheim.com/descriptions/capture/vin/${VIN}`;
  const options = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  return await fetch(URL, options);
};

// export const Authorization = ()=>{
//     var request = require("request");

// var options = { method: 'POST',
//   url: 'https://api.manheim.com/oauth2/token.oauth2',
//   headers:
//    { 'Postman-Token': '7ee24dd2-5ccd-40f9-ad05-c9cf98f23d0c',
//      'cache-control': 'no-cache',
//      'content-type': 'application/x-www-form-urlencoded',
//      authorization: 'Basic eTZqdDh2Nnc1MmJrZzQyMm40a3A5Mzd0OnVRRXBEZmJEanI=' },
//   form: { grant_type: 'client_credentials', undefined: undefined } };

// request(options, function (error, response, body) {
//   if (error) throw new Error(error);

//   console.log(body);
// });

// }
