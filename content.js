var adsClicked = false;
var adSelector = "div[data-testid=placementTracking]";
var trendSelector = "div[data-testid=trend]";
var userSelector = "div[data-testid=UserCell]";
var articleSelector = "article[data-testid=tweet]";
var link = ''

var adsLinkNow = ''

var addScrolledEvent = false;
var doneMissionScrollAds = false;

var sponsoredSvgPath = 'M20.75 2H3.25C2.007 2 1 3.007 1 4.25v15.5C1 20.993 2.007 22 3.25 22h17.5c1.243 0 2.25-1.007 2.25-2.25V4.25C23 3.007 21.993 2 20.75 2zM17.5 13.504c0 .483-.392.875-.875.875s-.875-.393-.875-.876V9.967l-7.547 7.546c-.17.17-.395.256-.62.256s-.447-.086-.618-.257c-.342-.342-.342-.896 0-1.237l7.547-7.547h-3.54c-.482 0-.874-.393-.874-.876s.392-.875.875-.875h5.65c.483 0 .875.39.875.874v5.65z';
var sponsoredBySvgPath = 'M19.498 3h-15c-1.381 0-2.5 1.12-2.5 2.5v13c0 1.38 1.119 2.5 2.5 2.5h15c1.381 0 2.5-1.12 2.5-2.5v-13c0-1.38-1.119-2.5-2.5-2.5zm-3.502 12h-2v-3.59l-5.293 5.3-1.414-1.42L12.581 10H8.996V8h7v7z';
var youMightLikeSvgPath = 'M12 1.75c-5.11 0-9.25 4.14-9.25 9.25 0 4.77 3.61 8.7 8.25 9.2v2.96l1.15-.17c1.88-.29 4.11-1.56 5.87-3.5 1.79-1.96 3.17-4.69 3.23-7.97.09-5.54-4.14-9.77-9.25-9.77zM13 14H9v-2h4v2zm2-4H9V8h6v2z';
var adsSvgPath = 'M19.498 3h-15c-1.381 0-2.5 1.12-2.5 2.5v13c0 1.38 1.119 2.5 2.5 2.5h15c1.381 0 2.5-1.12 2.5-2.5v-13c0-1.38-1.119-2.5-2.5-2.5zm-3.502 12h-2v-3.59l-5.293 5.3-1.414-1.42L12.581 10H8.996V8h7v7z';
var peopleFollowSvgPath = 'M17.863 13.44c1.477 1.58 2.366 3.8 2.632 6.46l.11 1.1H3.395l.11-1.1c.266-2.66 1.155-4.88 2.632-6.46C7.627 11.85 9.648 11 12 11s4.373.85 5.863 2.44zM12 2C9.791 2 8 3.79 8 6s1.791 4 4 4 4-1.79 4-4-1.791-4-4-4z';
var xAd = '>Ad<'; // TODO: add more languages; appears to only be used for English accounts as of 2023-08-03
var removePeopleToFollow = false; // set to 'true' if you want these suggestions removed, however note this also deletes some tweet replies
const promotedTweetTextSet = new Set(['Promoted Tweet', 'プロモツイート']);

var adsClickCount = 0;

function getAds() {
  return Array.from(document.querySelectorAll('div')).filter(function (el) {
    var filteredAd;

    if (el.innerHTML.includes(sponsoredSvgPath)) {
      filteredAd = el;
    } else if (el.innerHTML.includes(sponsoredBySvgPath)) {
      filteredAd = el;
    } else if (el.innerHTML.includes(youMightLikeSvgPath)) {
      filteredAd = el;
    } else if (el.innerHTML.includes(adsSvgPath)) {
      filteredAd = el;
    } else if (removePeopleToFollow && el.innerHTML.includes(peopleFollowSvgPath)) {
      filteredAd = el;
    } else if (el.innerHTML.includes(xAd)) {
      filteredAd = el;
    } else if (promotedTweetTextSet.has(el.innerText)) { // TODO: bring back multi-lingual support from git history
      filteredAd = el;
    }

    return filteredAd;
  })
}

function hideAd(ad) {
  let el = undefined
  if (ad.closest(adSelector) !== null) { // Promoted tweets
    el = ad.closest(adSelector)
  } else if (ad.closest(trendSelector) !== null) {
    el = ad.closest(trendSelector)
  } else if (ad.closest(userSelector) !== null) {
    el = ad.closest(userSelector)
  } else if (ad.closest(articleSelector) !== null) {
    el = ad.closest(articleSelector)
  } else if (promotedTweetTextSet.has(ad.innerText)) {
    el = ad
  }

  if (el) {
    // if (!adsClicked) {
    const imgs = el.querySelectorAll('img')

    const targetElement = imgs[imgs.length - 1]

    if (targetElement) {
      let parent = targetElement.parentElement;

      while (parent && parent.tagName !== 'A') {
        parent = parent.parentElement;
      }

      if (parent && parent.tagName === 'A') {
        // if (!adsClicked && !parent.href.includes('https://twitter.com')) {
        //   // setTimeout(() => {
        //   //   parent.click()
        //   // }, 5000)
        //   // link = window.location.href
        //   // adsClicked = true

        // }
        parent.removeEventListener("click", detectAds)

        if (!hasTwitterUsernameParam(parent.href)) {
          let baseUrl = parent.href;
          // Parse the existing URL
          let url = new URL(baseUrl);

          // Add the new parameter
          url.searchParams.append('x-username-xtool', getTwitterName());

          // Get the updated URL
          let updatedUrl = url.toString();

          parent.href = updatedUrl;
        }

        parent.addEventListener('click', detectAds)
      } else {
        // console.log("Don't found any ads");
      }
    } else {
      // console.log("Don't found any ads");
    }
    // }
  }

  // console.log('Twitter ads hidden: ', adsHidden.toString());
}

function hasTwitterUsernameParam(url) {
  let params = new URLSearchParams(url);
  return params.has('x-username-xtool');
}


function detectAds(e) {
  adsClickCount += 1
  adsLinkNow = e.currentTarget.href
  // console.log(`Number of ads that the user clicked: ${adsClickCount}
  // - Href ads: ${e.currentTarget.href}
  // `)
}

function isTwitter() {
  return window.location.href.includes('twitter.com')
}

function getTwitterName() {
  return window.location.pathname.split('/')[1]
}

function getAndHideAds() {
  // console.log(adsLinkNow)
  if (isTwitter()) {
    const arr = getAds()
    arr.forEach(hideAd)
    if (link != window.location.href) {
      link = window.location.href
      adsClickCount = 0
    }
  } else {
    if (hasTwitterUsernameParam(window.location.href)) {
      let twitterUsername = (new URLSearchParams(window.location.href)).get('x-username-xtool');
      function isUserAtBottom() {
        const scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
        const scrollHeight = (document.documentElement && document.documentElement.scrollHeight) || document.body.scrollHeight;
        const clientHeight = document.documentElement.clientHeight || window.innerHeight;

        return scrollHeight - scrollTop === clientHeight;
      }

      const body = document.querySelector("body")


      const htmlProgress = /*html*/`
        <div style="position: fixed; background-color: #fff; box-shadow: 0 0 3px #333; border-radius: 8px; padding: 8px 16px; top: 16px; left: 16px; z-index: 100000; display: flex; gap: 12px; align-items: center" id="progress-twitter-mission-xtool">
          <p style="color: #000; font-size: 16px; padding: 0; margin: 0;" class="in-progress-xtool">
          Cuộn đến cuối trang để hoàn thành nhiệm vụ
          </p>
          <p style="color: #000; font-size: 16px; padding: 0; margin: 0; display: none" class="done-mission-xtool">
            Nhiệm vụ hoàn thành
          </p>
          <img src="${chrome.runtime.getURL('img/tick-success.png')}" style="width: 0px; height: 0px;" class="img-tick-xtool" />
        </div>
      `

      if (!document.getElementById('progress-twitter-mission-xtool')) {
        body.insertAdjacentHTML('beforeend', htmlProgress);
      }

      function handleUserAtBottom() {
        if (isUserAtBottom() && !doneMissionScrollAds) {
          const progressTwitter = document.querySelector("#progress-twitter-mission-xtool")
          if (progressTwitter) {
            progressTwitter.querySelector(".in-progress-xtool").style.display = "none"
            progressTwitter.querySelector(".done-mission-xtool").style.display = "block"
            const tickIcon = progressTwitter.querySelector(".img-tick-xtool");
            tickIcon.style.width = '24px';
            tickIcon.style.height = '24px';
          }
          doneMissionScrollAds = true;
        }
      }
      handleUserAtBottom();
      if (!addScrolledEvent) {
        window.addEventListener('scroll', function () {
          handleUserAtBottom();
        });
        addScrolledEvent = true;
      }

      // Event listener for scrolling

    }
  }
}

// hide ads on page load
document.addEventListener('load', () => {
  getAndHideAds();

});

setInterval(() => {
  getAndHideAds()
}, 1000)


// oftentimes, tweets render after onload. LCP should catch them.
new PerformanceObserver((entryList) => {
  getAndHideAds();
}).observe({ type: 'largest-contentful-paint', buffered: true });

// re-check as user scrolls
// document.addEventListener('scroll', () => getAndHideAds());

// re-check as user scrolls tweet sidebar (exists when image is opened)
// var sidebarExists = setInterval(function () {
//   let timelines = document.querySelectorAll("[aria-label='Timeline: Conversation']");

//   if (timelines.length == 2) {
//     let tweetSidebar = document.querySelectorAll("[aria-label='Timeline: Conversation']")[0].parentElement.parentElement;
//     tweetSidebar.addEventListener('scroll', () => getAndHideAds());
//   }
// }, 500);
