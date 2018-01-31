const mainURL = "";

export async function getUserType(userName) {
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
