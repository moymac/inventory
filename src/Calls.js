const mainURL = "";
const apiKEY = "AIzaSyB_e7LpjDy5Nopf3DRrs1endVkQJ3lTCv4";
import { Alert, AsyncStorage } from "react-native";
import Expo from "expo";

export async function signInWithGoogleAsync() {
  try {
    const result = await Expo.Google.logInAsync({
      androidClientId:
        "544692012409-panp8ak109jkqp46h8ju0vb0b9omnbnd.apps.googleusercontent.com",
      iosClientId:
        "544692012409-8cafh0jufk41bf4a10ht39fe4qrg6app.apps.googleusercontent.com",
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

export async function getUserTyxpe(userName) {
  try {
    let response = await fetch(
      mainURL + "/?username=" + userName,
      (method: "GET")
    );
    let responseJson = await response.json();
    return responseJson;
  } catch (error) {
    console.error(error);
  }
}

export async function appendToSheet(accessToken, sheetName, valueArray) {
  //  console.log("appendcall", accessToken, sheetName, valueArray);
  //  accessToken = signInWithGoogleAsync();
  try {
    let data = JSON.stringify({
      values: [valueArray]
    });
    console.log(data);
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
  console.log("updatevalues", accessToken, sheetName, searchValue, valueArray);
  let data = JSON.stringify({
    values: [valueArray]
  });
  let range = await fetch(
    "https://sheets.googleapis.com/v4/spreadsheets/1AujvrsRW7vxqFCO2a0ozvF_3QQIEU32yyTI51ccXLTU/values/" +
      sheetName +
      "!A2%3AA?dateTimeRenderOption=FORMATTED_STRING&majorDimension=ROWS&valueRenderOption=FORMATTED_VALUE&fields=values&key=" +
      apiKEY
  );
  rangevalues = JSON.parse(range._bodyInit).values;
  let i = 2;
  let replaceRow = 0;
  for (let row of rangevalues) {
    let response;
    console.log("foundupdateRow", row[0].toLowerCase());
    if (row[0].toLowerCase() == searchValue.toLowerCase()) {
      replaceRow = i;
    }
    i = i + 1;
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
  console.log(response);
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
