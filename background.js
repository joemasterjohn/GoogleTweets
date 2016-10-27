// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

var oauth = ChromeExOAuth.initBackgroundPage({
  'request_url' : 'https://api.twitter.com/oauth/request_token',
  'authorize_url' : 'https://api.twitter.com/oauth/authorize',
  'access_url' : 'https://api.twitter.com/oauth/access_token',
  'consumer_key' : 'UZzsdMiiO6h5WhOV5DHBwu0Ml',
  'consumer_secret' : 'rnmN0IYeE4ZQrD5sahdzWNJM03smXy4yckLcnDLZCtceH8yolF',
  'app_name' : 'Google Tweets'
  
});

var authorized = false;

var on = false;

function setIcon() {
   if (on) {
     chrome.browserAction.setIcon({ 'path' : 'img/icon-19-on.png'});
   } else {
     chrome.browserAction.setIcon({ 'path' : 'img/icon-19-off.png'});
   }
};


function getTwitterAuth() {
  if(!authorized) {
    oauth.authorize(function(token, secret) {
      authorized = true;
      on = true;
      setIcon();
    });
  } else {
    on = !on;
  }

  setIcon();
};

function logout() {
  oauth.clearTokens();
  authorized = false;
  on = false;
  setIcon();
};

chrome.contextMenus.removeAll();
chrome.contextMenus.create({
	title: "logout",
	contexts: ["browser_action"],
	onclick: logout
});

chrome.browserAction.onClicked.addListener(getTwitterAuth);

chrome.webRequest.onBeforeRequest.addListener(
  function(info) {

    var url = new URL(info.url);
    var search = url.searchParams.get("q");

    if(search && authorized && on) {
      Twitter.update(search);
      console.log("search string: " + search);
    }

    // Redirect the lolcal request to a random loldog URL.
  },
  // filters
  {
    urls: [
      "*://*.google.com/search*"
    ]
  },
  // extraInfoSpec
  ["blocking"]);

