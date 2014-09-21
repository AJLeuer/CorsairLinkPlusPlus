/**
 * CorsairLinkPlusPlus
 * Copyright (c) 2014, Mark Dietzer & Simon Schick, All rights reserved.
 *
 * CorsairLinkPlusPlus is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3.0 of the License, or (at your option) any later version.
 *
 * CorsairLinkPlusPlus is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with CorsairLinkPlusPlus.
 */
"use strict";

function xmlHTTPPromise(url) {
	return new Promise(function(resolve, reject) {
		var req = new XMLHttpRequest();
		req.open("GET", url);
		req.responseType = "json";
		req.addEventListener("readystatechange", function(event) {
			if(this.readyState === XMLHttpRequest.DONE && this.status === 200 && this.response.success === true) {
				resolve(this.response);
			} else if(this.status !== 200) {
			    var err = new Error("Request failed");
			    err.code = this.status;
				reject(err);
			}
		});
		req.timeout = 2000;
		req.addEventListener("timeout", function() {
		    reject(new Error("Request timed out"));
		})
		req.send();
	})
}
 
function recurseDeviceRequest(path, obj) {
	return xmlHTTPPromise(path).then(function(data) {
		var childPaths = data.result.ChildrenPaths;

		if (childPaths.length > 0) {
            delete data.result.ChildrenPaths;
            return Promise.all(childPaths.map(function(val) {
                return recurseDeviceRequest(val);
            })).then(function(objects) {
                data.result.Children = objects;
                return data.result;
            }, function(rejectValue) {
                if(rejectValue instanceof Error)
                    throw rejectValue;
                var err = new Error("Failed to promise all");
                err.value = rejectValue;
                throw err;
            })
        }
        delete data.result.ChildrenPaths;
        return data.result;
	}, function(code) {
		throw new Error("failed with code " + code);
	});
}

console.time("loadInit");
console.time("load");
recurseDeviceRequest("http://192.168.88.221:38012").then(function(tree) {
    console.timeEnd("load");
    console.log(tree);
    console.log("done");
    console.log(JSON.stringify(tree, null, "\t"));
}, function(err) {
    console.log(err);
});
console.timeEnd("loadInit");