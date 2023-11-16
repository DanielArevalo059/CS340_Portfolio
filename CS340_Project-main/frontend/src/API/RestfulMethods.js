const BaseUrl = "http://localhost:5000";
const contentTypeBody = {
  "Content-Type": "application/json",
};

export const Get = async (url) => {
  const response = await fetch(BaseUrl + url, { method: "GET" });
  return handleResponse(response);
};

export const Put = async (url, body) => {
  const response = await fetch(BaseUrl + url, {
    method: "PUT",
    headers: body ? contentTypeBody : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  return handleResponse(response);
};

export const Post = async (url, body) => {
  const response = await fetch(BaseUrl + url, {
    method: "POST",
    headers: body ? contentTypeBody : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  return handleResponse(response);
};

export const Delete = async (url, body) => {
  const response = await fetch(BaseUrl + url, {
    method: "DELETE",
    headers: body ? contentTypeBody : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  return handleResponse(response);
};

const handleResponse = async (response) => {
  const isError = response.status >= 400;
  const text = await response.text();

  // Handle string
  if (!text.startsWith("[") && !text.startsWith("{")) {
    if (isError) throw text;
    return text;
  }

  // Handle Json objects
  const parsedText = text ? await JSON.parse(text) : undefined;
  if (isError) throw parsedText?.message ?? parsedText?.toString() ?? "Unknown error occured";
  return parsedText;
};
