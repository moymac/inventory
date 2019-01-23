const mainURL = "";
// const apiKEY = "AIzaSyB_e7LpjDy5Nopf3DRrs1endVkQJ3lTCv4";
const apiKEY = "AIzaSyAN-mJR-d6rmF4h8VNgndC1-6XGS1pH9Mk";
const apiDriveKEY = "AIzaSyAy9VVXHSpS2IJpptzYtGbLP3-3_l0aBk4";
const clientSecret = "81uIUeVHTS0SHgalp39kA6Cf";
const url = "https://www.googleapis.com/drive/v3";
const uploadUrl = "https://www.googleapis.com/upload/drive/v3";
const androidClientId =
  "544692012409-panp8ak109jkqp46h8ju0vb0b9omnbnd.apps.googleusercontent.com";
const iosClientId =
  "544692012409-8cafh0jufk41bf4a10ht39fe4qrg6app.apps.googleusercontent.com";
import { Alert, AsyncStorage, Platform } from "react-native";
import Expo, { FileSystem } from "expo";
const barcodeID = "1AujvrsRW7vxqFCO2a0ozvF_3QQIEU32yyTI51ccXLTU";
const reconID = "1c1FRKFhlixxteuGC1SiWbD30BMiNOOwAHn3Im-0uGJk";
const shippingID = "1qCMyJKCE7Ym12o_s4YX40VNfwQYOyhIXshJdKsks_N0";
export async function signInWithGoogleAsync() {
  try {
    const result = await Expo.Google.logInAsync({
      androidClientId: androidClientId,
      iosClientId: iosClientId,
      scopes: [
        "profile",
        "email",
        "https://www.googleapis.com/auth/drive.file",
        "https://www.googleapis.com/auth/drive",
        "https://www.googleapis.com/auth/spreadsheets"
      ]
    });
    //  console.log("fetchresult", result);
    if (result.type === "success") {
      //AsyncStorage.setItem("accessToken", JSON.stringify(token));
      //    console.log("signtoken", result.accessToken);
      return result.accessToken;
    } else {
      return { cancelled: true };
    }
  } catch (e) {
    console.log(e);
    return { error: true };
  }
}

export async function getLatestAccessToken() {
  let data = await AsyncStorage.getItem("accessToken");
  return await JSON.parse(data);
}
export async function refreshToken(refToken) {
  try {
    let platformclientID =
      Platform.OS === "ios" ? iosClientId : androidClientId;
    //console.log(data);
    let response = await fetch(
      "https://www.googleapis.com/oauth2/v4/token" +
        "?client_id=" +
        encodeURIComponent(platformclientID) +
        "&refresh_token=" +
        encodeURIComponent(refToken) +
        "&grant_type=refresh_token",

      {
        method: "POST"
      }
    );
    console.log("response", response);

    if (response.status != 200) {
      console.log("refreshToken not 200", response);
    }
    let tokens = await response.json();
    console.log(tokens);

    // let tokens = await JSON.parse(response._bodyInit);
    //  console.log("refreshresponse", tokens.access_token);

    //tokens = await JSON.parse(response._bodyInit).values;
    //console.log("tokens.access_token", tokens.access_token);
    if (tokens.access_token) {
      await AsyncStorage.setItem(
        "accessToken",
        await JSON.stringify(tokens.access_token)
      );
    }
    return tokens.access_token;
  } catch (error) {
    console.error(error.message);
    return null;
  }
}

export async function appendToSheet(accessToken, sheetName, valueArray) {
  //  accessToken = signInWithGoogleAsync();
  try {
    let data = JSON.stringify({
      values: [valueArray]
    });
    let response = await fetch(
      "https://sheets.googleapis.com/v4/spreadsheets/" +
        barcodeID +
        "/values/" +
        sheetName +
        "!A2:append?includeValuesInResponse=false&insertDataOption=INSERT_ROWS&valueInputOption=RAW&key=" +
        apiKEY,

      {
        method: "POST",
        headers: { Authorization: "Bearer " + accessToken },
        body: data
      }
    );
    if (response.status != 200) {
      console.log("appendToSheet not 200", response);
    }
  } catch (error) {
    console.error(error.message);
  }
}
//////////BUILD A CALL TO UPDATE THE PICKED UP STATUS

export async function updatePurchaseListPU(accessToken, row, pickedUp) {
  let data = JSON.stringify({
    values: [[pickedUp]]
  });
  response = await fetch(
    "https://sheets.googleapis.com/v4/spreadsheets/" +
      barcodeID +
      "/values/" +
      "AdesaPurchaseList" +
      "!AL" +
      row +
      "?includeValuesInResponse=true&valueInputOption=RAW&fields=updatedRows&key=" +
      apiKEY,

    {
      method: "PUT",
      headers: { Authorization: "Bearer " + accessToken },
      body: data
    }
  );
  if (response.status != 200) {
    console.log("updateSheet get array not 200", response);
  } else {
    return true;
  }
}

export async function updateShipping(accessToken, arrivedDate, row) {
  let data = JSON.stringify({
    values: [[arrivedDate]]
  });
  const response = await fetch(
    "https://sheets.googleapis.com/v4/spreadsheets/" +
      shippingID +
      "/values/" +
      "Cars shipped" +
      "!AB" +
      row +
      "?includeValuesInResponse=false&valueInputOption=RAW&fields=updatedRows&key=" +
      apiKEY,

    {
      method: "PUT",
      headers: { Authorization: "Bearer " + accessToken },
      body: data
    }
  );
  console.log(response);
}

export async function updateSheet(
  accessToken,
  workBook,
  sheetName,
  searchValue,
  valueArray
) {
  let sheetKey = barcodeID;
  switch (workBook) {
    case "shipping":
      sheetKey = shippingID;
      break;
    case "recon":
      sheetKey = reconID;
      break;
    default:
      sheetKey = barcodeID;
  }

  let data = JSON.stringify({
    values: [valueArray]
  });
  try {
    let range = await fetch(
      "https://sheets.googleapis.com/v4/spreadsheets/" +
        sheetKey +
        "/values/" +
        sheetName +
        "!A2%3AA?dateTimeRenderOption=FORMATTED_STRING&majorDimension=ROWS&valueRenderOption=FORMATTED_VALUE&fields=values&key=" +
        apiKEY,
      {
        method: "GET",
        headers: { Authorization: "Bearer " + accessToken }
      }
    );

    if (range.status != 200) {
      console.log("updateSheet get array not 200", range);
    }
    let rangeJson = await range.json();
    rangevalues = rangeJson.values;
    // rangevalues = await JSON.parse(range._bodyInit).values;
    let i = 2;
    let replaceRow = 0;
    let response;

    for (let row of rangevalues) {
      //  console.log("foundupdateRow", row[0].toLowerCase());
      if (row[0].toLowerCase() == searchValue.toLowerCase()) {
        replaceRow = i;
      }
      i++;
    }
    if (replaceRow != 0) {
      response = await fetch(
        "https://sheets.googleapis.com/v4/spreadsheets/" +
          sheetKey +
          "/values/" +
          sheetName +
          "!A" +
          replaceRow +
          "?includeValuesInResponse=true&valueInputOption=RAW&fields=updatedRows&key=" +
          apiKEY,

        {
          method: "PUT",
          headers: { Authorization: "Bearer " + accessToken },
          body: data
        }
      );
    } else {
      response = await fetch(
        "https://sheets.googleapis.com/v4/spreadsheets/" +
          sheetKey +
          "/values/" +
          sheetName +
          "!A2:append?includeValuesInResponse=false&insertDataOption=INSERT_ROWS&valueInputOption=RAW&key=" +
          apiKEY,

        {
          method: "POST",
          headers: { Authorization: "Bearer " + accessToken },
          body: data
        }
      );
    }
    if (response.status != 200) {
      console.log("updateSheet not 200", response);
    }
  } catch (e) {
    console.log(e);
  }
}

export async function getUserType(userNameSearch) {
  let data = await AsyncStorage.getItem("accessToken");
  let accessToken = await JSON.parse(data);

  let range = await fetch(
    "https://sheets.googleapis.com/v4/spreadsheets/" +
      barcodeID +
      "/values/Users!A2%3AB30?dateTimeRenderOption=FORMATTED_STRING&majorDimension=ROWS&valueRenderOption=FORMATTED_VALUE&fields=values&key=" +
      apiKEY,
    {
      method: "GET",
      headers: { Authorization: "Bearer " + accessToken }
    }
  );
  let rangeJson = await range.json();
  let rangevalues = rangeJson.values;
  // let rangevalues = JSON.parse(range._bodyInit).values;
  for (let row of rangevalues) {
    if (row[0].toLowerCase() == userNameSearch.toLowerCase()) return row[1];
  }
}

export async function getUserPermissions(userNameSearch) {
  let data = await AsyncStorage.getItem("accessToken");
  let accessToken = await JSON.parse(data);
  // console.log("accessToken", accessToken);

  try {
    let range = await fetch(
      "https://sheets.googleapis.com/v4/spreadsheets/" +
        barcodeID +
        "/values/UserPermissions!A2%3AU50?dateTimeRenderOption=FORMATTED_STRING&majorDimension=ROWS&valueRenderOption=FORMATTED_VALUE&fields=values&key=" +
        apiKEY,
      {
        method: "GET",
        headers: { Authorization: "Bearer " + accessToken }
      }
    );
    if (range.status !== 200) {
      console.log("PROBLEM?", range);
    }
    let rangeJson = await range.json();
    let rangevalues = await rangeJson.values;

    for (let row of rangevalues) {
      // console.log(row);
      if (row[0].toLowerCase() == userNameSearch.toLowerCase()) return row;
    }
    return null;
  } catch (e) {
    console.log(e);
  }
}

export async function getUserList() {
  let data = await AsyncStorage.getItem("accessToken");
  let accessToken = await JSON.parse(data);

  let response = await fetch(
    "https://sheets.googleapis.com/v4/spreadsheets/" +
      barcodeID +
      "/values/Users!A2%3AB30?dateTimeRenderOption=FORMATTED_STRING&majorDimension=ROWS&valueRenderOption=FORMATTED_VALUE&fields=values&key=" +
      apiKEY,
    {
      method: "GET",
      headers: { Authorization: "Bearer " + accessToken }
    }
  );
  responseJson = await response.json();
  return responseJson.values;
}
export async function updateUserList(accessToken, newList) {
  let jsonbody = JSON.stringify({
    valueInputOption: "USER_ENTERED",
    data: [
      {
        range: "A2",
        values: newList
      }
    ]
  });
  let response = await fetch(
    "https://sheets.googleapis.com/v4/spreadsheets/" +
      barcodeID +
      "/values:batchUpdate",

    {
      method: "POST",
      headers: { Authorization: "Bearer " + accessToken },
      body: jsonbody
    }
  );
}

export async function getUserPermissionList() {
  let data = await AsyncStorage.getItem("accessToken");
  let accessToken = await JSON.parse(data);

  let response = await fetch(
    "https://sheets.googleapis.com/v4/spreadsheets/" +
      barcodeID +
      "/values/UserPermissions!A1%3AU50?dateTimeRenderOption=FORMATTED_STRING&majorDimension=ROWS&valueRenderOption=FORMATTED_VALUE&fields=values&key=" +
      apiKEY,
    {
      method: "GET",
      headers: { Authorization: "Bearer " + accessToken }
    }
  );
  responseJson = await response.json();
  return responseJson.values;
}
export async function updateUserPermissionList(accessToken, newList) {
  let jsonbody = JSON.stringify({
    valueInputOption: "USER_ENTERED",
    data: [
      {
        range: "UserPermissions!A2",
        values: newList
      }
    ]
  });
  let response = await fetch(
    "https://sheets.googleapis.com/v4/spreadsheets/" +
      barcodeID +
      "/values:batchUpdate",

    {
      method: "POST",
      headers: { Authorization: "Bearer " + accessToken },
      body: jsonbody
    }
  );
  if (response.status != 200) {
    console.log("updateUserPermissionList not 200", response);
  } else {
    console.log("permission update successful");
    return true;
  }
}
export async function updateUserPermissions(accessToken, row, newList) {
  let jsonbody = JSON.stringify({
    valueInputOption: "USER_ENTERED",
    data: [
      {
        range: "UserPermissions!C" + row,
        values: newList
      }
    ]
  });
  let response = await fetch(
    "https://sheets.googleapis.com/v4/spreadsheets/" +
      barcodeID +
      "/values:batchUpdate",

    {
      method: "POST",
      headers: { Authorization: "Bearer " + accessToken },
      body: jsonbody
    }
  );
  if (response.status != 200) {
    console.log("updateUserPermissionList not 200", response);
  } else {
    console.log("permission update successful");
    return true;
  }
}

export async function getAllShipping() {
  console.log("getAllShipping");

  let data = await AsyncStorage.getItem("accessToken");
  let accessToken = await JSON.parse(data);
  // console.log("accessToken");

  try {
    let range = await fetch(
      "https://sheets.googleapis.com/v4/spreadsheets/" +
        shippingID +
        "/values/Cars%20Shipped!B2%3AAF?dateTimeRenderOption=FORMATTED_STRING&majorDimension=ROWS&valueRenderOption=FORMATTED_VALUE&fields=values&key=" +
        apiKEY,
      {
        method: "GET",
        headers: { Authorization: "Bearer " + accessToken }
      }
    );
    if (range.status !== 200) {
      console.log(range);
    }
    const jsonResponse = await range.json();
    // // console.log("range", jsonResponse);
    const shippingString = JSON.stringify(jsonResponse);
    await FileSystem.writeAsStringAsync(
      FileSystem.documentDirectory + "fullShippingList",
      shippingString
    );
    // return jsonResponse;
    // await AsyncStorage.setItem("fullShipping", range._bodyInit);
    console.log("shippinglistsaved");

    // let rangevalues = JSON.parse(range._bodyInit).values;
  } catch (error) {
    console.log(error);
  }
}
export async function getAllShippingOLD() {
  console.log("getAllShipping");

  let data = await AsyncStorage.getItem("accessToken");
  let accessToken = await JSON.parse(data);
  // console.log("accessToken");

  try {
    let range = await fetch(
      "https://sheets.googleapis.com/v4/spreadsheets/" +
        shippingID +
        "/values/Cars%20Shipped!B2%3AAF?dateTimeRenderOption=FORMATTED_STRING&majorDimension=ROWS&valueRenderOption=FORMATTED_VALUE&fields=values&key=" +
        apiKEY,
      {
        method: "GET",
        headers: { Authorization: "Bearer " + accessToken }
      }
    );
    const jsonResponse = await range.json();
    // console.log("range", jsonResponse);

    return jsonResponse;
    // await AsyncStorage.setItem("fullShipping", range._bodyInit);

    // let rangevalues = JSON.parse(range._bodyInit).values;
  } catch (error) {
    console.log(error);
  }
}

export async function getVehicleSaleDate(VIN, allShipping) {
  // console.log(allShipping);

  // let data = await AsyncStorage.getItem("accessToken");
  // let accessToken = await JSON.parse(data);
  let saleDate = "nodata";
  let entryNumber = null;
  let rowNum = 0;
  let loadList = [];
  let repairNote = null;
  // console.log("getvehiclesaledate");

  try {
    let rangevalues = allShipping.values;

    rangevalues.forEach((row, index) => {
      if (row[3] != undefined && row[3].toLowerCase() == VIN.toLowerCase()) {
        saleDate = row[30];
        entryNumber = row[15] == "" ? null : row[15];
        rowNum = index + 2;
        repairNote = row[28] == "" ? null : row[28];
      }
    });
    if (entryNumber) {
      for (let row of rangevalues) {
        if (row[15] != undefined && row[15].toLowerCase() == entryNumber) {
          loadList.push([
            row[26],
            row[0],
            row[1],
            row[2],
            row[7],
            row[3],
            row[28]
          ]);
        }
      }
    }
    return { saleDate, entryNumber, loadList, rowNum, repairNote };
  } catch (e) {
    console.log(e);
  }
}

export async function getLoad(entryNumber) {
  let data = await AsyncStorage.getItem("accessToken");
  let accessToken = await JSON.parse(data);

  try {
    let range = await fetch(
      "https://docs.google.com/a/google.com/spreadsheets/d/" +
        shippingID +
        "/gviz/tq?tq=" +
        "select%20*%20where%20Q%20%3D%20%27" +
        entryNumber +
        "%27&gid=893587109",
      {
        method: "GET",
        headers: { Authorization: "Bearer " + accessToken }
      }
    );
    let rangevalues = range._bodyInit;
  } catch (e) {
    console.log(e);
  }
}

export async function getVehicleDataFromShipping(VIN) {
  let data = await AsyncStorage.getItem("accessToken");
  let accessToken = await JSON.parse(data);

  try {
    let range = await fetch(
      "https://docs.google.com/a/google.com/spreadsheets/d/" +
        shippingID +
        "/gviz/tq?tq=" +
        "select%20*%20where%20E%20%3D%20%27" +
        VIN +
        "%27&gid=893587109&tqx=out:html",
      {
        method: "GET",
        headers: { Authorization: "Bearer " + accessToken }
      }
    );
    // console.log("range", range);
    rangevalues = await range.json();
    let DomParser = require("react-native-html-parser").DOMParser;
    let doc = new DomParser().parseFromString(rangevalues, "text/html");

    // console.log(doc.getElementsByTagName("td"));
  } catch (e) {
    console.log(e);
  }
}

export async function getVehicleInfo(vinSearch) {
  let data = await AsyncStorage.getItem("accessToken");
  let accessToken = await JSON.parse(data);

  let range = await fetch(
    "https://sheets.googleapis.com/v4/spreadsheets/" +
      barcodeID +
      "/values/VehicleDetails!D1%3AD?dateTimeRenderOption=FORMATTED_STRING&majorDimension=ROWS&valueRenderOption=FORMATTED_VALUE&fields=values&key=" +
      apiKEY,
    {
      method: "GET",
      headers: { Authorization: "Bearer " + accessToken }
    }
  );
  let rangeJson = await range.json();
  rangevalues = rangeJson.values;
  let rowNum = 1;
  let vehicleInformation = "";
  for (let row of rangevalues) {
    //  console.log("vinmatch", row);
    if (row[0].toLowerCase() == vinSearch.toLowerCase()) {
      vehicleInformation = await fetch(
        "https://sheets.googleapis.com/v4/spreadsheets/" +
          barcodeID +
          "/values/VehicleDetails!A" +
          rowNum +
          "%3AAX" +
          rowNum +
          "?dateTimeRenderOption=FORMATTED_STRING&majorDimension=ROWS&valueRenderOption=FORMATTED_VALUE&fields=values&key=" +
          apiKEY,
        {
          method: "GET",
          headers: { Authorization: "Bearer " + accessToken }
        }
      );
      //console.log("vehicleinformation", vehicleInformation);
      return vehicleInformation.json();
    }
    rowNum++;
  }
}
export async function getDriveFolderContents(accessToken, folderId) {
  let response = await fetch(
    "https://www.googleapis.com/drive/v2/files?q=" + folderId + "+in+parents",
    {
      method: "GET",
      headers: {
        Authorization: "Bearer " + accessToken,
        "Content-Type": "application/json; charset=UTF-8"
      }
    }
  );
  if (response.status != 200) {
    console.log("getDriveFolderContents not 200", response);
  }
}

export async function uploadToDrive(
  accessToken,
  parentFolderID,
  fileName,
  filedata
) {
  try {
    let boundaryString = "foo_bar_baz";
    const metaData = {
      name: fileName,
      parents: [parentFolderID],
      mimeType: "image/jpeg"
    };

    //  let body = filedata;
    //console.log(body);
    const multipartBody =
      `\r\n--${boundaryString}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n` +
      `${JSON.stringify(metaData)}\r\n` +
      `--${boundaryString}\r\nContent-Type: image/jpeg\r\nContent-Transfer-Encoding: base64\r\n\r\n` +
      `${filedata}\r\n` +
      `--${boundaryString}--`;

    let response = await fetch(
      "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",

      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + accessToken,
          "Content-Type": "multipart/related; boundary=foo_bar_baz",
          "Content-Length": multipartBody.length
        },

        body: multipartBody
      }
    );
    //  console.log(response);
    if (response.status != 200) {
      console.log("uploadToDrive not 200", response);
    }
    // let id = JSON.parse(response._bodyInit).id;
    return response;
    //  console.log(response);
  } catch (error) {
    alert(error.message);
    console.log(error.message);
  }
}

export async function createDriveFolder(accessToken, folderName) {
  try {
    folderName = folderName.replace(new RegExp("_", "g"), " ");

    let data = JSON.stringify({
      name: folderName,
      parents: ["1vQaSR0uXA7u9nekzixaDzwRZukBZ_uFO"],
      mimeType: "application/vnd.google-apps.folder"
    });
    //  console.log("createfolder", data, accessToken);
    let response = await fetch(
      "https://www.googleapis.com/drive/v3/files",

      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + accessToken,
          "Content-Type": "application/json; charset=UTF-8"
        },

        body: data
      }
    );
    if (response.status != 200) {
      console.log("createDriveFolder response not 200", response);
      return null;
    }
    let responseJson = await response.json();
    let id = responseJson.id;

    //  console.log("createdrivefolderresponses", response);
    //    let id = await JSON.parse(response._bodyInit).id;
    //  console.log(id);
    return id;
    //  console.log(response);
  } catch (error) {
    console.log(error.message);
    return null;
  }
}

export async function createDrivePAFolder(accessToken, folderName) {
  try {
    folderName = folderName.replace(new RegExp("_", "g"), " ");

    let data = JSON.stringify({
      name: folderName,
      parents: ["1PjEapn4iFn9xKmkZRyOCH7z-tqh3Nc24"],
      mimeType: "application/vnd.google-apps.folder"
    });
    //  console.log("createfolder", data, accessToken);
    let response = await fetch(
      "https://www.googleapis.com/drive/v3/files",

      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + accessToken,
          "Content-Type": "application/json; charset=UTF-8"
        },

        body: data
      }
    );
    if (response.status != 200) {
      console.log("createDriveFolder response not 200", response);
      return null;
    }
    let responseJson = await response.json();
    let id = responseJson.id;

    //  console.log("createdrivefolderresponses", response);
    //    let id = await JSON.parse(response._bodyInit).id;
    //  console.log(id);
    return id;
    //  console.log(response);
  } catch (error) {
    console.log(error.message);
    return null;
  }
}

export async function findAdesaVin(vin) {
  const ADESAURL =
    "https://amg.adesa.com/amgsearch/api/rest/1.0-transaction/purchase.json?facets=locIdNamef&facets=buyerIdName&plId=29&userId=334087&orgId=245725&vin=" +
    vin +
    "&st=0&sz=25&&";
  let response = await fetch(ADESAURL, {
    method: "GET",
    headers: {
      Referer:
        "https://buy.adesa.ca/openauctionca/myPurchaseReport.html?gaVersion=2&gaFromPage=home&gaFromPageEle=commonheader_openlanepurchases&gaOrgId=245725",
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36"
    }
  });

  console.log(response);
}
