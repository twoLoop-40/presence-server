function makeContent(content) {
  return ContentService.createTextOutput(content);
}

function changeContent(changeType, mimeType = ContentService.MimeType.JSON) {
  return contentMaker => content =>
    contentMaker(changeType(content)).setMimeType(mimeType);
}

//make JSON response with data
function makeJSONresponse({ ok, data }) {
  return changeContent(content =>
    JSON.stringify({ ok, data: content })
  )(makeContent)(data);
}
