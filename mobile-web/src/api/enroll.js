import service from "../utils/request.js";

export function addEnroll(data) {
  return service.request({
    url: "/addEnroll",
    method: "post",
    data,
  });
}
