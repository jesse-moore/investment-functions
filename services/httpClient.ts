import { request, RequestOptions } from "https";
import { ParsedUrlQueryInput, stringify } from "querystring";

export class HttpClient {
  static get = <T>(url: string, options: RequestOptions): Promise<T> => {
    return new Promise<T>((resolve, reject) => {
      const req = request(url, options, (res) => {
        res.setEncoding("utf8");
        let responseBody = "";

        res.on("data", (chunk) => {
          responseBody += chunk;
        });

        res.on("end", () => {
          const data = JSON.parse(responseBody);
          resolve(data);
        });
      });

      req.on("error", (err) => {
        reject(err);
      });

      req.end();
    });
  };

  static postFormData = <T>(url: string, formData: ParsedUrlQueryInput): Promise<T> => {
    const formDataString = stringify(formData);
    const options: RequestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": Buffer.byteLength(formDataString),
      },
      timeout: 2000,
    };

    return new Promise((resolve, reject) => {
      const req = request(url, options, (res) => {
        res.setEncoding("utf8");
        let responseBody = "";

        res.on("data", (chunk) => {
          responseBody += chunk;
        });

        res.on("error", (err) => {
          reject(err);
        });

        res.on("end", () => {
          resolve(JSON.parse(responseBody));
        });
      });

      req.on("timeout", () => {
        reject();
      });

      req.on("error", (err) => {
        reject(err);
      });

      req.write(formDataString);
      req.end();
    });
  };

  static postBodyData = <T>(url: string, formData: ParsedUrlQueryInput): Promise<T> => {
    const body = JSON.stringify({
      title: "foo",
      body: "bar",
      userId: 1,
    });
    const options: RequestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/application/json; charset=UTF-8",
      },
      timeout: 2000,
    };

    return new Promise((resolve, reject) => {
      const req = request(url, options, (res) => {
        res.setEncoding("utf8");
        let responseBody = "";

        res.on("data", (chunk) => {
          responseBody += chunk;
        });

        res.on("close", () => {
          console.log("close");
        });

        res.on("error", (err) => {
          reject(err);
        });

        res.on("end", () => {
          resolve(JSON.parse(responseBody));
        });
      });

      req.on("timeout", () => {
        reject();
      });

      req.on("error", (err) => {
        reject(err);
      });

      req.write(body);
      req.end();
    });
  };
}
