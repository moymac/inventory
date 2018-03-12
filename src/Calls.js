const mainURL = "";
const apiKEY = "AIzaSyB_e7LpjDy5Nopf3DRrs1endVkQJ3lTCv4";
const apiDriveKEY = "AIzaSyAy9VVXHSpS2IJpptzYtGbLP3-3_l0aBk4";
const clientSecret = "81uIUeVHTS0SHgalp39kA6Cf";
const url = "https://www.googleapis.com/drive/v3";
const uploadUrl = "https://www.googleapis.com/upload/drive/v3";
const androidClientId =
  "544692012409-panp8ak109jkqp46h8ju0vb0b9omnbnd.apps.googleusercontent.com";
const iosClientId =
  "544692012409-8cafh0jufk41bf4a10ht39fe4qrg6app.apps.googleusercontent.com";
import { Alert, AsyncStorage, Platform } from "react-native";
import Expo from "expo";

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
    console.log("fetchresult", result);
    if (result.type === "success") {
      //AsyncStorage.setItem("accessToken", JSON.stringify(token));
      console.log("signtoken", result.accessToken);
      return result.accessToken;
    } else {
      return { cancelled: true };
    }
  } catch (e) {
    return { error: true };
  }
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
    if (response.status != 200) {
      console.log("refreshToken not 200", response);
    }
    let tokens = JSON.parse(response._bodyInit);
    //  console.log("refreshresponse", tokens.access_token);

    //tokens = await JSON.parse(response._bodyInit).values;
    //console.log("tokens.access_token", tokens.access_token);

    AsyncStorage.setItem("accessToken", JSON.stringify(tokens.access_token));
    return tokens.access_token;
  } catch (error) {
    console.error(error.message);
  }
}

export async function appendToSheet(accessToken, sheetName, valueArray) {
  //  console.log("appendcall", accessToken, sheetName, valueArray);
  //  accessToken = signInWithGoogleAsync();
  try {
    let data = JSON.stringify({
      values: [valueArray]
    });
    //  console.log("appendToSheet",data);
    let response = await fetch(
      "https://sheets.googleapis.com/v4/spreadsheets/1AujvrsRW7vxqFCO2a0ozvF_3QQIEU32yyTI51ccXLTU/values/" +
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
    //  console.log(response);
  } catch (error) {
    console.error(error.message);
  }
}

export async function updateSheet(
  accessToken,
  sheetName,
  searchValue,
  valueArray
) {
  //  console.log("updatevalues", accessToken, sheetName, searchValue, valueArray);
  let data = JSON.stringify({
    values: [valueArray]
  });
  let range = await fetch(
    "https://sheets.googleapis.com/v4/spreadsheets/1AujvrsRW7vxqFCO2a0ozvF_3QQIEU32yyTI51ccXLTU/values/" +
      sheetName +
      "!A2%3AA?dateTimeRenderOption=FORMATTED_STRING&majorDimension=ROWS&valueRenderOption=FORMATTED_VALUE&fields=values&key=" +
      apiKEY
  );
  if (range.status != 200) {
    console.log("updateSheet get array not 200", range);
  }
  rangevalues = await JSON.parse(range._bodyInit).values;
  //console.log("rangevalues", rangevalues);
  let i = 2;
  let replaceRow = 0;
  for (let row of rangevalues) {
    let response;
    //  console.log("foundupdateRow", row[0].toLowerCase());
    if (row[0].toLowerCase() == searchValue.toLowerCase()) {
      replaceRow = i;
    }
    i++;
  }
  if (replaceRow != 0) {
    response = await fetch(
      "https://sheets.googleapis.com/v4/spreadsheets/1AujvrsRW7vxqFCO2a0ozvF_3QQIEU32yyTI51ccXLTU/values/" +
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
      "https://sheets.googleapis.com/v4/spreadsheets/1AujvrsRW7vxqFCO2a0ozvF_3QQIEU32yyTI51ccXLTU/values/" +
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
  //  console.log(response);
}

export async function getUserType(userNameSearch) {
  let range = await fetch(
    "https://sheets.googleapis.com/v4/spreadsheets/1AujvrsRW7vxqFCO2a0ozvF_3QQIEU32yyTI51ccXLTU/values/Users!A2%3AB30?dateTimeRenderOption=FORMATTED_STRING&majorDimension=ROWS&valueRenderOption=FORMATTED_VALUE&fields=values&key=" +
      apiKEY
  );
  rangevalues = JSON.parse(range._bodyInit).values;
  for (let row of rangevalues) {
    console.log("rowvalue", row[0].toLowerCase());
    if (row[0].toLowerCase() == userNameSearch.toLowerCase()) return row[1];
  }
}

export async function getUserPermissions(userNameSearch) {
  let range = await fetch(
    "https://sheets.googleapis.com/v4/spreadsheets/1AujvrsRW7vxqFCO2a0ozvF_3QQIEU32yyTI51ccXLTU/values/UserPermissions!A2%3AM50?dateTimeRenderOption=FORMATTED_STRING&majorDimension=ROWS&valueRenderOption=FORMATTED_VALUE&fields=values&key=" +
      apiKEY
  );
  rangevalues = JSON.parse(range._bodyInit).values;
  for (let row of rangevalues) {
    console.log("rowvalue", row[0].toLowerCase());
    if (row[0].toLowerCase() == userNameSearch.toLowerCase()) return row;
  }
}

export async function getUserList() {
  let response = await fetch(
    "https://sheets.googleapis.com/v4/spreadsheets/1AujvrsRW7vxqFCO2a0ozvF_3QQIEU32yyTI51ccXLTU/values/Users!A2%3AB30?dateTimeRenderOption=FORMATTED_STRING&majorDimension=ROWS&valueRenderOption=FORMATTED_VALUE&fields=values&key=" +
      apiKEY
  );
  responseJson = await response.json();
  //  console.log(responseJson.values);
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
    "https://sheets.googleapis.com/v4/spreadsheets/1AujvrsRW7vxqFCO2a0ozvF_3QQIEU32yyTI51ccXLTU/values:batchUpdate",

    {
      method: "POST",
      headers: { Authorization: "Bearer " + accessToken },
      body: jsonbody
    }
  );
  //  console.log(await response.json());
}

export async function getUserPermissionList() {
  let response = await fetch(
    "https://sheets.googleapis.com/v4/spreadsheets/1AujvrsRW7vxqFCO2a0ozvF_3QQIEU32yyTI51ccXLTU/values/UserPermissions!A1%3AM30?dateTimeRenderOption=FORMATTED_STRING&majorDimension=ROWS&valueRenderOption=FORMATTED_VALUE&fields=values&key=" +
      apiKEY
  );
  responseJson = await response.json();
  //  console.log(responseJson.values);
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
    "https://sheets.googleapis.com/v4/spreadsheets/1AujvrsRW7vxqFCO2a0ozvF_3QQIEU32yyTI51ccXLTU/values:batchUpdate",

    {
      method: "POST",
      headers: { Authorization: "Bearer " + accessToken },
      body: jsonbody
    }
  );
  //  console.log(await response.json());
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
    "https://sheets.googleapis.com/v4/spreadsheets/1AujvrsRW7vxqFCO2a0ozvF_3QQIEU32yyTI51ccXLTU/values:batchUpdate",

    {
      method: "POST",
      headers: { Authorization: "Bearer " + accessToken },
      body: jsonbody
    }
  );
  console.log(await response.json());
}

export async function getVehicleInfo(vinSearch) {
  let range = await fetch(
    "https://sheets.googleapis.com/v4/spreadsheets/1AujvrsRW7vxqFCO2a0ozvF_3QQIEU32yyTI51ccXLTU/values/VehicleDetails!D1%3AD?dateTimeRenderOption=FORMATTED_STRING&majorDimension=ROWS&valueRenderOption=FORMATTED_VALUE&fields=values&key=" +
      apiKEY
  );
  rangevalues = JSON.parse(range._bodyInit).values;
  let rowNum = 1;
  let vehicleInformation = "";
  for (let row of rangevalues) {
    //  console.log("vinmatch", row);
    if (row[0].toLowerCase() == vinSearch.toLowerCase()) {
      vehicleInformation = await fetch(
        "https://sheets.googleapis.com/v4/spreadsheets/1AujvrsRW7vxqFCO2a0ozvF_3QQIEU32yyTI51ccXLTU/values/VehicleDetails!A" +
          rowNum +
          "%3AAX" +
          rowNum +
          "?dateTimeRenderOption=FORMATTED_STRING&majorDimension=ROWS&valueRenderOption=FORMATTED_VALUE&fields=values&key=" +
          apiKEY
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
      console.log(response);
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
    let responseJson = await response.json();
    let id = responseJson.id;
    if (response.status != 200) {
      console.log("idresponse.json", response);
    }
    //  console.log("createdrivefolderresponses", response);
    //    let id = await JSON.parse(response._bodyInit).id;
    //  console.log(id);
    return id;
    //  console.log(response);
  } catch (error) {
    console.log(error.message);
  }
}
